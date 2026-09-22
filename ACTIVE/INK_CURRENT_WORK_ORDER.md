# INK CURRENT WORK ORDER

STATUS: `INK-WEB-UI-001 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-WEB-UI-001` |
| TITLE | `Photoshop-Aligned Workspace Shell & Collapsible Panel Dock v0.1` |
| AUTHORITY | `USER_EXPLICIT / PACKAGE_WORK` |
| DEV_WORK_BRANCH | `work/ink-web-ui-001` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / UI_SHELL_ONLY` |
| UI_MUTATION | `AUTHORIZED` |
| PRODUCT_DISPLAY_VERSION | `INK v0.1 · Web + INK v0.1 · Portable / REQUIRED` |
| FAVICON | `USER_ORIGINAL_MARK / REQUIRED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |
| RUNTIME_QA | `DEFERRED_TO_BATCH / SOURCE_STATIC_REQUIRED` |

## Product intent

The first shared INK UI stage for both Portable and Web adopts a familiar Photoshop / Illustrator workspace grammar without copying Adobe branding, proprietary assets, or source code.

Core principle:

```text
人類介面可以盡量安靜、簡潔；
CHAT 能力則維持在底層完整。
```

Target shell:

```text
top menu + contextual options
left compact tool rail
center canvas
right collapsible panel dock
bottom low-noise status
```

The canvas must become the visual subject. Existing drawing, document, CHAT, History, Revision and creative-loop capabilities must remain available below the UI whether panels are open or collapsed.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_Product_Delivery_Model_v0.1.md`
8. only the product / QA files required by the phases below

## User-supplied INK mark

Authoritative Phase-1 source asset:

`reference/brand/INK_MARK_SOURCE_W-300.jpg`

Identity:

```text
SOURCE = USER ORIGINAL ARTWORK
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
DIMENSIONS = 300 x 300
VISUAL = blue geometric-grid field + white central three-arm mark
USE = INK visible mark + Web favicon
FINE_GRID_AT_FAVICON_SIZE = MAY BECOME ILLEGIBLE / ACCEPTED
SIMPLIFIED_REDRAW = NOT REQUIRED
STATUS = TEMPORARY_ACCEPTED / REPLACEABLE_LATER
```

Technical format conversion is allowed only when needed for browser/manifest compatibility. Do not visually reinterpret the mark.

## Reference behavior

Use Photoshop / Illustrator as interaction references for:

- compact left toolbar;
- canvas-dominant central workspace;
- right-side dock/panel grammar;
- collapse to icons and expand on demand;
- familiar panel visibility behavior;
- contextual exposure of tool/selection controls.

Do not attempt pixel duplication. INK remains its own product.

## Long Sequence Workpack

### Phase A — Exact shell inventory + regression map

Before visual mutation, inventory the current shell and its behavior.

At minimum map:

- `product/source/index.html`;
- `product/source/index-standalone.html`;
- `product/source/styles.css`;
- relevant UI/event logic in `product/source/src/ink.js` and directly related modules;
- menu strip;
- topbar;
- workspace switch;
- pages panel;
- left tool rail / current tool controls;
- inspector;
- Layers;
- History;
- Creative Workspace;
- Reference / Compose / CHAT / Revision entry points;
- fullscreen;
- save/open/export;
- keyboard shortcuts;
- desktop resize;
- current narrow/mobile rules;
- all IDs/classes/data attributes used by JS bindings.

Required output: concise inventory in branch-local DEV progress and final implementation report.

Hard rule:

```text
VISUAL_REORGANIZATION
must not silently delete or orphan an existing command binding.
```

Checkpoint commit required.

Gate: `UI_SHELL_INVENTORY_COMPLETE`

### Phase B — Photoshop-aligned canvas-first shell

Reorganize the shared Portable/Web shell so both delivery forms open into the same calm, canvas-first workspace.

Required:

- compact left vertical tool rail;
- canvas visually dominant;
- right-side panels not permanently occupying a large width;
- right dock collapsed by default to compact icons/controls;
- remove or redesign the central rounded INK empty-state card;
- preserve minimal empty-state guidance only where useful;
- keep application/menu/document identity distinct from contextual controls;
- preserve existing panel content and functional bindings where practical;
- canvas center must respond to the actual visible dock width;
- no large Creative Workspace form should dominate the initial screen.

The first package does not require a complete redesign of every tool property control. If dense tool controls cannot be safely migrated within this package, preserve them behind the existing inspector/property surface rather than enlarging scope.

Checkpoint commit required.

Gate: `WEB_WORKSPACE_SHELL_ALIGNED`

### Phase C — Collapsible panel dock

Implement bounded Photoshop-like panel behavior.

Required:

- compact collapsed state;
- summon panel from dock;
- expand one primary panel group at a time;
- clicking the active panel may collapse it;
- Layers and History must remain directly reachable;
- CHAT / Reference / Compose / Revision must remain reachable without permanent occupancy;
- hidden/collapsed panel must not disable underlying capability;
- panel width bounded;
- local persistence of panel-open/collapsed state allowed if simple and safe;
- Window/menu access should remain coherent for panels exposed there;
- no second workspace/document state authority.

Checkpoint commit required.

Gate: `COLLAPSIBLE_PANEL_DOCK_WORKS`

### Phase D — Portable/Web identity v0.1 + INK mark + favicon + cache identity

Correct both delivery-form identities in the same package.

Required user-facing identities:

```text
INK v0.1 · Web
INK v0.1 · Portable
```

At minimum inspect and correct relevant historical `v1.6.5 RC` Web-facing strings in:

- document title;
- visible shell labels / ARIA product identity;
- `manifest.webmanifest`;
- PWA/service-worker release/cache identity where it controls update behavior;
- any Web-only visible metadata in the active modular source.

Rules:

- historical engineering/baseline records may retain `v1.6.5 RC`;
- do not rewrite archival/reference history;
- `FORMAT_VERSION = 4` remains unchanged;
- base product version remains `v0.1`, not `v0.1.1` or another inferred bump.

Brand asset:

- add a product Web asset derived from `reference/brand/INK_MARK_SOURCE_W-300.jpg`;
- use it as the compact INK mark in the Web shell where appropriate;
- add favicon link(s);
- register app/manifest icon metadata where technically appropriate;
- preserving the supplied JPG appearance is preferred; simple format conversion/copy is allowed;
- do not redraw merely because the fine grid becomes indistinct at small sizes.

Cache/update behavior:

- move Web shell cache/release identity away from historical `1.6.5-RC`;
- a previously opened browser must be able to obtain the new shell without requiring manual browser-storage deletion;
- favicon may require fresh-tab verification because browser favicon caching is independent.

Checkpoint commit required.

Gate: `WEB_V0_1_IDENTITY_AND_FAVICON_WORK`

### Phase E — Regression closure + batched Runtime QA registration

Execute all source/static/unit/binding checks for this Work Order. Register real-browser QA for the next Runtime batch unless an immediate-runtime trigger is discovered.

Required acceptance:

- initial Web view is canvas-first;
- left tools remain available;
- right panel dock starts compact;
- panel expand/collapse works;
- Layers operations still work;
- History operations still work;
- CHAT surface can open/close without losing underlying CHAT/document capability;
- Reference / Compose / Revision remain reachable;
- fullscreen works;
- save/open/export remain wired;
- keyboard shortcuts sampled and preserved;
- desktop resize works;
- narrow/mobile fallback does not catastrophically overlap;
- visible identity is `INK v0.1 · Web`;
- no active Web-facing historical `v1.6.5 RC` identity remains where it represents current product version;
- favicon is requested successfully in a fresh browser context;
- service-worker/cache update behavior is validated;
- no fatal console/runtime error;
- `FORMAT_VERSION = 4`;
- no document migration required;
- no product drawing/document capability intentionally removed.

Use the existing self-hosted Windows runtime standard:

`governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`

Runner:

```text
C:\actions-runner-ink
[self-hosted, Windows, X64]
Chrome available
```

Do not change PowerShell execution policy. Reuse the bounded exact-SHA materialization pattern that already works on this runner where practical.

Source-level gate:

`INK_WEB_UI_PHASE1_SOURCE_COMPLETE`

Full Runtime acceptance will be applied later at the concentrated batch checkpoint.

## Required evidence artifact

Create/update exactly one task-level implementation report:

`research/INK_WEB_UI_PHASE1_IMPLEMENTATION_REPORT_v0.1.md`

It must contain:

- exact shell inventory;
- UI structural changes;
- panel-dock behavior;
- version-string locations corrected;
- favicon/mark asset locations;
- cache/service-worker identity change;
- source/static checks;
- browser runtime evidence;
- responsive observations;
- known deferred UI work;
- final gate status.

Do not create additional design/research documents unless a concrete technical contract cannot fit here or in the existing UI development plan.

## Explicit deferrals

Do not expand this package into:

- full Photoshop visual cloning;
- complete contextual-control migration for every tool;
- broad CHAT redesign;
- new CHAT command vocabulary;
- new drawing engine behavior;
- new Recipe semantics;
- document/schema changes;
- general design-system rewrite;
- new cloud backend;
- CRDT/multiplayer;
- package/certification work.

These remain later work unless separately authorized.

## Publication rule

```text
work/ink-web-ui-001
→ NOT public

