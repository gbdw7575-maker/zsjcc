/**
 * 游戏数据初始化脚本
 * 将 S18 苍林秘境赛季的英雄/羁绊/装备/海克斯/卡池数据导入 MongoDB
 *
 * 用法: node scripts/seedGameData.js
 *
 * 后续赛季更新：
 *   - 管理员通过后台 AdminGameData 页面 JSON 导入新赛季数据
 *   - 或修改此脚本的 VERSION 常量和数据内容后重新运行
 */

import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import GameData from '../models/GameData.js'

const VERSION = 'S18 苍林秘境'

// ================ 英雄数据（S18 共 65 个） ================
const heroes = [
  // ======= 1 费 (14 个) =======
  { name: '阿卡丽', cost: 1, synergies: ['炼狱', '适配者', '掠夺者'], icon: '/images/Akali.png' },
  { name: '卡蜜尔', cost: 1, synergies: ['巫会', '掠夺者'], icon: '/images/Camille.png' },
  { name: '小炭', cost: 1, synergies: ['裂隙兽', '猎手'], icon: '/images/Cinderling.png' },
  { name: '卡尔玛', cost: 1, synergies: ['法术编织者', '绽放'], icon: '/images/Karma.png' },
  { name: '古布子', cost: 1, synergies: ['灵巧兽', '斗士'], icon: '/images/Kobuko.png' },
  { name: '蕾欧娜', cost: 1, synergies: ['太阳', '守护者'], icon: '/images/Leona.png' },
  { name: '奥恩', cost: 1, synergies: ['苍木', '守护者'], icon: '/images/Ornn.png' },
  { name: '碎石', cost: 1, synergies: ['裂隙兽', '祈求者'], icon: '/images/Pebbles.png' },
  { name: '洛', cost: 1, synergies: ['仙灵', '重装战士', '先锋'], icon: '/images/Rakan.png' },
  { name: '雷克塞', cost: 1, synergies: ['怪异', '斗士'], icon: '/images/RekSai.png' },
  { name: '维鲁斯', cost: 1, synergies: ['炼狱', '速射'], icon: '/images/Varus.png' },
  { name: '维迦', cost: 1, synergies: ['怪异', '灵巧兽', '法术编织者'], icon: '/images/Veigar.png' },
  { name: '霞', cost: 1, synergies: ['苍木', '仙灵', '速射'], icon: '/images/Xayah.png' },
  { name: '约里克', cost: 1, synergies: ['绽放', '重装战士', '召唤师'], icon: '/images/Yorick.png' },

  // ======= 2 费 (13 个) =======
  { name: '阿利斯塔', cost: 2, synergies: ['苍木', '斗士'], icon: '/images/Alistar.png' },
  { name: '凯特琳', cost: 2, synergies: ['巫会', '猎手'], icon: '/images/Caitlyn.png' },
  { name: '伊莉丝', cost: 2, synergies: ['巫会', '先锋'], icon: '/images/Elise.png' },
  { name: '格罗普', cost: 2, synergies: ['裂隙兽', '适配者'], icon: '/images/Gromp.png' },
  { name: '凯尔', cost: 2, synergies: ['太阳', '速射'], icon: '/images/Kayle.png' },
  { name: '乐芙兰', cost: 2, synergies: ['苍木', '法术编织者'], icon: '/images/Leblanc.png' },
  { name: '暗影狼', cost: 2, synergies: ['裂隙兽', '掠夺者'], icon: '/images/Murkwolf.png' },
  { name: '斯库特尔', cost: 2, synergies: ['裂隙兽', '重装战士'], icon: '/images/Scuttlecrab.png' },
  { name: '瑟庄妮', cost: 2, synergies: ['太阳', '重装战士'], icon: '/images/Sejuani.png' },
  { name: '慎', cost: 2, synergies: ['炼狱', '守护者'], icon: '/images/Shen.png' },
  { name: '提莫', cost: 2, synergies: ['灵巧兽', '祈求者'], icon: '/images/Teemo.png' },
  { name: '沃里克', cost: 2, synergies: ['怪异', '掠夺者'], icon: '/images/Warwick.png' },
  { name: '优娜拉', cost: 2, synergies: ['绽放', '行刑官'], icon: '/images/Yunara.png' },

  // ======= 3 费 (14 个) =======
  { name: '阿兹尔', cost: 3, synergies: ['怪异', '行刑官', '召唤师'], icon: '/images/Azir.png' },
  { name: '卡西奥佩娅', cost: 3, synergies: ['巫会', '法术编织者'], icon: '/images/Cassiopeia.png' },
  { name: '黛安娜', cost: 3, synergies: ['月亮', '掠夺者', '先锋'], icon: '/images/Diana.png' },
  { name: '费德提克', cost: 3, synergies: ['致命花', '守护者', '法术编织者'], icon: '/images/Fiddlesticks.png' },
  { name: '赫卡里姆', cost: 3, synergies: ['苍木', '先锋'], icon: '/images/Hecarim.png' },
  { name: '卡兹克', cost: 3, synergies: ['宿敌'], icon: '/images/Khazix.png' },
  { name: '克格莫', cost: 3, synergies: ['腐蚀', '祈求者', '适配者'], icon: '/images/Kogmaw.png' },
  { name: '克鲁格', cost: 3, synergies: ['裂隙兽', '斗士'], icon: '/images/Krug.png' },
  { name: '易大师', cost: 3, synergies: ['绽放', '适配者'], icon: '/images/Masteryi.png' },
  { name: '拉莫斯', cost: 3, synergies: ['灵巧兽', '守护者'], icon: '/images/Rammus.png' },
  { name: '锐鹏', cost: 3, synergies: ['裂隙兽', '召唤师', '速射'], icon: '/images/Raptor.png' },
  { name: '雷恩加尔', cost: 3, synergies: ['宿敌'], icon: '/images/Rengar.png' },
  { name: '崔丝塔娜', cost: 3, synergies: ['仙灵', '灵巧兽', '猎手'], icon: '/images/Tristana.png' },
  { name: '蔚', cost: 3, synergies: ['原始', '重装战士'], icon: '/images/Vi.png' },

  // ======= 4 费 (14 个) =======
  { name: '阿狸', cost: 4, synergies: ['绽放', '法术编织者'], icon: '/images/Ahri.png' },
  { name: '阿木木', cost: 4, synergies: ['炼狱', '重装战士'], icon: '/images/Amumu.png' },
  { name: '古代哨兵', cost: 4, synergies: ['裂隙兽', '先锋', '祈求者'], icon: '/images/AncientSentinel.png' },
  { name: '厄斐琉斯', cost: 4, synergies: ['月亮', '速射'], icon: '/images/Aphelios.png' },
  { name: '荆棘甲虫', cost: 4, synergies: ['裂隙兽', '掠夺者'], icon: '/images/Brambleback.png' },
  { name: '伊泽瑞尔', cost: 4, synergies: ['苍木', '行刑官'], icon: '/images/Ezreal.png' },
  { name: '莉莉娅', cost: 4, synergies: ['仙灵', '守护者'], icon: '/images/Lillia.png' },
  { name: '墨菲特', cost: 4, synergies: ['怪异', '巨石'], icon: '/images/Malphite.png' },
  { name: '莫甘娜', cost: 4, synergies: ['巫会', '祈求者'], icon: '/images/Morgana.png' },
  { name: '奈德丽', cost: 4, synergies: ['原始', '适配者'], icon: '/images/Nidalee.png' },
  { name: '瑟提', cost: 4, synergies: ['绽放', '斗士'], icon: '/images/Sett.png' },
  { name: '希维尔', cost: 4, synergies: ['原始', '猎手'], icon: '/images/Sivir.png' },
  { name: '索拉卡', cost: 4, synergies: ['致命花', '行刑官'], icon: '/images/Soraka.png' },
  { name: '婕拉', cost: 4, synergies: ['荆棘少女', '召唤师'], icon: '/images/Zyra.png' },

  // ======= 5 费 (10 个) =======
  { name: '阿璐妮', cost: 5, synergies: ['调谐', '月亮', '法术编织者'], icon: '/images/Alune.png' },
  { name: '艾希', cost: 5, synergies: ['绽放', '猎手'], icon: '/images/Ashe.png' },
  { name: '德莱文', cost: 5, synergies: ['赏金猎人'], icon: '/images/Draven.png' },
  { name: '纳尔', cost: 5, synergies: ['苍木', '灵巧兽', '斗士'], icon: '/images/Gnar.png' },
  { name: '艾翁', cost: 5, synergies: ['绿父'], icon: '/images/Ivern.png' },
  { name: '凯南', cost: 5, synergies: ['炼狱', '行刑官'], icon: '/images/Kennen.png' },
  { name: '拉克丝', cost: 5, synergies: ['化身'], icon: '/images/Lux.png' },
  { name: '茂凯', cost: 5, synergies: ['古树', '重装战士'], icon: '/images/Maokai.png' },
  { name: '塔里克', cost: 5, synergies: ['翠绿之相', '先锋'], icon: '/images/Taric.png' },
  { name: '远古巨龙', cost: 5, synergies: ['裂隙兽', '顶级捕食者'], icon: '/images/ElderDragon.png' },
]

