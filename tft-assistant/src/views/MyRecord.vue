<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto min-h-screen">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold text-white flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </span>
        我的战绩
      </h1>
      <div class="flex items-center gap-2">
        <!-- A4: 主入口为"立即同步"，手动录入降级为次级按钮 -->
        <button
          @click="syncFromClient"
          :disabled="syncing"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
          :class="syncing ? 'bg-[var(--bg-card-hover)] text-gray-300' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90'"
        >
          {{ syncing ? '同步中...' : '立即同步本机战绩' }}
        </button>
        <button
          @click="showForm = !showForm"
          class="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title="手动录入（次级入口，自动同步未覆盖时使用）"
        >
          {{ showForm ? '收起录入' : '+ 手动录入' }}
        </button>
      </div>
    </div>

    <!-- A4+C3: 自动同步状态条 -->
    <div class="hud-card px-4 py-2 mb-4 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span v-if="syncStatus?.lastSyncAt">
          自动同步运行中 · 上次同步 {{ formatRelative(syncStatus.lastSyncAt) }}
          <span v-if="syncStatus.ok === false" class="text-red-400 ml-1">（{{ syncStatus.error || '失败' }}）</span>
        </span>
        <span v-else>自动同步运行中（后端每 5 分钟扫描活跃用户）</span>
      </div>
      <span class="text-gray-500">
        自动数据占比：
        <span class="text-emerald-400 font-mono">{{ profile?.overview?.autoCoverage ?? 0 }}%</span>
      </span>
    </div>

    <!-- 录入表单 -->
    <div
      v-if="showForm"
      class="mb-6 hud-card p-5"
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
                  : 'bg-white/5 border-[var(--line-soft)] text-gray-400 hover:bg-[var(--bg-card-hover)]'"
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
                :class="form.mode === m.value ? 'bg-[var(--bg-card-hover)] border-white/30 text-white' : 'bg-white/5 border-[var(--line-soft)] text-gray-400 hover:bg-[var(--bg-card-hover)]'"
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
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--line-soft)] text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50 transition-colors"
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
              class="flex items-center gap-2 bg-[var(--bg-card-hover)] rounded-lg p-2.5 border border-white/5"
            >
              <!-- 英雄选择 -->
              <div class="flex-1 relative">
                <input
                  v-model="unit.champion"
                  @focus="unit.showSuggest = true"
                  @blur="() => setTimeout(() => unit.showSuggest = false, 150)"
                  placeholder="英雄名称"
                  class="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-[var(--line-soft)] text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50"
                />
                <div v-if="unit.showSuggest && filteredChampions(unit.champion).length" class="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-[var(--line-soft)] rounded-lg max-h-32 overflow-y-auto z-30">
                  <div
                    v-for="name in filteredChampions(unit.champion)"
                    :key="name"
                    @mousedown.prevent="unit.champion = name; unit.showSuggest = false"
                    class="px-3 py-1.5 text-sm text-gray-300 hover:bg-[var(--bg-card-hover)] cursor-pointer"
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
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--line-soft)] text-white text-sm placeholder-gray-500 outline-none focus:border-emerald-400/50 transition-colors resize-none"
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
      <div class="col-span-2 md:col-span-1 hud-card p-3 text-center">
        <div class="text-2xl font-bold text-white">{{ stats.totalGames }}</div>
        <div class="text-gray-500 text-[10px]">总场次</div>
      </div>
      <div class="hud-card p-3 text-center">
        <div class="text-2xl font-bold text-yellow-400">{{ stats.winRate }}%</div>
        <div class="text-gray-500 text-[10px]">吃鸡率</div>
      </div>
      <div class="hud-card p-3 text-center">
        <div class="text-2xl font-bold text-emerald-400">{{ stats.top4Rate }}%</div>
        <div class="text-gray-500 text-[10px]">前四率</div>
      </div>
      <div class="hud-card p-3 text-center">
        <div class="text-2xl font-bold text-cyan-400">#{{ stats.avgPlacement }}</div>
        <div class="text-gray-500 text-[10px]">平均排名</div>
      </div>
      <div class="hud-card p-3 text-center">
        <div class="text-2xl font-bold text-white">{{ stats.wins }}</div>
        <div class="text-gray-500 text-[10px]">吃鸡次数</div>
      </div>
    </div>

    <!-- 常用羁绊 & 英雄 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" v-if="stats?.topTraits?.length || stats?.topChampions?.length">
      <div class="hud-card p-4" v-if="stats.topTraits?.length">
        <h3 class="text-white font-semibold text-xs mb-3">常用羁绊</h3>
        <div class="space-y-1.5">
          <div v-for="t in stats.topTraits" :key="t.name" class="flex items-center gap-2">
            <span class="text-gray-300 text-xs flex-1">{{ traitName(t.name) }}</span>
            <span class="text-[var(--accent-color)] text-[10px] font-mono">{{ t.count }}场</span>
            <div class="w-20 h-1 rounded-full bg-[var(--bg-card-hover)]">
              <div class="h-full rounded-full bg-[rgba(var(--accent-rgb),0.5)]" :style="{ width: pct(t.count, stats.totalGames) }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="hud-card p-4" v-if="stats.topChampions?.length">
        <h3 class="text-white font-semibold text-xs mb-3">常用英雄</h3>
        <div class="space-y-1.5">
          <div v-for="c in stats.topChampions" :key="c.name" class="flex items-center gap-2">
            <span class="text-gray-300 text-xs flex-1">{{ unitName(c.name) }}</span>
            <span class="text-emerald-400 text-[10px] font-mono">{{ c.count }}场</span>
            <div class="w-20 h-1 rounded-full bg-[var(--bg-card-hover)]">
              <div class="h-full rounded-full bg-emerald-400/50" :style="{ width: pct(c.count, stats.totalGames) }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战绩列表 -->
    <div class="hud-card overflow-hidden">
      <div class="px-5 py-3 border-b border-[var(--line-soft)] flex items-center justify-between">
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
          class="px-5 hover:bg-white/5 transition-colors group"
        >
          <!-- 行主体（点击可展开 AI 复盘卡片） -->
          <div
            class="py-3 flex items-center gap-3 cursor-pointer"
            @click="r.aiAdvice?.text && toggleAdvice(r._id)"
          >
            <!-- 排名 -->
            <span
              class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="placementBadge(r.placement)"
            >
              {{ r.placement === 0 ? '?' : '#' + r.placement }}
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
                <!-- A6: AI 复盘标记 -->
                <span
                  v-if="r.aiAdvice?.text"
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent-color)] flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  AI 复盘
                </span>
                <!-- 来源标记 -->
                <span
                  v-if="r.source && r.source !== 'manual'"
                  class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-400"
                >{{ r.source === 'lcu' ? '客户端同步' : r.source === 'ocr' ? 'OCR' : r.source }}</span>
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
                v-if="r.aiAdvice?.text"
                class="text-gray-500 hover:text-[var(--accent-color)] text-[10px] px-1 transition-all"
                title="查看 AI 复盘"
              >{{ expanded.has(r._id) ? '收起' : '展开' }}</button>
              <button
                @click.stop="deleteRecord(r._id)"
                class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm px-1"
                title="删除"
              >
                🗑
              </button>
            </div>
          </div>

          <!-- A6: AI 复盘卡片（可展开） -->
          <div
            v-if="r.aiAdvice?.text && expanded.has(r._id)"
            class="pb-4 pt-1 pl-10 pr-2"
          >
            <div class="hud-card p-4 bg-[var(--bg-card)] border border-[rgba(var(--accent-rgb),0.2)]">
              <!-- 快照信息 -->
              <div v-if="r.aiAdvice.snapshot" class="flex items-center gap-3 mb-3 text-xs flex-wrap">
                <span v-if="r.aiAdvice.snapshot.phase" class="text-gray-400">阶段: <span class="text-white">{{ r.aiAdvice.snapshot.phase }}</span></span>
                <span v-if="r.aiAdvice.snapshot.gold" class="text-yellow-400">金币 {{ r.aiAdvice.snapshot.gold }}</span>
                <span v-if="r.aiAdvice.snapshot.health" class="text-red-400">血量 {{ r.aiAdvice.snapshot.health }}</span>
                <span v-if="r.aiAdvice.snapshot.level" class="text-cyan-400">等级 {{ r.aiAdvice.snapshot.level }}</span>
                <span v-if="r.aiAdvice.snapshot.teamName" class="text-[var(--accent-color)]">阵容: {{ r.aiAdvice.snapshot.teamName }}</span>
                <span v-if="r.aiAdvice.provider" class="text-gray-500 ml-auto">{{ r.aiAdvice.provider }}</span>
              </div>

              <!-- 建议文本 -->
              <p class="text-gray-300 text-xs leading-relaxed mb-3">{{ r.aiAdvice.text }}</p>

              <!-- 结构化建议条目 -->
              <div v-if="r.aiAdvice.suggestions?.length" class="space-y-2">
                <div
                  v-for="(s, idx) in r.aiAdvice.suggestions"
                  :key="idx"
                  class="flex gap-2 text-xs"
                >
                  <span class="text-[var(--accent-color)] font-bold flex-shrink-0">▸</span>
                  <div>
                    <span class="text-white font-semibold">{{ s.title }}</span>
                    <span class="text-gray-400 ml-2">{{ s.content }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600">
                <span>生成于 {{ fmtDateTime(r.aiAdvice.generatedAt) }}</span>
                <button
                  v-if="r.aiAdvice.suggestions?.length"
                  @click.stop
                  class="text-gray-500 hover:text-[var(--accent-color)] transition-colors"
                >再看一次 AI 建议</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 20" class="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <button
          @click="page > 1 && loadRecords(page - 1)"
          :disabled="page <= 1"
          class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[var(--bg-card-hover)] disabled:opacity-30 transition-all"
        >
          上一页
        </button>
        <span class="text-gray-500 text-xs">{{ page }} / {{ pages || 1 }}</span>
        <button
          @click="page < pages && loadRecords(page + 1)"
          :disabled="page >= pages"
          class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[var(--bg-card-hover)] disabled:opacity-30 transition-all"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { recordApi } from '../services/api.js'
import { socketService } from '../services/socket.js'
import { useUserStore } from '../stores/user'
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
// A4+C3: 个人画像数据（含 autoCoverage 用于状态条显示）
const profile = ref(null)
// C3: 后台 worker 最近一次同步状态（lastSyncAt / synced / total / ok / error）
const syncStatus = ref(null)
let syncStatusTimer = null
// A6: 展开状态记录——记录哪些行展开了 AI 复盘卡片
const expanded = ref(new Set())
const toggleAdvice = (id) => {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}
// 时间戳格式化（含时分）
const fmtDateTime = (d) => {
  if (!d) return ''
  const t = new Date(d)
  if (isNaN(t.getTime())) return ''
  return `${t.getMonth() + 1}/${t.getDate()} ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`
}

// C3: 把 ISO 时间转成"X 分钟前 / X 小时前 / 刚刚"
const formatRelative = (iso) => {
  if (!iso) return ''
  const t = new Date(iso)
  if (isNaN(t.getTime())) return ''
  const diff = Date.now() - t.getTime()
  if (diff < 60 * 1000) return '刚刚'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}

// C3: 拉取后台同步状态（失败不阻塞主流程）
const loadSyncStatus = () => {
  recordApi.getSyncStatus()
    .then(res => { syncStatus.value = res.data.data })
    .catch(() => {})
}

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
    // A5: 同时拉取个人画像聚合（含 autoCoverage、最近 AI 复盘）
    // 失败不阻塞主流程（仅状态条数据缺失）
    recordApi.getProfile().then(p => { profile.value = p.data.data }).catch(() => {})
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
    // C3: 同步后立即刷新状态条
    loadSyncStatus()
  } catch (err) {
    alert(err.response?.data?.message || '同步失败，请确认金铲铲客户端已启动并登录')
  } finally {
    syncing.value = false
  }
}

