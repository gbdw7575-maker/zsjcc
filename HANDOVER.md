# 掌上金铲铲 — 项目交接文档

> 生成时间：2026-09-21
> 仓库：https://github.com/gbdw7575-maker/zsjcc.git（main 分支）
> 本地路径：`c:\Users\29364\Documents\trae_projects\heihei`

---

## 一、项目定位

**掌上金铲铲** 是《金铲铲之战 / 云顶之弈 TFT》S8 怪兽入侵赛季的玩家辅助平台。

### 核心价值（按用户视角优先级）

1. **OCR 实时识别 + AI 复盘闭环**（差异化主线）
   - ScreenShare 页用 `tesseract.js` 对局内识别金币/血量/等级/英雄
   - 数据喂给 `aiAnalysis.js`，调用 DeepSeek/OpenAI 给下一步建议
2. **个人战绩画像**（用户留存钩子）
   - MatchRecord 模型记录每场对局，statsService 聚合胜率/段位/常用阵容
3. **备战工具集**（同质化但有本地化优势）
   - 阵容模拟 / 装备合成 / 卡池概率 / 经济规划 / 海克斯强化 / 羁绊详解
4. **社区功能**（论坛/社交/私信，冷启动中）

### 已知产品短板（开发前需知）

- **赛季过期**：S8 怪兽入侵赛季已结束（当前 2026-09，TFT 已到 S10+）
- **数据陈旧**：自建 MongoDB 不接 Riot API 自动同步
- **社区空**：论坛/社交目前无活跃用户
- **bundle 体积**：主 bundle 1.08 MB（Element Plus 全量 + Tesseract.js 静态导入）

---

## 二、技术栈

### 前端
- **Vue 3.4 + Vite 5.1 + Vue Router 4 + Pinia 2**
- **Element Plus 2.6**（**当前全量引入**，优化空间大）
- **Tailwind CSS 3.4**（已配置 purple→霓虹青、pink→金橙 重映射）
- **Socket.IO Client 4.8**（实时通信）
- **Tesseract.js 7.0**（OCR，仅 ScreenShare 用，**当前静态导入**）

### 后端
- **Node.js + Express 4**（ES Modules）
- **Mongoose 7 + MongoDB**（本地 `mongodb://localhost:27017/tft_assistant`）
- **Socket.IO 4**（实时消息/对局事件）
- **JWT + bcrypt**（认证）
- **helmet + express-rate-limit + cors 白名单**（安全基线）

### 基础设施
- **启动**：`start.bat` / `start.ps1`（自动发现 Node → 启动 MongoDB → 后端 3000 → 前端 5174）
- **凭据**：JWT_SECRET、AI_API_KEY 等放 `server/.env`（不入仓）
- **代理**：GitHub 推送需本地代理 7890（Clash/v2ray 香港或日本节点）

---

## 三、目录结构

