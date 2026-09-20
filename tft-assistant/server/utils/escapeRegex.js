// 转义用户输入中的正则元字符，防止 $regex 用户输入注入
// 参考 MDN 推荐写法：https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
export const escapeRegex = (str = '') =>
  String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default escapeRegex
