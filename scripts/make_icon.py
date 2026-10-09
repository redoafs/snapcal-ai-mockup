# -*- coding: utf-8 -*-
"""Buat ikon aplikasi SnapCal AI (assets/snapcal.ico)."""
import os
from PIL import Image, ImageDraw

os.makedirs('assets', exist_ok=True)
S = 256


def lerp(a, b, t):
    return int(a + (b - a) * t)


img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
px = img.load()
top = (14, 124, 134)      # teal
bot = (27, 38, 59)        # navy
for y in range(S):
    t = y / (S - 1)
    r, g, b = lerp(top[0], bot[0], t), lerp(top[1], bot[1], t), lerp(top[2], bot[2], t)
    for x in range(S):
        px[x, y] = (r, g, b, 255)

mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=58, fill=255)
img.putalpha(mask)

d = ImageDraw.Draw(img)
# piring (cincin putih)
d.ellipse([56, 74, 200, 218], outline=(255, 255, 255, 255), width=15)
d.ellipse([82, 100, 174, 192], fill=(255, 255, 255, 255))
# daun hijau di dalam piring
d.ellipse([104, 118, 166, 166], fill=(52, 211, 153, 255))
d.polygon([(135, 118), (166, 118), (166, 150)], fill=(16, 185, 129, 255))
# kilau kecil
d.ellipse([96, 112, 116, 132], fill=(255, 255, 255, 120))

sizes = [16, 24, 32, 48, 64, 128, 256]
img.save('assets/snapcal.ico', format='ICO', sizes=[(s, s) for s in sizes])
img.resize((256, 256)).save('assets/snapcal.png')
print('ditulis: assets/snapcal.ico dan assets/snapcal.png')
