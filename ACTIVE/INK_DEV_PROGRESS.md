# INK DEV PROGRESS

STATUS: `INK-CLOUD-013 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-013` |
| TITLE | `Integrated Creative Loop Validation v0.1` |
| BRANCH | `work/ink-cloud-013` |
| BASE_MAIN | `4de2a4324c318abebab6a3fb1dcd096b7d0ac78a` |
| DEV_HANDOFF | `READY` |
| MR_REVIEW | `REQUIRED` |
| GATE | `INTEGRATED_CREATIVE_LOOP_VALIDATED` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| START_HEAD | `9721e8b4a51f9642dfd4f4aea9eef02360446001` |
| LATEST_CHECKPOINT | `PHASE_D_REPORT_COMPLETE` |

## Authorized sequence

1. Phase A — integrated deterministic fixture
2. Phase B — cross-stage invariants
3. Phase C — save/load integrated closure
4. Phase D — rose-window hard integrated benchmark
5. Phase E — bounded fixes + regression
6. Phase F — report + DEV handoff

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-013`.
- Validation-first; bounded cross-stage fixes only.
- Do not add a broad new feature family.
- Preserve existing Path/document/History/Revision/CHAT authorities.
- Use deterministic non-image fixture for the integrated harness.
- Run rose-window hard benchmark only if the registered fixture is available.
- Fixture unavailable => record `HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE` and continue.
- Do not redesign workspace UI.
- Do not start multi-step CHAT planner/agent work.
- Do not update package.
- Do not merge main.
- Do not change FORMAT_VERSION without STOP.

## Start state

`DEV_IN_PROGRESS / PHASE_A`

## Required reads completed

- `README.md`
- `AGENTS.md`
- `ACTIVE/README.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/WORKING_STATUS.md`
- `ACTIVE/INK_DEV_PROGRESS.md`
- `ACTIVE/INK_DEV_NEW_WINDOW_START.md`
- `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
- `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
- `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
- `research/INK_REVISION_CLOSURE_REPORT_v0.1.md`
- `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`

## Validation-first baseline

Relevant accepted-stage unit suites were executed together before the integrated
harness was added.

```text
node --test \
  qa/core/tests/unit/extraction-core-v0.1.test.mjs \
  qa/core/tests/unit/extraction-structure-v0.1.test.mjs \
  qa/core/tests/unit/path-editing-core-v0.1.test.mjs \
  qa/core/tests/unit/expressive-stroke-core-v0.1.test.mjs \
  qa/core/tests/unit/multi-contour-composition-core-v0.1.test.mjs \
  qa/core/tests/unit/repaint-material-core-v0.1.test.mjs \
  qa/core/tests/unit/repaint-material-composition-v0.1.test.mjs \
  qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs \
  qa/core/tests/unit/revision-closure-core-v0.1.test.mjs \
  qa/core/tests/unit/revision-chat-binding-v0.1.test.mjs
```

Result: `39 PASS / 6 FAIL / 45 TOTAL`.

The six failures are pre-existing cross-suite contract assertions:

- four file-roundtrip assertions compare all metadata even though current
  migration adds the accepted semantic default `semanticLabel`;
- two History assertions expect an absent expressive-stroke property even
  though `createPath()` represents the initial no-style state as `null`.

No product source has been changed. Phase A will use contract-specific
identity/provenance assertions and will retain these baseline failures for
bounded Phase E reconciliation.

## Fixture intake checkpoint

The available user attachment is a horse ink painting, not the registered rose
window reference. Repository search found the benchmark specification but no
canonical rose-window binary. Phase D must therefore record:

`HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE`

## Phase A — integrated deterministic fixture

Checkpoint base: `e9130bfdc643a7854fd67fef006709f40312a8f0`

Added:

- `qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs`

The deterministic non-image contour fixture now traverses:

```text
Extract → editable Path → anchor Edit → Expressive Stroke
→ Multi-Contour Compose → Repaint / Material
→ CHAT proposal / approval / mutation → Revision
```

The fixture runs twice and proves equal final document and Revision
fingerprints. It does not require browser image decoding, a remote service, a
second document engine, or a second History/Revision authority.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.

## Phase B — cross-stage invariants

