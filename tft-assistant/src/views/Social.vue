<template>
  <div class="min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/profile" class="flex items-center text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回个人中心</span>
        </router-link>
      </div>

      <h1 class="text-3xl font-bold text-white mb-6">社交中心</h1>

      <!-- 标签页 -->
      <div class="flex gap-4 mb-6">
        <button 
          @click="activeTab = 'follows'"
          class="px-6 py-3 rounded-xl font-medium transition-colors"
          :class="activeTab === 'follows' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          💬 私信消息
          <span v-if="unreadCount > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadCount }}</span>
        </button>
        <button 
          @click="activeTab = 'following'"
          class="px-6 py-3 rounded-xl font-medium transition-colors"
          :class="activeTab === 'following' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          👥 我的关注
        </button>
        <button 
          @click="activeTab = 'followers'"
          class="px-6 py-3 rounded-xl font-medium transition-colors"
          :class="activeTab === 'followers' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          👥 我的粉丝
        </button>
        <button 
          @click="activeTab = 'blocklist'"
          class="px-6 py-3 rounded-xl font-medium transition-colors"
          :class="activeTab === 'blocklist' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'"
        >
          🚫 黑名单
        </button>
      </div>

      <!-- 私信消息 -->
      <div v-if="activeTab === 'follows'" class="space-y-4">
        <div v-if="conversations.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">💬</div>
          <div class="text-gray-400">暂无私信消息</div>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="conv in conversations" 
            :key="conv.id"
            @click="openConversation(conv)"
            class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer hover:border-purple-500/30 transition-colors"
            :class="{ 'border-red-500/50 bg-red-500/10': conv.unread }"
          >
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {{ conv.user.username.charAt(0).toUpperCase() }}
                </div>
                <div v-if="conv.unread" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-white">{{ conv.user.username }}</span>
                  <span class="text-xs text-gray-400">{{ conv.time }}</span>
                </div>
                <div class="text-sm truncate" :class="conv.unread ? 'text-white font-medium' : 'text-gray-400'">
                  {{ conv.lastMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 搜索用户发送私信 -->
        <div class="mt-6 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 class="text-lg font-bold text-white mb-4">📨 发送私信</h3>
          <div class="space-y-4">
            <input 
              v-model="searchUsername"
              @input="searchUserForMessage"
              type="text"
              class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              placeholder="输入用户名搜索..."
            />
            <div v-if="searchResult" class="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {{ searchResult.username.charAt(0).toUpperCase() }}
              </div>
              <span class="flex-1 text-white">{{ searchResult.username }}</span>
              <button @click="startChat(searchResult)" class="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">
                发消息
              </button>
            </div>
            <textarea 
              v-model="newMessage"
              rows="3"
              class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
              placeholder="输入私信内容..."
            ></textarea>
            <button 
              v-if="chatTarget"
              @click="sendMessage"
              class="w-full px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-colors"
            >
              发送私信
            </button>
          </div>
        </div>
      </div>

      <!-- 我的关注 -->
      <div v-if="activeTab === 'following'" class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400">共 {{ following.length }} 个关注</span>
          <button @click="showSearchDialog = true" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">
            + 添加关注
          </button>
        </div>
        
        <div v-if="following.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">👥</div>
          <div class="text-gray-400">还没有关注任何人</div>
          <button @click="showSearchDialog = true" class="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">
            搜索用户
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="user in following"
            :key="user.id"
            class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer hover:border-purple-500/30 transition-colors"
            @click="showUserDetail(user)"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">  
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-white">{{ user.username }}</span> 
                  <span v-if="user.type === 'creator'" class="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">创作者</span>
                </div>
                <div class="text-sm text-gray-400">{{ user.bio || '暂无简介' }}</div>
                <div class="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>🎮 {{ user.games || 0 }}场</span>
                  <span>🏆 {{ user.wins || 0 }}胜</span>
                  <span>👥 {{ user.followers || 0 }}粉丝</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click.stop="startChat(user)"
                  class="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
                >
                  💬 私信
                </button>
                <button
                  @click.stop="unfollow(user.id)"
                  class="px-3 py-1.5 border border-white/20 text-gray-400 hover:border-red-500/50 hover:text-red-400 rounded-lg text-sm transition-colors"        
                >
                  取消关注
                </button>
                <button
                  @click.stop="block(user.id)"
                  class="px-3 py-1.5 border border-white/20 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 rounded-lg text-sm transition-colors"
                >
                  🚫 拉黑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的粉丝 -->
      <div v-if="activeTab === 'followers'" class="space-y-4">
        <div class="mb-4">
          <span class="text-gray-400">共 {{ followers.length }} 个粉丝</span>
        </div>
        
        <div v-if="followers.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">👥</div>
          <div class="text-gray-400">还没有粉丝关注你</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="user in followers" 
            :key="user.id"
            class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-white">{{ user.username }}</span>
                  <span v-if="user.type === 'creator'" class="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">创作者</span>
                </div>
                <div class="text-sm text-gray-400">{{ user.bio || '暂无简介' }}</div>
                <div class="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>🎮 {{ user.games || 0 }}场</span>
                  <span>🏆 {{ user.wins || 0 }}胜</span>
                </div>
              </div>
              <button 
                v-if="!isFollowing(user.id)"
                @click="follow(user)"
                class="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm"
              >
                回关
              </button>
              <span v-else class="text-green-400 text-sm">已互关</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 黑名单 -->
      <div v-if="activeTab === 'blocklist'" class="space-y-4">
        <div class="mb-4">
          <span class="text-gray-400">共 {{ blocklist.length }} 个黑名单用户</span>
        </div>
        
        <div v-if="blocklist.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🚫</div>
          <div class="text-gray-400">暂无黑名单用户</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="user in blocklist" 
            :key="user.id"
            class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-white">{{ user.username }}</span>
                </div>
                <div class="text-sm text-gray-400">{{ user.bio || '暂无简介' }}</div>
              </div>
              <button 
                @click="unblock(user.id)"
                class="px-3 py-1.5 border border-white/20 text-gray-400 hover:border-green-500/50 hover:text-green-400 rounded-lg text-sm transition-colors"
              >
                解除拉黑
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户详情对话框 -->
      <el-dialog v-model="showUserDetailDialog" :title="selectedUser?.username" width="450px">
        <div class="text-center">
          <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl mb-4">
            {{ selectedUser?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="font-bold text-white text-xl">{{ selectedUser?.username }}</span>
            <span v-if="selectedUser?.type === 'creator'" class="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">创作者</span>
          </div>
          <div class="text-gray-400 mb-6">{{ selectedUser?.bio || '暂无简介' }}</div>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white/5 rounded-xl p-4">
              <div class="text-2xl font-bold text-white">{{ selectedUser?.games || 0 }}</div>
              <div class="text-xs text-gray-500">对局数</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <div class="text-2xl font-bold text-green-400">{{ selectedUser?.wins || 0 }}</div>
              <div class="text-xs text-gray-500">胜利数</div>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <div class="text-2xl font-bold text-purple-400">{{ selectedUser?.followers || 0 }}</div>
              <div class="text-xs text-gray-500">粉丝数</div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button
              @click="startChatFromDetail"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-colors"
            >
              💬 发送私信
            </button>
            <button
              @click="unfollow(selectedUser?.id); showUserDetailDialog = false"
              class="px-4 py-2.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              取消关注
            </button>
            <button
              @click="block(selectedUser?.id); showUserDetailDialog = false"
              class="px-4 py-2.5 border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors"
            >
              🚫 拉黑
            </button>
          </div>
        </div>
      </el-dialog>

      <!-- 聊天对话框 -->
      <el-dialog v-model="showChatDialog" :title="chatTargetUser?.username" width="500px">
        <div class="h-80 overflow-y-auto space-y-3 mb-4 p-2">
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="index"
            class="flex"
            :class="msg.from === 'me' ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="max-w-xs px-4 py-2 rounded-2xl"
              :class="msg.from === 'me' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm' 
                : 'bg-white/10 text-white rounded-bl-sm'"
            >
              {{ msg.content }}
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <input 
            v-model="chatInput"
            @keyup.enter="sendChatMessage"
            class="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            placeholder="输入消息..."
          />
          <button 
            @click="sendChatMessage"
            class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-colors"
          >
            发送
          </button>
        </div>
      </el-dialog>

      <!-- 搜索用户对话框 -->
      <el-dialog v-model="showSearchDialog" title="搜索用户" width="400px">
        <div class="space-y-4">
          <input 
            v-model="searchQuery"
            @input="searchUsers"
            type="text"
            class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            placeholder="输入用户名搜索..."
          />
          <div v-if="searchResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
            <div 
              v-for="user in searchResults" 
              :key="user.id"
              @click="handleUserSelect(user)"
              class="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10"
            >
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-white">{{ user.username }}</span>
                  <span v-if="user.type === 'creator'" class="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">创作者</span>
                </div>
                <div class="text-xs text-gray-400">{{ user.type === 'creator' ? '内容创作者' : '普通玩家' }} · {{ user.followers }}粉丝</div>
              </div>
              <button 
                v-if="!isFollowing(user.id)"
                @click.stop="follow(user)"
                class="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm"
              >
                关注
              </button>
              <span v-else class="text-green-400 text-sm">已关注</span>
            </div>
          </div>
          <div v-else-if="searchQuery.length > 0" class="text-center text-gray-400 py-4">
            未找到匹配的用户
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { socialApi, messageApi } from '../services/api'
import { socketService } from '../services/socket'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const activeTab = ref('follows')
const showChatDialog = ref(false)
const showSearchDialog = ref(false)
const showUserDetailDialog = ref(false)
const chatTargetUser = ref(null)
const selectedUser = ref(null)
const chatInput = ref('')
const chatMessages = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const searchUsername = ref('')
const searchResult = ref(null)
const newMessage = ref('')
const chatTarget = ref(null)
const loading = ref(false)
const socketConnected = ref(false)

// 数据
const conversations = ref([])
const following = ref([])
const followers = ref([])
const blocklist = ref([])

// 加载会话列表
const loadConversations = async () => {
  try {
    const { data } = await messageApi.getConversations()
    conversations.value = data.data.map(conv => ({
      id: conv.userId,
      user: conv.user,
      lastMessage: conv.lastMessage?.content || '',
      time: formatTime(conv.lastMessage?.createdAt),
      unread: conv.unreadCount > 0
    }))
  } catch (error) {
    console.error('加载会话失败:', error)
  }
}

// 加载关注列表
const loadFollowing = async () => {
  try {
    const userId = userStore.userInfo?._id || userStore.userInfo?.id
    const { data } = await socialApi.getFollowing(userId)
    following.value = data.data.map(u => ({
      id: u._id,
      username: u.username,
      type: u.role === 'admin' ? 'creator' : 'player',
      bio: u.bio || '',
      games: 0,
      wins: 0,
      followers: 0
    }))
  } catch (error) {
    console.error('加载关注列表失败:', error)
  }
}

// 加载粉丝列表
const loadFollowers = async () => {
  try {
    const userId = userStore.userInfo?._id || userStore.userInfo?.id
    const { data } = await socialApi.getFollowers(userId)
    followers.value = data.data.map(u => ({
      id: u._id,
      username: u.username,
      type: u.role === 'admin' ? 'creator' : 'player',
      bio: u.bio || '',
      games: 0,
      wins: 0
    }))
  } catch (error) {
    console.error('加载粉丝列表失败:', error)
  }
}

// 格式化时间
const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return d.toLocaleDateString()
}

// 搜索用户
const searchUsers = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  try {
    const { data } = await socialApi.searchUsers(searchQuery.value)
    searchResults.value = data.data.map(u => ({
      id: u._id,
      username: u.username,
      type: 'player',
      bio: u.bio || '',
      followers: 0
    }))
  } catch (error) {
    console.error('搜索用户失败:', error)
  }
}

// 搜索私信目标用户
const searchUserForMessage = async () => {
  if (!searchUsername.value.trim()) {
    searchResult.value = null
    return
  }
  try {
    const { data } = await socialApi.searchUsers(searchUsername.value)
    if (data.data.length > 0) {
      searchResult.value = {
        id: data.data[0]._id,
        username: data.data[0].username,
        type: 'player'
      }
    } else {
      searchResult.value = null
      ElMessage.warning('未找到该用户')
    }
  } catch (error) {
    ElMessage.warning('搜索失败')
  }
}

const unreadCount = computed(() => conversations.value.filter(c => c.unread).length)

const isFollowing = (userId) => following.value.some(u => u.id === userId)

// 打开会话
const openConversation = async (conv) => {
  chatTargetUser.value = conv.user
  try {
    const { data } = await messageApi.getMessages(conv.id)
    chatMessages.value = data.data.map(msg => ({
      from: msg.sender._id === (userStore.userInfo?._id || userStore.userInfo?.id) ? 'me' : 'other',
      content: msg.content,
      time: msg.createdAt
    }))
    conv.unread = false
    showChatDialog.value = true
  } catch (error) {
    console.error('加载消息失败:', error)
    chatMessages.value = []
    showChatDialog.value = true
  }
}

// 发送聊天消息（实时）
const sendChatMessage = async () => {
  if (!chatInput.value.trim() || !chatTargetUser.value) return
  
  const content = chatInput.value
  
  // 通过Socket.IO实时发送
  if (socketConnected.value) {
    socketService.sendMessage(chatTargetUser.value.id, content)
  }
  
  // 同时通过API保存
  try {
    await messageApi.sendMessage(chatTargetUser.value.id, content)
  } catch (error) {
    console.error('保存消息失败:', error)
  }
  
  // 添加到本地消息列表
  chatMessages.value.push({ from: 'me', content: content, time: Date.now() })
  chatInput.value = ''
}

// 发送私信（非实时）
const sendMessage = async () => {
  if (!newMessage.value.trim() || !chatTarget.value) {
    ElMessage.warning('请输入私信内容并选择目标用户')
    return
  }
  
  try {
    await messageApi.sendMessage(chatTarget.value.id, newMessage.value)
    ElMessage.success('私信已发送')
    
    // 刷新会话列表
    await loadConversations()
    
    newMessage.value = ''
    chatTarget.value = null
    searchResult.value = null
    searchUsername.value = ''
  } catch (error) {
    ElMessage.error('发送失败')
  }
}

// 开始聊天
const startChat = async (user) => {
  chatTargetUser.value = user
  try {
    const { data } = await messageApi.getMessages(user.id)
    chatMessages.value = data.data.map(msg => ({
      from: msg.sender._id === (userStore.userInfo?._id || userStore.userInfo?.id) ? 'me' : 'other',
      content: msg.content,
      time: msg.createdAt
    }))
  } catch (error) {
    chatMessages.value = []
  }
  showChatDialog.value = true
}

const handleUserSelect = async (user) => {
  showSearchDialog.value = false
  searchQuery.value = ''
  searchResults.value = []
  await follow(user)
}

// 关注用户
const follow = async (user) => {
  if (isFollowing(user.id)) {
    ElMessage.info('已关注')
    return
  }
  
  try {
    await socialApi.followUser(user.id)
    await loadFollowing()
    ElMessage.success(`已关注 ${user.username}`)
  } catch (error) {
    ElMessage.error('关注失败')
  }
}

// 取消关注
const unfollow = async (userId) => {
  try {
    await socialApi.followUser(userId) // toggle
    await loadFollowing()
    const user = following.value.find(u => u.id === userId)
    ElMessage.info(`已取消关注 ${user?.username || ''}`)
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 加载黑名单
const loadBlocklist = async () => {
  try {
    const { data } = await socialApi.getBlocklist()
    blocklist.value = data.data.map(u => ({
      id: u._id,
      username: u.username,
      bio: u.bio || ''
    }))
  } catch (error) {
    console.error('加载黑名单失败:', error)
  }
}

// 拉黑用户
const block = async (userId) => {
  try {
    await socialApi.blockUser(userId)
    ElMessage.success('已拉黑该用户')
    await loadFollowing()
    await loadBlocklist()
  } catch (error) {
    const msg = error.response?.data?.message || '拉黑失败'
    ElMessage.error(msg)
  }
}

// 取消拉黑
const unblock = async (userId) => {
  try {
    await socialApi.unblockUser(userId)
    ElMessage.success('已解除拉黑')
    await loadBlocklist()
  } catch (error) {
    const msg = error.response?.data?.message || '操作失败'
    ElMessage.error(msg)
  }
}

const showUserDetail = (user) => {
  selectedUser.value = user
  showUserDetailDialog.value = true
}

const startChatFromDetail = async () => {
  showUserDetailDialog.value = false
  await startChat(selectedUser.value)
}

// Socket.IO消息回调
const onSocketMessage = (message) => {
  // 如果当前正在和该用户聊天，添加消息
  if (chatTargetUser.value && chatTargetUser.value.id === message.sender._id) {
    chatMessages.value.push({
      from: 'other',
      content: message.content,
      time: message.createdAt
    })
  }
  // 刷新会话列表
  loadConversations()
  ElMessage.info(`收到来自 ${message.sender.username} 的消息`)
}

// Socket连接状态回调
const onSocketConnection = (connected) => {
  socketConnected.value = connected
}

onMounted(async () => {
  // 加载所有数据
  await Promise.all([
    loadConversations(),
    loadFollowing(),
    loadFollowers(),
    loadBlocklist()
  ])
  
  // 连接Socket.IO
  const token = userStore.token
  if (token) {
    socketService.connect(token)
    socketService.onMessage(onSocketMessage)
    socketService.onConnection(onSocketConnection)
  }
})

onUnmounted(() => {
  socketService.offMessage()
  socketService.offConnection()
  socketService.disconnect()
})
</script>
