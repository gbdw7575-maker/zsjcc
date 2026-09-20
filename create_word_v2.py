#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成《掌上金铲铲 软件体系结构文档》Word 文档
基于 Kruchten 4+1 视图模型与体系选择矩阵法
严格遵循赵庆玲老师《软件体系结构》课程内容
"""

from docx import Document
from docx.shared import Pt, Cm, Inches, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
import os

# ─── 全局工具函数 ─────────────────────────────────────────────

def set_cell_font(cell, text, font_name='宋体', size=Pt(12), bold=False, alignment=WD_ALIGN_PARAGRAPH.LEFT):
    """设置单元格字体"""
    cell.text = ''
    p = cell.paragraphs[0]
    p.alignment = alignment
    run = p.add_run(text)
    run.font.name = font_name
    run._element.rPr.rFonts.set(qn('w:eastAsia'), font_name)
    run.font.size = size
    run.bold = bold


def add_paragraph(doc, text, font_name='宋体', size=Pt(12), bold=False,
                  alignment=WD_ALIGN_PARAGRAPH.JUSTIFY, first_indent=Cm(0.74),
                  line_spacing=1.5, space_after=Pt(6), space_before=Pt(0)):
    """添加正文段落"""
    p = doc.add_paragraph()
    p.alignment = alignment
    pf = p.paragraph_format
    pf.line_spacing = line_spacing
    pf.space_after = space_after
    pf.space_before = space_before
    if first_indent is not None:
        pf.first_line_indent = first_indent
    run = p.add_run(text)
    run.font.name = font_name
    run._element.rPr.rFonts.set(qn('w:eastAsia'), font_name)
    run.font.size = size
    run.bold = bold
    return p


def add_image(doc, image_path, width=Inches(5.5)):
    """在文档中插入图片（居中），图片与标题绑定不跨页"""
    if not os.path.exists(image_path):
        add_paragraph(doc, f'[图片未找到: {image_path}]', font_name='宋体', size=Pt(10), alignment=WD_ALIGN_PARAGRAPH.CENTER, first_indent=None)
        return
    # 图片段落
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf = p.paragraph_format
    pf.first_line_indent = Cm(0)
    pf.space_before = Pt(14)
    pf.space_after = Pt(2)
    pf.keep_with_next = True   # 图片和标题不分离
    run = p.add_run()
    run.add_picture(image_path, width=width)


def add_figure_caption(doc, caption_text):
    """添加图片标题（居中，黑体小字），与图片绑定"""
    p = add_paragraph(doc, caption_text, font_name='黑体', size=Pt(10), bold=True,
                      alignment=WD_ALIGN_PARAGRAPH.CENTER, first_indent=None,
                      space_before=Pt(0), space_after=Pt(14))
    p.paragraph_format.keep_with_next = True   # 标题和下文不分离
    return p


def add_heading_custom(doc, text, level=1):
    """添加自定义标题（黑体）"""
    if level == 0:
        # Title
        size_map = {0: Pt(22), 1: Pt(22), 2: Pt(16), 3: Pt(14)}
    else:
        size_map = {1: Pt(22), 2: Pt(16), 3: Pt(14)}
    size = size_map.get(level, Pt(14))
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if level <= 1 else WD_ALIGN_PARAGRAPH.LEFT
    pf = p.paragraph_format
    pf.line_spacing = 1.5
    pf.space_before = Pt(18) if level <= 2 else Pt(12)
    pf.space_after = Pt(12)
    pf.first_line_indent = Cm(0)
    run = p.add_run(text)
    run.font.name = '黑体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
    run.font.size = size
    run.bold = True
    return p


def add_sub_heading(doc, text, level=3):
    """添加子标题 14pt 黑体"""
    return add_heading_custom(doc, text, level)


def add_section_heading(doc, text):
    """添加节标题 16pt 黑体"""
    return add_heading_custom(doc, text, level=2)


def add_chapter_heading(doc, text):
    """添加章标题 22pt 黑体 居中"""
    return add_heading_custom(doc, text, level=1)


def add_page_break(doc):
    """添加分页符"""
    doc.add_page_break()


def setup_page(doc):
    """设置页面格式"""
    for section in doc.sections:
        section.top_margin = Cm(2.54)
        section.bottom_margin = Cm(2.54)
        section.left_margin = Cm(2.54)
        section.right_margin = Cm(2.54)


def add_footer_page_numbers(doc):
    """在页脚添加页码"""
    for section in doc.sections:
        footer = section.footer
        footer.is_linked_to_previous = False
        p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        # 添加 "第 页" 格式
        run1 = p.add_run('第 ')
        run1.font.name = '宋体'
        run1._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
        run1.font.size = Pt(9)
        # PAGE field
        fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
        run_page = p.add_run()
        run_page._r.append(fldChar1)
        instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
        run_page._r.append(instrText)
        fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
        run_page._r.append(fldChar2)
        run2 = p.add_run(' 页')
        run2.font.name = '宋体'
        run2._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
        run2.font.size = Pt(9)


def add_table(doc, headers, rows, col_widths=None):
    """添加表格到文档"""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Table Grid'
    # 表头
    for i, h in enumerate(headers):
        set_cell_font(table.rows[0].cells[i], h, font_name='黑体', size=Pt(10),
                      bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER)
    # 数据行
    for r, row in enumerate(rows):
        for c, val in enumerate(row):
            set_cell_font(table.rows[r + 1].cells[c], str(val), font_name='宋体',
                          size=Pt(9))
    doc.add_paragraph()  # 表后空行
    return table


def add_bullet(doc, text, level=0):
    """添加带首行缩进的要点段落"""
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.line_spacing = 1.5
    pf.space_after = Pt(2)
    indent = Cm(0.74 + level * 0.74)
    pf.left_indent = indent
    pf.first_line_indent = Cm(-0.37)
    run = p.add_run('• ' + text)
    run.font.name = '宋体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    run.font.size = Pt(11)
    return p


# ─── 文档构建 ──────────────────────────────────────────────────

def build_document():
    doc = Document()

    # ─── 图表目录 ───
    DIAGRAMS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'diagrams')

    # 设置默认字体
    style = doc.styles['Normal']
    style.font.name = '宋体'
    style._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    style.font.size = Pt(12)
    style.paragraph_format.line_spacing = 1.5

    # ─── 封面页 ───
    for _ in range(6):
        doc.add_paragraph()

    # 主标题
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('掌上金铲铲 — 游戏辅助平台')
    run.font.name = '黑体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
    run.font.size = Pt(28)
    run.bold = True

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = p2.add_run('软件体系结构文档')
    run2.font.name = '黑体'
    run2._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
    run2.font.size = Pt(26)
    run2.bold = True

    doc.add_paragraph()
    doc.add_paragraph()

    cover_lines = [
        '基于 Kruchten 4+1 视图模型与体系选择矩阵法',
        '',
        '课程：软件体系结构',
        '授课教师：赵庆玲',
        '院系：南京理工大学计算机科学与工程学院',
        '',
        '日期：2026年6月'
    ]
    for line in cover_lines:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(line)
        run.font.name = '宋体'
        run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
        run.font.size = Pt(14)
    add_page_break(doc)

    # ─── 目录页 ───
    add_heading_custom(doc, '目  录', level=0)
    toc_items = [
        ('第一章  项目概述', 3),
        ('    1.1  项目背景', 0),
        ('    1.2  项目目标', 0),
        ('    1.3  技术选型', 0),
        ('    1.4  项目范围', 0),
        ('第二章  软件体系结构概述', 3),
        ('    2.1  软件体系结构的定义', 0),
        ('    2.2  软件体系结构的意义', 0),
        ('第三章  软件体系结构生命周期', 3),
        ('    3.1  需求分析阶段', 0),
        ('    3.2  体系结构设计阶段', 0),
        ('    3.3  体系结构实现阶段', 0),
        ('    3.4  体系结构验证与维护阶段', 0),
        ('第四章  4+1视图模型', 6),
        ('    4.1  逻辑视图', 0),
        ('    4.2  过程视图', 0),
        ('    4.3  开发视图', 0),
        ('    4.4  物理视图', 0),
        ('    4.5  场景视图', 0),
        ('第五章  体系结构风格分析', 3),
        ('    5.1  项目采用的体系结构风格', 0),
        ('    5.2  混合体系结构风格的设计原理', 0),
        ('第六章  体系结构风格选择——体系选择矩阵法', 2),
        ('    6.1  质量需求分析', 0),
        ('    6.2  体系选择矩阵计算', 0),
        ('    6.3  结果分析与最终选择', 0),
        ('第七章  软件体系结构质量评估', 2),
        ('    7.1  性能评估', 0),
        ('    7.2  安全性评估', 0),
        ('    7.3  可用性评估', 0),
        ('    7.4  可维护性评估', 0),
        ('    7.5  可靠性评估', 0),
        ('    7.6  可扩展性评估', 0),
        ('第八章  体系结构的设计与实现', 2),
        ('    8.1  设计原则的应用', 0),
        ('    8.2  体系结构面临的威胁与对策', 0),
        ('第九章  总结与展望', 1),
        ('    9.1  项目总结', 0),
        ('    9.2  创新点', 0),
        ('    9.3  未来展望', 0),
        ('参考文献', 0),
    ]
    for item, pages in toc_items:
        p = doc.add_paragraph()
        pf = p.paragraph_format
        pf.line_spacing = 1.8
        pf.first_line_indent = Cm(0)
        run = p.add_run(item)
        run.font.name = '宋体'
        run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
        run.font.size = Pt(11)
        run.bold = (pages > 0)
    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第一章：项目概述
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第一章  项目概述')

    # 1.1
    add_section_heading(doc, '1.1  项目背景')

    add_paragraph(doc, '《金铲铲之战》是由腾讯游戏基于《英雄联盟》IP开发的一款自走棋策略手游，自上线以来迅速积累了庞大的用户群体。该游戏的核心玩法是玩家在八人匹配对局中，通过购买英雄、搭配阵容和合成装备，在自动战斗的机制下与对手展开博弈，最终以存活至最后的玩家为胜者。游戏融合了策略规划、概率计算、经济管理和即时决策等多种元素，对玩家的综合素质要求极高。')

    add_paragraph(doc, 'S8赛季"怪兽入侵"是《金铲铲之战》的一个重要赛季版本，该赛季引入了全新的"怪兽"羁绊体系、英雄威胁机制（Hero Augment）以及大量新增的棋子和装备组合。相较于前序赛季，S8赛季的策略深度和复杂度进一步提升，玩家面临的核心痛点主要体现在以下几个方面：')

    add_paragraph(doc, '第一，阵容选择困难。S8赛季拥有超过60个英雄棋子和数十种羁绊组合，玩家在面对不断变化的局势时，需要快速判断当前最适合的阵容方向。对于新手玩家和休闲玩家而言，仅凭记忆和经验难以掌握所有可选阵容的优劣和过渡节奏。')

    add_paragraph(doc, '第二，装备合成路径不清晰。装备系统是自走棋游戏中极为关键的胜负手，正确的装备分配可以显著提升阵容战斗力。然而，游戏中装备的合成路径较为隐蔽，玩家若不借助外部工具，很难在紧张的回合内做出最优的装备分配决策。')

    add_paragraph(doc, '第三，卡池概率计算复杂。游戏中的卡池采用共享池机制，不同费用英雄的数量和出现概率随着玩家的等级提升而动态变化。玩家在决定是否升级或刷新商店时，需要评估目标英雄的出现概率，这涉及到条件概率和期望值的精确计算，对于大多数玩家而言是一项认知负担。')

    add_paragraph(doc, '第四，对局决策压力大。每一回合仅有约30秒的准备时间，玩家需要在此期间完成购买英雄、调整站位、分配装备、评估经济等多项操作。在高分段对局中，信息过载和时间压力是导致决策失误的主要原因。')

    add_paragraph(doc, '市面上的《金铲铲之战》辅助工具存在明显的功能单一化问题。部分工具仅提供阵容推荐功能，缺乏实时的对局指导能力；部分工具仅展示装备合成配方，不具备阵容模拟和概率追踪功能；还有部分社区论坛型的工具，内容质量参差不齐，缺乏系统化的数据支撑。这些工具之间相互孤立，用户需要频繁切换多个应用，严重影响了使用体验和对局效率。')

    add_paragraph(doc, '正是基于以上背景和痛点分析，我们提出了"掌上金铲铲"这一综合性游戏辅助平台的构想。该平台旨在整合阵容模拟、装备图鉴、概率追踪、经济计算等基础辅助功能，创造性地引入人工智能视觉大模型实现实时的对战局面分析和策略指导，并搭建社区系统以促进玩家间的经验交流和内容分享。通过这一站式解决方案，我们希望为各层次的《金铲铲之战》玩家提供全方位、智能化的游戏辅助体验。')

    # 1.2
    add_section_heading(doc, '1.2  项目目标')

    add_paragraph(doc, '"掌上金铲铲"项目的总体目标是构建一个功能完备的全栈Web应用程序，为《金铲铲之战》玩家提供一站式的游戏辅助服务。项目目标可以从功能目标和技术目标两个维度进行阐述。')

    add_paragraph(doc, '在功能目标方面，本项目计划实现以下核心功能模块：')

    add_paragraph(doc, '（1）阵容模拟器。提供可视化的棋盘界面，允许玩家自由拖拽英雄棋子到8×7的棋盘格位上，系统自动计算当前阵容所激活的羁绊效果及其加成的具体数值。玩家可以保存、编辑和分享自己设计的阵容方案，也可以在社区浏览和学习其他高分玩家分享的阵容配置。阵容模拟器支持按英雄费用、种族和职业进行筛选，并提供详细的过渡阵容建议。')

    add_paragraph(doc, '（2）装备合成图鉴。以图形化的方式展示所有基础装备和合成装备的属性、合成路径和推荐使用英雄。玩家可以通过点击任意基础装备查看其向上合成的全部可能性，也可以通过点击任意成品装备查看其所需的合成素材。系统将根据当前主流数据自动标注热门装备和版本强势的装备组合。')

    add_paragraph(doc, '（3）卡池概率追踪器。实时追踪对局中各费用英雄的剩余数量，基于共享卡池的数学模型计算每位玩家抽取到目标英雄的概率。当玩家在模拟或实际对局中观察到其他玩家的阵容信息时，系统能够动态更新概率估计，为玩家的阵容选择提供数据支持。')

    add_paragraph(doc, '（4）经济计算器。根据当前回合数、连胜/连败状态、利息阈值等参数，自动计算最优的经济运营策略。系统帮助玩家规划升级和刷新商店的时机，在保证经济健康的前提下最大化战斗力提升的效率。')

    add_paragraph(doc, '（5）AI实时对战指导。本项目最具创新性的功能是引入大语言视觉模型（LVLM）进行实时的对战局面分析。通过浏览器端的屏幕截图捕获功能，系统定期截取玩家的游戏画面，将图像发送至后端服务器，后端调用通义千问qwen3-vl-plus或智谱AI glm-4v-flash等多模态大模型进行场景识别和策略分析，最终将建议结果返回前端展示。这一功能使玩家能够在紧张的回合中获得AI辅助的决策建议，包括阵容方向推荐、装备分配建议和站位优化方案。')

    add_paragraph(doc, '（6）论坛社区系统。提供发帖、评论、点赞、收藏、关注等完整的社交功能，支持图文混排的攻略发布形式。社区设有按主题分类的板块结构，便于玩家根据自己的兴趣快速找到相关内容。')

    add_paragraph(doc, '（7）用户管理与内容审核。实现完整的用户注册、登录、个人信息管理功能，采用JWT（JSON Web Token）进行无状态的身份认证以保证系统的安全性和可扩展性。同时，为了维护社区的内容质量，系统为管理员提供了内容审核、用户管理和数据统计功能。')

    add_paragraph(doc, '在技术目标方面，本项目追求以下设计目标：全栈JavaScript技术栈以降低开发人员的学习成本和提升团队协作效率；前后端完全分离的架构以提高系统的可维护性和可部署性；Docker容器化部署以确保开发环境和生产环境的一致性；RESTful API规范以保证接口的清晰性和可扩展性；以及响应式Web设计以确保在不同屏幕尺寸的设备上均能提供良好的用户体验。')

    # 1.3
    add_section_heading(doc, '1.3  技术选型')

    add_paragraph(doc, '技术选型是软件体系结构设计的前置环节，合理的技术栈选择直接影响项目的开发效率、运行性能和长期可维护性。本项目在充分评估功能需求和非功能需求的基础上，做出了以下技术选型决策。')

    add_paragraph(doc, '前端技术栈方面，本项目选择Vue 3 Composition API作为核心框架。Vue 3的响应式系统和组合式API提供了比Vue 2更好的逻辑复用能力和TypeScript支持，其基于Proxy的响应式实现也带来了显著的性能提升。构建工具选择Vite 5，它利用原生ES模块的按需编译机制，实现了极速的冷启动和热模块替换（HMR），极大地改善了开发体验。UI组件库采用Element Plus，它是Element UI的Vue 3版本，提供了丰富的企业级组件生态，涵盖了表单、表格、对话框、导航等常用界面元素，有助于快速构建一致性的用户界面。同时引入Tailwind CSS作为原子化CSS框架，提供灵活的低层级样式控制能力，与Element Plus形成互补。状态管理使用Pinia，它是Vue官方推荐的状态管理库，相比Vuex具有更好的TypeScript支持和更简洁的API设计。路由管理使用Vue Router 4，支持基于路由的代码分割和导航守卫。')

    add_paragraph(doc, '后端技术栈方面，选择Express 4.18作为Web应用框架。Express是Node.js生态中最成熟和广泛使用的Web框架，拥有庞大的中间件生态系统和丰富的社区资源。其非阻塞I/O模型和事件驱动架构天然适合处理高并发的HTTP请求和WebSocket连接。数据库采用MongoDB，配合Mongoose ODM进行数据建模和操作。MongoDB的文档存储模型与JavaScript对象具有天然的亲和性，其灵活的模式（Schema）设计也非常适合游戏数据这类结构变化频繁的领域。MongoDB的聚合管道功能可以高效地完成数据统计和报表生成需求。')

    add_paragraph(doc, '实时通信方面，采用Socket.IO库在WebSocket协议基础上提供可靠的实时双向通信能力。Socket.IO内置了自动重连、心跳检测、房间管理和广播等功能，大大降低了实时通信功能的开发复杂度。')

    add_paragraph(doc, 'AI集成方面，本项目同时接入阿里云通义千问qwen3-vl-plus和智谱AI glm-4v-flash两个视觉大模型。通义千问qwen3-vl-plus在中文场景理解和多模态推理方面表现优异，适合处理游戏画面的复杂分析任务；智谱AI glm-4v-flash以更低的延迟和成本提供基础的多模态理解能力，适合作为快速响应的备选方案。双模型架构不仅提供了智能路由和负载均衡的可能，也提高了AI分析服务的整体可靠性。此外，项目还集成了Tesseract.js用于游戏画面中的数字OCR识别，以辅助AI模型进行更精确的数值分析。')

    add_paragraph(doc, '部署方面，采用Docker Compose进行多容器编排，将前端（Nginx静态服务）、后端（Node.js Express应用）和数据库（MongoDB）分别封装为独立的容器。Nginx作为反向代理服务器，处理静态资源分发和API请求转发，同时提供Gzip压缩、缓存控制和SSL终端等企业级功能。Docker容器化部署确保了开发、测试和生产环境的高度一致性，避免了"在我机器上可以运行"的经典问题。')

    # 1.4
    add_section_heading(doc, '1.4  项目范围')

    add_paragraph(doc, '本项目的开发范围聚焦于面向《金铲铲之战》S8赛季"怪兽入侵"的Web端游戏辅助平台。项目包含22个页面视图，涵盖用户端的前台功能页面和管理端的后台管理页面。前端页面包括但不限于：首页（热门阵容和攻略推荐）、阵容库（按羁绊和费用筛选浏览）、阵容详情（棋盘展示、站位图、装备分配）、阵容模拟器（交互式拖拽编辑）、装备图鉴（合成路径树状展示）、概率计算器（卡池概率和期望值计算）、经济计算器（回合规划和运营建议）、AI对战指导（实时画面分析和策略建议）、社区广场（帖子列表和板块分类）、帖子详情（图文内容和评论区）、用户主页（个人资料和发布历史）、设置页面（主题切换和账号管理）以及多个管理后台页面。')

    add_paragraph(doc, '后端系统对外暴露12组RESTful API接口，分别服务于用户认证、阵容管理、装备数据、英雄数据、AI分析、社区内容、评论系统、用户关注、消息通知、管理审核、数据统计和系统配置等业务领域。数据库设计了10个核心数据模型（Mongoose Schema）：User（用户）、Hero（英雄）、Equipment（装备）、Synergy（羁绊）、TeamLineup（阵容方案）、Post（帖子）、Comment（评论）、Follow（关注关系）、Message（私信消息）和Announcement（系统公告）。')

    add_paragraph(doc, '项目的部署方式为Docker容器化部署，通过docker-compose.yml编排三个服务容器和一个自定义桥接网络。系统面向的主要用户群体为《金铲铲之战》的玩家，预计同时在线用户数为中小规模（数百人级别），服务器资源的配置以满足流畅的响应体验为基准。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第二章：软件体系结构概述
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第二章  软件体系结构概述')

    # 2.1
    add_section_heading(doc, '2.1  软件体系结构的定义')

    add_paragraph(doc, '根据赵庆玲老师《软件体系结构》课程第1章的讲授，软件体系结构（Software Architecture）是软件系统的高层抽象，它描述了系统由哪些构件（Component）组成、构件之间的关系（Relationship）以及它们之间如何交互（Interaction）。软件体系结构不仅仅是代码的组织方式，更是一组关于系统组织的重要决策，这些决策包括构成系统的结构元素及其接口的选择、这些元素在协作中的行为、这些结构和行为元素组合成更大子系统的方式，以及指导这种组织的体系结构风格。')

    add_paragraph(doc, '针对"掌上金铲铲"项目，我们按照上述定义，对其体系结构的三个核心要素——构件、连接件和约束——进行了系统化的梳理和定义。')

    add_paragraph(doc, '本项目的构件（Component）主要包括以下几类：第一，Vue组件（Vue Components），它们是前端用户界面的基本构造单元，每个Vue组件封装了特定的视图逻辑和表现样式，如阵容棋盘组件（BoardView.vue）、英雄卡片组件（HeroCard.vue）、装备图标组件（EquipmentIcon.vue）等；第二，Express控制器（Express Controllers），它们是后端业务逻辑的处理单元，每个控制器负责管理一类资源的CRUD操作和业务规则，如阵容控制器（lineupController.js）、装备控制器（equipmentController.js）、社区控制器（postController.js）等；第三，Mongoose模型（Mongoose Models），它们定义了数据实体的结构、验证规则和数据库操作方法，如Hero模型、Equipment模型、User模型等；第四，Pinia Store（状态仓库），它们管理前端全局状态并提供响应式的数据访问接口，如阵容仓库（useLineupStore）、用户仓库（useUserStore）、AI分析仓库（useAIStore）等。')

    add_paragraph(doc, '本项目的连接件（Connector）主要包括以下几类：第一，REST API调用，前端通过Axios HTTP客户端向后端发送符合RESTful规范的请求，包括GET（获取资源）、POST（创建资源）、PUT（更新资源）和DELETE（删除资源）等操作，这是系统中最主要的通信机制；第二，Socket.IO事件，前端和后端之间建立持久的WebSocket连接，用于实现AI分析结果的实时推送、私信消息的即时送达和在线状态的同步更新；第三，Vue Router路由，管理前端单页应用（SPA）内不同视图之间的导航跳转，通过路由参数传递页面间的上下文信息；第四，Props和Events机制，在Vue组件树的父子组件之间进行数据传递和事件通信，实现了组件的松耦合协作。')

    add_paragraph(doc, '本项目的约束（Constraint）是指导系统设计和演化的核心规则，主要包括：前后端完全分离的架构约束，前端Vue SPA和后端Express API服务器各自独立开发、独立部署；JWT无状态认证约束，所有需要身份验证的API请求必须在HTTP头中携带有效的JWT令牌；分层架构约束，前端内部按照Views→Stores→Services→Data的四层架构严格组织，后端内部按照Routes→Controllers→Models→Middleware的四层架构严格组织，层间只能由上至下单向调用。')

    # 2.2
    add_section_heading(doc, '2.2  软件体系结构的意义')

    add_paragraph(doc, '在软件工程的实践中，一个经过精心设计的软件体系结构对整个软件系统的成功具有决定性意义。对于"掌上金铲铲"这样一个涉及多个子系统、多种技术栈和复杂交互模式的项目而言，良好的体系结构设计更是在以下多个方面产生了重要价值。')

    add_paragraph(doc, '第一，支持多人协作开发。本项目的开发涉及前端开发者、后端开发者、数据库管理者和AI集成工程师等多个角色。清晰的体系结构定义了每个子系统的边界和接口契约，使得不同开发者可以并行工作而不会相互干扰。例如，前端开发者只需关注Vue组件和Pinia Store的实现，而后端开发者只需关注Express控制器和Mongoose模型的设计，双方通过事先约定的RESTful API接口文档（如Swagger/OpenAPI规范）进行协作。这种基于接口契约的协作模式极大提升了团队的开发效率。')

    add_paragraph(doc, '第二，便于功能扩展。"掌上金铲铲"作为一个游戏辅助平台，面临着一个特殊的挑战——游戏每个赛季都会进行大规模的版本更新，引入新的英雄、羁绊和装备。如果体系结构设计不合理，每次赛季更新都可能需要大量修改核心代码，导致高昂的维护成本。而通过将游戏数据模型与业务逻辑分离、将游戏数据以配置化的方式管理、将AI模型调用抽象为可插拔的接口，系统可以在不修改核心架构的情况下快速适配新的赛季内容。')

    add_paragraph(doc, '第三，保证系统质量属性。软件体系结构直接决定了系统的非功能性质量，包括性能、安全性、可用性、可维护性和可扩展性等。例如，前后端分离的架构使得前端静态资源可以通过CDN加速分发，后端API可以通过水平扩展应对流量增长；分层架构使得安全中间件可以统一应用于所有API路由；事件驱动的WebSocket通信使得AI分析结果可以近乎实时地推送给用户。这些质量属性的实现并不是在编码阶段临时添加的，而是在体系结构设计阶段就已经被充分考虑和规划的。')

    add_paragraph(doc, '第四，降低维护成本。在软件生命周期中，维护阶段通常占据了总成本的60%以上。一个条理清晰的体系结构使得新加入项目的开发者能够快速理解系统的整体布局和关键模块的职责，从而降低学习曲线和培训成本。当需要定位和修复Bug时，开发者可以根据体系结构文档迅速缩小问题排查的范围。当需要优化性能或增强安全性时，开发者可以根据体系结构中的约束和规则，准确判断修改的影响范围，避免引入新的问题。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第三章：软件体系结构生命周期
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第三章  软件体系结构生命周期')

    add_paragraph(doc, '根据赵庆玲老师《软件体系结构》课程第2章的讲授，软件体系结构并非一成不变的静态蓝图，而是随着软件生命周期不断演化的动态实体。软件体系结构的生命周期包括需求分析、体系结构设计、体系结构实现、体系结构验证与维护四个主要阶段，每个阶段都有其独特的工作重点和产出物。以下结合"掌上金铲铲"项目的实际情况，逐一阐述这四个阶段。')

    # 3.1
    add_section_heading(doc, '3.1  需求分析阶段')

    add_paragraph(doc, '需求分析是软件体系结构生命周期的起点，其主要任务是从用户和利益相关者那里获取、分析和记录系统需求。在本项目中，需求分析工作从玩家痛点分析出发，进而提炼出功能需求规约和非功能需求定义。')

    add_paragraph(doc, '玩家痛点分析是需求获取的首要环节。项目团队通过调研《金铲铲之战》的主要玩家社群（如NGA论坛、贴吧、B站评论区等），收集了大量玩家反馈和诉求。通过对这些定性数据的归纳和整理，我们识别出了四个核心痛点：阵容选择困难（玩家难以记住和评估所有可选阵容）、装备合成路径不清晰（游戏内装备合成信息展示不够直观）、卡池概率计算复杂（概率推断需要精确的数学模型支撑）以及对局决策压力大（时间限制下的信息过载问题）。这些痛点构成了项目的需求基础。')

    add_paragraph(doc, '功能需求规约是将玩家痛点转化为可执行的软件功能规格的过程。针对阵容选择困难，我们规约了阵容模拟器功能，要求提供可视化棋盘编辑、羁绊自动计算、阵容保存和分享等能力。针对装备合成路径不清晰，我们规约了装备合成图鉴功能，要求以树状图的形式展示所有装备的合成关系。针对卡池概率计算复杂，我们规约了概率追踪器功能，要求基于共享卡池的数学模型进行实时概率计算。针对对局决策压力大，我们规约了AI实时对战指导功能，要求利用视觉大模型自动分析游戏画面并提供决策建议。此外，系统的非功能性需求包括：响应时间应在2秒以内（AI分析除外）、支持数百用户同时在线、JWT认证保障数据安全、响应式设计适配不同屏幕尺寸。')

    add_paragraph(doc, '在完成功能需求和非功能需求的规约后，项目团队形成了需求规格说明书（SRS），并以此作为后续体系结构设计阶段的工作输入。需求规格说明书明确了"系统应该做什么"和"系统应该做到什么程度"，为体系结构设计提供了明确的目标和约束。')

    # 3.2
    add_section_heading(doc, '3.2  体系结构设计阶段')

    add_paragraph(doc, '体系结构设计阶段是软件体系结构生命周期中最核心的阶段，其主要任务是将需求规格转化为系统的体系结构蓝图。在"掌上金铲铲"项目中，体系结构设计遵循了一个三步走的决策过程。')

    add_paragraph(doc, '第一步，选择合适的体系结构风格。项目团队在分析了系统的功能需求和非功能需求后，认为单一体系结构风格难以满足所有设计目标。具体而言，系统的整体组织需要B/S架构来支持浏览器端的便捷访问；代码组织需要分层架构来保证可维护性；前端界面需要MVVM模式来支持数据和视图的双向绑定；实时通信需要事件驱动架构来支持消息推送；AI分析流程需要管道-过滤器风格来支持阶段化处理；数据管理需要仓库风格来集中管理数据存储和访问。因此，项目的体系结构最终采用了"B/S架构+分层架构+MVVM+事件驱动+管道-过滤器+仓库风格"的混合体系结构风格。')

    add_paragraph(doc, '第二步，运用4+1视图模型进行多维度建模。4+1视图模型是Philippe Kruchten提出的软件体系结构描述方法，它从五个互补的视角来刻画软件系统的体系结构：逻辑视图描述系统的功能性分解和类结构；过程视图描述系统的并发性和运行时行为；开发视图描述代码的模块组织和层次关系；物理视图描述系统的部署拓扑和网络架构；场景视图通过关键用例串联上述四个视图。这五个视图共同构成了一幅完整的体系结构蓝图，不同视图服务于不同的利益相关者。')

    add_paragraph(doc, '第三步，运用体系选择矩阵法验证风格选择的合理性。体系选择矩阵法是一种基于质量需求的体系结构风格量化评估方法，它将每种候选风格针对每个质量需求维度的满足程度进行打分（1-5分），再乘以该质量需求的权重（0-4分），最终通过选择分（Σ权重×满足度）来量化评估每种风格的适合程度。在本项目中，我们通过体系选择矩阵验证了事件驱动风格（108分/135分）和客户-服务器风格（101分/135分）在项目中占据核心地位，从而确认了混合风格策略的合理性。')

    # 3.3
    add_section_heading(doc, '3.3  体系结构实现阶段')

    add_paragraph(doc, '体系结构实现阶段是将设计蓝图转化为可运行软件系统的过程。在本项目中，体系结构实现采用了以下技术路线：前端基于Vue 3 Composition API和Vite 5构建工具搭建单页应用（SPA），通过Vue Router管理路由导航，通过Pinia管理全局状态，通过Axios封装HTTP请求服务层；后端基于Express 4.18框架构建RESTful API服务器，通过Mongoose ODM操作MongoDB数据库；实时通信基于Socket.IO库实现WebSocket双向通信；AI集成通过封装统一的AI服务接口，支持通义千问qwen3-vl-plus和智谱AI glm-4v-flash两种视觉大模型的灵活切换；部署基于Docker Compose进行多容器编排，前端和后端分别打包为Docker镜像，通过Nginx进行反向代理。')

    add_paragraph(doc, '需要强调的是，体系结构实现并非简单地将设计"翻译"为代码。在实际编码过程中，开发团队不断发现和修正设计阶段的偏差。例如，在实际开发AI分析管道时，我们发现单帧图像的AI分析结果存在较大的波动性和误判率，因此在实现阶段引入了多帧交叉验证机制——连续捕获3帧以上的游戏画面，要求AI模型对每帧独立分析后，只有当连续多帧的分析结果一致时才输出建议。这一调整虽然不在原始设计的细节范围内，但它完全符合体系结构设计的原则（管道-过滤器风格中的FrameValidator过滤器），并在不改变体系结构大局的前提下显著提升了AI分析的可靠性。')

    # 3.4
    add_section_heading(doc, '3.4  体系结构验证与维护阶段')

    add_paragraph(doc, '体系结构验证与维护是保证软件系统持续满足需求、按预期运行的关键环节。在"掌上金铲铲"项目中，验证工作从三个维度展开。')

    add_paragraph(doc, '功能验证方面，项目团队编写了覆盖主要用户场景的功能测试用例，包括用户注册登录流程、阵容创建和编辑流程、AI分析完整管道、社区发帖评论流程等。通过执行这些测试用例，验证了系统的核心功能是否按照规约正确实现。')

    add_paragraph(doc, '性能验证方面，项目使用Apache JMeter工具模拟多用户并发访问场景，测试了API接口的响应时间和系统吞吐量。测试结果显示，在100并发用户的压力下，常规API请求的平均响应时间保持在200ms以内，AI分析请求（受外部API调用延迟影响）的平均响应时间在3000ms以内，满足设计目标。')

    add_paragraph(doc, '安全验证方面，项目对JWT认证机制进行了渗透测试，验证了未携带有效令牌的请求被正确拒绝；对恶意输入进行了XSS和SQL注入测试（尽管MongoDB天然对SQL注入免疫，但NoSQL注入仍需防范）；对敏感接口的限流机制进行了功能验证。')

    add_paragraph(doc, '在维护阶段，项目的体系结构表现出良好的适应性和可演化性。每次《金铲铲之战》新赛季上线后，运营人员只需更新数据库中的英雄、羁绊和装备数据文档，前端代码和后端逻辑无需任何修改即可适配新赛季的内容。当需要替换AI模型时（例如从通义千问切换到其他厂商的视觉大模型），只需实现新的AI服务适配器类并修改配置即可，无需改动核心的管道处理逻辑。当需要扩展新功能时（例如新增一个数据分析仪表盘），可以在现有的分层架构中按规范添加新的Route、Controller和Model，而不影响现有功能的正常运行。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第四章：4+1视图模型（核心章节）
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第四章  4+1视图模型')

    add_paragraph(doc, '4+1视图模型（The "4+1" View Model of Software Architecture）是由Philippe Kruchten于1995年在IEEE Software期刊上提出的软件体系结构描述框架，也是赵庆玲老师《软件体系结构》课程第12章的核心教学内容。该模型从五个互补的视角来描述软件系统的体系结构：逻辑视图（Logical View）、过程视图（Process View）、开发视图（Development View）、物理视图（Physical View）和场景视图（Scenarios）。前四个视图分别关注系统的功能分解、运行时行为、代码组织和部署拓扑，而场景视图（即"+1"）通过关键用例将四个视图串联起来，起到验证和沟通的作用。')

    add_paragraph(doc, '在本章中，我们将运用4+1视图模型对"掌上金铲铲"项目进行全面、深入的体系结构描述。每个视图小节均首先引用课件原文中的定义，然后结合本项目的具体设计展开详细分析。')

    # 4.1
    add_section_heading(doc, '4.1  逻辑视图')

    add_paragraph(doc, '赵庆玲老师在课件中明确指出："逻辑视图主要支持功能需求——系统应当向用户提供什么样的服务。从问题域出发，采用面向对象的方法，按照抽象、封装、继承的原则进行分解。"逻辑视图的核心任务是将系统的功能需求分解为一组关键抽象和它们之间的关系，通常以类图（Class Diagram）的形式呈现。逻辑视图面向的主要受众是最终用户和领域专家。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，我们采用了面向对象的分析方法，从问题域中识别出六大核心子系统，每个子系统包含一组紧密协作的类。')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'class_diagram.png'))
    add_figure_caption(doc, '图4-1a  逻辑视图 — 业务域类（用户、管理、棋盘、游戏数据）')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'class_diagram_social.png'))
    add_figure_caption(doc, '图4-1b  逻辑视图 — 社交与AI分析子系统')

    add_paragraph(doc, '第一个子系统是用户子系统。该子系统的核心类是User，其属性包括用户名（username）、邮箱（email）、加密后的密码哈希（passwordHash）、头像URL（avatar）、注册时间（createdAt）和最后登录IP（lastLoginIp）。Auth类负责处理用户认证逻辑，包括生成JWT Token（generateToken方法）、验证Token有效性（verifyToken方法）、以及Token的刷新（refreshToken方法）。User类的对象与多个TeamLineup、Post和Comment对象存在1对N的关联关系。')

    add_paragraph(doc, '第二个子系统是游戏数据子系统。该子系统包含了Hero（英雄）、Equipment（装备）、Synergy（羁绊）和Augment（英雄强化）四个核心类。Hero类的关键属性包括名称（name）、费用（cost，1-5）、种族列表（origins[]）、职业列表（classes[]）、技能描述（skillDescription）、最大法力值（maxMana）、起始法力值（startMana）和属性值（stats对象，包含HP、攻击力、护甲、魔抗、攻速等）。Hero类提供getDetail()方法返回完整信息，提供getSynergies()方法返回该英雄所属的所有羁绊。Equipment类描述了一件装备，其属性包括名称（name）、合成配方（components[]，指向两个基础装备）、属性加成（bonus对象）、推荐使用英雄（recommendedFor[]）以及图标路径（iconPath）。Equipment类提供getComponents()方法返回合成所需的两个基础装备对象，提供getCombinations()方法返回该基础装备能够合成的所有上级装备。Synergy类描述了一个羁绊效果，其属性包括名称（name）、类型（type，种族或职业）、激活所需棋子数列表（activationThresholds[]）、效果描述（effects[]，对应每个激活阈值的具体效果）。')

    add_paragraph(doc, '第三个子系统是棋盘子系统。该子系统是阵容模拟器功能的核心，包含Board、Cell和Chess三个类。Board类代表一个8×7的棋盘，其核心属性是一个二维Cell数组cells[8][7]，每个Cell可以放置一个Chess对象或为空。Board类提供了addChess(chess, row, col)方法在指定位置放置棋子，removeChess(row, col)方法移除指定位置的棋子，moveChess(fromRow, fromCol, toRow, toCol)方法移动棋子位置，以及calculateSynergies()方法遍历当前棋盘上所有棋子，统计并计算被激活的羁绊效果。Cell类表示棋盘上的一个格位，属性包括行号（row）、列号（col）和占据者（occupant，一个可选的Chess引用）。Chess类代表棋盘上的一个棋子实例，属性包括引用的Hero对象（hero）、星级（starLevel，1-3星）、携带的装备列表（equipments[]，最多3个）和所属的玩家ID（playerId）。每个Board对象包含28个Cell对象（4×7的有效格位），每个Chess对象对应1个Hero对象，且可以关联0-3个Equipment对象。')

    add_paragraph(doc, '第四个子系统是AI分析子系统。该子系统包含ScreenCapture、AIAnalyzer、FrameValidator和Suggestion四个核心类。ScreenCapture类封装了浏览器端的屏幕捕获逻辑，负责从canvas元素中获取游戏画面的图像数据（capture()方法）并进行JPEG压缩（compress()方法）。AIAnalyzer类负责调用外部大语言视觉模型的API，其analyze(imageData)方法将压缩后的图像和系统提示词发送给AI模型，并解析返回的JSON结构化分析结果。FrameValidator类实现了多帧交叉验证逻辑，它缓存最近N帧的分析结果，通过vote()方法判断是否存在一致性结论，filterNoise()方法过滤偶发的错误识别结果。Suggestion类封装了一条AI决策建议，其属性包括建议类型（type，如"阵容""装备""站位"）、置信度（confidence，0-1）、详细描述（description）和建议依据（reasoning）。')

    add_paragraph(doc, '第五个子系统是社交子系统。该子系统包含Post、Comment、Follow和Message四个核心类。Post类代表一篇社区帖子，属性包括标题（title）、正文内容（content）、作者（author，User引用）、创建时间（createdAt）、最后更新时间（updatedAt）、标签列表（tags[]）、点赞数（likeCount）、评论数（commentCount）和审核状态（status，枚举值：待审核/已发布/已驳回）。Comment类代表一条评论，属性包括内容（content）、作者（author）、所属帖子（post）和创建时间（createdAt）。Follow类表示用户之间的关注关系，包含follower（关注者）和followee（被关注者）两个User引用。Message类表示私信消息，包含发送者（sender）、接收者（receiver）、内容（content）、发送时间（sentAt）和是否已读（isRead）。Post 1对N Comment、User 1对N Follow关系的设计遵循了关系数据库的规范化原则。')

    add_paragraph(doc, '第六个子系统是管理子系统。该子系统包含Admin和Announcement类。Admin类继承自User类（体现了面向对象的继承原则），增加了管理权限级别（permissionLevel）和管理操作日志（actionLog[]）属性，提供了auditPost()、manageUser()和viewStatistics()等方法。Announcement类代表系统公告，属性包括标题（title）、内容（content）、发布时间（publishedAt）和有效期限（expiresAt）。')

    add_paragraph(doc, '为直观展示逻辑视图中的核心类模板，下面给出两个代表性类的详细结构描述。Hero类模板如下：类名Hero，公有属性包括name（String）、cost（Integer，1-5）、origins（Array of String）、classes（Array of String）、skillName（String）、skillDescription（String）、maxMana（Integer）、startMana（Integer）、stats（Object，包含hp、attack、defense、magicResist、attackSpeed）；公有方法包括constructor(data)从原始数据创建Hero实例、getDetail()返回格式化的英雄完整信息对象、getSynergies()返回包含该英雄的所有羁绊对象列表、toJSON()序列化为前端可展示的JSON数据。Board类模板如下：类名Board，公有属性包括rows（Integer=4，有效行数）、cols（Integer=7，有效列数）、cells（二维Cell数组，8行×7列）、name（String，棋盘名称）、ownerId（ObjectId，所属用户ID）；公有方法包括constructor(options)初始化空棋盘、addChess(chess, row, col)在指定位置放置棋子并自动更新羁绊计算、removeChess(row, col)移除棋子并更新羁绊、moveChess(fromRow, fromCol, toRow, toCol)移动棋子、calculateSynergies()遍历所有棋子，统计羁绊激活数量并返回羁绊效果列表、getActiveSynergies()返回当前激活的羁绊及其效果、clear()清空棋盘、toJSON()序列化为可保存和分享的数据格式。')

    # 4.2
    add_section_heading(doc, '4.2  过程视图')

    add_paragraph(doc, '赵庆玲老师在课件中定义："过程体系结构考虑的是一些非功能性的需求，诸如性能、可用性等。它所要面对的问题有并发、分布、系统的完整性、容错能力等。软件被分为独立的任务的集合。每个任务是一个独立的控制线程。"过程视图关注系统在运行时的动态行为，包括进程和线程的划分、任务之间的通信机制、同步和并发控制等。过程视图面向的主要受众是系统集成人员和运维工程师。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，我们将系统的运行时任务分解为以下四类主任务和三类辅助任务。')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'process_view.png'))
    add_figure_caption(doc, '图4-2  过程视图 — AI分析管道与数据加载流程')

    add_paragraph(doc, '第一类主任务是HTTP请求处理任务。该任务由Express框架的事件循环机制承载，利用Node.js的非阻塞I/O特性，以单线程事件循环的方式同时处理多个并发的HTTP请求。当一个HTTP请求到达时，Express的中间件链依次处理请求（解析Body、验证JWT、限流检查等），然后将请求路由到对应的Controller处理方法。如果Controller需要访问数据库（如查询阵容数据），则通过Mongoose发起异步的MongoDB查询，在等待数据库返回结果期间，事件循环不会阻塞而是继续处理其他请求。这种异步非阻塞的I/O模型使得单个Node.js进程可以高效地处理数百个并发连接，而不需要为每个请求创建独立的线程。')

    add_paragraph(doc, '第二类主任务是WebSocket实时通信任务。该任务由Socket.IO库管理，它在HTTP服务器上建立了独立的WebSocket升级通道。当客户端（浏览器）发起WebSocket连接时，Socket.IO服务器维护一个持久的双向连接，后续的消息推送和接收都通过这个通道进行，无需重复建立HTTP连接。Socket.IO内部使用事件循环来监听和分发消息事件，当服务器需要向某个客户端推送AI分析结果或私信消息时，通过emit()方法发送命名事件，客户端的对应事件监听器接收并处理。')

    add_paragraph(doc, '第三类主任务是AI分析管道任务。该任务是最复杂的过程任务，涉及多个异步处理阶段的流水线。AI分析管道由以下阶段依次串联：首先，浏览器端的ScreenCapture任务定期（默认每5秒）从canvas中捕获当前游戏画面，压缩为JPEG格式（质量参数0.7）；然后，压缩后的图像数据通过HTTP POST请求提交到后端的AI分析接口；后端接收到图像后，构造包含系统提示词和图像的API请求体，异步调用通义千问qwen3-vl-plus（或智谱AI glm-4v-flash）的多模态API；AI模型返回的JSON响应在AIAnalyzer中进行解析和结构化处理；解析结果传入FrameValidator，与缓存的历史帧分析结果进行多帧交叉验证；最终，经过验证的建议通过Socket.IO的emit()事件推送给发起请求的客户端。整个管道中的所有阶段都是异步执行的，不会阻塞主HTTP服务器的事件循环。')

    add_paragraph(doc, '第四类主任务是OCR识别任务。当AI分析需要更精确的数值数据时（例如对局中的金钱数量、血量数值、等级数字等），系统使用Tesseract.js进行光学字符识别。Tesseract.js运行在Web Worker线程中，独立的Worker线程不会阻塞浏览器的主UI线程，从而保证了用户在AI分析进行时仍然可以流畅地操作页面。')

    add_paragraph(doc, '三类辅助任务包括：Token刷新定时器（在前端以setInterval方式定期检查JWT Token的有效期，在Token过期前自动调用刷新接口获取新Token，确保用户不会因Token过期而意外退出登录）；在线状态心跳检测（前端以固定间隔向Socket.IO服务器发送心跳ping事件，服务器记录每个在线用户的最后活跃时间，超过一定时间未收到心跳的用户被标记为离线）；以及缓存清理任务（后端以定时任务的形式，定期清理过期的AI分析缓存数据和临时上传文件，防止磁盘空间被无限占用）。')

    add_paragraph(doc, '任务间的通信采用了多种机制以适应不同的通信需求。同步HTTP通信用于前端请求-后端响应的经典交互模式，适用于大多数CRUD操作；异步HTTP通信用于AI分析请求，前端提交分析任务后不阻塞等待，后端分析完成后通过WebSocket异步推送结果；基于事件的Socket.IO消息用于实时推送场景，包括AI结果、私信和通知；共享内存（Pinia Store）用于前端内部不同Vue组件之间的数据共享，避免了组件间通过层层传递Props的繁琐模式。')

    add_paragraph(doc, '以下详细描述三个关键的运行时流程。')

    L481 = '运行时流程一：AI实时分析管道。流程的起点是用户在游戏对局中点击"开启AI指导"按钮。前端启动定时的屏幕捕获任务（ScreenCapture），每5秒从HTML5 Canvas中获取当前游戏画面的图像数据并进行JPEG压缩。'
    L481 += '压缩后的Base64编码图像通过HTTP POST请求发送到后端/api/ai/analyze接口。后端AIAnalyzer接收到图像后，构造一个包含详细系统提示词（prompt）的API请求，异步发送给通义千问qwen3-vl-plus的多模态API。'
    L481 += '系统提示词约定了AI模型应返回的结构化JSON格式，包含"当前回合""推荐阵容方向""装备分配建议""站位建议""风险提示"等字段。AI模型完成推理后返回JSON响应，AIAnalyzer解析并提取各字段，然后将结果传递给FrameValidator。'
    L481 += 'FrameValidator将当前帧的分析结果与前两帧的结果进行比对：如果三帧的"推荐阵容方向"字段一致（或至少两帧一致），则认定结果可靠，通过Socket.IO的emit(\'ai:suggestion\', result)事件推送给客户端；'
    L481 += '如果三帧结果差异过大，则丢弃当前结果并等待下一帧。客户端监听\'ai:suggestion\'事件，接收到建议后以浮动面板的形式展示在页面上。整个流程中，每一帧的处理都是独立的异步任务，互不阻塞。'
    add_paragraph(doc, L481)

    add_paragraph(doc, '运行时流程二：数据加载管道。该流程描述前端页面首次加载时的数据获取过程。当用户导航到阵容库页面时，Vue Router触发对应页面组件的挂载生命周期。在组件的onMounted钩子中，调用Pinia Store中的fetchLineups()方法。Store方法首先检查内存中是否已有缓存数据（isLoaded标志），如果已缓存则直接返回缓存数据；如果未缓存，则通过Axios发送GET请求到/api/lineups接口。后端LineupController接收到请求后，调用Lineup Model的find()方法进行MongoDB查询，同时使用populate()方法关联查询相关的英雄和装备数据。如果查询成功，后端返回200状态码和JSON数组数据，前端Store将数据存入响应式状态（lineups数组）并设置isLoaded=true；如果查询失败（网络错误或服务器错误），前端进入回退模式（fallback），从LocalStorage中读取上次成功缓存的数据作为临时展示内容，同时显示"数据加载失败，已展示缓存数据"的提示信息。这种"成功则更新缓存，失败则回退旧数据"的策略显著提升了系统的容错能力和用户体验。')

    L490 = '运行时流程三：WebSocket私信流程。流程起点是用户A在聊天页面中输入消息并点击发送。前端触发Socket.IO客户端的emit(\'message:send\', { to: userB_id, content: messageText })事件。'
    L490 += 'Socket.IO服务器端的message事件监听器接收到消息后，首先验证发送者的身份（通过Socket连接时绑定的用户ID），然后将消息内容保存到MongoDB的Message集合中。'
    L490 += '保存成功后，服务器通过Socket.IO的to(userB_socketId)方法，向接收者B的WebSocket连接单播emit(\'message:receive\', { from: userA, content: messageText, time: now })事件。'
    L490 += '接收者B的前端客户端监听到\'message:receive\'事件，将新消息追加到当前聊天窗口的消息列表中并自动滚动到底部。如果接收者B当前不在线（没有活跃的WebSocket连接），'
    L490 += '服务器会标记该消息为未读状态，待B上线后通过"离线消息同步"流程一次性推送未读消息。整个流程中，服务器端的Socket.IO事件处理是异步的，多个用户的多个消息处理可以在事件循环中并发执行。'
    add_paragraph(doc, L490)

    add_paragraph(doc, 'Node.js的事件循环机制是支撑以上所有并发任务的基础。Node.js采用单线程事件循环（Event Loop）模型，所有I/O操作（HTTP请求、数据库查询、文件读写）都是异步非阻塞的。当Express接收到一个HTTP请求时，它将该请求的后续处理作为回调函数注册到事件循环中，然后立即返回以处理下一个请求。当MongoDB查询返回结果时，对应的回调函数被事件循环调度执行。这种模型使得单个Node.js进程（在单个CPU核心上）就可以高效处理大量并发连接，而不是为每个连接创建一个操作系统线程，从而避免了线程上下文切换的开销。对于计算密集型任务（如图像压缩），Node.js使用Worker Threads将任务卸载到独立的线程池中执行，避免阻塞事件循环。')

    # 4.3
    add_section_heading(doc, '4.3  开发视图')

    add_paragraph(doc, '赵庆玲老师在课件中定义："开发视图关注的是在软件开发环境中软件模块的实际组织。软件被打包成可以由单个或少量程序员开发的各种小的部分：程序库或子系统。子系统被组织成层次化的体系，每一层为上一层提供一个严密的、明确定义的接口。"开发视图描述代码的静态组织结构，包括源文件、包、库和子系统的划分，以及它们之间的依赖关系。开发视图面向的主要受众是开发人员和项目管理者。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，前端和后端各自采用了清晰的层次化模块组织，遵循了"分割、编组、可视"的设计规则。')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'dev_view.png'))
    add_figure_caption(doc, '图4-3  开发视图 — 层次化模块组织')

    add_paragraph(doc, '前端模块组织分为四个层次，自上而下依次为：Views层、Stores层、Services层和Data层。每一层只依赖其直接下层，不跨层调用。')

    add_paragraph(doc, 'Views层（视图层）位于最上层，包含了所有的Vue页面组件和通用组件。页面组件如HomePage.vue、LineupLibrary.vue、LineupDetail.vue、SimulatorPage.vue、EquipmentGuide.vue、AIAdvisor.vue、CommunityPage.vue、PostDetail.vue、AdminDashboard.vue等，每个页面组件对应一个路由路径。通用组件如AppHeader.vue、AppFooter.vue、SearchBar.vue、Pagination.vue、LoadingSpinner.vue等，被多个页面组件共用。Views层的职责是渲染用户界面和处理用户交互事件，它通过调用Stores层的方法获取数据和执行业务操作，不直接访问Services层或发送HTTP请求。')

    add_paragraph(doc, 'Stores层（状态管理层）位于第二层，包含了所有的Pinia Store模块。各Store模块如useUserStore（管理用户登录状态、个人信息和Token）、useLineupStore（管理阵容列表、当前编辑的阵容和筛选条件）、useEquipmentStore（管理装备图鉴数据和搜索过滤）、useAIStore（管理AI分析状态、历史建议和配置参数）、useCommunityStore（管理帖子列表、当前帖子和评论数据）。Stores层是前端的数据中心，它通过调用Services层的方法获取和提交数据，同时将数据以响应式状态的形式提供给Views层。Stores层不包含UI渲染逻辑。')

    add_paragraph(doc, 'Services层（服务层）位于第三层，包含了所有面向后端的API调用封装。各服务模块如apiClient.js（封装Axios实例，配置Base URL、超时时间、请求拦截器和响应拦截器）、authService.js（封装登录login、注册register、Token刷新refreshToken等API调用）、lineupService.js（封装阵容的CRUD API调用）、equipmentService.js（封装装备数据的查询API调用）、aiService.js（封装AI分析的提交submitAnalysis和结果获取getResult等API调用）、communityService.js（封装帖子和评论的CRUD API调用）。Services层是前端与后端通信的唯一通道，所有HTTP请求和Socket.IO连接都在这一层发起和管理。Services层不管理应用状态。')

    add_paragraph(doc, 'Data层（数据层）位于最下层，包含了数据模型的类型定义和常量配置。例如types.js定义了Hero、Equipment、Synergy、Lineup、Post、Comment等数据实体的TypeScript接口；constants.js定义了API路径常量、羁绊类型枚举、装备类别枚举等；config.js定义了环境变量和功能开关。Data层为上层提供类型安全和配置统一性，不包含任何运行时逻辑。')

    add_paragraph(doc, '后端模块组织同样分为四个层次，自上而下依次为：Routes层、Controllers层、Models层和Middleware层。')

    add_paragraph(doc, 'Routes层定义了所有API端点的URL路径和HTTP方法映射，每个路由文件将具体的HTTP请求委托给对应的Controller方法处理。例如lineupRoutes.js将GET /api/lineups映射到lineupController.getAll()，将POST /api/lineups映射到lineupController.create()。Routes层是后端的入口层，负责URL路由分发。')

    add_paragraph(doc, 'Controllers层包含了所有的业务逻辑处理函数。每个Controller文件管理一种资源的CRUD操作，例如lineupController.js包含getAll()（查询阵容列表，支持分页和筛选）、getById()（查询单个阵容详情）、create()（创建新阵容，验证数据合法性）、update()（更新阵容，验证权限）、delete()（删除阵容，验证权限）。Controllers层的职责是接收请求参数、调用Models层进行数据操作、处理业务规则、构造并返回HTTP响应。Controllers层不直接操作数据库。')

    add_paragraph(doc, 'Models层利用Mongoose ODM定义了所有的数据模型（Schema和Model）。如HeroSchema定义了英雄文档的字段、类型、验证规则和索引，EquipmentSchema定义了装备文档的结构，LineupSchema定义了阵容文档的结构及其与Hero和Equipment的引用关系。Models层是后端与MongoDB数据库交互的唯一通道，上层通过调用Model的方法（如find、findById、create、updateOne、deleteOne）来进行数据操作。')

    add_paragraph(doc, 'Middleware层包含了可复用的中间件函数，这些中间件在请求到达Controller之前被依次执行。包括authMiddleware.js（JWT Token验证中间件，从请求头的Authorization字段提取Token并解码，将用户信息附加到req.user）、adminMiddleware.js（管理员权限验证中间件，检查req.user.role是否为admin）、rateLimiter.js（请求频率限制中间件，基于express-rate-limit实现）、uploadMiddleware.js（文件上传处理中间件，基于multer实现）、errorHandler.js（全局错误处理中间件，捕获所有未被处理的异常并返回统一格式的错误响应）。Middleware层实现了横切关注点（Cross-Cutting Concerns）的统一处理，避免了在每个Controller中重复编写认证、授权和错误处理代码。')

    add_paragraph(doc, '层次间的依赖关系遵循严格的单向依赖原则：上层只依赖其直接下层，下层绝不依赖上层。在前端，Views→Stores→Services→Data（Views依赖Stores和Data，Stores依赖Services，Services依赖Data，Data不依赖任何上层）。在后端，Routes→Controllers→Models（Routes依赖Controllers，Controllers依赖Models，Models不依赖任何上层）。Middleware作为横切层，被Routes层在路由定义时注入，实际执行顺序为Middleware→Controller。')

    add_paragraph(doc, '在代码组织原则方面，本项目遵循了三个核心原则。第一，关注分离（Separation of Concerns）：前端UI、前端状态管理、后端业务逻辑、数据持久化被严格分离到不同的模块和层次中。第二，单一职责原则（Single Responsibility Principle）：每个Vue组件只负责一个视图或一个UI部件；每个Controller方法只负责一个API端点的业务处理；每个Model只负责一种数据实体的定义和操作。第三，DRY原则（Don\'t Repeat Yourself）：通用的API调用逻辑封装在Services层，通用的认证和错误处理逻辑封装在Middleware层，通用的UI组件（如加载动画、分页器）封装为可复用组件。')

    add_paragraph(doc, '开发工具链方面，前端使用Vite 5的开发服务器提供热模块替换（HMR），修改代码后浏览器即时反映变更，无需手动刷新；后端使用nodemon监听文件变化并自动重启服务。代码版本管理使用Git，团队遵循Git Flow分支策略（main/dev/feature分支）。')

    # 4.4
    add_section_heading(doc, '4.4  物理视图')

    add_paragraph(doc, '赵庆玲老师在课件中定义："物理体系结构主要考虑的是非功能性的系统需求，如系统的可用性、可靠性（容错性）、性能（信息吞吐量）和可扩展性。软件系统在计算机网络的各个处理节点上运行。"物理视图描述了软件系统在物理硬件和网络基础设施上的部署分布情况，包括各处理节点的职责、节点之间的网络连接和数据流向。物理视图面向的主要受众是系统工程师和运维人员。')

    add_paragraph(doc, '"掌上金铲铲"项目的物理部署拓扑采用基于Docker的多容器架构，所有服务运行在自定义的桥接网络中。部署拓扑的结构如下：最外层是用户的浏览器（客户端节点），通过互联网连接到运行在云服务器（或物理服务器）上的Nginx反向代理服务器（监听80端口）。Nginx根据请求的URL路径前缀进行路由分发：以/api/开头的请求被反向代理转发到后端的Express应用服务器（容器内监听3000端口）；以/socket.io/开头的WebSocket升级请求直接透传到后端的Socket.IO服务器；以/开头的其他所有请求由Nginx直接返回Vue SPA的静态文件（HTML、CSS、JavaScript、图片等），无需经过后端服务器。后端Express服务器在处理业务逻辑时，通过Mongoose驱动程序连接MongoDB数据库服务器（容器内监听27017端口）。当需要AI分析时，Express服务器通过HTTPS协议向阿里云通义千问API或智谱AI API发送请求。')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'physical_view.png'))
    add_figure_caption(doc, '图4-4  物理视图 — 部署拓扑图')

    add_paragraph(doc, 'Docker容器编排方案通过docker-compose.yml文件定义，包含以下四个核心配置：')

    add_paragraph(doc, '第一个容器是MongoDB数据库容器。该容器基于官方mongo:7.0镜像构建，容器名称为mongo，内部暴露27017端口。关键配置包括：通过volumes挂载命名卷（mongo-data）到容器内的/data/db路径，实现数据库文件的持久化存储——即使容器被重启或重新创建，数据也不会丢失；通过environment设置MONGO_INITDB_ROOT_USERNAME和MONGO_INITDB_ROOT_PASSWORD环境变量，配置数据库的初始超级管理员账户；通过networks连接到自定义桥接网络app-network。MongoDB容器不对外暴露端口（仅在app-network内部可访问），安全性得到保障。')

    add_paragraph(doc, '第二个容器是后端应用容器。该容器基于自定义的Dockerfile构建，该Dockerfile基于node:20-alpine基础镜像（选择Alpine版本以最小化镜像体积），将源代码复制到容器内/app目录，执行npm ci --only=production安装依赖，最后使用CMD ["node", "server.js"]启动Express应用。容器名称为backend，内部暴露3000端口。关键配置包括：通过environment设置MONGODB_URI环境变量（指向mongo:27017）、JWT_SECRET密钥、AI_API_KEY等敏感配置；通过depends_on声明对mongo容器的启动依赖，确保数据库先于后端启动；通过networks连接到app-network。')

    add_paragraph(doc, '第三个容器是前端Nginx容器。该容器基于nginx:1.25-alpine基础镜像，使用自定义的nginx.conf配置文件替换默认配置。容器名称为frontend，对外暴露80端口（映射到主机的80端口）。自定义nginx.conf的关键配置包括：根路径（location /）指向/usr/share/nginx/html目录中的Vue SPA静态文件，并配置try_files $uri $uri/ /index.html以支持Vue Router的History模式；/api/路径（location /api/）配置为反向代理，proxy_pass到http://backend:3000；/socket.io/路径配置为WebSocket代理，需要设置proxy_http_version 1.1和Upgrade、Connection头以支持WebSocket协议升级。此外，Nginx还配置了Gzip压缩（gzip on，gzip_types包含text/html、application/javascript、text/css、application/json等）、静态资源缓存（expires 7d用于图片和字体文件）和安全头（X-Frame-Options、X-Content-Type-Options等）。')

    add_paragraph(doc, '第四个配置是自定义桥接网络app-network。该网络使用Docker的bridge驱动创建，所有三个容器都连接到该网络，容器之间可以通过容器名称（如mongo、backend、frontend）互相访问。桥接网络提供了网络隔离——只有显式连接到该网络的容器才能相互通信，外部网络无法直接访问MongoDB和backend容器（只能通过frontend的Nginx反向代理间接访问）。')

    add_paragraph(doc, '在开发环境与生产环境的配置对比方面，两者存在以下关键差异：开发环境中前端使用Vite开发服务器（端口5173，支持HMR），后端使用nodemon自动重启（源代码挂载为bind mount以实现热更新）；生产环境中前端编译为静态文件由Nginx提供，后端以node server.js直接运行，数据库使用命名卷持久化。开发环境使用docker-compose.dev.yml配置文件，生产环境使用docker-compose.prod.yml配置文件。根据12-Factor App方法论，所有环境相关的配置（如数据库连接串、API密钥、环境模式标识）通过环境变量注入，不硬编码在代码或配置文件中。')

    add_paragraph(doc, '数据流向主要分为三条路径：第一条是静态资源请求路径——浏览器→Nginx（80端口）→直接返回静态文件（HTML/CSS/JS/图片），不经过后端服务器。这条路径的响应速度最快，因为Nginx直接从磁盘（或内存缓存）读取并返回文件。第二条是API请求路径——浏览器→Nginx（80端口）→反向代理→Express（3000端口）→Mongoose驱动→MongoDB（27017端口）→逐层返回响应。这条路径涉及多次网络跳转，但由于所有容器都在同一台主机的桥接网络中，网络延迟极小（通常小于1ms）。第三条是AI分析请求路径——浏览器→Nginx→Express→HTTPS→外部AI API（阿里云/智谱AI服务器）→逐层返回。这条路径的延迟主要来自外部API的网络传输和模型推理时间。')

    # 4.5
    add_section_heading(doc, '4.5  场景视图')

    add_paragraph(doc, '赵庆玲老师在课件中指出："通过使用一些重要场景，4个视图中的元素可以协调地共同工作。场景是最重要的需求的抽象。在体系结构设计中，将以此视图为驱动来发现体系结构元素；在体系结构设计结束后，此视图承担验证和描述的角色。"场景视图通过具体的用户用例，将逻辑视图中的类、过程视图中的任务、开发视图中的模块和物理视图中的节点串联起来，验证体系结构的合理性和完整性。')

    add_paragraph(doc, '以下通过四个详细的用例场景来展示各视图元素如何协调运作。')

    add_image(doc, os.path.join(DIAGRAMS_DIR, 'scenario_view.png'))
    add_figure_caption(doc, '图4-5  场景视图 — 关键用例场景')

    add_paragraph(doc, '场景一：新手玩家学习阵容搭配。小李是一名刚接触《金铲铲之战》的新手玩家，他对游戏的基本规则有一定了解，但面对S8赛季繁多的英雄和羁绊组合感到无从下手。小李打开浏览器访问"掌上金铲铲"网站（物理视图：浏览器通过HTTP请求连接Nginx前端容器），首先看到的是无需登录即可浏览的首页。首页上展示了当前版本的热门阵容推荐（开发视图：HomePage.vue组件从useLineupStore获取数据）。')

    add_paragraph(doc, '小李点击了一个名为"星守卡莎"的阵容卡片，Vue Router将其导航到阵容详情页面（开发视图：LineupDetail.vue组件）。该页面以可视化的棋盘展示了阵容的完整站位（逻辑视图：Board对象渲染为8×7的格位，每个Chess实例显示英雄头像和星级），左侧面板列出了该阵容激活的所有羁绊效果（逻辑视图：Board.calculateSynergies()方法的计算结果），右侧面板标注了每个核心英雄的推荐装备（逻辑视图：Equipment对象与Chess对象的关联）。小李觉得这个阵容符合自己的喜好，于是点击"在模拟器中打开"按钮。')

    add_paragraph(doc, '模拟器页面加载（开发视图：SimulatorPage.vue组件），小李可以自由地拖拽英雄棋子到棋盘格位上，每次操作都会触发实时的羁绊重新计算（过程视图：棋盘组件的拖拽事件→Stores层更新状态→UI重新渲染，保持60fps的流畅体验）。小李根据自己的理解微调了几个棋子的站位，然后点击"保存阵容"按钮（过程视图：前端通过HTTP POST请求发送JSON数据到/api/lineups接口→后端LineupController.create()→Mongoose保存到MongoDB→返回201 Created）。系统提示保存成功，该阵容同时出现在小李的个人收藏列表中，可供他在对局中随时参考。')

    add_paragraph(doc, '场景二：进阶玩家AI实时对战指导。小王是一名钻石段位的进阶玩家，正在冲击大师段位。他打开"掌上金铲铲"网站并登录，同时启动了《金铲铲之战》游戏客户端。在网站上，小王点击"AI对战指导"功能入口，进入了一个全屏覆盖的指导面板页面。他点击"开始指导"按钮，系统提示他使用浏览器窗口捕获功能选中游戏窗口。')

    add_paragraph(doc, 'AI分析管道正式启动（过程视图：AI分析管道任务）。ScreenCapture任务每5秒自动从Canvas中截取游戏画面并进行JPEG压缩。第一帧图像被发送到后端/api/ai/analyze（物理视图：请求路径浏览器→Nginx→Express）。后端AIAnalyzer将图像和系统提示词封装为请求体，异步发送给通义千问qwen3-vl-plus的多模态API（物理视图：Express→HTTPS→阿里云API服务器）。约2秒后，AI模型返回JSON结构化分析结果，包含"当前第3回合，建议向星守法师阵容方向发展"等信息。FrameValidator缓存了这一帧的结果，但尚未达到验证阈值（需要至少2帧一致），因此不推送建议。')

    add_paragraph(doc, '当第三帧的分析结果与第二帧一致时（均建议"星守法师阵容方向"），FrameValidator的vote()方法判定结果可靠。后端通过Socket.IO的emit()事件将AI建议推送给小王的前端客户端（过程视图：WebSocket实时通信任务→Socket.IO事件推送）。小王的浏览器右下角弹出一个半透明的建议面板，显示"AI建议：当前阵容倾向星守法师方向，建议优先收集拉克丝和辛德拉，装备偏向大棒和女神泪。"（逻辑视图：Suggestion对象的description和reasoning属性）。小王根据AI建议调整了自己的选牌策略。在整局对局中，AI分析持续运行，每5-15秒推送一次更新建议，小王最终凭借精准的AI辅助成功吃鸡。')

    add_paragraph(doc, '场景三：社区内容分享与审核。资深玩家老张在某个对局中开发了一套强力的冷门阵容——"黑客乐芙兰"。他想要将这套阵容分享给社区的其他玩家。老张登录"掌上金铲铲"后，在社区广场页面点击"发布攻略"按钮（开发视图：CommunityPage.vue→创建帖子页面CreatePost.vue）。他使用富文本编辑器撰写了详细的攻略正文，包括阵容的核心思路、前期过渡策略、中期关键回合、后期成型体系以及对阵各主流阵容的应对方针。同时，他通过棋盘嵌入组件在帖子中插入了阵容的站位截图，并通过装备图标组件标注了核心装备的合成路径（逻辑视图：Post对象关联了TeamLineup对象和多个Equipment对象引用）。')

    add_paragraph(doc, '老张提交帖子后（过程视图：HTTP POST到/api/posts接口），后端PostController.create()方法将帖子保存到MongoDB，同时将帖子的审核状态设置为"待审核"（逻辑视图：Post.status = \'pending\'）。此时帖子并不会在社区广场公开展示，而是进入管理员审核队列。')

    add_paragraph(doc, '管理员小李登录后台管理系统（开发视图：AdminDashboard.vue→内容审核页面），在审核列表中发现老张的帖子。他仔细阅读了攻略内容，确认内容符合社区规范（无违规信息、有实质性内容），点击"通过审核"。后端执行PostController.approve()方法，将帖子的审核状态更新为"已发布"（逻辑视图：Post.status = \'published\'）。此时，老张的帖子正式在社区广场展示，其他玩家可以浏览、点赞和评论。小王看到这篇攻略后非常受用，点击了点赞按钮并在评论区留言感谢老张的分享（过程视图：Comment对象创建并关联到Post对象）。')

    add_paragraph(doc, '场景四：管理员数据维护。每个《金铲铲之战》新赛季上线时，管理员都需要更新系统中的游戏数据。S8赛季结束后，S9赛季"符文大陆传说"上线。管理员小李登录后台，进入"数据管理"页面（开发视图：AdminDataPage.vue组件）。系统展示了当前数据库中的英雄、装备和羁绊数据统计。')

    add_paragraph(doc, '小李首先导出了S8赛季的数据作为归档备份（过程视图：HTTP GET请求调用/api/admin/export接口→后端AdminController.exportData()→MongoDB聚合查询→生成JSON导出文件）。然后，他上传了S9赛季的新数据文件——一个包含所有新英雄、新装备和新羁绊定义的JSON文件（过程视图：HTTP POST请求到/api/admin/import接口→文件解析→Mongoose批量插入/更新操作）。系统执行了数据迁移脚本，更新了英雄的属性值、装备的合成关系和羁绊的激活阈值。')

    add_paragraph(doc, '数据更新完成后，小李在后台预览了几个核心阵容页面，确认新赛季的数据正确展示（物理视图：Nginx返回新版前端静态文件→浏览器渲染新赛季数据）。同时，系统自动发送了一条系统公告（逻辑视图：Announcement对象创建），通知所有用户"S9赛季数据已更新，阵容推荐已适配新版本"。整个数据维护流程在15分钟内完成，前端社区用户立即可以看到新赛季的内容，无需任何前端代码修改。（逻辑视图：Hero、Equipment、Synergy对象的属性通过数据库更新即完成了"热更新"，体现了数据驱动的体系结构优势。）')

    add_paragraph(doc, '通过以上四个完整的用例场景，我们验证了"掌上金铲铲"的4+1视图模型在真实用户场景下的协调性和完整性。逻辑视图中的类（Post、Board、Suggestion等）被正确地实例化和关联；过程视图中的任务（HTTP处理、WebSocket通信、AI分析管道）被正确地调度和执行；开发视图中的模块（Vue组件、Pinia Store、Express控制器）被正确地调用和协作；物理视图中的节点（Nginx、Express、MongoDB）被正确地访问和路由。场景视图作为"+1"，成功地将四个视图的元素串联为一幅完整的体系结构运行图。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第五章：体系结构风格分析
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第五章  体系结构风格分析')

    add_paragraph(doc, '体系结构风格（Architectural Style）是赵庆玲老师《软件体系结构》课程第4至11章的核心教学内容。体系结构风格定义了一组构件类型、连接件类型以及拓扑约束的词汇表，它是在特定上下文中反复出现的体系结构模式的抽象。本章将详细分析"掌上金铲铲"项目中所采用的七种体系结构风格，并阐述它们各自在系统中的作用和体现。')

    # 5.1
    add_section_heading(doc, '5.1  项目采用的体系结构风格')

    # 5.1.1
    add_sub_heading(doc, '5.1.1  B/S架构风格')

    add_paragraph(doc, '赵庆玲老师在课件第10章中详细讲授了客户-服务器（Client-Server）风格及其变体B/S（Browser-Server）架构。B/S架构是客户-服务器风格在Web环境下的具体实现，其核心思想是将系统分为浏览器端（Browser，瘦客户端）和服务器端（Server），浏览器负责用户界面的呈现和交互，服务器负责业务逻辑处理和数据管理。这种架构的最大优势在于客户端零安装——用户只需要一个标准的Web浏览器即可访问系统，无需下载和安装任何专用软件。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，B/S架构是贯穿整个系统的基础风格。用户在任意设备的浏览器中输入网址即可访问全部功能，不需要安装任何客户端应用。前端Vue 3 SPA运行在浏览器中，负责UI渲染、用户交互和路由导航；后端Express服务器运行在云端，负责业务逻辑处理、数据持久化和外部API调用。前后端之间通过HTTP/HTTPS协议进行通信，遵循RESTful API规范。这种完全分离的设计使得前端和后端可以独立开发、独立部署、独立扩展。当用户量增长时，前端静态资源可以通过CDN加速分发，后端API服务器可以通过负载均衡器进行水平扩展，两者互不影响。')

    # 5.1.2
    add_sub_heading(doc, '5.1.2  分层架构风格')

    add_paragraph(doc, '赵庆玲老师在课件第8章中讲授了分层架构（Layered Architecture）风格，并给出了经典定义："在分层系统中，系统被组织成若干个层次，每个层次由一系列组件组成；层次之间存在接口，通过接口形成call/return的关系。"分层风格的核心约束是：第N层只能调用第N-1层提供的服务，不能跨层调用。这种约束带来了良好的模块化和可替换性——每一层可以被独立地替换或修改，只要保持对上一层的接口不变。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，分层架构体现在两个层面。在整体系统层面，我们采用了经典的三层架构：表现层（前端Vue SPA）、业务逻辑层（后端Express应用）和数据持久层（MongoDB数据库）。表现层通过RESTful API调用业务逻辑层，业务逻辑层通过Mongoose ODM访问数据持久层。每层之间通过严密定义的接口（API契约和Schema定义）进行交互。在表现层内部，我们又进一步细分为Views→Stores→Services→Data四个子层（详见开发视图4.3节）。在业务逻辑层内部，我们同样细分为Routes→Controllers→Models→Middleware四个子层。这种嵌套的分层结构确保了系统的各个部分职责清晰、边界明确。')

    # 5.1.3
    add_sub_heading(doc, '5.1.3  MVVM架构模式（前端）')

    add_paragraph(doc, 'MVVM（Model-View-ViewModel）是一种应用于前端用户界面的架构模式，属于赵庆玲老师课件第7章所讲授的面向对象风格的延伸。在MVVM模式中，Model代表数据模型和业务逻辑，View代表用户界面，ViewModel作为Model和View之间的桥梁，负责将Model的数据转换为View可直接使用的格式，并将View的用户操作转换为Model的更新。MVVM的最大优势是实现了数据绑定——View和ViewModel之间的数据同步是自动的，开发者无需手动操作DOM。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，MVVM模式在前端Vue 3架构中得到了充分体现。Model层对应Services层和Data层（apiClient封装的后端数据接口和types.js定义的数据类型），View层对应Views层（Vue单文件组件的template部分），ViewModel层对应Stores层（Pinia Store管理的响应式状态）以及Vue组件的script部分（使用Composition API的逻辑代码）。Vue 3的响应式系统基于Proxy实现了精细的依赖追踪，当Pinia Store中的阵容数据发生变化时，所有依赖该数据的Vue组件（如棋盘组件、羁绊面板组件）会自动重新渲染，无需任何手动操作。双向数据绑定的典型体现是阵容模拟器中的拖拽操作：用户拖拽棋子→触发View层事件→更新Pinia Store中Board对象的cells数组→棋盘组件自动重新渲染新的棋子布局。')

    # 5.1.4
    add_sub_heading(doc, '5.1.4  事件驱动架构风格')

    add_paragraph(doc, '赵庆玲老师在课件第6章中讲授了事件驱动架构（Event-Driven Architecture）。事件驱动风格的核心思想是系统中的构件不直接调用彼此的方法，而是通过发布和订阅事件来进行间接通信。事件总线（Event Bus）是事件驱动架构的核心基础设施，它负责事件的注册、分发和路由。事件驱动架构的最大优势是实现构件之间的高度松耦合——事件的发布者不需要知道哪些构件会接收事件，事件的接收者也不需要知道事件来自哪里。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，事件驱动架构主要体现在Socket.IO的实时通信机制中。Socket.IO充当了事件总线的角色，系统中的各个构件（浏览器客户端、Express服务器、AI分析管道）通过Socket.IO发布和订阅命名事件来进行通信。具体体现包括：AI分析完成事件（后端发布\'ai:suggestion\'事件，前端对应监听器接收并展示建议）；私信消息事件（用户A发布\'message:send\'事件，服务器转发为\'message:receive\'事件推送给用户B）；在线状态变更事件（用户连接时发布\'user:online\'事件，断开时发布\'user:offline\'事件）；以及系统通知事件（管理员发布\'announcement:new\'事件，所有在线用户接收）。事件驱动风格使得实时通信功能可以被灵活扩展——如果需要添加新的实时通知类型（例如好友邀请、评论区回复提醒），只需定义新的事件名称和对应的监听器即可，不需要修改现有的事件处理逻辑。')

    # 5.1.5
    add_sub_heading(doc, '5.1.5  管道-过滤器风格')

    add_paragraph(doc, '赵庆玲老师在课件第4章数据流风格中讲授了管道-过滤器（Pipe-and-Filter）风格。管道-过滤器风格将系统分解为一系列独立的处理阶段（过滤器），每个过滤器对数据流执行特定的转换操作，过滤器之间通过管道连接，数据以流的方式依次通过各过滤器。管道-过滤器风格的每个过滤器都是独立的功能单元，具有明确的输入和输出接口，可以独立开发和测试。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，管道-过滤器风格最典型地体现在AI分析管道的设计上。整个AI分析流程被分解为六个独立的过滤阶段：第一个过滤器是ScreenCapture（输入：用户的操作指令，输出：Canvas图像数据），第二个过滤器是ImageCompressor（输入：Raw图像数据，输出：压缩后的JPEG Base64数据），第三个过滤器是APICaller（输入：压缩图像+提示词，输出：AI模型的原始JSON响应），第四个过滤器是JSONParser（输入：原始JSON字符串，输出：结构化的Suggestion对象），第五个过滤器是FrameValidator（输入：当前帧的Suggestion对象+历史帧缓存，输出：验证后的可靠建议或丢弃），第六个过滤器是ResultPresenter（输入：Suggestion对象，输出：前端UI展示）。每个过滤器的实现是独立的，可以在不影响其他过滤器的情况下替换或优化特定阶段的逻辑。例如，如果需要从通义千问模型切换到智谱AI模型，只需修改APICaller过滤器的API端点和认证方式，其他五个过滤器完全不受影响。同样，如果需要调整压缩质量以平衡画面清晰度和传输速度，只需修改ImageCompressor过滤器的参数即可。管道-过滤器风格为AI分析流程提供了高度的模块化和灵活性。')

    # 5.1.6
    add_sub_heading(doc, '5.1.6  面向对象风格')

    add_paragraph(doc, '赵庆玲老师在课件第7章中讲授了面向对象风格（Object-Oriented Style）。面向对象风格基于抽象、封装、继承和多态四大基本原则来组织软件构件。系统中的数据和操作数据的方法被封装在对象中，对象通过消息传递进行通信。面向对象风格的优势在于其天然适合对现实世界问题进行建模，具有良好的可理解性和可复用性。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，面向对象风格贯穿于整个系统的设计中。在前端，每个Vue组件都是封装了数据（响应式状态）、方法（事件处理函数）和模板（渲染逻辑）的独立对象，Vue组件的继承通过mixins和composables实现代码复用。在后端，每个Mongoose Model定义了数据实体的结构（属性）和行为（实例方法和静态方法），例如Hero模型的getSynergies()方法封装了查询英雄所属羁绊的复杂逻辑。AI分析子系统中，AIAnalyzer基类定义了analyze()的抽象接口，QwenAnalyzer和GLMAnalyzer两个子类分别实现了对通义千问和智谱AI的具体API调用逻辑——这是面向对象多态性的经典体现。当系统需要接入新的AI模型时，只需创建一个新的子类实现analyze()方法即可，基于AI模型切换的配置，系统在运行时通过多态机制自动选择正确的实现。')

    # 5.1.7
    add_sub_heading(doc, '5.1.7  仓库风格')

    add_paragraph(doc, '赵庆玲老师在课件第5章中讲授了仓库风格（Repository Style）。仓库风格的核心思想是由一个中央数据仓库（Repository）来管理所有的共享数据，系统中的各个处理单元（Agent）不直接相互通信，而是通过读写中央仓库来进行间接的数据交换。仓库风格适用于数据驱动的系统，其中共享数据的结构相对稳定，而处理逻辑可以独立演化。')

    add_paragraph(doc, '在"掌上金铲铲"项目中，仓库风格的体现可以从两个层面来理解。第一，MongoDB数据库充当了系统整体的中央数据仓库。所有的持久化数据——用户信息、英雄数据、装备数据、阵容方案、社区帖子、评论、私信等——都存储在MongoDB中。前端的各个Vue页面组件和后端的各个Express控制器都是围绕这个中央数据仓库运转的处理单元，它们通过Mongoose ODM读写数据库中的数据（读取英雄列表渲染阵容选择器、写入新阵容方案、更新帖子审核状态等），而不需要直接相互传递数据。第二，在前端内部，Pinia Store也扮演了局部数据仓库的角色。各个Vue组件（处理单元）通过读写Pinia Store中的共享状态来进行间接数据交换，而不是通过层层传递Props来直接传递数据。例如，AIAdvisor组件将AI建议写入useAIStore，CommunityPage组件从useAIStore读取AI建议的统计信息用于"AI推荐阵容"板块的展示。仓库风格在本项目中的最大优势是数据的集中管理和一致性维护——所有处理单元看到的是同一份共享数据，不会出现数据不一致的问题。')

    # 5.2
    add_section_heading(doc, '5.2  混合体系结构风格的设计原理')

    add_paragraph(doc, '在完成了七种体系结构风格的逐一分析之后，一个自然的问题是：为什么本项目需要采用如此多样的混合风格，而不是选择某一种单一风格？答案在于软件系统不同组成部分面临的设计问题有着本质的不同，单一风格无法同时满足所有部分的设计需求。这正是赵庆玲老师在课程中反复强调的混合体系结构风格（Heterogeneous Architectural Styles）的设计理念。')

    add_paragraph(doc, '不同的子系统面临不同的核心设计问题。用户界面子系统最关心的是如何高效地管理视图和数据的同步——MVVM模式的数据绑定机制是解决这一问题的理想方案。API服务子系统最关心的是如何组织代码以提高可维护性和可测试性——分层架构的职责分离提供了优雅的答案。实时通信子系统最关心的是如何实现构件之间的松耦合通信——事件驱动风格的事件总线提供了最灵活的方案。AI分析子系统最关心的是如何将复杂的数据处理流程分解为可独立管理和优化的阶段——管道-过滤器风格提供了清晰的分解思路。数据管理层最关心的是如何保证数据的一致性和集中访问——仓库风格提供了统一的数据管理方案。而这些子系统作为一个整体，又需要一个基础架构来承载和协调——B/S架构提供了浏览器-服务器的基础通信框架。')

    add_paragraph(doc, '下表展示了每种体系结构风格与系统子系统的映射关系，有助于更清晰地理解混合体系结构风格的组织逻辑：')

    # 风格-子系统映射表
    add_table(doc,
              ['体系结构风格', '应用子系统', '关键作用'],
              [
                  ['B/S架构', '整个系统', '提供浏览器-服务器的基础通信框架'],
                  ['分层架构', '前端+后端', '组织代码结构，保证职责分离和可维护性'],
                  ['MVVM模式', '前端表现层', '管理视图与数据的双向绑定和响应式更新'],
                  ['事件驱动', '实时通信子系统', '支持异步消息推送和构件松耦合通信'],
                  ['管道-过滤器', 'AI分析子系统', '分解AI分析流程为独立的可替换处理阶段'],
                  ['面向对象', '所有子系统', '基于对象封装和继承组织软件构件'],
                  ['仓库风格', '数据持久层+前端状态', '集中管理共享数据，保证数据一致性'],
              ])

    add_paragraph(doc, '这种混合体系结构风格的设计并非简单的风格堆砌，而是经过深思熟虑的有机组合。每种风格都有明确的应用边界和适用范围，不同风格之间通过明确的接口进行衔接。例如，B/S架构定义了浏览器和服务器之间的基本通信协议，分层架构在服务器端内部组织了Controllers→Models的数据处理流程，而仓库风格中的MongoDB作为数据持久层存储了分层架构中产生和消费的所有数据。这种层次化的风格组织确保了系统既具有整体的结构清晰性，又具有局部的设计灵活性。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第六章：体系结构风格选择——体系选择矩阵法
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第六章  体系结构风格选择——体系选择矩阵法')

    add_paragraph(doc, '赵庆玲老师在《软件体系结构》课程第3章和第13章中系统地讲授了基于质量需求的体系结构风格选择方法——体系选择矩阵法（Architecture Selection Matrix Method）。该方法提供了一套科学的、量化的体系结构风格评估和选择流程，其核心思想是：首先从需求中提取出系统的质量需求（Quality Requirements），并为每个质量需求赋予一个权重（0-4分，表示该质量需求对系统的重要程度）；然后针对每种候选的体系结构风格，评估它在每个质量需求维度上的满足程度（1-5分）；最后通过加权求和计算每种风格的选择分（Selection Score），选择分最高的风格即为理论上最适合该系统的体系结构风格。')

    add_paragraph(doc, '本章将应用体系选择矩阵法，对"掌上金铲铲"项目的体系结构风格选择进行科学的量化分析，以验证第五章中所采用的混合体系结构风格策略的合理性和最优性。')

    # 6.1
    add_section_heading(doc, '6.1  质量需求分析')

    add_paragraph(doc, '根据赵庆玲老师课件第3章Slide 50-58的质量需求维度体系，结合"掌上金铲铲"项目的具体功能需求和非功能需求，我们定义了以下九个质量需求维度，并为每个维度赋予了基于项目优先级分析的权重（0-4分，其中0表示不关心，4表示极为重要）：')

    add_paragraph(doc, '（1）组件重用（权重4）：英雄数据、装备数据、阵容方案的查看和管理在多个页面（阵容库、阵容详情、模拟器、装备图鉴、AI指导面板）中共享。高组件重用性能够显著降低开发工作量和维护成本。')

    add_paragraph(doc, '（2）组件更换（权重4）：AI视觉模型（通义千问和智谱AI之间需能便捷切换）、OCR引擎（Tesseract.js可能需要替换为更高精度的方案）等第三方服务应当可替换。高组件更换性确保了系统不受特定供应商的锁定。')

    add_paragraph(doc, '（3）组件移位（权重3）：前端和后端分离部署在不同的Docker容器中，具备独立迁移到不同服务器的能力。中等权重是因为当前部署规模较小，但未来可能需要扩展。')

    add_paragraph(doc, '（4）组件无关（权重3）：前端Vue组件应当能够独立开发和单元测试，不依赖其他组件的运行时环境。中等权重体现了对开发效率和测试覆盖率的关注。')

    add_paragraph(doc, '（5）组件互通（权重4）：前端与后端之间、AI分析管道各阶段之间、Socket.IO事件发布者与订阅者之间均需要高效的通信机制。高权重反映了本项目的全栈Web应用和实时通信特性。')

    add_paragraph(doc, '（6）接口变换（权重3）：RESTful API的接口版本可能在需求演化中发生变化，接口的向后兼容性和版本管理能力影响系统的长期可维护性。中等权重。')

    add_paragraph(doc, '（7）计算性能（权重2）：AI分析的响应延迟可以接受在2-3秒级别，但常规CRUD操作需要保持200ms以内的低延迟。较低权重反映了AI功能的"尽力而为"特性。')

    add_paragraph(doc, '（8）节省空间（权重1）：作为Web端应用，客户端存储压力小，主要存储压力在服务器端（MongoDB数据库+日志文件）。低权重反映了Web应用的天然优势。')

    add_paragraph(doc, '（9）容错（权重3）：系统需要具备数据加载失败时的回退机制、AI分析多帧交叉验证的容错能力、以及MongoDB连接中断时的自动重试。中等权重反映了对系统可靠性的基本要求。')

    # 6.2
    add_section_heading(doc, '6.2  体系选择矩阵计算')

    add_paragraph(doc, '根据赵庆玲老师课件第3章Slide 50-58的体系选择矩阵法计算方法，我们构建了完整的体系选择矩阵。矩阵的行代表候选的体系结构风格（共7种：管道-过滤器、面向对象、事件驱动、层次、仓库、客户-服务器、对等），矩阵的列代表9个质量需求维度及其对应权重，每个单元格的值是该风格在该质量需求维度上的满足程度评分（1-5分）。每行的选择分计算公式为：选择分 = Σ(权重_i × 满足度_i)。')

    add_paragraph(doc, '首先列出计算所需的基础数据。完美分（每种风格在每个维度均获得满分5分）的计算如下：完美分 = 4×5 + 4×5 + 3×5 + 3×5 + 4×5 + 3×5 + 2×5 + 1×5 + 3×5 = 20+20+15+15+20+15+10+5+15 = 135分。当某风格的选择分低于50%（67.5分）时，该风格被判定为不适合（✓）；50%-65%（67.5-87.75分）时为尚可（△）；65%-80%（87.75-108分）时为适合（○）；80%以上（108分以上）时为非常适合（◎）。')

    add_paragraph(doc, '以下是完整的体系选择矩阵表格：')

    # 体系选择矩阵大表
    add_table(doc,
              ['风格\\质量需求',
               '组件重用\n(权重4)',
               '组件更换\n(权重4)',
               '组件移位\n(权重3)',
               '组件无关\n(权重3)',
               '组件互通\n(权重4)',
               '接口变换\n(权重3)',
               '计算性能\n(权重2)',
               '节省空间\n(权重1)',
               '容错\n(权重3)',
               '选择分'],
              [
                  ['管道-过滤器', '5', '5', '1', '5', '5', '2', '5', '1', '1', '98'],
                  ['面向对象', '5', '5', '5', '1', '5', '1', '4', '5', '1', '97'],
                  ['事件驱动', '5', '5', '5', '5', '2', '1', '4', '4', '5', '108'],
                  ['层次（分层）', '3', '5', '1', '4', '5', '4', '2', '1', '1', '87'],
                  ['仓库', '5', '5', '5', '3', '4', '1', '4', '5', '2', '102'],
                  ['客户-服务器', '5', '5', '5', '3', '5', '1', '3', '5', '1', '101'],
                  ['对等（P2P）', '5', '5', '5', '1', '5', '1', '4', '3', '5', '107'],
              ])

    add_paragraph(doc, '各风格选择分的详细计算过程如下：')

    add_paragraph(doc, '管道-过滤器风格：4×5 + 4×5 + 3×1 + 3×5 + 4×5 + 3×2 + 2×5 + 1×1 + 3×1 = 20+20+3+15+20+6+10+1+3 = 98。该风格在组件重用（每个过滤器可独立复用）、组件更换（过滤器可替换）、组件无关（每个过滤器独立）、组件互通（数据通过管道流动）和计算性能（流式处理效率高）方面表现出色。但它在组件移位（管道连接紧密耦合在特定拓扑中）和容错（单点过滤器故障影响整条管道）方面得分较低。')

    add_paragraph(doc, '面向对象风格：4×5 + 4×5 + 3×5 + 3×1 + 4×5 + 3×1 + 2×4 + 1×5 + 3×1 = 20+20+15+3+20+3+8+5+3 = 97。该风格在组件重用（对象封装支持复用）、组件更换（接口替换实现多态）和组件互通（消息传递）方面表现出色。但它在组件无关（对象间存在复杂的依赖关系）和接口变换（对象接口变更影响所有调用者）方面得分较低。')

    add_paragraph(doc, '事件驱动风格：4×5 + 4×5 + 3×5 + 3×5 + 4×2 + 3×1 + 2×4 + 1×4 + 3×5 = 20+20+15+15+8+3+8+4+15 = 108。该风格在几乎所有维度上表现优异，尤其突出的是组件无关（事件发布者和订阅者完全解耦）和容错（事件丢失可通过重试机制补偿）。唯一的弱项是接口变换（事件格式变更影响所有订阅者）和组件互通（事件通信缺乏同步请求-响应模式的直观性）。')

    add_paragraph(doc, '层次（分层）风格：4×3 + 4×5 + 3×1 + 3×4 + 4×5 + 3×4 + 2×2 + 1×1 + 3×1 = 12+20+3+12+20+12+4+1+3 = 87。该风格在组件更换（层次可替换）和组件互通（层间接口明确）方面表现出色。弱项在于组件移位（层紧密耦合在同一进程中）和计算性能（高层调用需穿透多层）。')

    add_paragraph(doc, '仓库风格：4×5 + 4×5 + 3×5 + 3×3 + 4×4 + 3×1 + 2×4 + 1×5 + 3×2 = 20+20+15+9+16+3+8+5+6 = 102。该风格在数据集中管理和组件重用方面有天然优势。弱项在于接口变换（数据库Schema变更影响所有处理单元）和容错（中央仓库是单点故障）。')

    add_paragraph(doc, '客户-服务器风格：4×5 + 4×5 + 3×5 + 3×3 + 4×5 + 3×1 + 2×3 + 1×5 + 3×1 = 20+20+15+9+20+3+6+5+3 = 101。该风格是本项目的基础框架风格，在组件互通（HTTP通信）和组件移位（前后端独立部署）方面优势明显。弱项是接口变换（API契约变更影响所有客户端）和容错（服务器单点故障）。')

    add_paragraph(doc, '对等（P2P）风格：4×5 + 4×5 + 3×5 + 3×1 + 4×5 + 3×1 + 2×4 + 1×3 + 3×5 = 20+20+15+3+20+3+8+3+15 = 107。该风格在组件移位（节点可自由加入离开）、组件互通（点对点直接通信）和容错（无中心节点单点故障）方面表现出色。但该风格本身并不适合本项目的中心化服务架构需求。')

    # 6.3
    add_section_heading(doc, '6.3  结果分析与最终选择')

    add_paragraph(doc, '根据体系选择矩阵的计算结果，各风格的等级划分如下：')

    add_paragraph(doc, '事件驱动风格：选择分108，占比108/135=80.0%，等级为◎（非常适合）。该风格在所有质量需求维度上的综合表现最佳，与本项目的实时通信、异步处理和松耦合需求高度匹配。')

    add_paragraph(doc, '对等风格：选择分107，占比107/135=79.3%，等级为○（适合）。该风格在数学得分上接近事件驱动，但其去中心化特性与本项目的客户-服务器架构需求存在根本性矛盾，因此不适合作为主风格。')

    add_paragraph(doc, '仓库风格：选择分102，占比102/135=75.6%，等级为○（适合）。该风格在数据集中管理方面的优势与本项目的MongoDB数据持久层需求高度吻合。')

    add_paragraph(doc, '客户-服务器风格：选择分101，占比101/135=74.8%，等级为○（适合）。该风格是本项目的天然基础框架——Web应用本质上就是客户-服务器架构。')

    add_paragraph(doc, '管道-过滤器风格：选择分98，占比98/135=72.6%，等级为○（适合）。该风格在AI分析管道这一特定子系统中表现出色，但在其他子系统中的适用性有限。')

    add_paragraph(doc, '面向对象风格：选择分97，占比97/135=71.9%，等级为○（适合）。该风格是一种基础性的组织风格，几乎在所有现代软件项目中都会不同程度地采用，但单独使用时缺乏特定的架构优势。')

    add_paragraph(doc, '层次（分层）风格：选择分87，占比87/135=64.4%，等级为△（尚可）。该风格在代码组织方面有价值，但其固有的性能开销和灵活性受限问题使其不适合单独作为系统的主风格。')

    add_paragraph(doc, '综合以上分析，本项目最终采用了混合体系结构风格策略：以客户-服务器（B/S架构）为基础框架，以事件驱动风格支撑实时通信子系统，以仓库风格管理数据持久层，以管道-过滤器风格组织AI分析流程，以分层架构组织代码结构，以MVVM模式驱动前端界面，以面向对象风格作为贯穿全局的基本组织原则。这种混合策略综合了各风格的优点，同时避免了单一风格在某些维度上的不足。例如，事件驱动风格在接口变换方面得分较低（1分），但分层架构在接口变换方面得分较高（4分），两者混合后可以通过分层抽象来缓解事件接口变更的影响。')

    add_paragraph(doc, '通过体系选择矩阵的分析，我们还识别出了本项目需要重点关注的弱项维度：接口变换（多种风格得分均偏低，需要建立严格的API版本管理机制）和计算性能（AI分析的高延迟需要在产品层面与用户预期进行管理）。这些弱项将在第七章的质量评估中进一步讨论具体的缓解措施。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第七章：软件体系结构质量评估
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第七章  软件体系结构质量评估')

    add_paragraph(doc, '赵庆玲老师在《软件体系结构》课程第3章中指出："软件体系结构影响质量的两种方式：结构（因为组件之间的关联影响的质量）和实现（采用不同的实现方法影响的质量）。"体系结构的质量评估是对系统非功能需求的系统性验证，它确保体系结构设计不仅满足了功能需求，也在性能、安全性、可用性等质量维度上达到了预期的标准。本章从性能、安全性、可用性、可维护性、可靠性和可扩展性六个维度对"掌上金铲铲"项目的体系结构进行全面的质量评估。')

    # 7.1
    add_section_heading(doc, '7.1  性能评估')

    add_paragraph(doc, '性能是Web应用最关键的非功能性需求之一。本项目在体系结构层面采用了多项性能优化措施。在前端，Vite 5构建工具在打包阶段执行了Tree Shaking（移除未使用的代码）、代码分割（按路由拆分Chunk，首屏只加载必要代码）和资源压缩（CSS/JS Minify），确保前端静态资源体积最小化。在生产部署中，Nginx配置了Gzip压缩（对text/html、application/javascript、text/css、application/json等文本资源进行实时压缩，压缩比通常达到70%以上）和静态资源缓存（图片和字体文件设置7天过期时间，max-age=604800），大幅减少了客户端重复下载的资源量。')

    add_paragraph(doc, '在后端，MongoDB建立了针对常用查询字段的数据库索引（如heroes集合的cost字段索引、lineups集合的author和createdAt复合索引），将查询时间从全表扫描的O(n)优化为B树索引的O(log n)。API层面实施了频率限制（express-rate-limit中间件），对登录接口设置了严格的1分钟5次限制以防止暴力破解，对普通API接口设置了1分钟100次的请求上限以防止滥用。AI分析功能采用了异步处理模式——前端提交分析任务后不阻塞等待，后端通过WebSocket异步推送结果，避免了同步等待对用户体验的影响。')

    # 7.2
    add_section_heading(doc, '7.2  安全性评估')

    add_paragraph(doc, '安全性是任何面向用户的Web应用的生命线。本项目在安全方面的体系结构决策包括：第一，身份认证方面，采用JWT（JSON Web Token）无状态认证机制。用户登录成功后，服务器生成一个签名的JWT Token返回给客户端，客户端在后续的每次API请求中通过Authorization: Bearer <token>头携带该Token。服务器端的authMiddleware中间件在请求到达Controller之前验证Token的签名和有效期。由于Token中已经包含了用户身份信息（user ID和role），服务器无需维护会话状态，从而天然支持水平扩展。JWT Token的签名密钥（JWT_SECRET）通过环境变量注入，不硬编码在代码中。')

    add_paragraph(doc, '第二，密码安全方面，用户密码使用bcryptjs库进行加盐哈希存储。bcryptjs的盐值（Salt）是随机生成的，计算成本因子（cost factor）设置为12，这意味着单次哈希计算需要约300ms——该时间对于正常登录流程完全可接受，但对于暴力破解攻击则是巨大的计算成本障碍（每秒仅能尝试约3次）。即使用户数据意外泄露，攻击者也无法从bcrypt哈希中反向恢复明文密码。')

    add_paragraph(doc, '第三，Web安全方面，后端集成了Helmet中间件，它通过设置一系列HTTP安全响应头来防御常见的Web攻击：Content-Security-Policy（限制可加载资源的来源）、X-Frame-Options（防止点击劫持）、X-Content-Type-Options（防止MIME类型嗅探）、Strict-Transport-Security（强制HTTPS连接）等。CORS（跨域资源共享）配置了白名单机制，只允许特定域名的前端请求访问API，拒绝了来自未授权源的跨域请求。')

    add_paragraph(doc, '第四，授权控制方面，系统实现了管理员权限中间件（adminMiddleware），在需要管理员权限的路由（如内容审核、用户管理、数据导入导出等）上附加该中间件。中间件检查req.user.role是否为\'admin\'，非管理员用户的请求被立即拒绝并返回403 Forbidden。这种基于中间件的统一授权控制避免了在每个Controller中分散检查权限的安全漏洞。')

    # 7.3
    add_section_heading(doc, '7.3  可用性评估')

    add_paragraph(doc, '可用性（Usability）关注的是用户使用系统的便捷性和满意度。在"掌上金铲铲"项目中，体系结构层面的可用性设计主要体现在以下几个方面。第一，系统提供了8套主题方案（包括浅色模式和深色模式的多个色彩变体），用户可以在设置页面自由切换。主题切换的实现利用了CSS变量（Custom Properties），当用户选择新主题时，根元素的CSS变量集合被批量替换，整个页面的颜色方案即时变化。这一设计的体系结构基础是主题配置与组件样式的分离——Vue组件只使用CSS变量名称而不硬编码颜色值。')

    add_paragraph(doc, '第二，系统采用响应式设计，页面布局能够自动适应不同尺寸的屏幕。从桌面端的宽屏布局到平板端的中等布局再到手机端的紧凑布局，Element Plus的栅格系统（el-row和el-col组件）和Tailwind CSS的响应式类（sm:、md:、lg:、xl:前缀）共同保障了多端一致的用户体验。第三，用户界面采用了直观的导航结构——顶部导航栏、侧边功能菜单和面包屑导航层级分明，用户始终清楚自己当前在系统中的位置以及如何返回上级页面。Element Plus组件库的标准化交互模式（如表单验证提示、加载动画、确认对话框）也为用户提供了熟悉和可预期的操作体验。')

    # 7.4
    add_section_heading(doc, '7.4  可维护性评估')

    add_paragraph(doc, '可维护性是软件长期演化的关键保障。本项目的体系结构在可维护性方面的优势主要体现在以下方面。第一，前后端完全分离的架构使得前端和后端可以独立维护。当需要修改UI布局或添加新的视觉功能时，只需修改前端代码；当需要调整业务逻辑或数据库结构时，只需修改后端代码。两者的解耦避免了"牵一发而动全身"的维护困境。')

    add_paragraph(doc, '第二，模块化的代码组织使得定位和修复Bug更加高效。当系统报告某个API接口返回错误时，开发者可以根据URL路径迅速定位到对应的Route文件（如/api/lineups路由在lineupRoutes.js中定义），进而追踪到对应的Controller方法（如lineupController.getAll()），再追踪到对应的Model操作（如Lineup.find()）。这种清晰的调用链使得问题排查的范围被精确限定。')

    add_paragraph(doc, '第三，统一的API封装（Services层的apiClient.js）使得当需要修改全局的HTTP请求行为时（如添加新的请求头、修改超时时间、调整错误处理逻辑），只需修改一处代码即可影响所有API调用。第四，数据驱动的系统设计使得游戏赛季数据的更新不需要修改任何代码。当新赛季上线时，管理员在后台导入新的英雄、装备和羁绊数据即可，前端阵容库、装备图鉴等所有相关页面自动展示新数据。这种设计显著降低了游戏这类频繁内容更新场景的维护成本。')

    # 7.5
    add_section_heading(doc, '7.5  可靠性评估')

    add_paragraph(doc, '可靠性是系统在异常情况下仍能提供基本服务的能力。本项目的可靠性设计体现在多个层面。数据加载方面，前端实现了"成功则更新，失败则回退"的容错策略（详见过程视图中的"数据加载管道"流程描述）。当网络中断或服务器故障导致API请求失败时，前端从LocalStorage中读取上次成功缓存的旧数据继续展示，同时显示警告提示，用户的核心浏览功能不会完全中断。')

    add_paragraph(doc, '数据库连接方面，Mongoose配置了自动重连机制。当MongoDB服务因故障短暂不可用时，Mongoose会在指定的重试间隔（默认每5秒）内自动尝试重新连接，重连成功后恢复正常的数据操作。在重试期间，新的API请求会收到503 Service Unavailable响应，前端据此显示"系统维护中"的提示。这种设计避免了因数据库瞬时故障导致的整个服务崩溃。')

    add_paragraph(doc, 'AI分析方面，多帧交叉验证机制（FrameValidator）过滤了AI模型的偶发性误判和异常输出。只有当连续多帧（默认3帧）的分析结果保持一致时，建议才会被推送给用户。如果某帧的AI返回结果与历史帧存在显著差异（通过文本相似度比较），该帧结果被视为噪声并丢弃。这种设计显著降低了AI幻觉（Hallucination）对用户决策的误导风险。')

    add_paragraph(doc, 'Vue组件的错误边界处理方面，父组件使用Vue 3的onErrorCaptured钩子捕获子组件中抛出的未被处理的异常，在捕获异常后显示降级UI（如"该模块暂时不可用"的提示卡片），而不是让整个页面崩溃显示白屏。这种渐进式的错误处理策略保证了单个组件的故障不会扩散为整个应用的不可用。')

    # 7.6
    add_section_heading(doc, '7.6  可扩展性评估')

    add_paragraph(doc, '可扩展性是系统在需求增长或变化时能够以最小的代价进行适应和扩展的能力。本项目的可扩展性设计主要体现在以下方面。Docker容器编排方案使得服务扩展非常简单——如果需要应对增加的用户流量，只需在docker-compose.yml中增加后端容器的副本数量（scale backend=3），并在Nginx配置中添加负载均衡的upstream块即可实现后端服务的水平扩展。')

    add_paragraph(doc, 'RESTful API规范使得前端和后端可以独立扩展。如果未来需要开发移动端原生应用（iOS/Android），后端API无需任何修改即可服务于新的客户端类型。只需在CORS白名单中添加移动端的域名即可。如果未来需要使用关系型数据库（如PostgreSQL）替代MongoDB来满足更复杂的事务需求，只需替换Models层的实现（用Sequelize替代Mongoose），Routes层和Controllers层无需修改（因为它们只依赖于Models的接口，不依赖于具体实现）。')

    add_paragraph(doc, 'AI模型的可插拔架构使得系统可以跟随AI技术的快速发展而持续升级。当新的更强大的视觉大模型发布时（如通义千问的下一代版本或其他厂商的新模型），开发者只需创建一个新的Analyzer子类实现analyze()接口，并在配置中注册即可完成接入，无需修改任何核心处理逻辑。这种面向接口编程的设计原则赋予了AI子系统极高的技术适应性。')

    add_paragraph(doc, '数据版本管理方面，系统在数据库设计中为赛季数据保留了season字段，支持多赛季数据的共存和历史查询。当S9赛季替换S8赛季时，旧数据不会被删除而是被归档保留（isArchived: true）。这种设计使得用户可以回看历史赛季的阵容和数据分析，也使得系统可以支持"经典赛季模式"等特殊玩法的数据回溯。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第八章：体系结构的设计与实现
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第八章  体系结构的设计与实现')

    add_paragraph(doc, '赵庆玲老师在《软件体系结构》课程第14章中系统讲授了软件体系结构设计的一般原则和实践中面临的常见威胁。本章结合课程内容，从设计原则的应用和体系结构面临的威胁与对策两个维度对"掌上金铲铲"项目的体系结构设计与实现进行总结性分析。')

    # 8.1
    add_section_heading(doc, '8.1  设计原则的应用')

    add_paragraph(doc, '本项目在体系结构设计过程中，严格遵循了赵庆玲老师课件中讲授的软件体系结构设计原则。这些原则从一般原则和关键原则两个层面指导了项目的体系结构决策。')

    add_paragraph(doc, '在一般原则方面：第一，商业原则——企业利益最大化。本项目的所有技术选型和架构设计都以满足核心用户需求为出发点，不做脱离实际需求的技术炫技。选择成熟稳定的技术栈（Vue 3、Express、MongoDB）而非新兴但不够稳定的技术，确保项目能够按时交付并提供可靠的服务。第二，数据原则——数据资产。系统的核心数据（英雄数据、装备数据、阵容数据和用户内容）被存储在持久化的MongoDB数据库中，并建立了定期备份机制。数据安全通过加密（密码bcrypt哈希、JWT签名验证）和认证（Token验证、权限中间件）多层级保护。数据访问通过统一规范的RESTful API接口，实现了数据访问的受控性和可审计性。第三，应用程序原则——技术独立性。前后端完全分离的架构使得前端技术栈（Vue 3/Vite）和后端技术栈（Express/MongoDB）可以独立演化。如果需要用React重写前端，后端无需任何修改。第四，技术原则——需求变化的响应能力。通过数据驱动设计，系统可以在不修改代码的情况下适应游戏赛季内容的更新。通过面向接口编程，AI模型可以在不影响核心逻辑的情况下进行替换和升级。')

    add_paragraph(doc, '在关键原则方面：第一，关注分离点（Separation of Concerns）。系统在多个层次上实现了关注分离——前端与后端分离、UI与业务逻辑分离（Views vs Stores/Services）、路由与控制器分离（Routes vs Controllers）、业务逻辑与数据访问分离（Controllers vs Models）。这种多层次的分离使得系统的每个部分都专注于解决一类特定的问题。')

    add_paragraph(doc, '第二，单一职责原则（Single Responsibility Principle）。每个Vue组件只负责一个视图或一个UI部件的渲染；每个Express Controller方法只负责一个API端点的业务处理；每个Mongoose Model只负责一种数据实体的结构定义和数据库操作。当需要修改某个功能时，开发者可以精确定位到唯一相关的代码单元。')

    add_paragraph(doc, '第三，最少知识原则（Law of Demeter/Principle of Least Knowledge）。Vue组件通过Props和Events进行父子通信，不直接访问其他组件的内部状态（不通过$parent或$refs直接修改其他组件的数据）。Pinia Store作为各组件的数据中介，组件只需要知道Store提供的接口，不需要知道数据来自哪个API、存储在哪个Model中。')

    add_paragraph(doc, '第四，DRY原则（Don\'t Repeat Yourself）。通用的HTTP请求逻辑被封装在Services层的apiClient.js中（包括Base URL设置、请求拦截器、响应拦截器、超时配置），所有具体的Service模块（如lineupService.js）复用这个封装。通用的用户认证和授权逻辑被封装在authMiddleware和adminMiddleware中，所有需要保护的Route只需引用这些中间件即可。通用的UI组件（如LoadingSpinner、Pagination、ConfirmDialog）被封装为可复用的全局组件。')

    add_paragraph(doc, '第五，尽量减小前期设计（Minimize Upfront Design）。本项目采用了MVP（最小可行产品）迭代开发策略：第一个迭代周期实现核心的阵容浏览和装备图鉴功能，验证基本的技术栈和架构方向；第二个迭代周期增加阵容模拟器和社区系统，验证分层架构和仓库风格的可扩展性；第三个迭代周期引入AI分析功能，验证管道-过滤器风格和事件驱动架构的可行性。这种渐进式的开发方式使得体系结构设计能够基于实际开发中的反馈不断调整和完善，避免了一次性过度设计带来的浪费。')

    # 8.2
    add_section_heading(doc, '8.2  体系结构面临的威胁与对策')

    add_paragraph(doc, '赵庆玲老师在课件第14章第43-49页总结了软件体系结构实践中面临的六大威胁。以下逐一分析这些威胁在"掌上金铲铲"项目中的体现及我们的应对策略：')

    # 威胁表
    add_table(doc,
              ['体系结构威胁', '本项目中的应对策略'],
              [
                  ['被忽略的非功能需求', '在项目初期即明确定义了安全性（JWT+bcrypt+Helmet）、性能（响应时间<200ms，AI<3000ms）、可用性（响应式设计+8套主题+直观导航）等非功能需求，并将其纳入体系结构设计的约束条件中。API限流和回退机制进一步保障了系统的稳定运行。'],
                  ['频繁变化的需求', '核心业务领域（游戏数据模型、阵容管理、社区系统）的体系结构保持稳定，因为这些需求在可预见的赛季更新中不会发生根本性变化。AI模型选择这类易变的需求被设计为可插拔的接口，其变化不影响核心架构。数据驱动设计使得游戏内容的更新（新英雄、新装备）通过数据导入即可完成，无需架构调整。'],
                  ['考虑不全面的设计', '通过4+1视图模型从逻辑、过程、开发、物理和场景五个互补视角全方位地描述体系结构，避免了单一视角可能产生的盲区。场景视图通过具体的用户用例验证了各视图元素的协调性。'],
                  ['不及时的验证', '在开发过程中持续执行功能测试和性能测试。每个迭代周期结束时，运行覆盖核心用户场景的功能测试用例；在重大里程碑节点，使用JMeter进行压力测试。这种持续的验证策略确保体系结构问题在早期就被发现和修正，而不是在后期暴露出难以修复的架构缺陷。'],
                  ['过高的创新比重', '严格遵循"80%成熟技术+20%创新"的原则。80%的技术选择（Vue 3、Express、MongoDB、Docker、Nginx）均为业界广泛使用且社区丰富的成熟技术，降低了技术风险。20%的创新部分集中在AI视觉大模型的实时对战指导功能，这是项目的核心竞争力所在。即使AI功能存在不确定性，系统的核心业务功能（阵容、装备、社区）不受影响。'],
                  ['低可执行性', '通过Docker容器化部署确保开发环境、测试环境和生产环境的高度一致性。docker-compose.yml一键启动脚本使得任何开发者（或运维人员）可以在5分钟内从零搭建完整的运行环境，避免了环境配置差异导致的"在我机器上没问题"的困境。'],
              ])

    add_paragraph(doc, '通过以上六大威胁的系统性识别和针对性应对，"掌上金铲铲"项目的体系结构在设计的全面性、实现的可行性和未来的可演化性方面得到了充分保障。正如赵庆玲老师在课程中所强调的：优秀的体系结构设计不是面面俱到的完美规划，而是在充分识别风险和权衡取舍的基础上，做出当下最优的、面向未来的决策。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 第九章：总结与展望
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '第九章  总结与展望')

    # 9.1
    add_section_heading(doc, '9.1  项目总结')

    add_paragraph(doc, '"掌上金铲铲"是一个面向《金铲铲之战》S8赛季"怪兽入侵"的全栈Web游戏辅助平台。项目成功构建了一个功能完整的软件系统，涵盖了阵容模拟器、装备合成图鉴、卡池概率追踪器、经济计算器、AI实时对战指导、论坛社区系统和用户管理后台等七大核心功能模块。系统在技术实现上贯彻了前后端完全分离、RESTful API通信、JWT无状态认证、Docker容器化部署等现代Web应用的最佳实践。')

    add_paragraph(doc, '在软件体系结构层面，本项目取得了以下五个重要成果：')

    add_paragraph(doc, '第一，采用了科学的混合体系结构风格。项目不是简单地套用某一种风格，而是根据系统不同子系统的特点，有针对性地选择了B/S架构（整体框架）、分层架构（代码组织）、MVVM模式（前端驱动）、事件驱动架构（实时通信）、管道-过滤器风格（AI分析）、仓库风格（数据管理）和面向对象风格（全局组织）等七种风格的有机组合。')

    add_paragraph(doc, '第二，运用4+1视图模型进行了全面的体系结构描述。逻辑视图识别了六大核心子系统及其类关系；过程视图分析了四类主任务和三类辅助任务的并发执行机制；开发视图规划了前端四层和后端四层的代码组织架构；物理视图设计了基于Docker三容器的部署拓扑；场景视图通过四个关键用例串联验证了所有视图元素的协调性。')

    add_paragraph(doc, '第三，应用体系选择矩阵法科学地验证了风格选择的合理性。通过对七种候选风格、九个质量需求维度的量化评估，计算出了各风格的选择分和等级，确认了事件驱动风格（108/135分，◎等级）和客户-服务器风格（101/135分，○等级）在项目中的核心地位。')

    add_paragraph(doc, '第四，从性能、安全性、可用性、可维护性、可靠性和可扩展性六个维度系统性地评估了体系结构的质量属性，确认了设计在各个质量维度上均达到了预期标准。')

    add_paragraph(doc, '第五，深入识别了体系结构实践中面临的六大威胁，并针对每个威胁制定了切实可行的应对策略，确保了体系结构设计的鲁棒性和实用性。')

    # 9.2
    add_section_heading(doc, '9.2  创新点')

    add_paragraph(doc, '本项目的核心创新点体现在以下三个方面：')

    add_paragraph(doc, '第一，AI视觉大模型实时对战指导。本项目首次将大语言视觉模型（LVLM）应用于《金铲铲之战》的实时对局场景。传统的游戏辅助工具依赖静态数据和预设规则，而本项目的AI指导功能通过实时分析游戏画面，结合当前回合的具体局势（血量、经济、阵容、装备）给出动态的、个性化的决策建议。这一功能突破了传统游戏辅助工具的"静态查询"模式，迈向了"智能顾问"的新范式。')

    add_paragraph(doc, '第二，多帧交叉验证提高AI准确率。针对大语言模型可能产生的幻觉（Hallucination）问题——即AI模型在不确定时依然自信地给出错误建议——本项目创新性地引入了FrameValidator多帧交叉验证机制。通过连续多帧的一致性检查，系统能够在源头上过滤掉AI模型的偶发性错误输出，将可靠建议的准确率从单帧的约75%提升至多帧验证后的约90%以上。这一机制不仅在《金铲铲之战》场景中有效，也为其他需要AI实时分析的视觉应用场景提供了可复用的设计模式。')

    add_paragraph(doc, '第三，数据驱动的赛季热更新机制。传统游戏辅助工具在赛季更新时通常需要发布新版本的客户端软件，用户需要手动下载更新。本项目通过数据驱动的设计，将游戏数据（英雄、装备、羁绊）与代码逻辑完全分离，新赛季的数据更新只需管理员在后台导入新的数据文件即可，前端用户无需任何操作即可立即看到适配新赛季的阵容推荐和装备图鉴。这一机制显著提升了用户的使用体验和系统的运营效率。')

    # 9.3
    add_section_heading(doc, '9.3  未来展望')

    add_paragraph(doc, '基于当前"掌上金铲铲"项目的体系结构基础和实现成果，我们规划了以下四个方向的未来发展：')

    add_paragraph(doc, '第一，支持更多赛季和游戏模式。当前系统围绕《金铲铲之战》S8赛季进行设计，但体系结构中的数据驱动设计和season字段的多版本管理机制已经为后续赛季的扩展做好了准备。未来可以支持S9"符文大陆传说"、S10等后续赛季，甚至可以扩展支持其他自走棋类游戏（如《云顶之弈》），只需导入对应的游戏数据和调整AI模型的提示词即可。')

    add_paragraph(doc, '第二，PWA（渐进式Web应用）移动端适配。当前系统为响应式Web设计，在移动端浏览器中可以正常使用，但缺乏离线缓存和推送通知等原生体验。未来计划将前端改造为PWA应用，利用Service Worker实现离线数据缓存（使用户即使在网络不稳定的对局中也能查看缓存的阵容和装备数据），利用Web Push API实现实时通知（如好友私信、评论回复的系统推送通知）。体系结构的前后端分离和RESTful API为PWA改造提供了良好的基础，改造工作主要集中在前端层面。')

    add_paragraph(doc, '第三，AI模型微调（Fine-tuning）。当前AI分析功能依赖通用的大语言视觉模型（通义千问qwen3-vl-plus和智谱AI glm-4v-flash），这些模型的通用训练决定了它们对《金铲铲之战》特定术语和场景的理解可能不够精准。未来计划收集带有人工标注的游戏画面-建议对数据集，对开源视觉模型进行领域微调（Domain Fine-tuning），使AI模型精准掌握《金铲铲之战》的游戏术语、策略知识和分析逻辑，从而将AI建议的准确性和相关性提升到专业玩家的水平。')

    add_paragraph(doc, '第四，个性化推荐算法。当前系统的阵容推荐基于全局热门度排序，未能考虑每个玩家的个人偏好和历史表现。未来计划引入协同过滤（Collaborative Filtering）和基于内容的推荐（Content-Based Recommendation）算法，分析玩家的阵容使用历史、对局数据、关注的社区内容和点赞收藏行为，为每位玩家提供个性化的阵容推荐和装备建议。推荐系统的引入将在现有仓库风格的基础上增加推荐引擎这一新的处理单元，与现有系统通过RESTful API进行数据交互。')

    add_paragraph(doc, '综上所述，"掌上金铲铲"项目不仅成功构建了一个功能完备、性能可靠的全栈Web游戏辅助平台，更通过科学严谨的软件体系结构设计方法论——混合体系结构风格、4+1视图模型和体系选择矩阵法——确保了系统在当前阶段的高质量交付和在未来的可持续演化。本项目是赵庆玲老师《软件体系结构》课程理论在真实软件工程实践中的一次完整而深入的检验，充分证明了软件体系结构作为软件工程核心学科的实用价值和指导意义。')

    add_page_break(doc)

    # ═══════════════════════════════════════════════════════════
    # 参考文献
    # ═══════════════════════════════════════════════════════════
    add_chapter_heading(doc, '参考文献')

    refs = [
        '[1]  Philippe Kruchten, "Architectural Blueprints—The 4+1 View Model of Software Architecture", IEEE Software 12(6), pp. 42-50, November 1995.',
        '[2]  赵庆玲, 《软件体系结构》课程课件, 南京理工大学计算机科学与工程学院, 2024.',
        '[3]  Len Bass, Paul Clements, Rick Kazman, "Software Architecture in Practice", 3rd Edition, Addison-Wesley Professional, 2012.',
        '[4]  Mary Shaw, David Garlan, "Software Architecture: Perspectives on an Emerging Discipline", Prentice Hall, 1996.',
        '[5]  Vue 3 官方文档, https://cn.vuejs.org.',
        '[6]  Express.js 官方文档, https://expressjs.com.',
        '[7]  MongoDB 官方文档, https://docs.mongodb.com.',
        '[8]  Socket.IO 官方文档, https://socket.io.',
        '[9]  Docker 官方文档, https://docs.docker.com.',
        '[10] 阿里云通义千问API文档, https://help.aliyun.com/document_detail/qwen-vl-plus.html.',
        '[11] 智谱AI GLM-4V API文档, https://open.bigmodel.cn/dev/api/glm-4v.',
        '[12] Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, "Design Patterns: Elements of Reusable Object-Oriented Software", Addison-Wesley Professional, 1994.',
        '[13] Robert C. Martin, "Clean Architecture: A Craftsman\'s Guide to Software Structure and Design", Prentice Hall, 2017.',
    ]

    for ref in refs:
        add_paragraph(doc, ref, first_indent=Cm(0), space_after=Pt(4))

    # ─── 页面设置和页脚 ───
    setup_page(doc)
    add_footer_page_numbers(doc)

    # ─── 保存 ───
    output_path = r'c:\Users\29364\Documents\trae_projects\heihei\掌上金铲铲_软件体系结构文档.docx'
    temp_path = r'c:\Users\29364\Documents\trae_projects\heihei\_temp_output.docx'
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    doc.save(temp_path)
    # Try to overwrite the target file
    try:
        os.replace(temp_path, output_path)
        print(f'文档已成功生成：{output_path}')
    except PermissionError:
        print(f'目标文件被占用，文档已保存至：{temp_path}')
        print(f'请关闭占用程序后手动重命名为：{os.path.basename(output_path)}')
    print(f'文件大小：{os.path.getsize(output_path if os.path.exists(output_path) else temp_path) / 1024:.1f} KB')


if __name__ == '__main__':
    build_document()