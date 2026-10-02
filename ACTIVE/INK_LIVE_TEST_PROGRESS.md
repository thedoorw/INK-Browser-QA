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

### C — Layout Assist / Page / Artboard

Families:
C02 C05 C08 C09

Cases:
C001 C002 C003 C008

Observed:
Core Frame/Layout/Transform paths work, but page mutation, artboard/print, smart-guide/snapping and align/distribute coverage remains incomplete.

Next action:
Source-audit existing authorities and expose only accepted native routes.

### D — Reusable Creative Assets

Families:
C39 Material / C55 Recipe

Cases:
C001 C002 C007 C008 C013

Observed:
Material and Recipe Creative Library searches can return zero entries in a fresh Live document. Material apply operation exists, but immediately reusable CHAT-visible assets are not established.

Next action:
Determine whether the gap is catalog population, creation route, or exposure.

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
