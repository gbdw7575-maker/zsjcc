# -*- coding: utf-8 -*-
"""生成掌上金铲铲系统功能说明文档"""
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(BASE_DIR, "掌上金铲铲_系统功能说明文档.docx")

doc = Document()

# ── 全局样式设置 ──
style = doc.styles['Normal']
style.font.name = '宋体'
style.font.size = Pt(10.5)
style.paragraph_format.line_spacing = 1.5
style.paragraph_format.space_after = Pt(4)
style.element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

for level in range(1, 4):
    hs = doc.styles[f'Heading {level}']
    hs.font.name = '黑体'
    hs.element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
    hs.font.color.rgb = RGBColor(0x1a, 0x0a, 0x2e)

# ── 封面 ──
doc.add_paragraph('\n\n\n\n')
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('掌上金铲铲')
run.font.size = Pt(36)
run.font.bold = True
run.font.color.rgb = RGBColor(0x93, 0x33, 0xEA)
run.font.name = '黑体'
run.element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = sub.add_run('云顶之弈 AI 智能辅助平台')
r2.font.size = Pt(22)
r2.font.color.rgb = RGBColor(0x94, 0xa3, 0xb8)
r2.font.name = '黑体'
r2.element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph()
sub2 = doc.add_paragraph()
sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r3 = sub2.add_run('系统功能说明文档')
r3.font.size = Pt(20)
r3.font.bold = True
r3.font.name = '黑体'
r3.element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph('\n\n')
info = doc.add_paragraph()
info.alignment = WD_ALIGN_PARAGRAPH.CENTER
for line in ['版本：v1.0.0', '赛季：S8 怪兽入侵', '技术栈：Vue 3 + Express + MongoDB + 通义千问 AI', '日期：2026年6月']:
    r = info.add_run(line + '\n')
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(0x64, 0x74, 0x8b)

doc.add_page_break()

# ── 目录页 ──
doc.add_heading('目  录', level=1)
toc_items = [
    '一、系统概述',
    '二、技术架构总览',
    '三、前端功能模块详解',
    '  3.1 用户认证模块',
    '  3.2 首页导航',
    '  3.3 阵容模拟器',
    '  3.4 装备合成系统',
    '  3.5 卡池概率追踪',
    '  3.6 经济运营计算器',
    '  3.7 羁绊大全',
    '  3.8 海克斯强化符文',
    '  3.9 版本大数据看板',
    '  3.10 AI实时指导',
    '  3.11 玩家社区论坛',
    '  3.12 社交中心',
    '  3.13 个人中心与战绩',
    '  3.14 意见反馈',
    '  3.15 管理后台',
    '四、后端API接口清单',
    '五、数据模型设计',
    '六、游戏数据系统',
    '七、AI辅助功能详解',
    '八、部署与运行说明',
]
for item in toc_items:
    p = doc.add_paragraph(item)
    p.paragraph_format.space_after = Pt(2)

doc.add_page_break()

# ====================================================================
#  辅助函数
# ====================================================================
def add_h1(text):
    doc.add_heading(text, level=1)

def add_h2(text):
    doc.add_heading(text, level=2)

def add_h3(text):
    doc.add_heading(text, level=3)

def add_table(headers, rows, col_widths=None):
    """添加格式化表格"""
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.style = 'Light Grid Accent 1'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # 表头
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.bold = True
                run.font.size = Pt(9)
    # 数据行
    for r, row in enumerate(rows):
        for c, val in enumerate(row):
            cell = table.rows[r + 1].cells[c]
            cell.text = str(val)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9)
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = Cm(w)
    doc.add_paragraph()
    return table

# ====================================================================
#  第一章：系统概述
# ====================================================================
add_h1('一、系统概述')

add_h2('1.1 项目简介')
doc.add_paragraph(
    '"掌上金铲铲"是一款面向金铲铲之战（TFT云顶之弈）S8"怪兽入侵"赛季的AI智能辅助平台。'
    '系统集成了阵容模拟搭建、装备合成查询、卡池概率实时计算、经济运营规划、羁绊与海克斯数据查询、'
    '版本大数据分析、AI实时对战指导、社区论坛交流、社交互相关注私信、战绩记录管理、'
    '游戏账号绑定及意见反馈等十余项核心功能，为玩家提供从备战到对局全程的智能化辅助服务。'
)

add_h2('1.2 适用场景')
doc.add_paragraph('本系统适用于以下场景：')
scenarios = [
    '阵容研究：模拟搭建9人口阵容，查看羁绊组合效果',
    '装备决策：查询装备合成路径和属性，优化出装策略',
    '概率计算：实时追踪卡池剩余，计算D牌成功概率',
    '经济规划：计算利息收益，规划升级节奏和金币分配',
    '版本学习：查看当前版本T0/T1阵容强度排行和运营思路',
    '实时辅助：对战时通过AI视觉分析获取实时决策建议',
    '社区交流：发帖分享攻略、阵容，与其他玩家交流',
    '战绩追踪：记录和分析个人对局数据，提升竞技水平',
]
for s in scenarios:
    doc.add_paragraph(s, style='List Bullet')

add_h2('1.3 核心特色')
features = [
    '多厂商AI视觉分析：支持通义千问、智谱AI、OpenAI等多种大模型，自动识别游戏画面并给出实时建议',
    '完整的S8赛季数据：内置59个英雄、27种羁绊、45件装备、80+海克斯强化的完整数据库',
    '概率数学引擎：基于二项分布和超几何分布的真实卡池概率计算',
    'Socket.IO实时通信：私信消息即时送达，在线状态检测',
    '内容审核机制：帖子发布需管理员审核，保障社区内容质量',
    '丰富的教学资源：52个教学视频，覆盖阵容教学、运营入门、进阶技巧等7大分类',
]
for f in features:
    doc.add_paragraph(f, style='List Bullet')

doc.add_page_break()

# ====================================================================
#  第二章：技术架构
# ====================================================================
add_h1('二、技术架构总览')

add_h2('2.1 整体架构')
doc.add_paragraph(
    '系统采用前后端分离的B/S架构，前端使用Vue 3单页应用，后端采用Express RESTful API + MongoDB数据库。'
    '前后端通过HTTP/HTTPS通信，实时消息通过Socket.IO WebSocket协议传输。'
)

