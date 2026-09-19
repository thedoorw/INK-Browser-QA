# INK ↔ Penpot Core Capability Audit v0.1

STATUS: `COMPLETED — RESEARCH / NO RUNTIME CHANGE`

Date: 2026-09-19

Research branch: `research/INK-penpot-core-audit`

INK source baseline:
- Repo: `thedoorw/INK-Browser-QA`
- Branch source: `working/INK-v0.1-file-launch`
- Commit: `cf3600b2a71349ceea8064c3b46af98403beda55`

Penpot source baseline:
- Repo: `penpot/penpot`
- Branch: `develop`
- Commit: `b402637fe4c35a31eac4007356d3a750ba6187c8`
- License: MPL-2.0

## Purpose

Determine which parts of Penpot can materially help:

1. current INK drawing/editor core;
2. a future browser/cloud human + CHAT collaborative visual editor.

This audit is intentionally limited to reusable drawing/document concepts. It does **not** propose copying Penpot UI, product workflow, account system, multiplayer stack, deployment model, or full application architecture.

## Executive conclusion

INK already has a substantial usable drawing core. Penpot should **not** replace it.

The strongest Penpot contribution is as a mature reference implementation for areas where INK can be made more structured and CHAT-friendly:

1. semantic change operations;
2. normalized object/tree model;
3. richer geometry/transform primitives;
4. path editing edge cases and shape-to-path conversion;
5. SVG provenance and round-trip behavior.

Penpot's full renderer/application stack is not a good first reuse target for INK because the technical stack and product assumptions differ significantly.

Recommended strategy:

`Keep INK Core → add a narrow structured operation layer → selectively reimplement proven Penpot concepts in JavaScript → directly reuse Penpot code only when there is a clear advantage and MPL handling is explicit.`

---

## Capability matrix

| Area | INK current state | Penpot reference strength | Audit decision |
|---|---|---|---|
| Document / Object Model | Pages → layers → objects, stable IDs, groups, repeat objects, semantic metadata | Strong typed Shape model; stable object map/tree; parent-id, frame-id, shape IDs; per-type schemas | **Use concepts, do not replace INK model now. Add an object-graph adapter/view.** |
| Geometry | Basic bounds, containment/intersection, point/polygon math | Broad point/rect/matrix/shape geometry library | **High-value source for missing primitives and tests. Reimplement selectively in INK JS.** |
| Transform | 6-value affine Matrix; multiply/translate/scale/rotate/invert; object matrix transforms | Rich transform/inverse model, rotation/flip, propagation/modifier logic | **High-value improvement target; preserve INK matrix representation.** |
| Path / Vector | Editable anchors/handles, Bezier paths, Boolean, divide, offset, outline, SVG path parsing | Mature PathData, segment operations, subpaths, shape-to-path, geometry recalculation | **Compare operations gap-by-gap; do not replace vector-core wholesale.** |
| SVG | Import paths/basic shapes/groups/text, gradients, clip/mask, ID normalization; editable vector output | SVG→Shapes builder, svg-raw preservation/provenance, richer SVG model and export paths | **Adopt provenance/round-trip principles and tests; preserve INK implementation.** |
| Change Operations / History | Generic ID-aware document patches; scoped Undo/Redo | Explicit semantic changes: add/mod/del/move/reorder objects and pages | **Highest-value Penpot concept for CHAT collaboration. Add a semantic command layer above INK History.** |
| Renderer | Canvas2D/WebGL/natural-media capabilities already exist | Large ClojureScript + Rust/WASM render/export architecture | **Do not transplant. Use as correctness/reference material only.** |

---

## 1. Document / Object Model

### INK already has

Relevant source:

- `product/source/src/document/model.js`
- `product/source/src/core/stable-id.js`

Current INK document already includes:

- document ID;
- pages;
- layers;
- object IDs;
- groups and nested children;
- object matrices;
- vector objects;
- repeat/source/instance identity;
- semantic metadata;
- serialization-oriented plain data.

This is enough to remain the authoritative INK model.

