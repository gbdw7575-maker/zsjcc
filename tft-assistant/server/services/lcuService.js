/**
 * LCU API 服务
 * 自动发现本地金铲铲客户端进程，提取连接凭证，并代理 API 请求
 */
import { exec } from 'child_process'
import https from 'https'
import { promisify } from 'util'

const execPromise = promisify(exec)

let cachedCredentials = null
let lastCheck = 0
const CACHE_TTL = 10000 // 10 秒缓存

/**
 * 从进程命令行中提取端口和认证 token
 * Windows 使用 PowerShell + Get-WmiObject 查找 LeagueClientUx.exe
 */
async function findClientCredentials() {
  const now = Date.now()
  if (cachedCredentials && now - lastCheck < CACHE_TTL) {
    return cachedCredentials
  }

  try {
    const cmd = `powershell -NoProfile -Command "Get-WmiObject Win32_Process -Filter 'name=\\'LeagueClientUx.exe\\'' | Select-Object -ExpandProperty CommandLine"`
    const { stdout } = await execPromise(cmd, { timeout: 5000 })

    if (!stdout.trim()) {
      return null
    }

    const portMatch = stdout.match(/--app-port=(\d+)/)
    const tokenMatch = stdout.match(/--remoting-auth-token=([^\s"]+)/)

    if (!portMatch || !tokenMatch) {
      return null
    }

    cachedCredentials = {
      port: portMatch[1],
      token: tokenMatch[1],
      baseUrl: `https://127.0.0.1:${portMatch[1]}`,
      auth: `riot:${tokenMatch[1]}`
    }
    lastCheck = now
    return cachedCredentials
  } catch {
    return null
  }
}

/**
 * 向 LCU 发送请求（自动处理自签名证书）
 * @param {string} method - GET / POST / PUT / DELETE
 * @param {string} path - API 路径，如 /lol-summoner/v1/current-summoner
 * @param {object} [body] - 可选请求体（JSON）
 * @returns {Promise<object>} 响应数据
 */
async function lcuRequest(method, path, body = null) {
  const creds = await findClientCredentials()
  if (!creds) {
    throw new Error('LCU_CLIENT_NOT_FOUND')
  }

  const auth = Buffer.from(creds.auth).toString('base64')

  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: creds.port,
      path,
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      rejectUnauthorized: false // 自签名证书
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          const result = data ? JSON.parse(data) : {}
          resolve({ status: res.statusCode, data: result })
        } catch {
          resolve({ status: res.statusCode, data: null })
        }
      })
    })

    req.on('error', (err) => {
      reject(new Error(`LCU 请求失败: ${err.message}`))
    })

    req.setTimeout(8000, () => {
      req.destroy()
      reject(new Error('LCU 请求超时'))
    })

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

/**
 * 检查客户端连接状态
 */
async function checkClientReady() {
  try {
    const creds = await findClientCredentials()
    if (!creds) return { connected: false, reason: '未检测到运行中的金铲铲客户端' }

    const { status } = await lcuRequest('GET', '/lol-summoner/v1/current-summoner')
    return { connected: status === 200, reason: status === 200 ? '' : '客户端未就绪' }
  } catch {
    return { connected: false, reason: '无法连接到客户端' }
  }
}

// --------------- TFT 数据获取 ---------------

/**
 * 获取当前召唤师信息（含 puuid）
 */
async function getCurrentSummoner() {
  const { data } = await lcuRequest('GET', '/lol-summoner/v1/current-summoner')
  return data
}

/**
 * 获取 TFT 对局历史
 * @param {string} puuid
 * @param {number} [begIndex=0]
 * @param {number} [endIndex=20]
 */
async function getTftMatchHistory(puuid, begIndex = 0, endIndex = 20) {
  const { data } = await lcuRequest(
    'GET',
    `/lol-match-history/v1/products/tft/${puuid}/matches?begIndex=${begIndex}&endIndex=${endIndex}`
  )
  return data?.games?.games || []
}

/**
 * 获取单场对局详细信息
 * @param {number} gameId
 */
async function getTftMatchDetail(gameId) {
  const { data } = await lcuRequest('GET', `/lol-match-history/v1/games/${gameId}`)
  return data
}

// --------------- 数据聚合分析 ---------------

/**
 * 获取 TFT 数据总览：对局列表 + 统计数据
 * @param {number} [count=20] 拉取场次
 */
async function getTftOverview(count = 20) {
  const summoner = await getCurrentSummoner()
  const games = await getTftMatchHistory(summoner.puuid, 0, count)

  if (!games || games.length === 0) {
    return {
      summoner: { name: summoner.displayName, level: summoner.summonerLevel },
      matches: [],
      stats: null
    }
  }

  // 开一局，可能不存在 gameId（比如刚进房间还没打完）
  const validGames = games.filter(g => g.gameId)

  // 计算统计数据
  const stats = calcStats(games)

  return {
    summoner: {
      name: summoner.displayName,
      level: summoner.summonerLevel,
      iconId: summoner.profileIconId
    },
    matches: validGames.slice(0, count),
    stats
  }
}

/**
 * 计算 TFT 战绩统计
 */
function calcStats(games) {
  const valid = games.filter(g => g.gameId)
  if (valid.length === 0) return null

  let wins = 0,
    top4s = 0,
    totalPlacement = 0,
    totalGameLength = 0

  const traitUsage = {} // 羁绊使用频率
  const championUsage = {} // 英雄使用频率

  valid.forEach((g) => {
    const rank = g.queueId === 0 ? 0 : g.stats?.playerSubteamPlace || 0
    const placement = g.queueId === 0 ? 0 : g.stats?.playerTeamPlacement || 0
    const outcome = g.stats?.outcome || ''

    if (outcome === 'win') wins++
    if (placement > 0 && placement <= 4) top4s++
    totalPlacement += placement
    totalGameLength += g.stats?.gameLength || 0

    // 收集羁绊数据（如果有 teamPlayerSubteamId）
    if (g.stats?.subteam) {
      const trait = g.stats.subteam
      traitUsage[trait] = (traitUsage[trait] || 0) + 1
    }

    // 英雄使用（在 json 正文中附加了 championName）
    if (g.championName) {
      championUsage[g.championName] = (championUsage[g.championName] || 0) + 1
    }
  })

  const count = valid.length

  return {
    totalGames: count,
    wins,
    top4s,
    winRate: count > 0 ? ((wins / count) * 100).toFixed(1) : 0,
    top4Rate: count > 0 ? ((top4s / count) * 100).toFixed(1) : 0,
    avgPlacement: count > 0 ? (totalPlacement / count).toFixed(1) : 0,
    avgGameLength: count > 0 ? Math.round(totalGameLength / count) : 0,
    topTraits: Object.entries(traitUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    topChampions: Object.entries(championUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }
}

export {
  findClientCredentials,
  checkClientReady,
  lcuRequest,
  getCurrentSummoner,
  getTftMatchHistory,
  getTftMatchDetail,
  getTftOverview
}
