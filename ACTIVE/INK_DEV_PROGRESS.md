# INK DEV PROGRESS

STATUS: `INK-CORE-INTEGRATION-006 / DEV_HANDOFF / MR_REVIEW_REQUIRED`

## Task

- TASK_ID: `INK-CORE-INTEGRATION-006`
- TITLE: `Workstation Capability Exposure & UI-Function Mapping v0.1`
- BRANCH: `work/ink-core-integration-006`
- ORIGINAL_DEV_HANDOFF: `08a719c0f8bfe903944eba95f43265a247d3e3ec`
- ACCEPTED_PRODUCT_QA_CHECKPOINT: `c5c979104ce42df866f7a14f9a5b8ae646efd14e`
- MR_REVISION_BASELINE: `1c51a817dd3b472f97f5d8c558fadd5aa01ec0f5`
- RUNTIME_HARNESS_CHECKPOINT: `df28902a2b2c61626a4d5a11821f36561f305253`
- TASK_STATUS: `DEV_HANDOFF`
- CURRENT_PHASE: `HANDOFF / STOP`
- REVISION_SCOPE: `RUNTIME_HARNESS_CLOSURE`
- PRODUCT_WIRING_CHANGED: `0`
- PRODUCT_WIRING: `ACCEPTED / UNCHANGED`
- NEW_ENGINE_FEATURES: `0`
- UI_PANEL_AUTHORITY: `SINGLE / PRESERVED`
- GITHUB_ACTIONS_USED: `0`
- GITHUB_HOSTED_ACTIONS_USED: `0`
- SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV: `0`
- RUNTIME_HARNESS_READY: `PASS`
- WORKSTATION_CAPABILITY_RUNTIME_PASS: `PENDING_MR_SELF_HOSTED_WINDOWS_RUNTIME`
- TINYFISH_USED: `0`
- FORMAT_VERSION: `4 / PRESERVED`

## Authorized revision completed

Only the existing authoritative browser Runtime path was changed.

Changed Runtime QA files:

- `qa/runtime/ink-cloud-018-browser-harness.html`
- `qa/runtime/run-ink-runtime-batch.mjs`

Documentation / handoff:

- `research/INK_CORE_INTEGRATION_006_WORKSTATION_CAPABILITY_EXPOSURE_REPORT_v0.1.md`
- `ACTIVE/INK_DEV_PROGRESS.md`

Product source changed in this MR revision:

`NONE`

No changes to:

- `product/source/src/ai/install-ai.js`
- `product/source/src/editor/creative-workspace.js`
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/web-shell.js`
- Document / History / Revision / Geometry / Renderer authority
- `package/ink-current`
- `main`

## Runtime harness coverage added

The existing `creative` suite now enters the accepted workstation routes through `INK_WEB_SHELL.open(...)` and verifies:

1. Properties → explicit no-selection state.
2. Properties → grounded Document Bridge / Semantic selection readout.
3. Reference → Research → Creation read-only advisory.
4. Compose → explicit no-Repeat state.
5. Compose → selected accepted Repeat / Parametric Structure status.
6. CHAT → Grounded Context readout.
7. CHAT → Creative Memory read-only advisory.
8. CHAT → Research read-only advisory.
9. Revision → compare unavailable before a Revision exists.
10. Revision → selected Revision structural comparison.
11. Revision → provenance readout.
12. Read-only advisory actions leave Document + History + current Revision unchanged.
13. Properties remains Inspector authority; Reference / Compose / CHAT / Revision remain Creative Workspace authority.
14. Existing Creative browser flow remains in the same suite; UI / Creative / Geometry remain in the same authoritative batch.

The batch runner now requires these Integration-006 checks in `creativeRequired`, so missing capability-route evidence fails the authoritative Runtime batch.

## Checkpoint ledger

1. `19d66952deb8d0537ac720b60ea9da1e2b031f1e` — extend existing Creative browser harness with Integration-006 workstation route assertions.
2. `df28902a2b2c61626a4d5a11821f36561f305253` — require Integration-006 browser checks in the existing Runtime batch contract.
3. `31ef34f38a6ebb41e4623e940cfbd22759ea37f4` — update Integration-006 report with Runtime harness closure evidence.

## DEV closure verification

Against MR revision baseline `1c51a817dd3b472f97f5d8c558fadd5aa01ec0f5`:

```text
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
BATCH_RUNNER_SOURCE_SYNTAX = PASS
REQUIRED_CHECK_CONTRACT = PASS
ACTION_ENTRY_COVERAGE = PASS
AUTHORIZED_DELTA = qa/runtime harness + required handoff docs only
PRODUCT_WIRING_CHANGED = 0
NEW_ENGINE_FEATURES = 0
GITHUB_ACTIONS_USED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
RUNTIME_HARNESS_READY = PASS
FORMAT_VERSION = 4
```

The authoritative Windows Chrome/Edge Runtime is intentionally not claimed as executed or passed by DEV. MR must run the promoted exact SHA through `qa/runtime/run-ink-runtime-batch.mjs`.

## Gates at DEV handoff

- `WORKSTATION_CAPABILITY_MATRIX_COMPLETE = PASS`
- `CAPABILITY_PLACEMENT_APPROVED_BY_IMPLEMENTATION = PASS`
- `COMPLETED_CAPABILITIES_VISIBLE_AND_WIRED = PASS`
- `CHAT_UI_AUTHORITY_RELATIONSHIP_CORRECT = PASS`
- `WORKSTATION_HISTORY_REVISION_RELATIONSHIP_CORRECT = PASS`
- `WORKSTATION_WEB_PORTABLE_PARITY_PASS = PASS / ACCEPTED PRODUCT CONTRACT`
- `RUNTIME_HARNESS_READY = PASS`
- `WORKSTATION_CAPABILITY_RUNTIME_PASS = PENDING_MR_SELF_HOSTED_WINDOWS_RUNTIME`

## DEV completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-006
REVISION_SCOPE = RUNTIME_HARNESS_CLOSURE
PRODUCT_WIRING_CHANGED = 0
GITHUB_ACTIONS_USED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
RUNTIME_HARNESS_READY = PASS
FORMAT_VERSION = 4
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