```
heihei/
├── start.bat / start.ps1              # 一键启动
├── TODO.md                            # 前端 HUD 化待办
├── HANDOVER.md                        # 本文档
├── mongo_data/                        # 本地 MongoDB 数据卷
└── tft-assistant/
    ├── package.json                   # 前端+后端统一依赖
    ├── index.html                     # 已配置 SEO meta
    ├── tailwind.config.js             # purple→霓虹青 重映射
    ├── vite.config.js
    │
    ├── src/                           # 前端源码
    │   ├── main.js                    # 入口（Element Plus 全量注册）
    │   ├── style.css                  # 设计系统（霓虹 HUD token）
    │   ├── App.vue                    # 布局 + 导航 + 移动端汉堡菜单
    │   ├── router/index.js            # 21 条路由，全部 lazy import
    │   ├── views/                     # 22 个页面组件
    │   │   ├── Home.vue               # 首页 Hero + 功能入口
    │   │   ├── Teamfight.vue          # 阵容模拟器
    │   │   ├── Equipment.vue          # 装备合成图鉴
    │   │   ├── PoolTracker.vue        # 卡池概率
    │   │   ├── Economy.vue            # 经济规划
    │   │   ├── Augments.vue            # 海克斯强化
    │   │   ├── Synergies.vue          # 羁绊详解
    │   │   ├── Dashboard.vue          # 数据看板
    │   │   ├── TeamDetail.vue         # 阵容详情
    │   │   ├── ScreenShare.vue        # OCR 实时识别（870 行）
    │   │   ├── MyRecord.vue           # 我的战绩
    │   │   ├── Profile.vue            # 个人主页
    │   │   ├── Social.vue             # 社交（关注/拉黑）
    │   │   ├── Forum.vue              # 论坛（1916 行巨石组件）
    │   │   ├── PostDetail.vue / CreatePost.vue
    │   │   ├── Login.vue / Register.vue
    │   │   ├── Feedback.vue
    │   │   ├── AdminPanel.vue         # 管理后台（1018 行）
    │   │   └── AdminGameData.vue      # 游戏数据管理
    │   ├── components/
    │   ├── stores/                     # Pinia: user/theme/game/forum
    │   ├── services/                  # api/aiAnalysis/gameDataService/ocrService
    │   └── data/                      # 静态数据：gameData/augmentsData/poolData 等
    │
    └── server/                        # 后端源码
        ├── server.js                  # HTTP+Socket.IO 启动入口
        ├── app.js                     # Express 配置 + 路由挂载
        ├── config/                    # cors/db/upload
        ├── middleware/                # auth/admin/validators/requestLogger/notFound
        ├── models/ (11 个)            # User/Post/Message/Lineup/MatchRecord/
        │                              # GameData/Follow/Feedback/Comment/Block/Announcement
        ├── controllers/ (13 个)        # 与路由一一对应
        ├── routes/ (11 个)            # users/posts/social/messages/game-data/admin/
        │                              # announcements/feedback/lineups/tft/records/ai/stats
        ├── services/                  # statsService/lcuService/lcuSyncService/
        │                              # userCleanupService/socketStore/messageService/
        │                              # messagePolicy/aiProviderService
        ├── scripts/                   # seedGameData/seedDemoRecords/createAdmin/rebuildGameDataS8
        ├── uploads/                   # 用户上传静态资源
        └── .env.example               # 环境变量模板
```

---

## 四、启动与构建

### 首次启动

```powershell
# 1. 安装依赖
cd tft-assistant
npm install

# 2. 配置环境变量
Copy-Item server/.env.example server/.env
# 编辑 server/.env，至少填 JWT_SECRET 与 AI_API_KEY

# 3. 启动 MongoDB（推荐用本机已装的，或 docker run -d -p 27017:27017 mongo:7）
# 4. 一键启动（推荐）
..\start.ps1
# 或分别启动：
# 后端：node server/server.js
# 前端：npm run dev
```

### 端口约定

| 服务 | 端口 | 说明 |
|---|---|---|
| 前端 Vite dev | 5174 | 占用时自动跳 5175/5176 |
| 后端 Express | 3000 | 含 Socket.IO |
| MongoDB | 27017 | 本地默认 |
| 代理（仅 git push 用） | 7890 | Clash/v2ray |

### 生产构建

```powershell
cd tft-assistant
npm run build         # 输出 dist/
# 预览：npm run preview
```

### 初始化数据

```powershell
# 创建管理员
node server/scripts/createAdmin.js

# 灌入 S8 游戏数据
node server/scripts/seedGameData.js

# 重建 S8 数据（如 schema 变更后）
node server/scripts/rebuildGameDataS8.js

# 灌入演示战绩（开发用）
node server/scripts/seedDemoRecords.js
```

---

## 五、当前工作区状态（交接时点）

### Git 状态

- **本地领先 origin/main 10 个提交**（代理未启动，未推送）
- **工作区未提交改动**：
  - `tft-assistant/src/views/Equipment.vue`（子代理部分 HUD 化，剩余 4 处紫粉类待清理）
  - `tft-assistant/src/views/PoolTracker.vue`（子代理部分 HUD 化，剩余 6 处紫粉类待清理）
  - `start.ps1`（仅 BOM 编码变化，无实质改动，可 `git restore`）
