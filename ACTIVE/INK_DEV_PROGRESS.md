# INK DEV PROGRESS

STATUS: `INK-CORE-INTEGRATION-006 / MR_REVISE_AUTHORIZED`

## Task

- TASK_ID: `INK-CORE-INTEGRATION-006`
- TITLE: `Workstation Capability Exposure & UI-Function Mapping v0.1`
- BRANCH: `work/ink-core-integration-006`
- ORIGINAL_DEV_HANDOFF: `08a719c0f8bfe903944eba95f43265a247d3e3ec`
- ACCEPTED_PRODUCT_QA_CHECKPOINT: `c5c979104ce42df866f7a14f9a5b8ae646efd14e`
- TASK_STATUS: `MR_REVISE_AUTHORIZED`
- CURRENT_PHASE: `RUNTIME_HARNESS_CLOSURE`
- PRODUCT_WIRING: `ACCEPTED_PENDING_RUNTIME`
- PRODUCT_REWRITE: `0 EXPECTED`
- NEW_ENGINE_FEATURES: `0 / PROHIBITED`
- UI_PANEL_AUTHORITY: `SINGLE / PRESERVE`
- GITHUB_HOSTED_ACTIONS: `0 / PROHIBITED_FOR_THIS_REVISION`
- SELF_HOSTED_WINDOWS_RUNTIME: `MR_OWNED_AFTER_PROMOTION`
- TINYFISH_USED: `0 / PROHIBITED`
- FORMAT_VERSION: `4 / PRESERVE`

## Authorized delta

Only the smallest browser Runtime harness delta needed to verify Integration-006 workstation routes.

Required browser assertions:

1. Properties → grounded Document / Semantic readout.
2. Reference → Research → Creation advisory readout.
3. Compose → selected Repeat / Parametric status.
4. CHAT → Grounded Context / Creative Memory / Research advisory readouts.
5. Revision → Provenance + structural comparison.
6. Read-only / unavailable-state rendering.
7. Single primary-panel authority remains intact while navigating these routes.
8. Existing UI / Creative / Geometry Runtime regressions remain compatible.

## Harness rule

Prefer extending the existing authoritative browser harness consumed by:

`qa/runtime/run-ink-runtime-batch.mjs`

Do not:

- create a task-local GitHub Actions workflow;
- run GitHub-hosted Actions;
- create a second Runtime infrastructure path;
- rewrite accepted product behavior unless browser-harness construction reveals a real source defect;
- add new engine capability;
- alter panel hierarchy;
- change FORMAT_VERSION.

## DEV completion

DEV should finish with:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-006
REVISION_SCOPE = RUNTIME_HARNESS_CLOSURE
PRODUCT_WIRING_CHANGED = 0 unless real runtime defect fix is required and documented
GITHUB_ACTIONS_USED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
RUNTIME_HARNESS_READY = PASS
FORMAT_VERSION = 4
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

MR will perform exact-SHA review, clean promotion, then execute the authoritative self-hosted Windows Runtime.
