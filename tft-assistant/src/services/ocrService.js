// OCR Service for TFT Game Screen Recognition
// 使用Tesseract.js进行本地OCR识别

import Tesseract from 'tesseract.js'

class OCRService {
  constructor() {
    this.worker = null
    this.isInitialized = false
    this.initPromise = null
  }

  // 初始化OCR worker（使用中文+英文训练数据）
  async initialize() {
    if (this.isInitialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = Tesseract.createWorker('chi_sim+eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR进度: ${Math.round(m.progress * 100)}%`)
        }
      }
    }).then(worker => {
      this.worker = worker
      this.isInitialized = true
      return worker
    })

    return this.initPromise
  }

  // 从视频帧捕获图像
  captureFrame(videoElement) {
    if (!videoElement) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth || 1920
    canvas.height = videoElement.videoHeight || 1080
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    
    return canvas
  }

  // 识别指定区域的文字
  async recognizeRegion(canvas, x, y, width, height) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // 创建临时canvas裁剪指定区域
    const regionCanvas = document.createElement('canvas')
    regionCanvas.width = width
    regionCanvas.height = height
    const ctx = regionCanvas.getContext('2d')
    ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height)

    // 执行OCR识别
    const result = await this.worker.recognize(regionCanvas)
    return result.data.text.trim()
  }

  // 识别整个画面
  async recognizeFullScreen(canvas) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const result = await this.worker.recognize(canvas)
    return result.data
  }

  // 识别金铲铲游戏关键信息
  async recognizeGameInfo(videoElement) {
    const canvas = this.captureFrame(videoElement)
    if (!canvas) return null

    const width = canvas.width
    const height = canvas.height

    // 金铲铲游戏界面关键区域（基于1920x1080分辨率）
    // 这些位置可能需要根据实际游戏界面调整
    const regions = {
      // 金币区域（右上角）
      gold: { x: width * 0.85, y: height * 0.02, w: width * 0.08, h: height * 0.04 },
      // 血量区域（右上角）
      health: { x: width * 0.75, y: height * 0.02, w: width * 0.08, h: height * 0.04 },
      // 等级区域（左下角）
      level: { x: width * 0.02, y: height * 0.92, w: width * 0.05, h: height * 0.04 },
      // 回合数区域（顶部中间）
      round: { x: width * 0.45, y: height * 0.02, w: width * 0.1, h: height * 0.04 },
      // 英雄区域（下半部分中央）
      heroes: { x: width * 0.2, y: height * 0.5, w: width * 0.6, h: height * 0.35 },
      // 羁绊区域（左侧）
      synergies: { x: width * 0.02, y: height * 0.3, w: width * 0.15, h: height * 0.5 }
    }

    try {
      // 并行识别各个区域
      const results = {}
      
      // 识别数字信息
      results.gold = await this.recognizeRegion(canvas, regions.gold.x, regions.gold.y, regions.gold.w, regions.gold.h)
      results.health = await this.recognizeRegion(canvas, regions.health.x, regions.health.y, regions.health.w, regions.health.h)
      results.level = await this.recognizeRegion(canvas, regions.level.x, regions.level.y, regions.level.w, regions.level.h)
      results.round = await this.recognizeRegion(canvas, regions.round.x, regions.round.y, regions.round.w, regions.round.h)
      
      // 识别英雄和羁绊信息
      results.heroesText = await this.recognizeRegion(canvas, regions.heroes.x, regions.heroes.y, regions.heroes.w, regions.heroes.h)
      results.synergiesText = await this.recognizeRegion(canvas, regions.synergies.x, regions.synergies.y, regions.synergies.w, regions.synergies.h)

      // 提取数字
      results.goldNumber = this.extractNumber(results.gold)
      results.healthNumber = this.extractNumber(results.health)
      results.levelNumber = this.extractNumber(results.level)
      results.roundNumber = this.extractNumber(results.round)

      return results
    } catch (error) {
      console.error('OCR识别失败:', error)
      return null
    }
  }

  // 从文本中提取数字
  extractNumber(text) {
    if (!text) return null
    const match = text.match(/\d+/)
    return match ? parseInt(match[0]) : null
  }

  // 清理资源
  async terminate() {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
      this.isInitialized = false
      this.initPromise = null
    }
  }
}

// 导出单例
export const ocrService = new OCRService()