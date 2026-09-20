# 掌上金铲铲 - 快速启动指南

## 一键启动（推荐）

在项目根目录 `heihei/` 下，**双击 `start.bat`** 即可一键启动前后端。

启动脚本会自动完成：
1. 检测 Node.js 是否安装
2. 自动启动 MongoDB（如已安装）
3. 首次运行自动安装依赖（`npm install`）
4. 启动后端服务（Express，端口 3000）
5. 启动前端开发服务器（Vite，端口 5174）
6. 自动打开浏览器访问 `http://localhost:5174`

启动后会弹出两个命令行窗口：
- **掌上金铲铲-后端**：Express 服务器日志
- **掌上金铲铲-前端**：Vite 开发服务器日志

关闭这两个窗口即可停止对应服务。

---

## 系统要求

| 组件 | 要求 | 下载地址 |
|------|------|----------|
| Node.js | 16.0+，推荐 LTS 版本 | https://nodejs.org/ |
| MongoDB | 6.0+（后端数据库，如未安装前端可正常浏览但无后端功能） | https://www.mongodb.com/try/download/community |
| 操作系统 | Windows 10/11 | - |

---

## 访问地址

启动成功后可通过以下地址访问各功能页面：

| 页面 | 地址 |
|------|------|
| 首页 | http://localhost:5174/ |
| 阵容模拟器 | http://localhost:5174/teamfight |
| 装备合成 | http://localhost:5174/equipment |
| 卡池概率追踪 | http://localhost:5174/pool |
| 经济计算器 | http://localhost:5174/economy |
| 羁绊大全 | http://localhost:5174/synergies |
| 海克斯强化 | http://localhost:5174/augments |
| 大数据看板 | http://localhost:5174/dashboard |
| AI实时指导 | http://localhost:5174/screenshare |
| 玩家论坛 | http://localhost:5174/forum |
| 发帖 | http://localhost:5174/forum/new |
| 社交中心 | http://localhost:5174/social |
| 战绩记录 | http://localhost:5174/record |
| 意见反馈 | http://localhost:5174/feedback |
| 个人中心 | http://localhost:5174/profile |
| 管理后台 | http://localhost:5174/admin |
| 游戏数据管理 | http://localhost:5174/admin/game-data |

---

## 项目结构

```
heihei/
├── start.bat                      ← 一键启动脚本（双击运行）
├── start.ps1                      ← PowerShell 启动脚本
├── tft-assistant/                 ← 项目源码
│   ├── package.json               ← 前端依赖配置
│   ├── vite.config.js             ← Vite 配置
│   ├── index.html                 ← 入口 HTML
│   ├── src/                       ← 前端源码
│   │   ├── views/                 ← 21个页面组件
│   │   ├── components/            ← 公共组件
│   │   ├── router/                ← 路由配置
│   │   ├── stores/                ← Pinia 状态管理
│   │   ├── services/              ← API 服务层
│   │   └── data/                  ← 游戏数据
│   └── server/                    ← 后端源码
│       ├── server.js              ← 服务入口
│       ├── models/                ← 数据模型（Mongoose）
│       ├── controllers/           ← 控制器
│       ├── routes/                ← 路由
│       ├── middleware/            ← 中间件
│       └── config/                ← 配置文件
```

---

## 常见问题

### Q: 双击 start.bat 后，前端加载正常但后端报错
**A**: 请确保 MongoDB 已安装并正在运行。后端依赖 MongoDB 数据库。

### Q: 端口被占用
**A**: 检查 5174（前端）或 3000（后端）端口是否被其他程序占用，关闭后在任务管理器中结束对应进程。

### Q: PowerShell 脚本无法运行
**A**: PowerShell 默认禁止运行脚本，解决方案：
```powershell
# 临时允许（仅当前会话）
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# 然后运行
.\start.ps1
```
或直接双击 `start.bat` 使用命令行版本。

### Q: 如何停止服务
**A**: 分别关闭"掌上金铲铲-后端"和"掌上金铲铲-前端"两个命令行窗口即可。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Composition API |
| 构建工具 | Vite 5 |
| UI 框架 | Tailwind CSS + Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 后端框架 | Express.js |
| 数据库 | MongoDB + Mongoose |
| 认证 | JWT + bcryptjs |
| 实时通信 | Socket.IO |

---

**祝使用愉快！**
