# -*- coding: utf-8 -*-
"""完整版讲解视频（21页：含管理员/教学资源/赛事/发帖上传/社交/战绩/反馈）"""
import os, time, asyncio, cv2, numpy as np
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import edge_tts

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
AUDIO_DIR = os.path.join(BASE_DIR, "_audio_segments")
OUTPUT_VIDEO = os.path.join(BASE_DIR, "掌上金铲铲_讲解视频.mp4")
FONT = "C:/Windows/Fonts/msyh.ttc"
W, H = 1280, 720
FPS = 24
URL = "http://localhost:5174"
VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "+15%"
TITLE_SEC, ENDING_SEC = 3, 3

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

# ============================================================
# 21段配音脚本（覆盖所有功能页面）
# ============================================================
SEGMENTS = [
    # -- 用户认证（无token，先截） --
    ("login",     "/login",           "登录注册",   "uri", None,
     "掌上金铲铲，一款面向云顶之弈S8怪兽入侵赛季的AI智能辅助平台，支持多种角色注册登录。"),
    ("register",  "/register",        "注册页面",   "uri", None,
     "新玩家可创建账号，选择普通玩家或内容创作者角色，注册后自动登录进入功能首页。"),
    # -- 核心功能（普通用户） --
    ("home",      "/",                "功能首页",   "uri", None,
     "首页展示六大核心功能模块入口，包含阵容模拟、装备合成、卡池概率、经济计算等，一目了然。"),
    ("teamfight", "/teamfight",       "阵容模拟器", "uri", None,
     "核心功能阵容模拟器，支持拖拽棋子到九人口棋盘，实时计算羁绊组合效果，可保存和分享阵容。"),
    ("equipment", "/equipment",       "装备合成",   "uri", None,
     "装备合成系统展示全部四十五件装备，包含九件基础装备和三十六件合成装备的完整属性与合成路径。"),
    ("pool",      "/pool",            "卡池概率追踪","uri", None,
     "卡池概率追踪器基于真实S8共享卡池机制，按费用分组展示英雄，实时计算D牌概率与预算。"),
    ("economy",   "/economy",         "经济计算器", "uri", None,
     "经济运营计算器模拟金币利息系统，提供升级花费估算和未来八回合的金币趋势预测。"),
    ("synergies", "/synergies",       "羁绊大全",   "uri", None,
     "羁绊大全收录全部二十七种羁绊，分特质和职业两大类，每种展示层级效果与所属英雄。"),
    ("augments",  "/augments",        "海克斯强化", "uri", None,
     "海克斯符文数据库包含六十多个英雄强化和近四十个通用强化，按银金银彩分类展示，数据来源于官方公告。"),
    ("dashboard", "/dashboard",       "大数据看板", "uri", None,
     "版本大数据看板展示阵容强度排行、装备推荐和羁绊评分，帮助玩家精准把握版本环境。"),
    ("screenshare","/screenshare",    "AI实时指导", "uri", None,
     "AI实时指导是最大亮点：通过屏幕共享捕获游戏画面，多模态视觉AI自动识别血量、金币、等级和羁绊，给出实时决策建议。"),
    # -- 论坛功能 --
    ("forum",     "/forum",           "玩家论坛",   "uri", None,
     "玩家论坛默认展示帖子列表，支持讨论交流、组队招募、阵容分享等多种类型的帖子浏览与互动。"),
    ("forum_tutorials","/forum",     "教学资源",   "tab", "教学资源",
     "教学资源板块收录海量S8教学视频，支持B站视频嵌入播放和抖音精准视频跳转，阵容教学、运营教学、新手入门覆盖全面。"),
    ("forum_esports","/forum",       "赛事资讯",   "tab", "赛事资讯",
     "赛事资讯板块汇聚官方公告和电竞动态，包括版本更新、平衡调整和职业赛事最新战报。"),
    ("forum_create","/forum/new",    "发帖上传",   "uri", None,
     "发帖页面支持拖拽上传图片和视频，最多九份附件、单个最大一百兆，支持预览和多种文件格式。"),
    # -- 社交与个人 --
    ("social",    "/social",          "社交中心",   "uri", None,
     "社交中心提供私信聊天、好友关注、粉丝管理、黑名单等社交功能，帮助玩家建立游戏社交圈。"),
    ("record",    "/record",          "战绩记录",   "uri", None,
     "战绩记录功能追踪每一场对局的详细信息，包括排名、使用阵容和经济数据，见证成长轨迹。"),
    ("feedback",  "/feedback",        "意见反馈",   "uri", None,
     "意见反馈入口收集玩家建议和Bug报告，帮助平台持续优化迭代。"),
    # -- 管理员功能（切换admin角色后截） --
    ("admin",     "/admin",           "管理后台",   "uri", None,
     "管理员后台面板提供用户管理、内容审核、数据统计等管理功能，以及平台运营核心数据概览。"),
    ("admin_gamedata","/admin/game-data","游戏数据管理","uri", None,
     "游戏数据管理允许管理员维护英雄、装备、羁绊和海克斯强化等核心游戏数据库，支持增删改操作。"),
    # -- 个人中心 --
    ("profile", "/profile",           "个人中心",   "uri", None,
     "个人中心提供资料管理、游戏账号绑定和战绩追踪功能，记录每一场比赛的成长轨迹。"),
]

