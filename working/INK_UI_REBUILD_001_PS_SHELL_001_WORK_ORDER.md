# INK UI REBUILD 001 — PS SHELL 001 Work Order

STATUS: `UI_AUTHORIZED / DEV_START / UR_OWNED`

TASK: `INK-UI-REBUILD-001-PS-SHELL-001`

TITLE: `Photoshop Shell Geometry Alignment — Reference-Locked Pass 1`

BRANCH: `work/ink-ui-rebuild-001-ps-shell-001`

AUTHORIZED_FROM_MAIN: `d1af911c4bfab8c3a279c472018af885aac55a61`

UI_AUTHORITY: `UR = END-TO-END UI AUTHORITY`

## 1. User direction

The visible INK workstation is to become a near-complete light-gray Photoshop-style workstation.

This Work Order begins implementation only after the Photoshop reference has been numerically measured.

Authoritative visual reference:
- `ps-1.png`
- `ps-2.png`

Authoritative measurement:
- `working/INK_UI_REBUILD_001_PS_REFERENCE_MEASUREMENT_SHEET_v0.1.md`

Program:
- `working/INK_UI_REBUILD_001_PHOTOSHOP_ALIGNMENT_WORKPACK.md`

## 2. Parallel-lane rule

Current MR technical closure is still active.

USER has now authorized Photoshop UI alignment to begin.

To avoid cross-lane conflict:

```text
PS-SHELL-001 MAY PROCEED NOW
= shell / geometry / visual chrome only

FINAL COMMAND / CAPABILITY PLACEMENT LOCK
= wait for CURRENT_CAPABILITY_BASELINE freeze at technical C3
```

This Work Order must not change capability semantics or final command inventory.

## 3. Measurement interpretation

Resizable Photoshop panels are not fixed by one screenshot width.

Use:

- `LOCKED_FIXED` for true shell geometry;
- `ALIGNMENT_RELATION` for edge/boundary relationships;
- `REFERENCE_STATE_ONLY` for captured resizable panel widths/heights;
- `OBSERVED_DENSITY` for local spacing/pitch evidence.

Do not freeze a resizable panel merely because `ps-1` shows it at 252 px.

## 4. Required shell targets

### 4.1 Top chrome

Photoshop measured structure:

```text
menu content       24 px
divider             1 px
options content    35 px
divider             1 px
TOTAL              61 px
```

INK must render the workstation origin at:

`y = 61 px`

Implementation may represent the two content+divider bands as:
- first total band = 25 px;
- second total band = 36 px;

provided Runtime proves the visible content/divider structure and final origin are correct.

### 4.2 Left toolbar

Reference states:

```text
single toolbar visible region = 39 px
+ divider                     = 1 px
canvas origin                 = x 40

double toolbar visible region = 72 px
+ divider                     = 1 px
canvas origin                 = x 73
```

Single and double modes must remain the same tool system.

Reference density:
- selected-tool visible fill ≈ 31 × 24 px;
- vertical tool-row pitch ≈ 26 px;
- double-column horizontal origin shift ≈ 33 px.

Density values are guidance, not independent Core contracts.

### 4.3 Right collapsed dock

Reference state:

```text
collapsed visible dock = 39 px
divider                = 1 px
total stage reservation = 40 px
```

Keep the right edge attached.

Do not redesign panel semantics in this pass.

### 4.4 Expanded right panel

The `ps-1` 252 px width is a reference state only.

PS-SHELL-001 must preserve current resize capability and may not introduce a fixed 252 px lock merely to match the screenshot.

Detailed Photoshop dock/panel replacement behavior belongs to the later right-panel phase.

### 4.5 Bottom/status

The supplied Photoshop captures contain no reliable open-document Photoshop status-bar reference; the Windows taskbar begins at y=994.

Therefore:

`STATUSBAR_PS_EXACT_GEOMETRY = NOT_LOCKED_IN_THIS_PASS`

Do not remove or arbitrarily resize the INK status bar in PS-SHELL-001.

## 5. Expected bounded source delta

Preferred product source:
- `product/source/styles.css`

QA:
- `qa/runtime/ink-web-ui-001-harness.html`

Generated Web/Portable outputs:
- only through the existing generator path.

BUILD_ID files:
- update only if required by the normal generated/publication path.

Shell markup:
- do not modify unless source evidence proves CSS cannot implement the measured shell geometry cleanly.

## 6. Existing authority to edit, not override

The accepted desktop shell authority is the consolidated:

`INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY`

Required discipline:

```text
edit accepted authority
→ update obsolete QA expectation
→ generator/parity
→ no appended final override
```

Forbidden:
- new final/ultimate/hotfix override block;
- presentation `!important`;
- fourth width mode;
- second menu controller;
- second panel state owner.

## 7. Likely target deltas to verify, not blindly copy

Current-main source indicates these existing values:

```text
desktop top shell total = 60 px
single side allocation  = 40 px
collapsed dock allocation = 40 px
double tool allocation  = 68 px
```

Reference requires:
- workspace origin 60 → 61;
- single side allocation can remain 40 total if it represents 39 px visible rail + 1 px divider;
- collapsed dock allocation can remain 40 total if it represents 39 px visible dock + 1 px divider;
- double tool allocation 68 → 73 total.

DEV must verify rendered geometry rather than assuming variable names equal visible widths.

## 8. Focused QA contract

Update obsolete Runtime assertions so they protect the new measured Photoshop contract.

At 1280 desktop, require:
- menu band + divider = 25 total with 24 px content;
- options band + divider = 36 total with 35 px content;
- stage/rail/dock top = 61 ±1;
- single rail/stage adjacency = PASS;
- right dock/stage adjacency = PASS;
- default stage side reservations remain internally consistent;
- dual rail total width = 73 ±1;
- dual stage begins immediately at dual rail right edge;
- switching single → dual → single restores geometry;
- panel resize behavior remains functional;
- Web/Portable parity remains PASS.

Do not weaken unrelated QA.

## 9. UI health gate

Required:

```text
NEW_PRESENTATION_IMPORTANT = 0
NEW_UNAUTHORIZED_WIDTH_THRESHOLD = 0
PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLERS = 1
DUPLICATE_LITERAL_DOM_IDS = 0
DUPLICATE_PRIMARY_HOME = 0
DEAD_VISIBLE_CONTROLS = 0
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
FINAL_OVERRIDE_LAYER_ADDED = 0
FIRST_PAINT_BLACK_FLASH = 0
FROZEN_CORE_MUTATION = 0
```

## 10. Visual evidence

Before UR PASS, produce:
- 1280 × 1024 Runtime screenshot;
- 960 × 800 Runtime screenshot;
- left single-toolbar crop;
- left double-toolbar crop;
- top 61 px crop;
- right collapsed-dock crop.

Overlay/difference against the normalized Photoshop reference begins with major shell edges, not panel-width absolutism.

## 11. Explicitly out of scope

- final File/Edit/View/Select/Object/Layer/Brush menu population;
- final command inventory;
- Navigator implementation;
- History Photoshop behavior pass;
- right panel semantic redesign;
- capability placement dependent on C3 closure;
- Core / Renderer / Document / History semantics / Revision semantics;
- Geometry / Recipe Core;
- CHAT execution authority;
- persistence;
- FORMAT_VERSION;
- product version.

## 12. DEV handoff

When source/static/focused QA is complete:

```text
DEV_HANDOFF
→ record exact branch HEAD
→ record changed files
→ record source/static QA
→ record UI health delta
→ STOP
→ UR REVIEW
```

No DEV promotion to main.