Checkpoint base: `6422f0f3adb7efe7fa70246e3c166d704120068a`

The integrated fixture now proves:

- extracted object, subpath and anchor IDs remain stable;
- extraction provenance remains exact;
- geometry remains editable after Stroke, nested Frame composition, Repaint,
  Material, CHAT mutation and Revision restore;
- geometry fingerprints do not change during appearance-only stages;
- nested composition parentage survives Revision restore;
- same-Revision CHAT target bindings reject a structural reparent with
  `CHAT_EDIT_TARGET_STALE`;
- cross-Revision CHAT bindings reject with `CHAT_EDIT_STALE_REVISION`;
- Revision restore clears existing undo/redo as `RESET_TO_REVISION` and the
  restored structured Path immediately supports new undo/redo edits.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.

## Phase C — save/load integrated closure

Checkpoint base: `e42a8ae16e0be1f95b4820b15588926ff43dd94b`

Validated three integrated persistence points:

1. immediately after Extract → Path;
2. after nested composition, Repaint / Material and CHAT mutation;
3. after Revision restore.

Each point exercises native file-envelope integrity, JSON serialization,
unwrap/migration and structural inspection. The after-CHAT point also exercises
the existing `InkStore` verified browser-local storage envelope and recovery
validation. IDs, extraction provenance, editable subpaths, nested composition,
appearance extensions and `FORMAT_VERSION = 4` remain intact.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.

## Phase D — rose-window hard integrated benchmark

Checkpoint base: `b2736f612a9bc45830e369709410ba90591d42e4`

Repository search found only:

- `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`

No canonical benchmark binary matching
`ChatGPT Image 2026年6月26日 上午06_44_33.png` is present.

The available external attachment was inspected and is not a rose window:

```text
file: 01-3-.jpg
type: JPEG / 1161 × 1650 / RGB
sha256: 313229c3336a77fbaf1907844c0e597fb7059ab03845dae51dc61e75649dcecf
content: horse ink painting
```

It was not copied into the repository or substituted for the registered hard
fixture.

`HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE`

Per Work Order this does not block Phase E/F or invalidate the deterministic
integrated harness.

## Phase E — bounded fixes + regression

Checkpoint base: `d0a13660c51d9527542b37c3b2e3b6d2a93cc2fd`

One integrated defect was confirmed and bounded-fixed:

- after expressive-stroke removal, `vectorObjectToSVG()` passed an absent
  `expressiveStroke` through a normalizer whose default parameter created a
  new default style; exported SVG therefore incorrectly retained expressive
  attributes. The existing exporter now normalizes only a present style.

No Path, document, History, Revision, CHAT, renderer or format authority was
replaced or redesigned.

Regression assertions were narrowed to the actual accepted contracts:

- migration-owned additive `semanticLabel` is checked separately while all
  pre-existing metadata/provenance remains exact;
- `null` and absent expressive style are treated as the same canonical
  no-style state;
- static source tests inspect the relevant normalization/controller boundary
  rather than unrelated helper identifiers elsewhere in the same module.

Executed relevant accepted-stage + integrated tests:

`48 PASS / 0 FAIL`

Executed source/static/persistence contract tests:

`31 PASS / 0 FAIL`

Additional checks:

- `node --check` changed product source and integrated harness: PASS;
- `FORMAT_VERSION = 4`: PASS;
- working diff under `package/`: `0`;
- browser runtime / external USER-path QA: `DEFERRED` by Work Order.

## Phase F — report + DEV handoff

Checkpoint base: `3786ee99b69c94eee37eb1e2f970d98ee9a70266`

Created:

- `research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md`
- `qa/core/evidence/INK_CLOUD_013_STATIC_CHECKS.txt`

## Changed files from task start

```text
ACTIVE/INK_DEV_PROGRESS.md
product/source/src/vector/vector-core.js
qa/core/evidence/INK_CLOUD_013_STATIC_CHECKS.txt
qa/core/tests/unit/expressive-stroke-core-v0.1.test.mjs
qa/core/tests/unit/expressive-stroke-source-v0.1.test.mjs
qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
qa/core/tests/unit/multi-contour-composition-core-v0.1.test.mjs
qa/core/tests/unit/multi-contour-composition-source-v0.1.test.mjs
qa/core/tests/unit/path-editing-core-v0.1.test.mjs
qa/core/tests/unit/repaint-material-core-v0.1.test.mjs
research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md
```