add_table(
    ['层级', '技术选型', '说明'],
    [
        ['前端框架', 'Vue 3 + Composition API', '采用 <script setup> 语法，组件化开发'],
        ['UI组件库', 'Element Plus', '企业级Vue 3组件库，提供表单、表格、对话框等'],
        ['CSS框架', 'Tailwind CSS', '实用优先的原子化CSS框架'],
        ['状态管理', 'Pinia', 'Vue 3官方推荐的状态管理库'],
        ['路由', 'Vue Router 4', '支持路由守卫、懒加载、动态路由'],
        ['HTTP客户端', 'Axios', '封装统一请求拦截器和响应处理'],
        ['实时通信', 'Socket.IO', 'WebSocket双向通信，支持私信实时推送'],
        ['OCR引擎', 'Tesseract.js', '本地OCR文字识别，支持中英文'],
        ['后端框架', 'Express 4', 'Node.js轻量级Web框架'],
        ['数据库', 'MongoDB + Mongoose', 'NoSQL文档数据库，灵活的Schema设计'],
        ['认证', 'JWT (JSON Web Token)', '无状态token认证'],
        ['文件上传', 'Multer', '支持图片和视频文件上传'],
        ['安全防护', 'Helmet + CORS + Rate Limiting', '多层安全中间件'],
        ['AI服务', '通义千问 / 智谱AI / OpenAI', '多模态视觉模型分析游戏画面'],
    ]
)

add_h2('2.2 项目目录结构')
doc.add_paragraph(
    'tft-assistant/\n'
    '├── src/                          # 前端源码\n'
    '│   ├── views/                    # 21个页面组件\n'
    '│   ├── components/               # 公共组件\n'
    '│   ├── router/                   # 路由配置 (22条路由)\n'
    '│   ├── stores/                   # Pinia状态管理 (4个Store)\n'
    '│   ├── services/                 # 服务层 (7个服务模块)\n'
    '│   ├── data/                     # 游戏静态数据 (8个数据文件)\n'
    '│   ├── App.vue                   # 根组件\n'
    '│   ├── main.js                   # 应用入口\n'
    '│   └── style.css                 # 全局样式\n'
    '├── server/                       # 后端源码\n'
    '│   ├── controllers/              # 控制器 (11个)\n'
    '│   ├── models/                   # 数据模型 (11个)\n'
    '│   ├── routes/                   # 路由定义 (11个)\n'
    '│   ├── middleware/               # 中间件 (认证/验证/管理员)\n'
    '│   ├── config/                   # 配置 (数据库/文件上传)\n'
    '│   ├── services/                 # 服务 (LCU客户端连接)\n'
    '│   └── uploads/                  # 文件上传目录\n'
    '├── public/                       # 静态资源 (英雄/装备图标)\n'
    '├── package.json                  # 项目依赖配置\n'
    '├── vite.config.js               # Vite构建配置\n'
    '└── tailwind.config.js           # Tailwind配置\n'
)

doc.add_page_break()

# ====================================================================
#  第三章：前端功能模块详解
# ====================================================================
add_h1('三、前端功能模块详解')

# 3.1 用户认证
add_h2('3.1 用户认证模块')
add_h3('3.1.1 登录页面（/login）')
doc.add_paragraph(
    '提供玩家登录入口。页面采用暗紫渐变背景 + 星星/粒子/浮动物品动画效果，打造沉浸式游戏氛围。'
    '包含用户名和密码输入框，支持表单校验。登录成功后跳转首页，失败5次触发账号锁定（30分钟冷却），'
    '锁定期间显示剩余等待时间倒计时。'
)
add_table(
    ['字段', '类型', '说明'],
    [
        ['username', 'String (必填)', '召唤师名称，用于登录标识'],
        ['password', 'String (必填)', '登录密码，最少6位字符'],
        ['账号锁定', '自动', '连续5次失败后锁定30分钟'],
    ]
)

add_h3('3.1.2 注册页面（/register）')
doc.add_paragraph(
    '提供新玩家注册功能。支持填写用户名、邮箱、密码、确认密码。'
    '用户可选择注册类型：普通玩家或内容创作者（创作者可发布阵容攻略）。'
    '注册成功后自动调用登录接口完成登录并跳转首页。密码一致性由自定义validator校验。'
)
add_table(
    ['字段', '类型', '说明'],
    [
        ['username', 'String (必填)', '召唤师名称'],
        ['email', 'String (必填)', '电子邮箱地址'],
        ['password', 'String (必填)', '登录密码（最少6位）'],
        ['confirmPassword', 'String (必填)', '确认密码（须与密码一致）'],
        ['type', 'Enum (必填)', '用户类型：player（玩家）/ creator（创作者）'],
    ]
)

add_h3('3.1.3 认证机制')
doc.add_paragraph(
    '系统使用JWT Token进行无状态认证。登录/注册成功后后端返回token，前端存储在localStorage中。'
    'Axios请求拦截器自动为每个请求添加Authorization: Bearer <token>请求头。'
    'Vue Router全局导航守卫检测token存在性，未登录用户访问需认证页面时自动跳转至登录页。'
    'token失效（401响应）时自动清除本地存储并跳转登录页，防止多个请求同时触发重复跳转。'
)

# 3.2 首页
add_h2('3.2 首页导航（/）')
doc.add_paragraph(
    '首页作为功能门户，展示6大功能模块的卡片入口：阵容模拟器、装备合成、卡池概率、经济计算器、'
    '海克斯强化、羁绊大全。每个卡片含图标、标题和简要描述，hover时触发上浮动画。'
    '顶部显示系统公告列表（支持置顶和类型区分），右侧展示热门阵容推荐卡片。'
    '底部提供S8"怪兽入侵"赛季返场版本更新提示。'
)

