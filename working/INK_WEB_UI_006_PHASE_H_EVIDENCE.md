# INK-WEB-UI-006 — Phase H Evidence

STATUS: `DEV_EVIDENCE_COMPLETE / UR_RUNTIME_REVIEW_REQUIRED`
TASK: `INK-WEB-UI-006 / PHASE_H`
BRANCH: `work/ink-web-ui-006-h`
BASELINE_PHASE_G_ACCEPTED_BRANCH_HEAD: `8322170ae746ca9af2325cb2783d604e3a9cea6c`
PHASE_H_STYLE_CHECKPOINT: `0957ecbd083a0910b2c96404c65c257de18bb797`
PHASE_H_PRODUCT_QA_CHECKPOINT: `04ba565c80551fe364174b3964a3ebaa850454a5`
FORMAT_VERSION: `4 / PRESERVED`
PRODUCT_VERSION: `v0.1 / PRESERVED`
PHASE_I: `NOT_STARTED`

## Scope implemented

Phase H remains presentation / responsive only.

Changed product surface:

- `product/source/styles.css`

Changed QA surface:

- `qa/runtime/ink-web-ui-001-harness.html`

No Phase H change was made to:

- `product/source/src/**`;
- `product/source/web-shell.js`;
- `product/source/shell.template.html`;
- generated entry HTML;
- Document / History / Revision / Geometry / Core / CHAT authority;
- Service Worker / bootstrap / cache / build identity.

## Before → after issue inventory

### Canvas / panel geometry

Before:

- accepted Phase E shell already measured the active primary panel width and drove `--active-panel-w`;
- accepted stage offsets already followed left toolbar + right Dock / primary panel;
- Phase H-specific regression proof did not cover every primary panel or an actual Inspector resize gesture.

After:

- stage presentation is explicitly contained as the dominant working region;
- the existing shell measurement/controller remains the only canvas/panel authority;
- QA now checks Properties, Layers, History, Reference, Compose, CHAT, Revision and Specialist against the same stage → panel → Dock boundary;
- QA now drives the existing Inspector resizer and requires canvas width to change by the same measured panel-width delta;
- collapse / last-active restore assertions from Phase E remain present.

### Status / viewport controls

Before:

- status content stayed on one compact row but all secondary state competed for width on narrow desktop.

After:

- viewport controls remain fixed/readable on the right;
- secondary status compresses progressively:
  - `<=1120px`: autosave text hidden;
  - `<=980px`: A4 status + selection-mode text also hidden;
  - `<=860px`: object-count text also hidden;
- rotation / Fit / zoom controls remain visible;
- zoom value keeps a stable numeric width;
- normal state remains on Phase G typography tokens.

### Narrow desktop

After:

- secondary identity compresses before primary controls;
- document title and contextual tool identity can contract without microtext;
- contextual controls remain one scrollable horizontal command surface rather than wrapping into canvas;
- right Dock / Inspector retain the accepted authority;
- QA requires a meaningful canvas region with Properties open at 960px and no status overflow.

### Mobile / compact

Preserved rather than redesigned:

- desktop Panel Dock remains suppressed;
- existing mobile dock remains the tool-selection alternative;
- Export remains the responsive File alternative;
- existing mobile Inspector remains the panel-access alternative;
- mobile Inspector overlays the canvas rather than permanently shrinking it;
- Phase G 10px mobile-dock label floor is asserted;
- shell-level horizontal overflow is asserted absent.

### Fullscreen

No Fullscreen API semantics changed.

Phase H adds presentation containment only:

- fullscreen app root consumes the browser-provided viewport;
- stage, primary panel and Dock remain geometrically bounded;
- existing `INK_APP.toggleFullscreen()` / `fullscreenchange` authority remains untouched.

The runtime harness verifies the fullscreen presentation class and retains the existing API-support / command-binding assertion. Actual trusted browser entry/exit remains an exact-SHA UR Runtime check; DEV does not claim it from a synthetic DOM call.

## Runtime harness additions

Added/extended assertions:

1. `UI-006 Phase H every primary right panel preserves one coherent canvas boundary`
2. `UI-006 Phase H Inspector resize updates canvas geometry through the existing shell authority`
3. `UI-006 Phase H fullscreen presentation keeps chrome, panel and canvas contained`
4. `UI-006 Phase H narrow desktop keeps a meaningful canvas with the primary panel open`
5. `UI-006 Phase H narrow desktop compresses secondary status before viewport controls`
6. `UI-006 Phase H compact mode keeps essential responsive alternatives reachable without desktop chrome leakage`
7. `UI-006 Phase H mobile Inspector overlays rather than permanently shrinking the compact canvas`

Previously accepted Phase E/F/G assertions remain in the same harness.

## DEV static verification

Exact fetched branch content was checked after the product/QA checkpoint.

```text
HARNESS_JAVASCRIPT_SYNTAX = PASS
CSS_BRACE_BALANCE = PASS / 1586 OPEN / 1586 CLOSE
PHASE_H_REQUIRED_ASSERTION_MARKERS = PASS
PHASE_E_ASSERTIONS_RETAINED = PASS
PHASE_F_ASSERTIONS_RETAINED = PASS
PHASE_G_ASSERTIONS_RETAINED = PASS
WEB_ENTRY_SHARED_STYLES_REF = PASS
PORTABLE_ENTRY_SHARED_STYLES_REF = PASS
WEB_ENTRY_SHARED_WEB_SHELL_REF = PASS
PORTABLE_ENTRY_SHARED_WEB_SHELL_REF = PASS
SHELL_TEMPLATE_CHANGED = NO
SHELL_GENERATOR_CHECK = NOT_APPLICABLE
PROHIBITED_PRODUCT_SOURCE_CHANGE = 0
PHASE_I_EXECUTION = 0
```

Branch delta at the product/QA checkpoint relative to the accepted Phase G head contained only:

- `product/source/styles.css`
- `qa/runtime/ink-web-ui-001-harness.html`
- Phase H / Phase I prep documents already present on the UI branch.

No `product/source/src/**` file appears in the Phase H implementation delta.

## Runtime state

```text
DEV_SOURCE_STATIC_QA = PASS
WINDOWS_SELF_HOSTED_PHASE_H_RUNTIME = UR_EXACT_SHA_REQUIRED / NOT_CLAIMED_BY_DEV
UI_VISUAL_COMPARISON = UR_REQUIRED
PHASE_I_FINAL_GATE = NOT_STARTED / LOCKED
```

This handoff does not certify visual perfection from DOM checks.

UR should perform the exact-SHA Windows browser run and visual comparison before Phase H acceptance.

## Authority preservation

```text
DOCUMENT = UNCHANGED
ARTWORK_TEXT_SEMANTICS = UNCHANGED
HISTORY = UNCHANGED
REVISION = UNCHANGED
RENDERER = UNCHANGED
GEOMETRY_CORE = UNCHANGED
RECIPE_CORE = UNCHANGED
CHAT_SEMANTICS = UNCHANGED
APPROVAL_EXECUTION_AUTHORITY = UNCHANGED
SERVICE_WORKER = UNCHANGED
RUNTIME_BOOTSTRAP = UNCHANGED
CACHE_BUILD_IDENTITY = UNCHANGED
PRODUCT_VERSION = v0.1 / PRESERVED
FORMAT_VERSION = 4 / PRESERVED
PHASE_I = NOT_STARTED
```

## DEV state

`DEV_HANDOFF → UR_REVIEW → STOP`
