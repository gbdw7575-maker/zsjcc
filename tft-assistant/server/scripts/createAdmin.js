import User from './models/User.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tft_assistant')
    
    const existingAdmin = await User.findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('管理员账户已存在')
      console.log('用户名: admin')
      console.log('角色:', existingAdmin.role)
      await mongoose.disconnect()
      return
    }

    const crypto = await import('crypto')
    const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex')
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@tft.com',
      password: adminPassword,
      role: 'admin',
      bio: '系统管理员'
    })

    console.log('管理员账户创建成功！')
    console.log('用户名: admin')
    console.log(`密码: ${adminPassword}`)
    console.log('邮箱: admin@tft.com')
    console.log('角色: admin')
    console.log('⚠️  请立即保存此密码，并通过环境变量 ADMIN_PASSWORD 设置')
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('创建管理员失败:', error.message)
    process.exit(1)
  }
}

createAdmin()