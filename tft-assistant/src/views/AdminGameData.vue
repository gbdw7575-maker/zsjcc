<template>
  <div class="min-h-screen p-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">版本数据管理</h1>
          <p class="text-gray-400 mt-2">管理阵容、装备、羁绊等版本数据</p>
        </div>
        <div class="flex gap-4">
          <button @click="showAddDialog = true" class="px-6 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl transition-colors">
            + 添加数据
          </button>
          <button @click="showBulkDialog = true" class="px-6 py-2.5 bg-[var(--bg-card-hover)] hover:bg-[var(--bg-elevated)] text-white rounded-xl transition-colors">
            批量导入
          </button>
        </div>
      </div>

      <!-- B4-UI: 赛季切换器 -->
      <div class="hud-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-gray-400 text-sm">当前赛季</span>
          <span class="chip chip--accent">{{ seasons.activeSeason || 'S8' }}</span>
          <span v-if="seasons.activePatch" class="text-gray-500 text-xs">补丁 {{ seasons.activePatch }}</span>
        </div>
        <div class="flex-1" />
        <div class="flex items-center gap-2">
          <label class="text-gray-400 text-sm">切换至</label>
          <select
            v-model="pendingSeason"
            class="px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white text-sm"
          >
            <option value="">-- 选择赛季 --</option>
            <option
              v-for="s in seasons.list"
              :key="s.season"
              :value="s.season"
            >
              {{ s.season }}{{ s.patch ? `（${s.patch}）` : '' }}{{ s.isActive ? ' · 当前' : '' }}
            </option>
          </select>
          <button
            @click="setActiveSeason"
            :disabled="!pendingSeason || pendingSeason === seasons.activeSeason || switching"
            class="hud-btn hud-btn--gold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ switching ? '切换中...' : '设为当前赛季' }}
          </button>
          <button
            @click="loadSeasons"
            class="hud-btn text-sm"
          >
            刷新赛季列表
          </button>
        </div>
      </div>

      <!-- 数据类型筛选 -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          v-for="t in dataTypes"
          :key="t.value"
          @click="activeType = t.value"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="activeType === t.value ? 'bg-[var(--accent-color)] text-[#03201d]' : 'bg-[var(--bg-card-hover)] text-gray-400 hover:bg-[var(--bg-elevated)]'"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 数据列表 -->
      <div class="hud-card p-6">
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
            class="flex items-center gap-4 p-4 bg-[var(--bg-card-hover)] rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-white font-bold">{{ item.version }}</span>
                <span v-if="item.season" class="chip chip--gold text-xs">{{ item.season }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent-color)]">{{ getTypeLabel(item.type) }}</span>
                <span v-if="item.isActive" class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">活跃</span>
              </div>
              <div class="text-gray-400 text-sm">{{ item.source || '无来源' }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ formatDate(item.createdAt) }}</div>
            </div>
            <div class="flex gap-2">
              <button @click="viewDetail(item)" class="px-3 py-1.5 bg-[var(--bg-card-hover)] hover:bg-[var(--bg-elevated)] text-white rounded-lg text-sm">
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
            <label class="text-gray-400 text-sm mb-1">赛季标识</label>
            <input v-model="newItem.season" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: S8 / S10（留空将归入 active 赛季）" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">补丁号</label>
            <input v-model="newItem.patch" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: 14.5（可选）" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">版本号</label>
            <input v-model="newItem.version" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: S8怪兽入侵返厂" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据类型</label>
            <select v-model="newItem.type" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white">
              <option v-for="t in dataTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据来源</label>
            <input v-model="newItem.source" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: 游侠网" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">数据内容 (JSON格式)</label>
            <textarea v-model="newItem.dataJson" rows="8" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white font-mono text-sm" placeholder="输入JSON数据..."></textarea>
          </div>
        </div>
        <template #footer>
          <button @click="showAddDialog = false" class="px-6 py-2 bg-[var(--bg-card-hover)] text-white rounded-xl">取消</button>
          <button @click="addItem" class="px-6 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl">{{ editingId ? '保存' : '添加' }}</button>
        </template>
      </el-dialog>

      <!-- 批量导入对话框 -->
      <el-dialog v-model="showBulkDialog" title="批量导入数据" width="700px">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-gray-400 text-sm mb-1">赛季标识</label>
              <input v-model="bulkSeason" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: S8" />
            </div>
            <div>
              <label class="text-gray-400 text-sm mb-1">补丁号</label>
              <input v-model="bulkPatch" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: 14.5" />
            </div>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">版本号</label>
            <input v-model="bulkVersion" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white" placeholder="如: S8怪兽入侵返厂" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">批量数据 (JSON数组格式)</label>
            <textarea v-model="bulkJson" rows="12" class="w-full px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg text-white font-mono text-sm" placeholder='[
  { "type": "metaTeam", "data": {...}, "source": "游侠网" },
  { "type": "equipment", "data": {...}, "source": "头条" }
]'></textarea>
          </div>
          <div class="text-gray-500 text-sm">
            提示：每条数据需包含 type (metaTeam/equipment/synergy/hero/augment/pool)、data (对象)、source (可选)
          </div>
        </div>
        <template #footer>
          <button @click="showBulkDialog = false" class="px-6 py-2 bg-[var(--bg-card-hover)] text-white rounded-xl">取消</button>
          <button @click="bulkImport" class="px-6 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] rounded-xl">导入</button>
        </template>
      </el-dialog>

      <!-- 详情对话框 -->
      <el-dialog v-model="showDetailDialog" title="数据详情" width="600px">
        <div v-if="selectedItem" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[var(--bg-card-hover)] rounded-lg p-4">
              <div class="text-gray-400 text-xs">版本</div>
              <div class="text-white font-bold">{{ selectedItem.version }}</div>
            </div>
            <div class="bg-[var(--bg-card-hover)] rounded-lg p-4">
              <div class="text-gray-400 text-xs">类型</div>
              <div class="text-white font-bold">{{ getTypeLabel(selectedItem.type) }}</div>
            </div>
          </div>
          <div>
            <div class="text-gray-400 text-sm mb-2">数据内容</div>
            <pre class="bg-[var(--bg-card-hover)] rounded-lg p-4 text-sm text-gray-300 overflow-auto max-h-60">{{ JSON.stringify(selectedItem.data, null, 2) }}</pre>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gameDataApi } from '../services/api'
