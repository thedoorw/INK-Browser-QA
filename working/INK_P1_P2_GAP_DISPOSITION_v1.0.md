# INK P1/P2 Gap Disposition v1.0

STATUS: `MR_DISPOSITION_DRAFT / NO_IMPLEMENTATION_YET`

TASK: `INK-FULL-CAPABILITY-REBASELINE-001`

CAPABILITY_REGISTRY: `working/INK_CAPABILITY_REGISTRY_v0.1.md`

NORMALIZED_PRODUCT_ATOMICS: `496`

DATE: 2026-09-27

## 1. Decision rule

The refreshed 64-family / 496-atomic registry is checked before opening any gap work. Existing INK capabilities are reused; P1/P2 is not allowed to create duplicate Document, History, Renderer, Selection, Transform, Recipe, CHAT or storage authorities.

The purpose of the pre-UI implementation set is to close mature creative-workstation gaps that materially affect the final UI taxonomy. It is not to clone Photoshop feature-for-feature.

## 2. Final disposition table

| Comparator / gap | MR decision | Reason / boundary |
|---|---|---|
| Layers / groups / hierarchy | **P0 PRESERVE** | Existing normalized C03/C15/C16; no new implementation. |
| Smart Objects | **DEFER WITH REASON** | C28 reusable raster source + C18 Components already cover current editable reuse; revisit only for Photoshop interoperability semantics. |
| Marquee / Lasso | **P0 PRESERVE** | C07. |
| Polygonal Lasso | **IMPLEMENT NOW** | Foundational selection tool; bounded deterministic geometry. |
| Magnetic Lasso | **IMPLEMENT AFTER UI BASELINE** | Depends on pixel-edge/selection maturity; not needed to place UI taxonomy. |
| Quick Selection | **IMPLEMENT NOW** | Core mature raster-selection need. |
| Magic Wand | **IMPLEMENT NOW** | Tolerance flood selection is deterministic and foundational. |
| Object Selection | **IMPLEMENT AFTER UI BASELINE** | Requires pixel segmentation/object-recognition decision; semantic grounding is not a substitute. |
| Layer / vector / raster masks | **P0 PRESERVE** | C23 already restored. |
| Select and Mask edge refinement | **IMPLEMENT NOW** | Completes the new raster-selection foundation and existing mask stack. |
| Crop / image resize | **P0 RECONCILE / UI EXPOSURE** | C22 exists; no duplicate Core implementation. |
| Move / scale / rotate | **P0 PRESERVE** | C13. |
| Skew / Distort / Perspective / Warp | **IMPLEMENT NOW** | High-value vector/raster transform gap; build on existing transform/deformation authorities. |
| Puppet Warp | **DEFER WITH REASON** | P2; not required before final UI. |
| Brush / Pencil / Airbrush / Smudge / Eraser | **P0 PRESERVE** | C29/C31/C33. |
| History Brush / Art History Brush | **DEFER WITH REASON** | P2; specialized Photoshop workflow, not required before UI. |
| Color Replacement Brush | **IMPLEMENT NOW (P2 opportunistic)** | Can share local-raster-tool infrastructure with Dodge/Burn/Sponge and sampling. |
| Clone Stamp / Pattern Stamp | **IMPLEMENT NOW** | Core retouch capability; deterministic source sampling. |
| Gradient Tool | **IMPLEMENT NOW** | Missing fundamental paint/fill operation. |
| Paint Bucket / tolerance flood fill | **IMPLEMENT NOW** | Pairs with Magic Wand region-growth authority. |
| Eyedropper / Color Sampler | **IMPLEMENT NOW** | Fundamental color sampling; needed by painting/retouch UI. |
| Healing / Spot Healing / Patch | **IMPLEMENT NOW** | High-value deterministic retouch module; keep content model bounded. |
| Remove / content-aware repair | **ADAPTER** | Generative/content-aware synthesis should not become a second native pixel-generation authority now. |
| Dodge / Burn / Sponge | **IMPLEMENT NOW** | Standard local raster tonal/color tools; share one local-raster module. |
| Local Blur / Sharpen tools | **IMPLEMENT NOW** | Existing filters provide algorithms; add local application without second filter authority. |
| Vector Pen / Paths / Shapes / Boolean / Repeat | **P0 PRESERVE** | C10-C12/C17. |
| Basic Text | **P0 PRESERVE** | C20. |
| Paragraph / Vertical Type | **IMPLEMENT NOW** | Mature editor text foundation needed before final UI placement. |
| Text on Path | **IMPLEMENT NOW** | Vector/text integration gap; directly relevant to Illustrator-class direction. |
| Advanced glyph typography | **DEFER WITH REASON** | P2; font-engine breadth can follow UI baseline. |
| Gradient / Pattern fills | **IMPLEMENT NOW** | Fundamental vector/raster appearance capability. |
| Adjustment Layers breadth | **IMPLEMENT AFTER UI BASELINE** | Current non-destructive stack + six adjustments are usable; expand breadth in later image-processing phase. |
| Filter Stack breadth / Filter Gallery | **IMPLEMENT AFTER UI BASELINE** | Current stack + six filters are usable; breadth does not block UI. |
| Blur Gallery | **DEFER WITH REASON** | P2. |
| Liquify | **IMPLEMENT AFTER UI BASELINE** | Valuable P1 but large specialized deformation UI/runtime; not a pre-UI gate. |
| Lens correction | **ADAPTER / DEFER** | Better handled in later photo/RAW phase or adapter. |
| Smart Filters | **P0 PRESERVE** | Existing non-destructive filter stack is current authority. |
| Neural Filters | **ADAPTER** | External/AI adapter only. |
| Layer Styles | **IMPLEMENT NOW** | Existing data models already present; finish renderer for Drop Shadow, Inner Shadow, Outer Glow and Stroke. |
| Blend Modes | **P0 PRESERVE** | C26. |
| Guides / Grid | **P0 PRESERVE + EXPAND** | Existing grid/smart guides stay; persistent guide work below. |
| Persistent ruler guides | **IMPLEMENT NOW** | Mature workstation navigation/layout capability. |
| Equal-distance smart snapping | **IMPLEMENT NOW** | Directly improves layout/vector editing; extends current snapping authority. |
| Ruler / measurement | **IMPLEMENT NOW** | Needed for print/layout precision and final UI. |
| History / Snapshots / Revision / Provenance | **P0 PRESERVE** | C43-C45 and raster snapshot. |
| 8/16/32-bit image workflow | **IMPLEMENT AFTER UI BASELINE** | Strategic architecture change; requires storage/render/export/color-policy design. |
| RGB / CMYK / Lab / Multichannel | **IMPLEMENT AFTER UI BASELINE** | Strategic print/color phase; do not block workstation UI. |
| ICC color management | **IMPLEMENT AFTER UI BASELINE** | Strategic print phase, coupled to color modes/export. |
| Channels / alpha / spot channels | **IMPLEMENT AFTER UI BASELINE** | Strategic image/print phase. |
| Camera Raw | **ADAPTER** | Use external/raw-processing adapter rather than rebuild full RAW engine now. |
| Photomerge / panorama | **DEFER WITH REASON** | P2 expansion; outside pre-UI need. |
| Actions | **P0 PRESERVE / INTEROP LATER** | Recipe/Program/CHAT remain INK automation authority. |
| Batch / Image Processor | **DEFER WITH REASON** | P2; Recipe automation exists and general batch UX can follow UI. |
| Generative Fill / Expand / Harmonize / Upscale | **ADAPTER** | Keep native core non-generative; optional external image adapter. |
| Animation / Timeline / Video | **OUTSIDE CURRENT CORE** | No current drawing-workstation requirement. |
| PSD / PSB / TIFF / RAW / EXR breadth | **IMPLEMENT AFTER UI BASELINE** | Format interoperability phase; prioritize exact import/export contracts after UI baseline. |
| PNG / SVG / PDF / Print | **P0 PRESERVE** | C53. |
| Plugin ecosystem | **DEFER WITH REASON** | P2; Program Import is not a plugin SDK and a full SDK is not required pre-UI. |

