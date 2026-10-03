# INK Live Test — Current Progress

TYPE = ACTIVE STATUS / CROSS-WINDOW RECOVERY
AUTHORITY = STATUS ONLY / DOES NOT REPLACE ACTIVE WORK ORDER
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/

## B4 native Path deformation — closed 2026-10-03

USER authorized bounded extension of existing deformation Core, superseding the prior authority-mismatch STOP. No direct CHAT projective anchor mutation, second deformation model or FORMAT_VERSION change.

- PR #131 merged; exact accepted source: `468873503155f66585564a6ca7b11f7a82586d7a`.
- Exact final candidate: `938016b79e10c6ac1c06ad930be35a67654c381b`.
- Candidate and merge complete product/source tree: `8d35c9a8a3f69d2f51cf02703fd78b9d8b090e4b`; equivalence verified before publication.
- Live wrapper deployment commit: `a588bdb8a016a45dbd676f54e66a4b0f28d78e6d`.
- Final candidate request: clusterB-B4-final-candidate-regressions-003; run 37088355232; artifact 11261835640; digest sha256:c0ac8df74e4fa0288af4beb0e2d84e8e40d70e5070e1a5d20385cbb9952f8b15.
- Local required/focused regressions: 65/65 PASS, including existing deformation/reset and transform-advanced projective consumers.
- Exact candidate fresh-browser A1 Paint Session, A2 four-mode native Stroke, A3 Paper and B2 brightnessContrast: PASS.
- Formal Live request: clusterB-B4-warp-distort-perspective-live-001; request commit `e59bf09375295b0ae10a05db9494711b6aaf88a9`; run 37088553315; artifact 11261089242; digest sha256:4b56cf001a39fca1fd5b6d38ea6aa099fb2f1a044d4c933915f76808b47213c3.
- Live apiReady=true; exact accepted source verified; 23 named tools; no pointer emulation.
- Warp / Distort / Perspective each independently complete discovery → propose → approve → execute → stable native Path state → Canvas → History → Preview → exact Undo/Redo. Native reset and repeat-from-base compatibility probes PASS for all three.
- path.deformation retains type INK-NON-DESTRUCTIVE-DEFORMATION, baseSubpaths, JSON-safe inspectable parameters, reversible=true and revision. Projective point/handle mapping remains exclusively in existing deformation mutation authority; math/planning remains in transform-advanced.
- Distort moves two upper corners independently while retaining the lower edge; Perspective constrains opposing edge pairs. Same base Path and offsets produce different canonical mapping and subpaths.

| Operation | Canvas baseline → result | Preview baseline → result | Undo / Redo / reset |
| --- | --- | --- | --- |
| Warp | ca5e221b → ac22a30d | a94d0df7 → 08317eb1 | exact |
| Distort | ca5e221b → 4e17a235 | a94d0df7 → 9f578833 | exact |
| Perspective | ca5e221b → b1149dd5 | a94d0df7 → 5105c73e | exact |

Candidate and formal Live screenshots inspected: native filled/stroked Path visible in open document Canvas. Structured render/state evidence is preserved in `qa/evidence/live-b4-20261003/`; MR acceptance is `working/INK_LIVE_B4_NATIVE_DEFORMATION_MR_REVIEW_20261003.md`.

```text
B4_WARP = PASS / LIVE QUALIFIED
B4_DISTORT = PASS / LIVE QUALIFIED
B4_PERSPECTIVE = PASS / LIVE QUALIFIED
DISTORT_RESULT != PERSPECTIVE_RESULT
B4 = CLOSED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
A1_A2_A3_B2_REGRESSIONS = PASS
FORMAT_VERSION = 4 / UNCHANGED
TEXT_DEFORMATION = OUTSIDE_SCOPE / NOT_QUALIFIED
C1_C2_LAYOUT = SEPARATE / NOT_CLOSED_BY_B4
```

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

Follow-up geometry issue — CLOSED 2026-10-03:

```text
PR = #126 / MERGED
EXACT_CANDIDATE = b7c73f7ea32a25013dddd9721e1a35e7e052fc26
SOURCE_INTEGRATION = be6baa7085b9520a67e0952968650d4648af4d0a
LIVE_DEPLOYED_SOURCE = be6baa7085b9520a67e0952968650d4648af4d0a
LIVE_RERUN = paint-session-bounds-live-rerun-003 / COMPLETED
RESULT = PASS / REPAIRED
```

