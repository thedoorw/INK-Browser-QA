# INK P1-D Layer Effects Completion — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-D-LAYER-EFFECTS-COMPLETION-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-d-layer-effects-completion-001`

BASELINE_MAIN: `b214c177972be2e6175459005720bb72e697cec2`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`

UPSTREAM:
- P1-A = promoted
- P1-B = promoted
- P1-C = promoted

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Complete the existing Layer Effects rendering authority for:

1. Drop Shadow
2. Inner Shadow
3. Outer Glow
4. Stroke

Existing Color Overlay rendering must remain operational and regression-tested.

No new Layer Effects model or second Renderer authority is authorized.

## 2. Existing authority

Current authoritative source:

`product/source/src/image/image-core.js`

It already owns:
- `createLayerEffect(type, params, options)`
- supported effect types:
  - `dropShadow`
  - `innerShadow`
  - `outerGlow`
  - `colorOverlay`
  - `stroke`
- `applyLayerEffects(imageData, effects)`

Current product rendering already calls `applyLayerEffects()` for image/object/layer stacks through `studio-core.js`.

Therefore P1-D extends the existing `applyLayerEffects()` authority. It must not create a parallel effect stack or renderer.

## 3. Allowed source boundary

DEV may modify:

- `product/source/src/image/image-core.js`

DEV may add one bounded helper module only if it materially improves testability without duplicating authority:

- `product/source/src/image/layer-effects.js`

If added, `image-core.js` remains the public authority and must delegate to it.

Focused QA:

- `qa/ink-p1-d-layer-effects-completion.test.mjs`

Branch-local progress:

- `ACTIVE/INK_DEV_PROGRESS.md`

Do not modify `studio-core.js`, `ink.js`, UI, document serialization, History, CHAT, Recipe or FORMAT_VERSION during MODULE_READY work without STOP → MR.

## 4. Common effect contract

All effects must:

- operate deterministically on `{ width, height, data }`;
- preserve input ImageData / source data immutability;
- preserve output dimensions at MODULE_READY;
- clamp all channels to byte range;
- be alpha-aware;
- respect `effect.enabled !== false`;
- respect bounded effect opacity `0..1`;
- preserve pixels outside the mathematically affected region;
- compose in array order;
- reject or safely normalize invalid numeric parameters;
- not create document mutation or History entries.

At this stage effect pixels are bounded to the supplied raster dimensions. Expansion/padding outside an image object's local raster bounds, if later required by product integration, belongs to the final P1 integration work and may not create a second effect renderer.

## 5. Shared primitives

The implementation should share bounded primitives for:

- extracting source alpha;
- offsetting alpha masks;
- blur/softness;
- expand/spread or morphology;
- RGBA color normalization;
- source-over compositing;
- inside/outside alpha masks.

Reuse existing `blurAlpha`, mask morphology, compositing or equivalent current primitives where practical.

Do not implement four unrelated mini-engines.

## 6. Effect contracts

### 6.1 Drop Shadow

Required minimum parameters:

- `color`
- `offsetX`
- `offsetY`
- `blur` or `radius`
- optional `spread`
- effect/global opacity

Required behavior:

- derive shadow from source alpha;
- shift by offset;
- optionally spread before blur;
- composite shadow behind original source;
- source remains visible and unchanged except for normal effect-stack composition;
- transparent source areas may receive shadow;
- clipping at supplied raster bounds is deterministic.

### 6.2 Inner Shadow

Required minimum parameters:

- `color`
- `offsetX`
- `offsetY`
- `blur` or `radius`
- optional `choke` / bounded spread equivalent
- opacity

Required behavior:

- result is restricted to original source alpha/interior;
- shifted/softened shadow creates an interior edge effect;
- fully transparent exterior stays transparent unless another earlier/later effect changes it;
- original alpha is preserved.

### 6.3 Outer Glow

Required minimum parameters:

- `color`
- `radius` / `blur`
- optional `spread`
- opacity

Required behavior:

- derive glow from source alpha;
- glow exists outside source alpha;
- original source remains composited above glow;
- glow falls off deterministically;
- interior is not replaced by flat glow color.

### 6.4 Stroke

Required minimum parameters:

- `color`
- `size`
- `position`: `inside`, `outside`, or `center`
- opacity

Required behavior:

- edge is derived from source alpha;
- `inside` stays within original alpha;
- `outside` stays outside original alpha;
- `center` straddles the source boundary in a deterministic bounded way;
- zero size is identity;
- original source remains visible.

## 7. Color Overlay regression

Current Color Overlay behavior is P0 operational scope and must not regress.

Focused QA must assert:
- enabled Color Overlay still changes only non-transparent source pixels;
- effect opacity is respected;
- disabled Color Overlay is identity;
- Color Overlay composes deterministically with at least one newly completed effect.

## 8. Explicit prohibitions

- no second Layer Effects stack/model;
- no second Renderer authority;
- no CSS/DOM shadow implementation;
- no Canvas-only browser dependency in Core QA;
- no UI controls;
- no `studio-core.js` wiring change at MODULE_READY;
- no `ink.js` change;
- no History/save-load integration;
- no document migration;
- no CHAT/Recipe expansion;
- no FORMAT_VERSION change;
- no P1-E/F/G/H;
- no integrated Runtime.

## 9. Focused QA required

At minimum:

### Drop Shadow
- exact offset on a hard-alpha fixture;
- blur produces soft alpha;
- opacity changes shadow strength;
- source remains intact;
- edge clipping is deterministic.

### Inner Shadow
- effect remains inside original alpha;
- transparent exterior remains transparent;
- offset direction changes affected edge;
- original alpha preserved.

### Outer Glow
- glow appears outside source alpha;
- center/source pixel remains source-dominant;
- radius changes footprint;
- opacity bounded.

### Stroke
- inside position fixture;
- outside position fixture;
- center position fixture;
- size 0 identity;
- source remains visible.

### Stack / invariants
- Color Overlay regression;
- disabled effect identity;
- effect stack array order deterministic;
- source input immutable;
- identical input produces identical output;
- output dimensions unchanged;
- invalid/degenerate parameters fail predictably or normalize to documented bounds;
- Node import/parse succeeds.

Required result:

```text
P1_D_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

Focused QA must import the actual current `image-core.js` public authority, not an API-compatible stub.

## 10. MODULE_READY boundary

At MODULE_READY:

- Drop Shadow renderer exists;
- Inner Shadow renderer exists;
- Outer Glow renderer exists;
- Stroke renderer exists;
- Color Overlay remains operational;
- all render through current `applyLayerEffects()` authority;
- focused QA passes;
- no UI/History/save-load/migration work is required;
- no Runtime is run.

## 11. DEV handoff

Report:

- exact branch HEAD;
- implementation commit(s);
- changed files;
- focused QA command/result/count;
- effect-by-effect completion table;
- exact implementation/QA blob SHA where practical;
- bounded limitations;
- current `image-core.js` authority blob used;
- confirmation:

```text
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
studio-core.js changes = 0
second Layer Effects authority = 0
second Renderer authority = 0
P1-E/F/G/H scope intrusion = 0
Runtime = NOT RUN
```

Then STOP for MR review.
