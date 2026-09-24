# INK-WEB-UI-006 — Phase E DEV HANDOFF

STATUS: DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / UI_ONLY / PHASE_E / STOP
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-e`
BASELINE_UI_ACCEPTED: `fd7020f2042f2a70d5b33ee6d3a34ca8a7dbe65f`
PHASE_C_D_RUNTIME: `35940344586 / attempt 2 / PASS`
PHASE_C_D_TESTED_SHA: `9e3799718490151a69de56a12e489e103481bbbd`

## Goal

Implement only:

**Phase E — Right Panel Dock refactor**

Do not start Phase F or later phases.

This phase must preserve the already accepted workstation capability placement and the existing single panel authority.

Authoritative capability-placement baseline:

`research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`

Accepted panel grammar:

`Properties / Layers / History / Reference / Compose / CHAT / Revision`

No second panel router, second inspector architecture, or duplicate capability authority may be created.

---

## E1 — Right side becomes a true Panel Dock

The right side must behave as one dock/container system rather than a mega-Inspector.

### Everyday Editor group

- Properties
- Layers
- History

### Creative Loop group

- Reference
- Compose
- CHAT
- Revision

### Specialist group

Keep specialist/diagnostic capability reachable without mixing it into normal Properties hierarchy.

Specialist surfaces include only existing capabilities already present in product UI, such as:

- AI / advanced production surfaces
- Recipe / advanced production controls
- diagnostics / validation
- device / performance QA where already present

Do not invent new engine features or capability semantics.

---

## E2 — Dock behavior

Preserve or improve:

- icon-only collapsed dock
- one clear expand/collapse affordance
- resizable active panel width
- last-active panel memory
- Window-menu access
- canvas expansion when panel closes
- one active primary panel at a time
- Web / Portable parity

The accepted panel controller in `product/source/web-shell.js` remains the UI authority.

Do not create parallel dock state in another file.

---

## E3 — Properties scope

Properties remains the normal home for:

- active tool settings
- selected-object settings
- appearance
- transform
- accepted Path / Boolean / Repeat controls
- accepted read-only grounded selection capability status

Remove specialist engineering/diagnostic content from the normal Properties hierarchy when it is currently mixed there.

Do not move or duplicate:

- Document authority
- History authority
- Revision authority
- Geometry execution authority
- CHAT approval/execution authority

Specialist/Diagnostic controls must remain available through an explicit specialist surface if they already exist.

---

## E4 — Layers

Retain current behavior:

- drag reorder
- visibility
- lock
- add
- duplicate
- delete
- opacity
- compact bottom action rail

UI arrangement may be refined.

No Layer/Document semantics change.

---

## E5 — History

History remains its own panel.

No History stack, undo/redo, operation, persistence, or receipt semantics may change.

---

## E6 — Creative panels

Preserve accepted capability placement exactly:

- Reference → extraction + Research → Creation advisory/read-only status
- Compose → deterministic Parametric Structure status; Repeat mutation remains existing authority
- CHAT → grounded context / Creative Memory / Research advisory + existing proposal → approval → execution boundary
- Revision → capture/list/restore + provenance + structural compare

UI may reorganize visual grouping and density only.

Do not move these capabilities into a new generic inspector or duplicate them elsewhere.

---

## E7 — Specialist / Diagnostic separation

Goal:

normal creative/editor workflow should not be dominated by engineering surfaces.

If existing specialist controls are currently embedded in normal Properties hierarchy, move their UI entry to a clearly separated specialist/diagnostic surface while preserving their existing command endpoints.

Examples of specialist content:

- AI connection engineering
- GPU validation
- program-asset import
- recipe engineering console
- device validation
- performance benchmark
- manual QA export

Rules:

- preserve command semantics
- preserve existing IDs/handlers where practical
- proxy existing endpoints rather than implementing second logic
- no Core change
- no new diagnostic engine

---

## Technical authority constraints

Web / Portable shell authority remains:

1. edit `product/source/shell.template.html`
2. regenerate with `node product/source/generate-shell.mjs`
3. verify with `node product/source/generate-shell.mjs --check`

Allowed UI files normally:

- `product/source/shell.template.html`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- task-specific UI runtime assertions only when required

Shared creative-workspace files may be touched only if strictly presentation/routing-related and capability semantics remain unchanged.

If Phase E requires a semantic change in a shared creative surface:

`INTEGRATION_REQUIRED → UR → MR`

---

## Prohibited changes

Do not modify:

- Document authority/schema
- History semantics
- Revision semantics
- Renderer/WebGL/Canvas engine
- Geometry/Recipe/Core contracts
- CHAT grounding/reasoning semantics
- approval/execution authority
- Service Worker
- runtime bootstrap contract
- build/cache identity
- package branch
- product visible version `v0.1`
- `FORMAT_VERSION = 4`

No new panel architecture.

No Phase F duplication cleanup beyond what is strictly necessary to make the dock structurally correct.

---

## Runtime evidence required

At minimum verify on Windows self-hosted Runtime:

- dock collapsed
- Properties open
- Layers open
- History open
- Reference open
- Compose open
- CHAT open
- Revision open
- switch between Editor and Creative groups
- one active primary panel at a time
- last-active panel memory
- panel resize
- canvas expands/collapses correctly
- edge collapse/expand affordance
- Window-menu access
- Specialist/Diagnostic entry remains reachable
- Properties no longer visually mixes specialist engineering controls
- Layers operations remain wired
- History panel remains wired
- narrow desktop
- fullscreen
- Web / Portable parity
- UI / Creative / Geometry regression

---

## DEV return

Return:

- exact HEAD
- changed files
- panel-routing note
- Properties specialist-separation note
- shell generator check result
- static/unit result
- runtime-harness assertions added/updated
- explicit confirmation:
  - Document unchanged
  - History unchanged
  - Revision unchanged
  - Geometry/Core unchanged
  - CHAT semantics unchanged
  - Service Worker/bootstrap/build identity unchanged
  - FORMAT_VERSION unchanged
  - Phase F not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`

