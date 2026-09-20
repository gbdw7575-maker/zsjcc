<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">装备合成</h1>
          <p class="text-gray-400 mt-2">完整的装备合成树，一键查看装备属性与合成路径</p>
        </div>
        <div class="flex items-center space-x-4">
          <el-select v-model="filterType" placeholder="装备等级">
            <el-option label="全部" value="" />
            <el-option label="基础装备" value="base" />
            <el-option label="合成装备" value="combined" />
          </el-select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="equipment in filteredEquipment" 
          :key="equipment.id"
          class="equipment-card"
          @click="showItemDetails(equipment)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <img 
                :src="equipment.icon" 
                :alt="equipment.name"
                class="w-14 h-14 rounded-xl object-contain border-2 flex-shrink-0"
                :class="typeBorderClass(equipment.category || equipment.type)"
                @error="handleItemImageError"
              />
              <div>
                <h3 class="text-xl font-bold text-white">{{ equipment.name }}</h3>
                <span :class="levelClass(equipment.type)" class="text-xs px-2 py-0.5 rounded-full">{{ equipment.type === 'base' ? '基础装备' : '合成装备' }}</span>
              </div>
            </div>
          </div>
          <div v-if="equipment.stats && Object.keys(equipment.stats).length > 0" class="flex flex-wrap gap-2 mb-4">
            <span v-for="(value, key) in equipment.stats" :key="key" class="text-xs px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full">{{ statLabel(key) }} +{{ value }}</span>
          </div>
          <div v-if="equipment.components && equipment.components.length > 0" class="p-4 bg-white/5 rounded-xl">
            <p class="text-sm text-gray-400 mb-3">合成路径:</p>
            <div class="flex items-center justify-center gap-3">
              <div v-for="(component, index) in equipment.components" :key="component" class="flex items-center">
                <img 
                  :src="getComponentIcon(component)" 
                  :alt="component"
                  class="w-10 h-10 rounded-lg object-contain border-2 border-gray-500 flex-shrink-0"
                  @error="handleItemImageError"
                />
                <span v-if="index < equipment.components.length - 1" class="text-gray-500 mx-2 text-lg font-bold">+</span>
              </div>
              <span class="text-gray-500 mx-2 text-lg font-bold">→</span>
              <img 
                :src="equipment.icon" 
                :alt="equipment.name"
                class="w-12 h-12 rounded-lg object-contain border-2 flex-shrink-0"
                :class="typeBorderClass(equipment.category || equipment.type)"
                @error="handleItemImageError"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
        <h2 class="text-2xl font-bold text-white mb-6">合成公式速览</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="recipe in compositeRecipes" :key="recipe.id" class="flex items-center gap-3 p-4 bg-white/5 rounded-xl min-w-0">
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <img 
                :src="getComponentIcon(recipe.component1)" 
                :alt="recipe.component1"
                class="w-10 h-10 rounded-lg object-contain border-2 border-gray-500 flex-shrink-0"
                @error="handleItemImageError"
              />
              <span class="text-gray-400 text-sm">+</span>
              <img 
                :src="getComponentIcon(recipe.component2)" 
                :alt="recipe.component2"
                class="w-10 h-10 rounded-lg object-contain border-2 border-gray-500 flex-shrink-0"
                @error="handleItemImageError"
              />
              <span class="text-gray-400 text-sm">→</span>
            </div>
            <img 
              :src="recipe.icon" 
              :alt="recipe.name"
              class="w-10 h-10 rounded-lg object-contain border-2 flex-shrink-0"
              :class="typeBorderClass(recipe.category || recipe.type)"
              @error="handleItemImageError"
            />
            <span class="text-white font-medium text-sm truncate">{{ recipe.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()

const filterType = ref('')

const filteredEquipment = computed(() => {
  let equipment = gameStore.getEquipment
  if (filterType.value) {
    equipment = equipment.filter(e => e.type === filterType.value)
  }
  return equipment
})

const compositeRecipes = computed(() => {
  return gameStore.getEquipment
    .filter(e => e.type === 'combined' && e.components && e.components.length >= 2)
    .map(e => ({
      id: e.id,
      name: e.name,
      icon: e.icon,
      type: e.type,
      category: e.category,
      component1: e.components[0],
      component2: e.components[1]
    }))
})

const typeBorderClass = (type) => {
  const classes = {
    'attack': 'border-red-500',
    'magic': 'border-blue-500',
    'defense': 'border-green-500',
    'utility': 'border-purple-500',
    'base': 'border-gray-400',
    'combined': 'border-yellow-500'
  }
  return classes[type] || 'border-gray-500'
}

const typeClass = (type) => {
  const classes = {
    'attack': 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-500/30',
    'magic': 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/30',
    'defense': 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/30',
    'utility': 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30'
  }
  return classes[type] || 'bg-gray-500/30'
}

const typeBadgeClass = (type) => {
  const classes = {
    'attack': 'bg-red-500/20 text-red-400',
    'magic': 'bg-blue-500/20 text-blue-400',
    'defense': 'bg-green-500/20 text-green-400',
    'utility': 'bg-purple-500/20 text-purple-400'
  }
  return classes[type] || 'bg-gray-500/20 text-gray-400'
}

const levelClass = (type) => {
  return type === 'base' ? 'bg-gray-500/30 text-gray-300' : 'bg-purple-500/30 text-purple-300'
}

const statLabel = (key) => {
  const labels = {
    attack: '攻击力',
    spellPower: '法强',
    health: '生命值',
    armor: '护甲',
    magicResist: '魔抗',
    critChance: '暴击率',
    attackSpeed: '攻击速度',
    mana: '法力值',
    lifeSteal: '生命偷取'
  }
  return labels[key] || key
}

const handleItemImageError = (e) => {
  e.target.src = '/images/items/default-item.png'
}

const getComponentIcon = (name) => {
  const equipment = gameStore.getEquipment.find(e => e.name === name)
  if (equipment && equipment.icon) {
    return equipment.icon
  }
  
  // 如果找不到，尝试通过 enName 查找
  const byEnName = gameStore.getEquipment.find(e => e.enName === name)
  if (byEnName && byEnName.icon) {
    return byEnName.icon
  }
  
  // 返回默认图标
  return '/images/items/default-item.png'
}

const showItemDetails = (equipment) => {
  // 可以在这里添加点击装备显示详情的逻辑
  console.log('Clicked item:', equipment.name)
}
</script>

<style scoped>
.equipment-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  transform: translateY(-3px);
}
</style>
