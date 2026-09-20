// AI 服务商配置与统一调用
// 密钥仅从服务端环境变量读取，不下发、不接触浏览器 localStorage

// 支持按服务商独立配置密钥；未配置时回退到通用 AI_API_KEY
const resolveApiKey = (provider) => {
  const specific = process.env[`AI_API_KEY_${String(provider).toUpperCase()}`]
  return specific || process.env.AI_API_KEY || ''
}

// 服务商字典：兼容 OpenAI /v1/chat/completions 协议（含视觉模型）
export const AI_PROVIDERS = {
  qwen: {
    name: '阿里云通义千问',
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    defaultModel: 'qwen3-vl-plus'
  },
  zhipu: {
    name: '智谱AI',
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    defaultModel: 'glm-4v-flash'
  },
  openai: {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o'
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat'
  }
}

export class AIProviderError extends Error {
  constructor(message, statusCode = 502, details = null) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

/**
 * 调用服务商 chat completion 接口。
 * @param {object} args
 * @param {string} args.provider 服务商 key（qwen/zhipu/openai/deepseek）
 * @param {Array}  args.messages OpenAI 格式消息数组（可含图片 data URL）
 * @param {string} [args.model] 覆盖默认模型
 * @param {number} [args.maxTokens=1000]
 * @param {number} [args.temperature=0.7]
 * @returns {Promise<object>} 服务商原始 JSON 响应
 */
export const callChatCompletion = async ({
  provider,
  messages,
  model,
  maxTokens = 1000,
  temperature = 0.7
}) => {
  const config = AI_PROVIDERS[provider]
  if (!config) {
    throw new AIProviderError(`不支持的AI服务商: ${provider}`, 400)
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new AIProviderError('messages 不能为空', 400)
  }

  const apiKey = resolveApiKey(provider)
  if (!apiKey) {
    throw new AIProviderError('服务端未配置该服务商的 API Key', 503)
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || config.defaultModel,
      messages,
      max_tokens: maxTokens,
      temperature
    })
  })

  const rawText = await response.text()
  let data = null
  try {
    data = rawText ? JSON.parse(rawText) : null
  } catch {
    throw new AIProviderError(
      `${config.name} 返回了无法解析的内容`,
      502,
      rawText.slice(0, 500)
    )
  }

  if (!response.ok) {
    const upstreamMsg = data?.error?.message || data?.message || `上游状态码 ${response.status}`
    throw new AIProviderError(`${config.name} 请求失败: ${upstreamMsg}`, 502)
  }

  return data
}

// 当前默认服务商（env AI_PROVIDER，默认 qwen）
export const getDefaultProvider = () => process.env.AI_PROVIDER || 'qwen'

// 服务端是否已配置至少一个可用密钥（不返回密钥内容）
export const hasAnyApiKey = () =>
  Boolean(process.env.AI_API_KEY) ||
  Object.keys(AI_PROVIDERS).some(p => Boolean(process.env[`AI_API_KEY_${p.toUpperCase()}`]))