# 3.3 阵容模拟器
add_h2('3.3 阵容模拟器（/teamfight）')
doc.add_paragraph(
    '阵容模拟器是系统的核心功能之一，提供拖拽式阵容搭建工具。'
    '左侧为棋子库（可按费用1-5费筛选、按羁绊筛选），展示英雄头像和名称。'
    '中间为9人口棋盘（4x7网格），模拟游戏中的实际棋盘布局。'
    '右侧为羁绊实时计算面板，显示当前阵容激活的所有羁绊及层数效果，以及已保存阵容列表。'
)
doc.add_paragraph('核心交互功能：', style='List Bullet')
items = [
    '点击添加：点击棋子库中的英雄，自动放置到棋盘第一个空位（最多9人口）',
    '拖拽放置：从棋子库拖拽英雄到棋盘指定位置',
    '棋盘内移动：在棋盘上拖拽英雄调整站位',
    '羁绊实时计算：每次棋盘状态变化时自动重新计算所有羁绊组合及层数',
    '阵容保存/加载：支持命名保存、一键加载、删除已保存阵容（数据存储在localStorage）',
    '创作者发布：创作者用户可选择"发布为阵容攻略"，填写攻略内容后发布到社区',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

# 3.4 装备合成
add_h2('3.4 装备合成系统（/equipment）')
doc.add_paragraph(
    '完整展示S8赛季全部45件装备的详细数据。顶部支持按装备等级筛选（基础装备/合成装备/全部）。'
    '每张装备卡片显示图标、名称、属性加成效果。底部提供"合成公式速览"区域，'
    '直观展示任意两件基础装备组合成的成品装备及合成流程图。'
    '装备卡片按类型（攻击/防御/法术/攻速/功能）显示不同颜色边框和徽章标识。'
)

# 3.5 卡池概率
add_h2('3.5 卡池概率追踪（/pool）')
doc.add_paragraph(
    '卡池概率追踪器基于S8赛季真实的共享卡池机制，帮助玩家精准计算D牌概率。'
    '每个英雄卡片展示名称、费用和卡池剩余张数。玩家可分别标记"我持有"和"他人持有"的张数，'
    '系统实时扣除已持有数量后重新计算概率。'
)
doc.add_paragraph('核心计算功能：', style='List Bullet')
items = [
    '单格出现概率：指定等级下某个英雄单格出现的精确概率（基于超几何分布）',
    '每次刷新出现概率：5格一起刷新时至少出现一张的概率（补事件法）',
    '预算D牌分析：在指定金币预算下，D到N张目标英雄的累积概率',
    '期望消耗计算：D到目标数量期望消耗的金币数、50%/80%置信区间次数（二分查找法）',
    '概率曲线可视化：1-25次D牌的累积概率柱状图',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

doc.add_paragraph(
    '卡池参数：1费英雄每种29张、2费22张、3费18张、4费12张、5费10张。'
    '刷牌概率表覆盖Lv4-Lv9，数据源基于官方S8赛季数据。'
)

# 3.6 经济计算器
add_h2('3.6 经济运营计算器（/economy）')
doc.add_paragraph(
    '经济运营计算器模拟金铲铲S8的经济系统，帮助玩家规划金币使用。'
    '输入当前状态（金币、等级、经验值、连胜/连败场数）和目标等级后，系统实时计算：'
)
items = [
    '利息收入：基于当前金币计算的最大利息（上限5金币）',
    '下回合收入：基础收入+利息+连胜/连败奖励的合计',
    '升级花费：从当前等级升至目标等级需要的总经验值及对应金币数',
    '利息断点提醒：提示当前金币是否接近下一个利息断点（10/20/30/40/50）',
    '未来8回合金币趋势预测图表',
    'D牌成本分析：按目标等级展示各费用英雄的刷新概率',
    '升级经验表：展示每个等级需要的经验值和累计经验',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

# 3.7 羁绊大全
add_h2('3.7 羁绊大全（/synergies）')
doc.add_paragraph(
    '展示S8赛季全部27种羁绊的完整数据，分为特质羁绊（14种）和职业羁绊（7种）两大类。'
    '支持按类型筛选和关键词搜索。每种羁绊卡片展示：羁绊图标和名称、效果描述、'
    '各层级触发人数和具体效果数值、所属英雄列表及图标。'
)
doc.add_paragraph('特质羁绊涵盖了地下魔盗团（战利品进度）、管理员程序（配置选择）、怪兽（基础属性增强）、'
    '星之守护者、小天才、灵能使、爱心使者、黑客（骑马切后排）、源计划：激光特工（无人机）、'
    '战斗机甲（至尊机甲合体）、福牛守护者、超级英雄、平民英雄、堕落使者等14种。'
)
doc.add_paragraph('职业羁绊包括：斗士、护卫、精英战士、情报特工、决斗大师、枪手、秘术卫士等7种。')

# 3.8 海克斯强化
add_h2('3.8 海克斯强化符文（/augments）')
doc.add_paragraph(
    '展示S8赛季全部海克斯强化符文数据，分为四大类：英雄强化符文（60+个）、银色强化（10个）、'
    '金色强化（15个）、棱彩强化（14个）。每个符文显示名称、效果描述、适用阵容标签和强度等级（T0/T1/T2）。'
    '支持按符文类型和强度等级筛选。强度等级以不同颜色徽章标识（T0红色/T1橙色/T2蓝色）。'
    '英雄强化符文覆盖全部费用段的英雄，每个英雄有1-2个专属强化选项（自身强化型或团队强化型）。'
)

# 3.9 大数据看板
add_h2('3.9 版本大数据看板（/dashboard）')
doc.add_paragraph(
    '版本数据仪表盘，综合展示当前版本的元数据信息。包含以下数据面板：'
)
items = [
    '阵容强度排行Top6：展示胜率最高阵容的名称、平均排名、出场率、前四率。点击可弹窗查看阵容详情（含阵容概述、核心羁绊、棋子搭配、装备推荐、运营思路、海克斯推荐、优劣势分析）。',
    '装备推荐：当前版本最热门的装备及适用英雄',
    '羁绊强度排行：以进度条形式展示各羁绊的强度评分',
    '版本运营思路：分阶段（前期/中期/后期/决赛圈）的运营要点卡片',
    '主C英雄出装速查：核心C位英雄的推荐三件套装备',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

# 3.10 AI实时指导
add_h2('3.10 AI实时指导（/screenshare）')
doc.add_paragraph(
    '核心AI辅助功能页面，支持通过浏览器原生getDisplayMedia API共享游戏画面，'
    '调用多模态AI视觉模型实时分析游戏状态并提供决策建议。'
)
doc.add_paragraph('功能流程：', style='List Bullet')
items = [
    '屏幕共享：点击"开始共享"调用浏览器屏幕共享API，选择游戏窗口',
    'AI分析：每6秒自动截取游戏画面帧，发送至AI视觉模型进行分析',
    '状态识别：AI识别当前游戏阶段、金币、血量、等级、激活羁绊等信息',
    '建议生成：基于识别的游戏状态，AI生成阵容建议、装备推荐、运营策略',
    '数据稳定机制：血量使用众数稳定机制（最近5次取最多值），防止AI识别跳变',
    '手动修正：面板数据支持点击手动修正，补充或覆盖AI识别结果',
    '演示模式：浏览器不支持屏幕共享时，可切换为演示模式查看功能效果',
    '多厂商配置：支持通义千问（qwen3-vl-plus）、智谱AI（glm-4v-flash）、OpenAI等多种AI服务商',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_table(
    ['识别的游戏要素', 'AI面板展示内容', '建议类型'],
    [
        ['当前阶段（回合数）', '金币余额', '阵容方向建议'],
        ['玩家血量', '当前等级', '搜牌时机判断'],
        ['激活的羁绊列表', '连胜/连败状态', '装备合成推荐'],
        ['棋盘上的棋子', 'AI置信度评分', '升级/存钱策略'],
    ]
)

# 3.11 论坛
add_h2('3.11 玩家社区论坛（/forum）')
doc.add_paragraph(
    '社区论坛主页面，包含四个标签页：'
)
add_h3('论坛帖子标签页')
items = [
    '浏览帖子：按分类（阵容推荐/装备攻略/运营思路/杂谈/求助）筛选浏览帖文',
    '搜索排序：支持关键词搜索和按最新/最热排序',
    '点赞互动：对帖子进行点赞，热度高的帖子优先展示',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h3('教学资源标签页')
items = [
    '内置52个教学视频，覆盖阵容教学（14个）、运营教学（6个）、装备神器（5个）、娱乐玩法（5个）、进阶技巧（6个）、新手入门（6个）、抖音精选（10个）',
    '支持按分类和平台（B站/抖音）筛选',
    'B站视频支持iframe嵌入页面直接播放',
    '包含固定攻略卡片（魔盗团奖励层数表、管理员程序配置推荐）',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h3('阵容分享标签页')
items = [
    '浏览其他玩家发布的阵容攻略',
    '点赞和评论阵容',
    '创建并分享自己的阵容',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h3('赛事资讯标签页')
doc.add_paragraph('展示版本公告、JOC赛事信息（夏季赛/四大赛道/赛程安排）、平衡性调整解读等资讯内容。')

# 发帖和帖子详情
add_h3('发帖页面（/forum/new）')
doc.add_paragraph(
    '支持发布新帖，包含标题输入、内容编辑、标签选择（预定义标签 + S8专属标签 + 自定义标签）、'
    '图片/视频上传（支持拖拽上传和文件选择，最多9个文件，单个最大100MB）。'
    '支持jpg/png/gif/webp图片格式和mp4/webm/ogg视频格式。'
    '提交前可预览帖子内容。'
)

add_h3('帖子详情页面（/forum/:id）')
doc.add_paragraph(
    '查看帖子完整内容，包含文本、图片（支持点击大图全屏预览）和视频（支持播放）。'
    '评论区支持发表评论、点赞评论、回复评论（嵌套回复）、转发评论。'
    '帖子支持点赞和收藏。分享功能通过复制链接实现。'
)

# 3.12 社交中心
add_h2('3.12 社交中心（/social）')
doc.add_paragraph('社交功能页面，提供玩家之间的互动交流。包含以下功能：')
items = [
    '私信消息：会话列表、发送私信、用户搜索、聊天对话框。通过Socket.IO实现消息即时收发，支持未读标记（红点提示）。',
    '关注系统：查看我的关注列表和粉丝列表，支持互相关注（回关）。',
    '黑名单管理：拉黑/取消拉黑用户，拉黑后自动取消互关关系。',
    '私信规则：非互关用户仅可发送首条消息，互关后可自由聊天。被拉黑或拉黑对方都无法发送。',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

# 3.13 个人中心
add_h2('3.13 个人中心与战绩（/profile）')
doc.add_paragraph('个人中心提供完整的个人资料管理和战绩追踪功能：')
items = [
    '头像上传：支持通过FileReader读取本地图片为Base64格式上传',
    '编辑资料：修改昵称、性别、年龄段、所在地区、游戏段位、个性签名和自定义标签',
    '游戏账号绑定：支持TFT国际版（通过LCU API自动同步战绩）和国服金铲铲（本地存储，因无官方API）',
    '战绩统计：展示总对局数、胜利场次、前四场次、胜率、前四率、平均排名',
    '最近战绩列表：展示每场比赛的排名、等级、金币、使用的羁绊信息',
    '目标设置：设定个人上分目标',
    '修改密码：支持密码修改功能',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h3('战绩录入页面（/my-record 注：路由推测为 /record）')
doc.add_paragraph(
    '支持手动录入对局记录：选择排名（1-8名，不同排名不同颜色高亮）、对局模式（排位/匹配/双人/狂暴）、'
    '羁绊输入、阵容英雄（含1-3星级切换）、备注。英雄输入支持从全部59个英雄中自动补全搜索。'
    '战绩统计卡片展示总场次、吃鸡率、前四率、平均排名、吃鸡次数。'
    '对局列表支持分页浏览和单条删除。'
)

# 3.14 反馈
add_h2('3.14 意见反馈（/feedback）')
doc.add_paragraph(
    '用户反馈提交和查看页面：用户可选择反馈类型（Bug/功能建议/改进意见/其他），'
    '填写标题和详细描述，设置优先级（低/中/高）。提交后可查看"我的反馈"列表，'
    '列表中展示管理员回复（蓝色背景卡片标识）、反馈状态标签（待处理/处理中/已解决/已关闭）和类型标签。'
)

# 3.15 管理后台
add_h2('3.15 管理后台')
add_h3('管理中心（/admin）')
doc.add_paragraph('管理员后台仪表盘，包含6项关键统计指标和5大管理标签页：')
items = [
    '统计概览：用户总数、帖子总数、待审核帖子数、公告总数、7天活跃用户、待处理反馈数',
    '用户管理：搜索用户、封禁/解封用户（toggle切换）、设为管理员、删除用户（含确认弹窗）',
    '内容审核：查看待审核帖子列表，通过审核或拒绝（需填写拒绝理由）',
    '公告管理：发布/编辑/删除公告（支持普通/重要/紧急类型、置顶选项）',
    '阵容数据管理：阵容的置顶推荐、下架删除、缓存清理',
    '反馈管理：查看/筛选/回复/修改状态/修改优先级/删除反馈',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h3('版本数据管理（/admin/game-data）')
doc.add_paragraph(
    '管理系统中的游戏版本数据（阵容/装备/羁绊/英雄），支持按数据类型筛选浏览。'
    '可添加单条数据（JSON格式输入）、批量导入（JSON数组格式一次导入多条）、查看/编辑/删除单条数据。'
)

doc.add_page_break()

# ====================================================================
#  第四章：API接口清单
# ====================================================================
add_h1('四、后端API接口清单')

doc.add_paragraph(
    '系统后端提供73个REST API端点，覆盖11个功能模块。所有需要认证的接口需在请求头中携带'
    'Authorization: Bearer <token>。管理员专属接口额外需要用户role为"admin"。'
)

add_h2('4.1 用户模块（/api/users）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['POST', '/register', '无', '用户注册', 'username, email, password'],
        ['POST', '/login', '无', '用户登录', 'username, password'],
        ['GET', '/me', 'protect', '获取当前用户信息', '-'],
        ['PUT', '/profile', 'protect', '更新个人资料', 'bio, avatar, gameId, region'],
        ['GET', '/:id', '无', '获取用户公开资料', 'id(路径参数)'],
    ]
)

add_h2('4.2 游戏数据模块（/api/game-data）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/', '无', '获取活跃游戏数据列表', 'type, version(Query)'],
        ['GET', '/active-version', '无', '获取当前活跃版本号', '-'],
        ['GET', '/:id', '无', '获取单条数据详情', 'id(路径参数)'],
        ['POST', '/', 'admin', '创建游戏数据', 'version, type, data, source'],
        ['POST', '/bulk', 'admin', '批量创建游戏数据', 'version, items[]'],
        ['PUT', '/:id', 'admin', '更新游戏数据', 'id(路径参数), 更新字段'],
        ['DELETE', '/:id', 'admin', '删除游戏数据', 'id(路径参数)'],
    ]
)

add_h2('4.3 阵容模块（/api/lineups）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/', '无', '获取已发布阵容列表（分页+排序）', 'page, limit, sort'],
        ['GET', '/:id', '可选', '获取阵容详情（+1浏览量）', 'id(路径参数)'],
        ['POST', '/', 'protect', '创建阵容', 'title, description, heroes, positioning, tags'],
        ['PUT', '/:id', 'protect', '更新阵容（仅作者）', 'id(路径参数)'],
        ['DELETE', '/:id', 'protect', '删除阵容（作者/admin）', 'id(路径参数)'],
        ['POST', '/:id/like', 'protect', '点赞/取消点赞阵容', 'id(路径参数)'],
        ['POST', '/:id/comments', 'protect', '添加评论', 'content'],
        ['GET', '/:id/comments', '无', '获取评论列表', 'id(路径参数)'],
    ]
)

add_h2('4.4 帖子模块（/api/posts）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/', '无', '获取已发布帖子列表', 'category, page, limit, search'],
        ['GET', '/:id', '可选', '获取帖子详情（含评论）', 'id(路径参数)'],
        ['POST', '/', 'protect', '创建帖子（含文件上传）', 'title, content, category, tags, files(最多9个)'],
        ['POST', '/:id/like', 'protect', '点赞/取消点赞帖子', 'id(路径参数)'],
        ['POST', '/:id/favorite', 'protect', '收藏/取消收藏帖子', 'id(路径参数)'],
        ['POST', '/:postId/comments', 'protect', '创建评论/回复', 'content, parentComment'],
        ['POST', '/comments/:id/like', 'protect', '点赞/取消点赞评论', 'id(路径参数)'],
    ]
)

add_h2('4.5 社交模块（/api/social）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['POST', '/follow', 'protect', '关注/取消关注', 'userId'],
        ['GET', '/followers/:userId', '无', '获取粉丝列表', 'userId(路径参数)'],
        ['GET', '/following/:userId', '无', '获取关注列表', 'userId(路径参数)'],
        ['GET', '/check/:userId', 'protect', '检查关注状态', 'userId(路径参数)'],
        ['GET', '/search', '无', '搜索用户（最多10条）', 'q(关键词)'],
        ['POST', '/block/:userId', 'protect', '拉黑用户', 'userId(路径参数)'],
        ['POST', '/unblock/:userId', 'protect', '取消拉黑', 'userId(路径参数)'],
        ['GET', '/blocklist', 'protect', '获取黑名单', '-'],
    ]
)

add_h2('4.6 私信模块（/api/messages）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/conversations', 'protect', '获取会话列表', '-'],
        ['GET', '/unread', 'protect', '获取未读消息总数', '-'],
        ['GET', '/:userId', 'protect', '获取与指定用户的聊天记录', 'userId(路径参数)'],
        ['POST', '/:userId', 'protect', '发送私信', 'content'],
    ]
)

add_h2('4.7 战绩模块（/api/records）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['POST', '/', 'protect', '录入对局记录', 'placement, mode, traits, units, note'],
        ['GET', '/', 'protect', '获取战绩列表+统计', 'page, limit'],
        ['GET', '/:id', 'protect', '获取单条战绩详情', 'id(路径参数)'],
        ['DELETE', '/:id', 'protect', '删除战绩记录', 'id(路径参数)'],
    ]
)