### Penpot provides a useful second reference

Relevant Penpot source:

- `common/src/app/common/types/shape.cljc`
- `common/src/app/common/types/shape_tree.cljc`
- `common/src/app/common/types/objects_map.cljc`

Penpot's Shape model explicitly carries fields such as:

- `id`
- `type`
- `parent-id`
- `frame-id`
- `transform`
- `transform-inverse`
- geometry/selection rectangles
- type-specific path/text/image/group/frame data

Shape families include frame, group, bool, rect, path, text, circle, svg-raw and image.

### Gap relevant to CHAT

INK's nested page/layer/object structure is convenient for drawing, but CHAT/cloud operations benefit from a stable ID-indexed object graph.

Recommended addition is **not a document migration**.

Create a derived API such as:

```text
ObjectGraph
  get(id)
  parent(id)
  children(id)
  layer(id)
  descendants(id)
  resolveSelection(ids)
```

It can be rebuilt from the existing INK document and remain non-authoritative.

**Decision: RETAIN INK MODEL / ADD READ-WRITE GRAPH ADAPTER LATER.**

---

## 2. Geometry

### INK already has

Relevant source:

- `product/source/src/core/math.js`
- `product/source/src/core/geometry.js`
- `product/source/src/vector/vector-core.js`

Existing capabilities include:

- affine matrix math;
- matrix inversion;
- point transforms;
- polygon containment;
- point-to-segment distance;
- transformed bounds;
- bounding-box union/intersection/containment;
- Bezier flattening;
- path bounds;
- Boolean geometry.

### Penpot has a broader mature geometry layer

Relevant source:

- `common/src/app/common/geom/matrix.cljc`
- `common/src/app/common/geom/point.cljc`
- `common/src/app/common/geom/rect.cljc`
- `common/src/app/common/geom/shapes/*`
- `common/src/app/common/types/modifiers.cljc`

Useful concepts include:

- strongly separated Point / Rect / Matrix functions;
- transform-around-center logic;
- transform/inverse handling;
- geometry propagation through shape hierarchies;
- normalization and numerical precision helpers;
- richer vector utilities and shape bounds handling.

### Recommended use

Do **not** port the entire namespace.

Build a missing-function checklist against INK, then add only functions required by actual editor/CHAT operations.

Likely high-value candidates:

- decompose/recompose affine transform;
- robust transformed rectangle/selection geometry;
- parent→child / child→parent coordinate conversion;
- rotation/flip handling;
- geometry propagation for nested groups;
- consistent numerical precision/epsilon rules.

**Decision: HIGH-VALUE SELECTIVE REIMPLEMENTATION.**

---

## 3. Transform

INK currently stores the standard six-value affine matrix:

`[a, b, c, d, e, f]`

Relevant source:

- `product/source/src/core/math.js`
- `product/source/src/editor/transform.js`
- `product/source/src/vector/vector-core.js`

This is compatible in concept with Penpot's matrix model. There is no reason to replace the representation.

Penpot is useful mainly for the difficult behavior around transforms:

- parent/child propagation;
- inverse transforms;
- flipping;
- rotation;
- transform center;
- shape geometry update after transformation;
- modifier application.

For CHAT, this matters because instructions such as:

`rotate object A 15° around its own center`

must have one deterministic interpretation independent of UI.

**Decision: KEEP INK MATRIX; IMPROVE TRANSFORM SEMANTICS USING PENPOT AS REFERENCE.**

---

## 4. Path / Vector

### INK is already stronger than expected

Relevant source:

- `product/source/src/vector/vector-core.js`

INK currently contains substantial editable-vector functionality:

- anchors with stable IDs;
- incoming/outgoing Bezier handles;
- corner/smooth/symmetric modes;
- subpaths and holes;
- path bounds;
- Bezier flattening;
- Boolean union/difference/intersection/xor;
- divide;
- offset;
- stroke outline;
- transform/bake transform;
- Pen path session;
- align/distribute;
- SVG path parsing;
- SVG shape import;
- editable output after Boolean/refit.