// ================ 羁绊数据（S18 共 35 个 = 25 origins + 11 classes，部分英雄重复） ================
const synergies = [
  // ======= Origins (25 个) =======
  { name: '绽放', type: 'trait', icon: '🌸', effect: 'Wisps 升级；商店每店都有 Wisp；买 Wisp 后获金币；每轮可买 2 个 Wisp', levels: [3, 5, 7, 9, 11], color: '#FF69B4' },
  { name: '裂隙兽', type: 'trait', icon: '🐉', effect: 'Alpha Mark 强化一名裂隙兽；商店被裂隙兽淹没；每 5 秒叠加属性；+1 队伍上限', levels: [3, 5, 7, 10], color: '#8B4513' },
  { name: '巫会', type: 'trait', icon: '🔮', effect: '击杀敌人或输战斗收集 Essence，转换为奖励或继续累积', levels: [3, 4, 5, 7], color: '#4B0082' },
  { name: '苍木', type: 'trait', icon: '🌲', effect: '召唤可放置植物（石树/生命花/深木守护者），植物随星级升级', levels: [3, 5, 7, 9, 11], color: '#228B22' },
  { name: '灵巧兽', type: 'trait', icon: '🐹', effect: '约德尔人骑上 Big Furry Friend 获大量生命+攻速；部分加成分享给队伍', levels: [3, 5, 7], color: '#FFA07A' },
  { name: '黑荆棘', type: 'trait', icon: '🌵', effect: '战斗开始献祭一名友军，按其角色/星级/费用加成黑荆棘单位', levels: [2, 4, 6], color: '#2F4F4F' },
  { name: '仙灵', type: 'trait', icon: '🧚', effect: '伤害/治疗/护盾吸引 Pixie，每 Pixie 获 AD/AP；半血以下按 Pixie 治疗', levels: [2, 4], color: '#FFB6C1' },
  { name: '炼狱', type: 'trait', icon: '🔥', effect: '燃烧+重伤；后续点燃商店格滚高一费英雄', levels: [2, 3, 5, 7], color: '#FF4500' },
  { name: '适配者', type: 'trait', icon: '⚖️', effect: '按 AD/AP 较高者切换技能版本，并加成对应属性', levels: [2, 3, 4], color: '#00CED1' },
  { name: '绿父', type: 'trait', icon: '🌳', effect: '艾翁唯一：施法累积种子，创建森林/沼泽/峡谷/瀑布地形 biome', levels: [1], color: '#32CD32' },
  { name: '古树', type: 'trait', icon: '🌿', effect: '茂凯唯一：敌人倒下时获得最大生命值', levels: [1], color: '#556B2F' },
  { name: '翠绿之相', type: 'trait', icon: '💚', effect: '塔里克唯一：配对一名友军，半血时双方释放翠绿能量，3 格内友军获护盾', levels: [1], color: '#50C878' },
  { name: '赏金猎人', type: 'trait', icon: '💰', effect: '德莱文唯一：随机攻击敌人+bleed，技能消耗 bleed 爆发', levels: [1], color: '#FFD700' },
  { name: '致命花', type: 'trait', icon: '🌺', effect: '费德提克/索拉卡：技能触发致命花卉效果', levels: [1], color: '#800080' },
  { name: '腐蚀', type: 'trait', icon: '☠️', effect: '克格莫唯一：腐蚀攻击', levels: [1], color: '#7CFC00' },
  { name: '荆棘少女', type: 'trait', icon: '🌹', effect: '婕拉唯一：召唤荆棘植物', levels: [1], color: '#9370DB' },
  { name: '化身', type: 'trait', icon: '✨', effect: '拉克丝唯一：商店里其他化身变成同 trait，化身算双倍', levels: [1], color: '#FF1493' },
  { name: '顶级捕食者', type: 'trait', icon: '🦖', effect: '远古巨龙唯一：占 2 个棋盘格，裂隙兽+2', levels: [1], color: '#8B0000' },
  { name: '调谐', type: 'trait', icon: '🌙', effect: '阿璐妮唯一：月相循环，半月以下队伍获 Durability，以上获 Damage Amp', levels: [1], color: '#87CEEB' },
  { name: '宿敌', type: 'trait', icon: '⚔️', effect: '卡兹克/雷恩加尔：宿敌对决加成', levels: [1], color: '#DC143C' },
  { name: '巨石', type: 'trait', icon: '🪨', effect: '墨菲特：岩石之力', levels: [1], color: '#708090' },
  { name: '怪异', type: 'trait', icon: '👁️', effect: '阿兹尔/墨菲特/雷克塞/维迦/沃里克：怪异之力', levels: [1], color: '#4169E1' },
  { name: '原始', type: 'trait', icon: '🦴', effect: '奈德丽/希维尔/蔚：原始之力', levels: [1], color: '#8B7355' },
  { name: '太阳', type: 'trait', icon: '☀️', effect: '凯尔/蕾欧娜/瑟庄妮/阿璐妮：太阳之力', levels: [1], color: '#FFA500' },
  { name: '月亮', type: 'trait', icon: '🌕', effect: '黛安娜/厄斐琉斯/阿璐妮/凯尔：月亮之力', levels: [1], color: '#E6E6FA' },

  // ======= Classes (11 个) =======
  { name: '法术编织者', type: 'class', icon: '🔮', effect: '全队获得额外法术强度', levels: [2, 4, 6], color: '#9932CC' },
  { name: '掠夺者', type: 'class', icon: '🗡️', effect: '获得攻速与护甲穿透', levels: [2, 4, 6], color: '#FF4500' },
  { name: '斗士', type: 'class', icon: '💪', effect: '获得额外生命值', levels: [2, 4, 6, 8], color: '#8B4513' },
  { name: '先锋', type: 'class', icon: '🛡️', effect: '战斗开始获得护甲', levels: [2, 4, 6], color: '#A0522D' },
  { name: '猎手', type: 'class', icon: '🏹', effect: '每数次攻击处决低生命值敌人', levels: [2, 3, 4], color: '#556B2F' },
  { name: '行刑官', type: 'class', icon: '⚔️', effect: '技能可暴击并获得暴击伤害', levels: [2, 3, 4], color: '#B22222' },
  { name: '召唤师', type: 'class', icon: '✨', effect: '召唤增援单位协助战斗', levels: [2, 3, 4], color: '#20B2AA' },
  { name: '重装战士', type: 'class', icon: '🛡️', effect: '获得减伤', levels: [2, 4, 6], color: '#4682B4' },
  { name: '守护者', type: 'class', icon: '🛡️', effect: '战斗开始全队获得魔抗', levels: [2, 4, 6], color: '#9370DB' },
  { name: '速射', type: 'class', icon: '🎯', effect: '每第 N 次攻击造成额外伤害', levels: [2, 4, 6], color: '#FF8C00' },
  { name: '祈求者', type: 'class', icon: '💎', effect: '释放技能后全队获得法力回复', levels: [2, 4, 6], color: '#87CEEB' },
]