add_h2('4.8 反馈模块（/api/feedback）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['POST', '/', 'protect', '创建反馈', 'type, title, description, priority'],
        ['GET', '/my', 'protect', '获取我的反馈列表', 'page, limit'],
        ['GET', '/all', 'admin', '获取全部反馈（可筛选）', 'page, limit, status, type'],
        ['PUT', '/:id/reply', 'admin', '回复反馈', 'adminReply'],
        ['PUT', '/:id/status', 'admin', '更新反馈状态', 'status, adminReply, priority'],
        ['DELETE', '/:id', 'admin', '删除反馈', 'id(路径参数)'],
    ]
)

add_h2('4.9 管理员模块（/api/admin）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/users', 'admin', '获取用户列表', 'page, limit, search'],
        ['GET', '/stats', 'admin', '获取平台统计数据', '-'],
        ['GET', '/users/:id', 'admin', '获取用户详情', 'id(路径参数)'],
        ['PUT', '/users/:id', 'admin', '更新用户信息', 'role, bio, avatar'],
        ['DELETE', '/users/:id', 'admin', '删除用户', 'id(路径参数)'],
        ['POST', '/users/:id/toggle-ban', 'admin', '封禁/解封用户', 'id(路径参数)'],
        ['GET', '/posts/pending', 'admin', '获取待审核帖子', 'page, limit'],
        ['GET', '/posts', 'admin', '获取全部帖子', 'page, limit, status'],
        ['POST', '/posts/:id/approve', 'admin', '通过帖子审核', 'id(路径参数)'],
        ['POST', '/posts/:id/reject', 'admin', '拒绝帖子', 'reason'],
        ['GET', '/teams', 'admin', '获取全部阵容数据', 'page, limit, version, isActive'],
        ['PUT', '/teams/:id', 'admin', '更新阵容数据', 'isActive'],
        ['DELETE', '/teams/:id', 'admin', '删除阵容数据', 'id(路径参数)'],
    ]
)

