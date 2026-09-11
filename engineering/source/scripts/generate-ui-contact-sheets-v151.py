from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "tests" / "browser-evidence-v1.5.1"

def font(size=24):
    for candidate in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/tmp/fonts/NotoSans-Regular.ttf"):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()

def sheet(name, items):
    opened = [(label, Image.open(path).convert("RGB")) for label, path in items]
    width = 800
    resized = []
    for label, image in opened:
        height = round(image.height * width / image.width)
        resized.append((label, image.resize((width, height), Image.Resampling.LANCZOS)))
    body_height = max(image.height for _, image in resized)
    output = Image.new("RGB", (width * len(resized), body_height + 52), "#202224")
    draw = ImageDraw.Draw(output)
    for index, (label, image) in enumerate(resized):
        x = index * width
        output.paste(image, (x, 52))
        draw.text((x + 18, 12), label, font=font(), fill="#f3f4f4")
    target = EVIDENCE / name
    output.save(target, optimize=True)
    return target

sheet("UI_Regression_Initial_v1.4.0_v1.5.0_v1.5.1.png", [
    ("INK v1.4.0 · Initial", EVIDENCE / "regression-1.4.0-initial.png"),
    ("INK v1.5.0 · Initial", EVIDENCE / "regression-1.5.0-initial.png"),
    ("INK v1.5.1 RC · Initial", EVIDENCE / "regression-1.5.1-initial.png"),
])
sheet("UI_Regression_Panels_v1.4.0_v1.5.0_v1.5.1.png", [
    ("INK v1.4.0 · Brush", EVIDENCE / "regression-1.4.0-panel.png"),
    ("INK v1.5.0 · AI Panel", EVIDENCE / "regression-1.5.0-panel.png"),
    ("INK v1.5.1 RC · AI Panel", EVIDENCE / "regression-1.5.1-panel.png"),
])
print("UI contact sheets generated")
