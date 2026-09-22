# INK CURRENT WORK ORDER

STATUS: INK-UI-MAINT-002 / UR_AUTHORIZED / DEV_READY

TASK_ID: INK-UI-MAINT-002
TITLE: Typography Readability / Panel Authority / Content Containment / Favicon v0.1
BRANCH: work/ink-ui-maint-002
BASE_MAIN: 19ce5f7d03a32600493a550ae2d2262340c229ee
AUTHORITY: USER_DIRECT_UI_MAINTENANCE / UR
RUNTIME_QA: REQUIRED_BEFORE_UI_PASS
FORMAT_VERSION: 4 / PRESERVE
PRODUCT_BASE_VERSION: v0.1 / PRESERVE
PACKAGE_MUTATION: 0 / PROHIBITED
CORE_MUTATION: 0 / PROHIBITED

## Objective

Resolve the user-visible UI defects discovered after INK-UI-MAINT-001 without changing Renderer, Document, History, Revision, Geometry, Core, CHAT execution semantics, persistence, packaging or product version.

Photoshop remains a geometry / typography / density benchmark only. Do not copy Adobe branding or feature inventory.

Web and Portable must remain synchronized.

## Required scope

### A. Typography readability — HARD GATE

Current problem:
- multiple desktop chrome/panel labels are only 8–10 px;
- secondary gray text is too dim against dark chrome;
- hierarchy is visually weaker than the Photoshop reference at 100% zoom.

Required:
- review current desktop typography at 1280×1024 and 100% browser zoom;
- increase small chrome/panel text where needed;
- increase luminance/contrast of secondary text where needed;
- preserve hierarchy: title > label > secondary/meta;
- avoid global font-size inflation that causes overflow;
- verify menu, top options, Inspector, tabs, control labels, panel labels, status text and Creative Loop surfaces;
- maintain INK visual identity.

Gate:
TYPOGRAPHY_READABILITY = PASS

### B. Contextual “進階” button is a real synchronized toggle — HARD GATE

Current bug:
`openContextualAdvanced()` always forces Inspector open.
It is not a true toggle and does not expose active state.

Required:
- second press must close the corresponding primary panel when that contextual Properties state is already open;
- use one authoritative panel state, not a fake local state;
- synchronize `aria-pressed`, `aria-expanded` if applicable, active class, visual color/state;
- when another panel is active, pressing “進階” routes to current tool/object Properties;
- closing the primary panel clears active state;
- selection/object context must continue to route correctly.

Gate:
CONTEXTUAL_ADVANCED_TOGGLE_STATE = PASS

### C. Right primary panel content containment — P0 HARD GATE

This is the highest-priority defect.

Observed user failure:
- right Inspector content is vertically compressed;
- content becomes difficult or impossible to inspect;
- horizontal overflow/scrolling is visible;
- current desktop panel only has width-resize authority;
- content containment is unreliable.

Required baseline behavior:
- panel shell occupies the available desktop vertical range;
- panel header and tabs remain stable;
- active content body consumes the remaining height using flex/min-height:0;
- body scrolls vertically when content exceeds available height;
- no unintended horizontal scrollbar;
- child cards/controls must not force panel width;
- long content remains reachable;
- 1280×1024, 1280×800, 960×800 and short desktop height must be tested;
- inspector, Layers, History, object, AI/Studio if reachable, and Creative Loop primary surfaces must not clip controls.

Height resize:
- may be implemented if it improves the model, but is NOT a substitute for correct containment;
- if added, it must be bounded and cannot break full-height default behavior.

Gate:
RIGHT_PANEL_CONTENT_CONTAINMENT = PASS
HORIZONTAL_PANEL_OVERFLOW = 0

### D. Single primary panel authority / remove duplicate entry controls — HARD GATE

Current problem:
three controls participate in opening essentially the same primary Inspector system:
1. legacy top-right Inspector toggle;
2. contextual “進階”;
3. right Dock Properties.

Required authority model:
- right Dock = primary content selection authority;
- one light-weight chevron/collapse control = whole primary panel open/close;
- Dock Properties selects Properties content;
- Layers / History / Reference / Compose / CHAT / Revision select their respective primary content;
- remove or retire the redundant top-right legacy Inspector toggle from the desktop shell;
- “進階” becomes a contextual route into the same primary panel authority, not a third independent toggle;
- active states must synchronize across Dock, contextual button and collapse state;
- no duplicate command authority or simulated clicks.

Target:
PRIMARY_PANEL_AUTHORITY = SINGLE
PANEL_COLLAPSE_CONTROL = CHEVRON
DUPLICATE_PANEL_TOGGLES = 0
DOCK_ICONS = CONTENT_SELECTION
ADVANCED_BUTTON = CONTEXTUAL_PROPERTIES_ROUTE

