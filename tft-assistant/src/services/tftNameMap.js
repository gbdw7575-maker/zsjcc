/**
 * LCU 标识 → 中文名称 映射（仅展示层使用）
 * 数据库中 LCU 记录只存语言中立的英文标识，由这里统一转中文；
 * 手动录入的中文名称查不到映射时原样返回。
 */
import { gameData } from './gameDataService'

// S8 羁绊英文 ID（已去 TFT8_ 前缀）→ 中文名
const TRAIT_MAP = {
  Ace: '精英战士',
  Admin: 'AI程序',
  Arsenal: '枪神',
  Aegis: '秘术卫士',
  Brawler: '斗士',
  Civilian: '平民英雄',
  Defender: '护卫',
  Duelist: '决斗大师',
  Edgelord: '刀锋领主',
  Gadgeteen: '小天才',
  Heart: '爱心使者',
  Lasercorps: '源计划：激光特工',
  Mascot: '吉祥物',
  MechaPrime: '战斗机甲',
  OxForce: '福牛守护者',
  Prankster: '淘气包',
  Recon: '情报特工',
  Riftwalker: '裂隙行者',
  Spellslinger: '灵能使',
  StarGuardian: '星之守护者',
  Sureshot: '神射手',
  Supers: '超级英雄',
  Threat: '怪兽',
  Underground: '地下魔盗团',
  Corrupted: '堕落使者'
}

/**
 * 英雄英文名 → 中文名（动态读取游戏数据，未知则返回原文）
 */
export function unitName(id) {
  if (!id) return ''
  const hero = gameData.heroes.value.find(h => h.en === id)
  return hero ? hero.name : id
}

/**
 * 羁绊英文 ID → 中文名（未知则返回原文）
 */
export function traitName(id) {
  if (!id) return ''
  return TRAIT_MAP[id] || id
}
