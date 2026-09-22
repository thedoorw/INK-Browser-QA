# INK UI MAINT 001 — Photoshop Shell Alignment Report v0.1

STATUS: UI_PASS / SOURCE_STATIC_PASS / RUNTIME_PASS

## Task
INK-UI-MAINT-001 — Photoshop Shell Geometry / Pixel Alignment v0.1

Reviewed Runtime source:
`b523fdda30ff327dc4fd3231f5b4356992f003cc`

Runtime workflow:
`INK-UI-MAINT-001 Windows Runtime`

Runtime run:
`35727222696`

Runtime artifact:
`ink-ui-maint-001-b523fdda30ff327dc4fd3231f5b4356992f003cc-35727222696`

Artifact digest:
`sha256:d6065099d901c8f2553f9c58fa4458c03fd754e4930cdbc2f0bdd843230fd3e5`

## Runtime result

```text
BATCH = PASS
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
UI CHECKS = 61 / 61 PASS
STATIC CHECKS = 26 PASS / 0 FAIL
FORMAT_VERSION = 4
```

Browser:
`C:\Program Files\Google\Chrome\Application\chrome.exe`

Runtime viewport:
`1280 × 800 CSS px / DPR 1`

## Measured desktop geometry

| Surface | Runtime rectangle / value | Result |
|---|---:|---|
| Menu | y 0–24 / 24 px | PASS |
| Shared options row | y 24–60 / 36 px | PASS |
| Workspace origin | y = 60 | PASS |
| Left tool rail | x 0–40 / 40 px | PASS |
| Initial stage | x 40–1240 / 1200 px | PASS |
| Right dock | x 1240–1280 / 40 px | PASS |
| Document title | 236 × 26 px | PASS |
| Default primary panel | 252 px | PASS |
| Expanded stage | x 40–988 / 948 px | PASS |
| Primary panel | x 988–1240 / 252 px | PASS |

The left rail and right dock are edge-attached with no outer shell gap.
The stage begins immediately after the left rail and ends immediately before the dock.
The primary panel occupies the exact interval between canvas and dock.

## Layout workbench / real A4 evidence

Runtime pixel evidence:

```text
workbench corner = [43,44,46,255]
A4 center = [254,253,248,255]
stage CSS background = rgb(38,38,38)
artboard preset = A4
orientation = portrait
physical = 210 × 297 mm
output = 2480 × 3508 px @ 300 PPI
```

Result:
`WORKBENCH_PAGE_RELATIONSHIP_POLISHED = PASS`

The existing real artboard renderer remains authoritative. No fake DOM page was added.

## Context / panel regression

Runtime PASS:
- Pen / Pencil / Marker / Brush / Airbrush
- Eraser / Shape / Text
- Selection contextual actions
- Layers / History
- Reference / Compose / CHAT / Revision
- New / Open / Save / Export
- Fullscreen command surface
- keyboard workspace shortcuts
- narrow desktop containment
- mobile Inspector containment

## Web / Portable

`PORTABLE_WEB_PARITY = PASS`

The contextual command surface remains singular and reuses existing command-bearing nodes.
No duplicate command authority or simulated UI command path was introduced.

## Boundaries

Changed product implementation is limited to:
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`

No changes to:
- Renderer / WebGL / Canvas engine
- Document authority / schema / migration
- History semantics
- Revision semantics
- Recipe / Geometry
- Core module contracts
- CHAT proposal / approval / execution semantics
- persistence semantics
- package / certification
- product base version

`CORE_MUTATION = 0`
`PACKAGE_MUTATION = 0`

## Promotion policy

Branch-local Work Order / progress files and temporary Runtime workflow infrastructure are excluded from clean promotion.

Promoted QA regression payload:
- `qa/core/tests/unit/panel-chat-polish-v0.1.test.mjs`
- `qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs`
- `qa/runtime/ink-web-ui-001-harness.html`

## UR decision

```text
PS_TOP_SHELL_GEOMETRY_ALIGNED = PASS
LEFT_RAIL_PIXEL_ATTACHED = PASS
RIGHT_DOCK_PANEL_GEOMETRY_ALIGNED = PASS
TOPBAR_VISUAL_WEIGHT_ALIGNED = PASS
WORKBENCH_PAGE_RELATIONSHIP_POLISHED = PASS
SHELL_PIXEL_GRID_CLEAN = PASS
PS_SHELL_PARITY_REGRESSION_PASS = PASS
RUNTIME_QA = PASS
UI_PASS = YES
```
