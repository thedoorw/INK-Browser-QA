# INK UI-A Photoshop Shell / Panel — UR Review v1.0

Status: **UR_BOUNDED_REVISION_REQUIRED**

Date: 2026-09-28

Task: `INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`

DEV branch: `work/ink-ui-a-photoshop-shell-panels-001`

DEV handoff HEAD: `9c1d1ef4c020603296154000cccaea5c9c111dc6`

Exact implementation / focused-QA HEAD reviewed: `7ca7045b1de50173d33dee187a962b840419410a`

Upstream MR review: `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

Review role: UR — Photoshop alignment / UI interaction / visual structure only.

No Core change, no UI-B work, no `FORMAT_VERSION` change, no central Runtime, no PWA App Icon review.

---

## 1. UR scope and review basis

This review checked UI-A against:

- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
- `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
- `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`
- `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`

The review is bounded to the UI-A shell/panel architecture and the submitted source/static/local-interaction implementation. Full P1 command wiring remains UI-B. Fine fidelity explicitly owned by UI-C is not promoted into a UI-A blocker unless the underlying UI-A framework is absent.

---

## 2. Areas that are sufficiently aligned in UI-A

### A. Photoshop shell geometry — PASS at framework level

The implementation defines and uses the required primary geometry tokens:

- menu content `24 px` + divider
- options content `35 px` + divider
- base shell origin `61 px`
- document tab `28 px + 1 px`
- ruler `17 px`
- document status `16 px + 1 px`
- single Tools outer width `40 px`
- double Tools outer width `73 px`
- collapsed Dock outer width `40 px`
- expanded panel reference `252 px`
- panel header `28 px`

Relevant implementation:
- `product/source/styles.css:2115-2145`
- `product/source/styles.css:2290-2358`
- `product/source/styles.css:2927-3064`

Canvas geometry is derived from Tools / ruler / panel state and uses the measured active panel width for reflow rather than overlaying the canvas.

Empty-document CSS state removes document tab, ruler and document-status geometry and returns the workbench to the base 61 px shell.

### B. Application Menu — PASS for UI-A host/basic interaction

The top-level authority is:

`File / Edit / Image / Layer / Type / Select / Filter / Object / View / Window / Help`

with no top-level Brush.

The implementation includes:
- centralized menu registry;
- popup menus;
- separators;
- shortcut column alignment;
- disabled state;
- outside-click close;
- Escape close;
- Up / Down / Home / End menu navigation;
- Window-menu routing into the same panel registry.

Full command population remains UI-B. Final accessibility/focus polish remains UI-C.

### C. Left Tools shell — PASS at framework level

The desktop Tools rail is edge-attached and supports:
- single / double column shell widths;
- shared tool authority;
- compact icon cells;
- active / hover / focus grammar;
- flyout indicator / flyout host;
- no permanent desktop text rail.

Final flyout density / tooltip / interaction fidelity remains UI-C.

### D. Right Dock registry/state convergence — PASS except bounded findings below

The required panel inventory is present in one centralized registry:

Properties / Layers / History / Navigator / Pages / Color / Channels / Adjustments / Libraries / Reference / Compose / CHAT / Revision / Specialist.

Dock and Window menu are generated from the same `PANEL_GROUPS` / `PANEL_DEFS` authority, and the implementation enforces one primary active panel state.

Canvas reflow reads actual active-panel width.

### E. Navigator / History / Layers / Pages — PASS at UI-A functional-host level

The implementation routes these surfaces to existing authorities:

- Navigator → existing `page().camera`, renderer, fit and zoom APIs;
- History → existing History authority and Undo/Redo path;
- Layers → existing hierarchy, visibility, lock, opacity, add / duplicate / delete / reorder authority;
- Pages → existing add / duplicate / delete / switch / rename authority.

Precise Navigator proxy fidelity, Layers reorder visual state and final row density remain UI-C.

### F. Active document / empty workspace — PASS structurally

Active-document tab / ruler / status hosts exist.

When `data-document-active="false"`, tab/status/ruler bands are removed rather than leaving empty bands.

### H. INK brand — PASS

Visible INK mark remains sourced from:

`assets/INK_MARK_SOURCE_W-300.jpg`

Browser favicon remains:

`assets/favicon.svg`

No Adobe logo / proprietary Adobe branding was introduced.

PWA App Icon is not reviewed.

### I. Future extension — PASS for UI-A

Menu and panel registries are centralized enough for UI-B to add contribution boundaries without replacing shell authority.

Absence of a Plugin SDK is not a UI-A failure.

---

## 3. Bounded revision findings

### UR-A-01 — Expanded right-panel stacking / splitter framework is absent

**Reference evidence**

`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md` requires one panel authority covering:

- expanded panels;
- panel tab state;
- panel resizing;
- **vertical group stacking / splitters**;
- panel-local options;
- footer grammar.

`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md` assigns UI-A:
- right Dock / panel framework;
- panel grouping / resize / tabs / options / footer grammar;
- core panel normalization and state convergence.

Photoshop reference density gives approximately a 3 px panel splitter.

**Current mismatch**

At implementation HEAD:

- `PANEL_GROUPS` is used to group icons in the collapsed Dock and entries in the Window menu.
- expanded desktop presentation resolves to one full-height active Inspector **or** one full-height Creative Workspace panel.
- there is no expanded stacked-panel-group container or splitter host in `web-shell.js`, `shell.template.html`, or `styles.css`.
- no UI-A splitter selector / interaction authority exists.