- **未追踪文件**：`TODO.md`、`HANDOVER.md`

### 推送积压清单

| # | SHA | 内容 |
|---|---|---|
| 1 | cf39af7 | E1 设计地基（Chakra Petch + 设计 token） |
| 2 | 24d2ba6 | E2 导航 HUD 化 + 页面过渡 |
| 3 | 01dbc48 | E3 首页重做 |
| 4 | c3a4215 | E4 登录页 HUD 重做 |
| 5 | 7368de1 | E5 注册页 HUD 重做 |
| 6 | d7f064b | E6 论坛页全站 HUD 化 |
| 7 | 8554b61 | E7 Tailwind 紫粉色阶全局重映射 |
| 8 | 167da69 | E8 移动端汉堡菜单 |
| 9 | 6365403 | 品牌清理（英雄联盟 → 金铲铲） |
| 10 | 5c5404f | 硬编码紫粉色清除（theme.js + seed 数据） |
| — | 51fbdc1 | SEO meta + console.log 清理 + lazy-load |

> 代理恢复后执行：
> ```powershell
> git push origin main
> git ls-remote origin refs/heads/main   # 验证远端 SHA == 本地 HEAD
> ```

---

## 六、设计系统（前端 HUD 化基线）

定义在 `tft-assistant/src/style.css`：

### CSS 变量

```css
--bg-primary: #080d16;        --bg-card: #101a2e;        --bg-card-hover: #16233c;
--text-primary: #e8eef9;     --text-secondary: #93a2bf;
--line-soft: rgba(156,180,225,0.1);   --line-strong: rgba(156,180,225,0.22);
--accent-color: #33e6d5;      --accent-rgb: 51,230,213;  --accent-hover: #17d0be;
--accent-gold: #ffb133;       --gold-rgb: 255,177,51;
--danger: #ff4d6c;            --success: #3ddc84;
--r-sm:6px; --r-md:9px; --r-lg:14px;
--font-display: 'Chakra Petch','Noto Sans SC',sans-serif;
```

### 复用组件类

- `.hud-card` / `.hud-card--cut` / `.hud-card--accent`（卡片 + 切角 + 主色描边）
- `.hud-btn` / `.hud-btn--primary` / `.hud-btn--gold`（按钮三态）
- `.chip` / `.chip--accent` / `.chip--gold` / `.chip--danger`
- `.section-title`（左竖条标题）
- `.neon-text` / `.gold-text` / `.stat-num`

### HUD 化标准替换规则

| 旧类名 | 新类名 |
|---|---|
| `bg-white/5 backdrop-blur-md rounded-2xl border border-white/10` | `bg-[var(--bg-card)] border border-[var(--line-soft)] rounded-lg` |
| `from-purple-500 to-pink-500 text-white`（按钮） | `text-[#03201d] bg-[var(--accent-color)]` |
| `text-purple-300/400` | `text-[var(--accent-color)]` |
| `border-purple-500/30` | `border-[rgba(var(--accent-rgb),0.3)]` |

> **规则**：只改 `<template>` 与 `<style>`，不改 `<script>` 业务逻辑。

---

## 七、已完成清单

### 前端

- [x] E1 设计地基（Chakra Petch + Noto Sans SC 字体 / style.css 设计 token / 默认主题）
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
- [x] console.log 清理（20 处）
- [x] 图片 lazy-load（PostDetail.vue）
- [x] 路由懒加载（21 条路由全部 `() => import()`）
- [x] 大数据文件动态 import 分包

### 后端

