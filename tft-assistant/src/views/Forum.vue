<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- 头部区域 -->
    <div class="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <span class="text-3xl">💬</span>
              金铲铲论坛
            </h1>
            <p class="text-gray-400 mt-1">分享攻略、讨论阵容、结交好友</p>
          </div>
          
          <router-link 
            to="/forum/new" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/30"
          >
            <span class="text-xl">✏️</span>
            发布帖子
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主标签页 -->
    <div class="max-w-6xl mx-auto px-4 pt-4">
      <div class="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2.5 rounded-lg font-medium transition-all text-sm',
            activeTab === tab.key 
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ===================== 论坛帖子 ===================== -->
    <template v-if="activeTab === 'posts'">
      <!-- 筛选区域 -->
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in forumStore.categories" 
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  selectedCategory === category.id 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                ]"
              >
                <span>{{ category.icon }}</span>
                {{ category.name }}
              </button>
            </div>
            
            <div class="flex-1 min-w-[200px] max-w-md ml-auto">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索帖子标题..." 
                class="w-full"
                clearable
              >
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>
          
          <div class="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <span class="text-gray-400 text-sm">排序：</span>
            <button 
              v-for="sort in sortOptions" 
              :key="sort.value"
              @click="selectedSort = sort.value"
              :class="[
                'text-sm font-medium transition-colors',
                selectedSort === sort.value 
                  ? 'text-purple-400' 
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              {{ sort.label }}
            </button>
            <span class="text-gray-500 text-sm ml-auto">
              共 {{ displayPosts.length }} 篇帖子
            </span>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 pb-8">
        <div v-if="loading" class="text-center py-12">
          <div class="text-2xl text-gray-400">加载中...</div>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="post in displayPosts" 
            :key="post._id || post.id"
            class="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
            @click="goToPost(post)"
          >
            <div class="flex gap-4">
              <div 
                class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                :style="{ background: getAvatarColor(post) }"
              >
                {{ getInitial(post) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="text-lg font-bold text-white hover:text-purple-300 transition-colors line-clamp-1">
                    {{ post.title || '无标题' }}
                  </h3>
                  <div class="flex-shrink-0">
                    <span 
                      v-for="tag in (post.tags || []).slice(0, 2)" 
                      :key="tag"
                      class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium mr-1"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                
                <p class="text-gray-400 text-sm mt-2 line-clamp-2">{{ post.content || '' }}</p>
                
                <div class="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <div class="flex items-center gap-4">
                    <span>{{ post.author?.username || '匿名用户' }}</span>
                    <span>{{ formatTime(post.createdAt) }}</span>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <span class="flex items-center gap-1"><span class="text-lg">👁️</span>{{ post.views || 0 }}</span>
                    <span 
                      class="flex items-center gap-1 cursor-pointer"
                      :class="(post.likes?.length || 0) > 0 ? 'text-red-400' : 'hover:text-red-400'"
                      @click.stop="handleLike(post)"
                    >
                      <span class="text-lg">{{ (post.likes?.length || 0) > 0 ? '❤️' : '🤍' }}</span>
                      {{ post.likes?.length || 0 }}
                    </span>
                    <span class="flex items-center gap-1"><span class="text-lg">💬</span>{{ post.commentCount || 0 }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 帖子缩略图 -->
              <div 
                v-if="post.media && post.media.length > 0 && post.media[0].type === 'image'"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-black/20"
                @click.stop="goToPost(post)"
              >
                <img 
                  :src="getPostThumbnail(post)"
                  class="w-full h-full object-cover"
                  alt="帖子图片"
                />
              </div>
              <div 
                v-else-if="post.media && post.media.length > 0 && post.media[0].type === 'video'"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center"
              >
                <span class="text-2xl">🎬</span>
              </div>
            </div>
          </div>
          
          <div v-if="displayPosts.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📭</div>
            <h3 class="text-xl font-bold text-gray-400">暂无帖子</h3>
            <p class="text-gray-500 mt-2">快来发布第一篇帖子吧！</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ===================== 教学资源 ===================== -->
    <template v-if="activeTab === 'tutorials'">
      <div class="max-w-6xl mx-auto px-4 py-4 pb-8">
        <!-- 筛选栏 -->
        <div class="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4 space-y-3">
          <!-- 分类筛选 -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-gray-400 text-sm flex-shrink-0">分类：</span>
            <button
              v-for="cat in tutorialCategories"
              :key="cat.key"
              @click="tutorialCategory = cat.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                tutorialCategory === cat.key
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              ]"
            >
              {{ cat.icon }} {{ cat.label }}
            </button>
          </div>
          <!-- 平台筛选 -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-gray-400 text-sm flex-shrink-0">平台：</span>
            <button
              v-for="plat in tutorialPlatforms"
              :key="plat.key"
              @click="tutorialPlatform = plat.key"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                tutorialPlatform === plat.key
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              ]"
            >
              {{ plat.icon }} {{ plat.label }}
            </button>
          </div>
          <!-- 搜索 -->
          <div class="flex items-center gap-3">
            <div class="flex-1 max-w-md relative">
              <input
                v-model="tutorialSearch"
                type="text"
                placeholder="搜索教学内容..."
                class="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <span class="text-gray-500 text-sm flex-shrink-0">
              共 <span class="text-purple-400 font-medium">{{ filteredTutorials.length }}</span> 条结果
            </span>
          </div>
        </div>

        <!-- 卡片网格 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- 魔盗团奖励层数攻略（固定卡片，始终显示） -->
          <div v-if="tutorialCategory === 'all' && tutorialPlatform === 'all' && !tutorialSearch" class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <span class="text-xl">💎</span>
              <h3 class="text-lg font-bold text-white">魔盗团奖励层数攻略</h3>
            </div>
            <div class="p-4">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-white/10">
                      <th class="text-left py-3 px-3 text-purple-300 font-medium">层数</th>
                      <th class="text-left py-3 px-3 text-purple-300 font-medium">奖励类型</th>
                      <th class="text-left py-3 px-3 text-purple-300 font-medium">所需进度</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-300">
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold text-yellow-400">1层</td><td class="py-3 px-3">💰 金币</td><td class="py-3 px-3 text-gray-400">9</td></tr>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold">2层</td><td class="py-3 px-3">⚔️ 装备</td><td class="py-3 px-3 text-gray-400">25</td></tr>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold">3层</td><td class="py-3 px-3">💰 金币</td><td class="py-3 px-3 text-gray-400">45</td></tr>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold text-purple-400">4层</td><td class="py-3 px-3">🧩 纹章</td><td class="py-3 px-3 text-gray-400">70</td></tr>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold">5层</td><td class="py-3 px-3">⚔️ 装备</td><td class="py-3 px-3 text-gray-400">110</td></tr>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold text-purple-400">6层</td><td class="py-3 px-3">🧩 纹章</td><td class="py-3 px-3 text-gray-400">150</td></tr>
                    <tr class="hover:bg-white/5 transition-colors"><td class="py-3 px-3 font-bold text-orange-400 text-base">7层</td><td class="py-3 px-3 text-yellow-300 font-medium">✨ 英雄复制器</td><td class="py-3 px-3 text-gray-400">200</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p class="text-yellow-300/80 text-sm">💡 <strong>收菜技巧：</strong>建议在战力允许的情况下尽量叠高层数，7层英雄复制器是终极目标。稳住血量，把握收菜时机！</p>
              </div>
            </div>
          </div>

          <!-- 管理员程序配置推荐（固定卡片） -->
          <div v-if="tutorialCategory === 'all' && tutorialPlatform === 'all' && !tutorialSearch" class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <span class="text-xl">🤖</span>
              <h3 class="text-lg font-bold text-white">管理员程序配置推荐</h3>
            </div>
            <div class="p-4 space-y-3 text-gray-300 text-sm">
              <div class="bg-white/5 rounded-lg p-3">
                <h4 class="text-purple-300 font-medium mb-2">🎯 最强配置组合</h4>
                <div class="space-y-2">
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">选择1</span><span>开局生成一个临时的【英雄复制器】</span></div>
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">选择2</span><span>每回合提供免费刷新次数</span></div>
                  <div class="flex items-center gap-2"><span class="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded text-xs">选择3</span><span>战斗开始时掉落金币</span></div>
                </div>
              </div>
              <div class="bg-white/5 rounded-lg p-3">
                <h4 class="text-green-300 font-medium mb-2">📋 备选方案</h4>
                <p class="text-gray-400 leading-relaxed">如遇卡池不顺，可调整为「经验值加成 + 攻击力提升 + 金币掉落」组合，稳扎稳打保障前期血量。</p>
              </div>
              <div class="bg-white/5 rounded-lg p-3">
                <h4 class="text-orange-300 font-medium mb-2">⚠️ 注意事项</h4>
                <p class="text-gray-400 leading-relaxed">管理员程序加成效果与英雄星级和连胜相关，建议在连胜时优先选择金币类加成滚雪球。</p>
              </div>
            </div>
          </div>

          <!-- 动态教学卡片 -->
          <div
            v-for="t in filteredTutorials"
            :key="t.id"
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all"
          >
            <!-- 卡片头部 -->
            <div class="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-2">
              <h3 class="text-base font-bold text-white line-clamp-1">{{ t.title }}</h3>
              <span
                class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                :class="{
                  'bg-pink-500/20 text-pink-300': t.platform === 'embed',
                  'bg-blue-500/20 text-blue-300': t.platform === 'bilibili',
                  'bg-cyan-500/20 text-cyan-300': t.platform === 'douyin'
                }"
              >
                {{ t.platform === 'embed' ? '📺 直接播放' : t.platform === 'douyin' ? '🎵 抖音' : '🎬 跳转' }}
              </span>
            </div>
            <!-- 卡片内容 -->
            <div class="p-4 space-y-3">
              <!-- 嵌入播放器 / 平台预览 -->
              <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/5">
                <!-- B站嵌入播放 -->
                <iframe
                  v-if="t.platform === 'embed' && t.bvid"
                  :src="`//player.bilibili.com/player.html?bvid=${t.bvid}&page=1&high_quality=1&danmaku=0`"
                  scrolling="no" border="0" frameborder="no" framespacing="0"
                  allowfullscreen="true"
                  class="absolute inset-0 w-full h-full"
                ></iframe>
                <!-- B站跳转预览 -->
                <div v-else-if="t.platform === 'bilibili'" class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900/30 to-slate-800/50">
                  <span class="text-3xl mb-2">🎬</span>
                  <span class="text-gray-300 text-sm text-center mb-1">B站精准视频</span>
                  <span class="text-gray-500 text-xs text-center">点击下方按钮跳转观看</span>
                </div>
                <!-- 抖音跳转预览 -->
                <div v-else-if="t.platform === 'douyin'" class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-900/30 to-slate-800/50">
                  <span class="text-3xl mb-2">🎵</span>
                  <span class="text-gray-300 text-sm text-center mb-1">抖音精准视频</span>
                  <span class="text-gray-500 text-xs text-center">点击下方按钮跳转抖音观看</span>
                </div>
                <!-- 兜底 -->
                <div v-else class="absolute inset-0 flex items-center justify-center">
                  <span class="text-gray-500 text-sm">暂无可播放内容</span>
                </div>
              </div>
              <!-- 描述 -->
              <p class="text-gray-400 text-sm line-clamp-3">{{ t.desc }}</p>
              <!-- 标签 -->
              <div v-if="t.tags && t.tags.length > 0" class="flex flex-wrap gap-1">
                <span v-for="tag in t.tags" :key="tag" class="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">{{ tag }}</span>
              </div>
              <!-- 作者和时长 -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span v-if="t.author">{{ t.author }}</span>
                <span v-if="t.duration" class="text-purple-400">{{ t.duration }}</span>
              </div>
              <!-- 观看按钮 -->
              <a
                :href="t.link"
                target="_blank"
                :class="[
                  'block text-center px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  t.platform === 'embed' ? 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30' :
                  t.platform === 'douyin' ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' :
                  'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                ]"
              >
                {{ t.platform === 'embed' ? '📺 新窗口观看完整视频' : t.platform === 'douyin' ? '🎵 跳转抖音观看此视频' : '🎬 跳转B站观看此视频' }}
              </a>
            </div>
          </div>

          <!-- 无结果 -->
          <div v-if="filteredTutorials.length === 0" class="col-span-full text-center py-12">
            <div class="text-5xl mb-3">🔍</div>
            <h3 class="text-lg font-bold text-gray-400">没有找到相关内容</h3>
            <p class="text-gray-500 text-sm mt-1">试试其他分类或搜索关键词</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ===================== 阵容分享 ===================== -->
    <template v-if="activeTab === 'lineups'">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-4">
            <span class="text-gray-400 text-sm">排序：</span>
            <button 
              v-for="sort in lineupSortOptions" 
              :key="sort.value"
              @click="lineupSort = sort.value"
              :class="[
                'text-sm font-medium transition-colors',
                lineupSort === sort.value ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              ]"
            >
              {{ sort.label }}
            </button>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm">共 {{ lineups.length }} 套阵容</span>
            <button 
              @click="showCreateLineup = true"
              class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all text-sm shadow-lg shadow-purple-500/30"
            >
              ✨ 分享阵容
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 pb-8">
        <div v-if="lineupLoading" class="text-center py-12">
          <div class="text-2xl text-gray-400">加载中...</div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="lineup in sortedLineups" 
            :key="lineup._id"
            class="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  :style="{ background: getAuthorColor(lineup) }"
                >
                  {{ (lineup.author?.username || 'A')[0].toUpperCase() }}
                </div>
                <div>
                  <h3 class="text-white font-bold text-base">{{ lineup.title }}</h3>
                  <span class="text-gray-500 text-xs">{{ lineup.author?.username || '匿名用户' }}</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in (lineup.tags || []).slice(0, 3)" 
                  :key="tag"
                  class="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 英雄展示 -->
            <div class="flex flex-wrap gap-2 mb-3">
              <div 
                v-for="(hero, idx) in (lineup.heroes || []).slice(0, 8)" 
                :key="idx"
                class="bg-white/10 rounded-lg px-3 py-2 flex flex-col items-center min-w-[70px]"
              >
                <span class="text-yellow-300 text-xs font-medium">{{ hero.heroName || hero.heroId }}</span>
                <span class="text-yellow-400 text-xs">{{ '⭐'.repeat(hero.star || 1) }}</span>
                <span v-if="(hero.items || []).length > 0" class="text-gray-400 text-[10px] truncate max-w-full">{{ hero.items.join(' ') }}</span>
              </div>
            </div>

            <p class="text-gray-400 text-sm mb-3 line-clamp-2">{{ lineup.description }}</p>

            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1"><span class="text-lg">👁️</span>{{ lineup.views || 0 }}</span>
                <span 
                  class="flex items-center gap-1 cursor-pointer"
                  :class="(lineup.likes?.length || 0) > 0 ? 'text-red-400' : 'hover:text-red-400'"
                  @click="handleLikeLineup(lineup)"
                >
                  <span class="text-lg">{{ (lineup.likes?.length || 0) > 0 ? '❤️' : '🤍' }}</span>
                  {{ lineup.likes?.length || 0 }}
                </span>
                <span class="flex items-center gap-1"><span class="text-lg">💬</span>{{ (lineup.comments || []).length }}</span>
              </div>
              <button 
                @click="toggleLineupComment(lineup)"
                class="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                评论
              </button>
            </div>

            <!-- 评论区 -->
            <div v-if="expandedLineupId === lineup._id" class="mt-4 pt-4 border-t border-white/10">
              <div v-if="(lineup.comments || []).length > 0" class="space-y-3 mb-3 max-h-[200px] overflow-y-auto">
                <div 
                  v-for="(comment, cIdx) in lineup.comments" 
                  :key="cIdx"
                  class="bg-white/5 rounded-lg p-3"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-purple-300 text-xs font-medium">{{ comment.author?.username || '用户' }}</span>
                    <span class="text-gray-600 text-xs">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <p class="text-gray-400 text-sm">{{ comment.content }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <el-input 
                  v-model="lineupCommentContent[lineup._id]" 
                  placeholder="写下你的评论..."
                  size="small"
                  class="flex-1"
                  @keyup.enter="submitLineupComment(lineup)"
                />
                <button 
                  @click="submitLineupComment(lineup)"
                  class="px-4 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex-shrink-0"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="lineups.length === 0" class="col-span-full text-center py-12">
            <div class="text-6xl mb-4">🛡️</div>
            <h3 class="text-xl font-bold text-gray-400">暂无阵容分享</h3>
            <p class="text-gray-500 mt-2">快来分享你的强力阵容吧！</p>
          </div>
        </div>
      </div>

      <!-- 创建阵容弹窗 -->
      <el-dialog v-model="showCreateLineup" title="分享新阵容" :close-on-click-modal="false" class="lineup-dialog">
        <template #header>
          <span class="text-white text-lg font-bold">✨ 分享新阵容</span>
        </template>
        <el-form :model="createLineupForm" label-position="top">
          <el-form-item label="阵容名称" required>
            <el-input v-model="createLineupForm.title" placeholder="如：机甲精英" maxlength="100" />
          </el-form-item>
          <el-form-item label="阵容描述" required>
            <el-input v-model="createLineupForm.description" type="textarea" :rows="3" placeholder="描述阵容核心玩法..." maxlength="5000" />
          </el-form-item>
          <el-form-item label="英雄配置">
            <div class="space-y-2 w-full">
              <div v-for="(hero, idx) in createLineupForm.heroes" :key="idx" class="flex gap-2 items-center">
                <el-input v-model="hero.heroId" placeholder="英雄ID" size="small" class="w-24" />
                <el-input v-model="hero.heroName" placeholder="名称" size="small" class="w-20" />
                <el-select v-model="hero.star" size="small" class="w-20">
                  <el-option v-for="n in 5" :key="n" :label="'⭐'.repeat(n)" :value="n" />
                </el-select>
                <el-input v-model="hero.itemsStr" placeholder="装备(空格分隔)" size="small" class="flex-1" @change="updateHeroItems(idx)" />
                <button @click="removeHero(idx)" class="text-red-400 hover:text-red-300 text-sm">✕</button>
              </div>
              <button @click="addHero" class="text-purple-400 hover:text-purple-300 text-sm">+ 添加英雄</button>
            </div>
          </el-form-item>
          <el-form-item label="站位描述">
            <el-input v-model="createLineupForm.positioning" type="textarea" :rows="2" placeholder="描述棋子站位（如：前排左1放盖伦...）" maxlength="1000" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="createLineupForm.tagsStr" placeholder="多个标签用逗号分隔，如：机甲,前排" maxlength="200" />
          </el-form-item>
        </el-form>
        <template #footer>
          <button @click="showCreateLineup = false" class="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors">取消</button>
          <button @click="submitCreateLineup" :disabled="!createLineupForm.title || !createLineupForm.description" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50">发布</button>
        </template>
      </el-dialog>
    </template>

    <!-- ===================== 赛事资讯 ===================== -->
    <template v-if="activeTab === 'esports'">
      <div class="max-w-6xl mx-auto px-4 py-4 pb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 版本更新公告 -->
          <div class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden lg:col-span-2">
            <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <span class="text-xl">📢</span>
              <h3 class="text-lg font-bold text-white">版本更新公告</h3>
            </div>
            <div class="p-4">
              <div v-if="announcementLoading" class="text-center py-8 text-gray-400">加载中...</div>
              <div v-else-if="announcements.length > 0" class="space-y-3">
                <div 
                  v-for="ann in announcements.slice(0, 5)" 
                  :key="ann._id"
                  class="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  @click="toggleAnnouncement(ann)"
                >
                  <span class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                    :class="ann.type === 'urgent' ? 'bg-red-500/20 text-red-400' : ann.isPinned ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'"
                  >
                    {{ ann.type === 'urgent' ? '紧急' : ann.isPinned ? '置顶' : '公告' }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-white font-medium">{{ ann.title }}</h4>
                    <div v-if="expandedAnnouncementId === ann._id" class="mt-2 text-gray-400 text-sm whitespace-pre-wrap">{{ ann.content }}</div>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{{ ann.author?.username || '管理员' }}</span>
                      <span>{{ formatTime(ann.createdAt) }}</span>
                      <span>👁️ {{ ann.viewCount || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">暂无版本公告</div>
            </div>
          </div>

          <!-- 游戏平衡性解读 -->
          <div class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <span class="text-xl">⚖️</span>
              <h3 class="text-lg font-bold text-white">平衡性解读</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">加强</span>
                  <span class="text-gray-500 text-xs">2026.06 版本调整</span>
                </div>
                <h4 class="text-white font-medium mb-2">S8 怪兽入侵赛季平衡调整回顾</h4>
                <ul class="text-gray-400 text-sm space-y-1.5 list-disc list-inside">
                  <li>战斗机甲吸收基础生命值提升5%</li>
                  <li>精英战士处决阈值从30%提升至33%</li>
                  <li>星之守护者法力回复加成40%/70%/100%/150%</li>
                  <li>怪兽棋子基础属性普遍高于同费英雄</li>
                </ul>
              </div>
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">削弱</span>
                  <span class="text-gray-500 text-xs">持续关注</span>
                </div>
                <h4 class="text-white font-medium mb-2">S8返场版本调整</h4>
                <ul class="text-gray-400 text-sm space-y-1.5 list-disc list-inside">
                  <li>地下魔盗团叠加进度数值回调</li>
                  <li>部分三费卡技能伤害系数小幅下调</li>
                </ul>
              </div>
              <p class="text-gray-500 text-xs text-center mt-2">
                以上内容由管理员维护更新，实际以游戏内公告为准
              </p>
            </div>
          </div>

          <!-- JOC金铲铲公开赛 -->
          <div class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div class="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <span class="text-xl">🏆</span>
              <h3 class="text-lg font-bold text-white">金铲铲公开赛 JOC</h3>
            </div>
            <div class="p-4 space-y-3">
              <!-- 夏季赛总决赛 -->
              <div class="bg-white/5 rounded-lg p-3 border border-yellow-500/20">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-yellow-400 font-medium text-sm">🔥 JOC 夏季赛总决赛</span>
                  <span class="text-yellow-400/50 text-xs">7月2日-7月4日</span>
                </div>
                <div class="text-gray-400 text-sm space-y-1">
                  <p>📍 地点：<span class="text-white">杭州西湖体育馆</span></p>
                  <p>💰 奖金：<span class="text-yellow-300">冠军100万元</span></p>
                  <p>📺 直播：<span class="text-blue-300">Joc.qq.com / 虎牙 / 斗鱼 / B站</span></p>
                </div>
              </div>
              <!-- 赛程安排 -->
              <div class="bg-white/5 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-300 font-medium text-sm">📅 赛程安排</span>
                </div>
                <div class="text-gray-400 text-sm space-y-2">
                  <div class="flex justify-between">
                    <span>4月23日 - 5月31日</span>
                    <span class="text-purple-300">四大赛道选拔</span>
                  </div>
                  <div class="flex justify-between">
                    <span>6月11日 - 7月1日</span>
                    <span class="text-blue-300">全国总决赛线上阶段</span>
                  </div>
                  <div class="flex justify-between">
                    <span>7月2日</span>
                    <span class="text-orange-300">半决赛</span>
                  </div>
                  <div class="flex justify-between">
                    <span>7月4日 14:00</span>
                    <span class="text-yellow-300 font-medium">冠军之战</span>
                  </div>
                </div>
              </div>
              <!-- 四大赛道 -->
              <div class="bg-white/5 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-300 font-medium text-sm">🛤️ 四大赛道</span>
                </div>
                <div class="text-gray-400 text-sm space-y-1">
                  <p>🎮 <span class="text-white">平台赛道</span> — 斗鱼/快手/B站/虎牙/抖音</p>
                  <p>🏫 <span class="text-white">高校赛道</span> — 全国高校选拔</p>
                  <p>⭐ <span class="text-white">精英巡回赛</span> — 职业选手赛道</p>
                  <p>🌐 <span class="text-white">全民赛道</span> — 全民参与突围</p>
                </div>
              </div>
              <!-- 春季赛回顾 -->
              <div class="bg-white/5 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400 font-medium text-sm">🏅 春季赛回顾</span>
                  <span class="text-gray-500 text-xs">已结束</span>
                </div>
                <div class="text-gray-400 text-sm space-y-1">
                  <p>冠军：<span class="text-yellow-300">TLG糕手雕妹</span></p>
                  <p>地点：<span class="text-white">广州塔</span></p>
                  <p>奖金：<span class="text-yellow-300">100万元</span></p>
                </div>
              </div>
              <a href="https://joc.qq.com/" target="_blank" 
                 class="block text-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors">
                🏆 进入JOC官网观赛
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '../stores/forum'
import { lineupApi, announcementApi } from '../services/api'
import { ElMessage } from 'element-plus'
import { tutorials, tutorialCategories, tutorialPlatforms } from '../data/tutorialData'

const router = useRouter()
const forumStore = useForumStore()

// ========== 主标签页 ==========
const activeTab = ref('posts')
const tabs = [
  { key: 'posts', label: '论坛帖子', icon: '💬' },
  { key: 'tutorials', label: '教学资源', icon: '📚' },
  { key: 'lineups', label: '阵容分享', icon: '🛡️' },
  { key: 'esports', label: '赛事资讯', icon: '🏆' }
]

// ========== 教学资源筛选 ==========
const tutorialCategory = ref('all')
const tutorialPlatform = ref('all')
const tutorialSearch = ref('')

const filteredTutorials = computed(() => {
  let result = [...tutorials]
  
  if (tutorialCategory.value !== 'all') {
    result = result.filter(t => t.category === tutorialCategory.value)
  }
  
  if (tutorialPlatform.value !== 'all') {
    result = result.filter(t => t.platform === tutorialPlatform.value)
  }
  
  if (tutorialSearch.value.trim()) {
    const kw = tutorialSearch.value.trim().toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(kw) ||
      t.desc.toLowerCase().includes(kw) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(kw)))
    )
  }
  
  return result
})

// ========== 帖子相关 ==========
const selectedCategory = ref('all')
const searchKeyword = ref('')
const selectedSort = ref('latest')
const loading = ref(false)

const sortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '最多点赞', value: 'likes' },
  { label: '最多评论', value: 'comments' },
  { label: '最多浏览', value: 'views' }
]

