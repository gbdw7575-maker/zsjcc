#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate 5 professional architecture diagrams for 掌上金铲铲 project."""

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Arc, Rectangle, Polygon
from matplotlib.path import Path
import matplotlib.lines as mlines
import numpy as np
import os

# ── Global style settings ──────────────────────────────────────────────
plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["font.size"] = 11

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Color palette – clean, print-friendly
C_BLUE   = "#2B5797"
C_BLUE_L = "#D6E4F0"
C_GREEN  = "#2E7D32"
C_GREEN_L= "#E0F2E1"
C_ORANGE = "#E65100"
C_ORANGE_L="#FFF3E0"
C_PURPLE = "#6A1B9A"
C_PURPLE_L="#F3E5F5"
C_RED    = "#B71C1C"
C_RED_L  = "#FFEBEE"
C_TEAL   = "#00695C"
C_TEAL_L = "#E0F2F1"
C_GRAY   = "#37474F"
C_GRAY_L = "#ECEFF1"
C_GOLD   = "#F57F17"
C_GOLD_L = "#FFF8E1"

BOX_STYLE = dict(boxstyle="round,pad=0.4", edgecolor="#333333", facecolor="white", linewidth=1.5)
ARROW_STYLE = dict(arrowstyle="->", color="#333333", lw=1.8, connectionstyle="arc3,rad=0")


def add_title(ax, title, subtitle="", y=0.96):
    """Add a centered title and subtitle at the top of the axes."""
    ax.text(0.5, y, title, transform=ax.transAxes, ha="center", va="top",
            fontsize=17, fontweight="bold", color="#1a1a1a")
    if subtitle:
        ax.text(0.5, y - 0.06, subtitle, transform=ax.transAxes, ha="center", va="top",
                fontsize=11, color="#555555", style="italic")


def save_fig(fig, name):
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=300, bbox_inches="tight", facecolor="white", edgecolor="none")
    print(f"  Saved: {path}")
    plt.close(fig)


def draw_rounded_box(ax, xy, width, height, text_lines, color=C_BLUE, text_color="white",
                     fontsize=10, title_fontsize=12):
    """Draw a rounded rectangle with centered text. text_lines[0] is the title."""
    x, y = xy
    face = color
    box = FancyBboxPatch((x, y), width, height, boxstyle="round,pad=0.3",
                         facecolor=face, edgecolor="#222222", linewidth=1.3)
    ax.add_patch(box)
    # Title
    ax.text(x + width / 2, y + height - 0.22, text_lines[0], ha="center", va="center",
            fontsize=title_fontsize, fontweight="bold", color=text_color)
    # Attributes
    for i, line in enumerate(text_lines[1:]):
        ax.text(x + width / 2, y + height - 0.42 - i * 0.20, line, ha="center", va="center",
                fontsize=fontsize - 1, color=text_color, alpha=0.9)


