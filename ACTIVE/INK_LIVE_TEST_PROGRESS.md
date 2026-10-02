# INK Live Test — Current Progress

TYPE = ACTIVE STATUS / CROSS-WINDOW RECOVERY
AUTHORITY = STATUS ONLY / DOES NOT REPLACE ACTIVE WORK ORDER
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/

## Current state

The CHAT-operated Live test lane is operational.

Transport path proven:

```text
CHAT
→ GitHub SSOT request
→ hosted browser runner
→ Live INK
→ window.INK_APP.inkPublicApi
→ INK named tools / native authority
→ structured result + screenshot/artifact
→ GitHub SSOT
→ CHAT
```

The transport gap is no longer a blocker. The Live page is not tested by mouse emulation.

Current deployed Live baseline is recorded authoritatively in:

`thedoorw/INK/BUILD_INFO.json`

Do not trust a SHA copied into this file if BUILD_INFO.json differs.

## Round 1 breadth sweep

Round 1 has reached a complete breadth pass across C001–C019.

Current case dispositions are maintained in:

- `thedoorw/INK/CASE_SWEEP.md`
- `thedoorw/INK/TEST_FINDINGS.md`

Broad result:

- PASS cases exist for vector/layout/output/reference reconstruction paths;
- several cases are PARTIAL because only the useful subset is exposed;
- drawing/natural-media cases expose a major CHAT-access gap;
- raster/mask/filter/blend/effect/deformation cases expose a major CHAT/product gap;
- layout assist/page/artboard and reusable Material/Recipe remain incomplete.

## Verified Live capabilities

Direct Live evidence has verified at least:

- capability discovery;
- document context;
- proposal → explicit approval → execute;
- native History;
- Revision capture;
- Preview;
- Path create/edit/repaint;
- Text create/edit;
- translate / rotate / clone;
- Boolean;
- Group / Frame / reparent;
- Frame layout;
- Component register/discovery;
- Repeat grid/radial;
- raw SVG import;
- browser-local binary Reference import;
- Reference decomposition into editable Paths;
- PNG / SVG / PDF output routes;
- Creative Library read path.

The bridge also supports bounded fixture File materialization for Reference import and compacts oversized result summaries while retaining full workflow artifacts.

## Round 1 gap clusters

### A — Drawing / Natural Media — highest priority

Families:
C29 C30 C31 C32 C33 C34 C35 C38

Cases:
C016 C017 C018

Source audit:
`working/INK_LIVE_CLUSTER_A_DRAWING_NATURAL_MEDIA_SOURCE_AUDIT_20261002.md`

Disposition:

```text
GENERAL DRAWING / BRUSH SESSION = PRODUCT EXISTS / A1 CHAT EXPOSURE PASS
NATIVE STROKE + AIRBRUSH = PRODUCT EXISTS / CHAT EXPOSURE GAP
PAPER PROFILE / MUTATION = PRODUCT EXISTS / CHAT EXPOSURE GAP
ERASER GEOMETRY = PRODUCT EXISTS / CHAT EXPOSURE GAP / SEPARATE BOUNDED DESIGN
BLENDER / SMUDGE = PRODUCT RENDER-INTEGRATION GAP
```

#### A1 Paint Session closure — 2026-10-02

```text
PR = #116 / MERGED
EXACT_CANDIDATE = c654a6fb22be2eaadfebc83b01171270c71cf1b1
SOURCE_INTEGRATION = 58adf13cd98a8594eb8e63faedc735ce0c5179f0
CANDIDATE_BROWSER_QA = live-drawing-paint-session-pr116-001 / PASS
LIVE_DEPLOYED_SOURCE = 58adf13cd98a8594eb8e63faedc735ce0c5179f0
LIVE_RERUN = clusterA-A1-live-rerun-004 / COMPLETED
```

Exact candidate browser QA proved:
- native `paint-session` creation;
- 2 deterministic strokes;
- renderer output changed;
- Preview completed;
- one scoped History entry;
- Undo removed the object;
- Redo restored it.

Formal Live rerun proved:
- `paint.session.create.v1` is discoverable;
- direct `propose_ink_edit → approve_ink_edit → execute_ink_edit` works;
- pencil + watercolor Paint Session created with 6 samples;
- History label `CHAT create Paint Session`;
- Preview completed;
- Undo context returned zero objects;
- Redo restored the same native `paint-session`.