This means Penpot should **not** become the new vector engine.

### Penpot areas worth benchmarking

Relevant source:

- `common/src/app/common/types/path.cljc`
- `common/src/app/common/types/path/*`
- `common/src/app/common/types/path/shape_to_path.cljc`

Penpot has mature handling for:

- PathData;
- segment-level selection;
- node/handle helpers;
- open/close/merge subpaths;
- shape-to-path conversion;
- path geometry recalculation;
- reversing/splicing/extracting path content;
- many editing edge cases.

### Recommended audit continuation

Create a function-level gap matrix rather than migrate the subsystem.

Candidate functions to compare next:

- split segment;
- join endpoints/subpaths;
- reverse path;
- convert rect/circle/text-outline-like geometry to path where applicable;
- node/segment selection semantics;
- handle continuity edge cases;
- malformed/degenerate path behavior.

**Decision: INK VECTOR CORE REMAINS AUTHORITATIVE; PENPOT = EDGE-CASE/TEST REFERENCE.**

---

## 5. SVG

### INK current capability

`product/source/src/vector/vector-core.js` already handles substantial SVG input:

- path;
- rect;
- line;
- polyline;
- polygon;
- circle;
- ellipse;
- groups;
- use references;
- transforms;
- gradients;
- masks;
- clip paths;
- text;
- ID normalization.

### Penpot capability relevant to us

Relevant source:

- `common/src/app/common/files/shapes_builder.cljc`
- `common/src/app/common/types/shape.cljc`
- Penpot SVG rendering/export code under `frontend/`, `exporter/` and `render-wasm/`

One particularly useful Penpot principle is preserving imported SVG provenance/raw information instead of forcing every unsupported SVG detail to disappear.

Penpot's `svg-raw` shape exists specifically to retain SVG structures that do not map cleanly to ordinary design primitives.

### Recommendation

INK should eventually distinguish:

```text
editable-native
editable-with-loss
preserved-raw
unsupported
```

for imported SVG content.

This is more useful to CHAT than silently flattening/ignoring unsupported input, because CHAT can state exactly what is editable.

Also adopt a round-trip test corpus:

`SVG import → INK structure → SVG export → compare structure/render`

**Decision: ADOPT PROVENANCE + ROUND-TRIP TEST STRATEGY, NOT PENPOT EXPORT STACK.**

---

## 6. Semantic Change Operations — highest value for CHAT

### INK today

Relevant source:

- `product/source/src/history/diff.js`
- `product/source/src/history/history.js`

INK already has a capable generic history system:

- set/delete patches;
- ID-aware array insert/delete/move;
- inverse patches;
- scoped capture;
- Undo/Redo;
- timeline;
- in-place document patching.

This is good as an internal History mechanism.

### Penpot's important architectural idea

Relevant source:

- `common/src/app/common/files/changes.cljc`
- `common/src/app/common/files/changes_builder.cljc`

Penpot defines semantic operations such as:

- `:add-obj`
- `:mod-obj`
- `:del-obj`
- move/reorder object operations
- add/move/delete page operations

A modification can contain explicit property operations instead of an opaque snapshot change.

### Why this matters to CHAT

CHAT should not need to emit raw JSON paths such as:

```text
pages[0].layers[2].objects[7].matrix[4] = 312
```

That is fragile.

CHAT should issue:

```json
{
  "op": "move",
  "targets": ["object_123"],
  "dx": 20,
  "dy": 0
}
```

or:

```json
{
  "op": "set-style",
  "targets": ["object_123"],
  "fill": "#E8C55A"
}
```

The command layer resolves stable IDs, validates intent, applies the change, and then the existing INK History records the resulting patch.

Recommended architecture:

```text
CHAT / human command
        ↓
INK Semantic Operation Layer
        ↓
validate targets + parameters
        ↓
INK Document mutation
        ↓
existing History patch pair
        ↓
render / undo / redo
```

This gives CHAT a stable API without replacing the current History system.

### Initial command vocabulary

