// S8 怪兽入侵 卡池数据
// 卡池大小（每种英雄的总张数）
export const POOL_SIZE = { 1: 29, 2: 22, 3: 18, 4: 12, 5: 10 }

// 各等级刷新概率 (S8 标准)
export const ROLL_ODDS = {
  1:  { 1: 100, 2: 0,   3: 0,   4: 0,   5: 0 },
  2:  { 1: 100, 2: 0,   3: 0,   4: 0,   5: 0 },
  3:  { 1: 75,  2: 25,  3: 0,   4: 0,   5: 0 },
  4:  { 1: 55,  2: 30,  3: 15,  4: 0,   5: 0 },
  5:  { 1: 45,  2: 33,  3: 20,  4: 2,   5: 0 },
  6:  { 1: 25,  2: 40,  3: 30,  4: 5,   5: 0 },
  7:  { 1: 19,  2: 30,  3: 35,  4: 15,  5: 1 },
  8:  { 1: 16,  2: 20,  3: 35,  4: 22,  5: 7 },
  9:  { 1: 9,   2: 15,  3: 30,  4: 30,  5: 16 },
  10: { 1: 5,   2: 10,  3: 20,  4: 40,  5: 25 }
}

// 各费用英雄种类数
export const HERO_COUNT_BY_COST = { '1': 13, '2': 13, '3': 13, '4': 12, '5': 8 }

// S8 全部英雄（费用分组）
export const ALL_POOL_HEROES = [
  // ======= 1 费 (13种) =======
  { name: '艾希',          en: 'Ashe',       cost: 1, tier: 1 },
  { name: '布里茨',        en: 'Blitzcrank', cost: 1, tier: 1 },
  { name: '普朗克',        en: 'Gangplank',  cost: 1, tier: 1 },
  { name: '凯尔',          en: 'Kayle',      cost: 1, tier: 1 },
  { name: '璐璐',          en: 'Lulu',       cost: 1, tier: 1 },
  { name: '拉克丝',        en: 'Lux',        cost: 1, tier: 1 },
  { name: '墨菲特',        en: 'Malphite',   cost: 1, tier: 1 },
  { name: '内瑟斯',        en: 'Nasus',      cost: 1, tier: 1 },
  { name: '波比',          en: 'Poppy',      cost: 1, tier: 1 },
  { name: '雷克顿',        en: 'Renekton',   cost: 1, tier: 1 },
  { name: '塞拉斯',        en: 'Sylas',      cost: 1, tier: 1 },
  { name: '希维尔',        en: 'Sivir',      cost: 1, tier: 1 },
  { name: '孙悟空',        en: 'WuKong',     cost: 1, tier: 1 },

  // ======= 2 费 (13种) =======
  { name: '安妮',          en: 'Annie',      cost: 2, tier: 2 },
  { name: '卡蜜尔',        en: 'Camille',    cost: 2, tier: 2 },
  { name: '德莱文',        en: 'Draven',     cost: 2, tier: 2 },
  { name: '伊泽瑞尔',      en: 'Ezreal',     cost: 2, tier: 2 },
  { name: '菲奥娜',        en: 'Fiora',      cost: 2, tier: 2 },
  { name: '金克丝',        en: 'Jinx',       cost: 2, tier: 2 },
  { name: '李青',          en: 'LeeSin',     cost: 2, tier: 2 },
  { name: '芮尔',          en: 'Rell',       cost: 2, tier: 2 },
  { name: '悠米',          en: 'Yuumi',      cost: 2, tier: 2 },
  { name: '蔚',            en: 'Vi',         cost: 2, tier: 2 },
  { name: '亚索',          en: 'Yasuo',      cost: 2, tier: 2 },
  { name: '泰隆',          en: 'Talon',      cost: 2, tier: 2 },
  { name: '乐芙兰',        en: 'Leblanc',    cost: 2, tier: 2 },

  // ======= 3 费 (13种) =======
  { name: '阿利斯塔',      en: 'Alistar',    cost: 3, tier: 3 },
  { name: '科加斯',        en: 'Chogath',    cost: 3, tier: 3 },
  { name: '贾克斯',        en: 'Jax',        cost: 3, tier: 3 },
  { name: '卡莎',          en: 'Kaisa',      cost: 3, tier: 3 },
  { name: '尼菈',          en: 'Nilah',      cost: 3, tier: 3 },
  { name: '拉莫斯',        en: 'Rammus',     cost: 3, tier: 3 },
  { name: '锐雯',          en: 'Riven',      cost: 3, tier: 3 },
  { name: '赛娜',          en: 'Senna',      cost: 3, tier: 3 },
  { name: '娑娜',          en: 'Sona',       cost: 3, tier: 3 },
  { name: '塔莉垭',        en: 'Taliyah',    cost: 3, tier: 3 },
  { name: '维克兹',        en: 'Velkoz',     cost: 3, tier: 3 },
  { name: '薇恩',          en: 'Vayne',      cost: 3, tier: 3 },
  { name: '佐伊',          en: 'Zoe',        cost: 3, tier: 3 },

  // ======= 4 费 (12种) =======
  { name: '奥瑞利安 · 索尔', en: 'AurelionSol', cost: 4, tier: 4 },
  { name: '卑尔维斯',      en: 'Belveth',    cost: 4, tier: 4 },
  { name: '艾克',          en: 'Ekko',       cost: 4, tier: 4 },
  { name: '厄斐琉斯',      en: 'Aphelios',   cost: 4, tier: 4 },
  { name: '扎克',          en: 'Zac',        cost: 4, tier: 4 },
  { name: '瑟庄妮',        en: 'Sejuani',    cost: 4, tier: 4 },
  { name: '莎弥拉',        en: 'Samira',     cost: 4, tier: 4 },
  { name: '索拉卡',        en: 'Soraka',     cost: 4, tier: 4 },
  { name: '厄运小姐',      en: 'MissFortune',cost: 4, tier: 4 },
  { name: '迦娜',          en: 'Janna',      cost: 4, tier: 4 },
  { name: '佛耶戈',        en: 'Viego',      cost: 4, tier: 4 },
  { name: '瑟提',          en: 'Sett',       cost: 4, tier: 4 },

  // ======= 5 费 (8种) =======
  { name: '费德提克',      en: 'Fiddlesticks', cost: 5, tier: 5 },
  { name: '加里奥',        en: 'Galio',      cost: 5, tier: 5 },
  { name: '蕾欧娜',        en: 'Leona',      cost: 5, tier: 5 },
  { name: '莫德凯撒',      en: 'Mordekaiser',cost: 5, tier: 5 },
  { name: '努努和威朗普',  en: 'Nunu',       cost: 5, tier: 5 },
  { name: '辛德拉',        en: 'Syndra',     cost: 5, tier: 5 },
  { name: '厄加特',        en: 'Urgot',      cost: 5, tier: 5 },
  { name: '劫',            en: 'Zed',        cost: 5, tier: 5 },
]

