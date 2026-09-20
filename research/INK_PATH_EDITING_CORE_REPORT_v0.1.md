# INK Path Editing Core Report v0.1

## Status

```text
TASK_ID = INK-CLOUD-008A
BRANCH = work/ink-cloud-008a
CANDIDATE_CODE_QA_HEAD = aa0d37a52753a2b3ea1a5a00b914a4753db0c37a
GATE = EDITABLE_PATH_CORE_WORKS
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED
```

## Scope completed

008A extends the accepted INK-CLOUD-007 chain from:

```text
Reference → Extract → authoritative editable INK Path
```

to:

```text
Reference → Extract → authoritative editable INK Path → direct Path Editing
```

No second vector engine, History engine, transform model, hierarchy model or document format was introduced.

## Implemented capabilities

### Path edit state

- enter / exit Path edit mode;
- select an existing authoritative Path by stable object identity;
- single and multiple anchor selection;
- incoming / outgoing Bézier handle selection;
- segment selection for topology insertion;
- guards for busy History, stale target, hidden/locked/non-exposed target and singular transform;
- selection-only operations do not mutate document geometry or create History entries.

### Anchor and handle editing

- move one or multiple anchors;
- local anchor reshape;
- move incoming or outgoing Bézier handles;
- corner / smooth / symmetric anchor modes;
- all direct geometry edits use existing vector primitives;
- all committed edits use existing History;
- Path object ID and metadata/provenance are invariant for ordinary edits.

### Topology editing

- add anchor on an existing segment using exact De Casteljau subdivision;
- delete anchors without replacing the Path object;
- closed paths protect a minimum of 3 anchors;
- open paths protect a minimum of 2 anchors;
- open / close subpath transitions with viability checks;
- outer / hole roles are validated and preserved;
- non-finite geometry is rejected.

### Simplify / refine

- deterministic bounded simplify for near-collinear low-handle nodes;
- explicit `tolerance`, `handleTolerance` and `maxPasses`;
- bounded refine by exact segment bisection;
- explicit `maxControlLength` and `maxAddedAnchors`;
- diagnostics report before/after node counts, removed/added node counts and truncation;
- no rasterization, flatten-to-pixels or benchmark-specific tuning.

### Existing-shell integration

- authoritative `type: 'path'` is rendered in the existing Renderer through existing vector-core `tracePath/pathBounds/flattenSubpath`;
- direct anchor / handle overlay;
- sampled screen-space segment hit-testing;
- pointer drag uses existing History begin/commit transaction;
- bounded Path edit inspector controls;
- controls mirrored in both web and standalone shells;
- new ESM module added to existing service-worker shell cache;
- architecture diagnostics include `path-editing-core`.

## Files changed

Product source:

- `product/source/src/editor/path-edit.js` — new Path editing domain/controller;
- `product/source/src/editor/index.js` — exports Path editing core;
- `product/source/src/ink.js` — installation, Path rendering, hit testing, direct manipulation, inspector wiring and diagnostics;
- `product/source/index.html` — bounded Path edit controls;
- `product/source/index-standalone.html` — matching bounded Path edit controls;
- `product/source/service-worker.js` — caches the new editor module.

QA:

- `qa/core/tests/unit/path-editing-core-v0.1.test.mjs`;
- `qa/core/tests/unit/path-editing-source-v0.1.test.mjs`.

Progress / report:

- `ACTIVE/INK_DEV_PROGRESS.md`;
- `research/INK_PATH_EDITING_CORE_REPORT_v0.1.md`.

## Regression coverage authored

`path-editing-core-v0.1.test.mjs` covers:

- selection-only state contract;
- busy / hidden / locked / singular / stale rejection;
- multi-anchor movement;
- handle editing and anchor modes;
- exact History undo / redo geometry;
- stable existing anchor IDs during local edits;
- exact cubic geometry across segment insertion;
- topology minimum guards;
- open / close state;
- compound outer / hole role preservation;
- extracted-path provenance preservation;
- bounded simplify / refine diagnostics;
- save / load envelope roundtrip;
- migration;
- document integrity;
- structured SVG;
- `FORMAT_VERSION === 4`.

`path-editing-source-v0.1.test.mjs` covers shared-source wiring, both shells, service-worker inclusion, History/vector reuse and absence of raster cleanup.

## Executed checks

Executed in the available DEV environment:

1. transformed ESM syntax parse:
   - `product/source/src/editor/path-edit.js` — PASS;
   - `product/source/src/ink.js` — PASS;
   - `path-editing-core-v0.1.test.mjs` — PASS;
   - `path-editing-source-v0.1.test.mjs` — PASS after runner-portable adjustment.

2. static contract checks — PASS:
   - `FORMAT_VERSION = 4`;
   - existing vector primitives reused;
   - existing scoped History reused;
   - stable Path identity / metadata guards present;
   - open / closed topology guards present;
   - simplify / refine bounds present;
   - no raster cleanup path;
   - Path renderer integration uses existing vector core;
   - direct node / handle interaction wired;
   - both HTML shells contain the complete Path edit control set;
   - service worker contains `src/editor/path-edit.js`;
   - no Expressive Stroke implementation introduced.

3. isolated Path-edit domain harness — PASS:
   - multi-anchor move;
   - exact undo / redo;
   - symmetric handle behavior;
   - segment insertion;
   - Path identity and extraction provenance preservation;
   - open-path minimum rejection;
   - simplify;
   - refine.

4. branch compare against authorized base `1c29d4e1eee2158678b5cc351b673717fdd5c15e` — PASS:
   - branch is ahead, not behind;
   - only authorized source / QA / progress files were changed at the candidate checkpoint;
   - no package files changed.

5. main HEAD check at the checkpoint:
   - `main = 1c29d4e1eee2158678b5cc351b673717fdd5c15e`;
   - no main merge performed.

## Not executed

The following are intentionally not claimed as PASS:

- full repository Node regression execution;
- real product file-envelope / migration execution;
- browser pointer interaction;
- runtime visual verification;
- service-worker browser lifecycle verification.

Reason: a live repository checkout/runtime is unavailable in this DEV environment and GitHub Actions quota is exhausted. Per Current Work Order these remain:

```text
NOT_EXECUTED
RUNTIME_QA = DEFERRED
```

The authored tests are the handoff evidence for later runtime execution.

## Known bounded limitations

- simplify intentionally removes only near-collinear anchors whose adjacent handles are below the explicit handle tolerance; it is not a general curve refitter;
- refine is bounded exact Bézier subdivision based on control-polygon length, not artistic smoothing;
- direct segment hit-testing uses a bounded screen-space sample for interaction selection only; authoritative geometry remains the original Bézier model;
- the bounded Canvas renderer addition covers ordinary Path fill/stroke needed for direct editing; advanced SVG-only appearance contracts remain outside 008A;
- runtime pointer behavior is source-verified but remains browser-QA debt until runtime execution is available.

## Scope exclusions preserved

Not started:

- Expressive Stroke / Brush-on-Path;
- brush-to-path conversion;
- pressure/tilt/taper WidthProfile;
- artistic stroke presets;
- rose-window benchmark execution;
- cloud sync/editor;
- collaboration;
- image generation;
- external plugin use;
- package promotion;
- main merge.

## Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-008A
BRANCH = work/ink-cloud-008a
GATE = EDITABLE_PATH_CORE_WORKS
EXPRESSIVE_STROKE = NOT_STARTED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
