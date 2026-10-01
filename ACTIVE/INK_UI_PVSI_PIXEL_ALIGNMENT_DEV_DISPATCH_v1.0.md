# INK UI — PvsI Pixel Alignment DEV Dispatch v1.0

STATUS: SUPERSEDED / DO_NOT_EXECUTE / HISTORICAL
DATE: 2026-09-30
TASK: INK-UI-PVSI-PIXEL-ALIGNMENT-001
OWNER: INK DIRECT UI MR / DEV EXECUTOR

## Supersession — 2026-10-01

USER deleted `PvsI-1 / PvsI-2 / PvsI-3` because the INK interface had changed. This dispatch no longer has valid comparison assets and must not authorize product mutation. Use `ACTIVE/INK_CURRENT_WORK_ORDER.md`, the Photoshop original references, and a fresh current-INK capture for any new comparison.

## Current clarification — 2026-10-01

Master Guide exact-fidelity clarification supersedes former 1 CSS px acceptance wording. Current recheck/repair queue: `working/INK_UI_CURRENT_STATE_RECHECK_AND_REPAIR_QUEUE_20261001.md`. Preserve existing authorized scope; queue UIR-01–05 as bounded corrections, UIR-02 after USER resolves action semantics. No Actions or new Runtime gate authorized.

## 1. Historical mission

Use the three USER-selected PvsI comparison images as the direct visual measurement authority and revise current INK so that shared Photoshop/INK UI geometry, structure and density align at pixel level.

This is not a general visual cleanup and not a source-led task.

Authoritative comparison assets:

- `reference/ui/photoshop/PvsI-1.png`
- `reference/ui/photoshop/PvsI-2.png`
- `reference/ui/photoshop/PvsI-3.png`

Upstream authority:

