<template>
  <div class="text-sm space-y-3">
    <div v-if="!data" class="text-gray-500 text-center py-4">
      暂无详细数据
    </div>
    <template v-else>
      <!-- 基础信息 -->
      <div class="flex flex-wrap gap-2">
        <span class="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs">
          模式: {{ queueName }}
        </span>
        <span class="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs">
          时长: {{ formatDuration(data.gameDuration) }}
        </span>
        <span class="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs">
          回合: {{ playerData?.lastRound || '-' }}
        </span>
        <span class="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs">
          剩余金币: {{ playerData?.goldLeft || 0 }}
        </span>
      </div>

      <!-- 羁绊 -->
      <div v-if="playerData?.traits?.length">
        <div class="text-gray-500 text-xs mb-1.5">激活羁绊</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="trait in playerData.traits"
            :key="trait"
            class="px-2 py-0.5 rounded text-[11px] bg-purple-400/10 text-purple-300 border border-purple-400/20"
          >
            {{ trait }}
          </span>
        </div>
      </div>

      <!-- 上场阵容 -->
      <div v-if="playerData?.units?.length">
        <div class="text-gray-500 text-xs mb-1.5">最终阵容 ({{ playerData.units.length }} 人口)</div>
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="unit in playerData.units"
            :key="unit.character_id"
            class="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center gap-1.5"
            :title="unit.character_id"
          >
            <!-- 星级 -->
            <span class="text-yellow-400 font-bold">{{ '★'.repeat(unit.tier || 1) }}</span>
            <!-- 英雄名 -->
            <span class="text-gray-300">{{ formatChampionName(unit.character_id) }}</span>
            <!-- 装备图标 -->
            <span v-if="unit.items?.length" class="flex gap-0.5">
              <span
                v-for="itemId in unit.items.slice(0, 3)"
                :key="itemId"
                class="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[8px] text-gray-400"
                :title="'装备ID: ' + itemId"
              >
                🛡
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- 其他玩家排名（简短版） -->
      <div v-if="playerData?.placement">
        <div class="text-gray-500 text-xs mb-1.5">最终排名: <span class="text-white font-bold">第 {{ playerData.placement }} 名</span></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  match: { type: Object, default: null }
})

const data = computed(() => props.match)

const queueName = computed(() => {
  const qid = data.value?.queueId
  const map = {
    1090: '云顶之弈 (召唤师峡谷)',
    1100: '云顶之弈 (排位赛)',
    1130: '云顶之弈 (双人)',
    1160: '云顶之弈 (普通)'
  }
  return map[qid] || '云顶之弈'
})

// 从 participants 中找出玩家自己的数据
// LCU 返回的 match detail JSON 中，playerId 对应当前玩家
const playerData = computed(() => {
  if (!data.value?.participants) return null

  // 优先用 playerId，否则取第一个 participant
  const pid = data.value.playerId || data.value.participantIdentities?.find(() => true)?.participantId
  const player = data.value.participants.find(
    p => p.participantId === pid || p.puuid === pid
  )
  return player || data.value.participants[0]
})

const formatDuration = (sec) => {
  if (!sec) return '-'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}分${s}秒`
}

const formatChampionName = (id) => {
  if (!id) return '?'
  // TFT8 格式: TFT8_MissFortune → 赏金猎人
  return id.replace(/^TFT\d+_/, '').replace(/([A-Z])/g, ' $1').trim()
}
</script>