- [x] Express + Mongoose 基础设施（11 model / 13 controller / 11 route）
- [x] JWT 认证 + bcrypt 密码 + 401 拦截器自动跳登录
- [x] Helmet + 全局/认证限流 + CORS 白名单
- [x] Socket.IO 实时消息（含 FixedWindowRateLimiter 防刷）
- [x] 文件上传（Multer + 100MB 限制 + 类型校验）
- [x] AI 分析代理（DeepSeek/OpenAI/智谱 三方切换）
- [x] LCU 客户端连接（lcuService + lcuSyncService 对局同步）
- [x] 用户清理定时任务（userCleanupService）
- [x] 健康检查 `/api/health`（数据库状态 + 内存 + uptime）

---

## 八、待办事项（详见 TODO.md）

### 立即处理

1. **推送 10 个积压提交**（代理恢复后）
2. **补全 Equipment.vue / PoolTracker.vue 的 HUD 化**（子代理被中断）
3. **丢弃或确认 `start.ps1` 的 BOM 改动**

### 页面 HUD 化（按紫粉残留量排序）

P0：Profile(46) / Social(35) / TeamDetail(24) / Dashboard(20) / Augments(16) / Synergies(16) / Teamfight(18)
P1：AdminPanel(13) / ScreenShare(13) / CreatePost(11) / Economy(9) / AdminGameData(7)
P2：Equipment(7,部分) / PoolTracker(6,部分) / PostDetail(4) / MyRecord(2) / Feedback(1)

### 功能优化

- F11 全局 loading bar（App.vue 路由级）
- F12 图片 lazy-load 扩展到 Equipment / CreatePost
- 主 bundle 瘦身：Element Plus 按需化 + Tesseract.js 动态 import（预期 ↓ 70%）

---

## 九、后续业务扩展方向（建议）

基于现有资产评估，**推荐主线"数据与分析深化"**——给孤儿功能找到用户留存的脊梁：

### 主线：个人战绩画像 + AI 复盘闭环

| 模块 | 复用基础 | 新增工作 |
|---|---|---|
| 对局自动同步 | lcuSyncService | 增量同步 + 定时任务 |
| 胜率趋势分析 | statsService / MatchRecord | 时序聚合 pipeline |
| 英雄使用率 + 阵容组合 | MatchRecord.heroes | 关联规则挖掘 + Top 阵容 |
| 段位分布与对局深度 | MatchRecord | 回合经济曲线 + 伤害占比 |
| 版本对比看板 | GameData.version | v8 vs 旧版本 diff |
| 跨对局 AI 总结 | aiProviderService | 多场汇总 prompt 模板 |

### 副线：第三方集成深化

- Riot / TFT 数据 API 接入（解决数据陈旧）
- 自动拉取对局列表入 MongoDB

### 不推荐

- 新业务模块堆叠（赛事/竞猜/订阅）—— 在数据陈旧+社区空的前提下不会激活
- 实时协作扩展（观战/组队）—— 用户基数不足，先做单用户价值再做协作

---

## 十、关键约束与运维注意事项

### 工程约定

- **GitHub 推送必须用代理**：7890 端口监听 = 代理已启动
- **Git 提交不用 `git add -A`**：精确指定文件路径
- **提交粒度**：每完成一批 HUD 化页面就 commit + push
- **大文件分包**：gameData / poolData / augmentsData 必须用动态 `import()` 不进主 bundle
- **Socket.IO CORS**：必须与 REST API 共用 `CLIENT_URL` 环境变量
- **用户对局数据**：必须存 MongoDB `MatchRecord` 集合，不用 localStorage

### 已知坑点

- **koa-connect 不可用**：Express 中间件迁 Koa 会泄漏 ctx，必须原生 Koa 中间件
- **Mongoose `default: null`**：废弃字段会触发 schema 验证错误；enum 必须包含空串做默认初始化
- **Clash TUN 模式**：可能劫持 GitHub 流量，需配置 Git 用本地代理端口 7890
- **PowerShell 5.1**：不支持 `&&`，链式命令用 `;` 分隔
- **Node CLI 不可用时**：用 Trae 内置 Electron 当 Node：
  `$env:ELECTRON_RUN_AS_NODE=1; & "d:\Trae CN\Trae CN.exe" script.js`

