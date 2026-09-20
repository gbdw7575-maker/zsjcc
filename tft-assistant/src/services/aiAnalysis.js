// AI Analysis Service for TFT Game Screen
// High Accuracy Vision Analysis with Multi-frame Verification

import { ocrService } from './ocrService'

class AIAnalysisService {
  constructor() {
    this.apiKey = localStorage.getItem('ai_api_key') || ''
    this.apiProvider = localStorage.getItem('ai_provider') || 'qwen'
    this.lastAnalysis = null
    this.analysisCount = 0
    this.ocrInitialized = false
    
    // 历史分析缓存（用于多帧比对）
    this.historyBuffer = []
    this.maxHistorySize = 5
    
    // 识别置信度阈值
    this.confidenceThreshold = 0.7
    
    // 国内Vision服务商配置（无需VPN）
    // 注意：DeepSeek官方API（api.deepseek.com）只支持纯文本，不支持图片！
    // DeepSeek-VL2是开源模型，需要自己部署，不能通过DeepSeek官方API调用
    this.visionProviders = {
      qwen: {
        name: '阿里云通义千问',
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen3-vl-plus',
        format: 'openai'
      },
      zhipu: {
        name: '智谱AI',
        url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4v-flash',
        format: 'openai'
      }
    }
  }

  // Configure AI service
  configure(config) {
    this.apiKey = config.apiKey
    this.apiProvider = config.provider || 'openai'
    localStorage.setItem('ai_api_key', this.apiKey)
    localStorage.setItem('ai_provider', this.apiProvider)
  }

  // Check if AI is configured
  isConfigured() {
    return this.apiKey && this.apiKey.length > 0
  }

  // Get current configuration
  getConfig() {
    return {
      apiKey: this.apiKey,
      provider: this.apiProvider
    }
  }

