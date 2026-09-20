import GameData from '../models/GameData.js'

export const getGameData = async (req, res) => {
  try {
    const { type, version } = req.query
    const query = { isActive: true }
    
    if (type) query.type = type
    if (version) query.version = version
    
    const data = await GameData.find(query).sort({ createdAt: -1 })
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getGameDataById = async (req, res) => {
  try {
    const data = await GameData.findById(req.params.id)
    if (!data) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createGameData = async (req, res) => {
  try {
    const { version, type, data, source } = req.body
    const gameData = await GameData.create({
      version,
      type,
      data,
      source,
      isActive: true
    })
    res.status(201).json({ success: true, data: gameData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateGameData = async (req, res) => {
  try {
    const { version, type, data, source, isActive } = req.body
    const gameData = await GameData.findByIdAndUpdate(
      req.params.id,
      { version, type, data, source, isActive },
      { new: true }
    )
    if (!gameData) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, data: gameData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteGameData = async (req, res) => {
  try {
    const gameData = await GameData.findByIdAndDelete(req.params.id)
    if (!gameData) {
      return res.status(404).json({ success: false, message: '数据不存在' })
    }
    res.json({ success: true, message: '数据已删除' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getActiveVersion = async (req, res) => {
  try {
    const activeData = await GameData.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(1)
    
    if (activeData.length === 0) {
      return res.json({ success: true, data: { version: 'S8怪兽入侵返厂' } })
    }
    
    res.json({ success: true, data: { version: activeData[0].version } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const bulkCreateGameData = async (req, res) => {
  try {
    const { version, items } = req.body
    const createdItems = []
    
    for (const item of items) {
      const gameData = await GameData.create({
        version,
        type: item.type,
        data: item.data,
        source: item.source || '',
        isActive: true
      })
      createdItems.push(gameData)
    }
    
    res.status(201).json({ success: true, data: createdItems, count: createdItems.length })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}