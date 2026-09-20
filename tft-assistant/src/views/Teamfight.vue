<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">阵容模拟器</h1>
          <p class="text-gray-400 mt-2">选择棋子放置到棋盘，实时查看羁绊效果</p>
        </div>
        <div class="flex items-center space-x-4">
          <el-button @click="gameStore.clearBoard" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-6 py-2 rounded-xl font-medium">
            清空棋盘
          </el-button>
          <el-button @click="showSaveDialog = true" class="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-6 py-2 rounded-xl font-medium">
            保存阵容
          </el-button>
        </div>
      </div>
      
      <div class="flex flex-col 2xl:flex-row gap-6">
        <div class="2xl:w-80 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 2xl:shrink-0 order-2 2xl:order-1">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-white mb-4">筛选条件</h3>
            <div class="flex flex-wrap gap-3">
              <el-select v-model="filterCost" placeholder="费用" class="w-24">
                <el-option label="全部" value="" />
                <el-option label="1费" :value="1" />
                <el-option label="2费" :value="2" />
                <el-option label="3费" :value="3" />
                <el-option label="4费" :value="4" />
                <el-option label="5费" :value="5" />
              </el-select>
              <el-select v-model="filterSynergy" placeholder="羁绊" class="w-32">
                <el-option label="全部" value="" />
                <el-option v-for="s in gameStore.getSynergies" :key="s.name" :label="s.name" :value="s.name" />
              </el-select>
            </div>
          </div>
          
          <div class="h-[500px] overflow-y-auto pr-2">
            <h3 class="text-lg font-bold text-white mb-4">棋子库 <span class="text-sm font-normal text-gray-400">(点击或拖拽添加)</span></h3>
            <div class="grid grid-cols-1 gap-3">
              <div 
                v-for="hero in filteredHeroes" 
                :key="hero.id"
                class="hero-card p-4 bg-white/5 rounded-xl cursor-pointer transition-all border border-white/10"
                :class="{ 'ring-2 ring-purple-500 bg-purple-500/20': selectedHero?.id === hero.id, 'hover:bg-white/10 hover:border-white/20': selectedHero?.id !== hero.id }"
                draggable="true"
                @click="addHeroToBoard(hero)"
                @dragstart="handleDragStart($event, hero)"
                @dragend="handleDragEnd"
              >
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-12 h-12 bg-center bg-no-repeat"
                      :class="costBorderClass(hero.cost)"
                      :style="{ backgroundImage: `url(${hero.icon})`, backgroundSize: 'cover' }"
                    ></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-white font-bold text-lg">{{ hero.name }}</span>
                      <span :class="costClass(hero.cost)" class="text-xs px-2 py-1 rounded-lg font-bold">{{ hero.cost }}费</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="s in hero.synergies" :key="s" class="text-xs px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded-full">{{ s }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex-1 min-w-0 order-1 2xl:order-2">
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <span class="text-white">当前人口:</span>
                <span class="text-2xl font-bold" :class="gameStore.currentPopulation >= 9 ? 'text-red-400' : 'text-purple-400'">{{ gameStore.currentPopulation }}/9</span>
              </div>
              <div v-if="selectedHero" class="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl ml-4">
                <span class="text-purple-300">已选择:</span>
                <span class="text-white font-bold">{{ selectedHero.name }}</span>
                <button @click="selectedHero = null" class="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="board-wrapper">
              <div class="board-container">
                <div class="board">
                  <div 
                    v-for="(row, rowIndex) in gameStore.board" 
                    :key="rowIndex"
                    class="board-row"
                  >
                    <div 
                      v-for="(cell, colIndex) in row" 
                      :key="colIndex"
                      class="board-cell"
                      :class="{ 'has-hero': cell, 'highlight': canPlace(rowIndex, colIndex) }"
                      @click="handleBoardClick(rowIndex, colIndex)"
                      @dragover="handleDragOver($event)"
                      @drop="handleDrop($event, rowIndex, colIndex)"
                      @dragenter="handleDragEnter($event, rowIndex, colIndex)"
                      @dragleave="handleDragLeave"
                    >
                      <div v-if="cell" class="hero-on-board flex flex-col items-center justify-center w-full h-full p-1 cursor-move">
                          <div class="w-12 h-12 bg-center bg-no-repeat"
                            :class="costBorderClass(cell.cost)"
                            :style="{ backgroundImage: `url(${cell.icon})`, backgroundSize: 'cover' }"
                            draggable="true"
                            @dragstart="handleHeroDragStart($event, cell, rowIndex, colIndex)"
                            @dragend="handleHeroDragEnd"
                          ></div>
                        <div class="flex items-center justify-between mb-0.5 w-full px-1">
                          <span class="text-white font-bold text-xs truncate max-w-[45px]">{{ cell.name }}</span>
                          <span :class="costClass(cell.cost)" class="text-xs px-1 rounded shrink-0">{{ cell.cost }}</span>
                        </div>
                        <div class="flex flex-wrap gap-0.5 justify-center max-w-full px-1">
                          <span v-for="s in (cell.synergies || []).slice(0, 2)" :key="s" class="text-xs px-1 py-0.5 bg-purple-500/30 text-purple-300 rounded truncate">{{ s }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-4">当前羁绊</h3>
            <div v-if="gameStore.currentSynergies.length === 0" class="text-center py-8">
              <div class="text-4xl mb-4">🔗</div>
              <p class="text-gray-400">暂无羁绊效果</p>
              <p class="text-gray-500 text-sm mt-2">选择棋子放置到棋盘查看羁绊效果</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="synergy in gameStore.currentSynergies" :key="synergy.name" class="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-white font-bold">{{ synergy.name }}</span>
                  <span class="text-purple-400 font-bold">{{ synergy.count }}/{{ (synergy.levels || []).at(-1) }}</span>
                </div>
                <p class="text-sm text-gray-300">{{ synergy.effect }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="lg:w-72 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 class="text-lg font-bold text-white mb-4">已保存阵容</h3>
          <div v-if="gameStore.savedTeams.length === 0" class="text-center py-8">
            <div class="text-4xl mb-4">💾</div>
            <p class="text-gray-400">暂无保存的阵容</p>
            <p class="text-gray-500 text-sm mt-2">配置好阵容后点击保存</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="team in gameStore.savedTeams" :key="team.id" class="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="text-white font-bold">{{ team.name }}</span>
                <div class="flex gap-2">
                  <button @click="gameStore.loadTeam(team)" class="text-green-400 hover:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button @click="gameStore.deleteTeam(team.id)" class="text-red-400 hover:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-400">人口: {{ team.population }}</div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="s in team.synergies.slice(0, 3)" :key="s.name" class="text-xs px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded">{{ s.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <el-dialog v-model="showSaveDialog" title="保存阵容" width="500px">
        <el-form :model="saveForm" :rules="saveRules" ref="saveFormRef">
          <el-form-item prop="name">
            <el-input v-model="saveForm.name" placeholder="请输入阵容名称" class="bg-white/10 border-white/20 text-white" />
          </el-form-item>
          <!-- 创作者专属：发布攻略 -->
          <el-form-item v-if="userStore.userInfo?.type === 'creator'" class="mt-4">
            <div class="p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
              <p class="text-pink-300 text-sm font-medium mb-2">🎨 创作者专属功能</p>
              <el-checkbox v-model="saveForm.publishAsGuide" class="text-gray-300">
                发布为阵容攻略（公开分享给所有玩家）
              </el-checkbox>
              <el-input 
                v-if="saveForm.publishAsGuide"
                v-model="saveForm.guideContent" 
                type="textarea" 
                :rows="4"
                placeholder="输入攻略内容：运营思路、装备推荐、站位技巧..."
                class="mt-3 bg-white/10 border-white/20 text-white"
              />
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showSaveDialog = false" class="text-gray-400">取消</el-button>
          <el-button type="primary" @click="handleSave" class="bg-gradient-to-r from-purple-500 to-pink-500 border-none">
            {{ saveForm.publishAsGuide ? '发布攻略' : '保存' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const gameStore = useGameStore()
const userStore = useUserStore()

const filterCost = ref('')
const filterSynergy = ref('')
const selectedHero = ref(null)
const showSaveDialog = ref(false)

const saveForm = ref({ 
  name: '', 
  publishAsGuide: false,
  guideContent: ''
})
const saveRules = { name: [{ required: true, message: '请输入阵容名称', trigger: 'blur' }] }
const saveFormRef = ref(null)

const filteredHeroes = computed(() => {
  let heroes = gameStore.getHeroes
  if (filterCost.value) {
    heroes = heroes.filter(h => h.cost === parseInt(filterCost.value))
  }
  if (filterSynergy.value) {
    heroes = heroes.filter(h => (h.synergies || []).includes(filterSynergy.value))
  }
  return heroes
})

const costClass = (cost) => {
  const classes = {
    1: 'bg-gray-500 text-white',
    2: 'bg-blue-500 text-white',
    3: 'bg-purple-500 text-white',
    4: 'bg-orange-500 text-white',
    5: 'bg-red-500 text-white'
  }
  return classes[cost] || 'bg-gray-500'
}

const costBorderClass = (cost) => {
  return {
    1: 'border-2 border-gray-500/50 rounded-lg',
    2: 'border-2 border-green-500/50 rounded-lg',
    3: 'border-2 border-blue-500/50 rounded-lg',
    4: 'border-2 border-purple-500/50 rounded-lg',
    5: 'border-2 border-yellow-500/50 rounded-lg'
  }[cost] || 'border-2 border-gray-500/30 rounded-lg'
}

const handleImageError = (e) => {
  e.target.src = '/images/default-hero.png'
}

const selectHero = (hero) => {
  selectedHero.value = hero
}

// 直接添加英雄到棋盘（自动找到第一个空位）
const addHeroToBoard = (hero) => {
  // 检查是否已满（9人口上限）
  if (gameStore.currentPopulation >= 9) {
    ElMessage.warning('棋盘已满，无法添加更多英雄')
    return
  }
  
  // 遍历棋盘找到第一个空位
  for (let row = 0; row < gameStore.board.length; row++) {
    for (let col = 0; col < gameStore.board[row].length; col++) {
      if (!gameStore.board[row][col]) {
        // 找到空位，放置英雄
        const success = gameStore.placeHero(hero, row, col)
        if (success) {
          ElMessage.success({
            message: `${hero.name} 已放置到棋盘`,
            duration: 1000
          })
          return
        }
      }
    }
  }
  
  // 如果没有成功放置（理论上不会发生，因为上面已经检查过人口）
  ElMessage.error('放置失败，棋盘可能已满')
}

const canPlace = (row, col) => {
  return !gameStore.board[row][col] && selectedHero.value && gameStore.currentPopulation < 9
}

const handleBoardClick = (row, col) => {
  const cell = gameStore.board[row][col]
  if (cell) {
    gameStore.removeHero(row, col)
  } else if (selectedHero.value && gameStore.currentPopulation < 9) {
    gameStore.placeHero(selectedHero.value, row, col)
  }
}

// 拖拽相关函数
let draggedHero = null
let draggedFromCell = null

const handleDragStart = (event, hero) => {
  draggedHero = hero
  draggedFromCell = null
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify(hero))
  
  // 添加拖拽样式
  event.target.classList.add('opacity-50', 'scale-95')
}

const handleHeroDragStart = (event, hero, row, col) => {
  draggedHero = hero
  draggedFromCell = { row, col }
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify(hero))
  event.dataTransfer.setData('application/x-source-position', JSON.stringify({ row, col }))
  
  // 添加拖拽样式
  event.target.classList.add('opacity-50', 'scale-95')
}

const handleHeroDragEnd = (event) => {
  draggedHero = null
  draggedFromCell = null
  
  // 移除拖拽样式
  event.target.classList.remove('opacity-50', 'scale-95')
  
  // 移除所有高亮
  document.querySelectorAll('.board-cell').forEach(cell => {
    cell.classList.remove('drag-over')
  })
}

const handleDragEnd = (event) => {
  draggedHero = null
  draggedFromCell = null
  
  // 移除拖拽样式
  event.target.classList.remove('opacity-50', 'scale-95')
  
  // 移除所有高亮
  document.querySelectorAll('.board-cell').forEach(cell => {
    cell.classList.remove('drag-over')
  })
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDragEnter = (event, row, col) => {
  event.preventDefault()
  const cell = gameStore.board[row][col]
  
  // 如果格子为空，可以放置
  if (!cell) {
    event.target.classList.add('drag-over')
  }
}

const handleDragLeave = (event) => {
  event.target.classList.remove('drag-over')
}

const handleDrop = (event, row, col) => {
  event.preventDefault()
  event.target.classList.remove('drag-over')
  
  try {
    const heroData = event.dataTransfer.getData('text/plain')
    const hero = JSON.parse(heroData)
    const sourcePosition = event.dataTransfer.getData('application/x-source-position')
    
    // 检查是否从棋盘内部拖拽
    if (sourcePosition) {
      const { row: sourceRow, col: sourceCol } = JSON.parse(sourcePosition)
      
      // 如果是同一个格子，不需要移动
      if (sourceRow === row && sourceCol === col) {
        return
      }
      
      // 先从原位置移除
      gameStore.removeHero(sourceRow, sourceCol)
      
      // 检查目标位置是否已有英雄，如果有则移除
      if (gameStore.board[row][col]) {
        gameStore.removeHero(row, col)
      }
      
      // 放置到新位置
      gameStore.placeHero(hero, row, col)
      ElMessage.success(`${hero.name} 已移动到新位置`)
    } else {
      // 从棋子库拖拽过来
      // 检查目标位置是否已有英雄
      if (gameStore.board[row][col]) {
        ElMessage.warning('该位置已有英雄')
        return
      }
      
      // 检查是否可以放置
      if (gameStore.currentPopulation < 9) {
        gameStore.placeHero(hero, row, col)
        ElMessage.success(`${hero.name} 已放置到棋盘`)
      }
    }
  } catch (error) {
    console.error('放置英雄失败:', error)
  }
}

const handleSave = async () => {
  await saveFormRef.value.validate()
  
  // 创作者发布攻略
  if (saveForm.value.publishAsGuide && userStore.userInfo?.type === 'creator') {
    if (!saveForm.value.guideContent.trim()) {
      ElMessage.warning('请输入攻略内容')
      return
    }
    gameStore.saveTeam(saveForm.value.name, {
      isGuide: true,
      guideContent: saveForm.value.guideContent,
      author: userStore.userInfo?.username,
      authorType: 'creator'
    })
    ElMessage.success('攻略发布成功！所有玩家可见')
  } else {
    // 普通保存
    gameStore.saveTeam(saveForm.value.name)
    ElMessage.success('保存成功')
  }
  
  showSaveDialog.value = false
  saveForm.value.name = ''
  saveForm.value.publishAsGuide = false
  saveForm.value.guideContent = ''
}
</script>

<style scoped>
.board-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  overflow-x: auto;
}

.board-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.board {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}

.board-row {
  display: flex;
  gap: 6px;
}

.board-cell {
  width: 75px;
  height: 70px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.board-cell:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(168, 85, 247, 0.4);
}

.board-cell.has-hero {
  background: rgba(168, 85, 247, 0.2);
  border-style: solid;
}

.board-cell.drag-over {
  background: rgba(34, 197, 94, 0.3);
  border: 3px solid #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  transform: scale(1.05);
  animation: drag-pulse 0.5s infinite;
}

@keyframes drag-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.8);
  }
}

.hero-on-board {
  user-select: none;
}

.hero-on-board img {
  pointer-events: auto;
  cursor: move;
}

.hero-on-board img:active {
  cursor: grabbing;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.board-cell.highlight {
  border-color: rgba(168, 85, 247, 0.8);
  background: rgba(168, 85, 247, 0.15);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.hero-card {
  user-select: none;
}

.hero-card:hover {
  cursor: grab;
}

.hero-card:active {
  cursor: grabbing;
}

.hero-card[draggable="true"]:active {
  opacity: 0.5;
  transform: scale(0.95);
}
</style>