DEV_HANDOFF
→ MR review

MR_PASS
→ clean promotion / merge to main

main
→ GitHub Pages republishes staging

live staging
→ MR verifies actual public Web + cache update
```

DEV must not merge main.

## DEV progress discipline

Branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Update at every meaningful checkpoint with:

- exact HEAD;
- phase;
- files changed;
- checks/tests;
- blocker;
- next phase.

## Completion / STOP

DEV may hand off after source/static evidence closes and deferred Runtime debt is recorded.

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-001
BRANCH = work/ink-web-ui-001
GATE = INK_WEB_UI_PHASE1_SOURCE_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
WEB_DISPLAY_VERSION = INK v0.1 · Web
FAVICON = USER_ORIGINAL_MARK / PRESENT
PACKAGE_MUTATION = 0
BROWSER_RUNTIME_QA = DEFERRED_TO_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Shared-shell correction — USER clarification

```text
UI_SHELL = SHARED
PORTABLE = SAME UI / SAME INTERACTION GRAMMAR
WEB_CLOUD = SAME UI / SAME INTERACTION GRAMMAR
```

Keep `product/source/index.html` and `product/source/index-standalone.html` aligned for this redesign.

Display identity:

```text
Web      = INK v0.1 · Web
Portable = INK v0.1 · Portable
```


## Runtime batching override

```text
FULL_RUNTIME_EVERY_WORK_ORDER = NO
DEFAULT_BATCH_TARGET = 3
ALLOWED_RANGE = 2–4 compatible bounded Work Orders
CURRENT = DEFERRED_TO_BATCH
```

All practical source/static/unit checks remain mandatory. Immediate Runtime is required only if a high-risk trigger appears.