def draw_arrow(ax, start, end, label="", color="#333333", lw=1.5, style="->",
               text_offset=(0, 0.08), fontsize=9):
    """Draw an arrow between two points with an optional label."""
    arrow = FancyArrowPatch(start, end, arrowstyle=style, color=color, lw=lw,
                            mutation_scale=18)
    ax.add_patch(arrow)
    if label:
        mid_x = (start[0] + end[0]) / 2 + text_offset[0]
        mid_y = (start[1] + end[1]) / 2 + text_offset[1]
        ax.text(mid_x, mid_y, label, fontsize=fontsize, color=color, ha="center", va="center",
                fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.15", facecolor="white", edgecolor="none", alpha=0.85))


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Diagram 1: 逻辑视图 — 类关系图                                    ║
# ╚══════════════════════════════════════════════════════════════════════╝
def draw_class_diagram():
    """逻辑视图 — 拆为两张图：图4-1a 核心业务类 + 图4-1b 社交与AI"""
    fig, ax = plt.subplots(figsize=(16, 10))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis("off")
    add_title(ax, "逻辑视图 — 类关系图 (4-1a) 业务域类", "用户、管理、棋盘、游戏数据 — 4个子系统 13个核心类", y=0.99)

    BW, BH = 1.60, 1.05

    classes = {
        # Row 1 (y=8.10): 用户子系统 — 3 classes, span center
        "User":       ((2.50, 8.10), [C_BLUE,   "User\n用户", "nickname", "avatar_url", "role"]),
        "Auth":       ((4.70, 8.10), [C_TEAL,   "Auth\n认证服务", "genToken()", "verifyToken()", "refreshToken()"]),
        "TeamLineup": ((6.90, 8.10), [C_BLUE,   "TeamLineup\n小队阵容", "lineup_name", "heroes[]", "isPublic"]),

        # Row 2 (y=6.65): 管理子系统 — 2 classes
        "Admin":      ((4.00, 6.65), [C_PURPLE, "Admin\n管理员", "permLevel", "auditPost()", "manageUser()"]),
        "Announcement":((6.20, 6.65),[C_PURPLE, "Announcement\n公告", "title", "content", "publishAt"]),

        # Row 3 (y=5.20): 棋盘子系统 — 3 classes
        "Board":      ((2.50, 5.20), [C_ORANGE, "Board\n棋盘", "cells[8][7]", "addChess()", "calcSyn()"]),
        "Cell":       ((4.70, 5.20), [C_ORANGE, "Cell\n格位", "row", "col", "occupant"]),
        "Chess":      ((6.90, 5.20), [C_ORANGE, "Chess\n棋子实例", "starLevel", "equips[]", "playerId"]),

        # Row 4 (y=3.75): 游戏数据子系统 — 4 classes
        "Hero":       ((1.20, 3.75), [C_ORANGE, "Hero\n英雄", "name", "cost(1-5)", "traits[]"]),
        "Equipment":  ((3.40, 3.75), [C_GREEN,  "Equipment\n装备", "itemName", "comps[]", "bonus{}"]),
        "Synergy":    ((5.60, 3.75), [C_ORANGE, "Synergy\n羁绊", "traitName", "thresh[]", "effects[]"]),
        "Augment":    ((7.80, 3.75), [C_ORANGE, "Augment\n海克斯", "name", "tier", "desc"]),
    }

    for name, ((cx, cy), (color, title, *attrs)) in classes.items():
        draw_rounded_box(ax, (cx, cy), BW, BH, text_lines=[title] + attrs, color=color, fontsize=9.5)

    # ── Horizontal arrows ──
    # Row 1: Auth→User(service), User→TL(1:N)
    draw_arrow(ax, (4.10, 8.62), (4.70, 8.62), "service", color=C_TEAL, fontsize=9)
    draw_arrow(ax, (5.60, 8.62), (6.90, 8.62), "1:N", color=C_BLUE, fontsize=9)
    # Row 2: Admin→Announcement(1:N)
    draw_arrow(ax, (8.00, 7.17), (8.00, 7.17), "", color=C_PURPLE, fontsize=9)  # skip, too far
    draw_arrow(ax, (5.60, 7.17), (6.20, 7.17), "1:N", color=C_PURPLE, fontsize=9)
    # Row 3: Board→Cell→Chess
    draw_arrow(ax, (4.10, 5.72), (4.70, 5.72), "1:N", color=C_ORANGE, fontsize=9)
    draw_arrow(ax, (6.30, 5.72), (6.90, 5.72), "1:1", color=C_ORANGE, fontsize=9)
    # Row 4: Hero↔Equip(N:M), Hero↔Syn(N:M)
    draw_arrow(ax, (2.80, 4.27), (3.40, 4.27), "N:M", color=C_GREEN, fontsize=9)
    draw_arrow(ax, (5.10, 4.27), (4.50, 4.27), "N:M", color=C_ORANGE, fontsize=9)

    # ── Vertical arrows ──
    # Chess → Hero (straight down, gap between boxes)
    draw_arrow(ax, (7.70, 4.95), (7.70, 4.50), "N:1", color=C_ORANGE, fontsize=9,
               text_offset=(0.25, 0))
    # User owns TeamLineup already shown horizontal
    # Admin extends User
    ax.annotate("extends", xy=(3.50, 6.85), xytext=(3.50, 6.40),
                ha="center", va="center", fontsize=9, color=C_PURPLE, style="italic",
                arrowprops={"arrowstyle":"<-", "color":C_PURPLE, "lw":1.2})

    # ── Subsystem dashed boxes ──
    subs = [
        (1.80, 7.75, 7.60, 1.90, C_BLUE,   "用户子系统 (User)"),
        (3.30, 6.30, 5.30, 1.90, C_PURPLE, "管理子系统 (Admin)"),
        (1.80, 4.85, 7.60, 1.90, C_ORANGE, "棋盘子系统 (Board)"),
        (0.50, 3.40, 9.40, 1.90, C_ORANGE, "游戏数据子系统 (Game Data)"),
    ]
    for x, y, w, h, color, label in subs:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.12",
                              facecolor="none", edgecolor=color, linewidth=1.2, linestyle="--")
        ax.add_patch(rect)
        ax.text(x + w/2, y + h + 0.12, label, ha="center", fontsize=10, color=color, fontweight="bold")

    # Legend
    leg = [(C_BLUE,"用户"),(C_PURPLE,"管理"),(C_ORANGE,"棋盘/游戏"),(C_GREEN,"装备"),(C_TEAL,"认证")]
    for i,(bg,lbl) in enumerate(leg):
        lx=0.4+i*3.10
        rect=FancyBboxPatch((lx,0.25),2.70,0.42,boxstyle="round,pad=0.10",facecolor=bg,edgecolor="#333",lw=0.8,alpha=0.82)
        ax.add_patch(rect)
        ax.text(lx+1.35,0.46,lbl,ha="center",va="center",fontsize=9,fontweight="bold",color="white")

    save_fig(fig, "class_diagram.png")


