<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/" class="flex items-center text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回首页</span>
        </router-link>
      </div>

      <!-- 页面标题 -->
      <div class="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl p-6 border border-white/10 mb-6">
        <h1 class="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <span class="text-3xl">👤</span>
          个人中心
        </h1>
        <p class="text-gray-400">管理您的个人资料和游戏战绩</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧：头像和统计信息 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 头像卡片 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div class="text-center">
              <div class="relative inline-block mb-4">
                <div 
                  class="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg"
                  :style="{ background: avatarBg }"
                >
                  {{ userStore.userInfo?.avatar || userStore.userInfo?.username?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <label class="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input type="file" class="hidden" @change="handleAvatarUpload" accept="image/*" />
                </label>
              </div>
              <h2 class="text-xl font-bold text-white mb-1">{{ userStore.userInfo?.username }}</h2>
              <!-- 角色标识 -->
              <div class="flex items-center justify-center gap-2 mb-2">
                <span v-if="userStore.userInfo?.type === 'creator'" class="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <span>🎨</span>
                  内容创作者
                </span>
                <span v-else class="px-2 py-0.5 bg-slate-600 text-gray-300 text-xs font-medium rounded-full flex items-center gap-1">
                  <span>🎮</span>
                  普通玩家
                </span>
              </div>
            </div>
            
            <!-- 统计数据 -->
            <div class="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10">
              <div class="text-center">
                <div class="text-xl font-bold text-purple-400">{{ matchStats.totalGames || '--' }}</div>
                <div class="text-xs text-gray-500">对局数</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-yellow-400">{{ matchStats.wins || '--' }}</div>
                <div class="text-xs text-gray-500">登顶</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-blue-400">{{ matchStats.winRate || '--' }}%</div>
                <div class="text-xs text-gray-500">胜率</div>
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-lg">⚡</span>
              快捷操作
            </h3>
            <div class="space-y-2">
              <!-- 创作者专属功能 -->
              <div v-if="userStore.userInfo?.type === 'creator'" class="mb-4 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/30">
                <p class="text-pink-300 text-xs font-medium mb-2 flex items-center gap-1">
                  <span>🎨</span>
                  创作者专属功能
                </p>
                <router-link to="/teamfight" class="w-full px-4 py-2.5 bg-pink-500/30 hover:bg-pink-500/40 text-pink-200 rounded-lg text-left transition-colors flex items-center gap-3 mb-2">
                  <span>📝</span>
                  <span>发布阵容攻略</span>
                </router-link>
                <button class="w-full px-4 py-2.5 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 rounded-lg text-left transition-colors flex items-center gap-3">
                  <span>📊</span>
                  <span>编辑阵容数据</span>
                </button>
              </div>
              <!-- 普通功能 -->
              <router-link to="/teamfight" class="w-full px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center gap-3">
                <span>📁</span>
                <span>我的阵容收藏</span>
              </router-link>
              <router-link to="/dashboard" class="w-full px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center gap-3">
                <span>🏆</span>
                <span>战绩记录</span>
              </router-link>
              <button @click="showTargetDialog = true" class="w-full px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-left transition-colors flex items-center gap-3">
                <span>🎯</span>
                <span>目标设置</span>
              </button>
              <button @click="showPasswordDialog = true" class="w-full px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-left transition-colors flex items-center gap-3">
                <span>🔒</span>
                <span>修改密码</span>
              </button>
              <!-- 社交功能 -->
              <router-link to="/social" class="w-full px-4 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg transition-colors flex items-center gap-3">
                <span>💬</span>
                <span>私信消息</span>
                <span v-if="unreadMessages > 0" class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadMessages }}</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 右侧：编辑表单和战绩 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 战绩同步 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-lg">🎮</span>
              战绩同步
            </h3>
            <p class="text-sm text-gray-400 mb-4 leading-relaxed">
              本系统会自动发现本机运行中的英雄联盟客户端，无需手动填写账号信息。
              请先在电脑上启动客户端并登录，再点击下方按钮。
            </p>
            <button
              @click="syncMatchData"
              :disabled="isMatchSyncing"
              class="w-full px-4 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isMatchSyncing" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isMatchSyncing ? '同步中...' : '从本机客户端同步最近战绩' }}
            </button>
            <p class="text-xs text-gray-500 mt-3">
              💡 手机端金铲铲玩家可前往「我的战绩」页面手动录入对局。
            </p>
          </div>

          <!-- 战绩统计详情 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span class="text-lg">📊</span>
                战绩统计
              </h3>
              <button 
                @click="syncMatchData"
                :disabled="isMatchSyncing"
                class="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-600 text-purple-300 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <svg v-if="isMatchSyncing" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isMatchSyncing ? '刷新中...' : '刷新数据' }}
              </button>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-purple-400">{{ matchStats.totalGames }}</div>
                <div class="text-xs text-gray-400 mt-1">总对局数</div>
              </div>
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-yellow-400">{{ matchStats.wins }}</div>
                <div class="text-xs text-gray-400 mt-1">第一名</div>
              </div>
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-blue-400">{{ matchStats.top4 }}</div>
                <div class="text-xs text-gray-400 mt-1">前四名</div>
              </div>
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-green-400">{{ matchStats.winRate }}%</div>
                <div class="text-xs text-gray-400 mt-1">胜率</div>
              </div>
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-cyan-400">{{ matchStats.top4Rate }}%</div>
                <div class="text-xs text-gray-400 mt-1">前四率</div>
              </div>
              <div class="bg-white/5 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-pink-400">{{ matchStats.avgPlacement }}</div>
                <div class="text-xs text-gray-400 mt-1">平均排名</div>
              </div>
            </div>
          </div>

          <!-- 最近战绩列表 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-lg">🎯</span>
              最近战绩
            </h3>
            
            <div v-if="isMatchSyncing" class="flex items-center justify-center py-12">
              <div class="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"></div>
            </div>

            <div v-else-if="matchHistoryList.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <div class="text-gray-400">暂无战绩数据</div>
              <div class="text-gray-500 text-sm mt-2">同步本机客户端战绩，或手动录入对局</div>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="match in matchHistoryList"
                :key="match._id"
                class="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <div class="flex items-center justify-between flex-wrap gap-3">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      :class="getPlacementClass(match.placement)"
                    >
                      {{ match.placement }}
                    </div>
                    <div>
                      <div class="text-white font-medium text-sm">
                        {{ formatDate(match.playedAt) }}
                      </div>
                      <div class="text-gray-400 text-xs mt-0.5">
                        等级 {{ match.level || '--' }} | 时长 {{ match.gameDuration || '--' }} 分钟
                        <span class="ml-1 px-1 py-0.5 rounded text-[10px]"
                          :class="match.source === 'lcu' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'"
                        >{{ match.source === 'lcu' ? '自动同步' : '手动录入' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="trait in (match.traits || []).slice(0, 3)"
                      :key="trait"
                      class="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                    >
                      {{ traitName(trait) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 基本信息编辑 -->
          <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-lg">📝</span>
              编辑资料
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 昵称 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">昵称</label>
                <input 
                  v-model="formData.nickname"
                  type="text"
                  class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="请输入昵称"
                />
              </div>

              <!-- 性别 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">性别</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      v-model="formData.gender"
                      type="radio" 
                      value="male"
                      class="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500"
                    />
                    <span class="text-gray-300">男</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      v-model="formData.gender"
                      type="radio" 
                      value="female"
                      class="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500"
                    />
                    <span class="text-gray-300">女</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      v-model="formData.gender"
                      type="radio" 
                      value="secret"
                      class="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500"
                    />
                    <span class="text-gray-300">保密</span>
                  </label>
                </div>
              </div>

              <!-- 年龄 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">年龄段</label>
                <select 
                  v-model="formData.ageGroup"
                  class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" class="bg-slate-900">请选择年龄段</option>
                  <option value="12-17" class="bg-slate-900">12-17岁</option>
                  <option value="18-24" class="bg-slate-900">18-24岁</option>
                  <option value="25-30" class="bg-slate-900">25-30岁</option>
                  <option value="31-40" class="bg-slate-900">31-40岁</option>
                  <option value="40+" class="bg-slate-900">40岁以上</option>
                </select>
              </div>

              <!-- 地区 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">地区</label>
                <input 
                  v-model="formData.region"
                  type="text"
                  class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="请输入所在地区"
                />
              </div>

              <!-- 游戏段位 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">游戏段位</label>
                <select 
                  v-model="formData.rank"
                  class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" class="bg-slate-900">请选择段位</option>
                  <option value="unranked" class="bg-slate-900">无段位</option>
                  <option value="bronze" class="bg-slate-900">青铜</option>
                  <option value="silver" class="bg-slate-900">白银</option>
                  <option value="gold" class="bg-slate-900">黄金</option>
                  <option value="platinum" class="bg-slate-900">铂金</option>
                  <option value="diamond" class="bg-slate-900">钻石</option>
                  <option value="master" class="bg-slate-900">大师</option>
                  <option value="challenger" class="bg-slate-900">王者</option>
                </select>
              </div>

              <!-- 个性签名 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">个性签名</label>
                <textarea 
                  v-model="formData.bio"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  placeholder="分享你的游戏心得..."
                ></textarea>
              </div>

              <!-- 标签 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">个人标签</label>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    v-for="(tag, index) in formData.tags" 
                    :key="index"
                    class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1"
                  >
                    {{ tag }}
                    <button @click="removeTag(index)" class="hover:text-purple-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input 
                    v-model="newTag"
                    type="text"
                    class="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    placeholder="输入标签后按回车"
                    @keyup.enter="addTag"
                  />
                  <button @click="addTag" class="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                    添加
                  </button>
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="md:col-span-2 flex gap-3 pt-4">
                <button 
                  @click="resetForm"
                  class="px-6 py-2.5 border border-white/20 hover:bg-white/5 text-gray-300 rounded-lg transition-colors"
                >
                  重置
                </button>
                <button 
                  @click="saveProfile"
                  class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  保存资料
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 目标设置对话框 -->
      <el-dialog v-model="showTargetDialog" title="🎯 目标设置" width="450px">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">目标段位</label>
            <select v-model="targetForm.rank" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white">
              <option value="" class="bg-slate-900">请选择目标段位</option>
              <option value="diamond" class="bg-slate-900">钻石</option>
              <option value="master" class="bg-slate-900">大师</option>
              <option value="grandmaster" class="bg-slate-900">宗师</option>
              <option value="challenger" class="bg-slate-900">王者</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">目标胜率</label>
            <div class="flex items-center gap-3">
              <input v-model.number="targetForm.winRate" type="number" min="0" max="100" class="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white" placeholder="例如: 60" />
              <span class="text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">目标阵容</label>
            <input v-model="targetForm.favoriteTeam" type="text" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white" placeholder="例如: 机甲贾克斯" />
          </div>
        </div>
        <template #footer>
          <el-button @click="showTargetDialog = false" class="text-gray-400">取消</el-button>
          <el-button type="primary" @click="saveTarget" class="bg-gradient-to-r from-green-500 to-emerald-500 border-none">保存目标</el-button>
        </template>
      </el-dialog>

      <!-- 修改密码对话框 -->
      <el-dialog v-model="showPasswordDialog" title="🔒 修改密码" width="400px">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
            <input v-model="passwordForm.oldPassword" type="password" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white" placeholder="请输入当前密码" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">新密码</label>
            <input v-model="passwordForm.newPassword" type="password" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white" placeholder="请输入新密码" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">确认新密码</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white" placeholder="请再次输入新密码" />
          </div>
        </div>
        <template #footer>
          <el-button @click="showPasswordDialog = false" class="text-gray-400">取消</el-button>
          <el-button type="primary" @click="changePassword" class="bg-gradient-to-r from-red-500 to-pink-500 border-none">修改密码</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { userApi, recordApi } from '../services/api'
import { traitName } from '../services/tftNameMap'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 战绩数据：来自后端 MatchRecord（手动录入 + LCU 自动同步统一一套）
const matchStats = ref({
  totalGames: 0,
  wins: 0,
  top4: 0,
  winRate: 0,
  top4Rate: 0,
  avgPlacement: 0
})
const matchHistoryList = ref([])
const isMatchSyncing = ref(false)

const formData = reactive({
  nickname: '',
  gender: '',
  ageGroup: '',
  region: '',
  rank: '',
  bio: '',
  tags: []
})

const newTag = ref('')

// 对话框状态
const showTargetDialog = ref(false)
const showPasswordDialog = ref(false)

// 目标表单
const targetForm = reactive({
  rank: '',
  winRate: null,
  favoriteTeam: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const unreadMessages = ref(0)

// 保存目标设置（落库）
const saveTarget = async () => {
  try {
    await userStore.updateProfile({
      targetRank: targetForm.rank,
      targetWinRate: targetForm.winRate,
      targetTeam: targetForm.favoriteTeam
    })
    ElMessage.success('目标设置已保存')
    showTargetDialog.value = false
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  }
}

// 修改密码（校验旧密码后落库）
const changePassword = async () => {
  if (!passwordForm.oldPassword) {
    ElMessage.warning('请输入当前密码')
    return
  }
  if (!passwordForm.newPassword) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于6位')
    return
  }
  try {
    await userApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  }
}

const avatarBg = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ]
  if (!userStore.userInfo) return colors[0]
  // ObjectId 为十六进制字符串，用字符码求和取索引
  const idStr = String(userStore.userInfo._id || '')
  const index = idStr.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length
  return colors[index]
})

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        await userStore.updateProfile({ avatar: e.target.result })
        ElMessage.success('头像上传成功')
      } catch (error) {
        ElMessage.error(error.message || '头像上传失败')
      }
    }
    reader.readAsDataURL(file)
  }
}

/**
 * 从后端加载战绩统计与最近对局
 */
const loadRecordData = async () => {
  try {
    const res = await recordApi.getList({ page: 1, limit: 5 })
    const payload = res.data.data
    const s = payload.stats
    matchStats.value = s
      ? {
          totalGames: s.totalGames,
          wins: s.wins,
          top4: s.top4s,
          winRate: s.winRate,
          top4Rate: s.top4Rate,
          avgPlacement: s.avgPlacement
        }
      : { totalGames: 0, wins: 0, top4: 0, winRate: 0, top4Rate: 0, avgPlacement: 0 }
    matchHistoryList.value = payload.records || []
  } catch {
    // 未登录或暂无数据时保持空态
  }
}

/**
 * 触发服务端从本机英雄联盟客户端同步，然后刷新本页数据
 */
const syncMatchData = async () => {
  isMatchSyncing.value = true
  try {
    const res = await recordApi.syncLCU()
    const { synced, total } = res.data.data
    ElMessage.success(`同步完成：新增 ${synced} 场，累计 ${total} 场`)
    await loadRecordData()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.message || '同步失败')
  } finally {
    isMatchSyncing.value = false
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

const resetForm = () => {
  const user = userStore.userInfo || {}
  formData.nickname = user.username || ''
  formData.gender = user.gender || ''
  formData.ageGroup = user.ageGroup || ''
  formData.region = user.region || ''
  formData.rank = user.rank || ''
  formData.bio = user.bio || ''
  formData.tags = user.tags ? [...user.tags] : []
}

const saveProfile = async () => {
  try {
    await userStore.updateProfile({
      username: formData.nickname,
      gender: formData.gender,
      ageGroup: formData.ageGroup,
      region: formData.region,
      rank: formData.rank,
      bio: formData.bio,
      tags: formData.tags
    })
    ElMessage.success('资料保存成功')
  } catch (error) {
    ElMessage.error(error.message || '资料保存失败')
  }
}

const getPlacementClass = (placement) => {
  if (placement === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'
  if (placement === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
  if (placement === 3) return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
  if (placement <= 4) return 'bg-blue-500/30 text-blue-300'
  return 'bg-gray-500/30 text-gray-400'
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  resetForm()
  loadRecordData()
})
</script>