add_h2('4.10 公告模块（/api/announcements）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/', '无', '获取激活公告列表', 'page, limit'],
        ['GET', '/:id', '无', '获取公告详情', 'id(路径参数)'],
        ['POST', '/', 'admin', '创建公告', 'title, content, type, isPinned'],
        ['PUT', '/:id', 'admin', '更新公告', 'title, content, type, isPinned, isActive'],
        ['DELETE', '/:id', 'admin', '删除公告', 'id(路径参数)'],
        ['GET', '/admin/all', 'admin', '获取全部公告', 'page, limit'],
    ]
)

add_h2('4.11 TFT数据模块（/api/tft）')
add_table(
    ['方法', '路径', '认证', '功能', '参数'],
    [
        ['GET', '/status', 'protect', '检查LCU连接状态', '-'],
        ['GET', '/summoner', 'protect', '获取召唤师信息', '-'],
        ['GET', '/overview', 'protect', '获取战绩总览', 'count'],
        ['GET', '/matches', 'protect', '获取对局历史', 'count'],
        ['GET', '/match/:gameId', 'protect', '获取对局详情', 'gameId(路径参数)'],
    ]
)

doc.add_page_break()

# ====================================================================
#  第五章：数据模型
# ====================================================================
add_h1('五、数据模型设计')