A single-step bounded edit must use the direct bounded-edit named tools. `use_ink` Creative Plan remains a 2–32 step composition authority; the earlier `CHAT_PLAN_STEPS_INVALID` probe was a test-route misuse, not an A1 product defect.

A1 is closed. Remaining sequence:
```text
A2 native Stroke / formal NaturalMedia / Airbrush exposure
→ A3 Paper
→ A4 targeted Eraser
→ A5 Blender / Smudge product integration
```

Follow-up geometry issue:
`paint-session` currently renders correctly but lacks a dedicated content/world-bounds authority; content Preview used fallback 49×49 bounds despite wider stroke sample coordinates. Track separately from A1 exposure closure.

Cluster A implementation design:
`working/INK_LIVE_CLUSTER_A_CHAT_EXPOSURE_WORKPACK_v0.1.md`

### B — Raster / Mask / Filter / Blend / Effect / Deformation

Families:
C14 C22 C23 C24 C25 C26 C27 C28

Cases:
C010 C011 C013 C014 C015 C019

Observed:
Reference ingest, Preview and output work. Generic ReferenceImage mutation is locked. No CHAT-exposed mask/filter/blend/effect/adjustment/warp/deformation route is visible in the deployed registry.

Next action:
Source-audit existing raster/effect authorities and separate:
1. existing capability not exposed to CHAT;
2. genuinely missing product capability.

### B source-audit checkpoint — 2026-10-02

Source audit:
`working/INK_LIVE_CLUSTER_B_RASTER_EFFECTS_DEFORMATION_SOURCE_AUDIT_20261002.md`

Disposition:

```text
PSD / TIFF / EXR / RAW MUTABLE RASTER INGEST = PRODUCT EXISTS / CHAT EXPOSURE GAP
PNG / JPEG / WEBP MUTABLE RASTER INGEST = PRODUCT CONVERSION-INTEGRATION GAP
RASTER DIRECT EDIT CORE = PRODUCT EXISTS / CHAT EXPOSURE GAP
MASK / ADJUSTMENT / FILTER / BLEND / EFFECT = PRODUCT EXISTS / CHAT EXPOSURE GAP
RASTER LIQUIFY = PRODUCT EXISTS / CHAT EXPOSURE GAP
VECTOR PATH WARP / DISTORT / PERSPECTIVE = PRODUCT EXISTS / CHAT EXPOSURE GAP
TEXT WARP / CURVED-TEXT RENDER = PRODUCT RENDER-INTEGRATION GAP
REFERENCE IMAGE LOCK = INTENTIONAL / DO NOT UNLOCK AS REPAIR
```

Important boundaries:
- native mutable raster ingest already exists through `InkApp.importImageFormat()` for PSD / TIFF / EXR / RAW;
- Round 1 PNG / JPEG / WEBP still need a small product bridge from validated browser raster data into the existing `rasterState` representation;
- Reference import is a separate locked provenance/extraction object and must remain separate;
- Studio installs the actual raster stack renderer before CHAT Public API, so adjustment/filter/mask/effect/blend/Liquify are product-real rather than UI-only descriptors;
- C019 cannot be closed with a registry-only `text.warp` operation because current `drawText()` does not consume the existing `pathText` descriptor;
- C013 material-catalog absence remains a separate reusable-asset/material issue.

Current gate:
- source audit / exposure design may continue;
- Cluster B product-source merge and Live promotion remain HOLD while the active C04 recovery + two-state combined-promotion composition is in progress;
- unrelated Live CHAT exposure work must remain separate.

### B0 candidate checkpoint — web raster bridge

Fresh replay after main integrated the accepted recovery + C04 product composition:

```text
MAIN_PRODUCT_CHECKPOINT = aa01f1e311eb22cb572a61efea19b8bb21a96157
BRANCH = work/ink-live-web-raster-bridge-002
PR = #114 / DRAFT
CANDIDATE_HEAD = 5bec56b5a4db08404a03ea43d71d158c849a4b56
SUPERSEDED_PR = #113 / CLOSED
STATIC_SYNTAX = PASS / 2 CHANGED SOURCE FILES ONLY
RUNTIME_BROWSER = NOT YET CLAIMED
LIVE_PROMOTION = NOT EXECUTED
```

Candidate scope:
- RGBA8 web raster → existing `color-raster / ink-image-state`;
- History-backed `InkApp.importWebRaster()`;
- existing Reference lock/provenance semantics unchanged;
- no CHAT named-tool exposure yet;
- no UI behavior change;
- no Document / History / Renderer / raster-state fork;
- FORMAT_VERSION unchanged.

