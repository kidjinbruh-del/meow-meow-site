"""Скачивает сабсеты шрифтов Google Fonts и генерирует локальный fonts.css."""
import re
import pathlib
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
CSS_URL = ("https://fonts.googleapis.com/css2?"
           "family=Golos+Text:wght@400..800&"
           "family=JetBrains+Mono:wght@400..600&display=swap")

ROOT = pathlib.Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "assets" / "fonts"
FONT_DIR.mkdir(parents=True, exist_ok=True)

req = urllib.request.Request(CSS_URL, headers={"User-Agent": UA})
css = urllib.request.urlopen(req, timeout=60).read().decode("utf-8")

pattern = re.compile(
    r"/\*\s*([a-z0-9-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", re.S | re.I)
blocks = pattern.findall(css)
print("blocks:", len(blocks))

KEEP = {"cyrillic", "latin", "latin-ext"}
rows = []
for subset, body in blocks:
    if subset not in KEEP:
        continue
    family = re.search(r"font-family:\s*'([^']+)'", body).group(1)
    weight = re.search(r"font-weight:\s*([^;]+);", body).group(1).strip()
    url = re.search(r"src:\s*url\(([^)]+)\)", body).group(1).strip()
    urange = re.search(r"unicode-range:\s*([^;]+);", body).group(1).strip()
    slug = family.lower().replace(" ", "-")
    name = f"{slug}-{subset}.woff2"
    target = FONT_DIR / name
    if not target.exists():
        data = urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": UA}),
            timeout=60).read()
        target.write_bytes(data)
        print("saved", name, len(data))
    rows.append((family, weight, name, urange))

lines = ["/* Локальные сабсеты Google Fonts (OFL). Сгенерировано tools/fetch_fonts.py. */", ""]
for family, weight, name, urange in rows:
    lines += [
        "@font-face {",
        f"  font-family: '{family}';",
        "  font-style: normal;",
        f"  font-weight: {weight};",
        "  font-display: swap;",
        f"  src: url('../fonts/{name}') format('woff2');",
        f"  unicode-range: {urange};",
        "}",
        "",
    ]
(ROOT / "assets" / "css" / "fonts.css").write_text("\n".join(lines), encoding="utf-8")
print("css written, families:", sorted({r[0] for r in rows}))