The repair routes native Paint Session replay geometry through existing `strokeBoundingBox` and Renderer world-bounds authority. Formal Live evidence returned content bounds `x=-135.13 y=-120.46648 w=274.0064 h=231.12032`; Undo returned zero objects; Redo restored the same native Paint Session and identical render fingerprint `fnv1a32:1b8d3443`.

The first two Live retries stopped before Public API readiness while the newly pinned exact-SHA jsDelivr module graph was propagating. They executed no product operation and are classified as transport/readiness variability, not product regression.

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



## TEST A — Drawing / Natural Media qualification checkpoint — 2026-10-03

Formal test record:
`working/INK_TEST_A_DRAWING_NATURAL_MEDIA_QUALIFICATION_20261003.md`

```text
DEPLOYED_SOURCE_SHA = cc9b623258123da0e00e31a9e686357fba0d4ec0
LIVE_REPO_HEAD_AT_TEST = 145a00587bcc6dbc9717b05179f2c5e131a5b587

A2_NATIVE_STROKE = EXPOSURE_GAP
NATURALMEDIA = EXPOSURE_GAP AT stroke.create.v1 ENTRYPOINT
AIRBRUSH = EXPOSURE_GAP AT stroke.create.v1 ENTRYPOINT
A3_PAPER = EXPOSURE_GAP
A1_REGRESSION = PASS
```

Formal Live evidence:
- `clusterA-A2-native-stroke-discovery-live-001` → `stroke.create.v1` not discoverable / `INK_CAPABILITY_NOT_FOUND`;
- `clusterA-A3-paper-discovery-live-001` → `page.paper.set.v1` not discoverable / `INK_CAPABILITY_NOT_FOUND`;
- `clusterA-A1-regression-live-001` → current Live source created one native `paint-session`, one scoped History entry, completed Preview, Undo removed the object, Redo restored the same object and exact Preview fingerprint `fnv1a32:a6535881`.

No Core/UI/FORMAT_VERSION change was made. No pointer/mouse simulation was used.

Current Cluster A test disposition:

```text
A1 = PASS / REGRESSION CLEAN
A2 = BLOCKED AT CHAT EXPOSURE
A3 = BLOCKED AT CHAT EXPOSURE
A4 = NOT IN THIS TEST PACKAGE
A5 = NOT IN THIS TEST PACKAGE / existing product integration classification unchanged
```

## A2 native Stroke / Natural Media — Live closure 2026-10-03

