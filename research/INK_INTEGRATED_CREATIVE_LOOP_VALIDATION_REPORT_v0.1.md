# INK Integrated Creative Loop Validation Report v0.1

Task: `INK-CLOUD-013`  
Branch: `work/ink-cloud-013`  
Base main: `4de2a4324c318abebab6a3fb1dcd096b7d0ac78a`  
Gate: `INTEGRATED_CREATIVE_LOOP_VALIDATED`

## Result

The accepted INK creative-loop stages are validated as one deterministic,
browser-local structured workflow:

```text
Extract → editable Path → Edit → Expressive Stroke
→ Multi-Contour Compose → Repaint / Material
→ CHAT Review / approved mutation → Revision
```

The validation uses the existing extraction, Path, hierarchy, appearance,
History, file-envelope/storage, CHAT and Revision authorities. No second core
engine, remote runtime dependency, broad workspace feature or format change was
introduced.

## Deterministic integrated fixture

`qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs` builds two fixed
non-image contour inputs and exercises the full accepted chain. Two independent
runs produce the same final document fingerprint and the same Revision identity.

The fixture includes:

- deterministic contour extraction into compound editable Paths;
- anchor-level Path editing;
- geometry-independent expressive stroke;
- multiple sources, explicit duplicate identity and nested Frame composition;
- repaint and material attachment without geometry mutation;
- CHAT inspect → propose → approve → execute;
- before/after Revision capture and structured restore.

## Cross-stage invariants

Validated:

- object, subpath and anchor IDs remain stable;
- extraction provenance remains exact;
- Path geometry remains editable after composition, repaint, CHAT mutation and
  Revision restore;
- appearance-only changes do not change geometry fingerprints;
- nested composition parentage remains stable through Revision restore;
- a CHAT binding fails deterministically with `CHAT_EDIT_TARGET_STALE` after a
  same-Revision structural reparent;
- a CHAT binding fails deterministically with `CHAT_EDIT_STALE_REVISION` after
  the active Revision changes;
- Revision restore produces `RESET_TO_REVISION`, clears prior undo/redo, and
  the restored structured document immediately supports new History undo/redo.

## Save/load integrated closure

Native file-envelope integrity, JSON serialization, migration and document
inspection were exercised at:

1. Extract → Path;
2. composed/repainted document after CHAT mutation;
3. restored Revision state.

The second checkpoint also exercises the existing verified `InkStore`
browser-local persistence path. Identity, provenance, editable geometry,
hierarchy, appearance extensions and `FORMAT_VERSION = 4` remain intact.

## Bounded cross-stage fixes

Validation exposed one exporter defect. After removing an expressive stroke,
`vectorObjectToSVG()` passed an absent value to a normalizer whose default
argument created a default expressive style. The structured SVG therefore
retained expressive attributes even though the Path no longer had expressive
appearance.

The existing exporter was bounded-fixed to normalize only a present
`expressiveStroke`. No renderer, Path, document, History, Revision or CHAT
redesign was required.

Pre-existing regression assertions were narrowed to the actual accepted
contracts: migration-owned additive semantic metadata is checked separately,
canonical no-style states are compared consistently, and static source tests
inspect their intended module boundary rather than unrelated identifiers.

The hard fixture exposed one extraction-adapter boundary defect: ImageTracer
could emit degenerate contours with fewer than three distinct vertices, which
the authoritative editable-Path normalizer correctly rejects. The adapter now
filters those contours and remaps `holechildren` before SVG generation. This
does not change Path, document, History, Revision or CHAT authority.

## Hard rose-window benchmark

The canonical 1086 × 1448 RGB fixture was executed from
`qa/fixtures/rose-window/rose-window-primary.png` with SHA-256
`e0c8039f6a30b21ac87483cfacfaa1c7fa2b05d2be79596d1a3d3f765469b807`.

Machine-readable evidence is recorded in
`qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`.

| Measure | Direct Extraction | Structure-Aware Reconstruction |
|---|---:|---:|
| raster-proxy recall | `0.904256` | `0.031866` |
| raster-proxy precision | `0.932975` | `0.654303` |
| raster-proxy IoU | `0.849098` | `0.031339` |
| unique editable nodes | `9339` | `67` |
| effective expanded nodes | `9339` | `402` |
| deterministic rerun | PASS | PASS |
| exact provenance | PASS | PASS |

The structure-aware result is a deterministic sixfold linked Repeat and wins
regularity/editability density, but the current single-Path prototype boundary
retains only 3 subpaths from a 265-Path sector extraction. Its 3.19% recall is
not an acceptable hard-fixture result. Direct Extraction is selected as the
current baseline because it minimizes total correction cost at 90.43% recall,
despite its higher node-cleanup burden.

```text
HARD_BENCHMARK = EXECUTED
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA
```

## QA executed

Evidence:

`qa/core/evidence/INK_CLOUD_013_STATIC_CHECKS.txt`

`qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`

Results:

- accepted-stage + integrated unit regression: `48 PASS / 0 FAIL`;
- source/static/persistence contracts: `31 PASS / 0 FAIL`;
- Phase D materially affected extraction/integrated regression: `13 PASS / 0 FAIL`;
- deterministic hard benchmark: PASS;
- changed source and harness syntax: PASS;
- `git diff --check`: PASS;
- `FORMAT_VERSION = 4`: PASS;
- package mutation: `0`;
- main merge: `0`.

Browser runtime / external USER-path QA remains `DEFERRED` by Work Order.

## Acceptance gate

```text
INTEGRATED_LOOP = VALIDATED
CROSS_STAGE_IDENTITY = PRESERVED
PATH_EDITABILITY = PRESERVED
APPEARANCE_SEPARATION = PRESERVED
COMPOSITION = PRESERVED
CHAT_BINDING = VALIDATED
HISTORY_REVISION_BOUNDARY = VALIDATED
SAVE_LOAD = VALIDATED
HARD_BENCHMARK = EXECUTED
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
```

No Hard STOP condition was triggered.

## Checkpoints

- validation baseline: `e9130bfdc643a7854fd67fef006709f40312a8f0`
- Phase A: `6422f0f3adb7efe7fa70246e3c166d704120068a`
- Phase B: `e42a8ae16e0be1f95b4820b15588926ff43dd94b`
- Phase C: `b2736f612a9bc45830e369709410ba90591d42e4`
- Phase D: `d0a13660c51d9527542b37c3b2e3b6d2a93cc2fd`
- Phase E: `3786ee99b69c94eee37eb1e2f970d98ee9a70266`
- Phase D reopened benchmark execution: `0b610a5e68cde3951190088d9e5130dde8948564`

## Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-013
BRANCH = work/ink-cloud-013
GATE = INTEGRATED_CREATIVE_LOOP_VALIDATED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
