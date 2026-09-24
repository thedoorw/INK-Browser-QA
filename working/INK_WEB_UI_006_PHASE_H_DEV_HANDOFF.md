# INK-WEB-UI-006 — Phase H DEV HANDOFF

STATUS: AUTHORIZED / UI_ONLY / PHASE_H / DEV_START
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
