# INK DEV PROGRESS

STATUS: `INK-CLOUD-007 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-007` |
| TITLE | `Extraction Engine + Reference-to-Path Technical Prototype v0.1` |
| BRANCH | `work/ink-cloud-007` |
| DEV_HANDOFF | `READY` |
| MR_REVIEW | `REQUIRED` |
| DEVELOPMENT_ORDER | `ENGINE_FIRST / BENCHMARK_AFTER` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Extraction core and adapter contracts
2. Phase B — Direct extraction implementations
3. Phase C — Reference → editable INK Path vertical slice
4. Phase D — Reusable structure-aware extraction layer
5. Phase E — Hard rose-window benchmark — DEFERRED BY USER
6. Phase F — Selection report + DEV handoff

## Critical correction

The rose-window fixture is **not** a prerequisite for engine construction.

Do not wait on fixture intake, binary upload, external model download, or remote runtime when other bounded engineering work can continue.

Use deterministic/simple engineering fixtures first.

The user rose-window remains:

`CASE_A_PRIMARY / STRUCTURE_AWARE_HARD_REFERENCE`

but is consumed only after the generic extraction engine and Reference→Path slice are functional.

## Rules

- GitHub is SSOT.
- Re-read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization/engine checks.
- Never claim unexecuted tests as PASS.
- No main merge.
- No package update.
- No generic Cloud platform expansion.
- Missing hard benchmark binary is not a STOP.
- STOP only for FORMAT_VERSION change, accepted structural break, second core engine, or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A_ENGINE_CORE`

## Phase A — extraction core

Parent: `cddb59d541bbe2e2872cda570101727d0322a11d`.
Implemented request/result, RGBA/mask identity boundaries, contour hierarchy conversion, deterministic native Path IDs/provenance and cancellation/failure handling.
Engineering checks: `node --test qa/core/tests/unit/extraction-core-v0.1.test.mjs` (3 tests).
No benchmark-specific data in core. Canonical reference available locally for Phase E.
Runtime QA DEFERRED. Next: executable direct adapters.

## Phase B — executable direct adapter

Previous checkpoint: `533d8e4a86d1e4d440e6bdcec91652240837be1c`.
ImageTracerJS 1.2.6 licensed baseline converts deterministic raster/hole fixture into native Path.
OpenCV.js injected contour/hierarchy adapter and VTracer injected converter boundary added.
Actual engineering suite: 5 tests passed. OpenCV.js and VTracer execution pending dependency probe/benchmark.
No new rendering, transform or History engine.

## Phase C — Reference → editable Path vertical slice

Previous checkpoint: `b97cdd436eaa33a5aa3078e3384ea6dfbfc96ea0`.
Minimal controls installed through shared INK startup. Native image + Path objects
commit in one existing scoped History operation; no schema/renderer change.
Async stale-document / locked target / pending History / singular transform guards.
Bounded anchor correction delegates to native moveAnchor; overlay adjusts image opacity.
8 extraction engineering tests passed, including undo/redo, save/load migration,
InkStore memory fallback, SVG export and repeated import identity uniqueness.
Browser decode/Canvas/pointer/IndexedDB remain RUNTIME_QA_DEFERRED.

## Phase D — reusable structure evidence

Previous checkpoint: `f98257a00c179b14df30b23507abe48468771dc3`.
Generic center/ring/rotation evidence, explicit sector mask and native Repeat
reconstruction added. No reference-specific constants in product modules.
Fourfold engineering raster test passed through actual tracing → Repeat →
serialization/integrity. SAM remains optional mask input, inference NOT TESTED.
Accepted regression attempt exposed absent historical Git object needed by one
pre-task migration test; resolving source acquisition, not claiming that check PASS.


## User benchmark deferral

`HARD_BENCHMARK = DEFERRED_BY_USER_DECISION`

Do not execute Phase E in this task.

Remaining authorized work:

1. resolve or accurately record feasible regression evidence;
2. create `research/INK_EXTRACTION_PIPELINE_SELECTION_REPORT_v0.1.md`;
3. explicitly mark SAM/OpenCV/VTracer/rose-window items tested vs not tested;
4. record Runtime QA debt;
5. record exact final branch HEAD;
6. set `DEV_HANDOFF / MR_REVIEW_REQUIRED`;
7. STOP.

Do not begin Path Editing / Expressive Stroke inside INK-CLOUD-007.


## Phase F — selection report and DEV handoff

Created:

`research/INK_EXTRACTION_PIPELINE_SELECTION_REPORT_v0.1.md`

Closeout evidence:

- branch checkpoint suites recorded 5 core adapter tests, 3 workspace/History/serialization tests, and 1 structure-aware Repeat test as executed successfully;
- final closeout reran the Phase-A core subset: 3/3 PASS in a reconstructed Node environment using the exact branch extraction core module;
- final source syntax check: 5/5 extraction modules PASS;
- `FORMAT_VERSION = 4` confirmed from branch `product/source/src/config.js`;
- benchmark-specific token scan found no rose-window-specific product hardcoding;
- OpenCV.js runtime: `NOT TESTED`;
- VTracer runtime/WASM bridge: `NOT TESTED`;
- SAM-class inference: `NOT TESTED`;
- browser decode / Canvas / pointer / IndexedDB runtime: `NOT TESTED / RUNTIME_QA_DEFERRED`;
- historical migration/endurance regression closure: `BLOCKED / NOT TESTED` because the accepted regression attempt lacks the historical source/object closure required to reproduce it in the active environment;
- hard rose-window benchmark: `DEFERRED_BY_USER_DECISION`.

Current executable route:

`Reference → optional binary/source-bound mask → ImageTracerJS 1.2.6 → authoritative INK Path → existing History/serialization`

Structure-aware candidate route:

`radial evidence → sector mask/prototype → ImageTracerJS → native Repeat/Transform → overlay QA`

OpenCV.js and VTracer remain optional upgrade adapters pending executable browser/runtime evidence.

No Path Editing / Expressive Stroke, generic Cloud capability, package update, main merge, or FORMAT_VERSION change was performed.

### Handoff identity

Pre-handoff branch HEAD:

`f02677d59f779fe240f0d23df90579171340eea0`

The report/progress commit itself is the final branch HEAD. A Git commit cannot embed its own resolved SHA in its tracked content without changing that SHA; therefore MR must pin the exact resolved commit ID from the branch ref / DEV handoff response.

Final state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-007
BRANCH = work/ink-cloud-007
EXTRACTION_ENGINE = IMPLEMENTED
REFERENCE_TO_PATH = TECHNICAL_VERTICAL_SLICE_COMPLETE
HARD_BENCHMARK = DEFERRED_BY_USER_DECISION
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