Therefore Dock grouping exists, but the required Photoshop-like expanded panel-group / splitter skeleton does not yet exist.

**Required correction**

Add a bounded presentation-only expanded-panel grouping/splitter framework that:

1. keeps `PANEL_DEFS` / `PANEL_GROUPS` as the only panel registry;
2. does not create second panel state;
3. provides stacked panel group regions and a ~3 px splitter host/reference density;
4. preserves edge attachment and canvas reflow;
5. leaves final splitter interaction fidelity to UI-C;
6. does not alter Core semantics.

**Affected surface**

Right Dock / expanded panel shell.

**Blocker**

**YES** — this is UI-A shell architecture, not UI-C fine-detail polish.

---

### UR-A-02 — Light theme does not fully reach core panel interiors

**Reference evidence**

UI-A owns the Light theme token system and workstation shell normalization.

Required visual hierarchy:
- Photoshop Light / Lightest semantic workstation hierarchy;
- light-gray chrome;
- differentiated but light panel/body surfaces;
- quiet 1 px structural boundaries;
- no carry-over of dark-reference workstation styling as the active light shell.

**Current mismatch**

The UI-A light shell changes application chrome, headers, Dock and high-level panel surfaces, but older dark panel-interior rules remain active for key UI-A panels.

Examples still present at implementation HEAD:

- `.property-card` → dark `#3a3b3d` family;
- `.layer-row` → dark `#3b3c3e` family;
- `.layer-bottom-toolbar` → dark `#303133`;
- `.history-list` → dark `#303133`;
- `.history-step` → dark `#3b3c3e`.

Relevant source:
- `product/source/styles.css:780-850`
- `product/source/styles.css:1028-1122`
- light-shell override block around `product/source/styles.css:2388-2506`
- final UI-A shell block around `product/source/styles.css:2927-3064`

The later Light-theme rules override headers / labels / shell tokens but do not replace these core dark panel-body/list/footer surfaces.

This yields a mixed light-shell / dark-panel grammar rather than a coherent Photoshop Light workstation.

**Required correction**

Add bounded UI-A light-theme presentation overrides for the existing panel interiors:

- Properties / Specialist property rows/cards;
- Layers rows/body/footer;
- History list/rows/footer;
- existing Creative Workspace body controls as needed for one coherent Light hierarchy.

Use the existing semantic Light tokens where possible. Do not copy Photoshop dark RGB and do not redesign capability placement.

**Affected surface**

Expanded panel visual hierarchy / Light theme.

**Blocker**

**YES** — the visible workstation shell is not yet consistently in the required Light hierarchy.

---

### UR-A-03 — Creative panels do not expose the same direct resize surface as Inspector panels

**Reference evidence**

UI-A Workpack requires:
- expanded panel reference ≈ `252 px`, elastic rather than hard-locked;
- one panel authority including panel resizing;
- existing creative panels normalized under the same Photoshop-like Dock grammar.

**Current mismatch**

Inspector-based panels have:

- `#inspectorResizer` in `shell.template.html`;
- `bindInspectorResize()` routing width to the shared `--inspector-w` authority;
- default `252 px`, clamp `244–420 px`.

Creative panels (Reference / Compose / CHAT / Revision) are generated by `product/source/src/editor/creative-workspace.js` without an equivalent resize handle.

They inherit the same width variable and canvas reflow can measure them, but while a Creative panel is active there is no direct shell resize surface equivalent to the Inspector resizer.

**Required correction**

Provide one shared shell-owned active-panel resize edge, or an equivalent Creative-panel resizer, routed to the same `--inspector-w` / persisted width authority.

Preserve:
- default ≈ `252 px`;
- elastic range;
- one state authority;
- canvas reflow;
- no Core mutation.

Final splitter/cursor fidelity remains UI-C.

**Affected surface**

Reference / Compose / CHAT / Revision expanded panels; shared right-panel resize framework.

**Blocker**

**YES** — UI-A requires the resize framework to apply across its normal expanded panel inventory.

---

## 4. Explicit non-blockers / deferred fidelity

The following are not reasons to hold UI-A after the bounded revision above:

- full P1 menu command population → UI-B;
- complete P1 tool membership / wiring → UI-B;
- precise Navigator proxy-box movement / cursor fidelity → UI-C;
- Layers reorder ghost / insertion-indicator final fidelity → UI-C;
- exact History / Layers row-pitch convergence → UI-C;
- detailed splitter behavior / cursor glyph → UI-C;
- final accessibility/focus polish, including more complete top-level menu arrow behavior → UI-C;
- Plugin SDK → P2;
- PWA / install-to-desktop App Icon → out of scope.

---

## 5. UR decision

`UR_BOUNDED_REVISION_REQUIRED`

The main shell measurements, menu taxonomy, Tools framework, panel registry/state convergence, active-document geometry, brand routing and capability homes are sufficiently established.

However, UI-A is **not yet promotable** because three UI-A-level workstation framework issues remain:

1. no expanded stacked panel-group / splitter skeleton;
2. Light theme is incomplete inside core panel bodies;
3. Creative panels do not expose the shared direct resize interaction.

These are bounded shell/presentation corrections. They do not require Core changes, capability re-placement, UI-B implementation, `FORMAT_VERSION` change, central Runtime, or PWA work.

**Promotion A: HOLD**

**UI-B: HOLD**

After DEV completes only the three bounded UI-A corrections above, return to MR for technical re-review and then UR recheck.

**STOP → MR**