const displayPosts = computed(() => {
  let result = [...forumStore.posts]
  
  if (selectedCategory.value !== 'all') {
    result = result.filter(post => post.category === selectedCategory.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(post => 
      (post.title && post.title.toLowerCase().includes(keyword)) ||
      (post.content && post.content.toLowerCase().includes(keyword))
    )
  }
  
  switch (selectedSort.value) {
    case 'likes':
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      break
    case 'comments':
      result.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
      break
    case 'views':
      result.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  
  return result
})

const getAvatarColor = (post) => {
  const username = post.author?.username || 'A'
  const hue = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}, 70%, 50%)`
}

const getInitial = (post) => (post.author?.username || 'A')[0].toUpperCase()

const getPostThumbnail = (post) => {
  if (!post.media || post.media.length === 0) return ''
  const url = post.media[0].url || ''
  return url.startsWith('http') ? url : url // 相对路径走 Vite proxy
}

const getAuthorColor = (lineup) => {
  const username = lineup.author?.username || 'A'
  const hue = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `hsl(${hue}, 70%, 50%)`
}

const goToPost = (post) => {
  const id = post._id || post.id
  if (!id) {
    ElMessage.error('帖子信息异常')
    return
  }
  router.push(`/forum/${id}`)
}

const handleLike = async (post) => {
  const postId = post._id || post.id
  await forumStore.likePost(postId)
}

// ========== 阵容分享相关 ==========
const lineups = ref([])
const lineupLoading = ref(false)
const lineupSort = ref('latest')
const showCreateLineup = ref(false)
const expandedLineupId = ref(null)
const lineupCommentContent = ref({})

const lineupSortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '最多点赞', value: 'likes' }
]

const sortedLineups = computed(() => {
  const arr = [...lineups.value]
  if (lineupSort.value === 'likes') {
    return arr.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  }
  return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const createLineupForm = ref({
  title: '',
  description: '',
  heroes: [{ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] }],
  positioning: '',
  tagsStr: ''
})

const addHero = () => {
  createLineupForm.value.heroes.push({ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] })
}

const removeHero = (idx) => {
  if (createLineupForm.value.heroes.length > 1) {
    createLineupForm.value.heroes.splice(idx, 1)
  }
}

const updateHeroItems = (idx) => {
  const hero = createLineupForm.value.heroes[idx]
  hero.items = (hero.itemsStr || '').split(/\s+/).filter(Boolean)
}

const submitCreateLineup = async () => {
  if (!createLineupForm.value.title || !createLineupForm.value.description) return
  try {
    const heroes = createLineupForm.value.heroes.map(h => ({
      heroId: h.heroId,
      heroName: h.heroName || h.heroId,
      star: h.star,
      items: h.items || []
    }))
    const tags = (createLineupForm.value.tagsStr || '').split(',').map(t => t.trim()).filter(Boolean)
    
    await lineupApi.createLineup({
      title: createLineupForm.value.title,
      description: createLineupForm.value.description,
      heroes,
      positioning: createLineupForm.value.positioning,
      tags
    })
    
    ElMessage.success('阵容分享成功！')
    showCreateLineup.value = false
    // 重置表单
    createLineupForm.value = {
      title: '',
      description: '',
      heroes: [{ heroId: '', heroName: '', star: 1, itemsStr: '', items: [] }],
      positioning: '',
      tagsStr: ''
    }
    await fetchLineups()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '分享失败')
  }
}

const fetchLineups = async () => {
  lineupLoading.value = true
  try {
    const { data } = await lineupApi.getLineups({ limit: 20, sort: lineupSort.value })
    lineups.value = data.data || []
  } catch (error) {
    console.error('获取阵容失败:', error)
    lineups.value = []
  } finally {
    lineupLoading.value = false
  }
}

const handleLikeLineup = async (lineup) => {
  try {
    const { data } = await lineupApi.likeLineup(lineup._id)
    lineup.likes = data.data?.likes || []
  } catch (error) {
    ElMessage.error('操作失败，请先登录')
  }
}

const toggleLineupComment = async (lineup) => {
  if (expandedLineupId.value === lineup._id) {
    expandedLineupId.value = null
    return
  }
  expandedLineupId.value = lineup._id
  if (!lineupCommentContent.value[lineup._id]) {
    lineupCommentContent.value[lineup._id] = ''
  }
  // 刷新评论
  try {
    const { data } = await lineupApi.getComments(lineup._id)
    lineup.comments = data.data || []
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

const submitLineupComment = async (lineup) => {
  const content = lineupCommentContent.value[lineup._id]?.trim()
  if (!content) return
  try {
    const { data } = await lineupApi.addComment(lineup._id, { content })
    if (!lineup.comments) lineup.comments = []
    lineup.comments.push(data.data)
    lineupCommentContent.value[lineup._id] = ''
    ElMessage.success('评论成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '评论失败')
  }
}

// ========== 赛事资讯相关 ==========
const announcements = ref([])
const announcementLoading = ref(false)
const expandedAnnouncementId = ref(null)

const fetchAnnouncements = async () => {
  announcementLoading.value = true
  try {
    const { data } = await announcementApi.getAnnouncements({ limit: 10 })
    announcements.value = data.data || []
  } catch (error) {
    console.error('获取公告失败:', error)
  } finally {
    announcementLoading.value = false
  }
}

const toggleAnnouncement = (ann) => {
  expandedAnnouncementId.value = expandedAnnouncementId.value === ann._id ? null : ann._id
}

// ========== 工具函数 ==========
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const ts = new Date(timestamp).getTime()
  const now = Date.now()
  const diff = now - ts
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// ========== 初始化 ==========
onMounted(async () => {
  loading.value = true
  try {
    await forumStore.fetchPosts()
  } catch (error) {
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
  fetchLineups()
  fetchAnnouncements()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style>
.lineup-dialog {
  background: #1a1a2e !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.lineup-dialog .el-dialog__header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
}
.lineup-dialog .el-dialog__body {
  padding: 20px;
}
.lineup-dialog .el-form-item__label {
  color: #999 !important;
}
.lineup-dialog .el-input__wrapper,
.lineup-dialog .el-textarea__inner {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}
.lineup-dialog .el-input__inner,
.lineup-dialog .el-textarea__inner {
  color: #fff !important;
}
.lineup-dialog .el-select .el-input__wrapper {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>
