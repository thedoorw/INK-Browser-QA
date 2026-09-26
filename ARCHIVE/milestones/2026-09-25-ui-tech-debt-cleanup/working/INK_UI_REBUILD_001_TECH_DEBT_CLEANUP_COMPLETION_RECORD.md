# INK UI REBUILD 001 — Technical Debt Cleanup Completion Record

STATUS: `COMPLETE / MR_PASS / PROMOTED`

DATE: `2026-09-25`

TASK: `INK-UI-REBUILD-001-TECH-DEBT-CLEANUP`

PROMOTED MAIN: `9ebdbe771346e6509c902f71766b117ab674f503`

FINAL EVIDENCE COMMIT: `15ef1b4ec62312f7a843e18fbf787957b08da4f2`

FINAL STATUS RECORD: `e31e7ed605cecf9fdd92f1662dd69ba5991a451c`

## Purpose

Clean the UI foundation before Photoshop-aligned reconstruction so new UI work does not accumulate on top of obsolete regression contracts, duplicated panel/menu authorities, cascade-war CSS, fragmented responsive rules, stale brand contracts, or unstable first-paint behavior.

Frozen throughout this task:

- Renderer / WebGL / Canvas;
- Document model/schema/migration;
- History;
- Revision;
- Geometry / Recipe;
- CHAT proposal/approval/execution;
- persistence;
- FORMAT_VERSION;
- product version.

## Baseline debt

Initial audit:

```text
styles.css characters = 157379
!important = 223

.topbar = 14 definitions
.tool-rail = 9
.inspector = 14
.stage-wrap = 18
.statusbar = 6
.control-row = 12
.inspector-tab = 8
.creative-workspace-panel = 12

width families =
  410 / 440 / 560 / 760 / 761 / 860 / 900 / 980 / 1120

typography =
  multiple font stacks
  Georgia / direct system-ui residues
  6px–17px hard-coded sizes
  token authority not singular

panel/menu =
  multiple visible panel routes
  Dock same-item could not close
  File / Window menu behavior split
  legacy Inspector / edge controls still protected by QA

brand =
  favicon.svg + old JPG / SVG logo ambiguity

first paint =
  initial shell did not fully own intended light workstation state
```

## Gate execution

### G0 — Baseline evidence

Recorded measurable UI debt before mutation.

Result: `PASS`

### G1 — Obsolete UI QA contracts

Removed/replaced regression assertions that protected rejected UI behavior, including stale favicon / edge-toggle / legacy Inspector / old responsive expectations.

Result: `PASS`

Checkpoint: `a358a2f9e0071b4633031640c517f024aca0ed80`

### G2 — Menu / panel authority

Established one shell-owned panel state path and one application-menu controller.

Key behavior:

```text
Dock same active item → close
Dock different item → switch
Window menu → same panel authority
Contextual Advanced → Properties navigation only
legacy edge presenter → retired
one menu open at a time
Escape / outside click → close
```

Result: `PASS`

Checkpoint: `c229e6ec15355aa6ca99a987105f5a90bce5d7c4`

### G3 — First-paint authority

Made the generated/server-delivered shell own the intended light workstation appearance before Runtime boot.

Result:

```text
light first paint = PASS
black/dark startup flash contract = retired
Web / Portable generated shell authority preserved
```

Checkpoint: `63a660c856a1d0019beafb184899671f704752cd`

### G4 — Typography authority

Consolidated normal workstation typography onto one `--ui-font` authority and semantic type scale.

Result:

```text
Georgia = 0
hard-coded px font-size declarations = 0
normal workstation direct font stack = 0
monospace limited to diagnostic/code semantics
```

Checkpoint: `dcbc8c086a7da4ae202cc2c78eca424befba347f`

### G5 — CSS shell authority

Removed cascade-war presentation rules rather than appending another final override layer.

Before/after:

```text
!important = 223 → 19
presentation !important = 0

.topbar                   14 → 11
.tool-rail                 9 → 6
.inspector                14 → 8
.stage-wrap               18 → 4
.statusbar                 6 → 3
.control-row              12 → 6
.inspector-tab             8 → 4
.creative-workspace-panel 12 → 3
```

Remaining 19 `!important` declarations are semantic visibility / reduced-motion exceptions only.

Result: `PASS`

