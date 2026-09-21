// S18 苍林秘境 卡池数据
// 卡池大小（每种英雄的总张数）
export const POOL_SIZE = { 1: 29, 2: 22, 3: 18, 4: 12, 5: 10 }

// 各等级刷新概率 (S18 标准)
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
export const HERO_COUNT_BY_COST = { '1': 14, '2': 13, '3': 14, '4': 14, '5': 10 }

// S18 全部英雄（费用分组）
export const ALL_POOL_HEROES = [
  // ======= 1 费 (14种) =======
  { name: '阿卡丽',     en: 'Akali',       cost: 1, tier: 1 },
  { name: '卡蜜尔',     en: 'Camille',     cost: 1, tier: 1 },
  { name: '小炭',       en: 'Cinderling',  cost: 1, tier: 1 },
  { name: '卡尔玛',     en: 'Karma',       cost: 1, tier: 1 },
  { name: '古布子',     en: 'Kobuko',      cost: 1, tier: 1 },
  { name: '蕾欧娜',     en: 'Leona',       cost: 1, tier: 1 },
  { name: '奥恩',       en: 'Ornn',        cost: 1, tier: 1 },
  { name: '碎石',       en: 'Pebbles',     cost: 1, tier: 1 },
  { name: '洛',         en: 'Rakan',       cost: 1, tier: 1 },
  { name: '雷克塞',     en: "Rek'Sai",     cost: 1, tier: 1 },
  { name: '维鲁斯',     en: 'Varus',       cost: 1, tier: 1 },
  { name: '维迦',       en: 'Veigar',      cost: 1, tier: 1 },
  { name: '霞',         en: 'Xayah',       cost: 1, tier: 1 },
  { name: '约里克',     en: 'Yorick',      cost: 1, tier: 1 },

  // ======= 2 费 (13种) =======
  { name: '阿利斯塔',   en: 'Alistar',     cost: 2, tier: 2 },
  { name: '凯特琳',     en: 'Caitlyn',     cost: 2, tier: 2 },
  { name: '伊莉丝',     en: 'Elise',       cost: 2, tier: 2 },
  { name: '格罗普',     en: 'Gromp',       cost: 2, tier: 2 },
  { name: '凯尔',       en: 'Kayle',       cost: 2, tier: 2 },
  { name: '乐芙兰',     en: 'LeBlanc',     cost: 2, tier: 2 },
  { name: '暗影狼',     en: 'Murkwolf',    cost: 2, tier: 2 },
  { name: '斯库特尔',   en: 'Scuttlecrab', cost: 2, tier: 2 },
  { name: '瑟庄妮',     en: 'Sejuani',     cost: 2, tier: 2 },
  { name: '慎',         en: 'Shen',        cost: 2, tier: 2 },
  { name: '提莫',       en: 'Teemo',       cost: 2, tier: 2 },
  { name: '沃里克',     en: 'Warwick',     cost: 2, tier: 2 },
  { name: '优娜拉',     en: 'Yunara',      cost: 2, tier: 2 },

  // ======= 3 费 (14种) =======
  { name: '阿兹尔',     en: 'Azir',        cost: 3, tier: 3 },
  { name: '卡西奥佩娅', en: 'Cassiopeia',  cost: 3, tier: 3 },
  { name: '黛安娜',     en: 'Diana',       cost: 3, tier: 3 },
  { name: '费德提克',   en: 'Fiddlesticks',cost: 3, tier: 3 },
  { name: '赫卡里姆',   en: 'Hecarim',     cost: 3, tier: 3 },
  { name: '卡兹克',     en: "Kha'Zix",     cost: 3, tier: 3 },
  { name: '克格莫',     en: "Kog'Maw",     cost: 3, tier: 3 },
  { name: '克鲁格',     en: 'Krug',        cost: 3, tier: 3 },
  { name: '易大师',     en: 'MasterYi',    cost: 3, tier: 3 },
  { name: '拉莫斯',     en: 'Rammus',      cost: 3, tier: 3 },
  { name: '锐鹏',       en: 'Raptor',      cost: 3, tier: 3 },
  { name: '雷恩加尔',   en: 'Rengar',      cost: 3, tier: 3 },
  { name: '崔丝塔娜',   en: 'Tristana',    cost: 3, tier: 3 },
  { name: '蔚',         en: 'Vi',          cost: 3, tier: 3 },

  // ======= 4 费 (14种) =======
  { name: '阿狸',       en: 'Ahri',          cost: 4, tier: 4 },
  { name: '阿木木',     en: 'Amumu',         cost: 4, tier: 4 },
  { name: '古代哨兵',   en: 'AncientSentinel',cost: 4, tier: 4 },
  { name: '厄斐琉斯',   en: 'Aphelios',      cost: 4, tier: 4 },
  { name: '荆棘甲虫',   en: 'Brambleback',    cost: 4, tier: 4 },
  { name: '伊泽瑞尔',   en: 'Ezreal',         cost: 4, tier: 4 },
  { name: '莉莉娅',     en: 'Lillia',         cost: 4, tier: 4 },
  { name: '墨菲特',     en: 'Malphite',       cost: 4, tier: 4 },
  { name: '莫甘娜',     en: 'Morgana',        cost: 4, tier: 4 },
  { name: '奈德丽',     en: 'Nidalee',        cost: 4, tier: 4 },
  { name: '瑟提',       en: 'Sett',           cost: 4, tier: 4 },
  { name: '希维尔',     en: 'Sivir',          cost: 4, tier: 4 },
  { name: '索拉卡',     en: 'Soraka',         cost: 4, tier: 4 },
  { name: '婕拉',       en: 'Zyra',           cost: 4, tier: 4 },

  // ======= 5 费 (10种) =======
  { name: '阿璐妮',     en: 'Alune',        cost: 5, tier: 5 },
  { name: '艾希',       en: 'Ashe',         cost: 5, tier: 5 },
  { name: '德莱文',     en: 'Draven',       cost: 5, tier: 5 },
  { name: '纳尔',       en: 'Gnar',         cost: 5, tier: 5 },
  { name: '艾翁',       en: 'Ivern',        cost: 5, tier: 5 },
  { name: '凯南',       en: 'Kennen',       cost: 5, tier: 5 },
  { name: '拉克丝',     en: 'Lux',          cost: 5, tier: 5 },
  { name: '茂凯',       en: 'Maokai',       cost: 5, tier: 5 },
  { name: '塔里克',     en: 'Taric',        cost: 5, tier: 5 },
  { name: '远古巨龙',   en: 'ElderDragon',  cost: 5, tier: 5 },
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
 * @param {number} wantedCount    — 还需要几张（兼容旧参数名）
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
