# -*- coding: utf-8 -*-
"""掌上金铲铲 HUD 化 codemod：把旧 Tailwind 紫粉/毛玻璃类替换为 HUD 设计系统类。
规则按顺序应用；游戏语义紫色（费用/档位）用显式色值保留。
"""
import re
import sys
from pathlib import Path

VIEWS = Path(r"C:\Users\29364\Documents\trae_projects\heihei\tft-assistant\src\views")

FILES = [
    "Profile.vue", "Social.vue", "TeamDetail.vue", "Dashboard.vue",
    "Augments.vue", "Synergies.vue", "Teamfight.vue",
    "AdminPanel.vue", "ScreenShare.vue", "CreatePost.vue",
    "Economy.vue", "AdminGameData.vue", "PostDetail.vue",
    "MyRecord.vue", "Feedback.vue",
]

# (pattern, replacement) —— 严格按顺序执行
RULES = [
    # ===== 1. 游戏/设计语义紫色 → 显式色值（必须先于通用 purple 规则）=====
    ("4: 'border-2 border-purple-500/50", "4: 'border-2 border-[rgba(168,85,247,0.5)]"),   # 4费描边
    ("|| 'border-2 border-purple-500/30 rounded-lg'", "|| 'border-2 border-[rgba(168,85,247,0.3)] rounded-lg'"),  # TeamDetail 费用兜底
    ("3: 'bg-purple-500 text-white',", "3: 'bg-[#a855f7] text-white',"),                     # Teamfight 3费徽标
    ("'T0.5': 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',", "'T0.5': 'bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-white',"),
    ("'bg-gradient-to-r from-purple-400 to-purple-600'", "'bg-gradient-to-r from-[#c084fc] to-[#9333ea]'"),

    # ===== 2. 阴影遗留 =====
    (" shadow-lg shadow-purple-500/30", ""),

    # ===== 3. 主按钮渐变 =====
    ("bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d]"),
    ("bg-gradient-to-r from-purple-500 to-pink-500 text-white", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d]"),
    ("bg-gradient-to-r from-purple-500 to-pink-500", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)]"),
    ("hover:from-purple-600 hover:to-pink-600", ""),
    ("bg-gradient-to-br from-purple-500 to-pink-500", "bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-gold)]"),

    # ===== 4. 横幅/装饰渐变 =====
    ("from-purple-600/20 via-pink-600/20 to-blue-600/20", "from-[rgba(var(--accent-rgb),0.15)] via-[rgba(var(--gold-rgb),0.1)] to-[rgba(59,130,246,0.1)]"),
    ("from-purple-500/20 via-pink-500/20 to-blue-500/10", "from-[rgba(var(--accent-rgb),0.12)] via-[rgba(var(--gold-rgb),0.08)] to-[rgba(59,130,246,0.06)]"),
    ("from-purple-400 via-pink-400 to-blue-400", "from-[#4aefe0] via-[#ffc857] to-[#60a5fa]"),
    ("from-purple-500/20 to-pink-500/20", "from-[rgba(var(--accent-rgb),0.12)] to-[rgba(var(--gold-rgb),0.12)]"),
    ("from-purple-500/10 to-pink-500/10", "from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--gold-rgb),0.08)]"),
    ("from-purple-500/10 to-purple-500/5", "from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--accent-rgb),0.03)]"),

    # ===== 5. 实心紫按钮 / 激活 Tab =====
    ("bg-purple-500 hover:bg-purple-600 text-white", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d]"),
    ("bg-purple-500 hover:bg-purple-400 text-white", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#03201d]"),
    ("'bg-purple-500 text-white'", "'bg-[var(--accent-color)] text-[#03201d]'"),
    ("bg-purple-500 text-white", "bg-[var(--accent-color)] text-[#03201d]"),
    ("bg-purple-500 hover:bg-purple-600", "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)]"),
    ("bg-purple-600", "bg-[var(--accent-hover)]"),

    # ===== 6. 紫底透明度 =====
    ("bg-purple-500/80", "bg-[rgba(var(--accent-rgb),0.8)]"),
    ("bg-purple-500/50", "bg-[rgba(var(--accent-rgb),0.35)]"),
    ("bg-purple-500/40", "bg-[rgba(var(--accent-rgb),0.25)]"),
    ("bg-purple-500/30", "bg-[rgba(var(--accent-rgb),0.18)]"),
    ("bg-purple-500/20", "bg-[rgba(var(--accent-rgb),0.12)]"),
    ("bg-purple-500/10", "bg-[rgba(var(--accent-rgb),0.08)]"),
    ("bg-purple-500/5", "bg-[rgba(var(--accent-rgb),0.05)]"),
    ("bg-purple-400/50", "bg-[rgba(var(--accent-rgb),0.5)]"),

    # ===== 7. 边框 / 圆环 =====
    ("focus:border-purple-500/50", "focus:border-[var(--accent-color)]"),
    ("focus:border-purple-400", "focus:border-[var(--accent-color)]"),
    ("border-purple-500/50", "border-[rgba(var(--accent-rgb),0.5)]"),
    ("border-purple-500/40", "border-[rgba(var(--accent-rgb),0.4)]"),
    ("border-purple-500/30", "border-[rgba(var(--accent-rgb),0.3)]"),
    ("border-purple-500/20", "border-[rgba(var(--accent-rgb),0.2)]"),
    ("border-purple-400", "border-[var(--accent-color)]"),
    ("focus:ring-purple-500", "focus:ring-[var(--accent-color)]"),
    ("ring-purple-500", "ring-[var(--accent-color)]"),
    ("ring-purple-400", "ring-[var(--accent-color)]"),

    # ===== 8. 文字色 =====
    ("hover:text-purple-200", "hover:text-[var(--accent-hover)]"),
    ("hover:text-purple-300", "hover:text-[var(--accent-hover)]"),
    ("text-purple-100", "text-[#d9f7f2]"),
    ("text-purple-200", "text-[var(--accent-color)]"),
    ("text-purple-300", "text-[var(--accent-color)]"),
    ("text-purple-400", "text-[var(--accent-color)]"),
    ("text-purple-500", "text-[var(--accent-color)]"),

    # ===== 9. 中性玻璃遗留 =====
    ("'bg-white/10 text-gray-400 hover:bg-white/20'", "'bg-[var(--bg-card-hover)] text-gray-400 hover:bg-[var(--bg-elevated)]'"),
    ("bg-white/10 text-gray-300", "bg-[var(--bg-card-hover)] text-gray-300"),
    ("bg-white/10 border border-white/20 rounded-xl", "bg-[var(--bg-card-hover)] border border-[var(--line-strong)] rounded-lg"),
    ("bg-white/5 border border-white/10 rounded-xl", "bg-[var(--bg-card-hover)] border border-[var(--line-soft)] rounded-lg"),
    ("bg-white/5 border border-white/10 rounded-lg", "bg-[var(--bg-card-hover)] border border-[var(--line-soft)] rounded-lg"),
    ("hover:bg-white/10 hover:border-white/20", "hover:bg-[var(--bg-elevated)] hover:border-[var(--line-strong)]"),
    ("bg-white/5 rounded-xl", "bg-[var(--bg-card-hover)] rounded-lg"),
    ("bg-white/5 rounded-lg", "bg-[var(--bg-card-hover)] rounded-lg"),
    ("hover:bg-white/20", "hover:bg-[var(--bg-elevated)]"),
    ("bg-white/10", "bg-[var(--bg-card-hover)]"),
    ("border border-white/10", "border border-[var(--line-soft)]"),
    ("border-white/20", "border-[var(--line-strong)]"),
    ("border-white/10", "border-[var(--line-soft)]"),
]

CARD_RE_1 = re.compile(r"bg-white/5 backdrop-blur-md rounded-(?:2xl|xl)((?:\s+\S+?)*?)\s+border border-white/10")
CARD_RE_2 = re.compile(r"rounded-(?:2xl|xl) bg-white/5 backdrop-blur-md border border-white/10")


def transform(text: str) -> str:
    # 毛玻璃卡片 → hud-card（保留中间与两端的其他类）
    text = CARD_RE_1.sub(lambda m: "hud-card" + m.group(1), text)
    text = CARD_RE_2.sub("hud-card", text)
    for old, new in RULES:
        text = text.replace(old, new)
    return text


def main():
    total_changed = 0
    for name in FILES:
        path = VIEWS / name
        original = path.read_text(encoding="utf-8")
        updated = transform(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="")
            n = sum(1 for a, b in zip(original.splitlines(), updated.splitlines()) if a != b)
            print(f"[OK] {name}: ~{n} lines touched")
            total_changed += 1
        else:
            print(f"[--] {name}: no change")
    print(f"done, {total_changed}/{len(FILES)} files changed")


if __name__ == "__main__":
    main()
