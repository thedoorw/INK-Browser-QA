# SUP-08–SUP-11 — DEV Return — 2026-10-02

Status: IMPLEMENTED CANDIDATE / STOP — Supervisor / USER review required. No final UI or Photoshop fidelity PASS.

Authority: USER explicitly requested SUP-08–SUP-11 in this turn; `working/INK_UI_MICRO_MODULE_NORMALIZATION_SUPERVISOR_REVIEW_20261002.md` read initially at main `80a1016f1ba39ae75f401929bd8892b3bd5f023c` and rechecked through `3245136e91954fd6f802906668197a66b8ca634c` (including its reference-measured cluster requirement), current Work Order and normalized micro-module grammar. This request authorizes the bounded Tool → Options exposure that the earlier refinement-only dispatch deferred. It does not authorize new capabilities.

## SUP-08 — concrete source execution

Recovered the previously unpushed local refinement, re-applied it to current-main source and produced entirely fresh before/after evidence. Shared fixed rows use common line-height, flex/grid optical alignment and text-edge trimming. Shared truncation clips horizontally while keeping complete CJK glyph ink visible. No per-label vertical offsets.

41 sampled Reference/Layers text envelopes have maximum absolute row-center delta 1.015625 px in the declared 1280×1024, DPR1, Chromium153 / Noto Sans TC400 / CPU Canvas environment. Both CJK truncation samples preserve their complete glyph envelopes. This is approximately one raster pixel, not a universal cross-platform font guarantee.

## SUP-09 — shared window control unit

Measured Photoshop outer border x1174–1276 / y0–18 inclusive (CSS-edge frame x1174, y0, width103, height19, right1277 at 1280×1024); before INK frame is x1175, width105, right1280. The shared 3 px end margin plus 27.5 px nominal non-close control width and 46 px close width now produce that same 103×19 outer frame, right edge1277. The 27.5 px shared control width is the average of the reference’s 28/27 px raster subdivision; no per-button positional patch is used. SVG wrappers remain common 12×12. Replaced heavy vector geometry with the shared 1-unit outline stroke, crisp raster rendering, no Unicode or per-button translation.

| Glyph | Before dark ink pixels | After dark ink pixels | Final inclusive raster bounds | Visible size |
| --- | ---: | ---: | --- | --- |
| Minimize | 30 | 10 | 1183,12–1192,12 | 10×1 |
| Restore | 76 | 45 | 1211,5–1221,14 | 11×10 |
| Close | 48 | 16 | 1249,5–1256,12 | 8×8 |

Window ink is thresholded at max RGB<210; text-row ink uses its separately declared threshold. The weight refinement follows the latest USER direction; final morphology is a visual checkpoint, not a claim that these new envelopes exactly equal every Photoshop OS/theme raster. The numeric source/current cluster comparison is attached in raster-summary.json. Native minimize/restore glyphs have naturally lower visible ink than close; the common wrapper/button grammar is preserved. Honest disabled browser window-control semantics remain.

## SUP-10 — discoverable prerequisite commands

Crop and Frame remain prerequisite-bound commands, not invented canvas tools. Removed selection-derived disable logic from their Tools shortcuts. Crop retains existing selectedRasterImage validation and crop dialog/History; Frame reports `請先選取要建立框架的物件` when empty, then uses the existing Compose/frameSelection route when a target exists.

Fresh real UI sequence uses the Lasso flyout, a blank-canvas gesture, then clicks Crop and Frame. Before: both disabled. After: both clickable with concise prerequisite feedback. Native target Frame and raster Crop execution and undo are also verified. No duplicate selection authority.

## SUP-11 — existing tools reconciled to Options

[Tool → Options matrix](INK_UI_TOOL_OPTIONS_EXPOSURE_MATRIX_20261002.md) records 40 tool/subtool variants plus command-only and node-edit routes.

