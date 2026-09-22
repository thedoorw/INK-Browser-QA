# INK CURRENT WORK ORDER

STATUS: `INK-WEB-UI-004 / UR_AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-WEB-UI-004` |
| TITLE | `Panel Hierarchy / Spacing / CHAT Placement Polish v0.1` |
| AUTHORITY | `UR_DELEGATED_UI_LANE` |
| DEV_WORK_BRANCH | `work/ink-web-ui-004` |
| BASE_MAIN | `9adc2ef09141e4015fc9d4657fb5b3f932a39c41` |
| DEV_MODE | `BOUNDED_UI_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / UI_ONLY` |
| UI_SHELL | `PORTABLE_WEB_SHARED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| CORE_MUTATION | `PROHIBITED` |
| RUNTIME_QA | `DEFERRED_TO_UI_INTEGRATION_BATCH` |

## Objective

Polish the accepted shell after UI-003 without redesigning the product:

```text
panel hierarchy
+ spacing / alignment
+ CHAT / Reference / Compose / Revision placement
→ quieter everyday workspace
→ canvas remains dominant
→ capability semantics unchanged
```

Target is practical 90% normal-use UI, not pixel-perfect polishing.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this branch-local Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
8. UI-003 report and current shared shell source

## Required scope

### A — Panel hierarchy

Normalize the right-side dock/panel grammar:

- one primary panel width at a time;
- clear grouping between Properties / Layers / History and Reference / Compose / CHAT / Revision;
- reduce redundant headings/chrome;
- preserve existing panel IDs, commands and panel availability;
- collapsed dock remains the quiet default;
- active-panel/collapse behavior remains predictable.

Gate: `PANEL_HIERARCHY_POLISHED`

### B — Spacing / hierarchy

Tighten only high-value visual structure:

- toolbar/context row spacing;
- panel header/body spacing;
- dock icon spacing/alignment;
- canvas edge clearance;
- common control height/alignment;
- typography hierarchy where inconsistent.

Do not perform a broad design-system rewrite or Photoshop skin copy.

Gate: `UI_SPACING_HIERARCHY_POLISHED`

### C — CHAT / creative-loop placement

Refine placement of:

- CHAT;
- Reference;
- Compose;
- Revision.

Rules:

- these remain right-dock/on-demand surfaces;
- CHAT capability must not depend on panel visibility;
- closing a panel must not terminate document/CHAT capability;
- no separate CHAT-only state;
- no simulated mouse interaction as command authority;
- no change to CHAT proposal/approval/edit semantics.

Gate: `CHAT_PLACEMENT_POLISHED`

### D — Shared Portable / Web closure

Apply all shared shell changes consistently to Web and Portable.

Run/extend deterministic parity/static checks for any new shared UI invariant.

Gate: `UI004_PORTABLE_WEB_PARITY_WORKS`

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

UI-only layout, CSS, shared shell coordination and non-semantic panel presentation are allowed.

## Acceptance

Before DEV_HANDOFF:

- panel/dock reachability preserved;
- Layers / History / CHAT / Reference / Compose / Revision reachable;
- UI-003 contextual options preserved;
- canvas-first default preserved;
- Portable/Web parity PASS;
- changed JS parses;
- focused UI/static tests PASS;
- no Core semantic source changed;
- `FORMAT_VERSION = 4`;
- product base version `v0.1`;
- package mutation = 0;
- Runtime not claimed unless actually executed.

Final gate:

`PANEL_CHAT_UI_POLISH_WORKS`

## Evidence

Create/update exactly one report:

`research/INK_WEB_UI_004_PANEL_CHAT_POLISH_REPORT_v0.1.md`

Include changed-file inventory, before/after hierarchy, command/binding preservation, parity/static checks, deferred Runtime, and any integration finding.

## Completion / STOP

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-004
BRANCH = work/ink-web-ui-004
GATE = PANEL_CHAT_UI_POLISH_WORKS
FORMAT_VERSION = 4 / PRESERVED
PRODUCT_BASE_VERSION = v0.1 / PRESERVED
PORTABLE_WEB_PARITY = PASS
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
