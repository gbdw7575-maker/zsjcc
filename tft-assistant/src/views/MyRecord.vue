<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto min-h-screen">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </span>
        我的战绩
      </h1>
      <div class="flex items-center gap-2">
        <button
          @click="syncFromClient"
          :disabled="syncing"
          class="px-4 py-2 rounded-xl font-semibold text-sm bg-white/10 text-gray-200 hover:bg-white/15 disabled:opacity-40 transition-all"
        >
          {{ syncing ? '同步中...' : '同步本机战绩' }}
        </button>
        <button
        @click="showForm = !showForm"
        class="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
        :class="showForm ? 'bg-white/10 text-gray-300 hover:bg-white/15' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90'"
      >
        {{ showForm ? '收起' : '+ 录入战绩' }}
      </button>
      </div>
    </div>

    <!-- 录入表单 -->
    <div
      v-if="showForm"
      class="mb-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5"
    >
      <h2 class="text-white font-semibold mb-4 text-sm flex items-center gap-2">
        <span class="w-1.5 h-4 rounded bg-emerald-400"></span>录入新对局
      </h2>

      <div class="space-y-4">
        <!-- 排名 + 模式 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 排名选择 -->
          <div>
            <label class="text-gray-400 text-xs mb-2 block">最终排名</label>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="p in 8"
                :key="p"
                type="button"
                @click="form.placement = p"
                class="w-9 h-9 rounded-lg text-sm font-bold transition-all border"
                :class="form.placement === p
                  ? p === 1
                    ? 'bg-yellow-500 border-yellow-400 text-black'
                    : p <= 4
                      ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-300'
                      : 'bg-red-500/20 border-red-400/40 text-red-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <!-- 模式 -->
          <div>
            <label class="text-gray-400 text-xs mb-2 block">游戏模式</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="m in modes"
                :key="m.value"
                type="button"
                @click="form.mode = m.value"
                class="px-3 py-2 rounded-lg text-xs transition-all border"
                :class="form.mode === m.value ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'"
              >
                {{ m.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 羁绊 -->
        <div>
          <label class="text-gray-400 text-xs mb-2 block">主要羁绊（用逗号分隔）</label>
          <input
            v-model="form.traitsInput"
            placeholder="例如：星之守护者, 灵能使, 秘术卫士"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50 transition-colors"
          />
        </div>

        <!-- 阵容英雄 -->
        <div>
          <label class="text-gray-400 text-xs mb-2 flex items-center justify-between">
            <span>核心阵容</span>
            <button @click="addUnit" type="button" class="text-emerald-400 text-xs hover:text-emerald-300">+ 添加英雄</button>
          </label>

          <div class="space-y-2">
            <div
              v-for="(unit, idx) in form.units"
              :key="idx"
              class="flex items-center gap-2 bg-white/5 rounded-xl p-2.5 border border-white/5"
            >
              <!-- 英雄选择 -->
              <div class="flex-1 relative">
                <input
                  v-model="unit.champion"
                  @focus="unit.showSuggest = true"
                  @blur="() => setTimeout(() => unit.showSuggest = false, 150)"
                  placeholder="英雄名称"
                  class="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50"
                />
                <div v-if="unit.showSuggest && filteredChampions(unit.champion).length" class="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/10 rounded-lg max-h-32 overflow-y-auto z-30">
                  <div
                    v-for="name in filteredChampions(unit.champion)"
                    :key="name"
                    @mousedown.prevent="unit.champion = name; unit.showSuggest = false"
                    class="px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 cursor-pointer"
                    :class="{ 'text-emerald-400': unit.champion === name }"
                  >
                    {{ name }}
                  </div>
                </div>
              </div>

              <!-- 星级 -->
              <div class="flex items-center gap-0.5">
                <button
                  v-for="s in [1, 2, 3]"
                  :key="s"
                  type="button"
                  @click="unit.star = s"
                  class="w-6 h-6 rounded text-xs font-bold transition-all"
                  :class="unit.star >= s ? 'text-yellow-400' : 'text-gray-600'"
                >
                  ★
                </button>
              </div>

              <button
                @click="form.units.splice(idx, 1)"
                type="button"
                class="text-gray-600 hover:text-red-400 transition-colors text-sm px-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div>
          <textarea
            v-model="form.note"
            placeholder="备注（选填，最多 200 字）"
            maxlength="200"
            rows="2"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50 transition-colors resize-none"
          ></textarea>
        </div>

        <!-- 提交 -->
        <div class="flex items-center justify-between">
          <span class="text-gray-500 text-xs">对局时间：{{ today }}</span>
          <button
            @click="submitRecord"
            :disabled="submitting || !form.placement"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {{ submitting ? '提交中...' : '确认录入' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6" v-if="stats">
      <div class="col-span-2 md:col-span-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 text-center">
        <div class="text-2xl font-bold text-white">{{ stats.totalGames }}</div>
        <div class="text-gray-500 text-[10px]">总场次</div>
      </div>
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 text-center">
        <div class="text-2xl font-bold text-yellow-400">{{ stats.winRate }}%</div>
        <div class="text-gray-500 text-[10px]">吃鸡率</div>
      </div>
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 text-center">
        <div class="text-2xl font-bold text-emerald-400">{{ stats.top4Rate }}%</div>
        <div class="text-gray-500 text-[10px]">前四率</div>
      </div>
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 text-center">
        <div class="text-2xl font-bold text-cyan-400">#{{ stats.avgPlacement }}</div>
        <div class="text-gray-500 text-[10px]">平均排名</div>
      </div>
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 text-center">
        <div class="text-2xl font-bold text-white">{{ stats.wins }}</div>
        <div class="text-gray-500 text-[10px]">吃鸡次数</div>
      </div>
    </div>

    <!-- 常用羁绊 & 英雄 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" v-if="stats?.topTraits?.length || stats?.topChampions?.length">
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4" v-if="stats.topTraits?.length">
        <h3 class="text-white font-semibold text-xs mb-3">常用羁绊</h3>
        <div class="space-y-1.5">
          <div v-for="t in stats.topTraits" :key="t.name" class="flex items-center gap-2">
            <span class="text-gray-300 text-xs flex-1">{{ traitName(t.name) }}</span>
            <span class="text-purple-400 text-[10px] font-mono">{{ t.count }}场</span>
            <div class="w-20 h-1 rounded-full bg-white/10">
              <div class="h-full rounded-full bg-purple-400/50" :style="{ width: pct(t.count, stats.totalGames) }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4" v-if="stats.topChampions?.length">
        <h3 class="text-white font-semibold text-xs mb-3">常用英雄</h3>
        <div class="space-y-1.5">
          <div v-for="c in stats.topChampions" :key="c.name" class="flex items-center gap-2">
            <span class="text-gray-300 text-xs flex-1">{{ unitName(c.name) }}</span>
            <span class="text-emerald-400 text-[10px] font-mono">{{ c.count }}场</span>
            <div class="w-20 h-1 rounded-full bg-white/10">
              <div class="h-full rounded-full bg-emerald-400/50" :style="{ width: pct(c.count, stats.totalGames) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战绩列表 -->
    <div class="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
      <div class="px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 class="text-white font-semibold text-sm">对局记录</h3>
        <span class="text-gray-500 text-xs" v-if="total >= 0">共 {{ total }} 场</span>
      </div>

      <div v-if="loading" class="p-10 text-center text-gray-500 flex items-center justify-center gap-2">
        <div class="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
        加载中...
      </div>

      <div v-else-if="!records.length" class="p-10 text-center">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-gray-500 text-sm mb-4">还没有对局记录</p>
        <button
          @click="showForm = true"
          class="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 transition-colors"
        >
          录入第一场
        </button>
      </div>

      <div v-else class="divide-y divide-white/5">
        <div
          v-for="r in records"
          :key="r._id"
          class="px-5 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors group"
        >
          <!-- 排名 -->
          <span
            class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            :class="placementBadge(r.placement)"
          >
            #{{ r.placement }}
          </span>

          <!-- 信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-white text-sm truncate">
                {{ r.traits?.length ? r.traits.slice(0, 3).map(traitName).join('、') : '未记录羁绊' }}
              </span>
              <span
                v-if="r.placement === 1"
                class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/15 text-yellow-400"
              >吃鸡</span>
            </div>
            <div class="text-gray-500 text-[11px] mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{{ modeLabel(r.mode) }}</span>
              <span v-if="r.units?.length">{{ r.units.map(u => `${unitName(u.champion)}${'★'.repeat(u.star)}`).join(' ') }}</span>
            </div>
          </div>

          <!-- 日期 + 删除 -->
          <div class="text-right flex-shrink-0 flex items-center gap-2">
            <span class="text-gray-600 text-[10px] hidden sm:inline">{{ fmtDate(r.playedAt) }}</span>
            <button
              @click="deleteRecord(r._id)"
              class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm px-1"
              title="删除"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 20" class="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <button
          @click="page > 1 && loadRecords(page - 1)"
          :disabled="page <= 1"
          class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
        >
          上一页
        </button>
        <span class="text-gray-500 text-xs">{{ page }} / {{ pages || 1 }}</span>
        <button
          @click="page < pages && loadRecords(page + 1)"
          :disabled="page >= pages"
          class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { recordApi } from '../services/api.js'
import { gameData } from '../services/gameDataService'
import { unitName, traitName } from '../services/tftNameMap'

const showForm = ref(false)
const submitting = ref(false)
const syncing = ref(false)
const loading = ref(true)
const records = ref([])
const stats = ref(null)
const total = ref(0)
const page = ref(1)
const pages = ref(1)

const modes = [
  { value: 'ranked', label: '排位赛' },
  { value: 'normal', label: '匹配' },
  { value: 'double', label: '双人' },
  { value: 'hyper_roll', label: '狂暴模式' }
]

const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})

const form = reactive({
  placement: null,
  mode: 'ranked',
  traitsInput: '',
  units: [{ champion: '', star: 1, showSuggest: false }],
  note: ''
})

const championNames = computed(() => gameData.heroes.value.map(h => h.name).sort())

const filteredChampions = (input) => {
  if (!input) return championNames.value.slice(0, 8)
  const q = input.toLowerCase()
  return championNames.value.filter(n => n.toLowerCase().includes(q)).slice(0, 8)
}

const addUnit = () => {
  form.units.push({ champion: '', star: 1, showSuggest: false })
}

const placementBadge = (p) => {
  if (p === 1) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black'
  if (p <= 4) return 'bg-emerald-400/15 text-emerald-400'
  return 'bg-red-400/10 text-red-400'
}

const modeLabel = (m) => modes.find(a => a.value === m)?.label || m
const fmtDate = (d) => {
  if (!d) return ''
  const t = new Date(d)
  return `${t.getMonth()+1}/${t.getDate()}`
}
const pct = (v, total) => total > 0 ? ((v/total)*100).toFixed(0) + '%' : '0%'

const resetForm = () => {
  form.placement = null
  form.mode = 'ranked'
  form.traitsInput = ''
  form.units = [{ champion: '', star: 1, showSuggest: false }]
  form.note = ''
}

const submitRecord = async () => {
  if (!form.placement) return
  submitting.value = true
  try {
    const traits = form.traitsInput
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(Boolean)

    const units = form.units
      .filter(u => u.champion.trim())
      .map(u => ({ champion: u.champion.trim(), star: u.star, items: [] }))

    await recordApi.create({
      placement: form.placement,
      mode: form.mode,
      traits,
      units,
      note: form.note
    })

    resetForm()
    showForm.value = false
    await loadRecords(1)
  } catch (err) {
    alert(err.response?.data?.message || '录入失败')
  } finally {
    submitting.value = false
  }
}

const loadRecords = async (p = 1) => {
  loading.value = true
  try {
    const res = await recordApi.getList({ page: p, limit: 20 })
    records.value = res.data.data.records
    stats.value = res.data.data.stats
    total.value = res.data.data.total
    page.value = res.data.data.page
    pages.value = res.data.data.pages
  } catch {
    // 无数据
  } finally {
    loading.value = false
  }
}

const deleteRecord = async (id) => {
  if (!confirm('确定删除这条记录吗？')) return
  try {
    await recordApi.delete(id)
    await loadRecords(page.value)
  } catch {
    alert('删除失败')
  }
}

const syncFromClient = async () => {
  syncing.value = true
  try {
    const res = await recordApi.syncLCU()
    const { synced, total } = res.data.data
    alert(`同步完成：新增 ${synced} 场，累计 ${total} 场`)
    await loadRecords(1)
  } catch (err) {
    alert(err.response?.data?.message || '同步失败，请确认英雄联盟客户端已启动并登录')
  } finally {
    syncing.value = false
  }
}

onMounted(() => loadRecords())
</script>
