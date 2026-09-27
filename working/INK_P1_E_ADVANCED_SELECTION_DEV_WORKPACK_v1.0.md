# INK P1-E Advanced Selection — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-E-ADVANCED-SELECTION-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-e-advanced-selection-001`

PRODUCT_BASELINE_MAIN: `206f027785c04e56e91293e439fef8fb0cdd8521`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`
- P1-A selection authority: `product/source/src/image/raster-selection-tools.js`

UPSTREAM:
- P1-A = MODULE_READY / MR_PASS / PROMOTED
- P1-B = MODULE_READY / MR_PASS / PROMOTED
- P1-C = MODULE_READY / MR_PASS / PROMOTED
- P1-D = MODULE_READY / MR_PASS / PROMOTED

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Complete the native P1 Advanced Selection package as deterministic, UI-neutral Core capability:

1. Magnetic Lasso
2. Object Selection

Both capabilities must extend the existing P1-A raster Selection authority.

This package does not authorize final UI wiring or semantic/AI object recognition.

## 2. Authority boundary

The authoritative raster-selection module is:

`product/source/src/image/raster-selection-tools.js`

P1-A already owns:
- Polygonal Lasso;
- Magic Wand;
- Quick Selection;
- Select/Mask refinement;
- shared raster selection shape:
  - `type: 'selection'`
  - `width`
  - `height`
  - `alpha`
  - `bounds`
  - `metadata`

P1-E must return the same compatible selection shape.

Important distinction:

- P1-E Object Selection means selecting a visually coherent foreground/object region inside a raster image.
- It does **not** replace INK document-object selection in `product/source/src/editor/selection.js`.
- It does **not** create a second Selection or Mask authority.

## 3. Allowed source boundary

DEV may modify:

- `product/source/src/image/raster-selection-tools.js`

DEV may add one bounded internal helper module only if necessary for edge/path segmentation complexity:

- `product/source/src/image/raster-selection-edge.js`

If added:
- it must not export a second public Selection model;
- `raster-selection-tools.js` remains the public P1-A/P1-E authority.

Focused QA:

- `qa/ink-p1-e-advanced-selection.test.mjs`

Branch-local progress:

- `ACTIVE/INK_DEV_PROGRESS.md`

Do not modify `image-core.js`, `editor/selection.js`, `studio-core.js`, `ink.js`, document serialization, History, CHAT, Recipe, Renderer, UI or FORMAT_VERSION without STOP → MR.

## 4. Explicit prohibitions

- no UI controls or interaction wiring;
- no HTML/CSS/web-shell changes;
- no `studio-core.js` change;
- no `ink.js` change;
- no document-object selection rewrite;
- no second Selection model;
- no second Mask authority;
- no second Renderer authority;
- no ML model dependency;
- no network/API segmentation;
- no semantic grounding substitution;
- no generative/content-aware behavior;
- no P1-F/G/H work;
- no integrated Runtime.

## 5. Magnetic Lasso Core contract

### Input

Minimum:
- source raster/ImageData;
- two or more anchor / pointer sample points.

Bounded options may include:
- search/corridor radius;
- edge sensitivity/weight;
- direction/continuity weight;
- close/open path flag;
- hard work limit.

### Required behavior

The algorithm must:

- compute deterministic raster edge evidence from image pixels;
- be alpha-aware;
- search only a bounded corridor / region around the requested anchor segment;
- prefer stronger edges while preserving path continuity;
- use deterministic tie-breaking;
- enforce a hard pixel/node work limit;
- never access outside raster bounds;
- preserve source ImageData immutability;
- return a compatible raster selection;
- include the resolved edge-following path in metadata/evidence;
- support closed-lasso selection;
- use a deterministic straight/bounded fallback when edge evidence is insufficient rather than inventing semantic content.

Allowed implementation classes:
- bounded shortest-path / dynamic programming / graph search;
- Sobel/finite-difference edge energy;
- equivalent deterministic local edge-following method.

No machine-learning edge detector is required or authorized.

### Output

Existing P1-A compatible selection shape.

Recommended metadata:
- `source: 'magnetic-lasso'`
- resolved path;
- work/visited count;
- search radius;
- edge/fallback evidence.

## 6. Object Selection Core contract

Object Selection in P1-E is a bounded classical raster segmentation capability, not Photoshop AI parity and not semantic object recognition.

### Input

Minimum:
- source raster/ImageData;
- bounded hint region:
  - rectangle, polygon, or equivalent ROI;
- optional explicit seed point.

Bounded options may include:
- color-distance threshold;
- edge threshold;
- alpha threshold;
- minimum component size;
- hard work/pixel limit.

### Required behavior

The algorithm must:

- restrict analysis to the hint/ROI;
- be alpha-aware;
- identify coherent foreground candidate region(s) using deterministic pixel/edge/component evidence;
- prefer explicit seed containment when a seed is supplied;
- otherwise choose the candidate deterministically from bounded evidence such as area, center proximity, contrast and edge separation;
- handle multiple disconnected candidate regions deterministically;
- preserve pixels outside the ROI as unselected;
- enforce a hard work limit;
- preserve source ImageData immutability;
- return the same P1-A raster selection shape;
- expose bounded evidence/score/confidence metadata rather than claiming semantic certainty.

Suggested evidence hierarchy:
1. alpha separation when present;
2. boundary/background color contrast;
3. local color continuity;
4. raster edge separation;
5. deterministic connected-component ranking.

When evidence is insufficient, the function must return a predictable empty/bounded result or explicit low-confidence result. It may not fabricate a semantic object.

## 7. Composition with current P1-A authority

P1-E must remain compatible with:
- `polygonalLassoSelection()`;
- `magicWandSelection()`;
- `quickSelection()`;
- `refineRasterSelection()`;
- current raster mask conversion in `image-core.js`.

Shared color-distance / pixel / bounds primitives should be reused where practical.

Do not duplicate existing P1-A color matching or raster-selection schema merely for P1-E.

## 8. History / save-load rule

P1-E is MODULE_READY Core only.

Therefore:
- generated selections are transient/output data;
- no History entry is created;
- no document mutation is owned here;
- no save/load/migration wiring is added.

Formal tool interaction, History, persistence and UI wiring belong to final P1 integration.

## 9. Focused QA required

At minimum:

### Magnetic Lasso
- high-contrast edge fixture attracts resolved path;
- path remains inside raster bounds;
- closed path creates expected inside/outside selection;
- alpha edge contributes to edge evidence;
- search/corridor radius is respected;
- low-edge fixture uses documented deterministic fallback;
- deterministic tie-breaking;
- hard work-limit guard;
- repeated identical input gives identical path + mask.

### Object Selection
- opaque foreground on transparent background selected;
- colored foreground against uniform background selected;
- ROI excludes an external distractor;
- explicit seed selects the intended component among multiple candidates;
- no-seed candidate ranking is deterministic;
- alpha-aware segmentation;
- outside-ROI pixels remain unselected;
- insufficient-evidence behavior is predictable;
- hard work-limit guard;
- evidence/confidence metadata is bounded and deterministic.

### Shared invariants
- P1-A selection output shape remains compatible;
- output composes with `refineRasterSelection()`;
- source ImageData is immutable;
- no global/document mutation;
- Node import/parse succeeds;
- no skipped tests.

Required result:

```text
P1_E_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