// ================ 装备数据（S18 装备未大改，沿用通用列表） ================
const equipments = [
  { name: '暴风大剑', icon: '/images/items/TFT_Item_BFSword.png', type: 'base', stats: { attack: 15 }, id: '1001' },
  { name: '反曲之弓', icon: '/images/items/TFT_Item_RecurveBow.png', type: 'base', stats: { attackSpeed: 15 }, id: '1002' },
  { name: '锁子甲', icon: '/images/items/TFT_Item_ChainVest.png', type: 'base', stats: { armor: 25 }, id: '1003' },
  { name: '负极斗篷', icon: '/images/items/TFT_Item_NegatronCloak.png', type: 'base', stats: { magicResist: 25 }, id: '1004' },
  { name: '无用大棒', icon: '/images/items/TFT_Item_NeedlesslyLargeRod.png', type: 'base', stats: { spellPower: 15 }, id: '1005' },
  { name: '女神之泪', icon: '/images/items/TFT_Item_TearOfTheGoddess.png', type: 'base', stats: { mana: 15 }, id: '1006' },
  { name: '巨人腰带', icon: '/images/items/TFT_Item_GiantsBelt.png', type: 'base', stats: { health: 200 }, id: '1007' },
  { name: '拳击手套', icon: '/images/items/TFT_Item_SparringGloves.png', type: 'base', stats: { critChance: 10 }, id: '1008' },
  { name: '无尽之刃', icon: '/images/items/TFT_Item_InfinityEdge.png', type: 'combined', components: ['暴风大剑', '拳击手套'], stats: { attack: 65, critChance: 20 }, id: '1011' },
  { name: '海克斯科技枪刃', icon: '/images/items/TFT_Item_HextechGunblade.png', type: 'combined', components: ['暴风大剑', '无用大棒'], stats: { attack: 15, spellPower: 15 }, id: '1012' },
  { name: '鬼索的狂暴之刃', icon: '/images/items/TFT_Item_GuinsoosRageblade.png', type: 'combined', components: ['反曲之弓', '无用大棒'], stats: { attackSpeed: 15, spellPower: 15 }, id: '1013' },
  { name: '斯塔缇克电刃', icon: '/images/items/TFT_Item_StatikkShiv.png', type: 'combined', components: ['反曲之弓', '女神之泪'], stats: { attackSpeed: 15, mana: 15 }, id: '1014' },
  { name: '卢安娜的飓风', icon: '/images/items/TFT_Item_RunaansHurricane.png', type: 'combined', components: ['反曲之弓', '负极斗篷'], stats: { attackSpeed: 15, magicResist: 25 }, id: '1015' },
  { name: '疾射火炮', icon: '/images/items/TFT_Item_RapidFirecannon.png', type: 'combined', components: ['反曲之弓', '反曲之弓'], stats: { attackSpeed: 30 }, id: '1016' },
  { name: '守护天使', icon: '/images/items/TFT_Item_GuardianAngel.png', type: 'combined', components: ['暴风大剑', '锁子甲'], stats: { attack: 15, armor: 25 }, id: '1017' },
  { name: '日炎斗篷', icon: '/images/items/TFT_Item_SunfireCape.png', type: 'combined', components: ['锁子甲', '巨人腰带'], stats: { armor: 25, health: 200 }, id: '1018' },
  { name: '石像鬼石板甲', icon: '/images/items/TFT_Item_GargoyleStoneplate.png', type: 'combined', components: ['锁子甲', '负极斗篷'], stats: { armor: 25, magicResist: 25 }, id: '1019' },
  { name: '荆棘之甲', icon: '/images/items/TFT_Item_BrambleVest.png', type: 'combined', components: ['锁子甲', '锁子甲'], stats: { armor: 50 }, id: '1020' },
  { name: '巨龙之爪', icon: '/images/items/TFT_Item_DragonsClaw.png', type: 'combined', components: ['负极斗篷', '负极斗篷'], stats: { magicResist: 50 }, id: '1021' },
  { name: '水银', icon: '/images/items/TFT_Item_Quicksilver.png', type: 'combined', components: ['负极斗篷', '拳击手套'], stats: { magicResist: 25, critChance: 10 }, id: '1022' },
  { name: '灭世者的死亡之帽', icon: '/images/items/TFT_Item_RabadonsDeathcap.png', type: 'combined', components: ['无用大棒', '无用大棒'], stats: { spellPower: 30 }, id: '1023' },
  { name: '大天使之杖', icon: '/images/items/TFT_Item_ArchangelsStaff.png', type: 'combined', components: ['无用大棒', '女神之泪'], stats: { spellPower: 15, mana: 15 }, id: '1024' },
  { name: '蓝霸符', icon: '/images/items/TFT_Item_BlueBuff.png', type: 'combined', components: ['女神之泪', '女神之泪'], stats: { mana: 30 }, id: '1025' },
  { name: '救赎', icon: '/images/items/TFT_Item_Redemption.png', type: 'combined', components: ['女神之泪', '巨人腰带'], stats: { mana: 15, health: 200 }, id: '1026' },
  { name: '狂徒铠甲', icon: '/images/items/TFT_Item_WarmogsArmor.png', type: 'combined', components: ['巨人腰带', '巨人腰带'], stats: { health: 400 }, id: '1027' },
  { name: '兹若特传送门', icon: '/images/items/TFT_Item_ZzRotPortal.png', type: 'combined', components: ['反曲之弓', '巨人腰带'], stats: { attackSpeed: 15, health: 200 }, id: '1028' },
  { name: '灵风', icon: '/images/items/TFT_Item_Zephyr.png', type: 'combined', components: ['负极斗篷', '巨人腰带'], stats: { magicResist: 25, health: 200 }, id: '1029' },
  { name: '静止法衣', icon: '/images/items/TFT_Item_ShroudOfStillness.png', type: 'combined', components: ['锁子甲', '拳击手套'], stats: { armor: 25, critChance: 10 }, id: '1030' },
  { name: '基克的先驱', icon: '/images/items/TFT_Item_ZekesHerald.png', type: 'combined', components: ['暴风大剑', '巨人腰带'], stats: { attack: 15, health: 200 }, id: '1031' },
  { name: '钢铁烈阳之匣', icon: '/images/items/TFT_Item_LocketOfTheIronSolari.png', type: 'combined', components: ['无用大棒', '锁子甲'], stats: { spellPower: 15, armor: 25 }, id: '1032' },
  { name: '能量圣杯', icon: '/images/items/TFT_Item_ChaliceOfPower.png', type: 'combined', components: ['女神之泪', '负极斗篷'], stats: { mana: 15, magicResist: 25 }, id: '1033' },
  { name: '最后的轻语', icon: '/images/items/TFT_Item_LastWhisper.png', type: 'combined', components: ['反曲之弓', '拳击手套'], stats: { attackSpeed: 15, critChance: 10 }, id: '1034' },
  { name: '汲取剑', icon: '/images/items/TFT_Item_Deathblade.png', type: 'combined', components: ['暴风大剑', '暴风大剑'], stats: { attack: 30 }, id: '1035' },
  { name: '泰坦的坚决', icon: '/images/items/TFT_Item_TitansResolve.png', type: 'combined', components: ['锁子甲', '反曲之弓'], stats: { armor: 25, attackSpeed: 15 }, id: '1036' },
  { name: '莫雷洛秘典', icon: '/images/items/TFT_Item_Morellonomicon.png', type: 'combined', components: ['无用大棒', '巨人腰带'], stats: { spellPower: 15, health: 200 }, id: '1037' },
  { name: '离子火花', icon: '/images/items/TFT_Item_IonicSpark.png', type: 'combined', components: ['无用大棒', '负极斗篷'], stats: { spellPower: 15, magicResist: 25 }, id: '1038' },
  { name: '珠光护手', icon: '/images/items/TFT_Item_JeweledGauntlet.png', type: 'combined', components: ['无用大棒', '拳击手套'], stats: { spellPower: 15, critChance: 10 }, id: '1039' },
  { name: '饮血剑', icon: '/images/items/TFT_Item_Bloodthirster.png', type: 'combined', components: ['暴风大剑', '负极斗篷'], stats: { attack: 15, magicResist: 25 }, id: '1040' },
  { name: '冰霜之心', icon: '/images/items/TFT_Item_FrozenHeart.png', type: 'combined', components: ['锁子甲', '女神之泪'], stats: { armor: 25, mana: 15 }, id: '1041' },
]

