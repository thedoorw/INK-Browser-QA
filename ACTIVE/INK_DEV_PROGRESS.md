# INK DEV PROGRESS

STATUS: `INK-CLOUD-009 / PHASE_E_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-009` |
| TITLE | `Multi-Contour Composition v0.1` |
| BRANCH | `work/ink-cloud-009` |
| BASE_MAIN | `8295d5a1f7edef51b0fb55587cbd31410bf151c0` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `MULTI_CONTOUR_COMPOSITION_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — multi-source identity contract
2. Phase B — composition selection + transforms
3. Phase C — hierarchy + z-order
4. Phase D — duplication
5. Phase E — integration / regression evidence
6. Phase F — report + DEV handoff

## Core rule

```text
Multiple editable Paths compose without flattening.
```

Reuse existing hierarchy, transform, History, Path Editing and Expressive Stroke contracts.

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-009`.
- Read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not begin Repaint/Material or CHAT mutation.
- Do not run rose-window benchmark.
- STOP for FORMAT_VERSION change, accepted contract break, second core engine, authoritative Path flattening, broad UI redesign or scope expansion.

## Start state

`PHASE_E_COMPLETE / BEGIN_PHASE_F`

## Checkpoint A — multi-source identity contract

Implementation checkpoint: `74e02f8c824700cd11f703b0b0bdabcdeab27b62`.

- Added shared `editor/composition.js` identity/provenance helpers and bounded diagnostics.
- Extraction source identity is read from existing `metadata.extraction`; native/source metadata remains non-destructive.
- Explicit composition clones receive fresh object/subpath/anchor identities while preserving original source provenance and recording duplicate lineage in metadata.
- Added module export and service-worker shell inclusion.
- No FORMAT_VERSION, package, main, Repaint/Material or CHAT mutation change.
- Executed checks: implementation source review against current GitHub branch. Node/static regression execution is scheduled for Phase E; not yet claimed PASS.

## Checkpoint B — composition selection + transforms

Implementation checkpoint: `6559c47843d108b23fd60922458a8615336f8a6c`.

- Multi-object move/scale/rotate continue to use the accepted matrix transform core; no second transform engine.
- Composition transform entry now rejects stale, locked, hidden and singular targets before mutation.
- Existing History command paths remain authoritative.

## Checkpoint C — hierarchy + z-order reuse

Evidence checkpoint: `270aa84bbd2e95bd76a72263ef47c5a72c400de1`.

- Group / Frame / reparent remain on existing document hierarchy.
- Front/back reorder remains the existing parent-array z-order command and remains History-backed.
- Branch blob SHAs for hierarchy and transform are identical to main.
- No hierarchy or z-order flattening was introduced.

## Checkpoint D — duplication with fresh identities

Implementation checkpoints:
- `74ab5fc3f8372f031e0897393c3c557d111c20f6`
- `6dd933e7a94ee39da7363045f0333699ab0e0d30`

Regression coverage:
- `8698d0b9aec2d820446cae37c539ca044417113f`
- `7115c5a4bf52795eabf6c370fce6c6f6c3a6389e`

- Existing duplicate routes now refresh Path object/subpath/anchor IDs.
- Extraction/source provenance and expressiveStroke are retained.
- Duplicate lineage records source object and immediate duplicated-from object.
- Layer duplication benefits from the same identity regeneration helper.
- Duplicate remains History-backed.

## Checkpoint E — integration / regression evidence

Evidence checkpoint: `270aa84bbd2e95bd76a72263ef47c5a72c400de1`.
Structured SVG integration checkpoint: `16913dadc6c755cb5464299cd5a8b040996ea1ef`.

Executed and PASS:
- committed-source syntax parse for new/touched modules and test files, except editor/index export-star syntax was verified directly;
- shared transform/hierarchy/Path Editing/Expressive Stroke/History/file-envelope/config/vector core blob SHA equality with main;
- exact committed composition helper identity/provenance/guard V8 unit harness;
- exact committed native file-envelope wrap/unwrap roundtrip harness;
- exact committed structured vector Path SVG harness;
- static source contract checks including FORMAT_VERSION=4, History reuse, no network/rasterization in composition, extraction identity, expressive fallback and service-worker wiring.

Not executed / not claimed PASS:
- full Node test runner: local execution environment could not resolve github.com while cloning the GitHub SSOT branch;
- Browser Runtime QA: DEFERRED;
- hosted Actions: not used;
- rose-window benchmark: prohibited and not run.

Evidence file: `qa/core/evidence/INK_CLOUD_009_STATIC_CHECKS.txt`.

