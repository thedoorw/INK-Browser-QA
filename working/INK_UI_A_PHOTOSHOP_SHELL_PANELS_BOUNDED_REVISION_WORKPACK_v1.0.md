# INK UI-A Photoshop Shell & Panels — Bounded Revision Workpack v1.0

STATUS: `MR_AUTHORIZED / DEV_BOUNDED_REVISION_REQUIRED`

DATE: 2026-09-28

TASK:
`INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`

REVISION:
`UI-A-R1`

MANDATORY_BRANCH:
`work/ink-ui-a-photoshop-shell-panels-001`

DEV_HANDOFF_HEAD_REVIEWED:
`9c1d1ef4c020603296154000cccaea5c9c111dc6`

EXACT_IMPLEMENTATION_HEAD_REVIEWED:
`7ca7045b1de50173d33dee187a962b840419410a`

UR_REVIEW:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_UR_REVIEW_v1.0.md`

UPSTREAM_MR_REVIEW:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

## 1. MR disposition

MR independently confirmed all three UR findings.

```text
UR-A-01 EXPANDED STACKED PANEL / SPLITTER FRAMEWORK = CONFIRMED
UR-A-02 LIGHT THEME PANEL INTERIORS = CONFIRMED
UR-A-03 CREATIVE PANEL DIRECT RESIZE SURFACE = CONFIRMED

UI_A_PROMOTION = HOLD
UI_B = HOLD
CENTRAL_RUNTIME = PROHIBITED
REVISION_SCOPE = UI-A PRESENTATION / SHELL ONLY
```

No previously accepted UI-A decision is reopened.

## 2. Revision scope — UR-A-01

Add a bounded expanded-panel stacking / splitter framework.

Required:
- retain `PANEL_DEFS` / `PANEL_GROUPS` as the single registry;
- provide expanded stacked-panel group regions;
- provide a splitter host using Photoshop reference density of approximately 3 px;
- preserve right-edge attachment;
- preserve canvas reflow;
- preserve one panel-state authority;
- no duplicate Inspector / Creative Workspace state machine;
- final detailed splitter drag/cursor fidelity remains UI-C.

Package-A acceptance only requires the structural grouping/splitter framework and a safe bounded interaction if implemented.

## 3. Revision scope — UR-A-02

Complete the Light hierarchy inside existing UI-A panel interiors.

At minimum reconcile:
- Properties / Specialist property cards and rows;
- Layers list/rows/footer;
- History list/rows/footer;
- Creative Workspace body controls needed for coherent normal Light presentation.

Use existing semantic Light tokens wherever possible.

Do not:
- copy Photoshop dark-reference RGB;
- create a second theme system;
- alter capability placement;
- perform UI-C pixel-polish beyond what is necessary to eliminate the mixed light/dark workstation.

## 4. Revision scope — UR-A-03

Make the direct right-panel resize interaction apply to normal Creative panels as well as Inspector panels.

Preferred architecture:
- one shell-owned active-panel resize edge;
- same `--inspector-w` / persisted panel-width authority;
- same default Photoshop reference width (~252 px);
- same bounded elastic width behavior;
- same canvas reflow path.

An equivalent Creative-panel resizer is acceptable only if it routes to exactly the same width/state authority.

Do not introduce a second width authority.

## 5. Allowed files

Prefer changes only in:
- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`
- `ACTIVE/INK_DEV_PROGRESS.md`

If `product/source/src/editor/creative-workspace.js` appears necessary, STOP → MR before modifying it. The preferred fix is shell-owned.

No other product source file is authorized.

## 6. Explicitly preserved PASS items

Do not redesign:
- 61 px top shell;
- menu taxonomy;
- document tab/ruler/status geometry;
- single/double Tools framework;
- panel inventory;
- Navigator/History/Layers/Pages authority routing;
- Color/Channels/Adjustments placement homes;
- Window/Dock convergence;
- duplicate desktop File/Undo/Redo retirement;
- approved INK visible Logo route;
- approved browser Favicon route;
- current extension-ready centralized menu/panel registries.

## 7. Brand / extensibility constraints

Brand:
- visible Logo remains `assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`;
- browser favicon remains `assets/favicon.svg?v=0.1`;
- no Adobe branding/assets;
- PWA installed-app icon redesign remains out of scope.

Extensibility:
- preserve centralized menu/panel registry structure;
- do not hard-code this revision in a way that blocks future registered contributions;
- do not implement a Plugin SDK;
- full Plugin ecosystem remains P2.

## 8. Focused QA required

Extend UI-A focused QA to prove:

### UR-A-01
- stacked expanded-panel group/splitter host exists;
- splitter structure derives from the existing panel registry;
- no second panel-state registry/authority;
- canvas/right-edge geometry remains valid.

### UR-A-02
- targeted panel interiors resolve to Light semantic surfaces;
- old dark literal rules do not remain visually authoritative for normal desktop Light state;
- no second theme authority.

### UR-A-03
- Inspector and Creative panel states expose direct width adjustment through one shared width authority;
- panel width remains elastic;
- canvas reflow remains coupled to actual active panel width.

Regression:
- exact 11-menu order retained;
- 14 panel homes retained;
- Web/Portable generated shell parity retained;
- Logo and Favicon routes retained;
- no Core / FORMAT_VERSION / P2 mutation.

## 9. Runtime rule

```text
CENTRAL_RUNTIME = NO
LOCAL_BROWSER_SMOKE = ALLOWED
FOCUSED_STATIC_QA = REQUIRED
```

The USER-locked program rule remains:
only one final central Runtime after UI-A + UI-B + UI-C are all promoted.

## 10. DEV handoff

DEV must provide:
- new exact revision HEAD;
- changed-file list;
- focused QA result;
- UR-A-01 closure evidence;
- UR-A-02 closure evidence;
- UR-A-03 closure evidence;
- confirmation Core semantics = unchanged;
- confirmation Logo/Favicon routes = preserved;
- confirmation central Runtime = not run.

Then STOP to MR.

MR technical re-review is followed by UR bounded recheck.

No automatic UI-B start.
