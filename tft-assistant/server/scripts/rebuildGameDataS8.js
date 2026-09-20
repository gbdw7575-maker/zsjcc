/**
 * 一键重建脚本：从 Riot Data Dragon (13.1.1 = S8 怪兽入侵) 拉取全部弈子/羁绊/装备数据
 * 输出到 src/data/gameData.js，包含 Data Dragon CDN 在线图标
 *
 * 用法：node server/scripts/rebuildGameDataS8.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'https://ddragon.leagueoflegends.com/cdn/13.1.1'

// ============ 从本地 synergiesData.js 提取羁绊等级效果 ============
const SYNERGY_EFFECTS = {
  '精英战士':    { levels: [{ count: 1, effect: '处决低于 15% 生命值的敌人' }, { count: 4, effect: '处决低于 30% 生命值的敌人' }], color: '#FFD700', type: 'trait' },
  'AI程序':      { levels: [{ count: 2, effect: '每 5 秒为友军提供增益' }, { count: 4, effect: '增益效果翻倍' }], color: '#00BFFF', type: 'trait' },
  '幻灵战队':    { levels: [{ count: 3, effect: '击杀敌人后获得 5 攻击力和法强' }, { count: 5, effect: '获得 10 攻击力和法强' }, { count: 7, effect: '获得 20 攻击力和法强' }], color: '#FF69B4', type: 'trait' },
  '战斗机甲':    { levels: [{ count: 3, effect: '至尊机甲获得额外生命值和攻击力' }, { count: 5, effect: '至尊机甲强度大幅提升' }], color: '#FF4500', type: 'trait' },
  '气象主播':    { levels: [{ count: 1, effect: '提供群体护盾或伤害' }], color: '#87CEEB', type: 'trait' },
  '小天才':      { levels: [{ count: 3, effect: '每携带一件装备获得减伤和增伤' }, { count: 5, effect: '减伤和增伤效果翻倍' }], color: '#FFA500', type: 'trait' },
  '黑客':        { levels: [{ count: 2, effect: '召唤赫卡里姆骑马冲入敌方后排' }, { count: 3, effect: '赫卡里姆获得额外属性' }, { count: 4, effect: '赫卡里姆最高属性提升' }], color: '#8B00FF', type: 'trait' },
  '爱心使者':    { levels: [{ count: 2, effect: '释放技能后提升友军法术强度' }, { count: 4, effect: '法术强度提升更多' }, { count: 6, effect: '释放技能后额外提供攻速' }], color: '#FF1493', type: 'trait' },
  '灵能使':      { levels: [{ count: 2, effect: '获得额外法术强度' }, { count: 4, effect: '法术强度大幅提升' }, { count: 6, effect: '技能可暴击' }], color: '#9932CC', type: 'trait' },
  '吉祥物':      { levels: [{ count: 2, effect: '每 2 秒回复最大生命值' }, { count: 4, effect: '回复量增加' }, { count: 6, effect: '回复量大幅增加' }], color: '#32CD32', type: 'trait' },
  '福牛守护者':  { levels: [{ count: 2, effect: '获得攻速加成' }, { count: 4, effect: '攻速加成提升' }, { count: 6, effect: '获得额外攻击力' }], color: '#FF6347', type: 'trait' },
  '淘气包':      { levels: [{ count: 2, effect: '生命值低于50%时生成诱饵' }, { count: 3, effect: '诱饵爆炸造成魔法伤害' }], color: '#FFB6C1', type: 'trait' },
  '情报特工':    { levels: [{ count: 2, effect: '获得额外暴击率' }, { count: 3, effect: '暴击可造成额外伤害' }, { count: 4, effect: '技能可暴击且暴击率大幅提升' }], color: '#00CED1', type: 'trait' },
  '混沌战士':    { levels: [{ count: 2, effect: '伤害提升' }, { count: 3, effect: '获得额外伤害减免' }, { count: 5, effect: '属性大幅提升' }], color: '#8B0000', type: 'trait' },
  '源计划：激光特工': { levels: [{ count: 3, effect: '获得无人机协助战斗' }, { count: 5, effect: '无人机伤害提升' }, { count: 7, effect: '无人机造成范围伤害' }], color: '#4169E1', type: 'trait' },
  '星之守护者':  { levels: [{ count: 3, effect: '获得额外法力值' }, { count: 5, effect: '法力值获取更多' }, { count: 7, effect: '额外法强加成' }], color: '#FF69B4', type: 'trait' },
  '超级英雄':    { levels: [{ count: 3, effect: '提供额外伤害加成' }], color: '#FFD700', type: 'trait' },
  '怪兽':        { levels: [{ count: 1, effect: '无羁绊加成，但基础属性更高' }], color: '#800080', type: 'trait' },
  '地下魔盗团':  { levels: [{ count: 2, effect: '获得额外金币' }, { count: 3, effect: '每回合可免费刷新一次' }, { count: 5, effect: '额外金铲铲' }], color: '#4B0082', type: 'trait' },
  '枪神':        { levels: [{ count: 1, effect: '每第4次攻击造成额外物理伤害' }], color: '#B8860B', type: 'trait' },
  '平民英雄':    { levels: [{ count: 1, effect: '为周围友军提供攻速加成' }, { count: 2, effect: '攻速加成范围扩大' }, { count: 3, effect: '攻速加成效果更强' }], color: '#808080', type: 'trait' },
  '堕落使者':    { levels: [{ count: 1, effect: '牺牲友军获得永久加成' }], color: '#2F4F4F', type: 'trait' },
  // 职业
  '决斗大师':    { levels: [{ count: 2, effect: '每次攻击获得 6% 攻速' }, { count: 4, effect: '每次攻击获得 12% 攻速' }, { count: 6, effect: '每次攻击获得 20% 攻速' }, { count: 8, effect: '每次攻击获得 30% 攻速' }], color: '#FFD700', type: 'class' },
  '护卫':        { levels: [{ count: 2, effect: '获得额外护甲' }, { count: 4, effect: '获得额外魔抗' }, { count: 6, effect: '护甲和魔抗大幅提升' }], color: '#A0522D', type: 'class' },
  '枪手':        { levels: [{ count: 2, effect: '每第4次攻击发射额外弹幕' }, { count: 4, effect: '额外弹幕伤害提升' }], color: '#BDB76B', type: 'class' },
  '斗士':        { levels: [{ count: 2, effect: '获得额外生命值' }, { count: 4, effect: '生命值加成提升' }, { count: 6, effect: '生命值大幅提升' }, { count: 8, effect: '生命值极大提升' }], color: '#8B4513', type: 'class' },
  '秘术卫士':    { levels: [{ count: 2, effect: '全队获得额外魔抗' }, { count: 3, effect: '魔抗加成提升' }, { count: 4, effect: '魔抗大幅提升' }], color: '#9370DB', type: 'class' },
}

// S8 英雄英文名到中文名的映射（Data Dragon → 本地）
const CHAMPION_NAMES = {
  'TFT8_AurelionSol': '奥瑞利安 · 索尔', 'TFT8_Ashe': '艾希', 'TFT8_Alistar': '阿利斯塔',
  'TFT8_Aphelios': '厄斐琉斯', 'TFT8_Annie': '安妮', 'TFT8_Blitzcrank': '布里茨',
  'TFT8_BelVeth': '卑尔维斯', 'TFT8_Chogath': '科加斯', 'TFT8_Camille': '卡蜜尔',
  'TFT8_Draven': '德莱文', 'TFT8_Ezreal': '伊泽瑞尔', 'TFT8_Ekko': '艾克',
  'TFT8_Fiora': '菲奥娜', 'TFT8_Fiddlesticks': '费德提克', 'TFT8_Gangplank': '普朗克',
  'TFT8_Galio': '加里奥', 'TFT8_Jax': '贾克斯', 'TFT8_Jinx': '金克丝',
  'TFT8_Janna': '迦娜', 'TFT8_Kayle': '凯尔', 'TFT8_Kaisa': '卡莎',
  'TFT8_Lulu': '璐璐', 'TFT8_Lux': '拉克丝', 'TFT8_LeeSin': '李青',
  'TFT8_Leona': '蕾欧娜', 'TFT8_Leblanc': '乐芙兰', 'TFT8_MissFortune': '厄运小姐',
  'TFT8_Mordekaiser': '莫德凯撒', 'TFT8_Malphite': '墨菲特', 'TFT8_Nasus': '内瑟斯',
  'TFT8_Nilah': '尼菈', 'TFT8_Nunu': '努努和威朗普', 'TFT8_Poppy': '波比',
  'TFT8_Renekton': '雷克顿', 'TFT8_Rell': '芮尔', 'TFT8_Riven': '锐雯',
  'TFT8_Rammus': '拉莫斯', 'TFT8_Sivir': '希维尔', 'TFT8_Senna': '赛娜',
  'TFT8_Sett': '瑟提', 'TFT8_Syndra': '辛德拉', 'TFT8_Sylas': '塞拉斯',
  'TFT8_Sona': '娑娜', 'TFT8_Soraka': '索拉卡', 'TFT8_Sejuani': '瑟庄妮',
  'TFT8_Samira': '莎弥拉', 'TFT8_Taliyah': '塔莉垭', 'TFT8_Talon': '泰隆',
  'TFT8_Urgot': '厄加特', 'TFT8_Vi': '蔚', 'TFT8_Vayne': '薇恩',
  'TFT8_Viego': '佛耶戈', 'TFT8_Velkoz': '维克兹', 'TFT8_WuKong': '孙悟空',
  'TFT8_Yasuo': '亚索', 'TFT8_Yuumi': '悠米', 'TFT8_Zed': '劫',
  'TFT8_Zoe': '佐伊', 'TFT8_Zac': '扎克',
}

// 英雄到英文key的映射（用于生成 syn.in）
const CHINESE_TO_EN = {
  '奥瑞利安 · 索尔': 'AurelionSol', '艾希': 'Ashe', '阿利斯塔': 'Alistar',
  '厄斐琉斯': 'Aphelios', '安妮': 'Annie', '布里茨': 'Blitzcrank',
  '卑尔维斯': 'Belveth', '科加斯': 'Chogath', '卡蜜尔': 'Camille',
  '德莱文': 'Draven', '伊泽瑞尔': 'Ezreal', '艾克': 'Ekko',
  '菲奥娜': 'Fiora', '费德提克': 'Fiddlesticks', '普朗克': 'Gangplank',
  '加里奥': 'Galio', '贾克斯': 'Jax', '金克丝': 'Jinx',
  '迦娜': 'Janna', '凯尔': 'Kayle', '卡莎': 'Kaisa',
  '璐璐': 'Lulu', '拉克丝': 'Lux', '李青': 'LeeSin',
  '蕾欧娜': 'Leona', '乐芙兰': 'Leblanc', '厄运小姐': 'MissFortune',
  '莫德凯撒': 'Mordekaiser', '墨菲特': 'Malphite', '内瑟斯': 'Nasus',
  '尼菈': 'Nilah', '努努和威朗普': 'Nunu', '波比': 'Poppy',
  '雷克顿': 'Renekton', '芮尔': 'Rell', '锐雯': 'Riven',
  '拉莫斯': 'Rammus', '希维尔': 'Sivir', '赛娜': 'Senna',
  '瑟提': 'Sett', '辛德拉': 'Syndra', '塞拉斯': 'Sylas',
  '娑娜': 'Sona', '索拉卡': 'Soraka', '瑟庄妮': 'Sejuani',
  '莎弥拉': 'Samira', '塔莉垭': 'Taliyah', '泰隆': 'Talon',
  '厄加特': 'Urgot', '蔚': 'Vi', '薇恩': 'Vayne',
  '佛耶戈': 'Viego', '维克兹': 'Velkoz', '孙悟空': 'WuKong',
  '亚索': 'Yasuo', '悠米': 'Yuumi', '劫': 'Zed',
  '佐伊': 'Zoe', '扎克': 'Zac',
}

// ============ 第一阶段：并行拉取 Data Dragon 数据 ============
async function fetchAll() {
  const endpoints = [
    { key: 'champion', url: `${BASE}/data/zh_CN/tft-champion.json` },
    { key: 'trait',    url: `${BASE}/data/zh_CN/tft-trait.json` },
    { key: 'item',     url: `${BASE}/data/zh_CN/tft-item.json` },
  ]

  const results = await Promise.all(
    endpoints.map(async ({ key, url }) => {
      console.log(`  ⬇ 正在拉取 ${key}.json ...`)
      const res  = await fetch(url)
      const json = await res.json()
      console.log(`  ✅ ${key}.json 拉取成功 (${Object.keys(json.data).length} 条)`)
      return { key, json }
    })
  )

  return Object.fromEntries(results.map(r => [r.key, r.json]))
}

// ============ 第二阶段：构建英雄数据（含 Data Dragon 图标） ============
function buildHeroes(championJson) {
  const champions = Object.values(championJson.data).filter(c => c.id.startsWith('TFT8_'))
  const heroes  = []

  for (const c of champions) {
    const name  = CHAMPION_NAMES[c.id] || c.name
    const enKey = CHINESE_TO_EN[name] || c.name.replace(/[·\s]/g, '')
    const icon  = `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/tft-champion/${c.image.full}`

    heroes.push({
      name,
      en: enKey,
      cost: c.tier,
      tier: c.tier,
      synergies: [], // 后面第三步填充
      icon,
    })
  }

  // 按费数排序
  heroes.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name, 'zh'))
  return heroes
}

// ============ 第三阶段：构建羁绊数据 + 填充英雄羁绊映射 ============
function buildSynergies(traitJson, heroes) {
  const traits = Object.values(traitJson.data)
  const synergyList = []
  const nameToSynergyMap = {}

  for (const t of traits) {
    const ddName    = t.name
    // 在本地效果表中查找
    const localInfo = SYNERGY_EFFECTS[ddName]
    const icon      = `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/tft-trait/${t.image.full}`

    const syn = {
      name: ddName,
      type: localInfo?.type || 'trait',
      icon,
      effect: localInfo?.levels?.map(l => l.effect).join('；') || '',
      levels: localInfo?.levels || [],
      color: localInfo?.color || '#3b82f6',
    }
    synergyList.push(syn)
    nameToSynergyMap[ddName] = syn
  }

  // ======== 手动建立 S8 英雄→羁绊映射 ========
  const HERO_TRAITS_S8 = {
    '塞拉斯': ['爱心使者', '斗士'],
    '内瑟斯': ['幻灵战队', '护卫'],
    '金克丝': ['幻灵战队', '淘气包'],
    '薇恩': ['情报特工', '混沌战士', '决斗大师'],
    '锐雯': ['星之守护者', '护卫', '决斗大师'],
    '厄运小姐': ['幻灵战队', '精英战士'],
    '加里奥': ['平民英雄', '秘术卫士'],
    '希维尔': ['平民英雄', '枪手'],
    '迦娜': ['平民英雄', '气象主播', '灵能使'],
    '塔莉垭': ['星之守护者', '灵能使'],
    '拉克丝': ['星之守护者', '灵能使'],
    '尼菈': ['星之守护者', '决斗大师'],
    '卡莎': ['星之守护者', '情报特工'],
    '芮尔': ['星之守护者', '护卫'],
    '艾克': ['星之守护者', '淘气包', '秘术卫士'],
    '辛德拉': ['星之守护者', '爱心使者'],
    '瑟提': ['战斗机甲', '护卫'],
    '德莱文': ['战斗机甲', '精英战士'],
    '蕾欧娜': ['战斗机甲', '混沌战士', '秘术卫士'],
    '贾克斯': ['战斗机甲', '斗士'],
    '瑟庄妮': ['源计划：激光特工', '斗士'],
    '艾希': ['源计划：激光特工', '情报特工'],
    '赛娜': ['源计划：激光特工', '枪手'],
    '劫': ['源计划：激光特工', '决斗大师', '黑客'],
    '莫德凯撒': ['源计划：激光特工', '精英战士'],
    '安妮': ['小天才', '灵能使', '爱心使者'],
    '菲奥娜': ['小天才', '决斗大师'],
    '阿利斯塔': ['小天才', '秘术卫士'],
    '厄斐琉斯': ['小天才', '枪神', '枪手'],
    '佛耶戈': ['小天才', '混沌战士'],
    '凯尔': ['决斗大师', '地下魔盗团'],
    '蔚': ['斗士', '地下魔盗团'],
    '莎弥拉': ['枪手', '地下魔盗团'],
    '娑娜': ['爱心使者', '地下魔盗团', '灵能使'],
    '璐璐': ['小天才', '爱心使者', '黑客'],
    '佐伊': ['小天才', '淘气包', '黑客'],
    '努努和威朗普': ['小天才', '吉祥物'],
    '布里茨': ['AI程序', '护卫'],
    '卡蜜尔': ['AI程序', '混沌战士', '黑客'],
    '普朗克': ['超级英雄', '决斗大师'],
    '李青': ['超级英雄', '斗士', '爱心使者'],
    '墨菲特': ['超级英雄', '护卫', '吉祥物'],
    '维克兹': ['怪兽', '灵能使'],
    '科加斯': ['怪兽', '斗士'],
    '奥瑞利安 · 索尔': ['怪兽', '灵能使'],
    '拉莫斯': ['怪兽', '护卫'],
    '卑尔维斯': ['怪兽', '枪手'],
    '扎克': ['怪兽', '护卫'],
    '厄加特': ['怪兽', '枪神'],
    '费德提克': ['怪兽', '堕落使者'],
    '悠米': ['星之守护者', '吉祥物', '爱心使者'],
    '亚索': ['源计划：激光特工', '决斗大师'],
    '波比': ['小天才', '护卫'],
    '泰隆': ['混沌战士', '黑客'],
    '雷克顿': ['源计划：激光特工', '斗士'],
    '孙悟空': ['战斗机甲', '护卫'],
    '伊泽瑞尔': ['地下魔盗团', '情报特工'],
    '索拉卡': ['AI程序', '爱心使者'],
    '乐芙兰': ['AI程序', '黑客', '灵能使'],
  }

  for (const hero of heroes) {
    const traitsForHero = HERO_TRAITS_S8[hero.name] || []
    hero.synergies = traitsForHero
  }

  return { synergyList, nameToSynergyMap }
}

// ============ 第四阶段：构建装备数据 ============
function buildEquipment(itemJson) {
  // 只取基础装备和成品装备，过滤掉奥恩神器、光明装备、消耗品等
  const SKIP = ['_Empty', '_Shroud', 'ThiefsGloves_Empty', 'ForceOfNature',
    'Consumable', 'Spatula', 'Ornn', 'Radiant', 'Set5_', 'TFT4_', 'TFT5_',
    'TFTTutorial', 'Set8_']

  const items = Object.values(itemJson.data)
    .filter(item => {
      const id = item.id
      for (const skip of SKIP) if (id.includes(skip)) return false
      // 只保留标准的 TFT_Item_ 成品装备
      if (!item.id.startsWith('TFT_Item_')) return false
      return item.name && item.name !== '金铲铲冠冕' && item.name !== '金铲铲'
    })
    .map(item => ({
      name: item.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/tft-item/${item.image.full}`,
      type: 'base',
      stats: {},
      id: item.id,
    }))

  // 去重（同名为不同 ID 只保留一个）
  const seen = new Set()
  return items.filter(i => {
    if (seen.has(i.name)) return false
    seen.add(i.name)
    return true
  })
}

// ============ 主流程 ============
async function main() {
  console.log('🔧 开始重建 S8 怪兽入侵数据（来源: Riot Data Dragon 13.1.1）\n')

  // 1. 拉取数据
  const data = await fetchAll()

  // 2. 构建英雄
  console.log('\n🦸 构建英雄数据...')
  const heroes = buildHeroes(data.champion)
  console.log(`   ${heroes.length} 个英雄`)

  // 3. 构建羁绊 + 英雄羁绊映射
  console.log('\n🔗 构建羁绊数据...')
  const { synergyList } = buildSynergies(data.trait, heroes)
  console.log(`   ${synergyList.length} 个羁绊`)

  // 4. 构建装备
  console.log('\n⚔️ 构建装备数据...')
  const equipment = buildEquipment(data.item)
  console.log(`   ${equipment.length} 件装备`)

  // 5. 生成 gameData.js
  const lines = []
  lines.push('// 自动生成: ' + new Date().toISOString())
  lines.push('// 数据来源: Riot Data Dragon CDN 13.1.1 (S8 怪兽入侵)')
  lines.push('// 英雄羁绊映射: 手动校对')
  lines.push('')
  lines.push('const heroesData = ' + JSON.stringify(heroes, null, 2))
  lines.push('')
  lines.push('const synergyData = ' + JSON.stringify(synergyList, null, 2))
  lines.push('')
  lines.push('const equipmentData = ' + JSON.stringify(equipment, null, 2))
  lines.push('')
  lines.push('// ============ 热门阵容（本地维护） ============')
  lines.push('const metaTeams = [')
  lines.push("  { id: 1, name: '战斗机甲至尊', tier: 'S', avgPlace: 3.4, top4Rate: 65,")
  lines.push("    description: '以至尊战斗机甲为核心，叠加高费混沌战士和精英战士',")
  lines.push("    champions: ['孙悟空','德莱文','贾克斯','瑟提','蕾欧娜','菲奥娜','阿利斯塔','艾克'],")
  lines.push("    icon: '🤖' },")
  lines.push("  { id: 2, name: '小天才灵能', tier: 'S', avgPlace: 3.2, top4Rate: 68,")
  lines.push("    description: '小天才羁绊提供全能加成，搭配灵能使和爱心使者',")
  lines.push("    champions: ['波比','璐璐','安妮','阿利斯塔','佐伊','厄斐琉斯','努努和威朗普','辛德拉'],")
  lines.push("    icon: '🧒' },")
  lines.push("  { id: 3, name: '星守灵能', tier: 'A', avgPlace: 3.6, top4Rate: 62,")
  lines.push("    description: '8星守全员获得高额法力回复，持续施法',")
  lines.push("    champions: ['拉克丝','芮尔','悠米','尼菈','卡莎','锐雯','塔莉垭','艾克'],")
  lines.push("    icon: '⭐' },")
  lines.push("  { id: 4, name: '源计划激光特工', tier: 'A', avgPlace: 3.5, top4Rate: 63,")
  lines.push("    description: '无人机协助战斗，后期劫和莫德凯撒收割',")
  lines.push("    champions: ['雷克顿','艾希','亚索','赛娜','瑟庄妮','劫','莫德凯撒'],")
  lines.push("    icon: '🔫' },")
  lines.push("  { id: 5, name: '福牛决斗', tier: 'B', avgPlace: 3.8, top4Rate: 55,")
  lines.push("    description: '靠决斗大师攻速叠加强制清场',")
  lines.push("    champions: ['普朗克','凯尔','菲奥娜','薇恩','尼菈','亚索','劫'],")
  lines.push("    icon: '🐂' },")
  lines.push("  { id: 6, name: '幻灵淘气枪手', tier: 'B', avgPlace: 3.9, top4Rate: 52,")
  lines.push("    description: '金克丝和厄运小姐双核输出',")
  lines.push("    champions: ['内瑟斯','金克丝','赛娜','厄运小姐','艾克','金克丝'],")
  lines.push("    icon: '🐰' },")
  lines.push("  { id: 7, name: '怪兽军团', tier: 'A', avgPlace: 3.3, top4Rate: 66,")
  lines.push("    description: '怪兽英雄单卡强度极高，配合斗士和灵能使',")
  lines.push("    champions: ['拉莫斯','科加斯','维克兹','卑尔维斯','奥瑞利安 · 索尔','扎克','厄加特','费德提克'],")
  lines.push("    icon: '👾' },")
  lines.push("  { id: 8, name: '爱心使者', tier: 'C', avgPlace: 4.1, top4Rate: 48,")
  lines.push("    description: '持续叠加法强，辛德拉单核输出',")
  lines.push("    champions: ['璐璐','李青','悠米','娑娜','索拉卡','安妮','塞拉斯','辛德拉'],")
  lines.push("    icon: '💚' },")
  lines.push("  { id: 9, name: '地下魔盗团', tier: 'B', avgPlace: 3.7, top4Rate: 58,")
  lines.push("    description: '经济优势滚雪球，后期转高费',")
  lines.push("    champions: ['凯尔','伊泽瑞尔','蔚','娑娜','莎弥拉'],")
  lines.push("    icon: '💰' },")
  lines.push("  { id: 10, name: '黑客妖姬', tier: 'A', avgPlace: 3.1, top4Rate: 70,")
  lines.push("    description: '黑客切后排，乐芙兰+混沌战士爆发',")
  lines.push("    champions: ['卡蜜尔','乐芙兰','佐伊','泰隆','菲奥娜','薇恩','劫'],")
  lines.push("    icon: '💻' },")
  lines.push(']')
  lines.push('')
  lines.push('export { heroesData, synergyData, equipmentData, metaTeams }')

  const outputPath = path.resolve(__dirname, '../../src/data/gameData.js')
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')

  // 6. 输出摘要
  console.log('\n' + '='.repeat(60))
  console.log('✅ 重建完成！')
  console.log(`   输出文件: ${outputPath}`)
  console.log(`   英雄: ${heroes.length} 个 (含 Data Dragon 在线图标)`)
  console.log(`   羁绊: ${synergyList.length} 个 (含等级效果)`)
  console.log(`   装备: ${equipment.length} 件`)
  console.log(`   阵容: 10 个 (本地维护)`)
  console.log('')
  console.log('   ⚠️ 检查 hero.synergies 是否为 []：')
  const emptySyn = heroes.filter(h => h.synergies.length === 0)
  if (emptySyn.length > 0) {
    console.log(`   以下英雄缺少羁绊映射: ${emptySyn.map(h => h.name).join(', ')}`)
  } else {
    console.log('   所有英雄均有羁绊映射 ✅')
  }
}

main().catch(err => { console.error('❌ 错误:', err); process.exit(1) })