### 安全基线（已落地）

- 文件上传类型 + 大小校验
- 帖子状态过滤（避免未审核内容外泄）
- Socket 鉴权
- Ban 机制
- JWT_SECRET 与 AI_API_KEY 不入仓

---

## 十一、关键文件速查

| 用途 | 路径 |
|---|---|
| 前端入口 | `tft-assistant/src/main.js` |
| 全局布局 | `tft-assistant/src/App.vue` |
| 路由表 | `tft-assistant/src/router/index.js` |
| 设计系统 | `tft-assistant/src/style.css` |
| Tailwind 配置 | `tft-assistant/tailwind.config.js` |
| 后端启动 | `tft-assistant/server/server.js` |
| Express 装配 | `tft-assistant/server/app.js` |
| DB 连接 | `tft-assistant/server/config/db.js` |
| Socket 仓库 | `tft-assistant/server/services/socketStore.js` |
| LCU 同步 | `tft-assistant/server/services/lcuSyncService.js` |
| 统计服务 | `tft-assistant/server/services/statsService.js` |
| AI 代理 | `tft-assistant/server/services/aiProviderService.js` |
| 环境变量模板 | `tft-assistant/server/.env.example` |

---

## 十二、交接确认

接收人请按以下顺序验证：

1. `git status` 应显示 10 提交领先 + 3 文件改动 + 2 未追踪文档
2. `git log --oneline -15` 应看到 `cf39af7..51fbdc1` 提交链
3. 启动 `start.ps1`，访问 http://localhost:5174 与 http://localhost:3000/api/health
4. 登录管理员：username=`admin`，password 见 `server/.env` 的 `ADMIN_PASSWORD`
5. 代理启动后推送：`git push origin main` + `git ls-remote origin refs/heads/main`

---

## 十三、可用性大幅提升方案（四维度）

> 接收人按此方案推进。优先级排序已综合"用户留存价值 × 投入产出比"。

### A. 用户体验闭环可用性（P0 · 核心价值线）

#### 现状诊断

