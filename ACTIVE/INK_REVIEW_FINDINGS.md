# INK REVIEW FINDINGS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-007`

REVIEWED_HEAD: `b006a3a7dadc5d261e3dda5b377f61ec13221ddb`

## Decision

`MR_PASS`

No blocking source/contract finding remains for the bounded engine-first scope.

## Findings

- Extraction is implemented as an adapter/input domain; authoritative geometry remains the existing INK Path model.
- The extraction core defines bounded raster/mask/vector contracts, deterministic provenance, geometry diagnostics, limits and cancellation/failure guards.
- ImageTracerJS 1.2.6 is the only direct vectorization runtime actually exercised in this task; OpenCV.js, VTracer and SAM remain explicitly unverified runtime candidates.
- Reference → editable Path uses the existing History engine and commits reference image + paths atomically.
- Undo/redo, save/load, migration, InkStore contract and structured SVG were exercised by recorded branch tests.
- Stale document, locked target, busy History and singular transform guards are present before mutation.
- Repeated extraction uses fresh object/node identities.
- Structure-aware support is reusable radial evidence + sector/prototype + native Repeat/Transform; no rose-window-specific constants were found in product source.
- The structure score is correctly treated as evidence only, not semantic recognition or benchmark proof.
- Existing vector, hierarchy, transform, History and renderer engines are reused; no parallel core engine was introduced.
- `FORMAT_VERSION = 4`; no format bump was introduced.
- No package mutation, main merge, generic Cloud backend, auth, collaboration, Compose/Repaint or Path Editing/Expressive Stroke implementation occurred.
- Hard rose-window benchmark is explicitly `DEFERRED_BY_USER_DECISION`; no quality winner is claimed.

## Non-blocking limitations / debt

- Browser file decode, Canvas/pointer behavior, visual overlay QA and IndexedDB runtime remain unverified.
- OpenCV.js executable contour route is NOT TESTED.
- VTracer browser/WASM bridge is NOT TESTED.
- SAM-class inference is NOT TESTED.
- ImageTracer baseline is luminance/binary-mask based and may be noisy on complex photographs.
- Structure-aware heuristics currently address radial repetition, not general semantic motif understanding.
- Historical migration/endurance regression closure is recorded BLOCKED / NOT TESTED in the active closeout environment.
- Formal rose-window direct-vs-structure-aware benchmark remains future work.

## Promotion condition

The DEV branch is diverged from current main. Do not directly merge `work/ink-cloud-007`.

If user authorizes promotion, create a bounded promotion branch from current main and copy only the reviewed product source, QA dependency/test files, and selection report corresponding to reviewed HEAD. Exclude stale branch-local Current Work Order / DEV progress state.

Main promotion is not automatic and requires user approval.
