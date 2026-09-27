# INK P1-C Vector / Text / Precision Layout — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-C-VECTOR-TEXT-PRECISION-LAYOUT-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-c-vector-text-precision-layout-001`

BASELINE_MAIN: `c35b81a81845b65dfd462e7d225a192d3393f135`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`

UPSTREAM:
- P1-A = promoted
- P1-B = promoted

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Implement UI-neutral Core capability for:

1. Skew
2. Distort
3. Perspective
4. Warp
5. Paragraph Type
6. Vertical Type
7. Text on Path
8. Gradient Fill
9. Pattern Fill
10. Persistent ruler guides
11. Equal-distance smart snapping
12. Ruler / measurement

No final UI wiring is authorized.

## 2. Authority rule

P1-C must extend existing authorities rather than create parallel systems:

- Transform authority: `product/source/src/editor/transform.js`
- Text authority: `product/source/src/editor/text-object.js`
- Layout authority: `product/source/src/document/layout.js`
- Vector appearance authority: `product/source/src/vector/paint-appearance.js`
- Core geometry/math authority under `product/source/src/core/`

No second Transform, Text, Layout, Path or appearance authority.

## 3. Allowed source boundary

DEV may add bounded helper modules:

- `product/source/src/editor/transform-advanced.js`
- `product/source/src/editor/text-layout.js`
- `product/source/src/editor/precision-layout.js`
- `product/source/src/vector/fill-appearance.js`
- `qa/ink-p1-c-vector-text-precision-layout.test.mjs`

DEV may modify only if strictly required for shared exports / compatibility:

- `product/source/src/editor/transform.js`
- `product/source/src/editor/text-object.js`
- `product/source/src/document/layout.js`
- `product/source/src/vector/paint-appearance.js`
- existing Core geometry/math module used by current authority

Any mutation of:
- document serialization/migration;
- History;
- Renderer;
- `ink.js`;
- `studio-core.js`;
- CHAT;
- Recipe;
requires STOP → MR before change.

Branch-local progress:
- `ACTIVE/INK_DEV_PROGRESS.md`

## 4. Transform contracts

### Skew

Required:
- deterministic affine skew in X and/or Y;
- pivot support;
- finite-matrix validation;
- compatible with current matrix authority;
- no direct document mutation.

### Distort

Required:
- four-corner source quad → destination quad mapping;
- deterministic point mapping;
- finite/bounded geometry;
- explicit rejection of degenerate input.

A reusable homography/projective primitive may be shared with Perspective.

### Perspective

Required:
- projective transform / homography;
- forward mapping for points;
- invertibility check where inverse requested;
- deterministic behavior on known fixtures;
- reject singular/degenerate transforms.

### Warp

Required:
- bounded deterministic deformation function over normalized coordinates;
- minimum one practical parametric mode (e.g. arc/bend or mesh-like 2D displacement);
- identity at zero strength;
- finite outputs and explicit bounds.

Do not duplicate current reversible deformation authority; reuse it where applicable.

## 5. Text contracts

### Paragraph Type

Required:
- bounded text box width/height;
- deterministic line wrapping;
- line height;
- horizontal alignment at minimum left/center/right;
- stable line layout metrics independent of UI;
- no renderer ownership.

### Vertical Type

Required:
- explicit vertical writing direction/state;
- deterministic glyph/character advance plan;
- preserve existing Text object authority;
- no second text-object model.

### Text on Path

Required:
- input text + editable Path geometry;
- deterministic distance-along-path placement plan;
- start offset;
- orientation/tangent per character/run;
- bounded handling for text longer than path;
- does not flatten or destroy source Path.

P1-C may return layout plans rather than final rendered glyphs.

## 6. Fill appearance contracts

### Gradient Fill

Required:
- vector/path appearance descriptor;
- linear + radial minimum;
- 2+ stops;
- stop offset/color/opacity normalization;
- deterministic descriptor resolution;
- ordinary solid fill remains supported.

Do not duplicate P1-A raster-gradient pixel engine; P1-C owns vector appearance metadata only.

### Pattern Fill

Required:
- reusable pattern descriptor/reference;
- origin;
- scale;
- rotation;
- repeat/tile mode;
- deterministic normalization;
- fallback behavior if pattern reference is unavailable.

Do not create a second Material system.

## 7. Precision-layout contracts

### Persistent ruler guides

Required:
- horizontal/vertical guide descriptor;
- position;
- stable ID;
- locked/visible state where useful;
- add/remove/move pure state operations;
- deterministic normalization;
- persistence-ready data shape, but save/load wiring is deferred to integration.

### Equal-distance smart snapping

Required:
- input moving bounds + peer bounds;
- detect equal-gap opportunities on X/Y;
- tolerance;
- return proposed snap delta + evidence;
- deterministic tie-breaking;
- no direct object mutation.

Must extend current snapping concept, not replace it.

### Ruler / measurement

Required:
- point-to-point distance;
- delta X/Y;
- angle;
- bounds width/height where applicable;
- deterministic numeric output;
- no UI units panel required at MODULE_READY.

## 8. Explicit prohibitions

- no final UI;
- no History/save-load integration;
- no Renderer changes;
- no font-engine/glyph-shaping expansion beyond scoped layout plans;
- no advanced OpenType/glyph typography;
- no Puppet Warp;
- no P1-D/E/F/G/H;
- no CHAT/Recipe expansion;
- no FORMAT_VERSION change;
- no Runtime.

## 9. Focused QA required

At minimum:

### Transform
- skew X and Y known fixtures;
- pivot behavior;
- projective quad mapping exact corner assertions;
- perspective singular/degenerate rejection;
- warp identity at zero;
- warp deterministic non-zero fixture;
- finite-output guard.

### Text
- paragraph wrap known fixture;
- paragraph alignment;
- vertical advance/order;
- Text object compatibility;
- text-on-path start offset;
- tangent/orientation;
- overflow/too-long behavior;
- source Path remains immutable.

### Fill appearance
- linear gradient descriptor normalization;
- radial descriptor;
- 3-stop order/opacity;
- pattern origin/scale/rotation;
- unavailable-pattern fallback contract;
- ordinary solid fill unaffected.

### Precision
- add/move/remove persistent guide;
- horizontal and vertical guide normalization;
- equal-distance snap X;
- equal-distance snap Y;
- tolerance miss;
- deterministic tie-break;
- measurement distance/delta/angle;
- identical input determinism;
- invalid input predictable failure;
- Node import/parse.

Required result:

```text
P1_C_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

Where P1-C imports an existing authority, final focused QA must use the actual promoted/current module, not API-compatible stubs.

## 10. MODULE_READY boundary

At MODULE_READY:
- all 12 scoped capabilities exist at Core/data-contract level;
- focused QA passes;
- no document integration/History/save-load/UI/Renderer is required;
- no Runtime is run.

Formal integration remains deferred until P1 A-H are all ready.

## 11. DEV handoff

Report:
- exact branch HEAD;
- implementation commit(s);
- changed files;
- focused QA result/count;
- capability completion table;
- exact source/QA blobs where practical;
- bounded limitations;
- actual upstream modules/blobs used;
- confirmation:

```text
UI changes = 0
CHAT changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
Renderer changes = 0
P1-D/E/F/G/H scope intrusion = 0
second Transform/Text/Layout/Appearance authority = 0
Runtime = NOT RUN
```

Then STOP for MR.