## 3. Pre-UI implementation set

The `IMPLEMENT NOW` work is grouped into four bounded development packages.

### P1-A — Raster Selection / Fill / Sampling

- Polygonal Lasso;
- Quick Selection;
- Magic Wand;
- Select and Mask edge refinement;
- Gradient Tool;
- Paint Bucket / tolerance flood fill;
- Eyedropper / Color Sampler.

Core rule:
one shared raster-selection/mask authority; no second Selection or Mask model.

### P1-B — Local Raster Retouch

- Clone Stamp;
- Pattern Stamp;
- Healing;
- Spot Healing;
- Patch;
- Dodge;
- Burn;
- Sponge;
- Local Blur;
- Local Sharpen;
- Color Replacement Brush — P2 opportunistic because it shares the same local-raster/sampling infrastructure.

Core rule:
local tools must operate through the current Raster/Image + History + save/load authorities.

### P1-C — Vector / Text / Precision Layout

- Skew;
- Distort;
- Perspective;
- Warp;
- Paragraph Type;
- Vertical Type;
- Text on Path;
- Gradient Fill;
- Pattern Fill;
- persistent ruler guides;
- equal-distance smart snapping;
- ruler / measurement.

Core rule:
extend existing Transform/Text/Snap authorities; no second vector/layout system.

### P1-D — Layer Effects Completion

Render the already-existing layer-effect models:
- Drop Shadow;
- Inner Shadow;
- Outer Glow;
- Stroke.

Color Overlay is already rendered and remains P0.

## 4. Not a UI blocker

The following are explicitly deferred until after the final UI baseline and therefore must not keep UI on HOLD once the pre-UI packages and refreshed capability truth close:

- Magnetic Lasso;
- Object Selection;
- Adjustment breadth;
- Filter Gallery breadth;
- Liquify;
- 8/16/32-bit workflow;
- RGB/CMYK/Lab/Multichannel;
- ICC color management;
- Channels/alpha/spot channels;
- broader PSD/PSB/TIFF/RAW/EXR interoperability;
- Advanced glyph typography;
- Puppet Warp;
- History/Art History Brush;
- Blur Gallery;
- Photomerge;
- general Batch/Image Processor;
- plugin SDK/ecosystem.

## 5. Adapter boundary

Native Core should not duplicate:
- content-aware/generative Remove;
- Neural Filters;
- Camera Raw;
- generative fill/expand/harmonize/upscale.

These remain adapter-class capabilities unless later product evidence justifies a native implementation.

## 6. Counts

```text
IMPLEMENT_NOW_ROWS = 20
IMPLEMENT_AFTER_UI_ROWS = 10
ADAPTER_ROWS = 5
DEFER_ROWS = 8
OUTSIDE_ROWS = 1
```

Rows classified P0 preserve/reconcile are not counted as new implementation.

## 7. Gate to DEV authorization

Before the first P1-A DEV Work Order is issued:
- normalized registry receives final MR evidence check;
- current UI reconciliation gaps are recorded;
- ACTIVE capability baseline refresh is prepared/published at the accepted checkpoint;
- exact DEV branch and bounded source modules are named.

P1/P2 implementation is not authorized merely by this disposition document.
