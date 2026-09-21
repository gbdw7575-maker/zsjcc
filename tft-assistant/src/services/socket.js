import { io } from 'socket.io-client'
import { ref } from 'vue'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = ref(false)
    this.messages = ref([])
    this.onMessageCallback = null
    this.onConnectionCallback = null
  }

  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      this.connected.value = true
      // socket connected
      if (this.onConnectionCallback) {
        this.onConnectionCallback(true)
      }
    })

    this.socket.on('disconnect', () => {
      this.connected.value = false
      // socket disconnected
      if (this.onConnectionCallback) {
        this.onConnectionCallback(false)
      }
    })

    this.socket.on('new_message', (message) => {
      this.messages.value.push(message)
      if (this.onMessageCallback) {
        this.onMessageCallback(message)
      }
    })

    this.socket.on('message_sent', (message) => {
      // 消息发送成功确认
      // message sent
    })

    this.socket.on('error', (error) => {
      console.error('Socket错误:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected.value = false
    }
  }

  sendMessage(receiverId, content) {
    if (!this.socket || !this.connected.value) {
      throw new Error('Socket未连接')
    }
    this.socket.emit('send_message', { receiverId, content })
  }

  onMessage(callback) {
    this.onMessageCallback = callback
  }

  onConnection(callback) {
    this.onConnectionCallback = callback
  }

  offMessage() {
    this.onMessageCallback = null
  }

  offConnection() {
    this.onConnectionCallback = null
  }
}

export const socketService = new SocketService()
export default socketService