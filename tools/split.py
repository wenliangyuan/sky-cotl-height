#!/usr/bin/env python3
"""One-off provenance splitter.

Takes the shipped single-file index.html and splits it into reviewable source
fragments plus a template. The split is loss-free: `python tools/build.py`
reassembles a byte-identical file.

Usage:
    python tools/split.py <path-to-original-index.html>
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENDOR = ROOT / "src" / "vendor"
STYLES = ROOT / "src" / "styles"
BODY = ROOT / "src" / "body"
SRC = ROOT / "src"

TOK = {
    "jsqr": "<!--@inject vendor/jsqr.min.js-->",
    "html2canvas": "<!--@inject vendor/html2canvas.min.js-->",
    "head": "<!--@inject head.html-->",
    "css": "<!--@inject styles/app.css-->",
    "body": "<!--@inject body/index.body.html-->",
    "app": "<!--@inject app.js-->",
}


def once(text, needle, start=0):
    i = text.find(needle, start)
    if i < 0:
        raise SystemExit(f"marker not found: {needle!r}")
    return i


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    original = Path(sys.argv[1])
    raw = original.read_bytes()
    text = raw.decode("utf-8")

    i_script1 = once(text, "<script>")
    end1 = once(text, "</script>", i_script1) + len("</script>")
    jsqr = text[i_script1 + len("<script>"):end1 - len("</script>")]

    gap1 = text[end1:once(text, "<script>", end1)]
    i_script2 = end1 + len(gap1)
    end2 = once(text, "</script>", i_script2) + len("</script>")
    html2canvas = text[i_script2 + len("<script>"):end2 - len("</script>")]

    i_links = once(text, '<link rel="preconnect"', end2)
    gap2 = text[end2:i_links]

    i_style = once(text, "<style>", i_links)
    head = text[i_links:i_style]
    end_style = once(text, "</style>", i_style) + len("</style>")
    css = text[i_style + len("<style>"):end_style - len("</style>")]

    i_head_close = once(text, "</head>", end_style)
    gap3 = text[end_style:i_head_close]
    i_body = once(text, "<body>", i_head_close)
    gap3 += text[i_head_close:i_body]

    i_app = once(text, "<script>", i_body)
    body = text[i_body + len("<body>"):i_app]
    end_app = once(text, "</script>", i_app) + len("</script>")
    app = text[i_app + len("<script>"):end_app - len("</script>")]

    tail = text[end_app:]

    for d in (VENDOR, STYLES, BODY):
        d.mkdir(parents=True, exist_ok=True)
    (VENDOR / "jsqr.min.js").write_bytes(jsqr.encode("utf-8"))
    (VENDOR / "html2canvas.min.js").write_bytes(html2canvas.encode("utf-8"))
    (SRC / "head.html").write_bytes(head.encode("utf-8"))
    (STYLES / "app.css").write_bytes(css.encode("utf-8"))
    (BODY / "index.body.html").write_bytes(body.encode("utf-8"))
    (SRC / "app.js").write_bytes(app.encode("utf-8"))

    template = (
        text[:i_script1]
        + "<script>" + TOK["jsqr"] + "</script>" + gap1
        + "<script>" + TOK["html2canvas"] + "</script>" + gap2
        + TOK["head"] + "<style>" + TOK["css"] + "</style>" + gap3
        + "<body>" + TOK["body"] + "<script>" + TOK["app"] + "</script>" + tail
    )
    (SRC / "index.template.html").write_bytes(template.encode("utf-8"))

    rebuilt = template
    for token, frag in (
        (TOK["jsqr"], jsqr),
        (TOK["html2canvas"], html2canvas),
        (TOK["head"], head),
        (TOK["css"], css),
        (TOK["body"], body),
        (TOK["app"], app),
    ):
        if token not in rebuilt:
            raise SystemExit(f"token lost during split: {token}")
        rebuilt = rebuilt.replace(token, frag, 1)

    if rebuilt != text:
        raise SystemExit("REBUILD MISMATCH — split is not loss-free, nothing shipped")

    print(f"ok: split {len(raw)} bytes, rebuild verified byte-identical")
    for p in sorted(ROOT.rglob("*")):
        if p.is_file() and "tools" not in p.parts:
            print(f"  {p.relative_to(ROOT)}  {p.stat().st_size}")


if __name__ == "__main__":
    main()