def draw_class_diagram_social():
    """逻辑视图补充 — 图4-1b 社交与AI子系统"""
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis("off")
    add_title(ax, "逻辑视图 — 类关系图 (4-1b) 社交与AI", "社交子系统 + AI分析子系统的7个核心类", y=0.98)

    BW, BH = 1.55, 1.00

    classes = {
        # Row 1 (y=4.10): 社交 — 4 classes
        "Post":       ((0.80, 4.10), [C_GREEN,  "Post\n帖子", "title", "content", "status"]),
        "Comment":    ((2.80, 4.10), [C_GREEN,  "Comment\n评论", "content", "post_id", "author_id"]),
        "Follow":     ((4.80, 4.10), [C_GREEN,  "Follow\n关注", "follower_id", "followee_id", "time"]),
        "Message":    ((6.80, 4.10), [C_GREEN,  "Message\n私信", "sender_id", "receiver_id", "isRead"]),

        # Row 2 (y=1.80): AI — 3 classes (including User reference for relationship)
        "AIAnalyzer": ((2.80, 1.80), [C_RED,    "AIAnalyzer\nAI分析器", "analyze(img)", "parseResp()", "modelType"]),
        "Suggestion": ((4.80, 1.80), [C_RED,    "Suggestion\n决策建议", "type", "confidence", "description"]),
    }

    for name, ((cx, cy), (color, title, *attrs)) in classes.items():
        draw_rounded_box(ax, (cx, cy), BW, BH, text_lines=[title] + attrs, color=color, fontsize=9.5)

    # Arrows
    # Row 1
    draw_arrow(ax, (2.35, 4.60), (2.80, 4.60), "1:N", color=C_GREEN, fontsize=9)
    draw_arrow(ax, (7.20, 4.60), (6.80, 4.60), "1:N", color=C_GREEN, fontsize=9)
    # Row 2
    draw_arrow(ax, (4.35, 2.30), (4.80, 2.30), "1:N", color=C_RED, fontsize=9)
    # Vertical: AIAnalyzer triggered by user request, Suggestion returned to user
    ax.annotate("User triggers", xy=(3.57, 2.85), xytext=(1.57, 4.80),
                ha="center", fontsize=9, color=C_RED,
                arrowprops={"arrowstyle":"->", "color":C_RED, "lw":1.2, "connectionstyle":"arc3,rad=-0.3"})
    ax.annotate("return to", xy=(5.57, 4.80), xytext=(5.57, 2.85),
                ha="center", fontsize=9, color=C_RED,
                arrowprops={"arrowstyle":"->", "color":C_RED, "lw":1.2, "connectionstyle":"arc3,rad=0.3"})

    # Subsystem boxes
    subs = [
        (0.20, 3.75, 8.70, 1.90, C_GREEN, "社交子系统 (Social)"),
        (2.20, 1.45, 4.90, 1.90, C_RED,   "AI分析子系统 (AI Analysis)"),
    ]
    for x, y, w, h, color, label in subs:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.12",
                              facecolor="none", edgecolor=color, linewidth=1.2, linestyle="--")
        ax.add_patch(rect)
        ax.text(x + w/2, y + h + 0.10, label, ha="center", fontsize=10, color=color, fontweight="bold")

    # Legend
    leg = [(C_GREEN,"社交子系统"),(C_RED,"AI分析子系统")]
    for i,(bg,lbl) in enumerate(leg):
        lx=3.0+i*4.50
        rect=FancyBboxPatch((lx,0.25),3.80,0.42,boxstyle="round,pad=0.10",facecolor=bg,edgecolor="#333",lw=0.8,alpha=0.82)
        ax.add_patch(rect)
        ax.text(lx+1.90,0.46,lbl,ha="center",va="center",fontsize=9,fontweight="bold",color="white")

    save_fig(fig, "class_diagram_social.png")


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Diagram 2: 过程视图 — AI实时分析管道                              ║
# ╚══════════════════════════════════════════════════════════════════════╝
def draw_process_view():
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7)
    ax.axis("off")
    add_title(ax, "过程视图 — AI实时分析管道", "Process View · AI Real-time Analysis Pipeline", y=0.98)

    # ── Pipeline 1: AI 分析管道 ──
    steps1 = [
        ("① 屏幕捕获", "截取游戏画面\n(ScreenCapture)", C_BLUE),
        ("② 图像压缩", "Resize+JPEG\n(ImageCompress)", C_TEAL),
        ("③ API调用", "通义千问/智谱AI\n(AICall)", C_ORANGE),
        ("④ JSON解析", "结构化数据\n(JSONParse)", C_PURPLE),
        ("⑤ 多帧验证", "N帧比对加权\n(FrameValid)", C_RED),
        ("⑥ WS推送", "WebSocket实时\n(WSPush)", C_GREEN),
        ("⑦ 前端展示", "建议浮层渲染\n(Display)", C_GRAY),
    ]

    y1 = 4.2
    box_w, box_h = 1.35, 0.85
    gap = 0.22
    total_w = len(steps1) * (box_w + gap) - gap
    start_x = (12 - total_w) / 2

    for i, (title, subtitle, color) in enumerate(steps1):
        x = start_x + i * (box_w + gap)
        box = FancyBboxPatch((x, y1), box_w, box_h, boxstyle="round,pad=0.3",
                             facecolor=color, edgecolor="#222222", linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + box_w / 2, y1 + box_h - 0.22, title, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color="white")
        ax.text(x + box_w / 2, y1 + 0.22, subtitle, ha="center", va="center",
                fontsize=7, color="white", alpha=0.95)
        if i < len(steps1) - 1:
            nx = x + box_w
            ax.annotate("", xy=(nx + gap, y1 + box_h / 2), xytext=(nx, y1 + box_h / 2),
                        arrowprops=dict(arrowstyle="->", color="#555", lw=1.8))

    # Pipeline label
    ax.text(0.5, y1 + box_h + 0.15, "AI 实时分析管道（对战辅助）", ha="center", va="bottom",
            fontsize=11, fontweight="bold", color=C_BLUE)

    # ── Pipeline 2: 数据加载管道 ──
    steps2 = [
        ("① 组件挂载", "Vue onMounted\n生命周期钩子", C_BLUE),
        ("② 请求后端", "fetch() → MongoDB\n数据查询", C_TEAL),
        ("③ 成功路径", "缓存数据 →\n渲染组件", C_GREEN),
        ("③ 失败路径", "本地 localStorage\n兜底展示", C_ORANGE),
        ("④ 渲染界面", "响应式数据绑定\n展示最终UI", C_GRAY),
    ]

    y2 = 1.4
    start_x2 = (12 - total_w) / 2

    # Draw the two branches at step 3
    box_w2, box_h2 = 1.5, 0.85
    gap2 = 0.25
    # Recalculate
    n2 = 5
    total_w2 = n2 * (box_w2 + gap2) - gap2
    start_x2 = (12 - total_w2) / 2

    for i, (title, subtitle, color) in enumerate(steps2):
        if i == 2:  # Success branch – offset up
            x = start_x2 + 2 * (box_w2 + gap2)
            y = y2 + 0.55
        elif i == 3:  # Failure branch – offset down
            x = start_x2 + 2 * (box_w2 + gap2)
            y = y2 - 0.55
        elif i == 4:
            x = start_x2 + 3 * (box_w2 + gap2)
            y = y2
        else:
            x = start_x2 + i * (box_w2 + gap2)
            y = y2

        box = FancyBboxPatch((x, y), box_w2, box_h2, boxstyle="round,pad=0.3",
                             facecolor=color, edgecolor="#222222", linewidth=1.3)
        ax.add_patch(box)
        ax.text(x + box_w2 / 2, y + box_h2 - 0.22, title, ha="center", va="center",
                fontsize=9, fontweight="bold", color="white")
        ax.text(x + box_w2 / 2, y + 0.20, subtitle, ha="center", va="center",
                fontsize=7, color="white", alpha=0.95)

    # Arrows for data pipeline
    # Step 1 → Step 2
    xs1 = start_x2 + 0 * (box_w2 + gap2) + box_w2
    ax.annotate("", xy=(start_x2 + 1 * (box_w2 + gap2), y2 + box_h2 / 2),
                xytext=(xs1, y2 + box_h2 / 2),
                arrowprops=dict(arrowstyle="->", color="#555", lw=1.8))
    # Step 2 → Success
    xs2 = start_x2 + 1 * (box_w2 + gap2) + box_w2
    s_x = start_x2 + 2 * (box_w2 + gap2)
    ax.annotate("", xy=(s_x, y2 + 0.55 + box_h2 / 2),
                xytext=(xs2, y2 + box_h2 / 2),
                arrowprops=dict(arrowstyle="->", color="#2E7D32", lw=1.8))
    # Step 2 → Failure
    ax.annotate("", xy=(s_x, y2 - 0.55 + box_h2 / 2),
                xytext=(xs2, y2 + box_h2 / 2),
                arrowprops=dict(arrowstyle="->", color="#E65100", lw=1.8))
    # Success → Step 4
    ax.annotate("", xy=(start_x2 + 3 * (box_w2 + gap2), y2 + box_h2 / 2),
                xytext=(s_x + box_w2, y2 + 0.55 + box_h2 / 2),
                arrowprops=dict(arrowstyle="->", color="#2E7D32", lw=1.8))
    # Failure → Step 4
    ax.annotate("", xy=(start_x2 + 3 * (box_w2 + gap2), y2 + box_h2 / 2),
                xytext=(s_x + box_w2, y2 - 0.55 + box_h2 / 2),
                arrowprops=dict(arrowstyle="->", color="#E65100", lw=1.8))

    # Success / Failure labels
    ax.text(s_x + box_w2 / 2, y2 + 0.55 + box_h2 + 0.15, "[成功] 缓存+渲染",
            ha="center", fontsize=8, color=C_GREEN, fontweight="bold")
    ax.text(s_x + box_w2 / 2, y2 - 0.55 - 0.15, "[失败] 本地回退",
            ha="center", fontsize=8, color=C_ORANGE, fontweight="bold")

    ax.text(0.5, y2 - 0.55 - 0.50, "数据加载管道（阵容/攻略浏览）", ha="center", va="top",
            fontsize=11, fontweight="bold", color=C_TEAL)

    save_fig(fig, "process_view.png")


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Diagram 3: 开发视图 — 分层架构图                                  ║
# ╚══════════════════════════════════════════════════════════════════════╝
def draw_dev_view():
    fig, ax = plt.subplots(figsize=(11, 7.5))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7.5)
    ax.axis("off")
    add_title(ax, "开发视图 — 层次化模块组织", "Development View · Layered Architecture", y=0.98)

    layers = [
        ("Views 层 — 22个页面组件",        "Vue SFC · 组件化开发 · 响应式UI",              C_BLUE,   6.4),
        ("Stores + Router 层",             "Pinia 状态管理 · Vue Router 路由导航",          C_TEAL,   5.2),
        ("Services 层",                    "API服务 · AI服务 · Socket/OCR服务",              C_GREEN,  4.0),
        ("Express 层",                     "Routes → Controllers → Models → Middleware",    C_ORANGE, 2.8),
        ("基础设施层",                      "MongoDB · Docker · Nginx · AI APIs",            C_PURPLE, 1.6),
    ]

    # Side labels
    side_info = [
        (7.1, 6.15, "前端\nFrontend", C_BLUE),
        (7.1, 4.6,  "前端\nFrontend", C_TEAL),
        (7.1, 3.4,  "前端\nFrontend", C_GREEN),
        (7.1, 2.45, "后端\nBackend",  C_ORANGE),
        (7.1, 1.1,  "基础设施\nInfra", C_PURPLE),
    ]

    left_x = 1.0
    layer_w = 6.8
    layer_h = 0.85
    gap = 0.18
    start_y = layers[0][3]

    for i, (title, subtitle, color, y) in enumerate(layers):
        box = FancyBboxPatch((left_x, y), layer_w, layer_h, boxstyle="round,pad=0.3",
                             facecolor=color, edgecolor="#222222", linewidth=1.3)
        ax.add_patch(box)
        ax.text(left_x + 0.25, y + layer_h - 0.28, title, va="center",
                fontsize=12, fontweight="bold", color="white")
        ax.text(left_x + 0.25, y + 0.22, subtitle, va="center",
                fontsize=9, color="white", alpha=0.92)

    # Dependency arrows between layers (↓ depends on)
    for i in range(len(layers) - 1):
        y_upper = layers[i][3]
        y_lower = layers[i + 1][3] + layer_h
        ax.annotate("↓ depends on", xy=(left_x + layer_w / 2, y_lower),
                    xytext=(left_x + layer_w / 2, y_upper),
                    fontsize=8, color="#444444", ha="center", va="center",
                    fontweight="bold",
                    arrowprops=dict(arrowstyle="->", color="#666666", lw=1.5,
                                    connectionstyle="arc3,rad=0"))

    # Side labels
    for (sx, sy, stext, scolor) in side_info:
        ax.text(sx, sy, stext, fontsize=10, fontweight="bold", color=scolor,
                ha="left", va="center",
                bbox=dict(boxstyle="round,pad=0.35", facecolor="white",
                          edgecolor=scolor, linewidth=1.5))

    # Braces for frontend/backend/infra groupings
    # We'll use simple line brackets
    brace_positions = [
        (8.5, 3.4 + 0.85, 6.4 + 0.85, "前端 Vue3\n3 层"),
        (8.5, 1.6 + 0.85, 2.8 + 0.85, "后端 Express\n1 层"),
        (8.5, 0.75 + 0.85, 1.6 + 0.85, "基础设施\n1 层"),
    ]
    for bx, by1, by2, blabel in brace_positions:
        # Draw bracket line
        ax.plot([bx, bx - 0.3, bx - 0.3, bx], [by1, by1, by2, by2],
                color="#999999", lw=1.5, clip_on=False)
        ax.text(bx + 0.15, (by1 + by2) / 2, blabel, fontsize=8, color="#666666",
                ha="left", va="center")

    save_fig(fig, "dev_view.png")


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Diagram 4: 物理视图 — 部署拓扑图                                  ║
# ╚══════════════════════════════════════════════════════════════════════╝
def draw_physical_view():
    fig, ax = plt.subplots(figsize=(11, 7.5))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7.5)
    ax.axis("off")
    add_title(ax, "物理视图 — 部署拓扑图", "Physical View · Deployment Topology", y=0.98)

    # ── Node positions ──
    # Top row: Browser, Nginx, Express
    # Bottom row: MongoDB, 通义千问, 智谱AI
    nodes = {}

    def add_node(name, x, y, w=2.0, h=1.0, color=C_BLUE, subtitle=""):
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3",
                             facecolor=color, edgecolor="#222222", linewidth=1.4)
        ax.add_patch(box)
        ax.text(x + w / 2, y + h - 0.28, name, ha="center", va="center",
                fontsize=10.5, fontweight="bold", color="white")
        if subtitle:
            ax.text(x + w / 2, y + 0.25, subtitle, ha="center", va="center",
                    fontsize=8, color="white", alpha=0.92)
        return (x, y, w, h)

    add_node("用户浏览器\nBrowser", 0.5, 5.7, 1.6, 1.0, C_GRAY)
    add_node("Nginx :80", 2.8, 5.7, 1.8, 1.0, C_BLUE, "静态文件 + 反向代理")
    add_node("Express :3000", 5.3, 5.7, 1.8, 1.0, C_TEAL, "业务逻辑 + JWT认证")
    add_node("MongoDB :27017", 0.5, 3.3, 1.8, 1.0, C_GREEN, "数据持久化")
    add_node("阿里云通义千问 API", 3.0, 3.3, 2.1, 1.0, C_ORANGE, "视觉大模型 (Qwen-VL)")
    add_node("智谱AI GLM-4V API", 5.8, 3.3, 2.1, 1.0, C_PURPLE, "视觉大模型 (GLM-4V)")

    # ── Docker Compose dashed box (around Nginx, Express, MongoDB) ──
    docker_rect = FancyBboxPatch((2.5, 3.0), 4.9, 4.0, boxstyle="round,pad=0.4",
                                 facecolor="none", edgecolor="#888888", linewidth=1.5,
                                 linestyle="--")
    ax.add_patch(docker_rect)
    ax.text(4.95, 7.2, "Docker Compose 编排", ha="center", va="center",
            fontsize=10, fontweight="bold", color="#666666",
            bbox=dict(boxstyle="round,pad=0.2", facecolor="white", edgecolor="#888888",
                      linewidth=1.0))

    # ── External services dotted box (around 通义千问, 智谱AI) ──
    ext_rect = FancyBboxPatch((2.7, 3.0), 5.5, 1.6, boxstyle="round,pad=0.4",
                               facecolor="none", edgecolor="#BBBBBB", linewidth=1.5,
                               linestyle=":")
    ax.add_patch(ext_rect)
    ax.text(5.45, 4.8, "外部服务 (HTTPS)", ha="center", va="center",
            fontsize=10, fontweight="bold", color="#888888",
            bbox=dict(boxstyle="round,pad=0.2", facecolor="white", edgecolor="#999999",
                      linewidth=1.0))

    # ── Arrows ──
    # Browser → Nginx (HTTPS)
    draw_arrow(ax, (1.6, 5.7), (2.8, 5.7), "HTTPS", color=C_GRAY, text_offset=(0, 0.18))
    # Nginx → Express (/api/*)
    draw_arrow(ax, (4.6, 5.7), (5.3, 5.7), "/api/*", color=C_BLUE, text_offset=(0, 0.18))
    # Express → MongoDB (Mongoose)
    draw_arrow(ax, (5.3, 5.7), (1.4, 4.3), "Mongoose", color=C_TEAL, text_offset=(-0.7, 0.0))
    # Express → 通义千问
    draw_arrow(ax, (6.2, 5.7), (4.05, 4.3), "HTTPS", color=C_ORANGE, text_offset=(0, 0.15))
    # Express → 智谱AI
    draw_arrow(ax, (7.1, 5.7), (6.85, 4.3), "HTTPS", color=C_PURPLE, text_offset=(0, 0.15))
    # Nginx → Browser (static resources return)
    ax.annotate("", xy=(1.6, 5.2), xytext=(3.7, 5.2),
                arrowprops=dict(arrowstyle="->", color=C_GRAY, lw=1.5, linestyle="dashed",
                                connectionstyle="arc3,rad=-0.4"))
    ax.text(2.65, 5.35, "静态资源", fontsize=8, color=C_GRAY, ha="center",
            bbox=dict(boxstyle="round,pad=0.1", facecolor="white", edgecolor="none"))

    save_fig(fig, "physical_view.png")


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Diagram 5: 场景视图 — 用例场景图                                  ║
# ╚══════════════════════════════════════════════════════════════════════╝
def draw_scenario_view():
    fig, ax = plt.subplots(figsize=(11, 7.5))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7.5)
    ax.axis("off")
    add_title(ax, "场景视图 — 关键用例场景", "Scenario View · Key Use Case Scenarios", y=0.98)

    # ── Three swimlane scenarios ──
    scenarios = [
        {
            "name": "场景一：新手玩家学习阵容",
            "actor": "[用户]",
            "color": C_BLUE,
            "steps": ["登录平台", "浏览阵容列表", "进入阵容详情", "拖拽模拟编辑", "保存个人阵容"],
            "views": "逻辑视图 [V]\n开发视图 [V]",
            "y": 5.0,
        },
        {
            "name": "场景二：AI实时对战指导",
            "actor": "[用户] + [系统]",
            "color": C_ORANGE,
            "steps": ["开启分析模式", "游戏画面捕获", "AI视觉识别", "多帧验证加权", "浮层展示建议"],
            "views": "过程视图 [V]\n物理视图 [V]",
            "y": 3.2,
        },
        {
            "name": "场景三：论坛内容审核",
            "actor": "[用户] + [管理员]",
            "color": C_PURPLE,
            "steps": ["用户发帖", "进入待审核队列", "管理员内容审核", "审核通过发布", "社区公开展示"],
            "views": "逻辑视图 [V]\n开发视图 [V]",
            "y": 1.4,
        },
    ]

    step_w, step_h = 1.2, 0.7
    gap = 0.22
    start_x = 1.2

    for sc in scenarios:
        y = sc["y"]
        color = sc["color"]

        # Actor label
        ax.text(0.6, y + step_h / 2, sc["actor"], fontsize=9, fontweight="bold",
                color=color, ha="center", va="center",
                bbox=dict(boxstyle="round,pad=0.3", facecolor="white", edgecolor=color, lw=1.3))

        # Steps
        n = len(sc["steps"])
        for i, step_text in enumerate(sc["steps"]):
            x = start_x + i * (step_w + gap)
            box = FancyBboxPatch((x, y), step_w, step_h, boxstyle="round,pad=0.25",
                                 facecolor=color, edgecolor="#222222", linewidth=1.2)
            ax.add_patch(box)
            ax.text(x + step_w / 2, y + step_h / 2, step_text, ha="center", va="center",
                    fontsize=7.5, fontweight="bold", color="white", wrap=True)
            # Arrow between steps
            if i < n - 1:
                nx = x + step_w
                ax.annotate("", xy=(nx + gap, y + step_h / 2), xytext=(nx, y + step_h / 2),
                            arrowprops=dict(arrowstyle="->", color="#666666", lw=1.5))

        # Scenario name label (left side, above row)
        ax.text(9.0, y + step_h + 0.08, sc["name"], fontsize=9, fontweight="bold",
                color=color, ha="left", va="bottom")

        # Views sidebar
        ax.text(9.0, y + step_h / 2 - 0.1, sc["views"], fontsize=7.5, color="#555555",
                ha="left", va="center",
                bbox=dict(boxstyle="round,pad=0.25", facecolor="#F5F5F5", edgecolor="#CCCCCC",
                          lw=0.8))

    # Section label
    ax.text(9.0, 6.05, "验证视图", fontsize=9, fontweight="bold", color="#333333",
            ha="left", va="center")

    # Divider lines between scenarios
    for yy in [2.85, 4.65]:
        ax.plot([0.3, 10.8], [yy, yy], color="#DDDDDD", lw=1.0, linestyle="--")

    save_fig(fig, "scenario_view.png")


# ── Main ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating architecture diagrams for 掌上金铲铲 …\n")
    draw_class_diagram()
    draw_class_diagram_social()
    draw_process_view()
    draw_dev_view()
    draw_physical_view()
    draw_scenario_view()
    print("\nAll 6 diagrams generated successfully in:", OUTPUT_DIR)
