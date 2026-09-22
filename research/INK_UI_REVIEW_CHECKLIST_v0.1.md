# INK UI REVIEW CHECKLIST v0.1

Role: UR / UI Review  
Purpose: fixed acceptance checklist for all future INK UI maintenance and promotion.

## Principle

Photoshop is a mature desktop graphics-editor geometry benchmark, not a skin to copy.

Use it to validate:
- shell geometry;
- density;
- edge attachment;
- alignment rhythm;
- canvas dominance;
- dock/panel grammar.

Do not copy:
- Adobe branding;
- Photoshop icons;
- Photoshop feature inventory;
- Photoshop color identity;
- legacy interaction complexity that INK does not need.

INK-specific surfaces remain authoritative:
- Creative Loop;
- Reference;
- Compose;
- CHAT;
- Revision;
- dual Creation / Layout workspace;
- INK accent and product identity.

---

## A. Desktop shell geometry — HARD GATE

Reference viewport: 1280 CSS px wide at browser zoom 100%.

Target reference:
- menu: 24 ±1 px;
- shared options row: 36 ±1 px;
- workspace origin: y = 60–61 ±1 px;
- left rail: x = 0, width 40 ±1 px;
- right dock: right = viewport edge, width 40 ±1 px;
- default primary panel: 252 ±8 px;
- document title visual width: 220–240 px.

Checks:
- no extra permanent third toolbar row;
- no accidental outer gap around rails/docks;
- stage begins immediately after left rail;
- stage ends immediately before right dock or active panel;
- 1 px shell separators resolve on integer pixel boundaries.

Gate:
`UI_SHELL_GEOMETRY = PASS`

---

## B. Shell attachment / chrome ownership — HARD GATE

Left tool rail:
- attached to application shell, never floating;
- final computed left = 0;
- no desktop border radius/card shadow;
- later CSS must not reintroduce 6/7/8/10 px offsets.

Right dock:
- attached to right edge;
- one primary panel at a time;
- dock and panel feel like one shell system, not detached cards.

Gate:
`UI_EDGE_ATTACHMENT = PASS`

---

## C. Top options composition — HARD GATE

Do not accept geometry-only PASS.

At 1280 and 960 desktop widths verify:
- document title does not dominate;
- contextual controls are readable without appearing crushed;
- workspace switch is visually secondary to tool options;
- New / Open / Save / Export remain reachable;
- Undo / Redo does not create an isolated visual island;
- control groups align to one vertical baseline;
- no large dead gaps;
- no horizontal overlap;
- no hidden command caused by overflow;
- the second row reads as one coherent Photoshop-like options bar, not multiple unrelated toolbars forced into one row.

Gate:
`TOP_OPTIONS_COMPOSITION = PASS`

---

## D. Density / rhythm / baseline — HARD GATE

Inspect visually, not only via CSS values.

Verify:
- icon frames have consistent optical size;
- button pitch is consistent;
- text baseline aligns across adjacent controls;
- slider, input, button and label vertical centers agree;
- separators have consistent rhythm;
- spacing hierarchy clearly distinguishes groups;
- no control appears 1–2 px vertically adrift;
- menu text and shell controls are readable at 100% browser zoom.

Gate:
`PIXEL_RHYTHM = PASS`

---

## E. Workspace / page relationship — HARD GATE

Creation and Layout must be reviewed separately.

### Creation
Verify the infinite creation surface is intentional and visually clear.
It must not accidentally look like an A4 page or an unbounded blank browser page.

### Layout
Must show:
- dark workbench/pasteboard;
- actual renderer-owned white A4 page;
- clear page edge;
- adequate surrounding workbench;
- paper shadow/boundary visible but restrained.

Do not fake a page with an unrelated DOM rectangle.

If requested visual behavior requires Renderer modification:
`INTEGRATION_REQUIRED → STOP → MR`

Gate:
`WORKSPACE_PAGE_RELATIONSHIP = PASS`

---

## F. Canvas dominance — HARD GATE

