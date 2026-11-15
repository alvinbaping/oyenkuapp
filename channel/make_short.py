#!/usr/bin/env python3
"""Build a faceless stickman explainer Short: edge-tts voice + PIL frames + synthesized SFX + ffmpeg.
Usage: make_short.py OUTDIR   (env HTTPS_PROXY used for edge-tts)"""
import asyncio, json, math, os, subprocess, sys, wave, struct, random
from PIL import Image, ImageDraw, ImageFont
import edge_tts

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H, FPS = 1080, 1920, 30
VOICE = "en-US-GuyNeural"
SCENES = [  # (narration, pose)
    ("Why is yawning contagious?", "think"),
    ("Scientists still argue about it.", "shrug"),
    ("One idea: your brain cools itself down.", "hot"),
    ("A yawn pulls in cool air and boosts blood flow.", "yawn"),
    ("And we copy others without noticing.", "copy"),
    ("Follow for a new fact every day.", "wave"),
]
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 78)

async def tts(i, text):
    p = f"{OUT}/v{i}.mp3"
    com = edge_tts.Communicate(text, VOICE, rate="+8%", proxy=os.environ.get("HTTPS_PROXY"))
    await com.save(p)
    return p

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]))

def stick(d, cx, cy, pose, t):
    s = 1.0; lw = 14; col = (20, 20, 20)
    head = (cx, cy-260)
    d.ellipse([head[0]-70, head[1]-70, head[0]+70, head[1]+70], outline=col, width=lw, fill=(255,255,255))
    d.line([cx, cy-190, cx, cy+40], fill=col, width=lw)
    sw = math.sin(t*6)*30
    arms = {"think": [(cx+110, cy-170),(cx-110, cy-60)], "shrug":[(cx+120,cy-200+sw),(cx-120,cy-200-sw)],
            "hot":[(cx+120,cy-60),(cx-120,cy-60)], "yawn":[(cx+60,cy-240),(cx-120,cy-80)],
            "copy":[(cx+140,cy-100),(cx-140,cy-100)], "wave":[(cx+130,cy-270+sw*2),(cx-110,cy-60)]}[pose]
    for a in arms: d.line([cx, cy-150, a[0], a[1]], fill=col, width=lw)
    d.line([cx, cy+40, cx-90, cy+240], fill=col, width=lw); d.line([cx, cy+40, cx+90, cy+240], fill=col, width=lw)
    # face
    mouth_open = pose == "yawn"
    d.ellipse([cx-30, cy-285, cx-18, cy-273], fill=col); d.ellipse([cx+18, cy-285, cx+30, cy-273], fill=col)
    if mouth_open: d.ellipse([cx-18, cy-250, cx+18, cy-205], outline=col, width=8)
    else: d.arc([cx-25, cy-255, cx+25, cy-225], 20, 160, fill=col, width=8)
    if pose == "hot":
        for k in range(3): d.line([cx-40+k*40, cy-350, cx-40+k*40+10, cy-390-(t*40)%30], fill=(220,60,40), width=8)

def wrap(text, n=22):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur)+len(w)+1 > n: lines.append(cur); cur = w
        else: cur = (cur+" "+w).strip()
    return lines + [cur]

def frame(text, pose, t, bg):
    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    stick(d, W//2, 900+int(math.sin(t*4)*8), pose, t)
    y = 1360
    for ln in wrap(text):
        w = d.textlength(ln, font=FONT)
        for dx in (-3,0,3):
            for dy in (-3,0,3): d.text(((W-w)/2+dx, y+dy), ln, font=FONT, fill=(0,0,0))
        d.text(((W-w)/2, y), ln, font=FONT, fill=(255,230,60)); y += 100
    return im

def synth_wav(path, kind, length):
    sr = 44100; n = int(sr*length); r = random.Random(kind); out = []
    lp = 0.0
    for i in range(n):
        x = i/n
        if kind == "whoosh":
            env = math.sin(math.pi*x)**2; a = 0.15+0.7*x
            lp += a*((r.random()*2-1)-lp); v = lp*env*1.6
        else:  # pop
            env = math.exp(-x*14); v = math.sin(2*math.pi*(700-500*x)*i/sr)*env*0.8
        out.append(max(-1,min(1,v)))
    with wave.open(path, "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(b"".join(struct.pack("<h", int(v*30000)) for v in out))

async def main():
    paths = [f"{OUT}/v{i}.mp3" if os.path.exists(f"{OUT}/v{i}.mp3") else await tts(i, t) for i, (t, _) in enumerate(SCENES)]
    durs = [dur(p)+0.35 for p in paths]
    synth_wav(f"{OUT}/whoosh.wav", "whoosh", 0.45); synth_wav(f"{OUT}/pop.wav", "pop", 0.2)
    bgs = [(235,245,255),(255,243,224),(255,235,235),(232,250,238),(243,236,255),(255,250,220)]
    fdir = f"{OUT}/frames"; os.makedirs(fdir, exist_ok=True); n = 0; starts = []; t0 = 0
    for (text, pose), dd, bg in zip(SCENES, durs, bgs):
        starts.append(t0); t0 += dd
        for f in range(int(dd*FPS)):
            frame(text, pose, f/FPS, bg).save(f"{fdir}/{n:05d}.jpg", quality=88); n += 1
    # audio: voice at scene starts + whoosh at each cut + pop on emphasis
    inputs = []; filt = []; lab = []
    for i, (p, s) in enumerate(zip(paths, starts)):
        inputs += ["-i", p]; filt.append(f"[{i+1}:a]adelay={int(s*1000)+100}|{int(s*1000)+100}[v{i}]"); lab.append(f"[v{i}]")
    k = len(paths)+1
    for j, s in enumerate(starts[1:], 1):
        inputs += ["-i", f"{OUT}/whoosh.wav"]; filt.append(f"[{k}:a]volume=0.5,adelay={int(s*1000)-250}|{int(s*1000)-250}[w{j}]"); lab.append(f"[w{j}]"); k += 1
    inputs += ["-i", f"{OUT}/pop.wav"]; filt.append(f"[{k}:a]volume=0.6,adelay=50|50[p0]"); lab.append("[p0]")
    filt.append("".join(lab)+f"amix=inputs={len(lab)}:normalize=0,alimiter=limit=0.95[a]")
    subprocess.check_call(["ffmpeg","-y","-v","error","-framerate",str(FPS),"-i",f"{fdir}/%05d.jpg",*inputs,
        "-filter_complex",";".join(filt),"-map","0:v","-map","[a]","-c:v","libx264","-pix_fmt","yuv420p",
        "-c:a","aac","-shortest",f"{OUT}/short.mp4"])
    print(json.dumps({"video": f"{OUT}/short.mp4", "seconds": t0}))

asyncio.run(main())
