# INK Expressive Stroke Report v0.1

## Status

```text
TASK_ID = INK-CLOUD-008B
BRANCH = work/ink-cloud-008b
CANDIDATE_CODE_QA_HEAD = b3fb4ec0bed867ebae2010402b6fa9657fd0c356
GATE = EDITABLE_PATH_AND_STROKE_WORKS
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

## Objective completed

INK-CLOUD-008B extends the accepted editable Path core with geometry-independent expressive stroke appearance:

```text
authoritative editable Path Geometry
+
independent Expressive Stroke Appearance
```

The Path remains the authoritative geometry. Applying, replacing or removing expressive appearance does not create a replacement Path, generated outline, raster source object or second geometry model.

## Implemented contract

Path objects may carry an optional `expressiveStroke` appearance payload.

Contract:

- format: `INK-PATH-STROKE-APPEARANCE`;
- version: `1`;
- extension declaration: `ink.path-expressive-stroke.v1`;
- bounded profile samples: maximum `64`;
- bounded base width, opacity, pressure influence, taper and media values;
- deterministic profile normalization;
- deterministic natural-media approximation seed;
- explicit `ordinary-vector` fallback;
- no Path geometry, anchors, handles, topology or duplicate subpaths inside the appearance payload.

Existing `stroke` and `strokeWidth` remain on the Path as ordinary vector source/fallback state.

`FORMAT_VERSION` remains `4`.

## Style mutation and History route

`PathStrokeAppearanceController` provides:

- assign;
- replace;
- patch;
- remove;
- assign from an existing brush preset.

All style mutation uses the existing scoped `HistoryManager`.

Style-only mutation guards:

- stable Path ID;
- exact geometry fingerprint;
- stable metadata / extraction provenance;
- busy-History rejection;
- hidden/locked/unavailable target rejection;
- singular target rejection;
- no-op mutations create no History entry.

Geometry editing continues through the accepted `PathEditController`. Geometry edits after expressive assignment operate on the same Path object and preserve the appearance payload.

No second History engine was introduced.

## Rendering route

Expressive stroke rendering is integrated into the existing vector renderer.

Route:

```text
authoritative Path Bézier geometry
→ existing bounded flattening
→ deterministic per-segment appearance width/opacity evaluation
→ existing Canvas/vector render route
```

Properties:

- no authoritative Path-to-outline conversion;
- no rasterization of the source Path;
- no second renderer;
- geometry edits repaint from the same Path;
- ordinary vector stroke remains the deterministic fallback;
- spatial/hit bounds account for maximum expressive stroke width while geometric `pathBounds()` semantics remain unchanged.

The current renderer is intentionally a bounded deterministic vector approximation, not a claim of physical natural-media simulation.

## Existing brush/media reuse

The bridge reuses existing `BUILTIN_BRUSH_PRESETS`.

Mapped appearance inputs include:

- preset identity;
- engine;
- size / base width;
- opacity;
- pressure-size influence;
- flow;
- grain;
- wetness;
- bristle;
- edge softness;
- fixed seed;
- start/end taper overrides.

Unsupported brush/media behaviors are not silently treated as equivalent. They are listed in bridge diagnostics and degrade to the deterministic vector-approximation model with ordinary-vector fallback.

No parallel brush registry, generic preset marketplace or second brush engine was added.

## Bounded UI integration

Both existing shells expose Path stroke controls for a selected Path:

- existing brush preset;
- color;
- base width;
- start taper;
- end taper;
- apply/update;
- remove expressive appearance.

This is bounded inspector integration only. No broad UI redesign was started.

## Serialization and integrity

Document normalization and integrity inspection normalize/validate optional expressive stroke appearance.

The file envelope declares `ink.path-expressive-stroke.v1` when any Path requires the contract.

Authored regression coverage verifies:

- style persistence through save/load;
- stable Path ID;
- stable extraction provenance;
- stable Path geometry;
- `FORMAT_VERSION = 4`.

## Structured SVG behavior

Structured SVG export keeps the same authoritative Path `d`.

When expressive appearance exists, SVG export uses an explicit ordinary-vector fallback and records:

- expressive stroke format/version;
- `ordinary-vector` fallback marker;
- profile sample count.

Current limitation:

- variable profile/taper is not expanded into destructive outline geometry;
- natural-media grain/wetness/bristle/softness are not serialized as an equivalent SVG physical/media effect;
- exported SVG therefore represents a uniform ordinary-vector approximation of the expressive appearance;
- removing expressive appearance returns export to the original ordinary Path stroke/dash behavior.

This limitation is deliberate to preserve editable Path geometry and non-corrupting export.

## Phase E regression evidence

Added:

- `qa/core/tests/unit/expressive-stroke-core-v0.1.test.mjs`;
- `qa/core/tests/unit/expressive-stroke-source-v0.1.test.mjs`.

Coverage includes:

- same geometry under multiple stroke styles;
- geometry hash and Path `d` invariance for style-only changes;
- anchor editing after expressive assignment;
- independent style-only and geometry-only undo/redo;
- save/load roundtrip;
- extraction provenance retention;
- ordinary vector fallback;
- structured SVG behavior;
- busy-History / hidden / locked target rejection;
- bounded profile normalization;
- deterministic existing-brush bridge;
- shared renderer/History/document/shell/service-worker wiring.

## Checks executed

Executed against exact branch source:

- `FORMAT_VERSION = 4` — PASS;
- editor/controller/vector/document/file-envelope wiring — PASS;
- ordinary-vector fallback contract — PASS;
- structured SVG fallback metadata — PASS;
- service-worker inclusion — PASS;
- both web and standalone Path stroke control wiring — PASS;
- both newly authored regression files syntax parse — PASS.

Exact `stroke-appearance.js` pure-module execution:

- maximum 64 profile samples — PASS;
- normalized contract validation — PASS;
- geometry fingerprint unchanged by appearance mutation — PASS;
- deterministic brush bridge — PASS;
- ordinary-vector fallback marker — PASS.

Branch comparison at candidate code/QA checkpoint:

```text
HEAD = b3fb4ec0bed867ebae2010402b6fa9657fd0c356
AHEAD_OF_MAIN = 15
BEHIND_MAIN = 0
PACKAGE_MUTATION = 0
```

## Checks not executed

Not claimed as PASS:

- full repository Node regression execution against a live checkout;
- actual file-envelope integration test execution;
- browser pointer/UI interaction;
- runtime visual comparison of expressive styles;
- service-worker browser lifecycle;
- GPU/browser rendering behavior.

Reason:

```text
GITHUB_ACTIONS = QUOTA_EXHAUSTED
exact live repository checkout = unavailable in current DEV execution environment
RUNTIME_QA = DEFERRED
```

The committed regression tests are retained for MR/runtime execution.

## Browser/runtime debt

Deferred runtime QA should verify:

- inspector application/removal on real selected Paths;
- live geometry edit after style assignment;
- visual profile/taper continuity on curves;
- zoom/DPR behavior;
- hit/spatial bounds under large profiles;
- visual fallback for unsupported media properties;
- real save/reopen through the product shell;
- service-worker update/cache lifecycle.

No runtime verification is claimed in this report.

## Scope exclusions preserved

Not started:

- Multi-Contour Composition;
- Repaint / Material;
- CHAT mutation;
- rose-window benchmark execution;
- generic Cloud backend/auth/collaboration;
- package/single-file release;
- FORMAT_VERSION change;
- second vector/History/renderer/brush engine.

Explicit confirmation:

```text
COMPOSITION = NOT_STARTED
REPAINT_MATERIAL = NOT_STARTED
CHAT_MUTATION = NOT_STARTED
ROSE_WINDOW_BENCHMARK = NOT_RUN
```

## Acceptance gate assessment

Source/contract evidence supports:

```text
EXPRESSIVE_STROKE = IMPLEMENTED
PATH_GEOMETRY_SEPARATION = PRESERVED
PATH_EDIT_AFTER_STYLE = COVERED_BY_AUTHORED_REGRESSION
HISTORY = REUSED
SERIALIZATION = PRESERVED_BY_CONTRACT_AND_AUTHORED_REGRESSION
EXTRACTION_PROVENANCE = PRESERVED_BY_GUARDS_AND_AUTHORED_REGRESSION
ORDINARY_VECTOR_FALLBACK = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Full Phase-2 candidate gate:

`EDITABLE_PATH_AND_STROKE_WORKS`

## Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-008B
BRANCH = work/ink-cloud-008b
CANDIDATE_CODE_QA_HEAD = b3fb4ec0bed867ebae2010402b6fa9657fd0c356
GATE = EDITABLE_PATH_AND_STROKE_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
