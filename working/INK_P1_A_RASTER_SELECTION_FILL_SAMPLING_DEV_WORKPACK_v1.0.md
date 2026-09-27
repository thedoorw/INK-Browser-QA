# INK P1-A Raster Selection / Fill / Sampling — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-a-raster-selection-fill-sampling-001`

BASELINE_MAIN: `9c808b6ef68480dbfd3d394b8dabddaee2aab0b4`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`

UI STATUS: `HOLD`

RUNTIME STATUS: `DEFERRED — MODULE_READY FOCUSED QA FIRST`

## 1. Goal

Implement the first bounded mature-platform gap package as deterministic UI-neutral Core capability.

Scope:

1. Polygonal Lasso core selection
2. Quick Selection core
3. Magic Wand / tolerance selection
4. Select-and-Mask edge refinement core
5. Gradient fill core
6. Paint Bucket / tolerance flood fill core
7. Eyedropper / Color Sampler core

This workpack does not authorize final UI wiring.

## 2. Existing authorities that must be reused

Do not create a second Selection/Mask/Image/History authority.

Reuse current:
- `product/source/src/image/image-core.js`
- `product/source/src/editor/selection.js`
- `product/source/src/history/history.js`
- current Raster/Image object and raster-mask models
- current `.ink` document model / Format Version 4

Existing `modifyRasterMask`, raster mask creation, selection-from-alpha/path and image stack semantics remain authoritative.

## 3. Allowed source boundary

DEV may add:

- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`

DEV may modify only when strictly necessary for shared, non-duplicated primitives:

- `product/source/src/image/image-core.js`
- `product/source/src/editor/selection.js`

Focused QA:

- `qa/ink-p1-a-raster-selection-fill-sampling.test.mjs`

Branch-local progress:

- `ACTIVE/INK_DEV_PROGRESS.md`

No other product/source file is authorized without STOP → MR.

## 4. Explicitly prohibited in P1-A

- no `ink.js` UI wiring;
- no `studio-core.js` UI wiring;
- no HTML/CSS/web-shell changes;
- no final Photoshop-aligned UI work;
- no CHAT exposure changes;
- no Recipe schema expansion;
- no FORMAT_VERSION change;
- no new Renderer authority;
- no new History authority;
- no P1-B retouch tools;
- no P1-C text/vector/layout tools;
- no P1-D layer effects;
- no Object Selection / Magnetic Lasso;
- no generative/content-aware behavior.

## 5. Required Core contracts

### 5.1 Polygonal Lasso

Input:
- raster bounds/dimensions;
- polygon points.

Output:
- deterministic selection/raster mask compatible with current image-mask authority.

Required:
- bounded coordinates;
- predictable even-odd polygon fill;
- no document mutation.

### 5.2 Magic Wand

Input:
- source ImageData/raster;
- seed point;
- tolerance;
- contiguous mode.

Required:
- deterministic color-distance rule;
- bounded memory/runtime;
- alpha-aware behavior;
- contiguous flood mode;
- non-contiguous tolerance mode may be included if it uses the same authority.

Output:
- raster selection mask.

### 5.3 Quick Selection

Input:
- source ImageData/raster;
- one or more seed/brush samples;
- bounded tolerance/edge settings;
- add/subtract mode.

Required:
- deterministic seeded region growth;
- additive/subtractive selection composition;
- no model/AI segmentation dependency;
- hard bounds to prevent runaway work.

Output:
- raster selection mask.

Quick Selection here is deterministic pixel-region selection. It is not Object Selection.

### 5.4 Select / Mask refinement

Must compose with the existing raster-mask authority.

Required operations:
- smooth;
- feather;
- expand;
- contract;
- optional edge shift if implemented through the same bounded mask model.

Do not duplicate existing mask modifiers when current `image-core.js` already owns the operation.

### 5.5 Eyedropper / Color Sampler

Required:
- exact-point sample;
- bounded averaged sample radius;
- RGBA result;
- deterministic behavior at edges/transparency.

Read-only Core function. No History entry.

### 5.6 Gradient fill

Required minimum:
- linear gradient;
- radial gradient;
- two or more color stops;
- opacity;
- deterministic interpolation;
- bounded ImageData/raster result.

The Core function should return/apply raster data without owning document History.

### 5.7 Paint Bucket

Required:
- tolerance flood fill;
- contiguous mode;
- alpha-aware source/target;
- deterministic bounded output;
- preserve pixels outside selected/fill region.

Non-contiguous mode is allowed only if it reuses the same color-match authority.

## 6. History / save-load rule

P1-A Core functions should be pure/deterministic and must not invent document mutation.

Therefore at MODULE_READY stage:

- selection generation = transient/output data, no History;
- sampling = read-only;
- fill functions = deterministic raster result only.

Formal document mutation + History + save/load wiring belongs to the later Integration Work Order.

This separation is intentional and does not waive the final History/save-load requirement.

## 7. QA required before DEV handoff

Focused deterministic tests must cover at least:

- polygon selection inside/outside;
- polygon edge/boundary behavior;
- Magic Wand tolerance 0 / bounded positive tolerance;
- contiguous vs non-contiguous behavior if both supported;
- alpha/transparency behavior;
- Quick Selection add/subtract;
- Quick Selection bounded-work guard;
- refinement smooth/feather/expand/contract;
- Eyedropper exact pixel;
- averaged sampler near canvas edge;
- linear gradient endpoints/midpoint;
- radial gradient center/edge;
- Paint Bucket preserves non-target pixels;
- input ImageData is not mutated unless function contract explicitly says so;
- repeated identical input produces identical output;
- source parse/import succeeds under Node test environment.

Required result:

`P1_A_FOCUSED_QA = PASS`

No integrated browser Runtime is required for MODULE_READY.

## 8. DEV handoff

DEV must provide:

- exact branch HEAD;
- changed-file list;
- focused QA command/result;
- capability-by-capability completion table;
- any bounded limitations;
- confirmation:
  - UI changes = 0
  - CHAT changes = 0
  - FORMAT_VERSION change = 0
  - second authority introduced = 0

Then STOP for MR review.

## 9. MR acceptance gate

MR may mark `P1_A_MODULE_READY` only when:

- all seven scoped capabilities exist at the bounded Core level;
- deterministic focused QA passes;
- no prohibited scope intrusion exists;
- no existing image/mask/selection behavior regresses in inspected source;
- branch remains unmerged until MR review.

After P1-A:
- P1-B may be authorized as the next bounded module;
- integrated product wiring remains deferred to the pre-UI integration phase.
