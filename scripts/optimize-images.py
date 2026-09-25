"""Create delivery-sized copies of existing photos without altering their content.

Run with Pillow installed, then run npm run sync:shell and npm run check.
Original full-resolution images remain available for high-density product views.
"""
from pathlib import Path
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
import io
import json
import re
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets/images/responsive"
OUTPUT.mkdir(exist_ok=True)


def variant(source, size, quality=84):
    with Image.open(source) as original:
        image = original.convert("RGBA" if "A" in original.getbands() else "RGB")
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        image.save(buffer, "WEBP", quality=quality, method=6)
        data = buffer.getvalue()
        filename = f"{source.stem}-{size}-{sha256(data).hexdigest()[:10]}.webp"
        (OUTPUT / filename).write_bytes(data)
        return {"src": "/assets/images/responsive/" + filename,
                "width": image.width, "height": image.height,
                "bytes": len(data), "originalBytes": source.stat().st_size}


class Tag(HTMLParser):
    def handle_starttag(self, tag, attrs):
        self.attrs = dict(attrs)


def attributes(tag):
    parser = Tag()
    parser.feed(tag)
    return parser.attrs


def attr(tag, name, value):
    pattern = re.compile(r"\s" + re.escape(name) + r"=([\"']).*?\1", re.S)
    replacement = f' {name}="{escape(str(value), quote=True)}"'
    if pattern.search(tag):
        return pattern.sub(lambda _: replacement, tag, count=1)
    return re.sub(r"\s*/?>$", lambda m: replacement + m[0], tag, count=1)


manifest = {}
for source in sorted((ROOT / "assets/images/on-pet").glob("*.webp")):
    manifest["/" + source.relative_to(ROOT).as_posix()] = variant(source, 800)

logo = variant(ROOT / "assets/images/logo.jpg", 128, quality=90)
with Image.open(ROOT / "assets/images/logo.jpg") as image:
    icon = image.convert("RGB")
    icon.thumbnail((32, 32), Image.Resampling.LANCZOS)
    icon.save(OUTPUT / "huijia-favicon-32.png", optimize=True)

for page in list(ROOT.glob("*.html")) + list((ROOT / "partials").glob("*.html")):
    html = page.read_text()

    def image_tag(match):
        tag = match[0]
        data = attributes(tag)
        source = "/" + data.get("src", "").lstrip("/")
        if source not in manifest:
            candidates = [item.strip().split()[0] for item in data.get("srcset", "").split(",") if item.strip()]
            source = next((candidate for candidate in candidates if candidate in manifest), source)
        if source == "/assets/images/logo.jpg":
            for key, value in {"src": logo["src"], "width": 128, "height": 128, "decoding": "async"}.items():
                tag = attr(tag, key, value)
            return tag
        if source not in manifest:
            return tag
        item = manifest[source]
        with Image.open(ROOT / source.lstrip("/")) as original:
            srcset = f'{item["src"]} {item["width"]}w, {source} {original.width}w'
        if "data-gallery-main" in data:
            sizes = "(max-width: 900px) calc(100vw - 66px), 540px"
        elif int(data.get("width", "0")) <= 128:
            sizes = "96px"
        elif page.name == "index.html":
            sizes = "(max-width: 620px) calc(100vw - 40px), (max-width: 980px) calc((100vw - 64px) / 2), 360px"
        else:
            sizes = "(max-width: 480px) calc(100vw - 36px), (max-width: 900px) calc((100vw - 52px) / 2), (max-width: 1050px) calc((100vw - 280px) / 2), 320px"
        for key, value in {"src": item["src"], "srcset": srcset, "sizes": sizes}.items():
            tag = attr(tag, key, value)
        if "data-on-pet-src" in data:
            tag = attr(tag, "data-on-pet-src", item["src"])
            tag = attr(tag, "data-on-pet-srcset", srcset)
        return tag

    def gallery_button(match):
        tag = match[0]
        data = attributes(tag)
        source = data.get("data-src")
        if source not in manifest:
            candidates = [item.strip().split()[0] for item in data.get("data-srcset", "").split(",") if item.strip()]
            source = next((candidate for candidate in candidates if candidate in manifest), source)
        if "data-gallery-thumb" in data and source in manifest:
            item = manifest[source]
            with Image.open(ROOT / source.lstrip("/")) as original:
                tag = attr(tag, "data-srcset", f'{item["src"]} {item["width"]}w, {source} {original.width}w')
            tag = attr(tag, "data-src", item["src"])
        return tag

    html = re.sub(r"<img\b[^>]*>", image_tag, html)
    html = re.sub(r"<button\b[^>]*>", gallery_button, html)
    html = re.sub(r"<link\b[^>]*\brel=[\"']icon[\"'][^>]*>",
                  '<link href="/assets/images/responsive/huijia-favicon-32.png" rel="icon" type="image/png"/>', html)
    page.write_text(html)

(ROOT / "scripts/performance-images.json").write_text(json.dumps({"logo": logo, "images": manifest}, indent=2) + "\n")
before = sum(item["originalBytes"] for item in manifest.values())
after = sum(item["bytes"] for item in manifest.values())
print(json.dumps({"photoVariants": len(manifest), "originalBytes": before, "variantBytes": after, "logo": logo}))