- `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
- original Photoshop reference assets named there.

USER exceptions remain:

- INK keeps the USER-locked light palette;
- Photoshop capabilities absent from INK are not invented;
- explicit USER overrides win.

## 2. Meaning of pixel alignment

`PIXEL_ALIGNMENT` means shared UI geometry is measured and matched numerically after reference/current-view normalization.

It does NOT mean raw RGB-image identity because:

- INK intentionally uses a different light palette;
- Photoshop and browser text anti-aliasing can differ;
- capability/content differences can change labels or controls;
- OS/browser scaling can differ.

The target is therefore:

```text
shared structure / position / dimensions / spacing / density / alignment
= target delta 0 in matched reference environment/state
= no automatic 1 CSS px waiver; record measurement uncertainty separately
```

Every observed residual requires explicit disposition; measurement uncertainty is an evidence condition, not an exception.

## 3. Mandatory preparation

Before editing:

1. inspect the three exact GitHub PvsI assets;
2. inspect current deployed/current-main INK;
3. record current main SHA;
4. record current viewport dimensions;
5. record browser zoom and OS/device scaling if observable;
6. identify the exact UI state represented in each PvsI image;
7. normalize scale before comparing coordinates.

Do not compare raw screenshot pixels across different scaling factors without normalization.

## 4. Measurement-first workflow

### A. Establish reference anchors

For each PvsI image identify stable anchors such as:

- viewport left/top;
- application menu bottom edge;
- Options Bar bottom edge;
- left Tools right edge;
- workspace/canvas edges;
- right panel left edge;
- panel group header edges;
- splitters;
- bottom status top edge.

Use these anchors to determine the reference scale and coordinate system.

### B. Capture current INK at matching state

Match the reference state as closely as possible:

- same viewport class;
- same Tools state;
- same right-panel expanded/collapsed state;
- same panel/tab state;
- same rulers/dialog/menu state when applicable.

### C. Build a numeric delta table

For every shared visible region/control record:

```text
element
reference x
reference y
reference width
reference height
current x
current y
current width
current height
delta x
delta y
delta width
delta height
disposition
```

Also record where relevant:

- row count;
- row pitch;
- padding;
- gap;
- icon box;
- visible icon envelope;
- font size;
- line height;
- splitter size;
- scrollbar width;
- panel footer height.

### D. Overlay/difference inspection

Create an overlay or equivalent image-difference comparison after normalization.

Use it to locate:

- edge drift;
- cumulative spacing error;
- baseline drift;
- inconsistent repeated rows;
- panel proportion mismatch;
- uncentered icons/controls;
- scrollbars or borders that diverge from the reference grammar.

Do not use overlay/diff as a substitute for semantic inspection; use it as numeric evidence.

## 5. Required pixel-level scope

### 5.1 Top shell

Measure and align:

- menu bar height;
- Options Bar height;
- menu label baselines;
- menu-item horizontal padding;
- application mark dimensions;
- separators;
- contextual-control row height;
- icon/control vertical centering;
- spacing between label / control / divider.

All application popup menus must use one same-class geometry and surface grammar. The Window menu must not remain a dark outlier among light menus.

### 5.2 Left Tools

Measure and align:

- total dual-column width;
- column widths;
- button width/height;
- row pitch;
- horizontal/vertical gaps;
- icon boxes;
- visible icon envelopes;
- flyout indicators;
- collapse strip/arrow;
- total occupied vertical density.

Do not stop at matching the 73 px outer width. Reconcile the visible tool representatives/flyouts with existing INK capabilities so the rail density and grouping match Photoshop grammar where capability exists.

### 5.3 Foreground/background color system

Measure:

- foreground/background swatch size;
- overlap offset;
- swap/reset positions;
- total color-control block bounds;
- relation to surrounding tool rows.

Replace text-glyph stand-ins when they prevent consistent icon geometry.

### 5.4 Workspace / rulers / status

Measure:

- workspace left/right/top/bottom boundaries;
- ruler thickness;
- ruler corner;
- status height;
- status-control spacing;
- right-panel/canvas reflow boundaries.

### 5.5 Right panel stack

Measure:

- expanded width;
- collapsed dock width;
- tab/header height;
- group A/B/C heights;
- splitter position and thickness;
- body padding;
- footer height;
- panel-local menu button box;
- collapse strip/arrow;
- scrollbar width.

Do not accept matching total panel width if internal group proportions/density differ.

### 5.6 Navigator

Measure:

- preview bounds;
- preview/body ratio;
- scrollbar geometry;
- footer height;
- zoom control order and spacing;
- numeric/slider baselines.

Reconcile the current Navigator footer against Photoshop rather than assuming `fit / minus / slider / 100% / plus` is equivalent.

### 5.7 Reference / creative panel

Measure and normalize all form-like controls against workstation control rhythm:

- label column;
- input/select height;
- button height;
- row pitch;
- horizontal gaps;
- body padding;
- section gaps.

Do not leave a generic Web-form density inside a Photoshop-like panel shell.

### 5.8 Layers

Measure both structure and control density:

- filter/type row;
- blend row;
- opacity position;
- lock/fill rows where capability exists;
- layer row height;
- visibility column;
- thumbnail bounds;
- name/state baseline;
- bottom action bar;
- panel padding;
- scrollbar.

Where INK has corresponding capability, move it to the Photoshop-like primary home rather than treating current placement as fixed.

### 5.9 Same-class elements

Pixel alignment must include same-class consistency across:

- every application popup;
- every panel tab;
- every scrollbar;
- every tool button;
- every icon-button box;
- every input/select;
- every panel footer;
- every close/options glyph.

A single outlier remains a defect.

## 6. Tolerance

Unless a USER/theme/capability exception applies:

```text
major shared structural edges      target 0 px / no automatic residual waiver
repeated control dimensions        target 0 px / no automatic residual waiver
row pitch / padding / gap          target 0 px / no automatic residual waiver
icon box / optical centering       no automatic residual waiver
splitter / divider thickness       exact where integer geometry permits
panel group proportions            target 0 px at matched reference viewport
```

Typography rasterization itself is not judged by raw-pixel identity, but font size, weight role, line-height and baseline geometry must be measured.

## 7. Capability preservation

Preserve:

```text
64 capability families
496 product atomics
5 headless/platform atomics
501 normalized atomics
22 CHAT named tools
34 CHAT bounded edit operations
FORMAT_VERSION = 4
```

Do not delete or replace Core authority to achieve visual matching.

## 8. Execution policy

- edit current `main` directly;
- bounded reversible commit(s);
- no UR/DEV split;
- no MR pre-approval;
- no central Runtime as iteration gate;
- preserve generated Web/Portable runtime entrypoints;
- no unresolved template tokens;
- do not bundle unrelated cleanup.

## 9. Required evidence before returning

Create/update a bounded evidence file:

`working/INK_UI_PVSI_PIXEL_ALIGNMENT_EVIDENCE_v1.0.md`

It must include:

- exact target commit;
- reference asset paths;
- comparison viewport/scaling;
- before/after delta table;
- remaining deltas;
- explicit disposition for every remaining delta.

Where practical also preserve normalized comparison/overlay screenshots as evidence assets.

## 10. Required return to USER

Return only:

- commit SHA;
- changed files;
- measured regions corrected;
- largest remaining numeric deltas;
- remaining reference differences and dispositions;
- exact UI states/regions for USER refresh inspection.

Do not declare UI complete.

## 11. Acceptance

```text
reference image
+ normalized measurement
+ current rendered INK
+ pixel/geometry delta evidence
+ USER inspection
= acceptance
```

Source structure, Runtime PASS, route counts and old checklist PASS are not substitutes.