#!/usr/bin/env python3
"""Assemble src/ fragments into the single-file dist/index.html.

The repository ships one self-contained HTML file (no build step required to
*use* it). This script exists so the shipped artifact has a reviewable source
of truth.

    python tools/build.py            # writes index.html
    python tools/build.py --check    # builds in memory and diffs, writes nothing
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
TARGET = ROOT / "index.html"

FRAGMENTS = {
    "vendor/jsqr.min.js": SRC / "vendor" / "jsqr.min.js",
    "vendor/html2canvas.min.js": SRC / "vendor" / "html2canvas.min.js",
    "head.html": SRC / "head.html",
    "styles/app.css": SRC / "styles" / "app.css",
    "body/index.body.html": SRC / "body" / "index.body.html",
    "app.js": SRC / "app.js",
}

TOKEN = "<!--@inject {name}-->"


def build() -> str:
    out = (SRC / "index.template.html").read_bytes().decode("utf-8")
    for name, path in FRAGMENTS.items():
        token = TOKEN.format(name=name)
        if token not in out:
            raise SystemExit(f"template is missing token {token}")
        out = out.replace(token, path.read_bytes().decode("utf-8"), 1)
    if "@inject" in out:
        raise SystemExit("unresolved inject token left in output")
    return out


def main() -> None:
    text = build()
    data = text.encode("utf-8")
    if "--check" in sys.argv:
        current = TARGET.read_bytes() if TARGET.exists() else b""
        if current != data:
            raise SystemExit("index.html is out of date — run: python tools/build.py")
        print(f"ok: index.html matches src/ ({len(data)} bytes)")
        return
    TARGET.write_bytes(data)
    print(f"wrote {TARGET.relative_to(ROOT)} ({len(data)} bytes)")


if __name__ == "__main__":
    main()
