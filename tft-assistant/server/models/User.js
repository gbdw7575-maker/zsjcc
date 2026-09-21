import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  gameId: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    default: ''
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  type: {
    type: String,
    enum: ['player', 'creator'],
    default: 'player'
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  // 扩展资料（个人中心编辑）
  gender: {
    type: String,
    enum: ['', 'male', 'female', 'secret'],
    default: ''
  },
  ageGroup: {
    type: String,
    enum: ['', '12-17', '18-24', '25-30', '31-40', '40+'],
    default: ''
  },
  rank: {
    type: String,
    enum: ['', 'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'challenger'],
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, '标签最多20个字符']
  }],
  // 目标设置
  targetRank: {
    type: String,
    default: ''
  },
  targetWinRate: {
    type: Number,
    default: null
  },
  targetTeam: {
    type: String,
    default: '',
    maxlength: [50, '目标阵容最多50个字符']
  },
  // C1 syncWorker 用：每次登录/活跃时更新，用于判断"活跃用户"是否值得后台同步战绩
  lastActiveAt: {
    type: Date,
    default: null,
    index: true
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
