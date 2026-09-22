# INK DEV PROGRESS

STATUS: `IN_PROGRESS / PHASE_A_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-004` |
| TITLE | `Panel Hierarchy / Spacing / CHAT Placement Polish v0.1` |
| BRANCH | `work/ink-web-ui-004` |
| BASE_MAIN | `9adc2ef09141e4015fc9d4657fb5b3f932a39c41` |
| TASK_STATUS | `IN_PROGRESS / PHASE_A_COMPLETE` |
| DEV_HANDOFF | `NOT_YET` |
| UR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `PANEL_CHAT_UI_POLISH_WORKS` |
| UI_SHELL | `PORTABLE_WEB_SHARED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| CORE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED_TO_UI_INTEGRATION_BATCH` |

## Objective

```text
accepted shell + contextual options
→ panel hierarchy / spacing cleanup
→ CHAT / Reference / Compose / Revision placement polish
→ quieter everyday interface
→ no semantic change
```

## Planned phases

- Phase A — hierarchy / density inventory
- Phase B — dock and panel hierarchy polish
- Phase C — spacing / alignment normalization
- Phase D — CHAT / creative-loop placement polish
- Phase E — Portable/Web parity + static closure
- Phase F — report + DEV_HANDOFF

At each meaningful checkpoint commit and update this file.

Cross-lane requirement:

`INTEGRATION_REQUIRED → STOP → UR`

## Checkpoints

### Phase A — hierarchy / density inventory

Audited starting branch HEAD:

`c5817a1cdd74f882133ecbd61437d51863792ff2`

Observed UI facts:

- `web-shell.js` already enforces one Inspector / Creative Workspace primary surface and a collapsed-by-default dock;
- dock already contains two conceptual groups, but grouping is mostly implicit and Window menu is flat;
- Creative Workspace remains a right-side primary panel, but its header/state/tabs retain older floating-workspace density;
- Creative internal stage changes are not explicitly synchronized back into dock/presentation state by the shared shell;
- CHAT / Reference / Compose / Revision already route through existing `creativeWorkspace.setStage()` / `setOpen()`; no CHAT semantic change is required;
- UI-003 contextual row is shared and must remain unchanged except spacing harmony;
- Inspector and Creative Workspace can be polished through shared shell coordination + CSS only.

Implementation plan:

```text
explicit dock/menu grouping
+ presentation-only creative-stage synchronization
+ compact shared panel/chrome spacing
+ CHAT visual priority inside existing Creative Workspace
+ deterministic static contract
```

Expected product mutation: `product/source/web-shell.js` and `product/source/styles.css` only.
No HTML fork and no Core / CHAT-controller semantic source change required.

Checks not yet executed: focused static/parity closure.
Runtime remains `DEFERRED_TO_UI_INTEGRATION_BATCH`.
Integration finding: none.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-004
BRANCH = work/ink-web-ui-004
FINAL_HEAD = <exact SHA>
GATE = PANEL_CHAT_UI_POLISH_WORKS
PORTABLE_WEB_PARITY = PASS
FORMAT_VERSION = 4
PRODUCT_BASE_VERSION = v0.1
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
