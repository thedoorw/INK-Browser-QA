# INK DEV PROGRESS

STATUS: `INK-CORE-INTEGRATION-006 / DEV_HANDOFF / MR_REVIEW_REQUIRED`

## Task

- TASK_ID: `INK-CORE-INTEGRATION-006`
- TITLE: `Workstation Capability Exposure & UI-Function Mapping v0.1`
- BRANCH: `work/ink-core-integration-006`
- BRANCH_BASE: `d1ae24743e1be2067fe083674e133e9d0fc8d956`
- TASK_STATUS: `DEV_HANDOFF`
- CURRENT_PHASE: `HANDOFF / STOP`
- LATEST_VALIDATED_PRODUCT_QA_SHA: `c5c979104ce42df866f7a14f9a5b8ae646efd14e`
- UI_PANEL_AUTHORITY: `SINGLE / PRESERVED`
- NEW_ENGINE_FEATURES: `0`
- WEB_PORTABLE_PARITY: `PASS / SOURCE CONTRACT`
- TINYFISH_USED: `0`
- FORMAT_VERSION: `4 / PRESERVED`
- GITHUB_ACTIONS_USED: `0`
- RUNTIME_QA: `DEFERRED_TO_INTEGRATION_BATCH / USER_DIRECTIVE / NOT CLAIMED`

## Mandatory baseline read

- `README.md`
- `AGENTS.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/WORKING_STATUS.md`
- branch-local `ACTIVE/INK_DEV_PROGRESS.md`
- `ACTIVE/README.md`
- `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
- `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`

Supporting accepted evidence read:
- Core MOD-001…007 reports;
- Integration-005 report;
- UI-DEBT-001 report and QA;
- Foundation A vector geometry report;
- Portable/Web parity QA.

## Checkpoint ledger

1. `085bd25a7fd4ce720c19a5fb06290c8e5c0c6c7f` — authoritative UI × Capability matrix.
2. `a70f246053b26945a1a57e33a4c0d9d1467d5a2f` — workstation capability exposure implementation + focused QA.
3. `fc517653217c0387a0301e2255cb03f5e3881cb2` — corrected parity guard to established Web/Portable boot contract.
4. `c5c979104ce42df866f7a14f9a5b8ae646efd14e` — bounded Revision compare to accepted structural evidence only.

## Product / QA files changed

- `product/source/src/ai/install-ai.js`
- `product/source/src/editor/creative-workspace.js`
- `qa/core-integration-006-workstation-capability-exposure.test.mjs`

Research / handoff:
- `research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`
- `research/INK_CORE_INTEGRATION_006_WORKSTATION_CAPABILITY_EXPOSURE_REPORT_v0.1.md`
- `ACTIVE/INK_DEV_PROGRESS.md`

Not changed:
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/web-shell.js`
- Document schema;
- History authority;
- Revision authority;
- Geometry kernel;
- Renderer;
- package/ink-current;
- main.

## Implemented

- attached existing read-only Creative Memory and Research → Creation providers to the existing CHAT runtime;
- Properties selected-object grounded Document/Semantic readout;
- Reference Research → Creation advisory readout;
- Compose selected Repeat deterministic status;
- CHAT grounded Document/Semantic/Provenance + Creative Memory + Research advisory readouts;
- Revision provenance visibility;
- Revision current-vs-selected structural compare using existing `compare_visual_subjects`;
- explicit unavailability/read-only messaging;
- no new panel category and no duplicate mutation authority.

## Checks performed

Against `c5c979104ce42df866f7a14f9a5b8ae646efd14e`:

```text
STATIC_PANEL_AUTHORITY = PASS
READ_ONLY_BOUNDARY = PASS
STRUCTURAL_COMPARE_BOUNDARY = PASS
CHAT_TOOL_CONVERGENCE = PASS
WEB_PORTABLE_BOOT_PARITY = PASS
FORMAT_VERSION_4 = PASS
CHANGED_SOURCE_SYNTAX = PASS
GITHUB_ACTIONS_USED = 0
```

Focused QA file added:
- `qa/core-integration-006-workstation-capability-exposure.test.mjs`

Runtime:
- not executed;
- not represented as PASS;
- deferred by explicit user direction to the integration batch.

## Gates

- `WORKSTATION_CAPABILITY_MATRIX_COMPLETE = PASS`
- `CAPABILITY_PLACEMENT_APPROVED_BY_IMPLEMENTATION = PASS`
- `COMPLETED_CAPABILITIES_VISIBLE_AND_WIRED = PASS`
- `CHAT_UI_AUTHORITY_RELATIONSHIP_CORRECT = PASS`
- `WORKSTATION_HISTORY_REVISION_RELATIONSHIP_CORRECT = PASS`
- `WORKSTATION_WEB_PORTABLE_PARITY_PASS = PASS`
- `WORKSTATION_CAPABILITY_RUNTIME_PASS = DEFERRED_TO_INTEGRATION_BATCH / NOT CLAIMED`

## Known bounded gaps

- Foundation A cubic intersection/project/split/offset/fitting remains the accepted UI-neutral shared-core layer; no new direct command UI was invented.
- No standalone Variant store/browser was invented because no accepted authoritative workstation variant repository exists in this work order.
- Revision overlay/wipe/difference is not exposed because the accepted compare module does not execute a renderer for those modes.
- Runtime debt remains open for the integration batch.

## MR handoff requirements

MR should:
1. review the branch diff and the exact validated product/QA checkpoint;
2. pin final DEV branch HEAD in `working/WORKING_STATUS.md`;
3. record the deferred Runtime debt there before any promotion;
4. do not treat Runtime as verified until the integration batch passes.

```text
DEV_HANDOFF = YES
MR_REVIEW_REQUIRED = YES
MAIN_MERGE = NO
NEXT_WORK_ORDER = NOT AUTHORIZED
STOP
```
