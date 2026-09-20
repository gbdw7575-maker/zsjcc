<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">版本数据管理</h1>
          <p class="text-gray-400 mt-2">管理阵容、装备、羁绊等版本数据</p>
        </div>
        <div class="flex gap-4">
          <button @click="showAddDialog = true" class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-colors">
            + 添加数据
          </button>
          <button @click="showBulkDialog = true" class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
            批量导入
          </button>
        </div>
      </div>

      <!-- 数据类型筛选 -->
      <div class="flex gap-4 mb-6">
        <button 
          v-for="t in dataTypes" 
          :key="t.value"
          @click="activeType = t.value"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="activeType === t.value ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 数据列表 -->
      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div v-if="loading" class="text-center py-12">
          <div class="text-gray-400">加载中...</div>
        </div>
        
        <div v-else-if="filteredData.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <div class="text-gray-400">暂无数据</div>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="item in filteredData" 
            :key="item._id"
            class="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-white font-bold">{{ item.version }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{{ getTypeLabel(item.type) }}</span>
                <span v-if="item.isActive" class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">活跃</span>
              </div>
              <div class="text-gray-400 text-sm">{{ item.source || '无来源' }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ formatDate(item.createdAt) }}</div>
            </div>
            <div class="flex gap-2">
              <button @click="viewDetail(item)" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">
                查看
              </button>
              <button @click="editItem(item)" class="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm">
                编辑
              </button>
              <button @click="deleteItem(item._id)" class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加/编辑数据对话框 -->
      <el-dialog v-model="showAddDialog" :title="editingId ? '编辑版本数据' : '添加版本数据'" width="600px">
        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm mb-1">版本号</label>
            <input v-model="newItem.version" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="如: S8怪兽入侵返厂" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据类型</label>
            <select v-model="newItem.type" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white">
              <option v-for="t in dataTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据来源</label>
            <input v-model="newItem.source" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="如: 游侠网" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据内容 (JSON格式)</label>
            <textarea v-model="newItem.dataJson" rows="8" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-sm" placeholder="输入JSON数据..."></textarea>
          </div>
        </div>
        <template #footer>
          <button @click="showAddDialog = false" class="px-6 py-2 bg-white/10 text-white rounded-xl">取消</button>
          <button @click="addItem" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">{{ editingId ? '保存' : '添加' }}</button>
        </template>
      </el-dialog>

      <!-- 批量导入对话框 -->
      <el-dialog v-model="showBulkDialog" title="批量导入数据" width="700px">
        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm mb-1">版本号</label>
            <input v-model="bulkVersion" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="如: S8怪兽入侵返厂" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">批量数据 (JSON数组格式)</label>
            <textarea v-model="bulkJson" rows="12" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-sm" placeholder='[
  { "type": "team", "data": {...}, "source": "游侠网" },
  { "type": "equipment", "data": {...}, "source": "头条" }
]'></textarea>
          </div>
          <div class="text-gray-500 text-sm">
            提示：每条数据需包含 type (team/equipment/synergy/hero)、data (对象)、source (可选)
          </div>
        </div>
        <template #footer>
          <button @click="showBulkDialog = false" class="px-6 py-2 bg-white/10 text-white rounded-xl">取消</button>
          <button @click="bulkImport" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">导入</button>
        </template>
      </el-dialog>

      <!-- 详情对话框 -->
      <el-dialog v-model="showDetailDialog" title="数据详情" width="600px">
        <div v-if="selectedItem" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 rounded-xl p-4">
              <div class="text-gray-400 text-xs">版本</div>
              <div class="text-white font-bold">{{ selectedItem.version }}</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <div class="text-gray-400 text-xs">类型</div>
              <div class="text-white font-bold">{{ getTypeLabel(selectedItem.type) }}</div>
            </div>
          </div>
          <div>
            <div class="text-gray-400 text-sm mb-2">数据内容</div>
            <pre class="bg-white/5 rounded-xl p-4 text-sm text-gray-300 overflow-auto max-h-60">{{ JSON.stringify(selectedItem.data, null, 2) }}</pre>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gameDataApi } from '../services/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const gameData = ref([])
const activeType = ref('all')
const showAddDialog = ref(false)
const editingId = ref(null)
const showBulkDialog = ref(false)
const showDetailDialog = ref(false)
const selectedItem = ref(null)
const bulkVersion = ref('S8怪兽入侵返厂')
const bulkJson = ref('')

const newItem = ref({
  version: 'S8怪兽入侵返厂',
  type: 'team',
  source: '',
  dataJson: ''
})

const dataTypes = [
  { value: 'all', label: '全部' },
  { value: 'team', label: '阵容数据' },
  { value: 'equipment', label: '装备数据' },
  { value: 'synergy', label: '羁绊数据' },
  { value: 'hero', label: '英雄数据' }
]

const filteredData = computed(() => {
  if (activeType.value === 'all') return gameData.value
  return gameData.value.filter(item => item.type === activeType.value)
})

const getTypeLabel = (type) => {
  const t = dataTypes.find(d => d.value === type)
  return t ? t.label : type
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const loadGameData = async () => {
  loading.value = true
  try {
    const { data } = await gameDataApi.getGameData()
    gameData.value = data.data
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

const addItem = async () => {
  try {
    const dataObj = JSON.parse(newItem.value.dataJson)
    if (editingId.value) {
      await gameDataApi.updateGameData(editingId.value, {
        version: newItem.value.version,
        type: newItem.value.type,
        data: dataObj,
        source: newItem.value.source
      })
      ElMessage.success('保存成功')
    } else {
      await gameDataApi.createGameData({
        version: newItem.value.version,
        type: newItem.value.type,
        data: dataObj,
        source: newItem.value.source
      })
      ElMessage.success('添加成功')
    }
    showAddDialog.value = false
    editingId.value = null
    newItem.value = { version: 'S8怪兽入侵返厂', type: 'team', source: '', dataJson: '' }
    await loadGameData()
  } catch (error) {
    ElMessage.error('操作失败，请检查JSON格式')
  }
}

const bulkImport = async () => {
  try {
    const items = JSON.parse(bulkJson.value)
    await gameDataApi.bulkCreateGameData({
      version: bulkVersion.value,
      items
    })
    ElMessage.success('批量导入成功')
    showBulkDialog.value = false
    bulkJson.value = ''
    await loadGameData()
  } catch (error) {
    ElMessage.error('导入失败，请检查JSON格式')
  }
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailDialog.value = true
}

const editItem = (item) => {
  editingId.value = item._id
  selectedItem.value = item
  newItem.value = {
    version: item.version,
    type: item.type,
    source: item.source || '',
    dataJson: JSON.stringify(item.data, null, 2)
  }
  showAddDialog.value = true
}

const deleteItem = async (id) => {
  try {
    await gameDataApi.deleteGameData(id)
    ElMessage.success('删除成功')
    await loadGameData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  loadGameData()
})
</script>