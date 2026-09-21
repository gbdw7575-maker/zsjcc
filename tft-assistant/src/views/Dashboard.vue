<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">版本大数据</h1>
          <p class="text-gray-400 mt-2">金铲铲之战 S18苍林秘境 - 阵容强度 · 装备推荐 · 羁绊排行</p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-400 text-sm">数据来源: 游侠网、头条攻略</span>
          <el-select v-model="timeRange" placeholder="时间范围">
            <el-option label="返厂版本" value="return" />
            <el-option label="历史数据" value="history" />
          </el-select>
        </div>
      </div>

      <!-- 版本热门阵容强度排行 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="hud-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">🏆 阵容强度排行</h3>
            <span class="text-xs text-gray-500">数据来源: 游侠网攻略</span>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(team, index) in teamRanking" 
              :key="team.id" 
              class="flex items-center gap-4 p-4 bg-[var(--bg-card-hover)] rounded-lg hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              @click="openTeamDetail(team)"
            >
              <div :class="rankClass(index)" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-white font-bold">{{ team.name }}</span>
                  <span :class="tierClass(team.tier)" class="text-xs px-2 py-0.5 rounded-full">{{ team.tier }}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-gray-400 text-sm">{{ team.description }}</span>
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <span v-for="synergy in team.synergies" :key="synergy" class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-card-hover)] text-gray-300">
                    {{ synergy }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-green-400 text-sm font-bold">{{ team.winRate }}% 吃鸡率</div>
                <div class="text-blue-400 text-xs">{{ team.playRate }}% 出场率</div>
              </div>
              <div class="text-gray-500">→</div>
            </div>
          </div>
        </div>
        
        <div class="hud-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">🎯 装备推荐</h3>
            <span class="text-xs text-gray-500">数据来源: 头条攻略</span>
          </div>
          <div class="space-y-4">
            <div v-for="equip in equipmentRecommendations" :key="equip.hero" class="p-4 bg-[var(--bg-card-hover)] rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-white font-bold">{{ equip.hero }}</span>
                <span class="text-gray-400 text-sm">{{ equip.role }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-for="item in equip.items" :key="item" class="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-[rgba(var(--accent-rgb),0.12)] to-[rgba(var(--gold-rgb),0.12)] border border-[rgba(var(--accent-rgb),0.3)] text-[var(--accent-color)]">
                  {{ item }}
                </span>
              </div>
              <p class="text-gray-500 text-sm mt-2">{{ equip.tip }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 羁绊排行与运营思路 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 hud-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">📊 羁绊效果强度排行</h3>
            <span class="text-xs text-gray-500">基于当前版本胜率统计</span>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(synergy, index) in synergyRanking" 
              :key="synergy.name" 
              class="flex items-center gap-4 p-4 bg-[var(--bg-card-hover)] rounded-lg hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              @click="openSynergyDetail(synergy)"
            >
              <div :class="rankClass(index)" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-white font-bold">{{ synergy.name }}</span>
                  <span :class="tierClass(synergy.tier)" class="text-xs px-2 py-0.5 rounded-full">{{ synergy.tier }}</span>
                </div>
                <p class="text-gray-500 text-sm mt-1">{{ synergy.effect }}</p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="text-gray-400 text-xs">热门阵容: <span class="text-[var(--accent-color)]">{{ synergy.popularTeams }}</span></span>
                </div>
              </div>
              <div class="w-32">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>强度</span>
                  <span>{{ synergy.score }}%</span>
                </div>
                <div class="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div :class="barClass(index)" class="h-full rounded-full transition-all" :style="{ width: synergy.score + '%' }"></div>
                </div>
              </div>
              <div class="text-gray-500">→</div>
            </div>
          </div>
        </div>
        
        <div class="hud-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">💡 版本运营思路</h3>
            <span class="text-xs text-gray-500">攻略汇总</span>
          </div>
          <div class="space-y-4">
            <div 
              class="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-colors"
              @click="openTeamDetail(teamRanking[0])"
            >
              <h4 class="text-yellow-400 font-bold mb-2">🥇 运营天花板: 机甲精英</h4>
              <p class="text-gray-400 text-sm">2-1拿经济强化/金锅锅/精英纹章直接冲，速9找铁男开3机甲4精英斩杀，成型稳进前二</p>
            </div>
            <div 
              class="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"
              @click="openTeamDetail(teamRanking[1])"
            >
              <h4 class="text-blue-400 font-bold mb-2">🎲 赌狗上分: 无情连打贾克斯</h4>
              <p class="text-gray-400 text-sm">3-5/4-1拉7大D，追三星贾克斯，火炮+羊刀+水银三件套，前排扛住=贾克斯乱杀</p>
            </div>
            <div 
              class="p-4 bg-gradient-to-r from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--gold-rgb),0.08)] rounded-xl border border-[rgba(var(--accent-rgb),0.2)] cursor-pointer hover:bg-[rgba(var(--accent-rgb),0.12)] transition-colors"
              @click="openTeamDetail(teamRanking[2])"
            >
              <h4 class="text-[var(--accent-color)] font-bold mb-2">💰 爽玩阵容: 金币流德莱文</h4>
              <p class="text-gray-400 text-sm">刚需德莱文英雄强化"德莱文联盟"，3星德莱文+前排3星，装备掉落金币，经济爆炸</p>
            </div>
            <div 
              class="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors"
              @click="openTeamDetail(teamRanking[3])"
            >
              <h4 class="text-green-400 font-bold mb-2">🆕 新手推荐: 怪兽卡莎</h4>
              <p class="text-gray-400 text-sm">7张怪兽前排拉满，卡莎高频输出，运营简单，3-5拉7大D三星卡莎+龙龟即可锁血</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 英雄出装速查 -->
      <div class="hud-card p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">⚔️ 主C英雄出装速查</h3>
          <span class="text-xs text-gray-500">数据来源: 游侠网、头条攻略</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="hero in heroBuilds" :key="hero.name" class="p-4 bg-[var(--bg-card-hover)] rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 bg-center bg-no-repeat"
                :class="costBorderClass(hero.cost)"
                :style="{ backgroundImage: `url(${getHeroIcon(hero.name)})`, backgroundSize: 'cover' }"
              ></div>
              <div>
                <div class="text-white font-bold">{{ hero.name }}</div>
                <div class="text-gray-400 text-xs">{{ hero.title }}</div>
              </div>
            </div>
            <div class="space-y-2">
              <div v-for="(item, idx) in hero.items" :key="idx" class="flex items-center gap-2">
                <span class="text-xs text-gray-500 w-8">{{ idx === 0 ? '必备' : '备选' }}</span>
                <span class="text-sm text-[var(--accent-color)]">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据来源声明 -->
      <div class="text-center py-4">
        <p class="text-gray-500 text-sm">
          数据整理自网络攻略，仅供参考。阵容强度会随版本更新变化，建议结合实战灵活调整。
        </p>
        <p class="text-gray-600 text-xs mt-1">
          参考来源: 游侠网(app.ali213.net)、今日头条云顶阵容情报局
        </p>
      </div>
    </div>

    <!-- 阵容详情弹窗 -->
    <el-dialog v-model="showTeamDetail" :title="selectedTeam?.name" width="650px">
      <div v-if="selectedTeam" class="space-y-6">
        <div>
          <h4 class="text-gray-400 text-sm mb-2">阵容概述</h4>
          <p class="text-white">{{ selectedTeam.description }}</p>
        </div>
        
        <div>
          <h4 class="text-gray-400 text-sm mb-3">核心羁绊</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="synergy in selectedTeam.synergies" :key="synergy" class="px-3 py-1 rounded-full bg-gradient-to-r from-[rgba(var(--accent-rgb),0.12)] to-[rgba(var(--gold-rgb),0.12)] border border-[rgba(var(--accent-rgb),0.3)] text-[var(--accent-color)]">
              {{ synergy }}
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">棋子搭配</h4>
          <div class="grid grid-cols-4 gap-2">
            <div v-for="hero in selectedTeam.heroes" :key="hero" class="p-2 bg-[var(--bg-card-hover)] rounded-lg text-center">
              <div class="text-white font-medium">{{ hero }}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">装备推荐</h4>
          <div class="space-y-2">
            <div v-for="(build, idx) in selectedTeam.builds" :key="idx" class="flex items-center gap-3 p-3 bg-[var(--bg-card-hover)] rounded-lg">
              <span class="text-yellow-400 font-bold w-16">{{ build.role }}</span>
              <div class="flex gap-2">
                <span v-for="item in build.items" :key="item" class="px-2 py-1 rounded bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent-color)] text-sm">
                  {{ item }}
                </span>
              </div>
              <span class="text-gray-500 text-xs ml-auto">{{ build.tip }}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">运营思路</h4>
          <div class="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div v-for="(step, idx) in selectedTeam.operations" :key="idx" class="flex gap-3 mb-2 last:mb-0">
              <span class="text-blue-400 font-bold">{{ step.phase }}</span>
              <span class="text-gray-300">{{ step.desc }}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">海克斯推荐</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="hex in selectedTeam.hextechs" :key="hex" class="px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm">
              {{ hex }}
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">阵容优劣势</h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div class="text-green-400 font-bold mb-1">优势</div>
              <p class="text-gray-400 text-sm">{{ selectedTeam.advantages }}</p>
            </div>
            <div class="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div class="text-red-400 font-bold mb-1">劣势</div>
              <p class="text-gray-400 text-sm">{{ selectedTeam.disadvantages }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 羁绊详情弹窗 -->
    <el-dialog v-model="showSynergyDetail" :title="selectedSynergy?.name + ' 详细信息'" width="500px">
      <div v-if="selectedSynergy" class="space-y-6">
        <div>
          <h4 class="text-gray-400 text-sm mb-2">羁绊效果</h4>
          <p class="text-white">{{ selectedSynergy.effect }}</p>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">等级效果</h4>
          <div class="space-y-2">
            <div v-for="(level, idx) in selectedSynergy.levels" :key="idx" class="flex items-center gap-3 p-3 bg-[var(--bg-card-hover)] rounded-lg">
              <span class="text-yellow-400 font-bold w-8">{{ level.count }}个</span>
              <span class="text-gray-300">{{ level.effect }}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">关联英雄</h4>
          <div class="grid grid-cols-4 gap-2">
            <div v-for="hero in selectedSynergy.heroes" :key="hero" class="p-2 bg-[var(--bg-card-hover)] rounded-lg text-center">
              <div class="text-white font-medium text-sm">{{ hero }}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-gray-400 text-sm mb-3">热门阵容</h4>
          <div class="space-y-2">
            <div v-for="team in selectedSynergy.popularTeams" :key="team" class="flex items-center gap-2 p-2 bg-[rgba(var(--accent-rgb),0.08)] rounded-lg cursor-pointer hover:bg-[rgba(var(--accent-rgb),0.12)] transition-colors" @click="openTeamBySynergy(team)">
              <span class="text-[var(--accent-color)]">📋</span>
              <span class="text-gray-300">{{ team }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gameData } from '../services/gameDataService'

const getHeroIcon = (heroName) => {
  const hero = gameData.getHeroByName(heroName)
  return hero?.icon || ''
}

const costBorderClass = (cost) => {
  return {
    1: 'border-2 border-gray-500/50 rounded-lg',
    2: 'border-2 border-green-500/50 rounded-lg',
    3: 'border-2 border-blue-500/50 rounded-lg',
    4: 'border-2 border-[rgba(168,85,247,0.5)] rounded-lg',
    5: 'border-2 border-yellow-500/50 rounded-lg'
  }[cost] || 'border-2 border-gray-500/30 rounded-lg'
}

const timeRange = ref('return')
const showTeamDetail = ref(false)
const showSynergyDetail = ref(false)
const selectedTeam = ref(null)
const selectedSynergy = ref(null)

const openTeamDetail = (team) => {
  selectedTeam.value = team
  showTeamDetail.value = true
}

const openSynergyDetail = (synergy) => {
  selectedSynergy.value = synergy
  showSynergyDetail.value = true
}

const openTeamBySynergy = (teamName) => {
  const team = teamRanking.value.find(t => t.name === teamName)
  if (team) {
    showSynergyDetail.value = false
    setTimeout(() => {
      openTeamDetail(team)
    }, 300)
  }
}

const teamRanking = ref([
  {
    id: 1,
    name: '机甲精英九五',
    tier: 'T0',
    description: '运营天花板，速9找铁男开3机甲4精英斩杀，成型稳进前二',
    synergies: ['战斗机甲', '精英战士', '怪兽'],
    heroes: ['瑟提', '莫德凯撒', '厄运小姐', '蕾欧娜', '厄加特', '费德提克', '德莱文', '莎弥拉'],
    builds: [
      { role: '莎弥拉主C', items: ['无尽之刃', '最后的轻语', '巨人捕手'], tip: '无尽+轻语必备' },
      { role: '铁男主C', items: ['法爆', '饮血', '泰坦'], tip: '追求爆发换正义/夜刃' },
      { role: '蕾欧娜主坦', items: ['饮血剑', '冰甲', '振奋'], tip: '纯肉换狂徒+板甲+日炎' }
    ],
    operations: [
      { phase: '2-1', desc: '拿经济强化/金锅锅/精英纹章直接冲' },
      { phase: '3-2', desc: '拉6人口，用天使/希维尔/VN带装备过渡' },
      { phase: '4-1/4-2', desc: '拉8人口找2星莎弥拉+2星瑟提开3机甲' },
      { phase: '4-5/5-1', desc: '拉9人口找铁男+蕾欧娜，开3机甲4精英' }
    ],
    hextechs: ['棱彩门票', '高端购物', '升级咯', '精英战士之徽', '狩猎律动', '潘朵拉装备'],
    advantages: '成型后强度极高，稳进前二，上限天花板',
    disadvantages: '对运营要求高，需要速9，前期容错低',
    winRate: 32.5,
    playRate: 12.8
  },
  {
    id: 2,
    name: '无情连打贾克斯',
    tier: 'T0',
    description: '5战斗机甲+4斗士，贾克斯无限叠加攻速，3-5拉7追三星',
    synergies: ['战斗机甲', '斗士', '护卫'],
    heroes: ['贾克斯', '瑟提', '锐雯', '孙悟空', '瑟庄妮', '扎克', '蕾欧娜', '费德提克'],
    builds: [
      { role: '贾克斯主C', items: ['疾射火炮', '鬼索的狂暴之刃', '水银'], tip: '火炮避免卡位，羊刀无限叠攻速' },
      { role: '瑟庄妮主坦', items: ['日炎斗篷', '圣盾使的誓约'], tip: '日炎重伤，圣盾护盾' },
      { role: '功能卡', items: ['秘法手套'], tip: '费德提克/蕾欧娜/瑟提统一带' }
    ],
    operations: [
      { phase: '2-1', desc: '升4人口，开局刷到贾克斯可直接定阵' },
      { phase: '2-5', desc: '升5人口，斗士羁绊前期又肉又有输出' },
      { phase: '3-5/4-1', desc: '拉7人口大D一轮，除四费卡外全部追二星' },
      { phase: '7人口', desc: '卡利息慢D三星贾克斯，锐雯多可顺带追三' }
    ],
    hextechs: ['无情连打(贾克斯专属)', '便携锻炉', 'DD街区', '升星之运', '英勇福袋'],
    advantages: '贾克斯单挑无解，成型后几乎无敌',
    disadvantages: '害怕灵风吹起，同行多时难追三星',
    winRate: 28.3,
    playRate: 18.5
  },
  {
    id: 3,
    name: '金币流德莱文',
    tier: 'T0',
    description: '3超级英雄+5机甲，德莱文掉金币经济爆炸，爽追三星五费',
    synergies: ['超级英雄', '战斗机甲', '精英战士'],
    heroes: ['德莱文', '墨菲特', '李青', '瑟提', '蕾欧娜', '普朗克', '孙悟空', '贾克斯'],
    builds: [
      { role: '德莱文主C', items: ['无尽之刃', '水银', '最后的轻语'], tip: '无尽+轻语必备' },
      { role: '前排3星', items: ['任意肉装'], tip: '3星棋子越多伤害增幅越高' }
    ],
    operations: [
      { phase: '2-1', desc: '升4级，前期用机甲搭配斗士过渡' },
      { phase: '2-5', desc: '升5级，至尊选择器给德莱文' },
      { phase: '3-2', desc: '升6级，大抽三星德莱文和任意2费前排三星' },
      { phase: '3星后', desc: '存钱上7、8，补充完整羁绊即可大成' }
    ],
    hextechs: ['德莱文联盟(专属)', '团队建设', '英勇福袋', '吾弓听命于您', '常客优惠'],
    advantages: '经济爆炸，爽追三星五费，游戏体验极佳',
    disadvantages: '刚需德莱文专属强化，成型前强度一般',
    winRate: 26.8,
    playRate: 8.2
  },
  {
    id: 4,
    name: '怪兽卡莎',
    tier: 'T1',
    description: '7怪兽前排拉满，卡莎高频输出，新手友好运营简单',
    synergies: ['怪兽', '情报特工', '星之守护者'],
    heroes: ['卡莎', '薇恩', '伊泽瑞尔', '拉莫斯', '科加斯', '维克兹', '艾克', '扎克'],
    builds: [
      { role: '卡莎主C', items: ['斯塔缇克电刃', '海克斯科技枪刃', '珠光护手'], tip: '电刃破防+科技枪续航' },
      { role: '拉莫斯主坦', items: ['棘刺背心', '石像鬼石板甲'], tip: '反甲克制普攻阵容' }
    ],
    operations: [
      { phase: '2-1', desc: '拉四，艾希带薇恩装备，伊泽瑞尔带卡莎装备' },
      { phase: '2-5', desc: '拉五，根据来牌凑羁绊过渡' },
      { phase: '3-5', desc: '拉七，大D三星卡莎+三星拉莫斯/科加斯' },
      { phase: '8人口', desc: '补任意怪兽卡即可' }
    ],
    hextechs: ['团队建设', '英勇福袋', '明智消费', 'DD街区'],
    advantages: '运营简单，新手友好，怪兽前排坦度高',
    disadvantages: '依赖三星卡莎，后期上限一般',
    winRate: 22.1,
    playRate: 15.3
  },
  {
    id: 5,
    name: '怪兽女枪',
    tier: 'T1',
    description: '7怪兽+女枪全屏AOE斩杀，前排坦度拉满',
    synergies: ['怪兽', '精英战士'],
    heroes: ['厄运小姐', '拉莫斯', '维克兹', '扎克', '奥瑞利安·索尔', '科加斯', '费德提克', '厄加特'],
    builds: [
      { role: '女枪主C', items: ['朔极之矛', '珠光护手', '巨人捕手'], tip: '青龙刀快速循环大招' },
      { role: '拉莫斯主坦', items: ['棘刺背心', '石像鬼石板甲'], tip: '全队第一承伤点' },
      { role: '厄加特副C', items: ['斯塔缇克电刃', '疾射火炮'], tip: '群体连锁电伤' }
    ],
    operations: [
      { phase: '2阶段', desc: '3源计划+2决斗+2斗士打工，稳存50利息' },
      { phase: '3阶段', desc: '卡利息稳步拉人口，不强行D低费怪兽' },
      { phase: '4-1', desc: '大搜找女枪、龙龟、大眼三张核心' },
      { phase: '8人口', desc: '找稻草人、厄加特、龙王等高费怪兽' }
    ],
    hextechs: ['枪林弹雨(女枪专属)', '团队建设', '英勇福袋', '明智消费'],
    advantages: '前排肉度拉满，女枪AOE清场',
    disadvantages: '惧怕灵风、黑客、猫咪定点偷袭',
    winRate: 20.5,
    playRate: 10.7
  },
  {
    id: 6,
    name: '超英伊泽瑞尔',
    tier: 'T1',
    description: '超级英雄+情报特工，EZ稳定输出，过渡平滑',
    synergies: ['超级英雄', '情报特工', '源计划'],
    heroes: ['伊泽瑞尔', '李青', '普朗克', '墨菲特', '雷克顿', '艾希'],
    builds: [
      { role: 'EZ主C', items: ['蓝霸符', '珠光护手', '大天使之杖'], tip: '蓝霸符回蓝快' }
    ],
    operations: [
      { phase: '2-1', desc: '升4人口，超级英雄+情报特工开局' },
      { phase: '3-2', desc: '升6人口，补充源计划羁绊' },
      { phase: '4-1', desc: '升7人口，找二星EZ和核心卡' },
      { phase: '8人口', desc: '阵容成型，全员二星即可' }
    ],
    hextechs: ['高端购物', '升级咯', '潘朵拉装备'],
    advantages: '过渡平滑，不挑牌，新手友好',
    disadvantages: '后期上限不如T0阵容',
    winRate: 18.2,
    playRate: 14.6
  }
])

const equipmentRecommendations = ref([
  {
    hero: '贾克斯（主C）',
    role: '无情连打阵容',
    items: ['疾射火炮', '鬼索的狂暴之刃', '水银'],
    tip: '火炮避免卡位打假赛，羊刀无限叠加攻速，水银免控'
  },
  {
    hero: '莎弥拉（主C）',
    role: '机甲精英阵容',
    items: ['无尽之刃', '最后的轻语', '巨人捕手'],
    tip: '无尽+轻语必备，第三件羊刀/巨杀/锐利分裂箭'
  },
  {
    hero: '女枪（主C）',
    role: '怪兽女枪阵容',
    items: ['朔极之矛', '珠光护手', '巨人捕手'],
    tip: '青龙刀快速循环大招，法爆打群体暴击'
  },
  {
    hero: '卡莎（主C）',
    role: '怪兽卡莎阵容',
    items: ['斯塔缇克电刃', '海克斯科技枪刃', '珠光护手'],
    tip: '电刃破防+科技枪续航+法爆增伤'
  }
])

const synergyRanking = ref([
  {
    name: '精英战士',
    tier: 'T0',
    effect: '处决低血量敌人，4精英斩杀线极高',
    levels: [
      { count: 2, effect: '生命值低于40%的敌人受到20%额外伤害' },
      { count: 4, effect: '生命值低于40%的敌人直接被处决' }
    ],
    heroes: ['德莱文', '瑟提', '厄运小姐', '莎弥拉', '莫德凯撒'],
    popularTeams: ['机甲精英', '怪兽女枪'],
    score: 95
  },
  {
    name: '战斗机甲',
    tier: 'T0',
    effect: '合体成至尊机甲，巨额血量双攻',
    levels: [
      { count: 3, effect: '机甲合体，献祭友军提供属性' },
      { count: 5, effect: '机甲属性翻倍，更强的合体效果' }
    ],
    heroes: ['贾克斯', '孙悟空', '锐雯', '瑟提', '蕾欧娜'],
    popularTeams: ['机甲精英', '无情连打'],
    score: 92
  },
  {
    name: '怪兽',
    tier: 'T1',
    effect: '无羁绊但单卡属性极高，前排肉度拉满',
    levels: [
      { count: 1, effect: '单卡基础属性远高于普通棋子' }
    ],
    heroes: ['科加斯', '拉莫斯', '维克兹', '扎克', '奥瑞利安·索尔', '厄加特', '费德提克'],
    popularTeams: ['怪兽卡莎', '怪兽女枪'],
    score: 85
  },
  {
    name: '超级英雄',
    tier: 'T1',
    effect: '摆姿势增加全体伤害，赌狗核心',
    levels: [
      { count: 3, effect: '每2秒摆姿势，增加全体10%伤害' }
    ],
    heroes: ['普朗克', '墨菲特', '李青', '金克丝', '莎弥拉', '佛耶戈'],
    popularTeams: ['金币德莱文', '超英EZ'],
    score: 80
  },
  {
    name: '情报特工',
    tier: 'T1',
    effect: '技能攻击最远敌人，卡莎/EZ核心',
    levels: [
      { count: 2, effect: '技能攻击最远敌人，提供20%攻速' },
      { count: 3, effect: '技能攻击最远敌人，提供35%攻速' },
      { count: 4, effect: '技能攻击最远敌人，提供50%攻速' }
    ],
    heroes: ['艾希', '伊泽瑞尔', '薇恩', '卡莎', '蔚'],
    popularTeams: ['怪兽卡莎', '超英EZ'],
    score: 78
  }
])

const heroBuilds = ref([
  { name: '贾克斯', cost: 3, title: '无情连打阵容', items: ['疾射火炮+鬼索+水银', '泰坦/汲取剑/科技枪'] },
  { name: '莎弥拉', cost: 4, title: '机甲精英阵容', items: ['无尽+轻语+巨人捕手', '羊刀/锐利/分裂箭'] },
  { name: '女枪', cost: 4, title: '怪兽女枪阵容', items: ['青龙刀+法爆+巨人捕手', '帽子/科技枪'] },
  { name: '卡莎', cost: 3, title: '怪兽卡莎阵容', items: ['电刃+科技枪+法爆', '大天使/蓝霸符'] },
  { name: '德莱文', cost: 2, title: '金币流阵容', items: ['无尽+轻语+水银', '羊刀/巨杀/汲取剑'] },
  { name: '伊泽瑞尔', cost: 2, title: '超英EZ阵容', items: ['蓝霸符+法爆+大天使', '科技枪/帽子'] },
  { name: '铁男', cost: 5, title: '机甲精英阵容', items: ['法爆+饮血+泰坦', '正义/夜刃/冕卫'] },
  { name: '龙龟', cost: 4, title: '怪兽前排', items: ['棘刺背心+石像鬼', '日炎/狂徒/冰甲'] }
])

const rankClass = (index) => {
  const classes = [
    'bg-gradient-to-br from-yellow-400 to-orange-500 text-black',
    'bg-gradient-to-br from-gray-300 to-gray-400 text-black',
    'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    'bg-gray-500 text-white',
    'bg-gray-600 text-white'
  ]
  return classes[index] || 'bg-gray-700 text-white'
}

const tierClass = (tier) => {
  const classes = {
    'T0': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black',
    'T0.5': 'bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-white',
    'T1': 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
  }
  return classes[tier] || 'bg-gray-500 text-white'
}

const barClass = (index) => {
  const classes = [
    'bg-gradient-to-r from-yellow-400 to-orange-500',
    'bg-gradient-to-r from-gray-300 to-gray-400',
    'bg-gradient-to-r from-orange-400 to-orange-600',
    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-gradient-to-r from-[#c084fc] to-[#9333ea]'
  ]
  return classes[index] || 'bg-gray-500'
}
</script>

<style scoped>
.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}
</style>