Gate:
PRIMARY_PANEL_AUTHORITY_CONSOLIDATED = PASS

### E. Favicon / brand asset clarity — REQUIRED

Current user-visible defect:
favicon is broken / poorly rendered.

Required:
- favicon must resolve on GitHub Pages and Portable delivery;
- use a simple, robust asset;
- acceptable fallback: solid light-blue square;
- preferred minimal mark: light-blue background + clean white Y;
- decorative diamond grid is optional and should be omitted if it reduces clarity;
- provide suitable small-size asset path(s), avoiding fractional blur;
- do not depend on remote assets;
- verify tab icon loads without 404 and is legible at browser tab size.

Gate:
BRAND_ASSET_CLARITY = PASS
BROKEN_FAVICON = 0

## UI review checklist

Use:
`research/INK_UI_REVIEW_CHECKLIST_v0.1.md`

This task must explicitly check:
- TYPOGRAPHY_READABILITY
- TOP_OPTIONS_COMPOSITION
- PIXEL_RHYTHM
- RIGHT_PANEL_CONTENT_CONTAINMENT
- PRIMARY_PANEL_AUTHORITY
- BRAND_ASSET_CLARITY
- CSS_AUTHORITY_CLEAN
- PORTABLE_WEB_PARITY
- RESPONSIVE_FULLSCREEN
- RUNTIME_VISUAL_QA

## CSS authority cleanup

While implementing this bounded fix:
- remove or consolidate obsolete rules only where needed to prevent the same regression;
- do not perform a broad theme rewrite;
- final desktop authority must be clear;
- no later rule may silently reintroduce old panel/topbar behavior.

Gate:
CSS_AUTHORITY_CLEAN = PASS_WITH_BOUNDED_SCOPE

## Web / Portable parity

Default rule:
Web = Portable parity required.

Any HTML structure change must be mirrored in:
- product/source/index.html
- product/source/index-standalone.html

Shared CSS / shell behavior must remain shared.

Gate:
PORTABLE_WEB_PARITY = PASS

## Runtime acceptance

Runtime is mandatory because these are user-reported visual/interaction defects.

At minimum verify in real browser:
- 1280×1024 at 100% zoom;
- 1280×800;
- 960×800;
- one short-height desktop case;
- Web shell;
- Portable parity through static/runtime guards.

Runtime must prove:
- text is readable and no new overflow is introduced;
- “進階” toggles and visual state synchronizes;
- Dock Properties routes to the same Inspector authority;
- redundant top-right Inspector toggle is gone/retired on desktop;
- chevron collapses/expands the active primary panel;
- all primary panel bodies vertically scroll correctly;
- no unintended horizontal panel scrollbar;
- content remains reachable at short heights;
- favicon request succeeds;
- Layout/Creation workspace behavior is not regressed;
- fullscreen and narrow desktop remain contained.

If Runtime cannot execute:
TASK_STATUS = RUNTIME_BLOCKED
STOP

## Hard boundaries

DO NOT change:
- Renderer / WebGL / Canvas engine;
- Document authority, schema or migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry;
- Core contracts;
- CHAT proposal/approval/execution semantics;
- persistence semantics;
- package/certification;
- product base version.

If any required visual result needs one of those:
INTEGRATION_REQUIRED → STOP → MR

## Expected changed files

Likely bounded UI payload:
- product/source/styles.css
- product/source/web-shell.js
- product/source/index.html
- product/source/index-standalone.html
- local favicon asset(s) / favicon link markup
- focused UI QA/runtime harness
- evidence report

Avoid unrelated changes.

## Evidence report

Create exactly:
`research/INK_UI_MAINT_002_READABILITY_PANEL_FAVICON_REPORT_v0.1.md`

Must include:
- before/after typography values;
- panel containment model;
- panel authority state diagram;
- exact list of removed/replaced duplicate entry controls;
- favicon asset/path verification;
- Web/Portable parity evidence;
- Runtime viewport cases and results;
- changed-file inventory;
- explicit boundary statement.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-UI-MAINT-002
BRANCH = work/ink-ui-maint-002
FINAL_HEAD = <exact SHA>
TYPOGRAPHY_READABILITY = PASS
CONTEXTUAL_ADVANCED_TOGGLE_STATE = PASS
RIGHT_PANEL_CONTENT_CONTAINMENT = PASS
PRIMARY_PANEL_AUTHORITY_CONSOLIDATED = PASS
BRAND_ASSET_CLARITY = PASS
CSS_AUTHORITY_CLEAN = PASS_WITH_BOUNDED_SCOPE
RUNTIME_QA = PASS
PORTABLE_WEB_PARITY = PASS
FORMAT_VERSION = 4
PRODUCT_BASE_VERSION = v0.1
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
