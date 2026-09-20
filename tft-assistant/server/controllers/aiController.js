import {
  callChatCompletion,
  getDefaultProvider,
  hasAnyApiKey,
  AI_PROVIDERS
} from '../services/aiProviderService.js'

// POST /api/ai/chat
// 前端统一入口：浏览器不再持有 API Key，由服务端代理转发
export const chatProxy = async (req, res, next) => {
  try {
    const { provider, messages, model, maxTokens, temperature } = req.body

    const data = await callChatCompletion({
      provider: provider || getDefaultProvider(),
      messages,
      model,
      maxTokens,
      temperature
    })

    res.json({ success: true, data })
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      })
    }
    next(error)
  }
}

// GET /api/ai/status
// 仅返回是否已配置与服务商列表，绝不返回密钥
export const getAIStatus = (req, res) => {
  res.json({
    success: true,
    data: {
      configured: hasAnyApiKey(),
      defaultProvider: getDefaultProvider(),
      providers: Object.entries(AI_PROVIDERS).map(([key, v]) => ({
        key,
        name: v.name,
        defaultModel: v.defaultModel
      }))
    }
  })
}
