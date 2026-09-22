# INK DEV PROGRESS

STATUS: `CORE-MOD-002 / IN_PROGRESS`

| Field | Value |
|---|---|
| TASK_ID | `CORE-MOD-002` |
| TITLE | `Semantic Region Grounding Module v0.1` |
| BRANCH | `work/ink-core-semantic-region-002` |
| BRANCH_BASE | `9a5d17c37934f367b1a2e7d4d6ed6f21f55a3ea3` |
| TASK_STATUS | `AUTHORIZED / IN_PROGRESS` |
| CURRENT_PHASE | `PHASE_B / PURE_GROUNDING_MODULE` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `CORE_MOD_002_MODULE_READY` |
| UI_MUTATION | `0 / PROHIBITED` |
| SELECTION_AUTHORITY_CHANGE | `0 / PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Phase A — contract inventory

`PASS / SEMANTIC_REGION_CONTRACT_DEFINED`

Existing authority reused:

- Path / subpath identity and geometry remain authoritative.
- nested world transforms come from existing hierarchy traversal.
- bounds / area / centroid reuse existing vector `pathMetrics`.
- containment/intersection/overlap classification reuses existing vector Boolean geometry and Geometry Kernel intersection calculations.
- existing semantic model / relationship graph remains semantic evidence.
- selection authority is not read as geometry authority and is not replaced.
- Document / History / Revision remain unchanged.

Output contract:

```text
INK Document active Page
→ authoritative closed Path subpaths
→ deterministic semantic-region descriptors
   - regionId
   - source Page / Layer / Object / subpath identity
   - outer / hole / island role
   - boundary fingerprint
   - bounds / area / centroid
   - object semantic role / confidence
   - provenance
→ deterministic relation graph
   - contains / inside
   - intersects / overlaps
   - adjacency / crossing / gap / bridge only from explicit supported evidence
   - unresolved evidence retained explicitly
→ stable graph fingerprint
```

No new Path representation, no second geometry engine, no selection mutation.

## Planned phases

- Phase A — contract inventory: `PASS`
- Phase B — pure grounding module: `IN_PROGRESS`
- Phase C — bridge boundary: `PENDING`
- Phase D — deterministic evidence: `PENDING`

## Core rule

```text
ground / classify / relate
not select / not mutate / not invent geometry
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-002
BRANCH = work/ink-core-semantic-region-002
FINAL_HEAD = <exact SHA>
GATE = CORE_MOD_002_MODULE_READY
UI_MUTATION = 0
SELECTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