Do not begin Phase F automatically.


---

## DEV completion — 2026-09-24

Implemented only Phase E.

### Routing result

The existing `product/source/web-shell.js` remains the only panel controller.

Dock groups:
- Editor → Properties / Layers / History
- Creative Loop → Reference / Compose / CHAT / Revision
- Specialist → existing Inspector-based AI / advanced / diagnostic surfaces

No second Inspector, panel router, Creative Workspace controller, or command authority was added.

### Properties / Specialist result

Properties now exposes:
- Tool
- Object
- Geometry

Existing Path Boolean / Repeat controls were moved into Properties → Geometry with their original command IDs and handlers intact.

Specialist now exposes the existing:
- AI surface
- advanced production / Recipe engineering surface
- GPU validation
- device / performance / QA diagnostics

The GPU self-check UI no longer appears in normal Tool Properties; `runGPUValidationBtn` and `gpuValidationStatus` remain the same endpoints.

### Preserved behavior

- compact icon-only dock
- one primary panel at a time
- existing edge collapse / restore affordance
- last-active primary panel memory
- resizable Inspector width
- canvas expansion on close
- Window-menu access
- Layers behavior unchanged
- History semantics unchanged
- Reference / Compose / CHAT / Revision capability placement unchanged
- Web / Portable parity

### Verification

PASS:
- shell generator parity / Web output parity
- Portable output parity
- no unresolved shell tokens
- `web-shell.js` syntax
- UI runtime harness syntax
- CSS brace balance
- moved command endpoints remain unique
- `product/source/src/ink.js` unchanged from accepted Phase C/D baseline
- `FORMAT_VERSION = 4`
- prohibited implementation surfaces untouched

Task-specific Phase E runtime assertions were added to:

`qa/runtime/ink-web-ui-001-harness.html`

Full DEV evidence:

`working/INK_WEB_UI_006_PHASE_E_EVIDENCE.md`

### Exact-SHA Windows Runtime

Not dispatched from this DEV connection because the available GitHub connector does not expose the manual `workflow_dispatch` action.

No Runtime PASS is claimed.

UR must run the existing authoritative Windows self-hosted Runtime batch against the final DEV exact HEAD before promotion.

### Boundary confirmation

- Core / Document / History / Revision / Renderer semantics unchanged
- Geometry / Recipe execution authority unchanged
- CHAT approval / execution authority unchanged
- Service Worker / bootstrap / build-cache identity unchanged
- visible version remains v0.1
- Phase F not started

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`


---

## UR source review — 2026-09-24

Reviewed product source checkpoint:

`6ee7ef4343a0bc8d70c3340ba7bd12be4b430931`

Accepted UI baseline:

`fd7020f2042f2a70d5b33ee6d3a34ca8a7dbe65f`

Compare result:
- Phase E branch is 9 commits ahead / 0 behind the accepted UI baseline.
- Product/QA delta is limited to the authorized shell, presentation, panel-controller and runtime-harness surfaces plus Phase E handoff/evidence docs.
- The final two commits after the source checkpoint are documentation/evidence only; no product-source delta exists after `6ee7ef4...`.

UR static findings:
- the existing `product/source/web-shell.js` remains the only panel controller;
- dock definitions are grouped as Editor / Creative Loop / Specialist without adding a second panel router;
- Properties exposes Tool / Object / Geometry while Specialist reuses the same Inspector for AI / advanced diagnostic surfaces;
- Path Boolean / Repeat endpoints remain single-instance and are routed under Properties → Geometry;
- GPU validation / program-asset engineering controls remain single-instance and are reachable through Specialist;
- one primary panel at a time is still enforced across Inspector and Creative Workspace;
- edge collapse/restore retains last-panel behavior;
- Window menu exposes the same grouped dock routes;
- Layers / History / Reference / Compose / CHAT / Revision authorities remain in their accepted controllers;
- Web / Portable shell generation authority remains `shell.template.html`;
- no prohibited Core / Document / History / Revision / Renderer / Service Worker / bootstrap / build-identity source is in the Phase E compare;
- `FORMAT_VERSION = 4` and visible `v0.1` are preserved;
- Phase F has not started.

UR static result:

`STATIC_PASS`

Runtime gate required before UI_PASS:
- authoritative Windows self-hosted exact-SHA browser Runtime;
- Phase E dock routing / grouping / resize / collapse / Window-menu assertions;
- Layers / History wiring;
- narrow desktop / fullscreen / Web-Portable parity;
- UI / Creative / Geometry regression.

Current UR result:

`UR_REVIEW / STATIC_PASS / WINDOWS_RUNTIME_REQUIRED / PHASE_E`

Do not begin Phase F.