The current hosted Live request runner is hard-bound to the formal Live URL and cannot qualify this branch candidate before promotion. Static QA alone is not a promotion gate.

Cluster B implementation design:
`working/INK_LIVE_CLUSTER_B_CHAT_EXPOSURE_WORKPACK_v0.1.md`

The workpack fixes the minimum sequence as B0 web-raster bridge → B1 mutable raster named-tool import → B2 non-destructive image-stack edits → B4 native Path deformation, with local/destructive raster tools and masks deferred to B3. C019 Text warp remains excluded as a product render-integration gap.

### B0 + B1 accepted / deployed closure — 2026-10-02

```text
B0_FRESH_PR = #118 / MERGED
B0_EXACT_CANDIDATE = 076400c52bcd3f6a62e7de0a87dc26bfc010f8e4
B0_SOURCE_INTEGRATION = 3110a40227351cdc99a1639d09e55838d54cc8ed
B0_CANDIDATE_BROWSER_QA = live-raster-web-bridge-pr118-001 / PASS

B1_PR = #119 / MERGED
B1_EXACT_CANDIDATE = e535234b1b3ad47d4fa0f4300ec3539275b0b4ca
B1_SOURCE_INTEGRATION = 3a785b90d6f7922175cca3662fd2b72bf95430ce
B1_CANDIDATE_BROWSER_QA = live-raster-import-pr119-002 / PASS
LIVE_DEPLOYED_SOURCE = 3a785b90d6f7922175cca3662fd2b72bf95430ce
B1_LIVE_RERUN = clusterB-B1-live-rerun-004 / COMPLETED
```

B0 exact browser proof:
- RGBA8 PNG decoded into existing `color-raster / ink-image-state`;
- native editable `image + rasterState` rendered through the existing renderer;
- Preview completed;
- scoped History, Undo and Redo completed.

B1 exact candidate and formal Live proof:
- `raster.import / import_ink_raster` is discoverable; Live named-tool count increased to 23;
- browser-local PNG attachment reused `normalizeChatAttachment()`;
- formal Live imported `rose-window-primary.png` as a 1086×1448 native editable image;
- stable created ref and source SHA-256 receipt returned;
- History entry `匯入可編輯影像` created;
- content Preview completed at 607×800 output from 1134×1496 content bounds;
- Undo reduced context to zero objects;
- Redo restored the same editable native image;
- ReferenceImage semantics remain locked/separate;
- public result does not return raw binary/data URL.

The first three formal Live attempts stalled before Public API installation while the exact-SHA jsDelivr module graph was still loading. Extended readiness + protocol diagnostics confirmed this was deployment transport/readiness variability rather than a B1 operation failure; the same exact deployed source subsequently completed the full B1 Live sequence.

Current Cluster B sequence:

```text
B0 WEB RASTER BRIDGE = PASS / MERGED
B1 PNG-JPEG-WEBP MUTABLE RASTER NAMED TOOL = PASS / MERGED / LIVE QUALIFIED
PSD-TIFF-EXR-RAW CHAT INGEST = STILL OPEN
B2 NON-DESTRUCTIVE IMAGE STACK = NEXT
B3 LOCAL/DESTRUCTIVE RASTER + MASKS = LATER
B4 PATH DEFORMATION = OPEN
C019 TEXT WARP = PRODUCT RENDER-INTEGRATION GAP
```

### C — Layout Assist / Page / Artboard

Families:
C02 C05 C08 C09

Cases:
C001 C002 C003 C008

Source audit:
`working/INK_LIVE_CLUSTER_C_LAYOUT_PAGE_ARTBOARD_SOURCE_AUDIT_20261002.md`

Disposition:

```text
PAGE CREATE / DELETE / DUPLICATE / RENAME / SWITCH = PRODUCT EXISTS / CHAT EXPOSURE GAP
ALIGN / DISTRIBUTE X-Y = PRODUCT EXISTS / CHAT EXPOSURE GAP
SMART SNAP / EQUAL DISTANCE / ANGLE SNAP = PRODUCT EXISTS / CHAT EXPOSURE GAP
RULER GUIDES = PRODUCT EXISTS / CHAT EXPOSURE GAP
ARTBOARD STATE / MUTATION = PRODUCT EXISTS / CHAT EXPOSURE GAP
ARTBOARD OUTPUT = PRODUCT EXISTS / PARTIALLY ALREADY CHAT-EXPOSED
NEW DOCUMENT ARCHITECTURE = SEPARATE USER-GATED SCOPE
```