// ============================================================================
// 概率计算函数
// ============================================================================

/**
 * 单格出现指定英雄的概率
 * P = P(刷出该费用) × P(是该英雄 | 该费用)
 *   = (odds / 100) × (remaining / tierPoolTotal)
 * @param {number} level          — 当前等级 (1-10)
 * @param {number} cardCost       — 目标卡费用 (1-5)
 * @param {number} remaining      — 该英雄卡池剩余张数
 * @param {number} tierPoolTotal  — 该费用卡池剩余总张数
 */
export function calcSlotProbability(level, cardCost, remaining, tierPoolTotal) {
  if (!remaining || !tierPoolTotal || tierPoolTotal <= 0) return 0
  const odds = ROLL_ODDS[level]
  if (!odds) return 0
  const rate = odds[cardCost] || 0
  if (rate === 0) return 0
  return (rate / 100) * Math.min(1, remaining / tierPoolTotal)
}

/**
 * 单次刷新(5格)至少出现一张的概率
 * @param {number} level         — 当前等级
 * @param {number} cardCost      — 目标卡费用
 * @param {number} totalRemaining— 该卡剩余总张数
 * @param {number} tierPoolTotal — 该费用级卡池剩余总张数
 */
export function calcRollProbability(level, cardCost, totalRemaining, tierPoolTotal) {
  const oddsTable = ROLL_ODDS[level]
  if (!oddsTable || tierPoolTotal <= 0) return 0
  const rate = oddsTable[cardCost] || 0
  if (rate === 0) return 0
  const probPerSlot = (rate / 100) * Math.min(1, totalRemaining / tierPoolTotal)
  return 1 - Math.pow(1 - probPerSlot, 5)
}