// ================ 卡池概率数据 ================
const poolData = {
  poolSize: { 1: 29, 2: 22, 3: 18, 4: 12, 5: 10 },
  rollOdds: {
    1: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
    2: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
    3: { 1: 75, 2: 25, 3: 0, 4: 0, 5: 0 },
    4: { 1: 55, 2: 30, 3: 15, 4: 0, 5: 0 },
    5: { 1: 45, 2: 33, 3: 20, 4: 2, 5: 0 },
    6: { 1: 25, 2: 40, 3: 30, 4: 5, 5: 0 },
    7: { 1: 19, 2: 30, 3: 35, 4: 15, 5: 1 },
    8: { 1: 16, 2: 20, 3: 35, 4: 25, 5: 4 },
    9: { 1: 9, 2: 15, 3: 30, 4: 30, 5: 16 }
  },
  heroCountByCost: { 1: 14, 2: 13, 3: 14, 4: 14, 5: 10 },
  poolHeroes: [
    // 1 费 14 个
    { name: '阿卡丽', en: 'Akali', cost: 1 }, { name: '卡蜜尔', en: 'Camille', cost: 1 },
    { name: '小炭', en: 'Cinderling', cost: 1 }, { name: '卡尔玛', en: 'Karma', cost: 1 },
    { name: '古布子', en: 'Kobuko', cost: 1 }, { name: '蕾欧娜', en: 'Leona', cost: 1 },
    { name: '奥恩', en: 'Ornn', cost: 1 }, { name: '碎石', en: 'Pebbles', cost: 1 },
    { name: '洛', en: 'Rakan', cost: 1 }, { name: '雷克塞', en: "Rek'Sai", cost: 1 },
    { name: '维鲁斯', en: 'Varus', cost: 1 }, { name: '维迦', en: 'Veigar', cost: 1 },
    { name: '霞', en: 'Xayah', cost: 1 }, { name: '约里克', en: 'Yorick', cost: 1 },
    // 2 费 13 个
    { name: '阿利斯塔', en: 'Alistar', cost: 2 }, { name: '凯特琳', en: 'Caitlyn', cost: 2 },
    { name: '伊莉丝', en: 'Elise', cost: 2 }, { name: '格罗普', en: 'Gromp', cost: 2 },
    { name: '凯尔', en: 'Kayle', cost: 2 }, { name: '乐芙兰', en: 'LeBlanc', cost: 2 },
    { name: '暗影狼', en: 'Murkwolf', cost: 2 }, { name: '斯库特尔', en: 'Scuttlecrab', cost: 2 },
    { name: '瑟庄妮', en: 'Sejuani', cost: 2 }, { name: '慎', en: 'Shen', cost: 2 },
    { name: '提莫', en: 'Teemo', cost: 2 }, { name: '沃里克', en: 'Warwick', cost: 2 },
    { name: '优娜拉', en: 'Yunara', cost: 2 },
    // 3 费 14 个
    { name: '阿兹尔', en: 'Azir', cost: 3 }, { name: '卡西奥佩娅', en: 'Cassiopeia', cost: 3 },
    { name: '黛安娜', en: 'Diana', cost: 3 }, { name: '费德提克', en: 'Fiddlesticks', cost: 3 },
    { name: '赫卡里姆', en: 'Hecarim', cost: 3 }, { name: '卡兹克', en: "Kha'Zix", cost: 3 },
    { name: '克格莫', en: "Kog'Maw", cost: 3 }, { name: '克鲁格', en: 'Krug', cost: 3 },
    { name: '易大师', en: 'MasterYi', cost: 3 }, { name: '拉莫斯', en: 'Rammus', cost: 3 },
    { name: '锐鹏', en: 'Raptor', cost: 3 }, { name: '雷恩加尔', en: 'Rengar', cost: 3 },
    { name: '崔丝塔娜', en: 'Tristana', cost: 3 }, { name: '蔚', en: 'Vi', cost: 3 },
    // 4 费 14 个
    { name: '阿狸', en: 'Ahri', cost: 4 }, { name: '阿木木', en: 'Amumu', cost: 4 },
    { name: '古代哨兵', en: 'AncientSentinel', cost: 4 }, { name: '厄斐琉斯', en: 'Aphelios', cost: 4 },
    { name: '荆棘甲虫', en: 'Brambleback', cost: 4 }, { name: '伊泽瑞尔', en: 'Ezreal', cost: 4 },
    { name: '莉莉娅', en: 'Lillia', cost: 4 }, { name: '墨菲特', en: 'Malphite', cost: 4 },
    { name: '莫甘娜', en: 'Morgana', cost: 4 }, { name: '奈德丽', en: 'Nidalee', cost: 4 },
    { name: '瑟提', en: 'Sett', cost: 4 }, { name: '希维尔', en: 'Sivir', cost: 4 },
    { name: '索拉卡', en: 'Soraka', cost: 4 }, { name: '婕拉', en: 'Zyra', cost: 4 },
    // 5 费 10 个
    { name: '阿璐妮', en: 'Alune', cost: 5 }, { name: '艾希', en: 'Ashe', cost: 5 },
    { name: '德莱文', en: 'Draven', cost: 5 }, { name: '纳尔', en: 'Gnar', cost: 5 },
    { name: '艾翁', en: 'Ivern', cost: 5 }, { name: '凯南', en: 'Kennen', cost: 5 },
    { name: '拉克丝', en: 'Lux', cost: 5 }, { name: '茂凯', en: 'Maokai', cost: 5 },
    { name: '塔里克', en: 'Taric', cost: 5 }, { name: '远古巨龙', en: 'ElderDragon', cost: 5 }
  ]
}