No new layout/page/snapping/artboard engine is required.

Smallest coherent exposure packages:
- C1 page operations;
- C2 explicit-ref align/distribute using existing `alignSelection()`;
- C3 snap/guide page operations through existing precision-layout authority;
- C4 artboard state mutation through existing `changeArtboard()`.

Do not fold New Document/A4 redesign, C04 workspace, C06 zoom, History redesign, Raster or Drawing work into Cluster C.

### D — Reusable Creative Assets

Families:
C39 Material / C55 Recipe

Cases:
C001 C002 C007 C008 C013

Source audit:
`working/INK_LIVE_CLUSTER_D_MATERIAL_RECIPE_SOURCE_AUDIT_20261002.md`

Disposition:

```text
CREATIVE LIBRARY SEARCH = WORKING AS DESIGNED
FRESH MATERIAL CATALOG = EMPTY BY DEFAULT
MATERIAL TEMPLATE / INSTANCE ENGINE = PRODUCT EXISTS
FLOWER_BATCH_01 VALIDATED TEMPLATES = PRODUCT EXISTS / NOT BOOTSTRAPPED
PATH MATERIAL APPLY = CHAT-EXPOSED / CATALOG-DEPENDENT / LIMITED TO CURRENT PATH-APPEARANCE SEMANTICS
FRESH RECIPE CATALOG = EMPTY BY DEFAULT
GENERIC RECIPE ENGINE = PRODUCT EXISTS / NOT CHAT-GOVERNED
FLORA PAINTING RECIPE RUNTIME = PRODUCT EXISTS / HISTORY-ATOMIC / NOT CHAT-EXPOSED
RECIPE CREATIVE-LIBRARY REUSE = READ-ONLY BY DESIGN
```

Smallest coherent repairs:
- D1 bounded Material template/instance creation over existing material library, chosen by actual case semantics rather than arbitrary catalog seeding;
- D2 read-only inventory bridge for existing Recipe registries;
- D3 one CHAT-governed execution entrypoint over one existing Recipe engine, with no third recipe engine.

Do not use External Workflow Translation / Workflow IR R&D to disguise the current C55 Live gap.

## Round 1 source-audit completion checkpoint — 2026-10-02

All four Round 1 gap clusters now have source-audit classification:

- Cluster A — Drawing / Natural Media
- Cluster B — Raster / Effects / Deformation
- Cluster C — Layout / Page / Artboard
- Cluster D — Material / Recipe

The audit phase no longer treats every missing Live route as a product capability gap. Existing native authorities and true integration/render gaps are separated in the four working audit records.

Accepted repair progression:
- Cluster A A1 Paint Session: merged / deployed / Live PASS.
- Cluster B B0 web-raster bridge: merged / exact browser PASS.
- Cluster B B1 mutable PNG/JPEG/WebP raster import: merged / deployed / Live PASS.

Next engineering should proceed with B2 non-destructive image-stack exposure by smallest coherent operation + exact candidate QA, not another breadth scan.

## Current next stage

Do NOT begin full artwork reproduction yet.

Next sequence:

```text
Round 1 complete
→ source-audit clusters A–D
→ define smallest coherent repair packages
→ repair in INK-Browser-QA under current governance
→ focused verification
→ publish accepted exact SHA to thedoorw/INK
→ rerun PARTIAL / NOT_EXPOSED cases
→ Round 2 combined-capability tests
→ representative complete artworks
```

Priority order:

1. Cluster A — Drawing / Natural Media
2. Cluster B — Raster / Effects / Deformation
3. Cluster C — Layout Assist / Page / Artboard
4. Cluster D — Material / Recipe

## Recovery rule

At the start of a new window, read live GitHub state again. Do not assume this progress file is newer than:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `thedoorw/INK/BUILD_INFO.json`
- `thedoorw/INK/TEST_FINDINGS.md`
- `thedoorw/INK/CASE_SWEEP.md`

If those conflict, current GitHub evidence wins.

## B2 incremental qualification — adjustment / brightnessContrast — 2026-10-02

