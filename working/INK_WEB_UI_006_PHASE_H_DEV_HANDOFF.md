# INK-WEB-UI-006 — Phase H DEV HANDOFF

STATUS: DEV_HANDOFF / UI_ONLY / PHASE_H / UR_REVIEW_REQUIRED / STOP
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-h`
BASELINE_PHASE_G_ACCEPTED_BRANCH_HEAD: `8322170ae746ca9af2325cb2783d604e3a9cea6c`
BASELINE_PHASE_G_TESTED_PRODUCT_SHA: `718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b`
PHASE_G_RUNTIME: `35949410959 / PASS`

## Goal

Implement only:

**Phase H — Canvas / Status / Responsive**

Do not start Phase I final Runtime gate.

Phase H is the last implementation phase before final certification. It should stabilize the working canvas area, status surfaces, fullscreen behavior, and responsive transitions without changing document semantics, renderer authority, or previously accepted panel / typography systems.

---

## H1 — Canvas workspace

Review the accepted creation/layout workspace behavior and normalize only UI geometry/presentation.

Required outcomes:
- default creation workspace remains visually dominant and uncluttered;
- canvas viewport expands correctly when right panels close/collapse;
- opening/resizing right panels updates available canvas space cleanly;
- left toolbar remains attached to the left edge and does not float away;
- contextual/top chrome does not overlap the canvas at supported desktop widths;
- A4 / print viewport treatment remains subordinate to the full working canvas;
- no new canvas/document model is introduced.

Do not modify renderer, zoom math, document dimensions, or drawing semantics.

---

## H2 — Status bar / viewport controls

Review:
- zoom display / controls;
- Fit / viewport actions;
- rotation indicator/control if currently present;
- document/workspace status;
- transient state / diagnostic text that belongs in normal UI.

Rules:
- keep the status area compact;
- normal user state must be legible under Phase G typography;
- engineering diagnostics must remain Specialist-only;
- no duplicate Primary Home for View / panel controls;
- do not add permanent controls unless an existing function lacks a usable home.

---

## H3 — Fullscreen

Verify and polish:
- fullscreen enter/exit;
- top/left/right chrome behavior;
- no overlapping controls;
- panel open/close/resize while fullscreen;
- canvas recenters/expands correctly;
- returning from fullscreen restores the prior shell state where current implementation already supports it.

Do not change browser Fullscreen API semantics.

---

## H4 — Narrow desktop

Primary target:
- desktop/laptop widths where the app is still in desktop mode but horizontal space is constrained.

Required:
- toolbar remains usable;
- contextual controls do not collide with document title / top actions;
- Panel Dock and Inspector retain usable minimum width;
- canvas keeps a meaningful minimum working region;
- typography does not clip important commands;
- no horizontal page overflow from shell chrome;
- Primary Home classifications from Phase F remain intact.

Prefer progressive compression/hiding of secondary information over shrinking important controls below accepted readability.

---

## H5 — Mobile / compact responsive

Preserve the existing mobile/compact control authority.

Required:
- mobile equivalents remain classified as responsive alternatives;
- Export remains reachable;
- essential tool switching remains reachable;
- Inspector / panel access remains reachable;
- no second mobile navigation/router is introduced;
- no desktop-only permanent chrome leaks into mobile layout;
- important labels do not become microtext.

Do not redesign mobile from scratch.

---

## H6 — Right Panel Dock interaction with canvas

Preserve Phase E authority.

Test:
- collapsed dock;
- Properties;
- Layers;
- History;
- Reference;
- Compose;
- CHAT;
- Revision;
- Specialist;
- switching Editor ↔ Creative;
- one active primary panel;
- last-active restore;
- Inspector resize;
- edge collapse / expand;
- Window-menu access.

Canvas width/offset must remain coherent for all states.

Do not create a second panel controller.

---

## H7 — Left toolbar responsive behavior

Preserve accepted toolbar order, groups, shortcuts and Phase D behavior.

Desktop:
- default single-column;
- optional double-column only where already supported/authorized;
- fixed compact toggle;
- no reordering between single/double layouts.

Compact/mobile:
- preserve existing mobile access;
- do not invent a second tool taxonomy.

---

## H8 — Regression and parity

Phase H must preserve:
- Phase C top-shell cleanup;
- Phase D toolbar;
- Phase E Panel Dock;
- Phase F Primary Home enforcement;
- Phase G typography;
- Web / Portable parity.

No Phase H change may alter:
- Document authority/schema;
- History semantics;
- Revision semantics;
- Renderer/WebGL/Canvas engine authority;
- Geometry execution contracts;
- Recipe/Core contracts;
- CHAT semantics;
- approval/execution authority;
- Service Worker;
- runtime bootstrap;
- cache/build identity;
- product version `v0.1`;
- `FORMAT_VERSION = 4`.

If any requested responsive fix requires one of those changes:

`INTEGRATION_REQUIRED → UR → MR`

---

## H9 — QA expectations

Update the existing UI Runtime harness only where required.

At minimum verify:
- normal desktop shell has no major overlap;
- right panel open/close changes canvas geometry correctly;
- right panel resize changes canvas geometry correctly;
- dock collapse restores canvas space;
- fullscreen entry/exit remains stable;
- narrow desktop has no shell-level horizontal overflow;
- important controls remain readable;
- mobile/compact essentials remain reachable;
- responsive alternatives stay classified correctly;
- Phase E/F/G assertions continue passing;
- Web / Portable parity;
- UI / Creative / Geometry regression.

Do not claim visual perfection from DOM checks alone. DEV should record any area needing UR visual comparison.

---

## Editable surfaces

Normally allowed:
- `product/source/styles.css`
- `product/source/shell.template.html` if responsive hooks/structure are needed
- regenerated `product/source/index.html`
- regenerated `product/source/index-standalone.html`
- `product/source/web-shell.js` only for bounded shell/responsive state behavior
- `qa/runtime/ink-web-ui-001-harness.html`

Avoid touching `product/source/src/**`.

If shell template changes:
1. edit `product/source/shell.template.html`
2. run generator
3. verify `node product/source/generate-shell.mjs --check`

---

## DEV return

Return:
- exact HEAD;
- changed files;
- canvas/status/responsive issue inventory before/after;
- desktop / narrow / mobile breakpoint behavior;
- panel-to-canvas geometry changes;
- fullscreen verification;
- shell generator check if applicable;
- static/unit checks;
- Runtime harness assertions added/updated;
- explicit confirmation:
  - Document unchanged
  - artwork Text semantics unchanged
  - History unchanged
  - Revision unchanged
  - Geometry/Core unchanged
  - CHAT semantics unchanged
  - Service Worker/bootstrap/build identity unchanged
  - `FORMAT_VERSION` unchanged
  - Phase I not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`

Do not run or claim Phase I Final Gate.


---

## DEV completion — Phase H

```text
PHASE = H / CANVAS_STATUS_RESPONSIVE
BRANCH = work/ink-web-ui-006-h
BASELINE_PHASE_G_ACCEPTED_BRANCH_HEAD = 8322170ae746ca9af2325cb2783d604e3a9cea6c
STYLE_CHECKPOINT = 0957ecbd083a0910b2c96404c65c257de18bb797
PRODUCT_QA_CHECKPOINT = 04ba565c80551fe364174b3964a3ebaa850454a5
EVIDENCE = working/INK_WEB_UI_006_PHASE_H_EVIDENCE.md
DEV_STATIC_QA = PASS
WINDOWS_RUNTIME = UR_EXACT_SHA_REQUIRED
PHASE_I = NOT_STARTED
```

### Changed implementation / QA files

- `product/source/styles.css`
- `qa/runtime/ink-web-ui-001-harness.html`

No shell-template regeneration was required.

### Implemented result

- canvas remains bounded by the accepted left toolbar / right Dock + measured primary-panel geometry;
- status viewport controls stay readable while secondary status progressively hides on narrow desktop;
- contextual top controls compress/scroll horizontally rather than wrapping into canvas;
- fullscreen presentation consumes the browser-provided viewport without creating a second fullscreen authority;
- compact/mobile continues using the existing Export, mobile tool dock and Inspector alternatives;
- no mobile router, second panel controller or second canvas authority was introduced.

### QA coverage added

- all eight accepted primary right-panel routes preserve the same canvas boundary;
- existing Inspector resize changes canvas geometry by the measured width delta;
- fullscreen presentation keeps stage / panel / Dock contained;
- 960px desktop retains meaningful canvas width with Properties open;
- narrow status prioritizes rotation / Fit / zoom controls;
- compact mode keeps Export / Inspector / tool switching reachable and desktop Dock suppressed;
- mobile Inspector overlays rather than permanently consuming canvas width.

### Verification / review boundary

```text
HARNESS_JAVASCRIPT_SYNTAX = PASS
CSS_BRACE_BALANCE = PASS
WEB_PORTABLE_SHARED_STYLES = PASS
WEB_PORTABLE_SHARED_WEB_SHELL = PASS
PHASE_E_F_G_ASSERTIONS = PRESERVED
SHELL_TEMPLATE_CHANGED = NO
GENERATOR_CHECK = NOT_APPLICABLE
DEV_RUNTIME_PASS_CLAIM = 0
UR_VISUAL_COMPARISON_REQUIRED = YES
```

### Explicit preservation

```text
Document = unchanged
artwork Text semantics = unchanged
History = unchanged
Revision = unchanged
Renderer = unchanged
Geometry/Core = unchanged
CHAT semantics = unchanged
Service Worker/bootstrap/build identity = unchanged
product version = v0.1 / preserved
FORMAT_VERSION = 4 / preserved
Phase I = not started
```

Completion:

`DEV_HANDOFF → UR_REVIEW → STOP`


---

## UR source review — 2026-09-24

Reviewed Phase H product / QA checkpoint:

`04ba565c80551fe364174b3964a3ebaa850454a5`

Accepted Phase G branch baseline:

`8322170ae746ca9af2325cb2783d604e3a9cea6c`

Compare result:
- Phase H branch is 7 commits ahead / 0 behind the accepted Phase G baseline.
- Product / QA implementation delta is limited to `product/source/styles.css` and `qa/runtime/ink-web-ui-001-harness.html`.
- Changes after `04ba565...` are governance / handoff / evidence only; there is no later product / QA source delta.
- No shell template, generated Web / Portable HTML, `web-shell.js`, or `product/source/src/**` change is part of Phase H implementation.

UR static findings:
- canvas remains governed by the accepted shell geometry and measured active-panel width; no second canvas/panel authority was introduced;
- Phase H presentation rules keep status/view controls compact while progressively hiding secondary status at narrow desktop widths;
- contextual controls compress horizontally instead of wrapping into the canvas;
- fullscreen changes are presentation containment only and do not alter Fullscreen API authority;
- compact/mobile preserves existing responsive alternatives and suppresses desktop Panel Dock;
- Runtime harness now checks all eight primary panel routes against the same stage/panel/dock boundary;
- Runtime harness exercises the existing Inspector resizer and checks the corresponding canvas-width delta;
- Runtime harness checks 960px narrow desktop, fullscreen containment, compact essentials, mobile overlay behavior, and absence of shell-level overflow;
- accepted Phase E/F/G assertions remain in the authoritative UI harness;
- Document, artwork Text semantics, History, Revision, Renderer, Geometry/Core, CHAT, Service Worker, runtime bootstrap, cache/build identity, product version and FORMAT_VERSION remain unchanged;
- Phase I has not started.

UR static result:

`STATIC_PASS`

Runtime gate required before promotion:
- authoritative Windows self-hosted exact-SHA Runtime against `04ba565c80551fe364174b3964a3ebaa850454a5`;
- Phase H canvas/panel geometry assertions;
- Inspector resize/canvas-width assertion;
- fullscreen containment;
- narrow desktop status/canvas behavior;
- compact/mobile essentials and overlay behavior;
- Phase E/F/G regression;
- Web / Portable parity;
- UI / Creative / Geometry regression.

Per user direction, the full Photoshop/Figma/INK visual comparison is intentionally deferred until Phase I implementation/certification is complete, so the final visual review is performed once against the completed UI rather than repeated during Phase H.

Current UR result:

`UR_REVIEW / STATIC_PASS / WINDOWS_RUNTIME_REQUIRED / FINAL_VISUAL_COMPARISON_DEFERRED_TO_POST_PHASE_I`

Do not begin Phase I until the Phase H Runtime gate passes.