Checkpoint: `f9bf8481f7f0050db47c0c4bc551f154056c2eed`

### G6 — Responsive authority

Collapsed fragmented width logic into three named layout modes:

```text
DESKTOP_WIDE   > 1120
DESKTOP_NARROW 761–1120
COMPACT        <= 760
```

Pointer / height / reduced-motion queries remain capability modifiers, not extra width taxonomies.

Result: `PASS`

Checkpoint: `6731d07d01cc059054212592e6e34716e55d2ff5`

### G7 — Brand authority

Final contracts:

```text
favicon authority = assets/favicon.svg?v=0.1
visible logo authority = assets/INK_MARK_SOURCE_W-300.jpg?v=0.1
visible logo dimensions = 300x300
visible logo bytes = 19801
visible logo SHA256 =
08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
```

The exact user-approved visible logo was installed byte-for-byte and locked by QA.

Asset install commit: `c50e10aec6826876ee6b7cedc8af9271538b7274`

Exact route/SHA QA checkpoint: `1893abd440dc7401156c1bd2c7b9f2a77309f450`

Result: `PASS`

### G8 — Runtime and visual evidence

Final tested exact SHA:

`5bd8754aad3e53886ce6109bd350fa4fc5f68db9`

Windows Runtime:

```text
RUN = 36112690309
RUNNER = DESKTOP-NSOQH69
UI_SUITE = PASS
PRODUCT_UI_RUNTIME_FAIL = 0
```

Artifact:

```text
ARTIFACT_ID = 10854191875
DIGEST = sha256:7f06e3fe7876ad1e9d9d302b2867646928b5630b191069de0a166ae86ec0c3f2
```

Required real-browser captures:

```text
ui-first-paint.png
  1280x1024
  SHA256 b0cbbd73fc5b807ec7d3e2bc920b60494604af4009592c37ef9784991fa059a6

ui-1280x1024.png
  1280x1024
  SHA256 e3ca10151dd2f939183e9018f0d2e2e37904b4e9a4b5f765499eb577c9ea7986

ui-960x800.png
  960x800
  SHA256 095d785c2367d303f47ca0eedc4eef35b46498c2201ac4c409a2bf6f37813148
```

Capture transport was hardened to browser-native CDP `Page.captureScreenshot`, exact viewport metrics, PNG dimension validation, persisted-byte verification and SHA256 metadata.

Visual review:

- first paint is light and stable;
- no black-screen transition;
- 1280×1024 contained;
- 960×800 contained;
- no horizontal overflow detected.

Result: `PASS`

## Final health state

```text
UI_TECH_DEBT_CLEANUP = COMPLETE

OBSOLETE_UI_REGRESSION_CONTRACTS = 0
VISIBLE_PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLER = 1
FIRST_PAINT_AUTHORITY = 1
TYPOGRAPHY_FAMILY_AUTHORITY = 1
TYPOGRAPHY_SCALE_AUTHORITY = 1
PRESENTATION_IMPORTANT = 0
WIDTH_LAYOUT_MODES = 3
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
FROZEN_CORE_MUTATION = 0
```

## Promotion

Reviewed product/QA/evidence payload was clean-promoted to main:

`9ebdbe771346e6509c902f71766b117ab674f503`

Final G8 evidence commit:

`15ef1b4ec62312f7a843e18fbf787957b08da4f2`

Main completion/status record:

`e31e7ed605cecf9fdd92f1662dd69ba5991a451c`

## Separate unresolved baseline issue

The central batch reached UI PASS and then the Creative harness timed out at 360 seconds.

This exact pattern existed before the UI cleanup in Runtime run `36088550693`:

```text
UI = PASS
Creative = timeout 360s
Geometry = not reached
```

Therefore:

```text
CREATIVE_BASELINE_TIMEOUT = SEPARATE MR_HOLD
NOT ATTRIBUTED TO UI CLEANUP
DO NOT REOPEN UI TECH-DEBT CLEANUP FOR THIS ISSUE
```

## Next UI lane

```text
PHOTOSHOP_WORKSTATION_REBUILD = RELEASED
FRESH BOUNDED WORK ORDER REQUIRED
START FROM PROMOTED MAIN
DO NOT REUSE THE CLEANUP BRANCH AS THE NEW DEVELOPMENT LANE
```
