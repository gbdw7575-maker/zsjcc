import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postApi } from '../services/api.js'

export const useForumStore = defineStore('forum', () => {
  const posts = ref([])
  const comments = ref({})
  const loading = ref(false)
  const currentPost = ref(null)
  const pagination = ref({ page: 1, limit: 10, total: 0 })

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: '阵容推荐', name: '阵容推荐', icon: '🛡️' },
    { id: '装备攻略', name: '装备攻略', icon: '⚔️' },
    { id: '运营思路', name: '运营思路', icon: '📖' },
    { id: '杂谈', name: '杂谈', icon: '💬' },
    { id: '求助', name: '求助', icon: '❓' }
  ]

  const fetchPosts = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await postApi.getPosts(params)
      posts.value = data.data
      pagination.value = data.pagination
      return data.data
    } catch (error) {
      console.error('获取帖子失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (id) => {
    loading.value = true
    try {
      const { data } = await postApi.getPostById(id)
      currentPost.value = data.data.post
      comments.value[id] = data.data.comments
      return data.data
    } catch (error) {
      console.error('获取帖子详情失败:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData) => {
    try {
      const { data } = await postApi.createPost(postData)
      posts.value.unshift(data.data)
      return data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '发布失败')
    }
  }

  const likePost = async (postId) => {
    try {
      const { data } = await postApi.likePost(postId)
      const post = posts.value.find(p => p._id === postId || p.id === postId)
      if (post) {
        post.likes = data.data
      }
      return data.data
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const favoritePost = async (postId) => {
    try {
      const { data } = await postApi.favoritePost(postId)
      return data.data
    } catch (error) {
      console.error('收藏失败:', error)
    }
  }

  const createComment = async (postId, content, parentComment = null) => {
    try {
      const body = { content }
      if (parentComment) body.parentComment = parentComment
      const { data } = await postApi.createComment(postId, body)
      if (!comments.value[postId]) {
        comments.value[postId] = []
      }
      comments.value[postId].push(data.data)
      return data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '评论失败')
    }
  }

  const likeComment = async (commentId) => {
    try {
      const { data } = await postApi.likeComment(commentId)
      return data.data
    } catch (error) {
      console.error('点赞评论失败:', error)
    }
  }

  const filteredPosts = computed(() => {
    return [...posts.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  const getPostById = (id) => {
    return posts.value.find(post => post._id === id || post.id === id)
  }

  const getCommentsByPostId = (postId) => {
    return comments.value[postId] || []
  }

  return {
    posts,
    comments,
    loading,
    currentPost,
    pagination,
    categories,
    filteredPosts,
    fetchPosts,
    fetchPostById,
    getPostById,
    getCommentsByPostId,
    createPost,
    likePost,
    favoritePost,
    createComment,
    likeComment
  }
})