// ================ 热门阵容（S18 苍林秘境） ================
const metaTeams = [
  { id: 1, name: '绽放风暴', tier: 'T0', description: '5绽放+2法术编织者，阿狸+瑟提双核输出，Wisps 持续增益', synergies: ['绽放', '法术编织者', '重装战士', '古树'], heroes: ['卡尔玛', '约里克', '优娜拉', '易大师', '阿狸', '瑟提', '艾希', '茂凯'], items: ['灭世者的死亡之帽', '蓝霸符', '石像鬼石板甲', '日炎斗篷'], source: 'Mobalytics TFT Set 18', winRate: 32.5, playRate: 12.8 },
  { id: 2, name: '裂隙兽远古巨龙', tier: 'T0', description: '7裂隙兽+远古巨龙双格输出，Alpha Mark 强化主力', synergies: ['裂隙兽', '祈求者', '掠夺者', '顶级捕食者'], heroes: ['小炭', '碎石', '暗影狼', '格罗普', '斯库特尔', '克鲁格', '荆棘甲虫', '古代哨兵', '远古巨龙'], items: ['无尽之刃', '最后的轻语', '石像鬼石板甲', '日炎斗篷'], source: 'Mobalytics TFT Set 18', winRate: 31.8, playRate: 15.5 },
  { id: 3, name: '苍木召唤流', tier: 'T0', description: '5苍木+召唤师，奥恩+乐芙兰+伊泽瑞尔+纳尔，植物铺场压制', synergies: ['苍木', '法术编织者', '守护者', '绿父'], heroes: ['奥恩', '阿利斯塔', '乐芙兰', '赫卡里姆', '伊泽瑞尔', '纳尔', '霞', '艾翁'], items: ['蓝霸符', '灭世者的死亡之帽', '最后的轻语', '石像鬼石板甲'], source: 'Mobalytics TFT Set 18', winRate: 30.1, playRate: 10.2 },
  { id: 4, name: '巫会卡西奥佩娅', tier: 'T1', description: '4巫会+法术编织者，卡西奥佩娅高频施法+持续中毒', synergies: ['巫会', '法术编织者', '祈求者', '化身'], heroes: ['卡蜜尔', '凯特琳', '伊莉丝', '卡西奥佩娅', '莫甘娜', '婕拉', '索拉卡', '拉克丝'], items: ['蓝霸符', '灭世者的死亡之帽', '石像鬼石板甲'], source: 'Mobalytics TFT Set 18', winRate: 22.1, playRate: 15.3 },
  { id: 5, name: '灵巧兽纳尔', tier: 'T1', description: '5灵巧兽+斗士，让纳尔骑 BFF 叠大量生命攻速', synergies: ['灵巧兽', '斗士', '祈求者'], heroes: ['古布子', '维迦', '提莫', '崔丝塔娜', '拉莫斯', '纳尔', '阿狸'], items: ['鬼索的狂暴之刃', '泰坦的坚决', '石像鬼石板甲'], source: 'Mobalytics TFT Set 18', winRate: 20.5, playRate: 10.7 },
  { id: 6, name: '炼狱凯南', tier: 'T1', description: '5炼狱+行刑官，凯南+阿木木+慎前排燃烧', synergies: ['炼狱', '行刑官', '重装战士', '守护者'], heroes: ['阿卡丽', '维鲁斯', '慎', '阿木木', '凯南', '索拉卡', '克格莫'], items: ['灭世者的死亡之帽', '珠光护手', '石像鬼石板甲'], source: 'Mobalytics TFT Set 18', winRate: 18.2, playRate: 14.6 },
  { id: 7, name: '宿敌猎杀', tier: 'T2', description: '2宿敌+猎手+掠夺者，雷恩加尔/卡兹克切后排', synergies: ['宿敌', '猎手', '速射', '重装战士'], heroes: ['雷恩加尔', '卡兹克', '凯特琳', '希维尔', '蔚', '慎', '厄斐琉斯'], items: ['无尽之刃', '最后的轻语', '汲取剑'], source: 'Mobalytics TFT Set 18', winRate: 16.5, playRate: 11.2 },
  { id: 8, name: '仙灵莉莉娅', tier: 'T2', description: '4仙灵+守护者，莉莉娅+洛+霞+崔丝塔娜叠加 Pixie', synergies: ['仙灵', '守护者', '灵巧兽', '猎手'], heroes: ['洛', '霞', '崔丝塔娜', '莉莉娅', '维迦', '慎', '塔里克'], items: ['灭世者的死亡之帽', '蓝霸符', '钢铁烈阳之匣'], source: 'Mobalytics TFT Set 18', winRate: 15.8, playRate: 9.5 },
  { id: 9, name: '化身拉克丝', tier: 'T2', description: '拉克丝化身 trait 双倍加成，搭太阳/月亮混合', synergies: ['化身', '太阳', '月亮', '调谐'], heroes: ['拉克丝', '凯尔', '蕾欧娜', '瑟庄妮', '阿璐妮', '黛安娜', '厄斐琉斯', '塔里克'], items: ['灭世者的死亡之帽', '蓝霸符', '珠光护手'], source: 'Mobalytics TFT Set 18', winRate: 14.2, playRate: 8.8 },
  { id: 10, name: '原始重装', tier: 'T2', description: '3原始+重装战士，希维尔+蔚+奈德丽前排减伤输出', synergies: ['原始', '重装战士', '猎手', '古树'], heroes: ['奈德丽', '希维尔', '蔚', '慎', '阿木木', '瑟庄妮', '茂凯'], items: ['最后的轻语', '鬼索的狂暴之刃', '石像鬼石板甲'], source: 'Mobalytics TFT Set 18', winRate: 13.5, playRate: 7.6 },
]

