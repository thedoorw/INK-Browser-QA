# INK P1-B Local Raster Retouch — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-B-LOCAL-RASTER-RETOUCH-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-b-local-raster-retouch-001`

BASELINE_MAIN: `c750b8f2803d87c369edcf9c320a531a32f92d62`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`

UPSTREAM_MODULE:
- P1-A promoted on main
- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Implement deterministic UI-neutral Core capability for:

1. Clone Stamp
2. Pattern Stamp
3. Healing
4. Spot Healing
5. Patch
6. Dodge
7. Burn
8. Sponge
9. Local Blur
10. Local Sharpen
11. Color Replacement Brush

This workpack authorizes Core + focused QA only.

## 2. Shared authority rule

P1-B must create one reusable local-raster retouch authority.

Do not create separate engines for each tool.

All tools must use a shared contract based on:
- source raster/ImageData;
- bounded target region / brush mask;
- optional source point / source raster / pattern;
- strength/opacity/radius/options;
- deterministic raster result;
- immutable input unless explicitly documented.

P1-B does not own document mutation, History, UI, CHAT, Recipe or Renderer.

## 3. Existing authorities to reuse

Reuse when applicable:
- `product/source/src/image/image-core.js`
- `product/source/src/image/raster-selection-tools.js`
  - RGBA sampling
  - color distance / tolerance
- `product/source/src/image/raster-fill-tools.js`
  - RGBA normalization / compositing semantics where suitable
- current Raster/Image model
- current mask/selection model
- current FORMAT_VERSION 4

No second raster document/image model.

## 4. Allowed source boundary

DEV may add:

- `product/source/src/image/raster-retouch-tools.js`
- `qa/ink-p1-b-local-raster-retouch.test.mjs`

DEV may modify only if strictly necessary to expose a shared non-duplicated primitive:

- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`

Any modification to:
- `image-core.js`
- History
- document serialization
- renderer
- editor UI
requires STOP → MR before change.

Branch-local progress:
- `ACTIVE/INK_DEV_PROGRESS.md`

## 5. Common Core contract

All mutating raster functions must:

- validate width/height/data shape;
- clone source data before writing;
- clip coordinates/brush bounds to raster bounds;
- accept a bounded opacity/strength in `0..1`;
- be deterministic for identical input;
- preserve pixels outside the affected mask/region;
- handle alpha predictably;
- return `{ width, height, data, ...metadata }`;
- not create History entries;
- not mutate document state.

A shared brush/region mask helper is encouraged.

## 6. Tool contracts

### 6.1 Clone Stamp

Required:
- source point + target point;
- bounded radius/brush mask;
- relative source-offset mapping across target region;
- opacity;
- clipping at source/target edges;
- deterministic result.

No content-aware synthesis.

### 6.2 Pattern Stamp

Required:
- external pattern raster or bounded pattern tile;
- repeat/tile mapping;
- target region/brush mask;
- opacity;
- deterministic phase/origin.

### 6.3 Healing

Required:
- explicit source region/source point;
- copy source structure/texture into target;
- adapt copied result toward target local color/luminance using a deterministic bounded rule;
- preserve target alpha contract unless explicitly replaced by source alpha.

This is deterministic healing, not generative content-aware fill.

### 6.4 Spot Healing

Required:
- target region only;
- derive replacement from bounded neighboring pixels;
- deterministic local neighborhood rule;
- guard against empty/no-neighbor cases;
- no AI/model inference.

A simple deterministic neighborhood median/mean/edge-aware rule is acceptable if QA locks behavior.

### 6.5 Patch

Required:
- source region + target region of compatible geometry;
- deterministic region mapping;
- optional bounded blend/feather;
- clip to raster bounds;
- preserve unaffected pixels.

### 6.6 Dodge

Required:
- local luminance increase;
- strength;
- bounded brush/region;
- alpha preserved.

### 6.7 Burn

Required:
- local luminance decrease;
- strength;
- bounded brush/region;
- alpha preserved.

### 6.8 Sponge

Required:
- saturate and desaturate mode;
- strength;
- bounded brush/region;
- alpha preserved.

### 6.9 Local Blur

Required:
- apply blur only inside target mask/region;
- deterministic bounded kernel/radius;
- preserve outside pixels;
- avoid reading already-written pixels within the same pass unless explicitly double-buffered.

### 6.10 Local Sharpen

Required:
- apply sharpening only inside target mask/region;
- deterministic bounded amount/radius;
- preserve outside pixels;
- clamp output to byte range.

### 6.11 Color Replacement Brush

Required:
- target color or sampled reference color;
- replacement color;
- tolerance;
- strength/opacity;
- bounded target mask/brush region;
- use the shared P1-A color-distance authority;
- preserve source luminance where practical rather than flat bucket replacement.

This item is P2-opportunistic but is authorized inside P1-B because it shares the same local-raster infrastructure.

## 7. Explicit prohibitions

- no Remove/content-aware generative repair;
- no Neural/AI image synthesis;
- no Object Selection;
- no P1-C/D/E/F/G/H implementation;
- no UI controls;
- no `ink.js` / `studio-core.js` wiring;
- no CHAT surface changes;
- no Recipe schema changes;
- no FORMAT_VERSION change;
- no History or save/load integration;
- no Runtime submission.

## 8. Focused QA required

At minimum test:

### Clone / Pattern
- clone source→target exact mapping;
- clone edge clipping;
- pattern tiling with deterministic origin;
- opacity behavior.

### Healing / Patch
- healing changes target toward source structure while adapting target tone;
- healing is deterministic;
- spot healing uses neighbors and leaves outside pixels unchanged;
- patch maps source region to target correctly;
- patch boundary clipping.

### Local tonal/color tools
- Dodge increases luminance;
- Burn decreases luminance;
- Sponge saturate increases chroma/saturation;
- Sponge desaturate decreases chroma/saturation;
- alpha preserved for Dodge/Burn/Sponge.

### Local filter tools
- Blur changes only selected/target pixels;
- Sharpen changes only selected/target pixels;
- output remains byte-bounded.

### Color Replacement
- within-tolerance pixels change;
- outside-tolerance pixels do not;
- target alpha preserved;
- luminance preservation is asserted for a known fixture.

### Global invariants
- source raster remains immutable;
- pixels outside region/mask remain unchanged;
- identical input produces identical output;
- invalid dimensions/options fail predictably;
- source imports under Node test environment.

Required:

```text
P1_B_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

## 9. MODULE_READY boundary

At P1-B MODULE_READY:

- all 11 scoped Core capabilities exist;
- focused QA passes;
- no document mutation integration is required yet;
- no History/save-load wiring is required yet;
- no UI wiring is required yet;
- no Runtime is run.

Formal product integration comes after all P1 A-H modules are ready.

## 10. DEV handoff

DEV must report:

- exact branch HEAD;
- implementation commit;
- changed files;
- focused QA command/result;
- capability completion table;
- exact source/QA blob SHAs where practical;
- limitations;
- confirmation:

```text
UI changes = 0
CHAT changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
P1-C/D/E/F/G/H scope intrusion = 0
second raster/image authority = 0
Runtime = NOT RUN
```

Then STOP for MR review.