```text
B2_ADJUSTMENT_PR = #121 / MERGED
B2_ADJUSTMENT_EXACT_CANDIDATE = 4df08a4498723cfec19b825b1df9eb3ecb0ae7ea
B2_ADJUSTMENT_SOURCE_INTEGRATION = 11551eab8c1ec78e04031f178b7ab24b91b40d26
B2_ADJUSTMENT_CANDIDATE_QA = live-raster-adjustment-candidate-001 / PASS
B2_ADJUSTMENT_LIVE = clusterB-B2-adjustment-live-002 / PASS
B2_ADJUSTMENT_COVERAGE = brightnessContrast QUALIFIED
B2_FILTER = NEXT
B2_BLEND = OPEN
B2_EFFECT = OPEN / prior over-broad candidate had unqualified render delta
B2_LIQUIFY = OPEN
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT uses existing `propose_ink_edit → approve_ink_edit → execute_ink_edit` authority; no second raster model, renderer, History or effect engine was added.
- target is the existing editable native `image + rasterState.colorRaster`; ReferenceImage remains locked/separate.
- native `createAdjustment('brightnessContrast')` stack mutation produced a renderer fingerprint change `fnv1a32:34d01658 → fnv1a32:17debb38`.
- scoped History added `CHAT add image adjustment: brightnessContrast`.
- Preview completed; Undo restored renderer fingerprint `fnv1a32:34d01658`; Redo restored `fnv1a32:17debb38`.
- first formal Live attempt timed out before Public API readiness on the same exact deployed SHA with no window/module exception or HTTP failure; warm rerun completed the full operation chain.
- superseded over-broad PR #120 was closed unmerged. Filter / blend / effect / Liquify require separate qualification and are not covered by this PASS.

## B2 incremental qualification — filter / gaussianBlur — 2026-10-02

```text
B2_FILTER_PR = #122 / MERGED
B2_FILTER_EXACT_CANDIDATE = c7a0b08e43d3410811efdd5532571002a1acb478
B2_FILTER_SOURCE_INTEGRATION = e2ce5e409f42c992bcf411e5e23d8f02435b1a63
B2_FILTER_CANDIDATE_QA = live-raster-filter-candidate-001 / PASS
B2_FILTER_LIVE = clusterB-B2-filter-live-002 / PASS
B2_FILTER_COVERAGE = gaussianBlur QUALIFIED
B2_ADJUSTMENT = brightnessContrast QUALIFIED
B2_BLEND = NEXT
B2_EFFECT = OPEN / prior over-broad candidate had unqualified render delta
B2_LIQUIFY = OPEN
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT reuses existing `createFilter('gaussianBlur')`, native image `filterStack`, scoped History and existing Renderer.
- exact candidate browser QA changed canvas hash `7883b22 → a9f6be1d`; Undo/Redo restored those exact hashes.
- formal Live renderer fingerprint changed `fnv1a32:34d01658 → fnv1a32:c6017f2e`.
- History added `CHAT add image filter: gaussianBlur`.
- Undo restored `fnv1a32:34d01658`; Redo restored `fnv1a32:c6017f2e`.
- first formal Live attempt timed out before Public API readiness on the same deployed SHA; no filter operation ran and no product failure was observed. Warm rerun completed the full chain.
- blend / effect / Liquify remain unqualified and do not inherit this PASS.

## B2 incremental qualification — blend / multiply — 2026-10-02