## Final handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-013
BRANCH = work/ink-cloud-013
GATE = INTEGRATED_CREATIVE_LOOP_VALIDATED
INTEGRATED_LOOP = VALIDATED
CROSS_STAGE_IDENTITY = PRESERVED
PATH_EDITABILITY = PRESERVED
APPEARANCE_SEPARATION = PRESERVED
COMPOSITION = PRESERVED
CHAT_BINDING = VALIDATED
HISTORY_REVISION_BOUNDARY = VALIDATED
SAVE_LOAD = VALIDATED
HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Phase D reopened — canonical fixture received

Canonical fixture:

`qa/fixtures/rose-window/rose-window-primary.png`

Blob SHA:

`0977531b94011300300bd69602c566fb58452522`

Previous state:

`HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE`

is superseded for this branch by:

`HARD_BENCHMARK = READY_TO_EXECUTE`

DEV must now:

1. execute only the deferred Phase D hard benchmark against this exact fixture;
2. compare Direct Extraction vs Structure-Aware Reconstruction using the existing benchmark criteria;
3. update Phase D evidence and `research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md`;
4. rerun only regressions materially affected by Phase D or any bounded fix;
5. return to `DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`.

Do not redo Phases A-C unless Phase D reveals a concrete cross-stage defect.
Do not start new feature work.

## Phase D hard benchmark executed

Canonical fixture validation:

```text
path: qa/fixtures/rose-window/rose-window-primary.png
sha256: e0c8039f6a30b21ac87483cfacfaa1c7fa2b05d2be79596d1a3d3f765469b807
dimensions: 1086 × 1448 RGB
```

Added the deterministic hard-benchmark runner and structured evidence:

- `qa/core/tests/rose-window-hard-benchmark-v0.1.mjs`
- `qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`

The benchmark uses the fixed main rose-window ROI `(543, 638), radius 466`,
binary luminance threshold `128`, and a 4 px evaluation grid. Counts that
would require semantic ground truth are explicitly reported as sampled-raster
proxies.

Pipeline comparison:

| Measure | Direct Extraction | Structure-Aware Reconstruction |
|---|---:|---:|
| raster-proxy recall | `0.904256` | `0.031866` |
| raster-proxy precision | `0.932975` | `0.654303` |
| raster-proxy IoU | `0.849098` | `0.031339` |
| unique editable nodes | `9339` | `67` |
| effective expanded nodes | `9339` | `402` |
| deterministic rerun | PASS | PASS |
| exact source provenance | PASS | PASS |

Structure evidence selected a sixfold candidate (`maskIoU = 0.317206`). The
native linked Repeat has exact generated symmetry and much lower unique-node
cost, but the accepted `reconstructRadial()` boundary retains only one Path
from a 265-Path prototype extraction. Its resulting completeness is therefore
insufficient for this fixture.

Decision:

`EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE`

`HARD_BENCHMARK = EXECUTED`

Validation-first execution exposed a bounded ImageTracer adapter defect:
degenerate real-image contours reached core normalization and failed the
closed editable-Path contract. The adapter now filters contours with fewer
than three distinct vertices and remaps `holechildren` before SVG generation.
No Path/document/History/Revision/CHAT authority or format changed.

Materially affected regression:

```text
extraction core + structure + workspace + integrated loop: 13 PASS / 0 FAIL
hard benchmark: PASS
node --check: PASS
git diff --check: PASS
package mutation: 0
FORMAT_VERSION: 4
```

## Phase D reopened — final handoff

Execution checkpoint synced to GitHub SSOT:

`0b610a5e68cde3951190088d9e5130dde8948564`

Final validation:

```text
benchmark evidence parity: PASS
hard benchmark: PASS
materially affected regression: 13 PASS / 0 FAIL
changed-source syntax: PASS
git diff --check: PASS
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
```

Final state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-013
BRANCH = work/ink-cloud-013
GATE = INTEGRATED_CREATIVE_LOOP_VALIDATED
HARD_BENCHMARK = EXECUTED
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
