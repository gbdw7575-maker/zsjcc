// Socket.IO 实例单例：解决 REST 控制器无法直接访问 io 的问题
// server.js 启动时 setIo，业务层通过 getIo 投递实时事件
let ioInstance = null

export const setIo = (io) => {
  ioInstance = io
}

export const getIo = () => ioInstance
