// 404 兜底：所有未匹配的路由统一返回 JSON，与全局错误格式一致
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `接口不存在: ${req.method} ${req.originalUrl}`
  })
}