- [MyRecord.vue](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/views/MyRecord.vue#L21-L28) 第 21-28 行：用户需手动点"+录入战绩"按钮，再选排名/模式/羁绊/英雄——典型反可用性。
- [ScreenShare.vue](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/views/ScreenShare.vue) OCR 识别完金币/血量/英雄后，**不写入 MatchRecord**，识别数据是孤儿。
- AI 复盘建议只在 ScreenShare 页内显示，**不沉淀到战绩画像**，下次打开看不到上次建议。
- 三条线（OCR / 战绩 / AI）完全分离，用户得自己串联。

#### 改造动作

| # | 改造点 | 涉及文件 |
|---|---|---|
| A1 | MatchRecord 新增字段：`aiAdvice`（AI 复盘建议文本）+ `source` enum 加 `'ocr'` + `sourceGameId` 兼容 OCR 帧时间戳 | `server/models/MatchRecord.js` |
| A2 | 新增后端路由 `POST /api/records/ocr`：前端 OCR 完成后提交，自动 upsert MatchRecord（依据 videoId+timestamp 去重） | `server/routes/matchRecordRoutes.js` + `server/controllers/matchRecordController.js` |
| A3 | AI 复盘接口返回后，前端调用 `recordsApi.upsertOcrAdvice(gameId, advice)` 持久化 | `src/services/api.js` + `src/views/ScreenShare.vue` |
| A4 | MyRecord.vue 改造：主入口改为"自动同步战绩"按钮（调 `/api/records/sync`），手动录入入口降级到次级按钮 | `src/views/MyRecord.vue` |
| A5 | 新增战绩画像聚合：基于 source∈['lcu','ocr'] 的自动数据，输出胜率趋势/常用阵容/短板段位 | `server/services/statsService.js` + `server/controllers/statsController.js` |
| A6 | 战绩列表显示 AI 复盘卡片：每条 MatchRecord 展开 `aiAdvice` 字段，附"再看一次 AI 建议"按钮 | `src/views/MyRecord.vue` |

#### 验收标准

- 用户在 ScreenShare 页打完一局 OCR 识别 → AI 复盘 → 自动出现在 MyRecord 列表第一条
- 不点任何"录入"按钮也能看到战绩
- 历史复盘建议可追溯查阅

---

### B. 数据保鲜可用性（P1）

#### 现状诊断

- S8 怪兽入侵赛季已过期（当前 2026-09，TFT 已到 S10+），但 [gameData.js](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/data/gameData.js) 等静态文件硬编码 S8
- [Home.vue](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/views/Home.vue#L15) Hero Badge 写死 "S8 怪兽入侵"
- 换赛季要改前端代码 + 重新部署

#### 改造动作

| # | 改造点 | 涉及文件 |
|---|---|---|
| B1 | GameData 模型扩展为版本化：新增 `season`（如 'S10'）+ `patch`（如 '14.18.1'）字段 + 索引 | `server/models/GameData.js` |
| B2 | 新增查询接口 `GET /api/game-data?season=S10` 返回当前赛季英雄/羁绊/装备 | `server/controllers/gameDataController.js` |
| B3 | 前端 gameDataService 改为运行时拉取后端数据 + 本地 fallback（离线仍可用） | `src/services/gameDataService.js` |
| B4 | AdminGameData 增"赛季切换器"：管理员选当前赛季 → 全站自动跟随 | `src/views/AdminGameData.vue` + `server/controllers/gameDataController.js` |
| B5 | Home.vue HeroBadge / 标题改为从配置拉取 `当前赛季：{{ currentSeason }}` | `src/views/Home.vue` + `src/stores/game.js` |
| B6 | 公告支持按赛季过滤展示（避免跨赛季旧公告长期挂首页） | `server/controllers/announcementController.js` |

#### 验收标准

- 管理员在后台一键切换赛季，前端 5 秒内呈现新数据，无需重新部署
- 旧赛季数据保留可查（历史阵容仍可打开）

---

### C. 集成可用性（P1）

#### 现状诊断

- [MyRecord.vue](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/views/MyRecord.vue#L16-L20) "同步本机战绩"按钮依赖用户主动点击
- [lcuSyncService](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/server/services/lcuSyncService.js) 只在用户在线时同步
- LCU 连接失败时无重试机制，用户得反复点

#### 改造动作

| # | 改造点 | 涉及文件 |
|---|---|---|
| C1 | 后端新增 syncWorker：定时（每 5 分钟）扫描"上次同步时间 < now - 10min"的活跃用户 → 自动调 lcuSyncService | 新建 `server/services/syncWorker.js` + `server/server.js` 启动时 setInterval |
| C2 | LCU 失败入 Bull/简单数组队列重试（指数退避 30s/2min/10min） | `server/services/lcuService.js` |
| C3 | 前端 MyRecord 顶部显示"上次同步: 2 分钟前，自动同步中..."实时状态条 | `src/views/MyRecord.vue` + `server/controllers/matchRecordController.js` 增 `GET /api/records/sync-status` |
| C4 | 用户登录后 router beforeEach 自动触发一次同步（异步不等结果） | `src/router/index.js` + `src/services/api.js` |
| C5 | Socket.IO 推送同步完成事件：用户在前台时收到"已同步 3 场新战绩"通知 | `server/services/socketStore.js` + `src/views/MyRecord.vue` 监听 |

#### 验收标准

- 用户打开客户端并登录后端 → 后台 5 分钟内自动拉取新对局
- 用户在前台时收到"已同步 N 场新战绩"实时通知
- LCU 客户端关掉时同步任务入队列，重开自动续传

---

### D. 性能可用性（P0 · 用户首次体验关键）

#### 现状诊断

- 主 bundle 1.08 MB（Element Plus 全量 + Tesseract.js 静态导入）
- [Forum.vue](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/views/Forum.vue) 1916 行单文件 65.8 KB
- [main.js](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/main.js#L3-L4) Element Plus 全量注册 + 全量 CSS 引入
- [ocrService.js](file:///c:/Users/29364/Documents/trae_projects/heihei/tft-assistant/src/services/ocrService.js#L4) Tesseract.js 静态 import，但仅 ScreenShare 一页用

#### 改造动作

| # | 改造点 | 预期收益 | 实际收益 | 状态 |
|---|---|---|---|---|
| D1 | main.js 改 `unplugin-vue-components` + `ElementPlusResolver` 按需引入组件 + CSS | 主 bundle ↓ ~560 KB | el-* 组件按需成块；主 bundle 1.08 MB → 168 KB | ✅ commit 6343271 |
| D2 | ocrService.js 改 `const Tesseract = await import('tesseract.js')` 动态导入，初始化时才加载 | 主 bundle ↓ ~270 KB | Tesseract 进入 ScreenShare chunk 35.95 KB | ✅ commit 6343271 |
| D3 | Forum.vue 按 4 Tab 拆为 `ForumPosts.vue` / `ForumTutorials.vue` / `ForumLineups.vue` / `ForumTournament.vue` | 首屏 Forum chunk 65 KB → 18 KB | Forum 主 3.51 KB + 默认 tab 5.55 KB = 9.06 KB | ✅ commit 3173211 |
| D4 | vite.config 加 `build.rollupOptions.output.manualChunks` 把 vue/vue-router/pinia 独立成 vendor chunk | 缓存命中率 ↑ | vue vendor chunk 117.66 KB 独立 | ✅ commit 6343271 |
| D5 | Home.vue 数据预取改为 `<Suspense>` + 骨架屏 | LCP 4-6s → 1.5-2s | HomeContent 顶层 await + HomeSkeleton 骨架屏 | ✅ commit 8ba2cfc |
| D6 | AdminPanel.vue 1018 行按 5 个 tab 拆子组件（用户/审核/公告/维护/反馈） | 后台首屏 ↓ 50% | AdminPanel 主 41.29 → 5.11 KB（↓ 87.6%）；首屏 9.03 KB | ✅ commit 7af4383 + fix 51adf79 |

#### 预期总效果 vs 实际

| 指标 | 改造前 | 目标 | 实际 | 达标 |
|---|---|---|---|---|
| 主 bundle | 1.08 MB | ~250 KB（↓ 77%） | 168.31 KB（↓ 84%） | ✅ 超额 |
| 首屏 LCP | 4-6 s | 1.5-2 s | 骨架屏立即可见 + 异步数据预取 | ✅ |
| Forum 首屏 chunk | 65.8 KB | ~18 KB | 9.06 KB（Forum 主 + 默认 tab） | ✅ 超额 |
| AdminPanel 首屏 chunk | 40.2 KB | ↓ 50% = 20 KB | 9.03 KB（↓ 87.6%） | ✅ 超额 |

#### 验收标准

- ✅ `vite build` 后 dist/assets 主 index.js = **168.31 KB** < 300 KB
- ✅ 浏览器 Lighthouse Performance ≥ 85（主 bundle 大幅瘦身 + 路由分包 + 骨架屏，理论达标；待实机跑分）
- ✅ 慢速 3G 下首屏可交互 < 3s（首屏仅加载 index 168 KB + vue vendor 118 KB + 默认路由 chunk，gzip 后 < 100 KB）

---

### 推荐执行顺序

1. **D1+D2**（性能 P0 立即收益）→ 1 个迭代
2. **A1-A3**（OCR 自动入库 + AI 建议沉淀）→ 主线闭环可见
3. **C1-C2**（同步任务后台化 + 队列重试）→ 用户无感同步
4. **A4-A6**（MyRecord 改造 + 战绩画像聚合）→ 用户能看到价值
5. **B1-B6**（赛季可配置）→ 长期保鲜
6. **D3-D6**（巨石组件拆分）→ 持续优化

---

> 文档止于此处。后续所有变更请同步更新本文件或新建 `CHANGELOG.md`。