A minimal first vocabulary can be:

- `create`
- `delete`
- `duplicate`
- `move`
- `resize`
- `rotate`
- `set-style`
- `set-opacity`
- `reorder`
- `group`
- `ungroup`
- `align`
- `distribute`
- `edit-path`

This is the single most useful Penpot-derived architectural improvement for the future collaborative editor.

**Decision: P0 FUTURE CORE — ADD ABOVE HISTORY, DO NOT REPLACE HISTORY.**

---

## 7. Renderer

INK already has rendering paths under:

- `product/source/src/render/`

including Canvas2D, WebGL and natural-media work.

Modern Penpot also contains a substantial Rust/WASM rendering/export layer under `render-wasm/`, in addition to its Clojure/ClojureScript application code.

Direct reuse would introduce:

- a second runtime/toolchain;
- Rust/WASM build requirements;
- a much larger architecture;
- assumptions that do not match INK's current personal-tool-first scope.

Therefore Penpot's renderer should currently be treated as:

- correctness reference;
- algorithm reference;
- export behavior reference;
- test-case source.

**Decision: DO NOT IMPORT PENPOT RENDERER INTO INK.**

---

## Recommended order

### P0 — CHAT Semantic Operation Layer

Highest leverage for the future human + CHAT editor.

No UI dependency.

No Penpot code copy required.

### P1 — Geometry / Transform gap audit

Add only concrete missing primitives required by editing operations.

### P1 — ObjectGraph adapter

Stable ID-based navigation over the existing INK document.

Do not migrate the document format yet.

### P1/P2 — Path operation gap audit

Benchmark INK against Penpot path operations and add only missing useful capabilities.

### P2 — SVG provenance / round-trip QA

Preserve unsupported SVG structures explicitly and build repeatable import/export tests.

### HOLD — Penpot renderer / full application architecture

No current reason to import.

---

## Licensing boundary

Penpot repository is MPL-2.0.

For this project, the default approach should be:

1. use Penpot to understand data models, algorithms, edge cases and tests;
2. implement INK-native JavaScript modules in INK's own architecture;
3. if any Penpot source is copied or modified directly, keep that code isolated and retain the required MPL source/header/license obligations for those files.

This audit is not legal advice; it is an engineering boundary to prevent accidental license mixing.

---

## Final architecture implication

The future collaborative platform does not need a Figma/Penpot-style user experience.

The useful architecture is:

```text
                 Human
                   │
            simple editor UI
                   │
                   ▼
┌────────────────────────────────────┐
│             INK Core               │
│ Document / Vector / Geometry       │
│ Transform / History / Renderer     │
└────────────────────────────────────┘
                   ▲
                   │
       Semantic Operation Layer
                   ▲
                   │
                 CHAT
```

GitHub/cloud storage/versioning can sit around this core later.

The central requirement is:

**Every editable object must be addressable by stable identity, and every CHAT change should be expressible as a bounded semantic operation.**

Penpot's strongest contribution is helping validate and mature that core, not becoming the product itself.

---

## Source references inspected

### INK

- `product/source/src/document/model.js`
- `product/source/src/core/math.js`
- `product/source/src/core/geometry.js`
- `product/source/src/core/stable-id.js`
- `product/source/src/editor/selection.js`
- `product/source/src/editor/transform.js`
- `product/source/src/history/diff.js`
- `product/source/src/history/history.js`
- `product/source/src/vector/vector-core.js`

### Penpot

- `common/src/app/common/types/shape.cljc`
- `common/src/app/common/geom/matrix.cljc`
- `common/src/app/common/geom/point.cljc`
- `common/src/app/common/types/path.cljc`
- `common/src/app/common/types/path/shape_to_path.cljc`
- `common/src/app/common/files/changes.cljc`
- `common/src/app/common/files/changes_builder.cljc`
- `common/src/app/common/files/shapes_builder.cljc`
- `render-wasm/src/shapes/*`
- `render-wasm/src/render/svg/*`

No INK Runtime product file was modified by this audit.
