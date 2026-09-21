// 零依赖请求日志中间件：记录方法、路径、状态码与耗时
// 跳过静态资源与高频健康检查，避免刷屏
const SKIP_PREFIXES = ['/uploads', '/favicon']

export const requestLogger = (req, res, next) => {
  if (SKIP_PREFIXES.some(p => req.path.startsWith(p))) return next()

  const start = process.hrtime.bigint()
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6
    const status = res.statusCode
    // 5xx 打 error，4xx 打 warn，其余 info；生产可据此接日志收集
    const line = `${req.method} ${req.originalUrl} ${status} ${ms.toFixed(1)}ms`
    if (status >= 500) console.error(`[http] ${line}`)
    else if (status >= 400) console.warn(`[http] ${line}`)
    else console.log(`[http] ${line}`)
  })
  next()
}
