"""把「后台修改 → 前台生效」两张面板拼成一张对比图（交付物 04 的说明图）。"""
import json
from PIL import Image, ImageDraw, ImageFont

BG = (11, 16, 32)
TEXT = (230, 234, 242)
DIM = (139, 150, 173)
FAINT = (94, 105, 128)
ACCENT = (109, 140, 255)
HILITE = (248, 113, 113)

FONT = "C:/Windows/Fonts/msyh.ttc"
FONT_BOLD = "C:/Windows/Fonts/msyhbd.ttc"

boxes = json.load(open("_shots/panels/_boxes.json", encoding="utf-8"))
admin = Image.open("_shots/panels/_panel-admin.png").convert("RGB")
front = Image.open("_shots/panels/_panel-front.png").convert("RGB")
# 只取 Hero 的文字列，右侧终端卡片在这个话题里不重要，裁掉后放大更清楚
front = front.crop((0, 0, min(1000, front.width), front.height))

PANEL_W = 720
LEFT = (40, 168)
RIGHT = (880, 168)

admin_s = PANEL_W / admin.width
front_s = PANEL_W / front.width
admin_r = admin.resize((PANEL_W, round(admin.height * admin_s)), Image.LANCZOS)
front_r = front.resize((PANEL_W, round(front.height * front_s)), Image.LANCZOS)

W = 1640
H = LEFT[1] + admin_r.height + 96
canvas = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(canvas)

title = ImageFont.truetype(FONT_BOLD, 34)
sub = ImageFont.truetype(FONT, 18)
cap = ImageFont.truetype(FONT_BOLD, 20)
small = ImageFont.truetype(FONT, 15)

draw.text((40, 40), "后台修改「一句话介绍」→ 前台立即生效", font=title, fill=TEXT)
draw.text(
    (40, 92),
    "https://againqw.github.io/#/admin/profile   →   https://againqw.github.io/",
    font=sub,
    fill=DIM,
)

draw.text(LEFT, "① 后台 /admin/profile：修改并保存", font=cap, fill=ACCENT)
draw.text(RIGHT, "② 前台首页 Hero：刷新即显示新文案", font=cap, fill=ACCENT)

canvas.paste(admin_r, LEFT)
canvas.paste(front_r, RIGHT)


DSF = 1.5  # 截图时 deviceScaleFactor，box 是 CSS 像素，需先换算成图像像素


def highlight(panel, offset, box, scale):
    x = offset[0] + box["x"] * DSF * scale
    y = offset[1] + box["y"] * DSF * scale
    w = box["w"] * DSF * scale
    h = box["h"] * DSF * scale
    draw.rounded_rectangle(
        [x - 6, y - 6, x + w + 6, y + h + 6], radius=8, outline=HILITE, width=3
    )


highlight(admin, LEFT, boxes["admin"]["input"], admin_s)
highlight(front, RIGHT, boxes["front"]["tagline"], front_s)

# 中间箭头
arrow = ImageFont.truetype(FONT, 46)
draw.text((LEFT[0] + PANEL_W + 26, LEFT[1] + 150), "→", font=arrow, fill=ACCENT)

note_y = LEFT[1] + admin_r.height + 28
draw.text(
    (40, note_y),
    "同一份数据源：后台写入 localStorage，前台通过 useSyncExternalStore 订阅，保存后无需刷新构建（PRD FR-38）。",
    font=small,
    fill=FAINT,
)
draw.text(
    (40, note_y + 26),
    "演示账号 admin / admin123 —— 后台可改个人信息、技能、项目、博客与站点配色。",
    font=small,
    fill=FAINT,
)

canvas.save("deliverables/04-13-后台修改-前台生效.png")
print("saved 04-13, size:", canvas.size)