doc.add_paragraph('系统使用MongoDB作为数据库，通过Mongoose ODM定义11个数据模型。密码使用bcrypt加密存储。')

add_h2('5.1 User（用户模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['username', 'String (唯一, 必填)', '用户名'],
        ['email', 'String (唯一, 必填)', '电子邮箱'],
        ['password', 'String (必填, bcrypt加密)', '登录密码'],
        ['avatar', 'String', '头像URL/Base64'],
        ['bio', 'String', '个人简介'],
        ['gameId', 'String', '游戏账号ID'],
        ['region', 'String', '游戏大区'],
        ['favorites', '[ObjectId → Post]', '收藏的帖子列表'],
        ['role', 'Enum (user/admin)', '用户角色（默认user）'],
        ['isBanned', 'Boolean', '是否被封禁'],
        ['createdAt / updatedAt', 'Date', '时间戳（自动管理）'],
    ]
)

add_h2('5.2 Post（帖子模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['title', 'String (必填)', '帖子标题'],
        ['content', 'String (必填)', '帖子正文内容'],
        ['author', 'ObjectId → User', '发帖用户'],
        ['category', 'Enum', '分类：阵容推荐/装备攻略/运营思路/杂谈/求助'],
        ['tags', '[String]', '标签数组'],
        ['media', '[{url, type, originalName}]', '媒体文件（图片/视频）'],
        ['likes', '[ObjectId → User]', '点赞用户列表'],
        ['favorites', '[ObjectId → User]', '收藏用户列表'],
        ['views', 'Number', '浏览量'],
        ['isPinned', 'Boolean', '是否置顶'],
        ['status', 'Enum', '状态：pending/published/rejected/draft/deleted'],
        ['rejectReason', 'String', '审核拒绝原因'],
        ['createdAt / updatedAt', 'Date', '时间戳'],
    ]
)

add_h2('5.3 Comment（评论模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['content', 'String (必填)', '评论内容'],
        ['author', 'ObjectId → User', '评论用户'],
        ['post', 'ObjectId → Post', '所属帖子'],
        ['parentComment', 'ObjectId → Comment', '父评论（嵌套回复，可为null）'],
        ['likes', '[ObjectId → User]', '点赞用户列表'],
    ]
)

add_h2('5.4 Lineup（阵容模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['title', 'String (必填)', '阵容名称'],
        ['description', 'String', '阵容描述'],
        ['author', 'ObjectId → User', '作者'],
        ['heroes', '[{heroId, heroName, star, items}]', '阵容英雄（含星级和装备）'],
        ['positioning', 'String', '站位信息'],
        ['likes', '[ObjectId → User]', '点赞列表'],
        ['views', 'Number', '浏览量'],
        ['tags', '[String]', '标签'],
        ['comments', '[{author, content, createdAt}]', '内嵌评论'],
        ['status', 'Enum (published/draft)', '发布状态'],
    ]
)

add_h2('5.5 Message（私信模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['sender', 'ObjectId → User', '发送者'],
        ['receiver', 'ObjectId → User', '接收者'],
        ['content', 'String (必填)', '消息内容'],
        ['isRead', 'Boolean', '是否已读'],
        ['isMutualFollow', 'Boolean', '是否互关时发送'],
        ['firstContactMsg', 'Boolean', '是否为首条联系消息'],
    ]
)

add_h2('5.6 Follow（关注模型）')
doc.add_paragraph('字段：follower (关注者, ObjectId → User)、following (被关注者, ObjectId → User)。联合唯一索引确保不重复关注。')

add_h2('5.7 Block（拉黑模型）')
doc.add_paragraph('字段：blocker (拉黑者, ObjectId → User)、blocked (被拉黑者, ObjectId → User)。联合唯一索引确保不重复拉黑。')

add_h2('5.8 MatchRecord（战绩模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['user', 'ObjectId → User', '所属用户'],
        ['placement', 'Number (1-8)', '排名'],
        ['mode', 'Enum', '模式：ranked/normal/double/hyper_roll'],
        ['traits', '[String]', '使用的羁绊'],
        ['units', '[{champion, star, items}]', '使用的英雄'],
        ['note', 'String', '备注'],
        ['gameDuration', 'Number', '对局时长（秒）'],
        ['playedAt', 'Date', '对局时间'],
    ]
)