Focused QA must import the actual current `raster-selection-tools.js` authority.

## 10. MODULE_READY boundary

At MODULE_READY:

- Magnetic Lasso Core exists;
- Object Selection Core exists;
- both produce P1-A-compatible raster selection output;
- deterministic focused QA passes;
- no document-object Selection authority is changed;
- no UI/History/save-load/migration work is required;
- no Runtime is run.

## 11. DEV handoff

Report:

- exact branch HEAD;
- implementation commit(s);
- changed files;
- focused QA command/result/count;
- capability-by-capability completion table;
- exact implementation/QA blob SHA where practical;
- bounded limitations;
- P1-A authority blob used;
- confirmation:

```text
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
studio-core.js changes = 0
ink.js changes = 0
editor/selection.js changes = 0
second Selection authority = 0
second Mask authority = 0
ML/network segmentation = 0
P1-F/G/H scope intrusion = 0
Runtime = NOT RUN
```

Then STOP for MR review.

## 12. MR acceptance gate

MR may mark `P1_E_MODULE_READY` only when:

- both scoped capabilities satisfy the bounded Core contracts;
- P1-A output/schema compatibility is preserved;
- focused QA passes with fail/skip = 0;
- no semantic/AI overclaim is introduced;
- no prohibited scope intrusion exists;
- branch remains unmerged until MR review.

After P1-E:
- P1-F may be authorized;
- integrated Runtime remains prohibited.