  // Test API connection with a simple text request
  async testAPI() {
    if (!this.isConfigured()) {
      throw new Error('请先配置API Key')
    }

    let url, model, headers
    
    if (this.apiProvider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions'
      model = 'gpt-4o'
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    } else if (this.visionProviders[this.apiProvider]) {
      const providerConfig = this.visionProviders[this.apiProvider]
      url = providerConfig.url
      model = providerConfig.model
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    } else {
      throw new Error('不支持的服务商')
    }

    console.log(`测试API: ${this.apiProvider}, URL: ${url}, Model: ${model}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: '请返回OK'
          }
        ],
        max_tokens: 10,
        temperature: 0
      })
    })

    if (!response.ok) {
      let errorMsg = `API请求失败，状态码: ${response.status}`
      try {
        const errorData = await response.json()
        errorMsg += `, 错误信息: ${JSON.stringify(errorData)}`
      } catch (e) {
        errorMsg += `, 无法解析错误信息`
      }
      throw new Error(errorMsg)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    if (content.trim().includes('OK')) {
      return { success: true, message: 'API连接测试成功', provider: this.apiProvider }
    } else {
      return { success: false, message: `API响应异常: ${content}`, provider: this.apiProvider }
    }
  }

  // Capture frame from video element (optimized for speed)
  captureFrame(videoElement) {
    if (!videoElement) return null
    
    const vw = videoElement.videoWidth || 1920
    const vh = videoElement.videoHeight || 1080
    
    // 缩放到960px宽保证文字清晰可辨，同时控制体积
    const maxWidth = 960
    const scale = Math.min(1, maxWidth / vw)
    const targetW = Math.round(vw * scale)
    const targetH = Math.round(vh * scale)
    
    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElement, 0, 0, targetW, targetH)
    
    // 降低JPEG质量到0.6，游戏UI高对比度不影响识别
    const imageData = canvas.toDataURL('image/jpeg', 0.6)
    return imageData.split(',')[1]
  }

  // Capture key regions for better recognition accuracy
  captureKeyRegions(videoElement) {
    if (!videoElement) return null
    
    const width = videoElement.videoWidth || 1920
    const height = videoElement.videoHeight || 1080
    
    // 创建临时canvas，先绘制整个视频帧
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.drawImage(videoElement, 0, 0, width, height)
    
    // 定义关键区域（基于1080p屏幕比例）
    // 金铲铲界面布局：
    // - 顶部：回合数（中间）
    // - 左下角：等级
    // - 右下角：血量❤️ + 金币💰
    // - 左侧：羁绊列表
    
    const regions = [
      { name: 'top', x: 0, y: 0, w: width, h: Math.floor(height * 0.12) },  // 顶部12%: 回合数
      { name: 'bottomRight', x: Math.floor(width * 0.5), y: Math.floor(height * 0.82), w: Math.floor(width * 0.5), h: Math.floor(height * 0.18) },  // 右下角50%: 血量+金币
      { name: 'bottomLeft', x: 0, y: Math.floor(height * 0.85), w: Math.floor(width * 0.3), h: Math.floor(height * 0.15) },  // 左下角30%: 等级
      { name: 'left', x: 0, y: Math.floor(height * 0.12), w: Math.floor(width * 0.2), h: Math.floor(height * 0.7) }  // 左侧20%: 羁绊
    ]
    
    const combinedCanvas = document.createElement('canvas')
    const combinedWidth = width
    const combinedHeight = regions.reduce((sum, r) => sum + r.h, 0) + 20  // 区域高度 + 分隔线
    combinedCanvas.width = combinedWidth
    combinedCanvas.height = combinedHeight
    const combinedCtx = combinedCanvas.getContext('2d')
    
    let currentY = 0
    
    regions.forEach((region, index) => {
      // 从临时canvas中裁剪区域
      const regionCanvas = document.createElement('canvas')
      regionCanvas.width = region.w
      regionCanvas.height = region.h
      const regionCtx = regionCanvas.getContext('2d')
      
      // 绘制区域到regionCanvas
      regionCtx.drawImage(tempCanvas, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h)
      
      // 将区域绘制到combinedCanvas
      combinedCtx.drawImage(regionCanvas, 0, currentY)
      currentY += region.h
      
      // 添加分隔线
      if (index < regions.length - 1) {
        combinedCtx.fillStyle = '#333333'
        combinedCtx.fillRect(0, currentY, combinedWidth, 5)
        currentY += 5
      }
    })
    
    const imageData = combinedCanvas.toDataURL('image/jpeg', 0.95)
    return imageData.split(',')[1]
  }

  // Analyze game screen using AI
  async analyzeScreen(videoElement) {
    if (!this.isConfigured()) {
      throw new Error('请先配置AI API密钥')
    }

    if (!videoElement) {
      throw new Error('无法捕获画面，请确保屏幕共享已开启')
    }

    try {
      this.analysisCount++
      
      const imageBase64 = this.captureFrame(videoElement)
      
      if (this.apiProvider === 'openai') {
        return await this.analyzeWithOpenAI(imageBase64)
      } else if (this.visionProviders[this.apiProvider]) {
        return await this.analyzeWithDeepSeekVision(imageBase64)
      } else {
        return await this.analyzeWithCustomAPI(videoElement)
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
      throw error
    }
  }

  // Analyze with OpenAI Vision API
  async analyzeWithOpenAI(imageBase64) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: this.getVisionAnalysisPrompt()
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'low' // Use low detail to save costs
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'OpenAI API请求失败')
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content || ''
    
    return this.parseAIResponse(analysisText, true)
  }

  // Analyze with Vision API (支持阿里云通义千问、智谱AI、DeepSeek)
  async analyzeWithDeepSeekVision(imageBase64) {
    const providerConfig = this.visionProviders[this.apiProvider] || this.visionProviders.qwen
    
    console.log(`使用Vision服务商: ${providerConfig.name}`)
    
    const requestBody = {
      model: providerConfig.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: this.getVisionAnalysisPrompt()
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    }
    
    const response = await fetch(providerConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`${providerConfig.name} API错误:`, errorData)
      throw new Error(errorData.error?.message || `${providerConfig.name} API请求失败 (${response.status})`)
    }

    const data = await response.json()
    console.log(`${providerConfig.name}完整响应:`, JSON.stringify(data, null, 2))
    
    const analysisText = data.choices?.[0]?.message?.content || ''
    
    if (!analysisText) {
      const reasoningContent = data.choices?.[0]?.message?.reasoning_content || ''
      if (reasoningContent) {
        console.log('使用reasoning_content:', reasoningContent)
        return this.parseAIResponse(reasoningContent, true)
      }
      throw new Error(`${providerConfig.name}返回内容为空`)
    }
    
    return this.parseAIResponse(analysisText, true)
  }

  // Analyze with OCR + DeepSeek (备用方案，当Vision不可用时)
  async analyzeWithOCRAndDeepSeek(videoElement) {
    // 第一步：使用OCR识别画面信息
    console.log('开始OCR识别...')
    const ocrResult = await ocrService.recognizeGameInfo(videoElement)
    
    if (!ocrResult) {
      throw new Error('OCR识别失败，请确保画面清晰')
    }

    console.log('OCR识别结果:', ocrResult)

    // 第二步：将OCR识别的文字信息发送给DeepSeek分析
    const textPrompt = this.getTextAnalysisPrompt(ocrResult)
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          {
            role: 'user',
            content: textPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'DeepSeek API请求失败')
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content || ''
    
    // 合并OCR识别的数字信息
    const parsedResult = this.parseAIResponse(analysisText, true)
    
    // 用OCR识别的数字覆盖AI分析结果（OCR更准确）
    if (ocrResult.goldNumber) parsedResult.gold = ocrResult.goldNumber.toString()
    if (ocrResult.healthNumber) parsedResult.health = ocrResult.healthNumber.toString()
    if (ocrResult.levelNumber) parsedResult.level = ocrResult.levelNumber.toString()
    
    return parsedResult
  }

  // Analyze with custom API
  async analyzeWithCustomAPI(videoElement) {
    const customEndpoint = localStorage.getItem('ai_custom_endpoint') || ''
    if (!customEndpoint) {
      throw new Error('请配置自定义API端点')
    }

    const imageBase64 = this.captureFrame(videoElement)
    const response = await fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        image: imageBase64,
        prompt: this.getVisionAnalysisPrompt()
      })
    })

    if (!response.ok) {
      throw new Error('自定义API请求失败')
    }

    const data = await response.json()
    return this.parseAIResponse(data.analysis || data.result || '', true)
  }

  // Vision分析提示词（用于OpenAI等支持图片的AI）
  getVisionAnalysisPrompt() {
    return `你是金铲铲之战S8教练AI。基于截图识别数据并给出建议。只返回纯JSON。

【UI位置 - 严格按此寻找】
- 金币: 屏幕【右下角】，金色圆圈💰图标旁边的白色数字，范围0-999。每10金会亮一盏灯
- 血量: 屏幕【右侧记分板】，显示8名玩家血量和排名的心形❤️旁数字，范围1-100(初始100)
- 等级: 屏幕【左下角】，显示"X级"或等级数字，范围1-10，旁有黄色经验条
- 回合: 屏幕【顶部中间】，格式"阶段-回合"如"2-7"，在比分上方
- 羁绊: 屏幕【左侧】，已激活羁绊和数量。S8羁绊含：战斗机甲、怪兽、福牛守护者、地下魔盗团、星之守护者、源计划激光特工、小天才、超级英雄、决斗大师、枪手、斗士、灵能使、爱心使者、秘术卫士、护卫、黑客、淘气包
- 底排棋子: 屏幕【底部正下方】，你场上和备战区的棋子

【注意区分】
- 金币≠场上数字，是右下角金色图标旁的数字
- 血量≠顶部数字，是右侧记分板中属于你自己的血量

【羁绊分析规则 - 重要！】
- 只列出当前实际激活(亮起)的羁绊，不要列灰暗的羁绊
- 如果某个羁绊只差1个棋子就能触发更高等级（如小天才2→3），在suggestions里提醒
- synergyHint字段：列出"差1个"可激活或升档的羁绊，格式如"差1个小天才激活3小天才"
- 如果阵容已经成型，给出阵容名（如"机甲贾克斯"、"小天才阵容")

【S8怪兽入侵赛季完整英雄名单 - 禁止编造！】
只能推荐以下59个英雄，禁止编造不存在的英雄：
1费(13):加里奥/凯尔/艾希/普朗克/布里茨/雷克顿/孙悟空/内瑟斯/波比/泰隆/拉克丝/璐璐/塞拉斯
2费(13):安妮/希维尔/墨菲特/李青/伊泽瑞尔/菲奥娜/德莱文/亚索/卡蜜尔/金克丝/蔚/悠米/芮尔
3费(13):乐芙兰/阿利斯塔/贾克斯/科加斯/拉莫斯/娑娜/薇恩/锐雯/佐伊/卡莎/维克兹/赛娜/尼菈
4费(12):索拉卡/厄运小姐/瑟庄妮/奥瑞利安·索尔/扎克/塔莉垭/卑尔维斯/佛耶戈/劫/艾克/莎弥拉/瑟提
5费(8):厄加特/费德提克/努努和威朗普/迦娜/莫德凯撒/蕾欧娜/辛德拉/厄斐琉斯
羁绊归属：小天才(波比/璐璐/安妮/佐伊/努努)、战斗机甲(孙悟空/贾克斯/锐雯/瑟提/蕾欧娜)、怪兽(科加斯/拉莫斯/维克兹/奥瑞利安·索尔/扎克/卑尔维斯/厄加特/费德提克)、超级英雄(普朗克/墨菲特/李青/金克丝/塞拉斯/佛耶戈/莎弥拉)、源计划激光特工(艾希/雷克顿/亚索/瑟庄妮/劫/莫德凯撒)、地下魔盗团(凯尔/伊泽瑞尔/蔚/娑娜/莎弥拉)、星之守护者(拉克丝/悠米/芮尔/卡莎/奥瑞利安·索尔/塔莉垭/艾克/辛德拉)、福牛守护者(泰隆/菲奥娜/安妮/阿利斯塔/佛耶戈/厄斐琉斯)、决斗大师(凯尔/菲奥娜/亚索/贾克斯/薇恩/劫/尼菈)、枪手(希维尔/德莱文/金克丝/赛娜/厄运小姐/厄斐琉斯)、斗士(雷克顿/孙悟空/墨菲特/李青/蔚/科加斯/锐雯/瑟庄妮/扎克/瑟提)、灵能使(拉克丝/安妮/乐芙兰/娑娜/维克兹/塔莉垭)、爱心使者(璐璐/李青/悠米/娑娜/索拉卡/辛德拉)、护卫(布里茨/波比/塞拉斯/阿利斯塔/芮尔/蕾欧娜)、黑客(卡蜜尔/乐芙兰/佐伊/劫)、秘术卫士(悠米/阿利斯塔/艾克/迦娜)、精英战士(德莱文/厄运小姐/莎弥拉/瑟提/莫德凯撒)、情报特工(艾希/伊泽瑞尔/蔚/薇恩/卡莎)、管理员程序(布里茨/卡蜜尔/乐芙兰/索拉卡)、平民英雄(加里奥/亚索/迦娜)、堕落使者(费德提克)

【经济规则】
- 每10金=1利息，最多50金=5利息。连胜：2-3连+1、4连+2、5连+3金/回合
- 标准节奏：2-1升4→2-5升5→3-2升6→4-1升7→4-5/5-1升8
- 血量<60时3-2花10-20金D牌保血。血<40必须花钱！7级不D三星四费

【决策矩阵】
金≥50血≥70→升人口 | 金≥50血50-70→卡利息升 | 金≥50血<50→D牌保血
金30-50血≥60→存钱 | 金30-50血<60→适当D | 金<30血<40→全力D
连胜→可牺牲利息保连胜 | 连败→吃满利息走精致连败

【刷新概率(%): 1费/2费/3费/4费/5费】
Lv4:55/30/15/0/0 Lv5:45/33/20/2/0 Lv6:30/40/25/5/0 Lv7:19/30/35/15/1 Lv8:16/20/35/25/4 Lv9:9/15/30/30/16

【进阶战略 - 务必参考给出建议】
1. 站位: 主C放后排角位防刺客，主坦顶前排中间吸收伤害。有刺客时C位移到第二排。
2. 转型: 3阶段发现2家以上同行→果断转阵容。4-1看同行数量决定冲8抢牌还是7级D三星。
3. 装备: 选秀弓>大剑>拳套优先。前期日炎/狂徒/羊刀即插即用。连胜时提前合成保连胜。
4. D牌: D到10/20/30/40整数停手吃利息。4-1升7小D找1张4费，4-5升8大D成型。
5. 运营: 前期一胜一负最亏，要么连胜偷利息要么连败稳经济。
6. 观察: 多看对手备战区和阵容，预判克制关系，避开同行。

【装备速查】物理:无尽(大剑+拳套)/巨杀(大剑+弓)/饮血(大剑+斗篷)/羊刀(弓+大棒) 法系:帽子(大棒+大棒)/法爆(大棒+拳套)/蓝霸符(眼泪+眼泪) 坦克:狂徒(腰带+腰带)/龙牙(斗篷+斗篷)/反甲(锁子甲+锁子甲)/日炎(腰带+锁子甲)

【建议规则 - 必须可执行！每条建议都要包含具体数值和操作步骤】
suggestions数组中每条建议必须包含：
1. icon: 表情符号（如💰、🔗、📈等）
2. title: 简短标题（如"花20金D牌"、"找1张安妮"）
3. content: 【必须包含】具体数值阈值 + 具体操作步骤，例如：
   ✅ 正确："金币50，花20金D两下，找1张安妮激活3小天才，剩余30金吃3利息"
   ✅ 正确："血量45安全，花30金D找瑟提/瑟庄妮，凑齐战斗机甲+精英战士后锁血"
   ❌ 错误："建议D牌"（无数值无步骤）
   ❌ 错误："小天才差1个"（没说找谁）

upgradeHint格式："当前X级升Y级需N金币(M经验)，建议Z-1升Z后剩余W金币"
rollHint格式："血量X安全/危险，花Y金币DZ下，找[具体英雄名]，目标[具体数值]"
equipmentHint格式："给[英雄]合[装备名]([散件1]+[散件2])，优先[原因]"

示例: {"phase":"3-1","gold":"50","health":"59","level":"6","synergies":[{"name":"小天才","count":2},{"name":"斗士","count":2}],"teamName":"小天才斗士雏形","synergyHint":"差1个小天才激活3小天才，差1个斗士激活4斗士","suggestions":[{"icon":"🔗","title":"花20金D找安妮","content":"金币50，花20金D两下，找1张安妮激活3小天才，剩余30金吃3利息"},{"icon":"💰","title":"保持金币吃息","content":"当前50金吃满5利息，升7需24金，升7后剩26金可D两下找瑟提"},{"icon":"📈","title":"升级时机","content":"当前6级，建议3-2升7人口，7级后4费卡概率15%，可找瑟提/瑟庄妮"}],"upgradeHint":"当前6级升7需24金币(12经验)，建议3-2升7后剩26金币吃2利息","rollHint":"血量59安全，阵容2小天才+2斗士成型中，暂不D牌存利息","equipmentHint":"优先给贾克斯合羊刀(弓+大棒)叠攻速，其次给孙悟空合日炎(腰带+锁子甲)前排坦度"}
`
  }

  // 文本分析提示词（用于OCR+DeepSeek组合）
  getTextAnalysisPrompt(ocrResult) {
    return `根据OCR识别的游戏画面信息，返回JSON格式分析结果。

OCR识别数据：
- 金币: ${ocrResult.goldNumber || '未识别'}
- 血量: ${ocrResult.healthNumber || '未识别'}
- 等级: ${ocrResult.levelNumber || '未识别'}
- 英雄区域: ${ocrResult.heroesText || '未识别'}
- 羁绊区域: ${ocrResult.synergiesText || '未识别'}

必须返回以下JSON结构（不要添加任何其他文字）：
{"phase":"游戏阶段","synergies":[{"name":"羁绊名","count":人数}],"teamName":"阵容名","suggestions":[{"icon":"emoji","title":"标题","content":"内容"}],"upgradeHint":"升级建议","rollHint":"D牌建议","equipmentHint":"装备建议"}

S8赛季羁绊：战斗机甲、怪兽、福牛守护者、地下魔盗团、星之守护者、源计划激光特工、小天才、超级英雄、决斗大师、枪手、斗士、灵能使。`
  }

  // Validate number is within valid range
  validateNumber(value, min, max, defaultValue) {
    const num = parseInt(value)
    if (isNaN(num) || num < min || num > max) {
      return defaultValue
    }
    return num.toString()
  }

  // Validate game data against game rules
  validateGameData(parsed) {
    const result = { ...parsed }
    
    result.gold = this.validateNumber(parsed.gold, 0, 999, '未识别')
    result.health = this.validateNumber(parsed.health, 1, 100, '未识别')
    result.level = this.validateNumber(parsed.level, 1, 10, '未识别')
    
    if (parsed.phase && !parsed.phase.match(/^\d+-\d+$/)) {
      result.phase = '未识别'
    }
    
    if (parsed.synergies && Array.isArray(parsed.synergies)) {
      result.synergies = parsed.synergies.filter(s => 
        s.name && typeof s.count === 'number' && s.count >= 1
      )
    } else {
      result.synergies = []
    }
    
    return result
  }

  // Check if two values are reasonably close (within tolerance)
  isClose(value1, value2, tolerance = 10) {
    const num1 = parseInt(value1)
    const num2 = parseInt(value2)
    if (isNaN(num1) || isNaN(num2)) return false
    return Math.abs(num1 - num2) <= tolerance
  }

  // Multi-frame verification - compare with historical data
  verifyWithHistory(currentData) {
    if (this.historyBuffer.length === 0) {
      this.historyBuffer.push(currentData)
      return currentData
    }
    
    const recentData = this.historyBuffer.slice(-3)
    const verifiedData = { ...currentData }
    
    if (currentData.gold === '未识别' && recentData.some(d => d.gold !== '未识别')) {
      verifiedData.gold = recentData.find(d => d.gold !== '未识别').gold
    }
    
    if (currentData.health === '未识别' && recentData.some(d => d.health !== '未识别')) {
      verifiedData.health = recentData.find(d => d.health !== '未识别').health
    }
    
    if (currentData.level === '未识别' && recentData.some(d => d.level !== '未识别')) {
      verifiedData.level = recentData.find(d => d.level !== '未识别').level
    }
    
    if (currentData.gold !== '未识别') {
      const recentGold = recentData.find(d => d.gold !== '未识别')?.gold
      if (recentGold && !this.isClose(currentData.gold, recentGold, 30)) {
        verifiedData.gold = recentGold
        console.log(`金币识别异常: 当前${currentData.gold}, 历史${recentGold}, 使用历史值`)
      }
    }
    
    if (currentData.health !== '未识别') {
      const recentHealth = recentData.find(d => d.health !== '未识别')?.health
      if (recentHealth && !this.isClose(currentData.health, recentHealth, 20)) {
        verifiedData.health = recentHealth
        console.log(`血量识别异常: 当前${currentData.health}, 历史${recentHealth}, 使用历史值`)
      }
    }
    
    this.historyBuffer.push(currentData)
    if (this.historyBuffer.length > this.maxHistorySize) {
      this.historyBuffer.shift()
    }
    
    return verifiedData
  }

  // Calculate confidence score for the analysis
  calculateConfidence(data) {
    let score = 0
    
    if (data.gold !== '未识别') score += 25
    if (data.health !== '未识别') score += 25
    if (data.level !== '未识别') score += 25
    if (data.phase !== '未识别') score += 25
    
    return score / 100
  }

  // Parse AI response into structured data
  parseAIResponse(responseText, isRealAnalysis = false) {
    console.log('AI返回原始内容:', responseText)
    
    try {
      let jsonStr = null
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }
      
      const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim()
      }
      
      if (jsonStr) {
        try {
          const parsed = JSON.parse(jsonStr)
          console.log('解析成功:', parsed)
          
          const validated = this.validateGameData(parsed)
          const verified = this.verifyWithHistory(validated)
          const confidence = this.calculateConfidence(verified)
          
          return {
            ...verified,
            isRealAnalysis: isRealAnalysis,
            analysisTime: new Date().toLocaleTimeString(),
            confidence: confidence
          }
        } catch (parseError) {
          console.error('JSON解析失败:', parseError, '原始字符串:', jsonStr)
        }
      }
      
      console.log('尝试从文本提取信息...')
      return this.parseTextResponse(responseText, isRealAnalysis)
      
    } catch (error) {
      console.error('解析完全失败:', error)
      throw new Error('AI返回的数据格式无法解析，请查看控制台日志')
    }
  }

  // 从纯文本响应中提取信息（备用方案）
  parseTextResponse(text, isRealAnalysis) {
    // 提取数字信息
    const goldMatch = text.match(/金币[：:]\s*(\d+)/) || text.match(/gold[：:]\s*(\d+)/i)
    const healthMatch = text.match(/血量[：:]\s*(\d+)/) || text.match(/health[：:]\s*(\d+)/i)
    const levelMatch = text.match(/等级[：:]\s*(\d+)/) || text.match(/level[：:]\s*(\d+)/i)
    
    // 提取阶段
    const phaseMatch = text.match(/阶段[：:]\s*(前期|中期|后期|决赛圈)/) || text.match(/phase[：:]\s*(\w+)/i)
    
    // 提取阵容名称
    const teamMatch = text.match(/阵容[：:]\s*([^\n]+)/) || text.match(/teamName[：:]\s*([^\n]+)/i)
    
    return {
      phase: phaseMatch ? phaseMatch[1] : '中期',
      gold: goldMatch ? goldMatch[1] : '20',
      health: healthMatch ? healthMatch[1] : '80',
      level: levelMatch ? levelMatch[1] : '6',
      synergies: [],
      teamName: teamMatch ? teamMatch[1].trim() : '未知阵容',
      suggestions: [
        { icon: '📊', title: '分析结果', content: text.substring(0, 200) + '...' }
      ],
      upgradeHint: '请查看详细分析',
      rollHint: '请查看详细分析',
      equipmentHint: '请查看详细分析',
      isRealAnalysis: isRealAnalysis,
      analysisTime: new Date().toLocaleTimeString(),
      rawText: text  // 保留原始文本供调试
    }
  }

  // Get usage statistics
  getStats() {
    return {
      analysisCount: this.analysisCount,
      lastAnalysis: this.lastAnalysis,
      isConfigured: this.isConfigured(),
      provider: this.apiProvider
    }
  }

  // 初始化OCR服务（可以提前初始化以加快首次分析速度）
  async initOCR() {
    if (!this.ocrInitialized) {
      await ocrService.initialize()
      this.ocrInitialized = true
    }
  }
}

// Export singleton instance
export const aiAnalysisService = new AIAnalysisService()