- Moves original smoothing/pressure and applicable media rows into the Options host with native IDs/handlers intact.
- Moves the existing extra brush controls to the same host; retains kind-dependent taper/grain/softness.
- Reveals Shape size/opacity actually consumed by beginShape, keeps its existing type/fill controls, adds a projection to the native angle-snap handler, and synchronizes the active type from app.shapeType.
- Uses the existing Text writing-mode state and native font controls.
- Base Lasso / Select expose existing selection actions; no feather/tolerance/selection-mode parameters are invented for the native freehand lasso.
- Pan exposes native view commands. Blender/Smudge expose their existing replay/session route, not fake live brushes.
- Adds Gradient opacity, already consumed by gradientFill, to the adapter field list.
- Retains the shared raster-field renderer and validates numeric input. Avoids redundant change notification for an unchanged value, preventing a blur refresh from destroying the next field during continuous input.
- Active Lasso identity remains Lasso even with a selection; replay-tool identity derives from the existing capability state.

Representative created stroke, shape and text assertions prove control values reach native consumers. Raster consecutive opacity/tolerance input, preserved focus and switch persistence use the original adapter options. Persistent object/document parameters remain in their existing panels; no attempt to squeeze all 496 atomics into Options.

## Fresh verification / guard

- 40 runtime tool/subtool variants, 113 focused Options/interaction assertions.
- 23 matched whole-product states; 10 visual/behavior checks; 9 raster checks.
- Before/after viewport, Reference details/file names, Layers, single/dual Tools, dock collapse/resize, 960×800 and 390×844 included.
- Loaded responses match final candidate source bytes, no page/resource errors.
- Exactly 10 of 273 product files change; Core, renderer, native src/ink.js, History, FORMAT and all other product files are byte-identical.
- `!important`: 103 → 103; all 7 breakpoint families and font-size declarations unchanged; touched exact-context visual duplicates remain zero.
- No new state authority or local position/baseline patch. Metadata-only build ID is `20261002-ui-sup08-11`.
- Source hash manifest and reproducible QA scripts are attached. Browser/font/rendering environment is declared; deployment/cache activation is not claimed.

## Separate reproduced Core finding — not repaired in this UI pass

A stale spatial index can omit a newly drawn Shape from native Lasso selection. Both the exact before and after probes reproduce `spatialDirty=false`, one new object and zero index entries; Lasso selects zero before refresh and one after native refreshAll. Target-positive QA therefore explicitly initializes the native index via refreshAll; the raw source/interaction traces preserve this limitation. This is not hidden behind a PASS and is not caused by a new selection-state owner. See `before-spatial-probe.json` and `after-spatial-probe.json`. A separate Core-bounded decision is required; no Core code was changed here.

## Review evidence

[Before active](evidence/ink-ui-sup08-11-20261002/before-active.png) · [After active](evidence/ink-ui-sup08-11-20261002/after-active.png)

[Window before](evidence/ink-ui-sup08-11-20261002/before-window-crop.png) · [Window after](evidence/ink-ui-sup08-11-20261002/after-window-crop.png) · [PS reference](evidence/ink-ui-sup08-11-20261002/ps1-window-crop.png)

[Reference after](evidence/ink-ui-sup08-11-20261002/after-reference-crop.png) · [Layers after](evidence/ink-ui-sup08-11-20261002/after-layers-crop.png) · [Pen Options](evidence/ink-ui-sup08-11-20261002/after-options-pen-crop.png) · [Lasso Options](evidence/ink-ui-sup08-11-20261002/after-options-lasso-crop.png)

[Crop feedback](evidence/ink-ui-sup08-11-20261002/after-options-lasso-crop-feedback.png) · [Frame feedback](evidence/ink-ui-sup08-11-20261002/after-options-lasso-frame-feedback.png)

Detailed DOM/response/raster traces are losslessly gzip-compressed; concise browser/source/raster summaries and the tool matrix are kept readable. PNGs/crops are source-pixel 1:1.

STOP. Supervisor / USER independently review the candidate and screenshots. SUP-12 was added separately during this work; it is recorded as outside this USER-authorized SUP-08–11 batch. No next batch, final acceptance, or cached-session activation is authorized by this return.