// C5: socket 收到后台同步完成事件时的回调
const onRecordsSynced = (payload) => {
  if (!payload) return
  if (payload.synced > 0) {
    ElMessage.success(`已同步 ${payload.synced} 场新战绩${payload.account ? ' · ' + payload.account : ''}`)
    // 自动刷新战绩列表 + 状态条
    loadRecords(page.value)
    loadSyncStatus()
  } else if (payload.ok === false) {
    // 后台同步失败：用 warning 提示，不阻塞用户
    ElMessage.warning(`后台自动同步失败：${payload.error || '未知原因'}`)
    loadSyncStatus()
  }
}

const userStore = useUserStore()

// C5: 确保 socket 已连接 + 绑定 records:synced 监听
const ensureSocketListener = () => {
  // 用 token 连接 socket（如果未连接或已断开则重连）
  const token = userStore.token || localStorage.getItem('token')
  if (!token) return
  if (!socketService.connected.value || !socketService.socket) {
    try { socketService.connect(token) } catch { /* 静默 */ }
  }
  if (socketService.socket) {
    // off 再 on，避免重复监听（HMR / 路由切换）
    socketService.socket.off('records:synced', onRecordsSynced)
    socketService.socket.on('records:synced', onRecordsSynced)
  }
}

onMounted(() => {
  loadRecords()
  // C3: 进入页面立即拉一次同步状态 + 每 30s 轮询刷新
  loadSyncStatus()
  syncStatusTimer = setInterval(loadSyncStatus, 30 * 1000)
  // C5: 绑定 socket 监听后台同步完成事件
  ensureSocketListener()
})

onUnmounted(() => {
  // C3: 清理轮询定时器
  if (syncStatusTimer) {
    clearInterval(syncStatusTimer)
    syncStatusTimer = null
  }
  // C5: 移除 socket 监听（socket 实例为单例，不主动 disconnect 以免影响其他页面）
  if (socketService.socket) {
    socketService.socket.off('records:synced', onRecordsSynced)
  }
})
</script>