// ================ 海克斯强化数据（S18 含 Wisps 机制） ================
const augments = {
  note: '完整海克斯数据见 src/data/augmentsData.js，其中包含英雄强化详细描述；S18 新机制为 Wisps（神火/精灵）',
  heroAugments: [
    { hero: '阿卡丽', cost: 1, name: '炼狱之刃', type: '自身强化', effect: '阿卡丽获得30%攻速，技能附带燃烧伤害', tier: 'T1' },
    { hero: '阿卡丽', cost: 1, name: '适配之灵', type: '团队强化', effect: '所有友军获得10%攻速和10法术强度', tier: 'T2' },
    { hero: '卡尔玛', cost: 1, name: '绽放法力', type: '自身强化', effect: '卡尔玛每次释放技能获得15法术强度，可叠加', tier: 'T1' },
    { hero: '卡尔玛', cost: 1, name: '绽放之徽', type: '团队强化', effect: '获得绽放纹章+1个卡尔玛', tier: 'T2' },
    { hero: '蕾欧娜', cost: 1, name: '太阳护盾', type: '自身强化', effect: '蕾欧娜获得200护盾，战斗开始时全队获得10护甲', tier: 'T1' },
    { hero: '蕾欧娜', cost: 1, name: '守护者之徽', type: '团队强化', effect: '获得守护者纹章+1个蕾欧娜', tier: 'T2' },
    { hero: '奥恩', cost: 1, name: '苍木之锤', type: '自身强化', effect: '奥恩获得30攻击力和200额外生命值', tier: 'T1' },
    { hero: '奥恩', cost: 1, name: '苍木之徽', type: '团队强化', effect: '获得苍木纹章+1个奥恩', tier: 'T2' },
    { hero: '碎石', cost: 1, name: '裂隙之力', type: '自身强化', effect: '碎石每次释放技能获得5%最大生命值', tier: 'T1' },
    { hero: '碎石', cost: 1, name: '裂隙兽之徽', type: '团队强化', effect: '获得裂隙兽纹章+1个碎石', tier: 'T2' },
    { hero: '凯尔', cost: 2, name: '太阳之翼', type: '自身强化', effect: '凯尔获得15%攻速，每次升级额外获得10%攻速', tier: 'T1' },
    { hero: '凯尔', cost: 2, name: '太阳之徽', type: '团队强化', effect: '获得太阳纹章+1个凯尔', tier: 'T2' },
    { hero: '乐芙兰', cost: 2, name: '苍木幻影', type: '自身强化', effect: '乐芙兰技能击杀敌人后召唤一个苍木分身', tier: 'T1' },
    { hero: '乐芙兰', cost: 2, name: '法术编织者之徽', type: '团队强化', effect: '获得法术编织者纹章+1个乐芙兰', tier: 'T2' },
    { hero: '慎', cost: 2, name: '炼狱守护', type: '自身强化', effect: '慎获得30魔抗，被攻击时反弹火焰伤害', tier: 'T1' },
    { hero: '慎', cost: 2, name: '炼狱之徽', type: '团队强化', effect: '获得炼狱纹章+1个慎', tier: 'T2' },
    { hero: '瑟庄妮', cost: 2, name: '太阳裂击', type: '自身强化', effect: '瑟庄妮技能造成范围伤害+减速', tier: 'T1' },
    { hero: '瑟庄妮', cost: 2, name: '重装战士之徽', type: '团队强化', effect: '获得重装战士纹章+1个瑟庄妮', tier: 'T2' },
    { hero: '卡西奥佩娅', cost: 3, name: '巫会之毒', type: '自身强化', effect: '卡西奥佩娅技能造成持续中毒伤害', tier: 'T1' },
    { hero: '卡西奥佩娅', cost: 3, name: '巫会之徽', type: '团队强化', effect: '获得巫会纹章+1个卡西奥佩娅', tier: 'T2' },
    { hero: '黛安娜', cost: 3, name: '月亮之刃', type: '自身强化', effect: '黛安娜技能附带月光斩击', tier: 'T1' },
    { hero: '黛安娜', cost: 3, name: '月亮之徽', type: '团队强化', effect: '获得月亮纹章+1个黛安娜', tier: 'T2' },
    { hero: '易大师', cost: 3, name: '绽放之刃', type: '自身强化', effect: '易大师攻击附带绽放效果', tier: 'T1' },
    { hero: '易大师', cost: 3, name: '适配者之徽', type: '团队强化', effect: '获得适配者纹章+1个易大师', tier: 'T2' },
    { hero: '阿狸', cost: 4, name: '精神炸弹', type: '自身强化', effect: '阿狸技能弹射次数+2', tier: 'T0' },
    { hero: '阿狸', cost: 4, name: '绽放之冕', type: '团队强化', effect: '获得绽放纹章+2个阿狸', tier: 'T1' },
    { hero: '瑟提', cost: 4, name: '兽性觉醒', type: '自身强化', effect: '瑟提半血以下二次施法', tier: 'T0' },
    { hero: '瑟提', cost: 4, name: '斗士之徽', type: '团队强化', effect: '获得斗士纹章+1个瑟提', tier: 'T2' },
    { hero: '伊泽瑞尔', cost: 4, name: '苍木箭术', type: '自身强化', effect: '伊泽瑞尔技能附带苍木分裂箭', tier: 'T1' },
    { hero: '伊泽瑞尔', cost: 4, name: '行刑官之徽', type: '团队强化', effect: '获得行刑官纹章+1个伊泽瑞尔', tier: 'T2' },
    { hero: '莫甘娜', cost: 4, name: '巫会诅咒', type: '自身强化', effect: '莫甘娜技能造成范围禁锢', tier: 'T1' },
    { hero: '莫甘娜', cost: 4, name: '祈求者之徽', type: '团队强化', effect: '获得祈求者纹章+1个莫甘娜', tier: 'T2' },
    { hero: '凯南', cost: 5, name: '炼狱雷霆', type: '自身强化', effect: '凯南技能附带范围晕眩', tier: 'T0' },
    { hero: '凯南', cost: 5, name: '炼狱之冕', type: '团队强化', effect: '获得炼狱纹章+2个凯南', tier: 'T1' },
    { hero: '纳尔', cost: 5, name: '灵巧兽之怒', type: '自身强化', effect: '纳尔变大后获得额外攻速+范围攻击', tier: 'T0' },
    { hero: '纳尔', cost: 5, name: '灵巧兽之冕', type: '团队强化', effect: '获得灵巧兽纹章+2个纳尔', tier: 'T1' },
    { hero: '茂凯', cost: 5, name: '古树之根', type: '自身强化', effect: '茂凯最大生命值+30%', tier: 'T0' },
    { hero: '茂凯', cost: 5, name: '重装战士之冕', type: '团队强化', effect: '获得重装战士纹章+2个茂凯', tier: 'T1' },
    { hero: '塔里克', cost: 5, name: '翠绿之相', type: '团队强化', effect: '塔里克配对友军获双倍护盾', tier: 'T0' },
    { hero: '塔里克', cost: 5, name: '先锋之冕', type: '团队强化', effect: '获得先锋纹章+2个塔里克', tier: 'T1' },
    { hero: '远古巨龙', cost: 5, name: '远古怒吼', type: '自身强化', effect: '远古巨龙施法附带全屏晕眩', tier: 'T0' },
    { hero: '远古巨龙', cost: 5, name: '裂隙兽之冕', type: '团队强化', effect: '获得裂隙兽纹章+2个远古巨龙', tier: 'T1' },
    { hero: '拉克丝', cost: 5, name: '化身之耀', type: '团队强化', effect: '拉克丝化身 trait 全场生效+2倍加成', tier: 'T0' },
    { hero: '拉克丝', cost: 5, name: '化身之冕', type: '团队强化', effect: '获得化身纹章+2个拉克丝', tier: 'T1' },
    { hero: '德莱文', cost: 5, name: '赏金之斧', type: '自身强化', effect: '德莱文斧头叠加伤害+50%', tier: 'T0' },
    { hero: '德莱文', cost: 5, name: '赏金猎人之徽', type: '团队强化', effect: '获得赏金猎人纹章+1个德莱文', tier: 'T1' },
    { hero: '艾希', cost: 5, name: '绽放之箭', type: '自身强化', effect: '艾希技能附带绽放效果', tier: 'T1' },
    { hero: '艾希', cost: 5, name: '猎手之徽', type: '团队强化', effect: '获得猎手纹章+1个艾希', tier: 'T2' },
  ]
}

// ================ 执行导入 ================
const seedItems = [
  { version: VERSION, type: 'hero', data: heroes },
  { version: VERSION, type: 'synergy', data: synergies },
  { version: VERSION, type: 'equipment', data: equipments },
  { version: VERSION, type: 'pool', data: poolData },
  { version: VERSION, type: 'augment', data: augments },
  { version: VERSION, type: 'metaTeam', data: metaTeams },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tft_assistant')
    console.log('MongoDB 已连接')

    // 先停用当前活跃数据
    await GameData.updateMany({ isActive: true }, { isActive: false })

    let created = 0
    for (const item of seedItems) {
      await GameData.findOneAndUpdate(
        { version: item.version, type: item.type },
        { ...item, isActive: true },
        { upsert: true, new: true }
      )
      created++
    }

    console.log(`✅ 游戏数据初始化完成！共导入 ${created} 条记录`)
    console.log(`   赛季版本: ${VERSION}`)
    console.log(`   数据类型: ${seedItems.map(s => s.type).join(', ')}`)
  } catch (error) {
    console.error('初始化失败:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('MongoDB 已断开')
  }
}

seed()
