import mongoose from 'mongoose'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3000

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tft_assistant')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB 连接失败 (尝试 ${retryCount + 1}/${MAX_RETRIES}): ${error.message}`)
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`   将在 ${RETRY_DELAY_MS / 1000}s 后重试...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      return connectDB(retryCount + 1)
    }
    console.error('MongoDB 连接重试次数已达上限，退出程序')
    process.exit(1)
  }
}

export default connectDB
