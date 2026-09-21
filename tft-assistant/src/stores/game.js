import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gameData } from '../services/gameDataService'

export const useGameStore = defineStore('game', () => {
  const board = ref(Array(8).fill(null).map(() => Array(7).fill(null)))
  const selectedHero = ref(null)
  const selectedEquipment = ref(null)
  const currentSynergies = ref([])
  const currentPopulation = ref(0)
  const savedTeams = ref(JSON.parse(localStorage.getItem('savedTeams') || '[]'))

  // B3: 当前赛季（持久化到 localStorage，刷新页面后保留选择）
  const currentSeason = ref(localStorage.getItem('currentSeason') || null)
  // B3: 后端可选赛季列表（来自 gameData.availableSeasons）
  const availableSeasons = computed(() => gameData.availableSeasons.value)

  const getHeroes = computed(() => gameData.heroes.value)
  const getEquipment = computed(() => gameData.equipments.value)
  const getSynergies = computed(() => gameData.synergies.value)
  const getMetaTeams = computed(() => gameData.metaTeams.value)

  const placeHero = (hero, row, col) => {
    if (board.value[row][col]) {
      return false
    }
    board.value[row][col] = { ...hero }
    currentPopulation.value++
    updateSynergies()
    return true
  }

  const removeHero = (row, col) => {
    if (board.value[row][col]) {
      board.value[row][col] = null
      currentPopulation.value--
      updateSynergies()
    }
  }

  const clearBoard = () => {
    board.value = Array(8).fill(null).map(() => Array(7).fill(null))
    currentPopulation.value = 0
    currentSynergies.value = []
  }

  const updateSynergies = () => {
    const heroCounts = {}
    const allHeroes = board.value.flat().filter(Boolean)
    
    allHeroes.forEach(hero => {
      (hero.synergies || []).forEach(synergy => {
        heroCounts[synergy] = (heroCounts[synergy] || 0) + 1
      })
    })

    currentSynergies.value = Object.entries(heroCounts).map(([name, count]) => {
      const synergy = gameData.synergies.value.find(s => s.name === name)
      // 找不到羁绊定义（数据版本不一致）时给空 levels 兜底，防止模板读 levels 白屏
      return {
        name,
        count,
        levels: [],
        ...(synergy || {})
      }
    })
  }

  const saveTeam = (name) => {
    const team = {
      id: Date.now(),
      name,
      board: JSON.parse(JSON.stringify(board.value)),
      population: currentPopulation.value,
      synergies: [...currentSynergies.value],
      createdAt: new Date().toISOString()
    }
    savedTeams.value.push(team)
    localStorage.setItem('savedTeams', JSON.stringify(savedTeams.value))
    return team
  }

  const deleteTeam = (id) => {
    savedTeams.value = savedTeams.value.filter(t => t.id !== id)
    localStorage.setItem('savedTeams', JSON.stringify(savedTeams.value))
  }

  const loadTeam = (team) => {
    board.value = JSON.parse(JSON.stringify(team.board))
    currentPopulation.value = team.population
    currentSynergies.value = [...team.synergies]
  }

  const getEquipmentByType = (type) => {
    return gameData.equipments.value.filter(e => e.type === type)
  }

  const getSynergyByName = (name) => {
    return gameData.synergies.value.find(s => s.name === name)
  }

  const getHeroByName = (name) => {
    return gameData.heroes.value.find(h => h.name === name)
  }

  // B3: 切换当前赛季（写入 localStorage + 调 gameData.setCurrentSeason 刷新数据）
  async function setSeason(season) {
    if (!season || season === currentSeason.value) return
    currentSeason.value = season
    localStorage.setItem('currentSeason', season)
    await gameData.setCurrentSeason(season)
  }

  // B3: 刷新后端可选赛季列表（admin 页面初始化时调用）
  async function refreshSeasons() {
    return await gameData.loadSeasons()
  }

  return {
    board,
    selectedHero,
    selectedEquipment,
    currentSynergies,
    currentPopulation,
    savedTeams,
    // B3: 赛季状态 + 切换方法
    currentSeason,
    availableSeasons,
    setSeason,
    refreshSeasons,
    getHeroes,
    getEquipment,
    getSynergies,
    getMetaTeams,
    placeHero,
    removeHero,
    clearBoard,
    saveTeam,
    deleteTeam,
    loadTeam,
    getEquipmentByType,
    getSynergyByName,
    getHeroByName
  }
})
