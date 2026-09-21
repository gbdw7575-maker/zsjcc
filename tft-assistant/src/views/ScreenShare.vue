<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- 头部 -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <span class="text-3xl">📺</span>
              实时对战指导
            </h1>
            <p class="text-gray-400 mt-2">共享你的游戏屏幕，获取实时阵容建议和运营指导</p>
          </div>
          
          <!-- AI配置按钮 -->
          <button 
            @click="openAIConfig"
            class="hud-btn"
          >
            <span class="text-lg">🤖</span>
            AI配置
            <span v-if="isAIConfigured" class="ml-1 px-2 py-0.5 bg-green-500/30 text-green-300 rounded text-xs">已配置</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：屏幕共享区域 -->
        <div class="lg:col-span-2 space-y-4">
          <!-- 共享控制 -->
          <div class="hud-card p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button 
                  @click="startScreenShare"
                  :disabled="isSharing || !browserSupported"
                  class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:shadow-none flex items-center gap-2"
                >
                  <span class="text-xl">{{ isSharing ? '🔴' : '🟢' }}</span>
                  {{ isSharing ? '正在共享' : '开始共享' }}
                </button>
                
                <button 
                  v-if="!browserSupported && !isSharing"
                  @click="startDemoMode"
                  class="px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <span class="text-xl">🎮</span>
                  演示模式
                </button>
                
                <button 
                  @click="stopScreenShare"
                  :disabled="!isSharing"
                  class="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 disabled:bg-white/5 text-red-400 disabled:text-gray-500 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <span class="text-xl">⏹️</span>
                  停止共享
                </button>
              </div>
              
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-400">状态：</span>
                <span :class="isSharing ? (isDemoMode ? 'text-[var(--accent-color)]' : 'text-green-400') : 'text-gray-500'" class="font-medium">
                  {{ isSharing ? (isDemoMode ? '演示模式' : '共享中') : '未共享' }}
                </span>
                <span v-if="isSharing && !isDemoMode" class="animate-pulse text-red-500">●</span>
              </div>
            </div>
            
            <!-- 浏览器不支持提示 -->
            <div v-if="!browserSupported" class="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div class="flex items-center gap-2 text-yellow-300 text-sm">
                <span>⚠️</span>
                <span>当前浏览器不支持屏幕共享功能，请使用演示模式体验功能，或切换到 Chrome/Edge/Firefox 浏览器</span>
              </div>
            </div>
          </div>

          <!-- 视频显示区域 -->
          <div class="hud-card overflow-hidden">
            <div class="relative aspect-video bg-black/50 flex items-center justify-center">
              <video 
                ref="videoRef"
                class="w-full h-full object-contain"
                autoplay
                playsinline
              ></video>
              
              <!-- 未共享时的提示 -->
              <div v-if="!isSharing" class="absolute inset-0 flex flex-col items-center justify-center">
                <!-- 浏览器不支持提示 -->
                <div v-if="!browserSupported" class="text-center">
                  <div class="text-6xl mb-4">⚠️</div>
                  <h3 class="text-xl font-bold text-yellow-300 mb-2">浏览器不支持屏幕共享</h3>
                  <p class="text-gray-500 text-center max-w-md mb-4">
                    当前浏览器不支持屏幕捕获功能，请使用 Chrome、Edge、Firefox 等现代浏览器
                  </p>
                  <div class="flex flex-wrap gap-2 justify-center">
                    <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">✓ Chrome</span>
                    <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">✓ Edge</span>
                    <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">✓ Firefox</span>
                    <span class="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">✗ Safari</span>
                  </div>
                  <button 
                    @click="startDemoMode"
                    class="mt-6 px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d] font-bold rounded-xl transition-all"
                  >
                    🎮 开启演示模式
                  </button>
                </div>
                
                <!-- 正常提示 -->
                <div v-else>
                  <div class="text-6xl mb-4">🎮</div>
                  <h3 class="text-xl font-bold text-gray-300 mb-2">准备共享游戏画面</h3>
                  <p class="text-gray-500 text-center max-w-md">
                    点击"开始共享"按钮，选择金铲铲之战游戏窗口或整个屏幕进行共享
                  </p>
                  <div class="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <span class="px-2 py-1 bg-[rgba(var(--accent-rgb),0.12)] rounded">提示</span>
                    <span>建议选择游戏窗口以获得最佳识别效果</span>
                  </div>
                </div>
              </div>
              
              <!-- 共享时的覆盖层 -->
              <div v-if="isSharing" class="absolute top-4 left-4 flex items-center gap-2">
                <span v-if="isDemoMode" class="px-3 py-1 bg-[rgba(var(--accent-rgb),0.8)] text-white text-sm font-medium rounded-lg flex items-center gap-1">
                  <span>🎮</span>
                  演示模式
                </span>
                <span v-else class="px-3 py-1 bg-red-500/80 text-white text-sm font-medium rounded-lg flex items-center gap-1">
                  <span class="animate-pulse">●</span>
                  LIVE
                </span>
                <span class="px-3 py-1 bg-black/50 text-white text-sm rounded-lg">
                  {{ shareTime }}s
                </span>
              </div>
            </div>
          </div>

          <!-- 画面分析区域 -->
          <div v-if="isSharing" class="hud-card p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span class="text-xl">🔍</span>
                画面分析
              </h3>
              
              <div class="flex items-center gap-2">
                <span 
                  v-if="lastAnalysisType === 'AI'" 
                  class="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs flex items-center gap-1"
                >
                  <span>🤖</span>
                  AI分析
                </span>
                <span 
                  v-else-if="lastAnalysisType === 'Mock'" 
                  class="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs flex items-center gap-1"
                >
                  <span>📊</span>
                  模拟数据
                </span>
                <span 
                  v-else-if="lastAnalysisType === 'Error'" 
                  class="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs flex items-center gap-1"
                >
                  <span>❌</span>
                  分析失败
                </span>
                <span 
                  v-if="isAnalyzing" 
                  class="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs flex items-center gap-1 animate-pulse"
                >
                  <span>⏳</span>
                  分析中...
                </span>
                <span 
                  v-if="!isAIConfigured" 
                  class="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs"
                >
                  未配置AI
                </span>
                
                <span 
                  v-if="lastAnalysisType === 'AI' && analysisConfidence > 0"
                  class="px-2 py-1 rounded text-xs flex items-center gap-1"
                  :class="analysisConfidence >= 0.75 ? 'bg-green-500/20 text-green-300' : analysisConfidence >= 0.5 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'"
                >
                  <span>📈</span>
                  置信度 {{ Math.round(analysisConfidence * 100) }}%
                </span>
              </div>
            </div>
            
            <div 
              v-if="analysisError" 
              class="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              <div class="flex items-center gap-2">
                <span>⚠️</span>
                <span>{{ analysisError }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-[var(--bg-card-hover)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors" @click="editField = 'phase'" title="点击修正">
                <div class="text-2xl mb-1">⏱️</div>
                <div class="text-gray-400 text-sm">当前阶段</div>
                <div class="text-white font-bold">
                  <span v-if="editField !== 'phase'">{{ currentPhase }}</span>
                  <input v-else v-model="manualEdit.phase" @blur="saveEdit" @keyup.enter="saveEdit" class="bg-transparent border-b border-white/50 outline-none w-full text-center text-white font-bold" placeholder="如 2-7" />
                </div>
                <div v-if="rawAnalysis && rawAnalysis.phase !== currentPhase" class="text-xs text-gray-500 mt-1">AI: {{ rawAnalysis.phase }}</div>
              </div>
              
              <div class="bg-[var(--bg-card-hover)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors" @click="editField = 'gold'" title="点击修正">
                <div class="text-2xl mb-1">💰</div>
                <div class="text-gray-400 text-sm">金币</div>
                <div class="text-white font-bold">
                  <span v-if="editField !== 'gold'">{{ estimatedGold }}</span>
                  <input v-else v-model="manualEdit.gold" @blur="saveEdit" @keyup.enter="saveEdit" class="bg-transparent border-b border-white/50 outline-none w-full text-center text-white font-bold" type="number" placeholder="0-999" />
                </div>
                <div v-if="rawAnalysis && rawAnalysis.gold !== estimatedGold" class="text-xs text-gray-500 mt-1">AI: {{ rawAnalysis.gold }}</div>
              </div>
              
              <div class="bg-[var(--bg-card-hover)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors" @click="editField = 'health'" title="点击修正">
                <div class="text-2xl mb-1">❤️</div>
                <div class="text-gray-400 text-sm">血量</div>
                <div class="text-white font-bold">
                  <span v-if="editField !== 'health'">{{ estimatedHealth }}</span>
                  <input v-else v-model="manualEdit.health" @blur="saveEdit" @keyup.enter="saveEdit" class="bg-transparent border-b border-white/50 outline-none w-full text-center text-white font-bold" type="number" placeholder="1-100" />
                </div>
                <div v-if="rawAnalysis && rawAnalysis.health !== estimatedHealth" class="text-xs text-gray-500 mt-1">AI: {{ rawAnalysis.health }}</div>
              </div>
              
              <div class="bg-[var(--bg-card-hover)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors" @click="editField = 'level'" title="点击修正">
                <div class="text-2xl mb-1">👥</div>
                <div class="text-gray-400 text-sm">人口</div>
                <div class="text-white font-bold">
                  <span v-if="editField !== 'level'">{{ estimatedLevel }}</span>
                  <input v-else v-model="manualEdit.level" @blur="saveEdit" @keyup.enter="saveEdit" class="bg-transparent border-b border-white/50 outline-none w-full text-center text-white font-bold" type="number" placeholder="1-10" />
                </div>
                <div v-if="rawAnalysis && rawAnalysis.level !== estimatedLevel" class="text-xs text-gray-500 mt-1">AI: {{ rawAnalysis.level }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：指导建议 -->
        <div class="space-y-4">
          <!-- 当前阵容识别 -->
          <div class="hud-card p-4">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-xl">🎯</span>
              阵容识别
            </h3>
            
            <div v-if="!isSharing" class="text-center py-8 text-gray-500">
              <div class="text-4xl mb-2">📡</div>
              <p>开始共享后自动识别阵容</p>
            </div>
            
            <div v-else class="space-y-3">
              <div class="bg-[rgba(var(--accent-rgb),0.12)] rounded-lg p-3">
                <div class="text-[var(--accent-color)] font-medium mb-1">检测到羁绊</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="synergy in detectedSynergies" :key="synergy.name" 
                    class="px-2 py-1 bg-[rgba(var(--accent-rgb),0.18)] text-[var(--accent-color)] rounded text-sm">
                    {{ synergy.name }} {{ synergy.count }}
                  </span>
                </div>
                <div v-if="synergyHint" class="mt-2 text-xs text-yellow-300 bg-yellow-500/10 rounded px-2 py-1">
                  🔗 {{ synergyHint }}
                </div>
              </div>
              
              <div class="bg-blue-500/20 rounded-lg p-3">
                <div class="text-blue-300 font-medium mb-1">推荐阵容方向</div>
                <div class="text-white">{{ recommendedTeam }}</div>
              </div>
            </div>
          </div>

          <!-- 实时建议 -->
          <div class="hud-card p-4">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-xl">💡</span>
              实时建议
            </h3>
            
            <div v-if="!isSharing" class="text-center py-8 text-gray-500">
              <div class="text-4xl mb-2">🤖</div>
              <p>等待画面共享...</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="(suggestion, index) in currentSuggestions" 
                :key="index"
                class="bg-gradient-to-r from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--gold-rgb),0.08)] rounded-lg p-3 border border-[rgba(var(--accent-rgb),0.2)]"
              >
                <div class="flex items-start gap-2">
                  <span class="text-xl">{{ suggestion.icon }}</span>
                  <div>
                    <div class="text-white font-medium">{{ suggestion.title }}</div>
                    <div class="text-gray-400 text-sm">{{ suggestion.content }}</div>
                  </div>
                </div>
              </div>
              
              <div v-if="currentSuggestions.length === 0" class="text-center py-4 text-gray-500">
                正在分析游戏画面...
              </div>
            </div>
          </div>

          <!-- 操作提示 -->
          <div class="hud-card p-4">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-xl">⚡</span>
              快速操作提示
            </h3>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-[var(--bg-card-hover)] rounded-lg">
                <span class="text-gray-300">升级时机</span>
                <span class="text-green-400 font-medium">{{ upgradeHint }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-[var(--bg-card-hover)] rounded-lg">
                <span class="text-gray-300">D牌建议</span>
                <span class="text-yellow-400 font-medium">{{ rollHint }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-[var(--bg-card-hover)] rounded-lg">
                <span class="text-gray-300">装备优先</span>
                <span class="text-blue-400 font-medium">{{ equipmentHint }}</span>
              </div>
            </div>
          </div>

          <!-- 历史记录 -->
          <div class="hud-card p-4">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-xl">📜</span>
              建议历史
            </h3>
            
            <div class="space-y-2 max-h-200 overflow-y-auto">
              <div 
                v-for="(record, index) in suggestionHistory" 
                :key="index"
                class="text-sm p-2 bg-[var(--bg-card-hover)] rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">{{ record.time }}</span>
                  <span class="text-gray-300">{{ record.content }}</span>
                </div>
              </div>
              
              <div v-if="suggestionHistory.length === 0" class="text-center py-4 text-gray-500 text-sm">
                暂无历史记录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- AI配置对话框 -->
    <el-dialog 
      v-model="showAIConfig"
      title="AI分析配置"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="space-y-4">
        <div class="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div class="flex items-start gap-3">
            <span class="text-2xl">🤖</span>
            <div>
              <h4 class="text-white font-medium mb-1">配置AI视觉分析</h4>
              <p class="text-gray-400 text-sm">
                配置AI API后，系统将使用真实的AI视觉分析来识别游戏画面，提供更准确的阵容建议。
              </p>
            </div>
          </div>
        </div>
        
        <el-form label-position="top">
          <el-form-item label="AI服务商">
            <el-select v-model="aiConfigForm.provider" class="w-full">
              <el-option label="阿里云通义千问 (推荐，数字识别准确)" value="qwen" />
              <el-option label="智谱AI GLM-4V (便宜)" value="zhipu" />
              <el-option label="OpenAI GPT-4 Vision (需VPN)" value="openai" />
            </el-select>
          </el-form-item>

          <!-- 密钥状态由服务端环境变量决定，浏览器不再输入/保存密钥 -->
          <div class="p-3 rounded-lg border mb-2"
               :class="isAIConfigured ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'">
            <span class="text-sm">
              {{ isAIConfigured ? '✅ 服务端 AI 密钥已配置' : '⚠️ 服务端尚未配置 AI 密钥（AI_API_KEY）' }}
            </span>
          </div>

          <div class="text-xs text-gray-500">
            密钥由管理员在服务端 .env 中统一配置，浏览器不再保存或传输 API Key。
          </div>
        </el-form>
        
        <div class="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div class="flex items-start gap-2">
            <span class="text-lg">💡</span>
            <div class="text-sm">
              <p class="mb-1 font-medium">服务商对比：</p>
              <ul class="list-disc list-inside space-y-1 text-gray-400">
                <li><b>阿里云通义千问</b>：数字识别准确，约0.02元/图，无需VPN（推荐）</li>
                <li><b>智谱AI</b>：价格便宜，约0.01元/图，无需VPN</li>
                <li><b>OpenAI</b>：识别最准确，约0.01美元/图，需VPN</li>
              </ul>
              <p class="mt-2 text-gray-500">注意：DeepSeek官方API不支持图片分析，已从选项中移除</p>
              <p class="mt-1 text-gray-500">API Key保存在本地，不会上传服务器</p>
            </div>
          </div>
        </div>
        
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showAIConfig = false">取消</el-button>
          <el-button type="success" @click="testAIConnection">测试连接</el-button>
          <el-button type="primary" @click="saveAIConfig">保存配置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElButton } from 'element-plus'
import { aiAnalysisService } from '../services/aiAnalysis'
import { recordApi } from '../services/api'

const videoRef = ref(null)
const isSharing = ref(false)
const shareTime = ref(0)
const mediaStream = ref(null)
const browserSupported = ref(true)
const isDemoMode = ref(false)

// A3: 每次屏幕共享会话生成唯一 videoId，用于 OCR 帧去重入库
//   - 同一会话内的多帧 AI 分析共享同一 videoId，timestamp 区分每一帧
//   - 入库 sourceGameId = `${videoId}#${timestamp}` 保证每帧唯一
const ocrSessionId = ref('')
const generateOcrSessionId = () =>
  `ocr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

// AI Configuration
const showAIConfig = ref(false)
const aiConfigForm = ref({
  provider: 'qwen' // 仅保存服务商偏好；密钥由服务端管理
})
const isAIConfigured = ref(false)
const lastAnalysisType = ref('') // 'AI' or 'Mock'
const analysisError = ref('')
const isAnalyzing = ref(false)

const currentPhase = ref('等待识别')
const estimatedGold = ref('--')
const estimatedHealth = ref('--')
const estimatedLevel = ref('--')

const detectedSynergies = ref([])
const synergyHint = ref('')
const recommendedTeam = ref('等待分析...')

const currentSuggestions = ref([])
const suggestionHistory = ref([])

const upgradeHint = ref('等待分析')
const rollHint = ref('等待分析')

// 手动修正功能
const editField = ref('')
const rawAnalysis = ref(null)
const manualEdit = ref({
  phase: '',
  gold: '',
  health: '',
  level: ''
})

// 血量稳定机制 - 最近5次AI识别的血量值，取众数防跳变
const healthHistory = ref([])
const MAX_HEALTH_HISTORY = 5
const stableHealth = ref(null)

function stabilizeHealth(rawHealth) {
  if (rawHealth === '未识别' || rawHealth === '--') {
    // AI看不清时，保持上次稳定值
    return stableHealth.value
  }
  const val = parseInt(rawHealth)
  if (isNaN(val) || val < 1 || val > 100) return stableHealth.value
  
  healthHistory.value.push(val)
  if (healthHistory.value.length > MAX_HEALTH_HISTORY) {
    healthHistory.value.shift()
  }
  
  // 取最近5次中出现最多的值（众数），不足5次取最新值
  if (healthHistory.value.length < 3) {
    stableHealth.value = val
    return val
  }
  
  // 计数每个值出现次数
  const counts = {}
  healthHistory.value.forEach(v => counts[v] = (counts[v] || 0) + 1)
  // 找出现次数最多的值
  let maxCount = 0, modeVal = val
  Object.entries(counts).forEach(([k, c]) => {
    if (c > maxCount || (c === maxCount && parseInt(k) > modeVal)) {
      maxCount = c
      modeVal = parseInt(k)
    }
  })
  
  // 只有出现2次以上才采纳
  if (maxCount >= 2) {
    stableHealth.value = modeVal
    return modeVal
  }
  return stableHealth.value || val
}

// 保存手动修正
const saveEdit = () => {
  if (editField.value === 'phase') {
    currentPhase.value = manualEdit.value.phase || estimatedGold.value
  } else if (editField.value === 'gold') {
    estimatedGold.value = manualEdit.value.gold || '--'
  } else if (editField.value === 'health') {
    estimatedHealth.value = manualEdit.value.health || '--'
  } else if (editField.value === 'level') {
    estimatedLevel.value = manualEdit.value.level || '--'
  }
  editField.value = ''
}
const equipmentHint = ref('等待分析')

let shareTimer = null
let analysisTimer = null
let isStopping = false // 防止重复停止

// 检测浏览器是否支持屏幕共享
const checkBrowserSupport = () => {
  // 检查是否支持 getDisplayMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    browserSupported.value = false
    return false
  }
  
  // 检查是否是安全上下文（HTTPS 或 localhost）
  if (!window.isSecureContext) {
    browserSupported.value = false
    return false
  }
  
  browserSupported.value = true
  return true
}

// 演示模式（当浏览器不支持时）
const startDemoMode = () => {
  isDemoMode.value = true
  isSharing.value = true
  
  shareTimer = setInterval(() => {
    shareTime.value++
  }, 1000)
  
  analysisTimer = setInterval(() => {
    generateMockAnalysis()
  }, 3000)
  
  ElMessage.success('演示模式已开启')
  
  setTimeout(() => {
    generateMockAnalysis()
  }, 1000)
}

const startScreenShare = async () => {
  // 先检查浏览器支持
  if (!checkBrowserSupport()) {
    ElMessage.warning('当前浏览器不支持屏幕共享，请使用演示模式')
    return
  }
  
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: false
    })
    
    mediaStream.value = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    isSharing.value = true
    isDemoMode.value = false
    // A3: 本次屏幕共享会话的唯一标识，用于 OCR 入库去重
    ocrSessionId.value = generateOcrSessionId()
    
    stream.getVideoTracks()[0].onended = () => {
      stopScreenShare(true) // 从track事件触发，不显示消息
    }
    
    shareTimer = setInterval(() => {
      shareTime.value++
    }, 1000)
    
    analysisTimer = setInterval(() => {
      analyzeGameFrame()
    }, 6000)
    
    ElMessage.success('屏幕共享已开始')
    
    // 首次分析
    setTimeout(() => {
      analyzeGameFrame()
    }, 2000)
    
  } catch (error) {
    console.error('屏幕共享失败:', error)
    
    let errorMessage = '无法启动屏幕共享'
    
    if (error.name === 'NotAllowedError') {
      errorMessage = '请允许屏幕共享权限'
    } else if (error.name === 'NotSupportedError') {
      errorMessage = '浏览器不支持此功能，请使用演示模式'
      browserSupported.value = false
    } else if (error.name === 'NotFoundError') {
      errorMessage = '未找到可共享的屏幕'
    } else if (error.name === 'AbortError') {
      errorMessage = '屏幕共享被取消'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = '无法满足屏幕共享约束条件'
    } else if (!window.isSecureContext) {
      errorMessage = '需要 HTTPS 或 localhost 才能使用屏幕共享'
    }
    
    ElMessage.error(errorMessage)
  }
}

const stopScreenShare = (fromTrack = false) => {
  // 防止重复停止
  if (isStopping) return
  isStopping = true
  
  if (mediaStream.value) {
    // 先移除onended事件监听，防止重复触发
    const track = mediaStream.value.getVideoTracks()[0]
    if (track) {
      track.onended = null // 移除事件监听
    }
    
    mediaStream.value.getTracks().forEach(t => t.stop())
    mediaStream.value = null
  }
  
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  
  isSharing.value = false
  isDemoMode.value = false
  shareTime.value = 0
  
  if (shareTimer) {
    clearInterval(shareTimer)
    shareTimer = null
  }
  
  if (analysisTimer) {
    clearInterval(analysisTimer)
    analysisTimer = null
  }
  
  resetAnalysis()
  
  // 根据调用来源显示不同的消息
  if (!fromTrack) {
    ElMessage.info('屏幕共享已停止')
  }
  
  // 重置标志位
  setTimeout(() => {
    isStopping = false
  }, 100)
}

const resetAnalysis = () => {
  currentPhase.value = '等待识别'
  estimatedGold.value = '--'
  estimatedHealth.value = '--'
  estimatedLevel.value = '--'
  detectedSynergies.value = []
  synergyHint.value = ''
  recommendedTeam.value = '等待分析...'
  currentSuggestions.value = []
  upgradeHint.value = '等待分析'
  rollHint.value = '等待分析'
  equipmentHint.value = '等待分析'
}

const analyzeGameFrame = async () => {
  if (!isSharing.value) return

  // Use AI analysis if configured
  if (isAIConfigured.value && videoRef.value) {
    try {
      isAnalyzing.value = true
      const analysis = await aiAnalysisService.analyzeScreen(videoRef.value)
      updateAnalysisData(analysis)
      lastAnalysisType.value = 'AI'
      analysisError.value = ''
      // A3: AI 复盘建议自动入库到 MatchRecord（source='ocr'）
      //   - 失败不阻塞主流程，仅打 console，避免影响识别循环
      //   - 未登录用户静默跳过（401 由 axios 拦截器处理跳登录）
      persistOcrAdvice(analysis).catch(err => {
        console.warn('OCR 入库失败（不影响本次识别）:', err?.message || err)
      })
    } catch (error) {
      console.error('AI analysis error:', error)
      // 显示错误信息，不使用模拟数据
      analysisError.value = error.message || 'AI分析失败'
      lastAnalysisType.value = 'Error'
    } finally {
      isAnalyzing.value = false
    }
  } else {
    analysisError.value = '请先配置AI API密钥'
    lastAnalysisType.value = 'Error'
  }
}

/**
 * A3: 把 AI 复盘结果异步写入 MatchRecord（source='ocr'）
 *   - 同一 ocrSessionId + 当前 timestamp 作为 sourceGameId 去重
 *   - 后端 upsert：已存在则覆盖 aiAdvice，不存在则新建 placement=0 的占位记录
 */
const persistOcrAdvice = async (analysis) => {
  if (!ocrSessionId.value) return
  if (!analysis || !analysis.suggestions?.length) return

  const adviceText = analysis.suggestions
    .map(s => `${s.title || ''}: ${s.content || ''}`.trim())
    .filter(Boolean)
    .join(' | ')
  if (!adviceText) return

  const payload = {
    videoId: ocrSessionId.value,
    timestamp: Date.now(),
    aiAdvice: {
      text: adviceText,
      suggestions: analysis.suggestions.map(s => ({
        title: s.title || '',
        content: s.content || ''
      })),
      snapshot: {
        phase: analysis.phase || '',
        gold: String(analysis.gold ?? ''),
        health: String(analysis.health ?? ''),
        level: String(analysis.level ?? ''),
        teamName: analysis.teamName || ''
      },
      provider: aiAnalysisService.getConfig().provider || ''
    },
    mode: 'ranked',
    traits: detectedSynergies.value || []
  }

  await recordApi.upsertOcrAdvice(payload)
}

const analysisConfidence = ref(0)

const updateAnalysisData = (analysis) => {
  if (analysis.confidence !== undefined) {
    analysisConfidence.value = analysis.confidence
  }
  
  // 保存原始AI识别结果，用于显示和手动修正
  rawAnalysis.value = {
    phase: analysis.phase,
    gold: analysis.gold,
    health: analysis.health,
    level: analysis.level
  }
  
  currentPhase.value = analysis.phase === '未识别' ? '等待识别' : analysis.phase
  estimatedGold.value = analysis.gold === '未识别' ? '--' : analysis.gold
  // 血量使用稳定机制，防止跳变
  const rawHealth = analysis.health === '未识别' ? '--' : analysis.health
  const stableVal = stabilizeHealth(rawHealth)
  estimatedHealth.value = stableVal ? stableVal.toString() : '--'
  estimatedLevel.value = analysis.level === '未识别' ? '--' : analysis.level
  detectedSynergies.value = analysis.synergies || []
  synergyHint.value = analysis.synergyHint || ''
  recommendedTeam.value = analysis.teamName || '未知阵容'
  currentSuggestions.value = analysis.suggestions || []
  upgradeHint.value = analysis.upgradeHint || '等待分析'
  rollHint.value = analysis.rollHint || '等待分析'
  equipmentHint.value = analysis.equipmentHint || '等待分析'
  
  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  const typeLabel = analysis.isRealAnalysis ? '[AI分析]' : '[模拟]'
  
  suggestionHistory.value.unshift({
    time: timeStr,
    content: `${typeLabel} ${currentSuggestions.value[0]?.title}: ${currentSuggestions.value[0]?.content}`
  })
  
  if (suggestionHistory.value.length > 10) {
    suggestionHistory.value.pop()
  }
}

// Open AI configuration dialog
const openAIConfig = async () => {
  const config = aiAnalysisService.getConfig()
  aiConfigForm.value.provider = config.provider
  // 每次打开对话框刷新服务端密钥状态
  await checkAIConfig()
  showAIConfig.value = true
}

// Save AI configuration（仅服务商偏好）
const saveAIConfig = async () => {
  aiAnalysisService.configure({ provider: aiConfigForm.value.provider })

  isAIConfigured.value = aiAnalysisService.isConfigured()
  showAIConfig.value = false

  if (!isAIConfigured.value) {
    ElMessage.warning('偏好已保存，但服务端尚未配置 AI 密钥')
  } else {
    ElMessage.success('AI 服务商偏好已保存')
  }
}

// Test API connection（通过服务端代理）
const testAIConnection = async () => {
  aiAnalysisService.configure({ provider: aiConfigForm.value.provider })

  ElMessage.info('正在测试API连接...')

  try {
    const result = await aiAnalysisService.testAPI()
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('API测试失败:', error)
    ElMessage.error(`API测试失败: ${error.message}`)
  }
}

// Check AI configuration on mount（从服务端获取，无密钥内容）
const checkAIConfig = async () => {
  const status = await aiAnalysisService.fetchServerStatus()
  isAIConfigured.value = !!status?.configured
  if (status?.defaultProvider && !localStorage.getItem('ai_provider')) {
    aiConfigForm.value.provider = status.defaultProvider
  }
}

const generateMockAnalysis = () => {
  const mockAnalysis = {
    phase: '--',
    gold: '--',
    health: '--',
    level: '--',
    synergies: [],
    teamName: '暂未开放',
    suggestions: [],
    upgradeHint: '',
    rollHint: '',
    equipmentHint: '',
    isRealAnalysis: false,
    analysisTime: new Date().toLocaleTimeString()
  }
  
  updateAnalysisData(mockAnalysis)
}

onMounted(() => {
  checkBrowserSupport()
  checkAIConfig()
})

onUnmounted(() => {
  stopScreenShare(true) // 组件卸载时调用，不显示消息
})
</script>

<style scoped>
.max-h-200 {
  max-height: 200px;
}
</style>