import { gameData as gameDataStore } from '../services/gameDataService'
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
// B4-UI: 赛季切换器状态
const bulkSeason = ref('S8')
const bulkPatch = ref('')
const pendingSeason = ref('')
const switching = ref(false)
const seasons = ref({
  list: [],
  activeSeason: '',
  activePatch: ''
})

const newItem = ref({
  season: '',
  patch: '',
  version: 'S8怪兽入侵返厂',
  type: 'metaTeam',
  source: '',
  dataJson: ''
})

const dataTypes = [
  { value: 'all', label: '全部' },
  { value: 'metaTeam', label: '阵容数据' },
  { value: 'equipment', label: '装备数据' },
  { value: 'synergy', label: '羁绊数据' },
  { value: 'hero', label: '英雄数据' },
  { value: 'augment', label: '海克斯数据' },
  { value: 'pool', label: '卡池数据' }
]

const filteredData = computed(() => {
  if (activeType.value === 'all') return gameData.value
  if (activeType.value === 'metaTeam') {
    // 历史 team 数据并入阵容数据展示
    return gameData.value.filter(item => ['metaTeam', 'team'].includes(item.type))
  }
  return gameData.value.filter(item => item.type === activeType.value)
})

const getTypeLabel = (type) => {
  if (type === 'team') return '阵容数据'
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

// B4-UI: 拉取可选赛季列表 + 当前 active 赛季/补丁
const loadSeasons = async () => {
  try {
    const { data } = await gameDataApi.listSeasons()
    const list = data?.data || []
    seasons.value.list = list
    const active = list.find(s => s.isActive)
    if (active) {
      seasons.value.activeSeason = active.season
      seasons.value.activePatch = active.patch || ''
    } else if (list.length > 0) {
      // 无 active 标记时取第一条
      seasons.value.activeSeason = list[0].season
      seasons.value.activePatch = list[0].patch || ''
    }
  } catch (error) {
    console.error('加载赛季列表失败:', error)
  }
}

// B4-UI: 一键设为当前赛季
const setActiveSeason = async () => {
  if (!pendingSeason.value || pendingSeason.value === seasons.value.activeSeason) return
  switching.value = true
  try {
    await gameDataApi.setActiveSeason(pendingSeason.value)
    ElMessage.success(`已切换为 ${pendingSeason.value} 赛季`)
    pendingSeason.value = ''
    await loadSeasons()
    await loadGameData()
    // 同步刷新全局 gameData 服务（后端 active 已切换，refresh 会拉到新赛季数据）
    await gameDataStore.refresh()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '切换赛季失败')
  } finally {
    switching.value = false
  }
}

const addItem = async () => {
  try {
    const dataObj = JSON.parse(newItem.value.dataJson)
    // 旧 team 数据保存时归一化为 metaTeam
    const normalizedType = newItem.value.type === 'team' ? 'metaTeam' : newItem.value.type
    if (editingId.value) {
      await gameDataApi.updateGameData(editingId.value, {
        season: newItem.value.season || undefined,
        patch: newItem.value.patch || undefined,
        version: newItem.value.version,
        type: normalizedType,
        data: dataObj,
        source: newItem.value.source
      })
      ElMessage.success('保存成功')
    } else {
      await gameDataApi.createGameData({
        season: newItem.value.season || undefined,
        patch: newItem.value.patch || undefined,
        version: newItem.value.version,
        type: normalizedType,
        data: dataObj,
        source: newItem.value.source
      })
      ElMessage.success('添加成功')
    }
    showAddDialog.value = false
    editingId.value = null
    newItem.value = { season: '', patch: '', version: 'S8怪兽入侵返厂', type: 'metaTeam', source: '', dataJson: '' }
    await loadGameData()
    await loadSeasons()
    // 通知全局游戏数据服务重新拉取，用户无需手动刷新页面
    await gameDataStore.refresh()
  } catch (error) {
    ElMessage.error('操作失败，请检查JSON格式')
  }
}

const bulkImport = async () => {
  try {
    const items = JSON.parse(bulkJson.value)
    await gameDataApi.bulkCreateGameData({
      season: bulkSeason.value || undefined,
      patch: bulkPatch.value || undefined,
      version: bulkVersion.value,
      items
    })
    ElMessage.success('批量导入成功')
    showBulkDialog.value = false
    bulkJson.value = ''
    await loadGameData()
    await loadSeasons()
    await gameDataStore.refresh()
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
    season: item.season || '',
    patch: item.patch || '',
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
    await loadSeasons()
    await gameDataStore.refresh()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  loadGameData()
  loadSeasons()
})
</script>