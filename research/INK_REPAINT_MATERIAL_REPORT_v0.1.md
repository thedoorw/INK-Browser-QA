# INK Repaint + Material Report v0.1

Task: `INK-CLOUD-010`  
Branch: `work/ink-cloud-010`  
Gate: `REPAINT_MATERIAL_WORKS`  
Runtime QA: `DEFERRED`

## Result

Repaint + Material is implemented as a bounded appearance layer over the accepted editable Path and Multi-Contour Composition architecture.

The authoritative rule remains:

```text
Geometry / Composition != Paint / Material Appearance
```

Path geometry, object/node identity, transform, hierarchy, z-order, extraction/source provenance and expressive-stroke structure remain independent from repaint/material mutations.

No second Path, History, renderer or material engine was introduced.

## Appearance contract

A bounded Path material appearance contract is added:

`INK-PATH-MATERIAL-APPEARANCE / version 1`

It stores only appearance intent:

- material template reference;
- optional template version;
- bounded parameter overrides;
- deterministic ordinary-vector fill/stroke fallback.

It does not own or replace Path geometry.

The file-envelope extension is:

`ink.path-material-appearance.v1`

This allows native save/load declaration without changing `FORMAT_VERSION`.

## Repaint behavior

Path repaint supports bounded mutation of:

- fill;
- stroke;
- opacity;
- expressive-stroke color only when explicitly requested.

Ordinary fill/stroke repaint does not implicitly rewrite Expressive Stroke.

For multi-selection, each selected Path remains independently authoritative.

Deterministic no-op behavior is preserved: if normalized appearance state is unchanged, no History entry is created.

## Material behavior

Material assignment uses the existing document material library as the reference source.

For Path appearance, an existing template may expose bounded appearance data through:

`template.pathAppearance`

or:

`template.metadata.pathAppearance`

Supported Path material appearance keys in this v0.1 boundary are:

- `fill`;
- `stroke`.

Unsupported material/effect properties and parameter overrides are not used to mutate geometry or create a second rendering engine.

They are reported through bounded diagnostics and degrade to the explicit ordinary-vector fallback.

A missing/unavailable material template is therefore not destructive: the Path remains editable and renders through its stored fallback.

The existing geometry-generating material-template architecture remains intact and is not repurposed into authoritative Path geometry.

## Mutation + History

`PathRepaintMaterialController` reuses the accepted target-scoped History manager.

Pre-mutation guards reject:

- stale selections;
- locked targets;
- hidden targets;
- unexposed targets;
- singular transforms;
- busy History state.

Mutation invariants preserve:

- Path object ID;
- subpath/anchor topology through geometry fingerprint;
- transform;
- hierarchy parent;
- metadata/provenance.

No-op mutation returns without creating a History push.

Committed regression coverage also proves independent geometry-vs-appearance undo/redo ordering.

## Renderer integration

The existing Path render routes remain authoritative.

Canvas Path rendering now resolves appearance through the bounded Path appearance resolver.

The existing vector renderer uses the same resolver.

No Path flattening or raster replacement is introduced.

Expressive Stroke remains the authoritative stroke renderer when present.

Unsupported material effects degrade predictably to ordinary vector fill/stroke.

## Structured SVG

Structured SVG export remains a `<path>`.

For materialized Paths it records:

- `data-ink-material-ref`;
- `data-ink-material-version`;
- `data-ink-material-fallback="ordinary-vector"`.

Editable `d` geometry remains present.

Expressive-stroke fallback remains explicit and compatible.

No raster `<image>` fallback is added.

## Composition integration

Regression coverage includes at least three composed Paths with independent appearance operations:

- Path A: fill repaint;
- Path B: material assignment;
- Path C: stroke repaint.

The coverage records unchanged:

- path data / geometry fingerprints;
- transforms;
- hierarchy parent relation;
- z-order;
- provenance;
- Expressive Stroke.

Multi-selection repaint is also covered.

## Persistence

Native file-envelope persistence is reused.

`materialAppearance` survives wrap/inspect/unwrap and migration normalization.

The extension declaration is persisted in the envelope.

`FORMAT_VERSION` remains `4`.

A consistency correction ensures newly created Paths do not store an absent material as `materialAppearance: null`; the field is omitted until material appearance is actually assigned, matching load normalization.

## Evidence

Committed regression suites:

- `qa/core/tests/unit/repaint-material-composition-v0.1.test.mjs`
- `qa/core/tests/unit/repaint-material-core-v0.1.test.mjs`
- `qa/core/tests/unit/repaint-material-source-v0.1.test.mjs`

Executed source/static evidence:

- `qa/core/evidence/INK_CLOUD_010_STATIC_CHECKS.txt`

Executed PASS evidence includes:

- exact committed-source syntax/static parsing;
- appearance normalization/fallback harness;
- multi-Path repaint/material controller harness;
- deterministic no-op;
- expressive-stroke retention;
- locked and busy-History rejection;
- native file-envelope material-extension roundtrip harness;
- source architecture checks;
- post-fix `createPath()` material-state consistency harness.

The committed Node suites additionally encode hidden/stale/singular guards, independent History undo/redo, three-Path composition invariance and structured SVG behavior.

## QA limitations

Full Node test runner was not executed.

A direct exact-branch clone attempt failed before checkout because the execution environment could not resolve `github.com`.

Browser Runtime QA remains `DEFERRED` by the Current Work Order.

Hosted GitHub Actions were not used.

The rose-window benchmark was not run, as explicitly prohibited.

No unexecuted check is claimed PASS.

## Acceptance

```text
REPAINT = IMPLEMENTED
MATERIAL_APPEARANCE = IMPLEMENTED_WITH_BOUNDED_EXISTING_LIBRARY_REUSE
GEOMETRY_SEPARATION = PRESERVED
COMPOSITION = PRESERVED
EXPRESSIVE_STROKE = PRESERVED
PROVENANCE = PRESERVED
HISTORY = REUSED
SERIALIZATION = PRESERVED
SVG_EXPORT = PRESERVED_WITH_EXPLICIT_FALLBACK
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
GATE = REPAINT_MATERIAL_WORKS
```

## Scope boundaries

Not implemented or started:

- CHAT mutation;
- CHAT Review structured edit loop;
- Revision closure;
- rose-window benchmark;
- generic Cloud backend/auth/collaboration;
- broad UI redesign;
- package/single-file release;
- FORMAT_VERSION bump;
- second material/vector/History/renderer engine.
