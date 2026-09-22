# INK CURRENT WORK ORDER

STATUS: `INK-WEB-UI-005 / UR_AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-WEB-UI-005` |
| TITLE | `Responsive / Fullscreen / Final UI Regression v0.1` |
| AUTHORITY | `UR_DELEGATED_UI_LANE` |
| DEV_WORK_BRANCH | `work/ink-web-ui-005` |
| BASE_MAIN | `d0488ddd8380b285b2744abd6b6983f451a6a702` |
| DEV_MODE | `BOUNDED_UI_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / UI_ONLY` |
| UI_SHELL | `PORTABLE_WEB_SHARED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| CORE_MUTATION | `PROHIBITED` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Close the delegated UI sequence:

```text
accepted UI-003 contextual options
+ accepted UI-004 panel / CHAT polish
→ desktop / narrow / mobile containment
→ fullscreen consistency
→ final shared-shell regression
→ UI_LANE_READY_FOR_INTEGRATION
```

This is the final bounded UI convergence package. Do not add new product features.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this branch-local Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
8. UI-003 and UI-004 reports
9. current shared shell / responsive CSS / fullscreen bindings only as needed

## Required scope

### A — Desktop / narrow responsive containment

Verify and correct UI-only containment for:

- wide desktop;
- medium/narrow desktop;
- dock + primary panel open;
- contextual options overflow;
- selection contextual actions;
- Pages panel / floating panels;
- canvas visible region.

Avoid adding a new responsive framework.

Gate: `DESKTOP_NARROW_UI_CONTAINMENT_WORKS`

### B — Mobile / coarse-pointer containment

Preserve current mobile interaction grammar while ensuring:

- contextual options remain reachable without covering the canvas incorrectly;
- mobile dock / tool sheet remain reachable;
- Inspector / Creative Workspace / Pages containment is coherent;
- no desktop panel dock leaks into mobile;
- no critical controls become permanently inaccessible.

This is containment/regression closure, not a mobile redesign.

Gate: `MOBILE_UI_CONTAINMENT_WORKS`

### C — Fullscreen consistency

Verify the existing fullscreen command and presentation remain compatible with:

- canvas-first shell;
- contextual options;
- panel dock;
- Inspector;
- Creative Workspace;
- mobile/narrow fallback where applicable.

Do not replace fullscreen semantics or browser API behavior.

Gate: `FULLSCREEN_UI_CONSISTENCY_WORKS`

### D — Final UI source/static regression

Create a focused final UI regression contract covering at minimum:

- Portable/Web parity;
- shared contextual-options contract;
- panel hierarchy/grouping;
- CHAT/Reference/Compose/Revision reachability;
- Layers / History reachability;
- responsive media-query invariants;
- fullscreen command binding remains present;
- Web/Portable identity remains `v0.1`;
- `FORMAT_VERSION = 4`;
- no package mutation;
- no Core semantic source mutation.

Gate: `FINAL_UI_STATIC_REGRESSION_PASS`

## Hard boundaries / STOP

STOP with `INTEGRATION_REQUIRED` if work requires changing:

- Document authority / schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry;
- renderer / WebGL / Canvas engine;
- Core module contracts;
- CHAT proposal/approval/execution semantics;
- persistence semantics;
- product base version;
- package/certification;
- another lane's implementation.

UI-only CSS, shell presentation/coordinator logic and focused UI QA are allowed.

## Acceptance

Before DEV_HANDOFF:

- UI-003 and UI-004 accepted behavior preserved;
- desktop/narrow/mobile containment source contracts PASS;
- fullscreen binding/presentation contract PASS;
- Portable/Web parity PASS;
- changed JS parses;
- focused final UI regression PASS;
- no Core semantic source changed;
- `FORMAT_VERSION = 4`;
- product base version `v0.1`;
- package mutation = 0;
- browser Runtime not claimed unless actually executed.

Final source gate:

`UI_LANE_SOURCE_COMPLETE`

## Evidence

Create/update exactly one report:

`research/INK_WEB_UI_005_RESPONSIVE_FINAL_REGRESSION_REPORT_v0.1.md`

Include:

- responsive/fullscreen findings;
- changed files;
- preserved bindings/semantics;
- parity/static checks;
- deferred Runtime debt;
- any `INTEGRATION_REQUIRED` finding;
- final UI-lane readiness statement.

## Completion / STOP

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-005
BRANCH = work/ink-web-ui-005
GATE = UI_LANE_SOURCE_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
PRODUCT_BASE_VERSION = v0.1 / PRESERVED
PORTABLE_WEB_PARITY = PASS
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
UI_LANE_READY_FOR_INTEGRATION = CANDIDATE
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
