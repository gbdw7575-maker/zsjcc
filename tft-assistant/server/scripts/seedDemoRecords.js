// 演示战绩种子脚本：为全服统计聚合生成可信的匿名对局数据
// 用法：
//   node scripts/seedDemoRecords.js         # 写入约 130 条演示战绩（幂等，重复执行先清后写）
//   node scripts/seedDemoRecords.js --clean # 清除全部演示战绩与演示账户
// 演示记录特征：note 含「演示」、user 为 demo 账户、羁绊/英雄取自 S18 数据
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import MatchRecord from '../models/MatchRecord.js'

dotenv.config()

const DEMO_USERNAME = 'demo_stats'
const DEMO_TAG = '演示'

// S18 羁绊与英雄池（与前端 data 一致的代表性子集）
const TRAITS = ['绽放', '裂隙兽', '巫会', '苍木', '灵巧兽', '仙灵', '炼狱', '适配者', '怪异', '原始', '太阳', '月亮', '宿敌', '法术编织者', '掠夺者', '斗士', '先锋', '猎手', '行刑官', '召唤师', '重装战士', '守护者', '速射', '祈求者', '绿父', '古树', '翠绿之相', '赏金猎人', '致命花', '腐蚀', '荆棘少女', '化身', '顶级捕食者', '调谐']
const CHAMPIONS = ['阿卡丽', '卡尔玛', '奥恩', '霞', '约里克', '凯尔', '乐芙兰', '慎', '瑟庄妮', '提莫', '卡西奥佩娅', '黛安娜', '费德提克', '易大师', '拉莫斯', '雷恩加尔', '崔丝塔娜', '蔚', '阿狸', '阿木木', '伊泽瑞尔', '莫甘娜', '瑟提', '希维尔', '索拉卡', '婕拉', '艾希', '德莱文', '纳尔', '凯南', '拉克丝', '茂凯', '塔里克', '远古巨龙']
const MODES = ['ranked', 'ranked', 'ranked', 'normal', 'hyper_roll', 'double']

// 名次权重：贴近真实分布（中间名次多，吃鸡/老八少）
const PLACEMENT_WEIGHTS = [8, 14, 18, 18, 16, 12, 8, 6]

function pickWeighted(weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i + 1
  }
  return weights.length
}

function pick(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tft_assistant')
  console.log('MongoDB 已连接')

  const isClean = process.argv.includes('--clean')
  const demoUser = await User.findOne({ username: DEMO_USERNAME })

  if (demoUser) {
    const removed = await MatchRecord.deleteMany({ user: demoUser._id })
    console.log(`已清除旧演示战绩 ${removed.deletedCount} 条`)
  }
  if (isClean) {
    if (demoUser) await User.deleteOne({ _id: demoUser._id })
    console.log('演示账户已删除，清理完成')
    await mongoose.disconnect()
    return
  }

  // 建演示账户（不参与登录，仅挂战绩）
  const user = demoUser || await User.create({
    username: DEMO_USERNAME,
    email: 'demo_stats@tft.local',
    password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    bio: '演示数据账户（统计聚合用）'
  })

  const now = Date.now()
  const docs = []
  for (let i = 0; i < 130; i++) {
    const daysAgo = Math.floor(Math.random() * 14)
    const playedAt = new Date(now - daysAgo * 24 * 3600 * 1000 - Math.floor(Math.random() * 20 * 3600 * 1000))
    docs.push({
      user: user._id,
      placement: pickWeighted(PLACEMENT_WEIGHTS),
      mode: MODES[Math.floor(Math.random() * MODES.length)],
      traits: pick(TRAITS, 2 + Math.floor(Math.random() * 3)),
      units: pick(CHAMPIONS, 4 + Math.floor(Math.random() * 4)).map(c => ({
        champion: c,
        star: Math.random() < 0.25 ? 3 : Math.random() < 0.6 ? 2 : 1,
        items: []
      })),
      note: `${DEMO_TAG}数据（统计聚合种子）`,
      gameDuration: 25 + Math.floor(Math.random() * 15),
      source: 'manual',
      playedAt
    })
  }
  await MatchRecord.insertMany(docs)
  console.log(`已写入演示战绩 ${docs.length} 条（近 14 天分布）`)
  await mongoose.disconnect()
}

main().catch(err => { console.error(err); process.exit(1) })
