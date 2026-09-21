# INK DEV PROGRESS

STATUS: `ACTIVE / PHASE_A_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-017` |
| TITLE | `Structure-Aware Reconstruction Multi-Path Closure v0.1` |
| BRANCH | `work/ink-cloud-017` |
| BASE_MAIN | `38ae99eb391eb70c7e9ebe35b69ce3fdb210a28e` |
| TASK_STATUS | `ACTIVE / PHASE_A_COMPLETE` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS` |
| DIRECT_EXTRACTION_BASELINE | `PRESERVE` |
| PIPELINE_SELECTION | `MR_DECISION_REQUIRED` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED` |

## Objective

Close the known Structure-Aware single-Path reconstruction bottleneck:

```text
sector extraction
→ complete multi-Path prototype set
→ existing Repeat / Transform
→ overlay QA
→ bounded local correction
→ hard-benchmark comparison
```

The authoritative scope and STOP rules are in:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Checkpoint rule

At every meaningful checkpoint:

- commit;
- update this branch-local file;
- record exact SHA when known from the preceding checkpoint;
- record files changed;
- record checks actually executed;
- record checks not executed;
- record benchmark/evidence deltas;
- stop on any Work Order Hard STOP condition.

Do not replace the Direct Extraction baseline during DEV execution.

## Phase A — Reconstruction contract audit

Status: `COMPLETE`

Branch was identical to main at task start:

```text
BASE_MAIN = 38ae99eb391eb70c7e9ebe35b69ce3fdb210a28e
AHEAD = 0
BEHIND = 0
```

Findings:

1. The hard benchmark collapses the sector from many Paths to one at
   `qa/core/tests/rose-window-hard-benchmark-v0.1.mjs` by sorting
   `prototype.paths` by node count and selecting only the largest Path.
2. `product/source/src/extraction/structure.js::reconstructRadial()` enforces
   `prototype.type === 'path'`, so the reconstruction contract itself also
   rejects a structured multi-Path source.
3. Existing `group` is the correct prototype-set owner. It preserves child
   Path structure and IDs and requires no new vector/document primitive.
4. Existing `createRepeat()` accepts and clones an arbitrary structured
   source. `expandRepeat()` recursively clones the source and remaps generated
   instance identities deterministically through existing repeat identity
   semantics.
5. Existing `vectorObjectToSVG()` already traverses Repeat → structured source
   and Group → children recursively.
6. Extraction provenance is already attached independently to every normalized
   Path by `executeExtraction()`; the prototype set can therefore preserve
   exact Path-level source/mask/adapter/parameter provenance without flattening.
7. Bounded compatibility gap found: the main workspace
   `product/source/src/ink.js` renderer/export traversal handles Group/Frame
   but does not directly traverse `repeat`. This is a bounded compatibility
   defect exposed by multi-Path reconstruction and may be fixed under Phase C.
8. No Hard STOP condition is present. Existing Group + Repeat + Transform can
   represent the prototype set without FORMAT_VERSION change, backend, package
   mutation, or a second vector/render authority.

Checks executed:

- exact branch/main topology comparison;
- source audit of extraction core, Structure-Aware reconstruction, Repeat
  identity, vector Group/Repeat expansion, SVG traversal, document integrity,
  workspace rendering/export traversal, benchmark and accepted reports.

Checks not yet executed:

- modified-module syntax/unit tests (no product mutation yet);
- serialization/export closure tests for multi-Path Repeat;
- canonical hard benchmark rerun;
- browser/runtime QA remains `DEFERRED`.

Benchmark delta: none in Phase A; INK-CLOUD-013 evidence remains the comparison
baseline.

## Planned phases

- Phase A — Reconstruction contract audit — `COMPLETE`
- Phase B — Multi-Path prototype-set reconstruction — `NEXT`
- Phase C — Structured output + local correction closure
- Phase D — Overlay QA + hard benchmark rerun
- Phase E — Comparative decision evidence
- Phase F — report + DEV handoff

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-017
BRANCH = work/ink-cloud-017
FINAL_HEAD = <exact SHA>
GATE = STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