/**
 * D牌预算下的达成概率
 * @param {number} level          — 当前等级
 * @param {number} cardCost       — 目标卡费用
 * @param {number} wantedCount    — 还需要几张
 * @param {number} remaining      — 该卡剩余总张数
 * @param {number} tierPoolTotal  — 该费总剩余
 * @param {number} rolls          — 可刷新次数
 * @param {number} need           — 实际需要递到的张数
 */
export function calcRollProbabilityWithBudget(level, cardCost, remaining, tierPoolTotal, rolls, need) {
  if (need <= 0) return 1
  if (remaining <= 0 || tierPoolTotal <= 0 || rolls <= 0) return 0
  const oddsTable = ROLL_ODDS[level]
  if (!oddsTable) return 0
  const rate = oddsTable[cardCost] || 0
  if (rate === 0) return 0
  const probPerSlot = (rate / 100) * Math.min(1, remaining / tierPoolTotal)
  const singleRollProb = 1 - Math.pow(1 - probPerSlot, 5)
  // 至少 need 张的二项分布累积概率
  let totalProb = 0
  for (let k = need; k <= rolls; k++) {
    const comb = binomialCoeff(rolls, k)
    totalProb += comb * Math.pow(singleRollProb, k) * Math.pow(1 - singleRollProb, rolls - k)
  }
  return Math.min(1, totalProb)
}

function binomialCoeff(n, k) {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  let c = 1
  for (let i = 1; i <= k; i++) {
    c = c * (n - i + 1) / i
  }
  return c
}

/**
 * D牌期望和概率统计
 * @param {number} level      — 当前等级
 * @param {number} cardCost   — 目标卡费用
 * @param {number} need       — 需要几张
 * @param {number} remaining  — 剩余张数
 * @param {number} tierTotal  — 该费总剩余
 * @returns {{expectedRolls, probability50, probability80}}
 */
export function calcFishingStats(level, cardCost, need, remaining, tierTotal) {
  if (need <= 0 || remaining <= 0 || tierTotal <= 0) {
    return { expectedRolls: 0, probability50: Infinity, probability80: Infinity }
  }
  const oddsTable = ROLL_ODDS[level]
  if (!oddsTable) return { expectedRolls: 0, probability50: Infinity, probability80: Infinity }
  const rate = oddsTable[cardCost] || 0
  if (rate === 0) return { expectedRolls: 0, probability50: Infinity, probability80: Infinity }
  const probPerSlot = (rate / 100) * Math.min(1, remaining / tierTotal)
  const perRoll = 1 - Math.pow(1 - probPerSlot, 5)
  if (perRoll <= 0) return { expectedRolls: Infinity, probability50: Infinity, probability80: Infinity }

  // 几何分布期望
  const expectedRolls = Math.ceil(need / perRoll)

  // 二分查找 50% 和 80% 达成的次数
  let prob50 = Infinity, prob80 = Infinity
  let lo = 1, hi = Math.ceil(need / perRoll * 10)
  for (let i = 0; i < 50; i++) {
    const mid = Math.floor((lo + hi) / 2)
    let cumProb = 0
    for (let k = need; k <= mid; k++) {
      cumProb += binomialCoeff(mid, k) * Math.pow(perRoll, k) * Math.pow(1 - perRoll, mid - k)
    }
    if (cumProb >= 0.5) { prob50 = mid; hi = mid }
    else lo = mid
    if (lo + 1 >= hi) break
  }
  lo = 1; hi = Math.ceil(need / perRoll * 10)
  for (let i = 0; i < 50; i++) {
    const mid = Math.floor((lo + hi) / 2)
    let cumProb = 0
    for (let k = need; k <= mid; k++) {
      cumProb += binomialCoeff(mid, k) * Math.pow(perRoll, k) * Math.pow(1 - perRoll, mid - k)
    }
    if (cumProb >= 0.8) { prob80 = mid; hi = mid }
    else lo = mid
    if (lo + 1 >= hi) break
  }
  return { expectedRolls, probability50: prob50, probability80: prob80 }
}
