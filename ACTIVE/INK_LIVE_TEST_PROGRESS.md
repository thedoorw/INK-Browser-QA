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

Observed:
Live CHAT registry exposes no brush / natural-media / paper / Blender / Smudge authority. C017 proves vector Path editing only; that is not accepted as a substitute.

Next action:
Source-audit existing native drawing authorities. If they exist, expose them through the bounded CHAT surface without creating duplicate drawing state.

### A source-audit checkpoint — 2026-10-02

Source audit:
`working/INK_LIVE_CLUSTER_A_DRAWING_NATURAL_MEDIA_SOURCE_AUDIT_20261002.md`

Disposition:

```text
GENERAL DRAWING / BRUSH SESSION = PRODUCT EXISTS / CHAT EXPOSURE GAP
NATIVE STROKE + AIRBRUSH = PRODUCT EXISTS / CHAT EXPOSURE GAP
PAPER PROFILE / MUTATION = PRODUCT EXISTS / CHAT EXPOSURE GAP
ERASER GEOMETRY = PRODUCT EXISTS / CHAT EXPOSURE GAP / SEPARATE BOUNDED DESIGN
BLENDER / SMUDGE = PRODUCT RENDER-INTEGRATION GAP
```

Draft bounded candidate:
- branch `work/ink-live-drawing-exposure-001`
- PR #112
- candidate HEAD `96d873d45ba86a4760a82648a9ee31972714b936`
- candidate operation `paint.session.create.v1`
- static syntax: PASS for the two changed modules
- runtime/browser qualification: NOT YET CLAIMED
- merge / Live promotion: HOLD under current required review and C04 integration sequence

The candidate does not expose Blender / Smudge / Eraser and does not create duplicate Document / History / Renderer / drawing authority.

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

Open candidate repair:
- B0 web-raster bridge: PR #114 / Draft / static QA only / no runtime PASS.

Next engineering should proceed by smallest coherent repair package + exact candidate QA, not another breadth scan.

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