- Source: `d0248e9661cc242081507e4bf73fc8b73aeb6256` (PR #127).
- Request: `clusterA-A2-native-stroke-live-002`; request commit `fce87d4a853d9e209665cb581a33e024cf74bf63`.
- Result commit: `e1967d7342a3b72f9bba72e683d1a4a92d863e9e`.
- Hosted run: `37041501266`; artifact: `11242318263`, digest `sha256:542d205593213f8f79a7471435cc31bdd598c33faa8c23a9923234f9476a9ef8`.
- `apiReady=true`; exact source verified; 23 named tools.
- Pencil / Brush / Airbrush / DryBrush proposal → approval → execution: PASS.
- Four native Stroke objects / four scoped `CHAT create Stroke` entries.
- Content Preview: 451×351; bounds `x=-233.6 y=-182 w=451 h=350.6`; fingerprint `fnv1a32:28606ccc`.
- Four Undo operations remove all strokes; four Redo operations restore identical stable refs and Preview fingerprint.
- Preserved result: `qa/evidence/live-a2-20261003/ink-live-chat-result.json`.
- Candidate QA separately proved existing NaturalMediaController/WebGL path, Canvas delta, A1 and B2 brightnessContrast regression.
- Live runner screenshot captures the shell with no open document canvas; no live visible-canvas screenshot PASS is inferred from that screenshot. Renderer-backed content Preview and candidate Canvas evidence establish the tested rendering path.
- Initial `-001` stopped before readiness with new exact-SHA module transport failures; same-source warm `-002` completed.

```text
A2 = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
A3_PAPER = NEXT / EXPOSURE_GAP
A4_ERASER = SEPARATE
A5_BLENDER_SMUDGE = SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
```

## A3 Paper exposure — accepted / deployed / Live qualified 2026-10-03

PR #128 merged. Exact tested candidate: `1afb52a9c6fc77f5f121f5b7e8d9be2c626006be`; merged/deployed source: `ab84aafc3006f0f14a74d231ca862200bd0b5d94`. Complete product/source tree equals `30d55495650acd365acc2b1e92c7669fa01f1870` for candidate and merge. Live wrapper deployment commit: `8d2fba408efc205c903efaae24a958440a6a71b1`.

- Formal Live request: `clusterA-A3-paper-live-001`; request commit `e64806bf08bcdc2c26c5fd3323af8c78b474356a`; result commit `d85cd4a766a18cdd526ccc54354c6f7f52b93573`.
- Hosted run `37085274905`; artifact `11260127110`; digest `sha256:ad69149bf5c08577a1908e8b370584a777b2f41f050618e537aeb0e4dedc4df1`.
- Exact source verified; apiReady=true; 23 named tools; no pointer emulation.
- `page.paper.set.v1` uses existing InkApp.changePaper and native scoped History. Roughness .42→.95, absorbency .58→.05; normalized paper receipt returned.
- Two native adjacent Brush/DryBrush strokes; two Stroke History entries plus two scoped `調整畫布` entries.
- Transparent content Preview `fnv1a32:dd280788→fnv1a32:20df496f`; two Undo restore `dd280788`; two Redo restore `20df496f`. Two stable native Stroke objects remain.
- Candidate Paper QA, A2 four-mode Stroke, A1 Paint Session and B2 brightnessContrast regressions PASS. Invalid/no-op/stale/pending-preview safety checks PASS.
- Evidence: `qa/evidence/live-a3-20261003/`; source review: `working/INK_LIVE_A3_PAPER_MR_REVIEW_20261003.md`.

Explicit separate confirmed gaps, retained outside this exposure closure:
1. `PAPER_SINGLE_STROKE_RENDER_INTEGRATION`: single native stroke uses renderStroke without page.paper; paper-coupled renderStrokeRun requires 2+ adjacent Brush/DryBrush strokes. Single-stroke candidate probe FAIL is preserved. Classification PRODUCT_RENDER_INTEGRATION_GAP.
2. `PAPER_WEBGL_ROUGHNESS_PARITY`: roughness state changes but roughness-only transparent Preview is unchanged in the tested WebGL multichannel backend; source GPU simulation has no dedicated roughness uniform whereas Canvas2D paper-field resistance consumes roughness. Classification PRODUCT_RENDER_INTEGRATION_GAP / backend parity. No all-field or all-backend completeness claim.

```text
A2_NATIVE_STROKE = PASS / LIVE QUALIFIED
A3_PAPER_EXPOSURE = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
A3_PAPER_RENDER_QUALIFIED_SUBSET = TWO-OR-MORE ADJACENT BRUSH/DRYBRUSH / ABSORBENCY
PAPER_SINGLE_STROKE_RENDER_INTEGRATION = OPEN / CONFIRMED
PAPER_WEBGL_ROUGHNESS_PARITY = OPEN / CONFIRMED
A4_TARGETED_ERASER = OPEN / SEPARATE
A5_BLENDER_SMUDGE = OPEN / SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
FULL_NATURAL_MEDIA_COMPLETENESS = NOT_CLAIMED
```


## Combined Capability Qualification — Draw + Reference closure — 2026-10-03

Formal record:
`working/INK_COMBINED_CAPABILITY_QUALIFICATION_20261003.md`

Evidence manifest:
`qa/evidence/combined-capability-20261003/evidence-manifest.json`

Authority:
```text
QA_MAIN_BEFORE_COMBINED = d26539b3c98c11bf0d1da55b190ff5937b2a0f70
LIVE_WRAPPER_AT_TEST = 8d2fba408efc205c903efaae24a958440a6a71b1
DEPLOYED_PRODUCT_SOURCE = ab84aafc3006f0f14a74d231ca862200bd0b5d94
EVIDENCE_CHECKPOINT_BEFORE_PROGRESS_RECORD = 800b428d7fb2238c856f73195f7d1aabae5d8825
PRODUCT_MUTATION = NONE
```

### INK-QA-C Draw

```text
REQUEST = ink-qa-c-draw-combined-001
REQUEST_COMMIT = b6033cc2f8b107844084ce5cfd11b6f4cb3e4a0d
RESULT_COMMIT = f50c885ed80a0056dd9df098879e9473b3e5f071
RUN = 37086517849
ARTIFACT = 11261115603
RESULT = PASS
```

Combined native drawing route completed:
Paper → Brush Stroke → DryBrush Stroke → Preview/Context/History → CHAT Airbrush correction → Preview → Undo → Redo → final verification → PNG output.

Renderer fingerprints:
`fnv1a32:287f934e → fnv1a32:eb357f3b → Undo 287f934e → Redo eb357f3b`.

Final native state: 3 editable Stroke objects; final History: 4 scoped entries; A4 PNG output fingerprint `fnv1a32:73678494`.

Known A3 gaps remain open but did not block this qualified route:
- `PAPER_SINGLE_STROKE_RENDER_INTEGRATION`
- `PAPER_WEBGL_ROUGHNESS_PARITY`

### INK-QA-B Reference

```text
REQUEST = ink-qa-b-reference-combined-001
REQUEST_COMMIT = 61cb1278f4f84a79fe58396570b5509ab10a5ee5
RESULT_COMMIT = d889043a6d653ea96946f1643e9ddf6c150e696b
RUN = 37086642087
ARTIFACT = 11261355427
RESULT = PASS
```

Combined reference route completed:
Reference intake → editable raster import → inspect → translate → Preview → baseline Revision → CHAT brightness/contrast correction → Preview → corrected Revision → History → Undo/Redo → final verification → PNG output + output inspection.

Native separation is preserved:
- locked/non-editable Reference: `7d9ce64f-9374-4793-9317-37adc78cd00e-reference`;
- mutable native image: `7892c1c0-7b53-4ffd-90e5-e9586bc60a32`, 1086×1448, editable.

Renderer fingerprints:
`fnv1a32:c3bd4f5f → fnv1a32:f279be47 → Undo c3bd4f5f → Redo f279be47`.

Revision chain:
- r1 `ink-rev:7cee1722:r1:efc3c675:163505a7`;
- r2 `ink-rev:7cee1722:r2:164a463d:7fe7d877`.

Final History: 4 scoped entries; A4 PNG output fingerprint `fnv1a32:0e7e514b`.

```text
INK_QA_C_DRAW_CLOSURE = PASS
INK_QA_B_REFERENCE_CLOSURE = PASS
COMBINED_CAPABILITY_QUALIFICATION = PASS
ROUND_2_COMBINED_DRAW_REFERENCE = CLOSED
NEW_PRODUCT_CAPABILITY = NONE
```


## A4 targeted Eraser — merged / deployed / formal Live qualified 2026-10-03

This closure supersedes earlier `A4_TARGETED_ERASER = OPEN / SEPARATE` markers.

Classification:
```text
A4_TARGETED_ERASER = PRODUCT EXISTS / CHAT EXPOSURE GAP → REPAIRED
A5_BLENDER_SMUDGE = OPEN / SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
```

Authority and source:
- Existing geometry authority retained: `eraseStrokeWithCircle()` in `src/stroke/edit.js`.
- New bounded operation: `stroke.erase.circle.v1`.
- Explicit stable native Stroke targets only; no CHAT hit-test, pointer/mouse simulation, or area-wide `eraseAt()`.
- Existing proposal/approval target fingerprints and revision checks provide stale protection.
- Existing scoped History, document replacement, spatial invalidation and Renderer refresh are reused.
- PR #136 merged.
- Exact final candidate: `daff9553dfc8c433eadc6ee2119703c9770b49a6`.
- Merged/deployed source: `3ab58f771f927f50d4548c40ca153834df08600d`.
- Product diff limited to `product/source/src/editor/chat-bounded-edit.js` and `product/source/src/agent/capability-registry.js`.
- UI unchanged; FORMAT_VERSION unchanged.

Candidate qualification:
- Request `clusterA-A4-targeted-eraser-candidate-006-regressions`: PASS.
- one explicit native Pencil Stroke → two native Stroke fragments.
- Candidate Canvas `52e1086e → f8fd8c45`.
- Candidate Preview `fnv1a32:482bfe2b → fnv1a32:786ce305`.
- exact Undo/Redo restoration.
- stale target: `CHAT_EDIT_TARGET_STALE`; no-op: `CHAT_EDIT_NO_OP`.
- exact-SHA A1 Paint Session, A2 native Stroke/NaturalMedia, A3 Paper, B2 brightnessContrast regressions: PASS.

Formal Live:
- Request: `clusterA-A4-targeted-eraser-live-001`.
- Request commit: `9d1b2fc843ca884fe8de7a54178ada135ab0b391`.
- Result commit: `5009f13bcbc95a29910886d399f383229150e1b3`.
- Hosted run: `37091594541`.
- Artifact: `11262089933`; digest `sha256:cf8c1f4f0108aee825138531a8f0f03b6630f35b9e49367c2bec6002d3d70da1`.
- runtime exact source verified; `apiReady=true`; 23 named tools.
- source Stroke: `live-a4-source-stroke`.
- erased fragments: `chat-erase-fnv1a32-06181049`, `chat-erase-fnv1a32-24a2dcee`.
- History: scoped `CHAT erase Stroke`.
- Live Preview `fnv1a32:482bfe2b → fnv1a32:786ce305`; Undo restored `482bfe2b`; Redo restored `786ce305` and identical fragment refs.
- stale proposal rejected during approval with `CHAT_EDIT_TARGET_STALE`.
- non-intersecting eraser execute rejected with `CHAT_EDIT_NO_OP`.

```text
A4_TARGETED_ERASER = PASS / CLOSED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
NEXT_DRAWING_GAP = A5_BLENDER_SMUDGE
SECOND_AUTHORITY = NONE
POINTER_SIMULATION = NONE
FORMAT_VERSION_CHANGE = NONE
```


## A5 Blender / Smudge — merged / deployed / formal Live qualified 2026-10-03

This closure supersedes earlier `A5_BLENDER_SMUDGE = OPEN / PRODUCT_RENDER_INTEGRATION_GAP` markers.

Classification:
```text
A5_BLENDER_SMUDGE = PRODUCT_RENDER_INTEGRATION_GAP → REPAIRED
GPU_MIXER_TRANSPORT_PARITY = SEPARATE / NOT QUALIFIED
PAINT_SESSION_MIXERS = SEPARATE / NOT QUALIFIED
```

Authority and source:
- existing native Stroke / NaturalMediaController / multi-channel Renderer / History remain authoritative;
- Blender/Smudge are run-only native `type:'stroke'` kinds with `mediaModel:'natural-v2'`;
- a mixer run must contain at least one real Brush/DryBrush depositor;
- Blender mixes existing local pigment; Smudge transports existing pigment/water along stroke direction;
- mixer runs currently use the existing Canvas2D multi-channel surface; ordinary Brush/DryBrush retains the existing WebGL2 multi-channel route;
- isolated mixer Strokes do not fall back to generic color-stroke rendering;
- Paint Session Blender/Smudge remains intentionally excluded;
- no pointer emulation, second renderer/document/history authority, UI change, or FORMAT_VERSION change.

Source qualification:
- PR #137 merged.
- exact accepted candidate: `f351c788e57b7d5ad034f156711d47d431179669`.
- merged/deployed source: `20b06020bbb6b6142dc1f6952ebf26e14ed268dd`.
- candidate request: `clusterA-A5-blender-smudge-candidate-001-regressions`.
- candidate result commit: `8707060ceca34bddcdeea8b92891621e61623082`.
- candidate run: `37093732538`; artifact `11263473338`; digest `sha256:b4c60f4ac1ca0a94e1c9b7dd380f67815c09521abce2500536d286e370696ef6`.
- A5 primary case PASS:
  - baseline Preview `fnv1a32:1c7b7b41`;
  - after Blender `fnv1a32:3e594331`;
  - after Smudge `fnv1a32:06e7d736`;
  - exact Undo/Redo restoration;
  - backend `canvas2d-multichannel`;
  - 288 mixer stamps;
  - `transportedPigment=192521.06028555412`.
- exact-SHA regressions A1 Paint Session / A2 native Stroke & NaturalMedia / A3 Paper / B2 brightnessContrast: PASS.
- A2/A3 diagnostics retained `webgl2-multichannel` and `mixingRuns=0`, so ordinary natural-media routing did not regress.

Formal Live:
- initial request `clusterA-A5-blender-smudge-live-001` stopped at the exact-source identity gate while Pages still served prior A4 source; no A5 operation ran.
- successful request: `clusterA-A5-blender-smudge-live-002`.
- request commit: `d3d11b945a7b26b1fab90eb0260bd21c8eb77962`.
- result commit: `70796c30ff51aa59f41610e63a4c0ab7ac0e7149`.
- hosted run: `37094249144`.
- artifact: `11262658859`; digest `sha256:36ebea21ea56085bcc3fa6acfd671c041c087435810f9ff9776ee4bc72e1d938`.
- exact runtime source verified; `apiReady=true`; 23 named tools.
- final native objects: `live-a5-red`, `live-a5-blue`, `live-a5-blender`, `live-a5-smudge`.
- final History: 4 scoped `CHAT create Stroke` entries.
- Live Preview:
  - baseline `fnv1a32:c182394c`;
  - Blender `fnv1a32:d2f80729`;
  - Smudge `fnv1a32:9a547b82`;
  - Undo Smudge → `d2f80729`;
  - Undo Blender → `c182394c`;
  - Redo Blender → `d2f80729`;
  - Redo Smudge → `9a547b82`.

```text
A1_PAINT_SESSION = PASS / CLOSED
A2_NATIVE_STROKE = PASS / CLOSED
A3_PAPER = PASS / CLOSED
A4_TARGETED_ERASER = PASS / CLOSED
A5_BLENDER_SMUDGE = PASS / CLOSED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
CLUSTER_A_DRAWING_NATURAL_MEDIA = CLOSED FOR QUALIFIED CHAT ROUTES
GPU_MIXER_TRANSPORT_PARITY = FOLLOW-UP ONLY
PAINT_SESSION_MIXERS = FOLLOW-UP ONLY
SECOND_AUTHORITY = NONE
FORMAT_VERSION_CHANGE = NONE
```


## B3.1 Paint Bucket — merged / deployed / formal Live qualified 2026-10-03

Classification:
```text
B3_PAINT_BUCKET = PRODUCT EXISTS / CHAT EXPOSURE GAP → REPAIRED
B3_OVERALL = PARTIAL
```

Authority:
- existing `paintBucketFill()/magicWandSelection()` remains the direct pixel algorithm authority;
- explicit one-image stable target only;
- mutation stays on the same native `image + rasterState.colorRaster`;
- current qualified direct-raster format is 8-bit RGB, matching the existing UI raster-tool controller boundary;
- existing proposal/approval target fingerprint checks and scoped History are reused;
- ReferenceImage remains locked/separate;
- no pointer emulation, automatic target discovery, second raster model, Renderer, History authority, UI change, or FORMAT_VERSION change.

Source/candidate:
- PR #138 merged.
- exact candidate: `fedb8f62fa8cf21e3499c8307cfae77cc8714709`.
- merged/deployed source: `d64aa172ef6d4f3c100642aec8bcc4195c33b2dd`.
- candidate request: `clusterB-B3-paint-bucket-candidate-001-regressions`.
- candidate run `37095914689`; artifact `11264745413`; digest `sha256:3d53c83795091f6bd30b86288e0f0060e5541036016893f822c5878d945fe4a5`.
- raster pixels `376ec6fb → b09ebd5b`; candidate Preview `4d9848b1 → f1a6f9ad`; exact Undo/Redo.
- 1296 changed pixels / 3888 changed channels.
- no-op rejected; locked Reference rejected.
- B1 / B2 brightnessContrast / A5 exact-SHA regressions PASS.

Formal Live:
- request `clusterB-B3-paint-bucket-live-001`.
- request commit `3136512412e18b75a1fdfa4b4f5b97e33b3b7930`.
- result commit `1be581b462722c2f2f45c46eb9375ed4c60d9409`.
- run `37096080332`; artifact `11264177272`; digest `sha256:59cbf99f55fc5dfdc698f4c135592e1dcd0d31923199569b8948352a9bd44c2c`.
- exact source verified; `apiReady=true`; 23 named tools.
- Live Preview `fnv1a32:34d01658 → fnv1a32:bfcf7afe`; Undo `34d01658`; Redo `bfcf7afe`.
- 13 pixels / 39 channels changed; selection bounds x=2 y=2 w=5 h=5.
- History contains native editable-raster import + scoped `CHAT raster Paint Bucket`.
- same-color repeat rejected `CHAT_EDIT_NO_OP`.

```text
B3_PAINT_BUCKET = PASS / CLOSED / MERGED / DEPLOYED / FORMAL LIVE QUALIFIED
NEXT_B3 = RASTER_MASK
B3_LOCAL_RETOUCH_FAMILIES = OPEN / SEPARATE
SECOND_AUTHORITY = NONE
FORMAT_VERSION_CHANGE = NONE
```