```text
B2_BLEND_PR = #123 / MERGED
B2_BLEND_EXACT_CANDIDATE = db9ac524aee1f1bf7fc8fe613e75bfb93088a3ec
B2_BLEND_SOURCE_INTEGRATION = 789e9efb77d1edaac15420483c9ce71dd43f414b
B2_BLEND_CANDIDATE_QA = live-raster-blend-candidate-001 / PASS
B2_BLEND_LIVE = clusterB-B2-blend-live-002 / PASS
B2_BLEND_COVERAGE = multiply QUALIFIED
B2_ADJUSTMENT = brightnessContrast QUALIFIED
B2_FILTER = gaussianBlur QUALIFIED
B2_EFFECT = NEXT / prior dropShadow combined QA was not renderer-observable
B2_LIQUIFY = OPEN
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT reuses existing image `blendMode`, existing IMAGE_CAPABILITIES blend-mode allowlist, scoped History and Renderer compositing.
- candidate used two overlapping native editable rasters so blend semantics were renderer-observable; `multiply` changed canvas hash `7883b22 → a24287ef`.
- formal Live imported the same editable raster twice; `image.blend.set.v1` changed renderer fingerprint `fnv1a32:34d01658 → fnv1a32:89aa5042`.
- History added `CHAT set image blend: multiply`.
- Undo restored `fnv1a32:34d01658`; Redo restored `fnv1a32:89aa5042`.
- first formal Live attempt timed out before Public API readiness on the same exact deployed SHA; warm rerun completed the full chain.
- effect / Liquify remain unqualified and do not inherit this PASS.

## B2 incremental qualification — effect / colorOverlay — 2026-10-02

```text
B2_EFFECT_PR = #124 / MERGED
B2_EFFECT_EXACT_CANDIDATE = dcc5d45851f00b6f809852c5cabc5e53c3bdae09
B2_EFFECT_SOURCE_INTEGRATION = 9d73a8018c0c37861aa3c76412951eb26bf78e62
B2_EFFECT_CANDIDATE_QA = live-raster-effect-candidate-001 / PASS
B2_EFFECT_LIVE = clusterB-B2-effect-live-003 / PASS
B2_EFFECT_COVERAGE = colorOverlay QUALIFIED
B2_ADJUSTMENT = brightnessContrast QUALIFIED
B2_FILTER = gaussianBlur QUALIFIED
B2_BLEND = multiply QUALIFIED
B2_LIQUIFY = NEXT
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT reuses existing `createLayerEffect()`, native image `effects`, `applyLayerEffects()`, scoped History and Renderer.
- candidate `colorOverlay` changed canvas hash `7883b22 → b6f7f8de`; Undo/Redo restored exact hashes.
- formal Live renderer fingerprint changed `fnv1a32:34d01658 → fnv1a32:7cd33282`.
- History added `CHAT add image effect: colorOverlay`.
- Undo restored `fnv1a32:34d01658`; Redo restored `fnv1a32:7cd33282`.
- prior dropShadow combined QA on a fully opaque bounded raster was not renderer-observable because the native shadow is composited behind the source inside fixed raster bounds; no new effect engine or renderer repair was required.
- first two formal Live attempts timed out before Public API readiness on the same exact deployed SHA; third warm run completed the full chain.
- Liquify remains unqualified and does not inherit this PASS.

## B2 incremental qualification — Liquify / twirl — 2026-10-02

```text
B2_LIQUIFY_PR = #125 / MERGED
B2_LIQUIFY_EXACT_CANDIDATE = 126073621dbf9cf44e12e55d77c1f145929f1147
B2_LIQUIFY_SOURCE_INTEGRATION = cc9b623258123da0e00e31a9e686357fba0d4ec0
B2_LIQUIFY_CANDIDATE_QA = live-raster-liquify-candidate-002 / PASS
B2_LIQUIFY_LIVE = clusterB-B2-liquify-live-003 / PASS
B2_LIQUIFY_COVERAGE = twirl QUALIFIED
B2_ADJUSTMENT = brightnessContrast QUALIFIED
B2_FILTER = gaussianBlur QUALIFIED
B2_BLEND = multiply QUALIFIED
B2_EFFECT = colorOverlay QUALIFIED
B2_OVERALL = PASS / FIVE PRIORITY OPERATION FAMILIES LIVE QUALIFIED
```

Qualification proof:
- CHAT reuses existing `createLiquifyFilter()`, native image `filterStack`, existing Liquify raster renderer and scoped History.
- exact candidate browser QA changed canvas hash `7883b22 → dc904cd1`; Undo/Redo restored those exact hashes.
- formal Live renderer fingerprint changed `fnv1a32:34d01658 → fnv1a32:755eb849`.
- History added `CHAT add image Liquify`; Preview completed; Undo restored `fnv1a32:34d01658`; Redo restored `fnv1a32:755eb849`.
- first two formal Live attempts timed out before Public API readiness on the same exact deployed SHA; no Liquify operation ran and no product failure was observed. Third warm run completed the full chain.
- no second raster model, Renderer, History or effect engine was introduced; ReferenceImage remains locked/separate.

B2 closure is representative operation-family qualification, not an assertion that every enum variant in every family has been exhaustively tested:

```text
B2 NON_DESTRUCTIVE_IMAGE_STACK = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
QUALIFIED_REPRESENTATIVE_CASES = brightnessContrast + gaussianBlur + multiply + colorOverlay + twirl
B3 = OPEN / LATER
B4 = OPEN
C019 = PRODUCT RENDER-INTEGRATION GAP
```

