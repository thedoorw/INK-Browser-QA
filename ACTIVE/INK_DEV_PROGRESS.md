# INK DEV PROGRESS

STATUS: `CORE-MOD-003 / IN_PROGRESS`

| Field | Value |
|---|---|
| TASK_ID | `CORE-MOD-003` |
| TITLE | `Revision Provenance Module v0.1` |
| BRANCH | `work/ink-core-revision-provenance-003` |
| BRANCH_BASE | `c0adc842c1d1b52c8cdf74303e087704b0047caa` |
| TASK_STATUS | `AUTHORIZED / IN_PROGRESS` |
| CURRENT_PHASE | `PHASE_B / PURE_PROVENANCE_GRAPH` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `CORE_MOD_003_MODULE_READY` |
| UI_MUTATION | `0 / PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `0 / PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `0 / PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Phase A — provenance contract inventory

`PASS / REVISION_PROVENANCE_CONTRACT_DEFINED`

Authoritative evidence inventoried:

- file envelope: `fileId / revision / revisionId / integrity.fingerprint / savedAt`;
- Revision record: `revisionId / parentRevisionId / baseRevisionId / documentFingerprint / createdAt`;
- Revision comparison: before/after document fingerprints + added/changed/removed object IDs;
- History: label / forward+inverse patches / objectIds (read-only evidence only; no History rewrite);
- object metadata: `metadata.source`, `metadata.extraction`;
- semantic provenance: `sourceRecipeId / sourceStepId`;
- Recipe execution: `recipeId / executionId / states[].step/id/op/targetId / documentStateBefore / result.documentHash / replayDiff`;
- CHAT bounded edit: `proposalId / taskId / operation / revisionId / stateFingerprint / target stateFingerprint / result revision fingerprints`;
- AI plan: `planId / recipeDraft.recipeId / orderedSteps[].stepId`;
- semantic-region graph: source Object ref + extraction/source/Recipe provenance.

INK-owned normalized event contract:

```text
deterministic eventId (timestamp excluded)
kind
source entity
target entity
documentId
revisionId when available
parent/source event links when resolvable
operation / recipeId / stepId / proposalId / planId / executionId
objectIds
before / after fingerprints when available
timestamp = evidence only
status + unresolved reasons
evidence references
```

Graph contract:

```text
entities[]
events[]
edges[]
unresolved[]
conflicts[]
bounds
fingerprint
```

Rules:

- existing Revision / History remain authoritative;
- normalize explicit evidence only;
- no inferred/guessed lineage;
- missing internal links stay explicit under unresolved;
- duplicate equivalent evidence deduplicates;
- conflicting evidence keys remain explicit;
- deterministic identity/fingerprint excludes timestamp evidence.

## Planned phases

- Phase A — provenance contract inventory: `PASS`
- Phase B — pure provenance graph: `IN_PROGRESS`
- Phase C — read-only adapters: `PENDING`
- Phase D — deterministic evidence: `PENDING`

## Core rule

```text
normalize / trace / explain
not mutate / not restore / not replace Revision or History
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-003
BRANCH = work/ink-core-revision-provenance-003
FINAL_HEAD = <exact SHA>
GATE = CORE_MOD_003_MODULE_READY
UI_MUTATION = 0
REVISION_AUTHORITY_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