add_h2('5.9 Feedback（反馈模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['type', 'Enum (必填)', '类型：bug/feature/improvement/other'],
        ['title', 'String (必填)', '反馈标题'],
        ['description', 'String (必填)', '反馈描述'],
        ['author', 'ObjectId → User', '提交用户'],
        ['status', 'Enum', '状态：pending/processing/resolved/closed'],
        ['adminReply', 'String', '管理员回复'],
        ['priority', 'Enum', '优先级：low/medium/high'],
    ]
)

add_h2('5.10 Announcement（公告模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['title', 'String (必填)', '公告标题'],
        ['content', 'String (必填)', '公告内容'],
        ['type', 'Enum', '类型：normal/important/urgent'],
        ['author', 'ObjectId → User', '发布者'],
        ['isPinned', 'Boolean', '是否置顶'],
        ['isActive', 'Boolean', '是否激活'],
        ['viewCount', 'Number', '浏览量'],
    ]
)

add_h2('5.11 GameData（游戏数据模型）')
add_table(
    ['字段', '类型', '说明'],
    [
        ['version', 'String (必填)', '游戏版本号'],
        ['type', 'Enum (必填)', '类型：team/equipment/synergy/hero'],
        ['data', 'Mixed (必填)', '游戏数据内容（灵活结构）'],
        ['source', 'String', '数据来源'],
        ['isActive', 'Boolean', '是否激活'],
    ]
)

doc.add_page_break()

# ====================================================================
#  第六章：游戏数据系统
# ====================================================================
add_h1('六、游戏数据系统')

add_h2('6.1 数据架构')
doc.add_paragraph(
    '游戏数据采用"后端优先 + 本地回退"的混合加载策略。页面初始化时使用本地硬编码数据零等待渲染，'
    '同时异步从后端拉取最新版本数据。成功获取后端数据时覆盖本地缓存，获取失败时自动回退使用本地数据，'
    '确保在任何情况下页面都能正常展示。动态加载服务通过gameDataService统一管理，支持按版本和数据类型的细化控制。'
)

add_h2('6.2 英雄数据')
doc.add_paragraph(
    '系统内置S8"怪兽入侵"赛季全部59个英雄的完整数据，按费用分为5组：'
)
add_table(
    ['费用', '数量', '英雄名称'],
    [
        ['1费', '13个', '加里奥、波比、艾希、雷克顿、璐璐、拉克丝、内瑟斯、普朗克、塞拉斯、泰隆、悟空、凯尔、布里茨'],
        ['2费', '13个', '安妮、卡蜜尔、德拉文、伊泽瑞尔、菲奥娜、金克丝、李青、墨菲特、芮尔、希维尔、蔚、亚索、悠米'],
        ['3费', '13个', '乐芙兰、阿利斯塔、科加斯、贾克斯、卡莎、尼菈、拉莫斯、锐雯、赛娜、娑娜、塔莉垭、维克兹、佐伊'],
        ['4费', '12个', '索拉卡、厄运小姐、奥瑞利安·索尔、卑尔维斯、艾克、萨米拉、瑟庄妮、莎弥拉、赛恩、塔姆、佛耶戈、扎克'],
        ['5费', '8个', '厄加特、费德提克、迦娜、蕾欧娜、莫德凯撒、努努、辛德拉、厄斐琉斯'],
    ]
)

add_h2('6.3 羁绊数据（27种）')
doc.add_paragraph(
    '包含14种特质羁绊和7种职业羁绊：'
)
doc.add_paragraph('特质羁绊：地下魔盗团、管理员程序、怪兽、星之守护者、小天才、灵能使、爱心使者、'
    '黑客、源计划：激光特工、战斗机甲、福牛守护者、超级英雄、平民英雄、堕落使者')
doc.add_paragraph('职业羁绊：斗士、护卫、精英战士、情报特工、决斗大师、枪手、秘术卫士')

add_h2('6.4 装备数据（45件）')
doc.add_paragraph(
    '9件基础装备：暴风大剑、反曲之弓、无用大棒、女神之泪、锁子甲、负极斗篷、巨人腰带、'
    '拳套、金铲铲。36件合成装备由两件基础装备组合而成，每件装备包含完整的属性描述和合成配方。'
)

add_h2('6.5 阵容数据')
doc.add_paragraph(
    '系统内置10套本地热门阵容和7套完整详情阵容（含T0/T1分级）。每套阵容包含：阵容概述、'
    '核心羁绊、棋子搭配（标注主C/主坦/副C/控制/功能/治疗角色）、装备推荐（主C/副C/主坦的必备与备选）、'
    '运营思路（前期/中期/后期三阶段）、海克斯强化推荐、优劣势分析和实战技巧。'
)