Verify:
- chrome does not consume unnecessary vertical space;
- panels do not open wider than necessary;
- collapsed state maximizes canvas;
- stage resizing when primary panel opens/closes is exact;
- no overlay unintentionally covers drawing area.

Gate:
`CANVAS_DOMINANCE = PASS`

---

## G. Right panel hierarchy — HARD GATE

Verify:
- Editor group: Properties / Layers / History;
- Creative Loop group: Reference / Compose / CHAT / Revision;
- group separation is visible but quiet;
- selected/active state is immediately legible;
- primary panel width is stable;
- panel header/tab/body follow one spacing grammar;
- CHAT transcript/prompt has sufficient visual priority;
- panel labels/icons remain understandable without requiring memorization.

Gate:
`RIGHT_PANEL_HIERARCHY = PASS`

---

## H. Left tool hierarchy — HARD GATE

Verify:
- rail is one compact column;
- active tool is unmistakable;
- subtool indicator is legible;
- icon size is consistent;
- hit target remains practical;
- separators correspond to semantic grouping;
- tool order does not create unexplained gaps.

Gate:
`LEFT_TOOL_HIERARCHY = PASS`

---

## I. Brand asset clarity — NORMAL GATE

Verify:
- favicon path resolves;
- favicon is not broken;
- favicon has suitable 16/32/48 assets or multi-resolution ICO;
- main INK mark uses SVG or adequate DPR-aware raster;
- no browser scaling blur;
- no fractional CSS sizing for critical small marks.

The source mark may be simplified for favicon use.
Decorative diamond grid is not required.

Gate:
`BRAND_ASSET_CLARITY = PASS`

---

## J. CSS authority / override hygiene — HARD GATE

Search the full stylesheet.

Verify:
- one final desktop authority for shell geometry;
- obsolete earlier rules may exist only if unambiguously overridden and regression-tested;
- no late rule silently defeats accepted shell geometry;
- no duplicate contradictory desktop values without explicit media-scope reason;
- future maintenance should consolidate rather than endlessly append overrides.

Gate:
`CSS_AUTHORITY_CLEAN = PASS`

---

## K. Web / Portable parity — HARD GATE

Default requirement:
`Web = Portable parity required`

Verify:
- index.html and index-standalone.html remain structurally equivalent except delivery identity;
- shared styles and shell coordinator are common;
- same geometry, panel hierarchy and controls;
- differences are explicitly delivery-specific.

Any intentional divergence must be documented.

Gate:
`PORTABLE_WEB_PARITY = PASS`

---

## L. Responsive / fullscreen — HARD GATE

Verify:
- 1280 desktop;
- 960 narrow desktop;
- <=760 mobile;
- coarse pointer where applicable;
- fullscreen enter/exit;
- no offscreen primary controls;
- no panel/canvas overlap;
- safe-area containment on mobile.

Gate:
`RESPONSIVE_FULLSCREEN = PASS`

---

## M. Runtime visual evidence — HARD GATE

For meaningful shell changes, static tests alone are insufficient.

Runtime must capture:
- getBoundingClientRect() geometry;
- browser zoom 100%;
- exact tested SHA;
- browser/viewport/DPR;
- screenshot or equivalent pixel evidence for workspace/page relationship;
- panel open/close;
- contextual tool routes;
- narrow desktop;
- fullscreen where changed.

A green workflow without exact tested SHA evidence is not enough.

Gate:
`RUNTIME_VISUAL_QA = PASS`

---

## N. GitHub Pages smoke check — HARD GATE AFTER MAIN

After promotion:
- Pages deployment must succeed;
- live Pages must load current main;
- no stale asset path;
- favicon resolves;
- first-load shell visually matches reviewed runtime;
- Web delivery identity remains correct.

Gate:
`PAGES_SMOKE = PASS`

---

## O. Review decision

UR may issue `UI_PASS` only when all applicable HARD GATE items pass.

Allowed outcomes:
- `UI_PASS`
- `UI_REVISE`
- `UI_HOLD`
- `INTEGRATION_REQUIRED → MR`

No UI promotion should rely on “looks close enough” when the mismatch is measurable.
No numeric geometry PASS should substitute for visual composition review.