def pt(frame):
    return cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)

def make_subtitle_img(text, fontsize=22, color=(255,255,255), stroke_color=(0,0,0), stroke_width=2):
    font = ImageFont.truetype(FONT, fontsize)
    im = Image.new("RGBA", (1,1), (0,0,0,0))
    draw = ImageDraw.Draw(im)
    bbox = draw.textbbox((0,0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    pad = 16
    sw = stroke_width * 4
    img = Image.new("RGBA", (tw+pad*2+sw, th+pad*2+sw), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    for dx in range(-stroke_width, stroke_width+1):
        for dy in range(-stroke_width, stroke_width+1):
            if dx != 0 or dy != 0:
                draw.text((pad+sw//2+dx, pad+sw//2+dy), text, fill=stroke_color, font=font)
    draw.text((pad+sw//2, pad+sw//2), text, fill=color, font=font)
    return np.array(img)

def overlay_subtitle(frame_img, text):
    sub = make_subtitle_img(text, fontsize=22)
    sub_img = Image.fromarray(sub)
    fg = sub_img.convert("RGBA")
    bg = frame_img.convert("RGBA")
    pos_x = (W - fg.width) // 2
    pos_y = H - fg.height - 40
    bg.paste(fg, (pos_x, pos_y), fg)
    return np.array(bg.convert("RGB"))

def crop_to_720p(img):
    pw, ph = img.size
    if ph <= H:
        bg = Image.new("RGB", (W, H), (28, 30, 40))
        bg.paste(img, ((W-pw)//2, (H-ph)//2))
        return bg
    else:
        return img.crop((0, 0, pw, H))

async def generate_audio_segment(key, text, idx):
    fpath = os.path.join(AUDIO_DIR, f"{idx:02d}_{key}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(fpath)
    from moviepy import AudioFileClip
    clip = AudioFileClip(fpath)
    dur = clip.duration
    clip.close()
    return key, fpath, dur

print("=" * 60)
print("  掌上金铲铲 — 完整版21页讲解视频")
print("=" * 60)

# ── Step 1: TTS ──
print("\n[1/4] 生成21段TTS配音...")
async def gen_all():
    tasks = []
    for i, (key, _, _, _, _, text) in enumerate(SEGMENTS):
        tasks.append(generate_audio_segment(key, text, i))
    return await asyncio.gather(*tasks)

audio_data = asyncio.run(gen_all())
audio_map = {}
for key, fpath, dur in audio_data:
    audio_map[key] = (fpath, dur)
    print(f"  {key}: {dur:.1f}s")

# ── Step 2: 截图 ──
print("\n[2/4] 截取21个页面（domcontentloaded + 6s + full_page）...")
screenshot_map = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": W, "height": H})
    page = ctx.new_page()

    # ── 2a. 登录/注册（无token）──
    for key, route, name, mode, target, text in SEGMENTS:
        if mode != "uri": continue
        if key not in ("login", "register"): continue
        print(f"  → {name}")
        try:
            page.goto(URL + route, wait_until="domcontentloaded", timeout=15000)
            time.sleep(6)
            fpath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
            page.screenshot(path=fpath, full_page=True)
            screenshot_map[key] = fpath
        except Exception as e:
            print(f"    WARN: {e}")

    # ── 2b. 注入普通用户token ──
    page.goto(URL + "/login", wait_until="domcontentloaded", timeout=10000)
    page.evaluate("""
        localStorage.setItem('token', 'demo-token-user');
        localStorage.setItem('userInfo', JSON.stringify({
            _id: 'user001', username: '演示召唤师',
            nickname: '金铲铲高手', role: 'user', avatar: ''
        }));
    """)
    print("  [已注入普通用户token]")

    # ── 2c. 截取普通功能页面（uri模式）──
    for key, route, name, mode, target, text in SEGMENTS:
        if mode != "uri": continue
        if key in ("login", "register", "admin", "admin_gamedata"): continue
        print(f"  → {name}")
        try:
            page.goto(URL + route, wait_until="domcontentloaded", timeout=15000)
            time.sleep(6)
            fpath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
            page.screenshot(path=fpath, full_page=True)
            screenshot_map[key] = fpath
        except Exception as e:
            print(f"    WARN: {e}")

    # ── 2d. 截取论坛标签页（tab模式：先切到对应tab再截图）──
    for key, route, name, mode, target, text in SEGMENTS:
        if mode != "tab": continue
        print(f"  → {name} (切换到 {target} 标签)")
        try:
            page.goto(URL + "/forum", wait_until="domcontentloaded", timeout=15000)
            time.sleep(4)
            # 点击对应标签按钮
            page.evaluate(f"""
                const btns = document.querySelectorAll('button');
                for (const btn of btns) {{
                    if (btn.textContent && btn.textContent.includes('{target}')) {{
                        btn.click();
                        break;
                    }}
                }}
            """)
            time.sleep(3)
            fpath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
            page.screenshot(path=fpath, full_page=True)
            screenshot_map[key] = fpath
        except Exception as e:
            print(f"    WARN: {e}")

    # ── 2e. 切换admin角色并截取管理页面 ──
    page.goto(URL + "/login", wait_until="domcontentloaded", timeout=10000)
    page.evaluate("""
        localStorage.setItem('token', 'demo-token-admin');
        localStorage.setItem('userInfo', JSON.stringify({
            _id: 'admin001', username: '超级管理员',
            nickname: '系统管理员', role: 'admin', avatar: ''
        }));
    """)
    print("  [已注入管理员token]")

    for key, route, name, mode, target, text in SEGMENTS:
        if key not in ("admin", "admin_gamedata"): continue
        print(f"  → {name}")
        try:
            page.goto(URL + route, wait_until="domcontentloaded", timeout=15000)
            time.sleep(6)
            fpath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
            page.screenshot(path=fpath, full_page=True)
            screenshot_map[key] = fpath
        except Exception as e:
            print(f"    WARN: {e}")

    browser.close()

print(f"  已截取 {len(screenshot_map)}/21 个页面")

# ── Step 3: 合成视频 ──
print("\n[3/4] 合成视频（片头→21段→片尾）...")
from moviepy import AudioFileClip, concatenate_audioclips
from moviepy.audio.AudioClip import AudioClip

all_durations = []
all_audio_clips = []

# 片头静音
silence_title = AudioClip(lambda t: 0, duration=TITLE_SEC, fps=44100)
all_audio_clips.append(silence_title)
all_durations.append(TITLE_SEC)

for key, _, _, _, _, _ in SEGMENTS:
    fpath, dur = audio_map[key]
    all_durations.append(dur)
    all_audio_clips.append(AudioFileClip(fpath))

# 片尾静音
silence_end = AudioClip(lambda t: 0, duration=ENDING_SEC, fps=44100)
all_audio_clips.append(silence_end)
all_durations.append(ENDING_SEC)

total_audio_dur = sum(all_durations)
print(f"  总配音时长(含静音): {total_audio_dur:.1f}s")

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
writer = cv2.VideoWriter(OUTPUT_VIDEO, fourcc, FPS, (W, H))
tf = 0

# 片头
timg = Image.new("RGB", (W, H), (28, 30, 40))
draw = ImageDraw.Draw(timg)
ft = ImageFont.truetype(FONT, 56)
fs = ImageFont.truetype(FONT, 22)
draw.text((W//2,H//2-45), "掌上金铲铲", fill=(212,175,55), font=ft, anchor="mm")
draw.text((W//2,H//2+25), "云顶之弈 AI 智能辅助平台", fill=(148,163,184), font=fs, anchor="mm")
draw.text((W//2,H-40), "系统功能完整演示  |  Vue 3 + Express + MongoDB + AI",
          fill=(100,116,139), font=ImageFont.truetype(FONT, 14), anchor="mm")
for _ in range(int(FPS * TITLE_SEC)):
    writer.write(pt(timg)); tf += 1

# 逐段页面
prev_img = None
for i, (key, _, _, _, _, text) in enumerate(SEGMENTS):
    dur = all_durations[i+1]
    frames_needed = int(FPS * dur)

    fpath = screenshot_map.get(key)
    if fpath and os.path.exists(fpath):
        raw = Image.open(fpath).convert("RGB")
        img = crop_to_720p(raw)
    else:
        img = Image.new("RGB", (W, H), (28,30,40))
        draw2 = ImageDraw.Draw(img)
        draw2.text((W//2,H//2), "加载中...", fill=(212,175,55),
                   font=ImageFont.truetype(FONT, 28), anchor="mm")

    if prev_img is not None:
        trans_steps = int(FPS * 0.5)
        for step in range(trans_steps):
            alpha = step / max(trans_steps-1, 1)
            blended = Image.blend(prev_img, img, alpha)
            writer.write(pt(overlay_subtitle(blended, text))); tf += 1
        frames_needed -= trans_steps
    else:
        trans_steps = int(FPS * 0.5)
        for step in range(trans_steps):
            alpha = step / max(trans_steps-1, 1)
            blended = Image.blend(timg, img, alpha)
            writer.write(pt(overlay_subtitle(blended, text))); tf += 1
        frames_needed -= trans_steps

    for _ in range(max(1, frames_needed)):
        writer.write(pt(overlay_subtitle(img, text))); tf += 1

    prev_img = img

# 片尾
ei = Image.new("RGB", (W, H), (28,30,40))
draw = ImageDraw.Draw(ei)
draw.text((W//2,H//2), "谢谢观看", fill=(212,175,55),
          font=ImageFont.truetype(FONT, 36), anchor="mm")
draw.text((W//2,H//2+40), "掌上金铲铲 · 软件体系结构课程设计",
          fill=(148,163,184), font=ImageFont.truetype(FONT, 16), anchor="mm")
trans_steps = int(FPS * 0.5)
for step in range(trans_steps):
    alpha = step / max(trans_steps-1, 1)
    blended = Image.blend(prev_img, ei, alpha)
    writer.write(pt(blended)); tf += 1
for _ in range(int(FPS * ENDING_SEC) - trans_steps):
    writer.write(pt(ei)); tf += 1

writer.release()
video_dur = tf / FPS
print(f"  视频帧数: {tf}, 画面时长: {video_dur:.1f}s")

# ── Step 4: 合并音频 ──
print("\n[4/4] 合并音频...")
full_audio = concatenate_audioclips(all_audio_clips)
audio_temp = os.path.join(BASE_DIR, "_full_narration.mp3")
full_audio.write_audiofile(audio_temp, fps=44100, logger=None)
full_audio.close()
for c in all_audio_clips:
    try: c.close()
    except: pass

print(f"  音频总: {total_audio_dur:.1f}s, 视频总: {video_dur:.1f}s")

from moviepy import VideoFileClip
vid = VideoFileClip(OUTPUT_VIDEO)
aud = AudioFileClip(audio_temp)

if aud.duration > vid.duration:
    aud = aud.subclipped(0, vid.duration)
elif vid.duration > aud.duration:
    pad_silence = AudioClip(lambda t: 0, duration=vid.duration - aud.duration, fps=44100)
    aud = concatenate_audioclips([aud, pad_silence])

final = vid.with_audio(aud)
merged_video = os.path.join(BASE_DIR, "掌上金铲铲_讲解视频_final.mp4")
final.write_videofile(merged_video, codec='libx264', audio_codec='aac',
                       fps=24, bitrate='4000k', preset='fast', threads=4)

vid.close(); aud.close(); final.close()
os.replace(merged_video, OUTPUT_VIDEO)

if os.path.exists(audio_temp):
    os.remove(audio_temp)
import shutil
if os.path.exists(AUDIO_DIR):
    shutil.rmtree(AUDIO_DIR)

size_mb = os.path.getsize(OUTPUT_VIDEO) / 1e6
print(f"\n完整讲解视频: {OUTPUT_VIDEO}")
print(f"大小: {size_mb:.1f} MB, 时长: {video_dur:.0f}s")
print("Done!")
