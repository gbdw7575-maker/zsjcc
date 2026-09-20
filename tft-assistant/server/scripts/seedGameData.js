/**
 * 游戏数据初始化脚本
 * 将 S8 怪兽入侵赛季的英雄/羁绊/装备/海克斯/卡池数据导入 MongoDB
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

const VERSION = 'S8 怪兽入侵'

// ================ 英雄数据 ================
const heroes = [
  { name: '加里奥', cost: 1, synergies: ['平民英雄'], icon: '/images/Galio.png' },
  { name: '凯尔', cost: 1, synergies: ['地下魔盗团', '决斗大师'], icon: '/images/Kayle.png' },
  { name: '艾希', cost: 1, synergies: ['源计划：激光特工', '情报特工'], icon: '/images/Ashe.png' },
  { name: '普朗克', cost: 1, synergies: ['超级英雄'], icon: '/images/Gangplank.png' },
  { name: '布里茨', cost: 1, synergies: ['管理员程序', '护卫'], icon: '/images/Blitzcrank.png' },
  { name: '雷克顿', cost: 1, synergies: ['源计划：激光特工', '斗士'], icon: '/images/Renekton.png' },
  { name: '孙悟空', cost: 1, synergies: ['战斗机甲', '斗士'], icon: '/images/Wukong.png' },
  { name: '内瑟斯', cost: 1, synergies: [], icon: '/images/Nasus.png' },
  { name: '波比', cost: 1, synergies: ['小天才', '护卫'], icon: '/images/Poppy.png' },
  { name: '泰隆', cost: 1, synergies: ['福牛守护者'], icon: '/images/Talon.png' },
  { name: '拉克丝', cost: 1, synergies: ['星之守护者', '灵能使'], icon: '/images/Lux.png' },
  { name: '璐璐', cost: 1, synergies: ['小天才', '爱心使者'], icon: '/images/Lulu.png' },
  { name: '塞拉斯', cost: 1, synergies: ['超级英雄', '护卫'], icon: '/images/Sylas.png' },
  { name: '安妮', cost: 2, synergies: ['小天才', '福牛守护者', '灵能使'], icon: '/images/Annie.png' },
  { name: '希维尔', cost: 2, synergies: ['枪手'], icon: '/images/Sivir.png' },
  { name: '墨菲特', cost: 2, synergies: ['斗士', '超级英雄'], icon: '/images/Malphite.png' },
  { name: '李青', cost: 2, synergies: ['超级英雄', '斗士', '爱心使者'], icon: '/images/LeeSin.png' },
  { name: '伊泽瑞尔', cost: 2, synergies: ['地下魔盗团', '情报特工'], icon: '/images/Ezreal.png' },
  { name: '菲奥娜', cost: 2, synergies: ['决斗大师', '福牛守护者'], icon: '/images/Fiora.png' },
  { name: '德莱文', cost: 2, synergies: ['枪手', '精英战士'], icon: '/images/Draven.png' },
  { name: '亚索', cost: 2, synergies: ['决斗大师', '源计划：激光特工', '平民英雄'], icon: '/images/Yasuo.png' },
  { name: '卡蜜尔', cost: 2, synergies: ['管理员程序', '黑客'], icon: '/images/Camille.png' },
  { name: '金克丝', cost: 2, synergies: ['枪手', '超级英雄'], icon: '/images/Jinx.png' },
  { name: '蔚', cost: 2, synergies: ['地下魔盗团', '情报特工', '斗士'], icon: '/images/Vi.png' },
  { name: '悠米', cost: 2, synergies: ['星之守护者', '爱心使者', '秘术卫士'], icon: '/images/Yuumi.png' },
  { name: '芮尔', cost: 2, synergies: ['星之守护者', '护卫'], icon: '/images/Rell.png' },
  { name: '乐芙兰', cost: 3, synergies: ['管理员程序', '灵能使', '黑客'], icon: '/images/Leblanc.png' },
  { name: '阿利斯塔', cost: 3, synergies: ['福牛守护者', '秘术卫士', '护卫'], icon: '/images/Alistar.png' },
  { name: '贾克斯', cost: 3, synergies: ['决斗大师', '战斗机甲'], icon: '/images/Jax.png' },
  { name: '科加斯', cost: 3, synergies: ['怪兽'], icon: '/images/Chogath.png' },
  { name: '拉莫斯', cost: 3, synergies: ['怪兽'], icon: '/images/Rammus.png' },
  { name: '娑娜', cost: 3, synergies: ['地下魔盗团', '灵能使', '爱心使者'], icon: '/images/Sona.png' },
  { name: '薇恩', cost: 3, synergies: ['决斗大师', '情报特工'], icon: '/images/Vayne.png' },
  { name: '锐雯', cost: 3, synergies: ['战斗机甲', '斗士'], icon: '/images/Riven.png' },
  { name: '佐伊', cost: 3, synergies: ['小天才', '黑客'], icon: '/images/Zoe.png' },
  { name: '卡莎', cost: 3, synergies: ['星之守护者', '情报特工'], icon: '/images/Kaisa.png' },
  { name: '维克兹', cost: 3, synergies: ['怪兽', '灵能使'], icon: '/images/Velkoz.png' },
  { name: '赛娜', cost: 3, synergies: ['源计划：激光特工', '枪手', '超级英雄'], icon: '/images/Senna.png' },
  { name: '尼菈', cost: 3, synergies: ['星之守护者', '决斗大师'], icon: '/images/Nilah.png' },
  { name: '索拉卡', cost: 4, synergies: ['管理员程序', '爱心使者'], icon: '/images/Soraka.png' },
  { name: '厄运小姐', cost: 4, synergies: ['枪手', '精英战士'], icon: '/images/MissFortune.png' },
  { name: '瑟庄妮', cost: 4, synergies: ['源计划：激光特工', '斗士'], icon: '/images/Sejuani.png' },
  { name: '奥瑞利安·索尔', cost: 4, synergies: ['怪兽', '星之守护者'], icon: '/images/AurelionSol.png' },
  { name: '扎克', cost: 4, synergies: ['怪兽', '斗士'], icon: '/images/Zac.png' },
  { name: '塔莉垭', cost: 4, synergies: ['星之守护者', '灵能使'], icon: '/images/Taliyah.png' },
  { name: '卑尔维斯', cost: 4, synergies: ['怪兽'], icon: '/images/Belveth.png' },
  { name: '佛耶戈', cost: 4, synergies: ['福牛守护者', '超级英雄'], icon: '/images/Viego.png' },
  { name: '劫', cost: 4, synergies: ['源计划：激光特工', '决斗大师', '黑客'], icon: '/images/Zed.png' },
  { name: '艾克', cost: 4, synergies: ['星之守护者', '秘术卫士'], icon: '/images/Ekko.png' },
  { name: '莎弥拉', cost: 4, synergies: ['地下魔盗团', '超级英雄', '精英战士'], icon: '/images/Samira.png' },
  { name: '瑟提', cost: 4, synergies: ['战斗机甲', '斗士', '精英战士'], icon: '/images/Sett.png' },
  { name: '厄加特', cost: 5, synergies: ['怪兽'], icon: '/images/Urgot.png' },
  { name: '费德提克', cost: 5, synergies: ['怪兽', '堕落使者'], icon: '/images/Fiddlesticks.png' },
  { name: '努努和威朗普', cost: 5, synergies: ['小天才'], icon: '/images/Nunu.png' },
  { name: '迦娜', cost: 5, synergies: ['平民英雄', '秘术卫士'], icon: '/images/Janna.png' },
  { name: '莫德凯撒', cost: 5, synergies: ['源计划：激光特工', '精英战士'], icon: '/images/Mordekaiser.png' },
  { name: '蕾欧娜', cost: 5, synergies: ['战斗机甲', '护卫'], icon: '/images/Leona.png' },
  { name: '辛德拉', cost: 5, synergies: ['星之守护者', '爱心使者'], icon: '/images/Syndra.png' },
  { name: '厄斐琉斯', cost: 5, synergies: ['福牛守护者', '枪手'], icon: '/images/Aphelios.png' },
]

// ================ 羁绊数据 ================
const synergies = [
  { name: '地下魔盗团', type: 'trait', icon: '💰', effect: '累积进度获得战利品', levels: [3, 5, 7], color: '#eab308' },
  { name: '管理员程序', type: 'trait', icon: '⚙️', effect: '自定义程序配置', levels: [2, 4, 6], color: '#22d3ee' },
  { name: '怪兽', type: 'trait', icon: '👾', effect: '无羁绊但更强属性', levels: [1], color: '#7c3aed' },
  { name: '星之守护者', type: 'trait', icon: '⭐', effect: '额外获得法力值', levels: [3, 5, 7, 9], color: '#fbbf24' },
  { name: '小天才', type: 'trait', icon: '🧒', effect: '每回合制造改装武器', levels: [3, 5], color: '#f472b6' },
  { name: '源计划：激光特工', type: 'trait', icon: '🔫', effect: '无人机造成魔法伤害', levels: [3, 6, 9], color: '#06b6d4' },
  { name: '战斗机甲', type: 'trait', icon: '🤖', effect: '合体成至尊机甲', levels: [3, 5], color: '#f97316' },
  { name: '福牛守护者', type: 'trait', icon: '🐂', effect: '攻击+濒死免疫1.5秒', levels: [2, 4, 6], color: '#dc2626' },
  { name: '超级英雄', type: 'trait', icon: '🦸', effect: '摆姿势增加全体伤害', levels: [3], color: '#ef4444' },
  { name: '平民英雄', type: 'trait', icon: '🛡️', effect: '存活时全队回血', levels: [1, 2, 3], color: '#94a3b8' },
  { name: '精英战士', type: 'trait', icon: '⚔️', effect: '处决低血量敌人', levels: [2, 4], color: '#f59e0b' },
  { name: '堕落使者', type: 'trait', icon: '💀', effect: '吸收灵魂获得法强', levels: [1], color: '#7c3aed' },
  { name: '斗士', type: 'class', icon: '💪', effect: '获得额外生命值', levels: [2, 4, 6, 8], color: '#10b981' },
  { name: '护卫', type: 'class', icon: '🛡️', effect: '提供护甲加成', levels: [2, 4, 6], color: '#64748b' },
  { name: '决斗大师', type: 'class', icon: '⚡', effect: '攻击叠加攻速', levels: [2, 4, 6, 8], color: '#f97316' },
  { name: '枪手', type: 'class', icon: '🔫', effect: '每第4次攻击增强', levels: [2, 4, 6], color: '#06b6d4' },
  { name: '灵能使', type: 'class', icon: '🔮', effect: '每5秒投掷魔法球', levels: [2, 4, 6], color: '#9333ea' },
  { name: '爱心使者', type: 'class', icon: '❤️', effect: '施放技能全队叠法强', levels: [2, 4, 6], color: '#ec4899' },
  { name: '情报特工', type: 'class', icon: '🎯', effect: '技能攻击最远敌人', levels: [2, 3, 4], color: '#3b82f6' },
  { name: '秘术卫士', type: 'class', icon: '✨', effect: '提供魔抗加成', levels: [2, 4, 6], color: '#a855f7' },
  { name: '黑客', type: 'class', icon: '💻', effect: '全能吸血+传送后排', levels: [2, 3, 4], color: '#14b8a6' },
]

// ================ 装备数据 ================
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
  heroCountByCost: { 1: 13, 2: 13, 3: 13, 4: 12, 5: 8 },
  poolHeroes: [
    { name: '加里奥', en: 'Galio', cost: 1 }, { name: '凯尔', en: 'Kayle', cost: 1 },
    { name: '艾希', en: 'Ashe', cost: 1 }, { name: '普朗克', en: 'Gangplank', cost: 1 },
    { name: '布里茨', en: 'Blitzcrank', cost: 1 }, { name: '雷克顿', en: 'Renekton', cost: 1 },
    { name: '孙悟空', en: 'Wukong', cost: 1 }, { name: '内瑟斯', en: 'Nasus', cost: 1 },
    { name: '波比', en: 'Poppy', cost: 1 }, { name: '泰隆', en: 'Talon', cost: 1 },
    { name: '拉克丝', en: 'Lux', cost: 1 }, { name: '璐璐', en: 'Lulu', cost: 1 },
    { name: '塞拉斯', en: 'Sylas', cost: 1 },
    { name: '安妮', en: 'Annie', cost: 2 }, { name: '希维尔', en: 'Sivir', cost: 2 },
    { name: '墨菲特', en: 'Malphite', cost: 2 }, { name: '李青', en: 'LeeSin', cost: 2 },
    { name: '伊泽瑞尔', en: 'Ezreal', cost: 2 }, { name: '菲奥娜', en: 'Fiora', cost: 2 },
    { name: '德莱文', en: 'Draven', cost: 2 }, { name: '亚索', en: 'Yasuo', cost: 2 },
    { name: '卡蜜尔', en: 'Camille', cost: 2 }, { name: '金克丝', en: 'Jinx', cost: 2 },
    { name: '蔚', en: 'Vi', cost: 2 }, { name: '悠米', en: 'Yuumi', cost: 2 },
    { name: '芮尔', en: 'Rell', cost: 2 },
    { name: '乐芙兰', en: 'LeBlanc', cost: 3 }, { name: '阿利斯塔', en: 'Alistar', cost: 3 },
    { name: '贾克斯', en: 'Jax', cost: 3 }, { name: '科加斯', en: 'Chogath', cost: 3 },
    { name: '拉莫斯', en: 'Rammus', cost: 3 }, { name: '娑娜', en: 'Sona', cost: 3 },
    { name: '薇恩', en: 'Vayne', cost: 3 }, { name: '锐雯', en: 'Riven', cost: 3 },
    { name: '佐伊', en: 'Zoe', cost: 3 }, { name: '卡莎', en: 'Kaisa', cost: 3 },
    { name: '维克兹', en: 'Velkoz', cost: 3 }, { name: '赛娜', en: 'Senna', cost: 3 },
    { name: '尼菈', en: 'Nilah', cost: 3 },
    { name: '索拉卡', en: 'Soraka', cost: 4 }, { name: '厄运小姐', en: 'MissFortune', cost: 4 },
    { name: '瑟庄妮', en: 'Sejuani', cost: 4 }, { name: '奥瑞利安·索尔', en: 'AurelionSol', cost: 4 },
    { name: '扎克', en: 'Zac', cost: 4 }, { name: '塔莉垭', en: 'Taliyah', cost: 4 },
    { name: '卑尔维斯', en: 'Belveth', cost: 4 }, { name: '佛耶戈', en: 'Viego', cost: 4 },
    { name: '劫', en: 'Zed', cost: 4 }, { name: '艾克', en: 'Ekko', cost: 4 },
    { name: '莎弥拉', en: 'Samira', cost: 4 }, { name: '瑟提', en: 'Sett', cost: 4 },
    { name: '厄加特', en: 'Urgot', cost: 5 }, { name: '费德提克', en: 'Fiddlesticks', cost: 5 },
    { name: '努努和威朗普', en: 'Nunu', cost: 5 }, { name: '迦娜', en: 'Janna', cost: 5 },
    { name: '莫德凯撒', en: 'Mordekaiser', cost: 5 }, { name: '蕾欧娜', en: 'Leona', cost: 5 },
    { name: '辛德拉', en: 'Syndra', cost: 5 }, { name: '厄斐琉斯', en: 'Aphelios', cost: 5 },
  ]
}

// 阵容（用于首页推荐和详情页）
const metaTeams = [
  { id: 1, name: '机甲精英九五', tier: 'T0', description: '运营天花板，速9找铁男开3机甲4精英斩杀', synergies: ['战斗机甲', '精英战士', '怪兽'], heroes: ['瑟提', '莫德凯撒', '厄运小姐', '蕾欧娜', '厄加特', '费德提克', '德莱文', '莎弥拉'], items: ['最后的轻语', '无尽之刃', '巨人捕手'], source: '游侠网攻略', winRate: 32.5, playRate: 12.8 },
  { id: 2, name: '无情连打贾克斯', tier: 'T0', description: '5战斗机甲+4斗士，贾克斯无限叠加攻速', synergies: ['战斗机甲', '斗士', '护卫'], heroes: ['贾克斯', '瑟提', '锐雯', '孙悟空', '瑟庄妮', '扎克', '蕾欧娜', '费德提克'], items: ['疾射火炮', '鬼索的狂暴之刃', '水银'], source: '游侠网攻略', winRate: 28.3, playRate: 18.5 },
  { id: 3, name: '金币流德莱文', tier: 'T0', description: '3超级英雄+5机甲，德莱文掉金币经济爆炸', synergies: ['超级英雄', '战斗机甲', '精英战士'], heroes: ['德莱文', '墨菲特', '李青', '瑟提', '蕾欧娜', '普朗克', '孙悟空', '贾克斯'], items: ['无尽之刃', '水银', '最后的轻语'], source: '今日头条云顶阵容情报局', winRate: 26.8, playRate: 8.2 },
  { id: 4, name: '怪兽卡莎', tier: 'T1', description: '7怪兽前排拉满，卡莎高频输出', synergies: ['怪兽', '情报特工', '星之守护者'], heroes: ['卡莎', '薇恩', '伊泽瑞尔', '拉莫斯', '科加斯', '维克兹', '艾克', '扎克'], items: ['斯塔缇克电刃', '海克斯科技枪刃', '珠光护手'], source: '今日头条云顶阵容情报局', winRate: 22.1, playRate: 15.3 },
  { id: 5, name: '怪兽女枪', tier: 'T1', description: '7怪兽+女枪全屏AOE斩杀', synergies: ['怪兽', '精英战士'], heroes: ['厄运小姐', '拉莫斯', '维克兹', '扎克', '奥瑞利安·索尔', '科加斯', '费德提克', '厄加特'], items: ['朔极之矛', '珠光护手', '巨人捕手'], source: '游侠网攻略', winRate: 20.5, playRate: 10.7 },
  { id: 6, name: '超英伊泽瑞尔', tier: 'T1', description: '超级英雄+情报特工，EZ稳定输出', synergies: ['超级英雄', '情报特工', '源计划：激光特工'], heroes: ['伊泽瑞尔', '李青', '普朗克', '墨菲特', '雷克顿', '艾希'], items: ['蓝霸符', '珠光护手', '大天使之杖'], source: '今日头条云顶阵容情报局', winRate: 18.2, playRate: 14.6 },
  { id: 7, name: '地下魔盗团', tier: 'T1', description: '经济发育阵容，盗窃层数累积开宝箱', synergies: ['地下魔盗团', '情报特工', '超级英雄'], heroes: ['凯尔', '蔚', '伊泽瑞尔', '娑娜', '莎弥拉', '金克丝', '阿利斯塔', '迦娜'], items: ['最后的轻语', '无尽之刃', '石像鬼石板甲'], source: '游侠网攻略', winRate: 16.5, playRate: 11.2 },
  { id: 8, name: '星守辛德拉', tier: 'T1', description: '星之守护者+爱心使者，辛德拉高频施法', synergies: ['星之守护者', '爱心使者', '决斗大师'], heroes: ['辛德拉', '拉克丝', '悠米', '卡莎', '尼菈', '艾克', '塔莉垭', '索拉卡'], items: ['灭世者的死亡之帽', '大天使之杖', '蓝霸符'], source: '游侠网攻略', winRate: 15.8, playRate: 9.5 },
  { id: 9, name: '福牛佛耶戈', tier: 'T1', description: '福牛守护者+超级英雄，佛耶戈收割残局', synergies: ['福牛守护者', '超级英雄', '决斗大师'], heroes: ['佛耶戈', '泰隆', '安妮', '阿利斯塔', '菲奥娜', '普朗克', '塞拉斯', '李青'], items: ['离子火花', '海克斯科技枪刃', '巨龙之爪'], source: '今日头条云顶阵容情报局', winRate: 14.2, playRate: 8.8 },
  { id: 10, name: '灵能塔莉垭', tier: 'T1', description: '灵能使+星之守护者，塔莉垭技能爆发', synergies: ['灵能使', '星之守护者', '爱心使者'], heroes: ['塔莉垭', '安妮', '乐芙兰', '娑娜', '拉克丝', '悠米', '艾克', '辛德拉'], items: ['蓝霸符', '珠光护手', '大天使之杖'], source: '游侠网攻略', winRate: 13.5, playRate: 7.6 },
]

// 海克斯数据从 augmentsData.js 中提取（只取结构化数据，不含描述性文本）
const augments = {
  note: '完整海克斯数据见 src/data/augmentsData.js，其中包含英雄强化详细描述',
  heroAugments: [
    { hero: '艾希', cost: 1, name: '激光专注', type: '自身强化', effect: '获得40%攻速，释放技能后获得额外80%攻速', tier: 'T1' },
    { hero: '艾希', cost: 1, name: '特工专注', type: '团队强化', effect: '友军阵亡时全体获得20%攻速', tier: 'T2' },
    { hero: '凯尔', cost: 1, name: '登神长阶', type: '自身强化', effect: '获得10%额外攻击力，每次升级获得10%额外攻速', tier: 'T1' },
    { hero: '凯尔', cost: 1, name: '正义审判', type: '团队强化', effect: '全体获得15%攻速', tier: 'T2' },
    { hero: '贾克斯', cost: 3, name: '无情连打', type: '自身强化', effect: '每第三次攻击造成额外魔法伤害并叠加攻速', tier: 'T1' },
    { hero: '德莱文', cost: 2, name: '冷酷利刃', type: '自身强化', effect: '击杀获得金币+攻击力永久提升', tier: 'T1' },
    { hero: '佛耶戈', cost: 4, name: '王者之心', type: '自身强化', effect: '技能击杀后回复生命并刷新', tier: 'T1' },
    { hero: '厄运小姐', cost: 4, name: '弹幕时间', type: '自身强化', effect: '大招波数翻倍', tier: 'T1' },
    { hero: '辛德拉', cost: 5, name: '力场掌控', type: '自身强化', effect: '技能范围+伤害提升', tier: 'T1' },
    { hero: '蕾欧娜', cost: 5, name: '太阳耀斑', type: '自身强化', effect: '护盾值翻倍，结束时造成范围伤害', tier: 'T1' },
    { hero: '费德提克', cost: 5, name: '绝对堕落', type: '自身强化', effect: '开局直接施放技能', tier: 'T0' },
    { hero: '迦娜', cost: 5, name: '气象主播', type: '团队强化', effect: '根据天气类型提供不同全队加成', tier: 'T1' },
    { hero: '厄加特', cost: 5, name: '深海恐惧', type: '自身强化', effect: '技能施放时额外获得攻速', tier: 'T1' },
    { hero: '努努和威朗普', cost: 5, name: '滚雪球', type: '自身强化', effect: '技能滚动速度+伤害递增', tier: 'T1' },
    { hero: '莫德凯撒', cost: 5, name: '不灭亡魂', type: '自身强化', effect: '技能击杀永久获得法强', tier: 'T0' },
    { hero: '莎弥拉', cost: 4, name: '评级提升', type: '自身强化', effect: '攻击力随技能评级提升', tier: 'T1' },
    { hero: '瑟提', cost: 4, name: '蓄意轰拳', type: '自身强化', effect: '技能范围+真实伤害', tier: 'T1' },
    { hero: '薇恩', cost: 3, name: '扩散射击', type: '自身强化', effect: '技能额外攻击2个目标', tier: 'T1' },
    { hero: '塔莉垭', cost: 4, name: '石穿', type: '自身强化', effect: '技能额外弹射3次', tier: 'T1' },
    { hero: '索拉卡', cost: 4, name: '星体恩赐', type: '团队强化', effect: '施放技能后全队回复生命', tier: 'T2' },
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
