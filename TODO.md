# 掌上金铲铲 — 待办事项

> 更新时间：2026-09-21
> 最新提交：`e523650` fix(ux): 补上路由loading bar样式块

---

## 一、Git 推送（唯一剩余事项，等代理）

**现状**：本地积压 **16 个提交**未推送。7890 代理端口无监听（Clash/v2ray 未运行），
GitHub 直连 TCP 超时，已确认非 git 配置问题（git config/env 均无代理设置）。

**需做的事**：
1. 启动代理软件（Clash/v2ray 等，确认 7890 监听）
2. 执行推送：`git push origin main`
3. 验证远端 SHA == 本地 HEAD：`git ls-remote origin refs/heads/main`

---

## 二、本轮已完成（2026-09-21）

### 页面 HUD 化 —— 全站 17 页收官
- [x] Equipment / PoolTracker 收尾（`43f7f8f`）：补全紫粉替换、console.log 清除、6 处 lazy-load
- [x] P0 七页（`338ac3c`）：Profile / Social / TeamDetail / Dashboard / Augments / Synergies / Teamfight
- [x] P1 五页（`c5d95c3`）：AdminPanel / ScreenShare / CreatePost / Economy / AdminGameData
- [x] P2 三页（`55cf4d1`）：PostDetail / MyRecord / Feedback

**实现方式**：`tft-assistant/scripts/hud_codemod.py` 有序规则 codemod（可复用于后续设计迁移）。
毛玻璃卡片 → `hud-card` 组件类；紫粉按钮/文字/边框 → accent 设计 token；
页面级紫黑渐变背景移除，回归全局氛围背景。

### 游戏语义色修复（准确性）
E7 全局色阶重映射把游戏内语义紫也覆盖了，本轮用显式色值恢复：
- 费用档位 4 费紫（PoolTracker / Dashboard / TeamDetail / Synergies / Teamfight）
- Teamfight 3 费徽标紫 `#a855f7`
- 阵容梯度 T0.5 紫粉徽标（Dashboard / TeamDetail）
- Dashboard 名次条第 5 名紫

### 功能优化
- [x] F11 全局 loading：App.vue 路由级顶部进度条（`aaf92bc` + 补样式 `e523650`）
- [x] F12 图片 lazy-load：Equipment 6 处 + CreatePost 2 处（PostDetail 此前已完成）
- [x] F9 console.log 清理：Equipment 残留 1 处已清，全 src 仅剩注释中的示例

### 验收
- [x] `vite build` 生产构建通过（多次）
- [x] 构建产物 CSS 抽查：任意值类（accent/rgba/语义紫）全部正确生成
- [x] 无头浏览器实拍 11 页渲染正常（假登录态注入验收，未留残留文件）

---

## 三、后续可选优化（非阻塞）

- [ ] 主包 `index.js` 1.1MB：可做 manualChunks 拆分（vue/element-plus 单独分包）
- [ ] Teamfight 页 <1536px 时筛选面板折到棋盘下方，可考虑抽屉式交互
- [ ] 后端/数据库联调测试（本轮仅做了前端静态验收）

---

## 四、历史完成清单（参考）

- [x] E1 设计地基（Chakra Petch + Noto Sans SC 字体 / style.css 设计 token / 默认主题配色）
- [x] E2 导航 HUD 化（切角 logo / 活跃链接发光线 / icon-btn / 页面过渡）
- [x] E3 首页重做（Hero / 功能卡 / 公告阵容卡 / 实时统计）
- [x] E4 登录页 HUD 重做（切角卡 / 准星 / 扫描背景 / SVG 图标）
- [x] E5 注册页 HUD 重做（与登录页统一 / 角色选择卡）
- [x] E6 论坛页全站 HUD 化（帖子/教学/阵容/赛事 4 个 Tab）
- [x] E7 Tailwind 紫粉 5 套色阶全局重映射（17 页 330 处）
- [x] E8 移动端汉堡菜单（<1024px 下拉导航）
- [x] 品牌清理（"英雄联盟"→"金铲铲" / "lolchess.gg"→"云顶之弈数据站"）
- [x] 硬编码紫粉色清除（theme.js 3 套主题 / seedGameData.js 6 处羁绊色）
- [x] SEO meta 标签（description / keywords / OG / theme-color）
- [x] console.log 清理（20+1 处）
- [x] 图片 lazy-load（PostDetail / Equipment / CreatePost）
- [x] 路由懒加载（21 条路由全部 `() => import()`）
- [x] 大数据文件动态 import 分包
- [x] JWT .env 管理
- [x] 401 拦截器（token 过期自动跳登录）
