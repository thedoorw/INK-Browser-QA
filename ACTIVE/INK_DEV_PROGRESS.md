# INK DEV PROGRESS

STATUS: `IN_PROGRESS / PHASE_A_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-003` |
| TITLE | `Contextual Controls / Top Options v0.1` |
| BRANCH | `work/ink-web-ui-003` |
| BASE_MAIN | `73b54efe6d7db1f9fd15531603056c82e4c9de1e` |
| TASK_STATUS | `IN_PROGRESS / PHASE_A_COMPLETE` |
| DEV_HANDOFF | `NOT_YET` |
| UR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `CONTEXTUAL_TOOL_OPTIONS_WORK` |
| UI_SHELL | `PORTABLE_WEB_SHARED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| CORE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED_TO_UI_INTEGRATION_BATCH` |

## Objective

```text
current tool / selection
→ quiet top contextual options
→ high-frequency controls immediately reachable
→ advanced controls on demand
→ no Core semantic change
```

Authoritative branch-local scope:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Planned phases

- Phase A — current control/binding inventory
- Phase B — shared contextual host
- Phase C — drawing tool contextual controls
- Phase D — eraser / shape / text contextual controls
- Phase E — selection contextual actions
- Phase F — Portable/Web parity + source/static closure
- Phase G — report + DEV_HANDOFF

## Mandatory checkpoint rule

At every meaningful checkpoint record:

- exact commit SHA;
- files changed;
- IDs/bindings preserved or intentionally rewired;
- checks executed;
- checks not executed;
- any cross-lane requirement.

If a Core/Integration boundary is encountered:

`INTEGRATION_REQUIRED → STOP → UR`

## Checkpoints

### Phase A — control / binding inventory

Audited branch start HEAD:

`f5edd507b951ec159161304c45fa2374f4ee3980`

Observed command-bearing UI retained for re-hosting:

- drawing: `#quickColorInput`, `#quickSizeInput`, `#quickOpacityInput` already bind to the same brush state as Inspector `#colorInput`, `#sizeInput`, `#opacityInput`;
- eraser: existing `#quickSizeInput` maps to the current draw-size state used by eraser radius; existing `[data-eraser-mode]` controls own mode selection;
- shape: existing `[data-shape]`, `#shapeFill` and shared colour state;
- text: existing `#fontFamily`, `#fontSize` and shared colour state;
- selection: existing `#selectionBar` and `data-selection-action` commands for duplicate / group / front / alignCenter / delete;
- advanced brush/pointer/render/object controls stay in Inspector.

Implementation decision:

```text
preserve existing IDs and command listeners
→ re-host existing control nodes in one shared contextual surface
→ coordinate visibility in web-shell.js
→ presentation only in styles.css
→ no src/ink.js semantic change required
```

Planned product files: both entry HTML shells, `web-shell.js`, `styles.css`.
Planned QA: extend full-shell parity guard and add focused contextual-options static test.
Forbidden Core / Document / History / Revision / Recipe / Geometry / Renderer files: no change required.

Checks executed: source inventory / binding trace by exact branch source inspection.
Checks not executed yet: Node parity/context tests; full browser Runtime intentionally deferred.
Integration finding: none.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-003
BRANCH = work/ink-web-ui-003
FINAL_HEAD = <exact SHA>
GATE = CONTEXTUAL_TOOL_OPTIONS_WORK
PORTABLE_WEB_PARITY = PASS
FORMAT_VERSION = 4
PRODUCT_BASE_VERSION = v0.1
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
