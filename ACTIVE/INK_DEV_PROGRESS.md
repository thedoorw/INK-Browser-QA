# INK DEV PROGRESS

STATUS: `INK-CORE-INTEGRATION-004 / IMPLEMENTING`

| Field | Value |
|---|---|
| TASK_ID | `INK-CORE-INTEGRATION-004` |
| TITLE | `Grounded Creative Decision & Plan Bridge v0.1` |
| BRANCH | `work/ink-core-integration-004` |
| BRANCH_BASE | `d026cc4a48bc140b4d9aa713e8c96faac6aaea5e` |
| TASK_STATUS | `IMPLEMENTING` |
| CURRENT_PHASE | `PHASE_D / DETERMINISTIC_SOURCE_QA` |
| TARGET_GATE | `INK_CORE_INTEGRATION_004_SOURCE_READY` |
| AUTO_APPROVAL | `0 / PROHIBITED` |
| AUTO_EXECUTION | `0 / PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `0 / PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| RUNTIME_QA | `DEFERRED_TO_CENTRAL_RUNTIME_QUEUE` |

## Start sequence

```text
grounded decision contract
→ existing plan-authority bridge
→ user-governed boundary
→ deterministic/source QA
→ required report
→ DEV_HANDOFF
→ STOP
```

## Checkpoint 1 — grounded decision contract

Status: `GROUNDED_CREATIVE_DECISION_CONTRACT_DEFINED`

- added a bounded deterministic `INK-GROUNDED-CREATIVE-DECISION` envelope;
- preserves source request identity and grounded-context fingerprint;
- verifies cited tool call/result evidence against trusted Runtime results;
- retains explicit target references, rationale, assumptions, unresolved evidence and unsupported evidence;
- derives a deterministic decision fingerprint;
- accepts a plan candidate only for `PLAN_PROPOSAL` disposition;
- routes the candidate through the existing creative-plan validation and leaves it at `PROPOSED` with no approval token.

Commit: `9259407`

## Checkpoint 2 — existing authority and user boundary

Status:

```text
GROUNDED_PLAN_PROPOSAL_BRIDGE_WORKS
USER_GOVERNED_PLAN_BOUNDARY_PRESERVED
```

- grounded continuation may return the explicit decision envelope;
- only `PLAN_PROPOSAL` may carry a candidate;
- cited tool evidence must match Runtime-owned result envelopes;
- candidate targets must be a subset of grounded target references;
- source identity, target state, operation allowlist and dependency graph are validated by the existing creative-plan / bounded-edit path;
- the accepted candidate is registered only as `PROPOSED`;
- approval sequence remains unchanged and no approval token is created;
- no execution or Revision capture is invoked;
- the new browser-local module is included in the static service-worker source inventory.

Task-specific QA:

`qa/core-integration-004-grounded-plan-bridge.test.mjs`
