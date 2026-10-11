# Sky COTL Height Tool

A single-file, backend-free height checker for *Sky: Children of the Light*. Everything is decoded and computed locally in your browser — nothing is uploaded.

- **CBG extraction** — paste a NetEase CBG item link to read the public JSON and get that account's scale / height / graduated seasons / wingless flag, plus current, tallest, shortest and dwarf-mask height
- **Outfit QR height** — upload an in-game *Outfit QR* screenshot, or paste the `o=` URL, to decode your height

> QR height checking already has several public implementations. **CBG extraction** has none we could find, and is this project's focus.

## CBG extraction (the point of this project)

**No login, no packet capture, no extension** — paste a CBG listing link and read that account's real scale and height.

When rendering an item page, CBG's own frontend fetches a public equipment-description JSON:

```
https://cbg-other-desc.res.netease.com/sky/static/equipdesc/{itemID}.json
```

The character data lives in its `equip_desc` field (parsed, then `raw_content`). This tool reads that JSON directly in the browser and pulls out:

| Field | Source | Shown as |
|---|---|---|
| `equipped_outfit.scale` | `equip_desc` → `raw_content` | scale S, to 10 decimals |
| `equipped_outfit.height` | same | height H, plus the `round(H × 10¹⁰)` integer form |
| `season_graduation_count` (or `season_graduation.length`) | `raw_content` | graduated seasons |
| `is_wingless` | `raw_content` | **wingless / winged** flag |

With S and H it computes **current / tallest / shortest / dwarf-mask** height and shows all four next to the wingless flag — the few things that matter most when shopping for an alt, on one card.

**Batch comparison**: the input accepts one item link per line (it must contain `/equip/<digits>/<itemID>`, i.e. the full link copied from CBG) and returns a single table (ID / S / H / current / tallest / shortest / seasons / wingless), exportable as an image.

**Two layers of fallback**:

1. **Direct fetch** — one request in the normal case, with no third party involved;
2. **Public CORS proxies** — if the browser blocks the cross-origin request, five proxies are tried in turn.

If all of them fail the tool reports the error and suggests opening the item page in a browser (`file://` and in-app preview panes are the usual culprits for the cross-origin block).

> Through a proxy, the request is relayed by a third-party server. To avoid that, serve this page from a local static server or GitHub Pages so the direct fetch works.

## Formulas

With `S = scale` and `H = height`:

```
current height      = 7.6  − 8.3 × S − 3 × H
tallest height      = 1.6  − 8.3 × S      (H = +2)
shortest height     = 13.6 − 8.3 × S      (H = −2)
dwarf-mask height   = 16.6 − 8.3 × S      (shorter than the minimum)
```

**Direction**: a **smaller** computed value means taller — `1.6 − 8.3S` is the tallest and `16.6 − 8.3S` (dwarf mask) the shortest. In terms of the raw height value, a **larger** `H` is taller (`H = +2` max, `H = −2` min). Some calculators print the height as `round(height × 10¹⁰)`; both forms are recognised.

> ⚠️ Unverified: in `calculateStats()` (the outfit-QR path) `tallest` / `shortest` are assigned the opposite way round, likely mislabelled. PRs welcome.

## Usage

**CBG**: paste one or more item links (one per line, full links as copied from CBG), then hit **Extract**.

**Outfit QR**:

1. In game, go to **Settings → Account → Account Info → Outfit QR** (not the friend QR code) and screenshot it.
2. Drop or `Ctrl+V` the screenshot, or paste the whole `https://sky.thatg.co/o=...` URL, then hit **Calculate**.

## Running and building

No build step — just open `index.html` (opened as `file://`, the browser blocks the CBG cross-origin request; use a static server or Pages instead).

```bash
python -m http.server 8000      # serve locally
python tools/build.py           # regenerate index.html from src/
python tools/build.py --check   # assert artifact matches source (used in CI)
```

`index.html` is the only file you deploy. Its contents live under `src/` (`app.js`, `styles/app.css`, `body/`, `vendor/`) for reviewability; the two are byte-identical.

## License and disclaimer

MIT. Embeds [jsQR](https://github.com/cozmo/jsQR) 1.4.0 (Apache-2.0) and [html2canvas](https://github.com/niklasvh/html2canvas) 1.4.1 (MIT) — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Unofficial project, not affiliated with thatgamecompany or NetEase. Height values are community approximations, for reference only.

## Related projects

- <https://github.com/dream10325/sky-cotl-height-tool> — QR height checker, multi-language
- <https://github.com/JustinLove/sky-outfit-code-height> — documents that the QR payload is LZ4-block-compressed base64url JSON
- <https://github.com/naxida521/sky-height> — scanner plus outfit gallery and backend
