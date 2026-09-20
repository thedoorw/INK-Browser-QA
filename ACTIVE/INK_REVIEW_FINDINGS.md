# INK REVIEW FINDINGS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-008B`

REVIEWED_HEAD: `4bb8fe665a1576b1c98c0629f324bb2040cddbbc`

CANDIDATE_CODE_QA_HEAD: `b3fb4ec0bed867ebae2010402b6fa9657fd0c356`

## Decision

`MR_PASS`

No blocking source/contract finding remains for the bounded Expressive Stroke scope.

## Findings

- Expressive appearance is stored as optional Path appearance data; Path geometry remains authoritative.
- Appearance payload is bounded/versioned and does not contain duplicate subpaths/anchors.
- Path ID, geometry fingerprint and metadata/extraction provenance are guarded during style-only mutations.
- Style assign/replace/patch/remove reuse existing scoped History.
- No-op appearance mutation does not create a History entry.
- Existing Path Editing remains independent from appearance; geometry edits operate on the same styled Path.
- Existing ordinary vector `stroke/strokeWidth` remain the deterministic fallback.
- Renderer integration evaluates appearance from the existing Path geometry; no replacement outline, raster source object or second renderer is introduced.
- Existing `BUILTIN_BRUSH_PRESETS` are reused through a bounded bridge; no parallel brush registry/engine is introduced.
- Unsupported media behaviors are disclosed as degraded vector approximation rather than silently treated as equivalent.
- Document normalization, integrity inspection and file-envelope extension declaration include the optional appearance contract.
- Structured SVG preserves Path `d` and records explicit ordinary-vector fallback metadata.
- `FORMAT_VERSION = 4`; no format bump was introduced.
- Composition, Repaint/Material, CHAT mutation and rose-window benchmark were not started.
- No package mutation or DEV main merge occurred.

## Non-blocking limitations / debt

- Full repository Node regression execution was not run in the DEV environment.
- Actual file-envelope integration test execution was not run in the DEV environment.
- Browser pointer/UI behavior, visual stroke fidelity, zoom/DPR behavior and service-worker lifecycle remain unverified.
- Current natural-media rendering is a bounded deterministic vector approximation, not physical-media equivalence.
- SVG export intentionally falls back to ordinary vector stroke rather than destructive profile outlining.

## Promotion

Per continuous-advance authorization, MR_PASS proceeds directly to clean promotion from current main.

Exclude branch-local:
- `ACTIVE/INK_DEV_PROGRESS.md`
- `working/WORKING_STATUS.md`
