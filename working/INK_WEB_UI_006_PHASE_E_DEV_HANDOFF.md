# INK-WEB-UI-006 — Phase E DEV HANDOFF

STATUS: DEV_HANDOFF / UI_ONLY / PHASE_E / STOP
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
