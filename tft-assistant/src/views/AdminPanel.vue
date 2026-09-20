<template>
  <div class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">管理中心</h1>
          <p class="text-gray-400 mt-2">管理用户、发布公告、数据统计</p>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">总用户数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalUsers }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">📝</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">总帖子数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalPosts }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">⏳</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">待审核</div>
              <div class="text-2xl font-bold text-white">{{ stats.pendingPosts }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">📢</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">公告数</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalAnnouncements }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">🟢</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">今日活跃</div>
              <div class="text-2xl font-bold text-white">{{ stats.todayActive || 0 }}</div>
            </div>
          </div>
        </div>
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">💬</span>
            </div>
            <div>
              <div class="text-gray-400 text-sm">反馈待处理</div>
              <div class="text-2xl font-bold text-white">{{ stats.unprocessedFeedbacks || 0 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="flex gap-4 mb-6 flex-wrap">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-6 py-3 rounded-xl font-medium transition-all"
          :class="activeTab === tab.value 
            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
            : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- 用户管理 -->
      <div v-if="activeTab === 'users'" class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">用户管理</h2>
          <div class="flex gap-4">
            <input 
              v-model="searchQuery"
              placeholder="搜索用户名或邮箱..."
              class="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500"
              @input="searchUsers"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-gray-400 text-sm border-b border-white/10">
                <th class="text-left py-3 px-4">用户</th>
                <th class="text-left py-3 px-4">邮箱</th>
                <th class="text-left py-3 px-4">角色</th>
                <th class="text-left py-3 px-4">注册时间</th>
                <th class="text-left py-3 px-4">状态</th>
                <th class="text-left py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id" class="text-white border-b border-white/5 hover:bg-white/5">
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                      {{ user.username[0].toUpperCase() }}
                    </div>
                    <span>{{ user.username }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-gray-400">{{ user.email }}</td>
                <td class="py-4 px-4">
                  <span class="px-3 py-1 rounded-full text-sm" 
                    :class="user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'">
                    {{ user.role === 'admin' ? '管理员' : '用户' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-400">{{ formatDate(user.createdAt) }}</td>
                <td class="py-4 px-4">
                  <span class="px-3 py-1 rounded-full text-sm"
                    :class="user.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
                    {{ user.isBanned ? '已封禁' : '正常' }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex gap-2">
                    <button 
                      @click="toggleBan(user)"
                      class="px-3 py-1 text-sm rounded-lg transition-colors"
                      :class="user.isBanned 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'"
                    >
                      {{ user.isBanned ? '解封' : '封禁' }}
                    </button>
                    <button 
                      v-if="user.role !== 'admin'"
                      @click="setAdmin(user)"
                      class="px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg text-sm transition-colors"
                    >
                      设为管理员
                    </button>
                    <button 
                      @click="deleteUser(user)"
                      class="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 内容审核 -->
      <div v-if="activeTab === 'review'" class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">内容审核</h2>
            <p class="text-gray-400 text-sm mt-1">待审核帖子: {{ pendingPosts.length }}</p>
          </div>
          <button @click="loadPendingPosts" class="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl text-sm transition-colors">
            刷新
          </button>
        </div>

        <div v-if="pendingPosts.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">✅</div>
          <div class="text-gray-400">暂无待审核内容</div>
        </div>

        <div class="space-y-4">
          <div v-for="post in pendingPosts" :key="post._id" 
            class="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-yellow-500/30 transition-all">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm">
                    {{ post.author?.username?.[0]?.toUpperCase() }}
                  </div>
                  <span class="text-white font-medium">{{ post.author?.username }}</span>
                  <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{{ post.category }}</span>
                  <span class="text-gray-500 text-xs">{{ formatDate(post.createdAt) }}</span>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">{{ post.title }}</h3>
                <p class="text-gray-400 text-sm line-clamp-3 mb-3">{{ post.content }}</p>
                <div class="flex gap-2">
                  <button 
                    @click="approvePost(post._id)"
                    class="px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm transition-colors"
                  >
                    通过
                  </button>
                  <button 
                    @click="showRejectDialog(post)"
                    class="px-4 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                  >
                    拒绝
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 公告管理 -->
      <div v-if="activeTab === 'announcements'" class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">公告管理</h2>
          <button 
            @click="showAnnouncementDialog = true"
            class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
          >
            发布公告
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="ann in announcements" :key="ann._id" 
            class="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded text-xs" :class="getTypeClass(ann.type)">
                    {{ getTypeName(ann.type) }}
                  </span>
                  <span v-if="ann.isPinned" class="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    置顶
                  </span>
                  <h3 class="text-lg font-bold text-white">{{ ann.title }}</h3>
                </div>
                <p class="text-gray-400 text-sm line-clamp-2">{{ ann.content }}</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>发布者: {{ ann.author?.username }}</span>
                  <span>{{ formatDate(ann.createdAt) }}</span>
                  <span>浏览: {{ ann.viewCount }}</span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button @click="editAnnouncement(ann)" class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                  编辑
                </button>
                <button @click="deleteAnnouncement(ann._id)" class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
                  删除
                </button>
              </div>
            </div>
          </div>

          <div v-if="announcements.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📢</div>
            <div class="text-gray-400">暂无公告</div>
          </div>
        </div>
      </div>

      <!-- 数据维护 -->
      <div v-if="activeTab === 'maintenance'" class="space-y-6">
        <!-- 游戏数据概览 -->
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-white">游戏数据概览</h2>
              <p class="text-gray-400 text-sm mt-1">当前活跃版本的数据统计</p>
            </div>
            <button @click="$router.push('/admin/game-data')" class="px-4 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-xl text-sm transition-colors">
              进入数据维护 →
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div class="text-3xl mb-2">🎯</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalTeams || 0 }}</div>
              <div class="text-gray-400 text-sm">推荐阵容</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div class="text-3xl mb-2">⚔️</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalEquipments || 0 }}</div>
              <div class="text-gray-400 text-sm">装备数据</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div class="text-3xl mb-2">🔗</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalSynergies || 0 }}</div>
              <div class="text-gray-400 text-sm">羁绊数据</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div class="text-3xl mb-2">👤</div>
              <div class="text-2xl font-bold text-white">{{ stats.totalHeroes || 0 }}</div>
              <div class="text-gray-400 text-sm">英雄数据</div>
            </div>
          </div>
        </div>

        <!-- 阵容数据管理 -->
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-white">阵容数据管理</h2>
              <p class="text-gray-400 text-sm mt-1">查看、置顶推荐、删除不当阵容</p>
            </div>
            <button @click="loadTeams" class="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl text-sm transition-colors">
              刷新
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full" v-if="teams.length > 0">
              <thead>
                <tr class="text-gray-400 text-sm border-b border-white/10">
                  <th class="text-left py-3 px-4">阵容名称</th>
                  <th class="text-left py-3 px-4">版本</th>
                  <th class="text-left py-3 px-4">类型</th>
                  <th class="text-left py-3 px-4">状态</th>
                  <th class="text-left py-3 px-4">创建时间</th>
                  <th class="text-left py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in teams" :key="team._id" class="text-white border-b border-white/5 hover:bg-white/5">
                  <td class="py-3 px-4">
                    <span class="font-medium">{{ team.data?.name || team.data?.title || '未命名阵容' }}</span>
                  </td>
                  <td class="py-3 px-4 text-gray-400">{{ team.version || '-' }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{{ team.type }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-xs" :class="team.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'">
                      {{ team.isActive ? '推荐中' : '未推荐' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-400 text-sm">{{ formatDate(team.createdAt) }}</td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <button 
                        @click="toggleTeamPin(team)"
                        class="px-3 py-1 rounded-lg text-sm transition-colors"
                        :class="team.isActive 
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'"
                      >
                        {{ team.isActive ? '取消推荐' : '置顶推荐' }}
                      </button>
                      <button 
                        @click="deleteTeam(team)"
                        class="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="teams.length === 0" class="text-center py-8 text-gray-400">
            暂无阵容数据
          </div>
        </div>

        <!-- 系统维护 -->
        <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h2 class="text-xl font-bold text-white mb-4">系统维护</h2>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">🗑️</span>
                <div>
                  <div class="text-white font-medium">清除被拒帖子</div>
                  <div class="text-gray-400 text-sm">永久删除所有被拒绝的帖子</div>
                </div>
              </div>
              <button 
                @click="clearCache('rejected_posts')"
                :disabled="cacheClearing"
                class="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {{ cacheClearing ? '处理中...' : '清除被拒帖子' }}
              </button>
            </div>
            <div class="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">🧹</span>
                <div>
                  <div class="text-white font-medium">清除未激活数据</div>
                  <div class="text-gray-400 text-sm">删除所有已取消推荐的版本数据</div>
                </div>
              </div>
              <button 
                @click="clearCache('inactive_data')"
                :disabled="cacheClearing"
                class="px-6 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {{ cacheClearing ? '处理中...' : '清除未激活数据' }}
              </button>
            </div>
            <div class="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">📊</span>
                <div>
                  <div class="text-white font-medium">系统数据统计</div>
                  <div class="text-gray-400 text-sm">查看当前系统运行状况</div>
                </div>
              </div>
              <div class="text-gray-400 text-sm space-y-1">
                <div class="flex justify-between">
                  <span>总用户数</span>
                  <span class="text-white">{{ stats.totalUsers }}</span>
                </div>
                <div class="flex justify-between">
                  <span>总帖子数</span>
                  <span class="text-white">{{ stats.totalPosts }}</span>
                </div>
                <div class="flex justify-between">
                  <span>待审核</span>
                  <span class="text-white">{{ stats.pendingPosts }}</span>
                </div>
                <div class="flex justify-between">
                  <span>今日活跃</span>
                  <span class="text-white">{{ stats.todayActive || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 反馈管理 -->
      <div v-if="activeTab === 'feedbacks'" class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">反馈管理</h2>
            <p class="text-gray-400 text-sm mt-1">共 {{ feedbackTotal }} 条反馈</p>
          </div>
          <div class="flex gap-3">
            <select v-model="feedbackFilter.status" @change="loadFeedbacks" class="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
              <option value="">全部状态</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
              <option value="closed">已关闭</option>
            </select>
            <select v-model="feedbackFilter.type" @change="loadFeedbacks" class="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
              <option value="">全部类型</option>
              <option value="bug">Bug报告</option>
              <option value="feature">功能建议</option>
              <option value="improvement">改进意见</option>
              <option value="other">其他</option>
            </select>
            <button @click="loadFeedbacks" class="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl text-sm">
              刷新
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="fb in feedbacks" :key="fb._id" 
            class="bg-white/5 rounded-xl p-5 border border-white/10" :class="{'border-red-500/30': fb.status === 'pending'}">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackTypeClass(fb.type)">
                    {{ getFeedbackTypeName(fb.type) }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackStatusClass(fb.status)">
                    {{ getFeedbackStatusName(fb.status) }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="getFeedbackPriorityClass(fb.priority)">
                    {{ getFeedbackPriorityName(fb.priority) }}
                  </span>
                  <span class="text-gray-500 text-xs">{{ formatDate(fb.createdAt) }}</span>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">{{ fb.title }}</h3>
                <p class="text-gray-400 text-sm mb-2">{{ fb.description }}</p>
                <div class="text-gray-500 text-xs mb-3">
                  提交者: {{ fb.author?.username }} ({{ fb.author?.email }})
                </div>
                <div v-if="fb.adminReply" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                  <div class="text-blue-400 text-xs mb-1">管理员回复:</div>
                  <div class="text-gray-300 text-sm">{{ fb.adminReply }}</div>
                </div>
                <!-- 回复表单 -->
                <div class="flex gap-2 mt-3">
                  <input 
                    v-model="replyTexts[fb._id]"
                    placeholder="输入回复内容..."
                    class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500"
                  />
                  <button 
                    @click="replyFeedback(fb._id)"
                    class="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm transition-colors"
                  >
                    回复
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2 ml-4">
                <select 
                  :value="fb.status" 
                  @change="updateFeedbackStatus(fb._id, $event.target.value)"
                  class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs"
                >
                  <option value="pending">待处理</option>
                  <option value="processing">处理中</option>
                  <option value="resolved">已解决</option>
                  <option value="closed">已关闭</option>
                </select>
                <select 
                  :value="fb.priority"
                  @change="updateFeedbackPriority(fb._id, $event.target.value)"
                  class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
                <button 
                  @click="deleteFeedback(fb._id)"
                  class="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="feedbacks.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">💬</div>
          <div class="text-gray-400">暂无反馈</div>
        </div>
      </div>

      <!-- 发布公告对话框 -->
      <el-dialog v-model="showAnnouncementDialog" :title="editingAnn ? '编辑公告' : '发布公告'" width="600px">
        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm mb-1">标题</label>
            <input v-model="annForm.title" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="公告标题" />
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">类型</label>
            <select v-model="annForm.type" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white">
              <option value="normal">普通</option>
              <option value="important">重要</option>
              <option value="urgent">紧急</option>
            </select>
          </div>
          <div class="flex items-center gap-4">
            <input type="checkbox" v-model="annForm.isPinned" id="isPinned" class="w-5 h-5" />
            <label for="isPinned" class="text-white">置顶公告</label>
          </div>
          <div>
            <label class="text-gray-400 text-sm mb-1">内容</label>
            <textarea v-model="annForm.content" rows="6" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="公告内容..."></textarea>
          </div>
        </div>
        <template #footer>
          <button @click="showAnnouncementDialog = false" class="px-6 py-2 bg-white/10 text-white rounded-xl">取消</button>
          <button @click="submitAnnouncement" class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">
            {{ editingAnn ? '保存' : '发布' }}
          </button>
        </template>
      </el-dialog>

      <!-- 拒绝原因对话框 -->
      <el-dialog v-model="showRejectReason" title="拒绝理由" width="450px">
        <div>
          <label class="text-gray-400 text-sm mb-2 block">请输入拒绝原因</label>
          <textarea v-model="rejectReason" rows="3" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="拒绝原因..."></textarea>
        </div>
        <template #footer>
          <button @click="showRejectReason = false" class="px-6 py-2 bg-white/10 text-white rounded-xl">取消</button>
          <button @click="confirmRejectPost" class="px-6 py-2 bg-red-500 text-white rounded-xl">确认拒绝</button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { adminApi, announcementApi, feedbackApi } from '../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('users')
const tabs = [
  { label: '用户管理', value: 'users', icon: '👥' },
  { label: '内容审核', value: 'review', icon: '🔍' },
  { label: '公告管理', value: 'announcements', icon: '📢' },
  { label: '数据维护', value: 'maintenance', icon: '🛠️' },
  { label: '反馈管理', value: 'feedbacks', icon: '💬' }
]

const stats = ref({
  totalUsers: 0,
  totalPosts: 0,
  totalAnnouncements: 0,
  activeUsers: 0,
  todayActive: 0,
  unprocessedFeedbacks: 0
})

const users = ref([])
const announcements = ref([])
const searchQuery = ref('')
const showAnnouncementDialog = ref(false)
const editingAnn = ref(null)

const annForm = ref({
  title: '',
  content: '',
  type: 'normal',
  isPinned: false
})

// 阵容管理
const teams = ref([])

const loadTeams = async () => {
  try {
    const { data } = await adminApi.getAllTeams()
    teams.value = data.data
  } catch (error) {
    console.error('加载阵容失败:', error)
  }
}

const toggleTeamPin = async (team) => {
  try {
    await adminApi.updateTeam(team._id, { isActive: !team.isActive })
    ElMessage.success(team.isActive ? '已取消推荐' : '已置顶推荐')
    loadTeams()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteTeam = async (team) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除阵容 "${team.data?.name || team.data?.title || '未命名'}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    await adminApi.deleteTeam(team._id)
    ElMessage.success('阵容已删除')
    loadTeams()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 缓存清理
const cacheClearing = ref(false)
const clearCache = async (type) => {
  try {
    await ElMessageBox.confirm(
      type === 'rejected_posts' ? '确定要永久删除所有被拒绝的帖子吗？此操作不可恢复！' : '确定要删除所有未激活的版本数据吗？此操作不可恢复！',
      '危险操作',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error' }
    )
    cacheClearing.value = true
    const { data } = await adminApi.clearCache(type)
    ElMessage.success(data.message)
    loadStats()
    loadTeams()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清除失败')
    }
  } finally {
    cacheClearing.value = false
  }
}

// 反馈管理
const feedbacks = ref([])
const feedbackTotal = ref(0)
const replyTexts = ref({})
const feedbackFilter = ref({ status: '', type: '' })

const loadFeedbacks = async () => {
  try {
    const params = {}
    if (feedbackFilter.value.status) params.status = feedbackFilter.value.status
    if (feedbackFilter.value.type) params.type = feedbackFilter.value.type
    const { data } = await feedbackApi.getAll(params)
    feedbacks.value = data.data
    feedbackTotal.value = data.pagination?.total || 0
  } catch (error) {
    console.error('加载反馈失败:', error)
    const msg = error?.response?.data?.message || '加载反馈失败，请确保以管理员身份登录'
    ElMessage.error(msg)
  }
}

const replyFeedback = async (id) => {
  const reply = replyTexts.value[id]
  if (!reply) {
    ElMessage.warning('请输入回复内容')
    return
  }
  try {
    await feedbackApi.reply(id, { adminReply: reply })
    ElMessage.success('已回复')
    replyTexts.value[id] = ''
    loadFeedbacks()
    loadStats()
  } catch (error) {
    ElMessage.error('回复失败')
  }
}

const updateFeedbackStatus = async (id, status) => {
  try {
    await feedbackApi.updateStatus(id, { status })
    ElMessage.success('状态已更新')
    loadFeedbacks()
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const updateFeedbackPriority = async (id, priority) => {
  try {
    await feedbackApi.updateStatus(id, { priority })
    ElMessage.success('优先级已更新')
    loadFeedbacks()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteFeedback = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条反馈吗？', '确认删除', { type: 'warning' })
    await feedbackApi.delete(id)
    ElMessage.success('反馈已删除')
    loadFeedbacks()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const getFeedbackTypeClass = (type) => {
  const map = { bug: 'bg-red-500/20 text-red-400', feature: 'bg-green-500/20 text-green-400', improvement: 'bg-blue-500/20 text-blue-400', other: 'bg-gray-500/20 text-gray-400' }
  return map[type] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackTypeName = (type) => {
  const map = { bug: 'Bug报告', feature: '功能建议', improvement: '改进意见', other: '其他' }
  return map[type] || type
}

const getFeedbackStatusClass = (status) => {
  const map = { pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', resolved: 'bg-green-500/20 text-green-400', closed: 'bg-gray-500/20 text-gray-400' }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackStatusName = (status) => {
  const map = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' }
  return map[status] || status
}

const getFeedbackPriorityClass = (priority) => {
  const map = { high: 'bg-red-500/20 text-red-400', medium: 'bg-yellow-500/20 text-yellow-400', low: 'bg-gray-500/20 text-gray-400' }
  return map[priority] || 'bg-gray-500/20 text-gray-400'
}

const getFeedbackPriorityName = (priority) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[priority] || priority
}

const loadStats = async () => {
  try {
    const { data } = await adminApi.getStats()
    stats.value = data.data
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

const loadUsers = async () => {
  try {
    const { data } = await adminApi.getUsers({ search: searchQuery.value })
    users.value = data.data
  } catch (error) {
    console.error('加载用户失败:', error)
  }
}

const pendingPosts = ref([])
const showRejectReason = ref(false)
const rejectTargetId = ref(null)
const rejectReason = ref('')

const loadPendingPosts = async () => {
  try {
    const { data } = await adminApi.getPendingPosts()
    pendingPosts.value = data.data
  } catch (error) {
    console.error('加载待审核帖子失败:', error)
  }
}

const approvePost = async (id) => {
  try {
    await adminApi.approvePost(id)
    ElMessage.success('帖子已通过审核')
    pendingPosts.value = pendingPosts.value.filter(p => p._id !== id)
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const showRejectDialog = (post) => {
  rejectTargetId.value = post._id
  rejectReason.value = ''
  showRejectReason.value = true
}

const confirmRejectPost = async () => {
  try {
    await adminApi.rejectPost(rejectTargetId.value, rejectReason.value)
    ElMessage.success('帖子已拒绝')
    pendingPosts.value = pendingPosts.value.filter(p => p._id !== rejectTargetId.value)
    showRejectReason.value = false
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const loadAnnouncements = async () => {
  try {
    const { data } = await announcementApi.getAllAnnouncements()
    announcements.value = data.data
  } catch (error) {
    console.error('加载公告失败:', error)
  }
}

const searchUsers = () => {
  loadUsers()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getTypeClass = (type) => {
  switch (type) {
    case 'urgent': return 'bg-red-500/20 text-red-400'
    case 'important': return 'bg-yellow-500/20 text-yellow-400'
    default: return 'bg-blue-500/20 text-blue-400'
  }
}

const getTypeName = (type) => {
  switch (type) {
    case 'urgent': return '紧急'
    case 'important': return '重要'
    default: return '普通'
  }
}

const toggleBan = async (user) => {
  try {
    await ElMessageBox.confirm(
      user.isBanned ? `确定要解封用户 ${user.username} 吗？` : `确定要封禁用户 ${user.username} 吗？`,
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await adminApi.toggleUserBan(user._id)
    ElMessage.success(user.isBanned ? '已解封' : '已封禁')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const setAdmin = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要将 ${user.username} 设为管理员吗？`,
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await adminApi.updateUser(user._id, { role: 'admin' })
    ElMessage.success('已设为管理员')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.username} 吗？此操作不可恢复！`,
      '危险操作',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error' }
    )
    await adminApi.deleteUser(user._id)
    ElMessage.success('用户已删除')
    loadUsers()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const editAnnouncement = (ann) => {
  editingAnn.value = ann
  annForm.value = {
    title: ann.title,
    content: ann.content,
    type: ann.type,
    isPinned: ann.isPinned
  }
  showAnnouncementDialog.value = true
}

const submitAnnouncement = async () => {
  try {
    if (editingAnn.value) {
      await announcementApi.updateAnnouncement(editingAnn.value._id, annForm.value)
      ElMessage.success('公告已更新')
    } else {
      await announcementApi.createAnnouncement(annForm.value)
      ElMessage.success('公告已发布')
    }
    showAnnouncementDialog.value = false
    editingAnn.value = null
    annForm.value = { title: '', content: '', type: 'normal', isPinned: false }
    loadAnnouncements()
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteAnnouncement = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条公告吗？', '确认删除', { type: 'warning' })
    await announcementApi.deleteAnnouncement(id)
    ElMessage.success('公告已删除')
    loadAnnouncements()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadStats()
  loadUsers()
  loadPendingPosts()
  loadAnnouncements()
  loadTeams()
  loadFeedbacks()
})

// 切换到反馈标签页时自动加载
watch(activeTab, (tab) => {
  if (tab === 'feedbacks') loadFeedbacks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