add_h2('6.6 卡池概率引擎')
doc.add_paragraph(
    '卡池概率计算基于真实的S8赛季卡池参数。每种英雄卡池张数：1费29张、2费22张、3费18张、4费12张、5费10张。'
    '刷牌概率按等级分布，核心概率计算使用以下数学模型：'
)
items = [
    '单格概率：超几何分布 P = 剩余张数 / 该费用总剩余张数 × 该费用在指定等级的出现概率',
    '刷新概率（至少1张）：P = 1 - (1 - 单格概率)^5（补事件法）',
    '预算概率（至少N张）：二项分布累积概率，使用二项式系数计算',
    '期望计算：二分查找法确定D到目标数量所需次数，输出期望值和50%/80%置信区间',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ====================================================================
#  第七章：AI辅助功能
# ====================================================================
add_h1('七、AI辅助功能详解')

add_h2('7.1 架构设计')
doc.add_paragraph(
    'AI辅助功能采用"多厂商适配 + 多路径分析"架构。通过aiAnalysis.js服务统一管理多个AI服务商的配置和调用。'
    '国内用户无需VPN即可使用通义千问（阿里云）和智谱AI服务。系统还支持OCR文字识别作为AI视觉分析的备用方案。'
)

add_h2('7.2 支持的AI服务商')
add_table(
    ['服务商', '模型', '端点', '说明'],
    [
        ['通义千问 (qwen)', 'qwen3-vl-plus', 'dashscope.aliyuncs.com', '国内可直接访问，多模态视觉模型'],
        ['智谱AI (zhipu)', 'glm-4v-flash', 'open.bigmodel.cn', '国内可直接访问，多模态视觉模型'],
        ['OpenAI', 'GPT-4 Vision', 'api.openai.com', '需要API Key和网络条件'],
        ['自定义', '用户配置', '用户自定义', '支持兼容OpenAI格式的自定义服务'],
    ]
)

add_h2('7.3 AI视觉分析流程')
doc.add_paragraph('AI视觉分析遵循以下流程：')
items = [
    '步骤1 - 画面捕获：通过浏览器getDisplayMedia API共享游戏窗口，从video元素截取帧（960px宽，JPEG质量0.6压缩优化）',
    '步骤2 - 关键区域提取：将全屏裁剪为4个关键区域（顶部回合数、右下血量+金币、左下等级、左侧羁绊列表），拼合为组合图',
    '步骤3 - AI发送：将组合图和超详细的系统提示词发送至视觉AI模型',
    '步骤4 - 结果解析：AI返回JSON格式的游戏状态数据，包含阶段、金币、血量、等级、激活羁绊、建议等',
    '步骤5 - 数据验证：校验数值范围（金币0-999、血量1-100、等级1-10）、格式和逻辑合理性',
    '步骤6 - 历史稳定：与最近5次分析结果比对，异常偏离时回退到历史稳定值（如血量使用众数机制）',
    '步骤7 - 面板展示：将分析结果展示在UI面板上，支持手动修正',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h2('7.4 AI提示词设计')
doc.add_paragraph(
    '系统内置了约100行的超详细提示词（Vision Analysis Prompt），包含以下关键信息：'
)
items = [
    'UI元素精确位置描述（金币右下角、血量右侧记分板、等级左下角、回合顶部中间、羁绊左侧、棋子底部）',
    '视觉区分规则（金币数字与场上其他数字的区分方法）',
    'S8完整英雄名单（59个，按费用分组，含羁绊归属）',
    '经济/利息计算规则（10/20/30/40/50金币断点）',
    '决策矩阵（金币×血量二维策略表）',
    '刷新概率表（Lv4-Lv9各费用概率）',
    '装备速查表（基础装备和合成公式）',
    '建议格式规范（必须包含具体数值和操作步骤）',
    'JSON输出格式示例',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

add_h2('7.5 OCR备用方案')
doc.add_paragraph(
    '当AI视觉分析不可用时，系统自动切换至OCR备用方案：使用Tesseract.js本地OCR引擎'
    '（支持中文+英文语言包 chi_sim+eng）对游戏画面6个关键区域分别进行文字识别，'
    '提取数字信息（通过正则匹配\\d+），然后将OCR识别的文字发送至DeepSeek文本模型'
    '（deepseek-v4-flash）进行分析并生成建议。识别区域坐标采用百分比定位，自适应不同分辨率。'
)

add_h2('7.6 安全与容错')
doc.add_paragraph(
    'AI服务包含完整的容错机制：API Key持久化在localStorage，支持连接测试验证；'
    '每次分析结果经过多层校验（数值范围、格式校验、历史一致性检查）；'
    '分析失败时保持上次有效结果，不显示错误信息给用户；'
    '统计数据跟踪分析次数和置信度评分。'
)

doc.add_page_break()

# ====================================================================
#  第八章：部署说明
# ====================================================================
add_h1('八、部署与运行说明')

add_h2('8.1 环境要求')
add_table(
    ['组件', '版本要求', '说明'],
    [
        ['Node.js', 'v16.0+', '推荐 v18 LTS'],
        ['MongoDB', 'v5.0+', '本地或远程实例'],
        ['npm', 'v8.0+', '包管理器'],
        ['操作系统', 'Windows/Linux/macOS', '跨平台支持'],
    ]
)

add_h2('8.2 快速启动')
doc.add_paragraph('1. 安装依赖：')
doc.add_paragraph('   cd tft-assistant\n   npm install\n   cd server && npm install', style='List Bullet')
doc.add_paragraph('2. 配置环境变量（server/.env）：')
doc.add_paragraph('   MONGODB_URI=mongodb://localhost:27017/tft_assistant\n   JWT_SECRET=your-secret-key\n   ADMIN_PASSWORD=your-admin-password\n   CLIENT_URL=http://localhost:5173', style='List Bullet')
doc.add_paragraph('3. 启动后端服务：')
doc.add_paragraph('   cd server && npm start    # 默认端口3000', style='List Bullet')
doc.add_paragraph('4. 启动前端开发服务器：')
doc.add_paragraph('   cd tft-assistant && npm run dev    # 默认端口5173', style='List Bullet')
doc.add_paragraph('5. 访问系统：')
doc.add_paragraph('   打开浏览器访问 http://localhost:5173', style='List Bullet')
doc.add_paragraph('')
doc.add_paragraph('注意：首次启动时系统会自动创建管理员账户（用户名：admin），密码为ADMIN_PASSWORD环境变量的值'
    '或随机生成的16字节hex字符串（控制台输出）。')

add_h2('8.3 生产构建')
doc.add_paragraph('前端构建：npm run build（输出至dist/目录）')
doc.add_paragraph('后端可直接运行server/server.js，通过Docker部署时可使用项目根目录的docker-compose.yml一键部署。')

add_h2('8.4 安全特性')
items = [
    'Helmet中间件：设置安全相关的HTTP头（XSS防护、内容安全策略等）',
    'CORS配置：仅允许指定前端域名跨域访问',
    '全局限流：15分钟内500次请求限制',
    '认证限流：登录/注册接口15分钟内20次限制（防暴力破解）',
    'JWT认证：无状态token，登录态有效期可配置',
    '密码加密：bcrypt加盐哈希存储',
    '文件上传限制：最多9个文件，单个最大100MB，仅允许图片和视频格式',
    '账号锁定：5次登录失败锁定30分钟',
    '内容审核：帖子需管理员审核通过后方可公开发布',
    '私有数据隔离：拉黑用户之间无法发送私信，非互关用户仅可发首条消息',
]
for item in items:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ── 尾页 ──
doc.add_paragraph('\n\n\n\n\n\n')
end = doc.add_paragraph()
end.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = end.add_run('— 文档结束 —')
r.font.size = Pt(14)
r.font.color.rgb = RGBColor(0x64, 0x74, 0x8b)

# 保存
doc.save(OUTPUT)
print(f"文档已生成: {OUTPUT}")
print(f"文件大小: {os.path.getsize(OUTPUT) / 1e3:.1f} KB")
