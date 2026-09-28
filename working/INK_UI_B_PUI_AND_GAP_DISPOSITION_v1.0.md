# INK UI-B PUI and Gap Disposition v1.0

STATUS: `UR_SOURCE_REVIEW / UI_B_IMPLEMENTED / RUNTIME_NOT_RUN`

TASK: `INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

BRANCH: `work/ink-ui-b-full-capability-controls-001`

BASE_MAIN: `0289aed18492a4123fed6f1578ccb71e27929d87`

CENTRAL_RUNTIME: `NOT RUN / PROHIBITED`

## 1. Disposition vocabulary

- `IMPLEMENTED_UI_B` — UI-B added normal placement/wiring on top of promoted authority.
- `RETAINED_UI_A` — UI-A already established the required Photoshop-aligned home; UI-B did not duplicate it.
- `RETAINED_EXISTING` — existing product UI/creative-workspace authority already satisfied the route.
- `HEADLESS_CONFIRMED` — intentionally no ordinary creative control.
- `BOUNDED_ROUTE` — visible route exists, with explicit limitation where Core/Renderer contract is bounded.
- `NO_NEW_AUTHORITY` — UI-B delegates to the existing state/mutation authority.

## 2. PUI-001–074 disposition

| PUI | Disposition | Evidence / result |
|---|---|---|
| PUI-001 | IMPLEMENTED_UI_B | Layers Mask action + Layer menu + Select-and-Mask route write existing raster-mask authority. |
| PUI-002 | IMPLEMENTED_UI_B | Adjustments panel is populated; Image > Adjustments routes to same panel; legacy Specialist add route bridges to same stack. |
| PUI-003 | IMPLEMENTED_UI_B | Filter top menu + selected-raster stack readout write existing filter stack. |
| PUI-004 | IMPLEMENTED_UI_B | Filter stack Up/Down/Remove controls mutate the same object filterStack through History. |
| PUI-005 | RETAINED_UI_A | Duplicate desktop New chrome remains retired/hidden; File authority retained. |
| PUI-006 | RETAINED_UI_A | Duplicate desktop Open chrome remains retired/hidden; File authority retained. |
| PUI-007 | RETAINED_UI_A | Duplicate desktop Save chrome remains retired/hidden; File authority retained. |
| PUI-008 | RETAINED_UI_A | Duplicate desktop Undo chrome remains retired/hidden; Edit/History/shortcut authority retained. |
| PUI-009 | RETAINED_UI_A | Duplicate desktop Redo chrome remains retired/hidden; Edit/History/shortcut authority retained. |
| PUI-010 | IMPLEMENTED_UI_B | Existing Draw flyout remains primary; Blender/Smudge + Brush Package actions added without a second brush engine. |
| PUI-011 | IMPLEMENTED_UI_B | Lasso flyout normalizes Lasso / Polygonal / Magnetic. |
| PUI-012 | IMPLEMENTED_UI_B | Smart Selection group exposes Quick / Magic Wand / Object Selection. |
| PUI-013 | IMPLEMENTED_UI_B | Fill group exposes target-aware Gradient and Paint Bucket. |
| PUI-014 | IMPLEMENTED_UI_B | Sampling group exposes Eyedropper / Color Sampler / Measure. |
| PUI-015 | IMPLEMENTED_UI_B | Clone group exposes Clone Stamp / Pattern Stamp. |
| PUI-016 | IMPLEMENTED_UI_B | Healing group exposes Healing / Spot Healing / Patch. |
| PUI-017 | IMPLEMENTED_UI_B | Tone group exposes Dodge / Burn / Sponge. |
| PUI-018 | IMPLEMENTED_UI_B | Detail group exposes Local Blur / Local Sharpen. |
| PUI-019 | IMPLEMENTED_UI_B | Color Replacement is contextual inside shared Detail/Retouch grammar; no persistent extra slot. |
| PUI-020 | IMPLEMENTED_UI_B | Existing Shape tool gains Line / Arrow / Rectangle / Ellipse / Triangle flyout. |
| PUI-021 | BOUNDED_ROUTE | Text flyout + Type menu expose horizontal/paragraph and vertical descriptors; Text-on-Path writes accepted Text descriptor. Existing renderer remains authoritative. |
| PUI-022 | IMPLEMENTED_UI_B | Measure is in Sampling group; UI-A rulers remain direct workstation authority. |
| PUI-023 | IMPLEMENTED_UI_B | Selection Options exposes mode/tolerance/contiguous/edge/search-radius as applicable. |
| PUI-024 | IMPLEMENTED_UI_B | Gradient Options exposes type/stops/opacity + target-aware editor. |
| PUI-025 | IMPLEMENTED_UI_B | Retouch Options expose size/strength/source behavior and loadable Pattern image. |
| PUI-026 | RETAINED_EXISTING | Existing Brush Options/Properties remain the high-frequency brush authority; UI-B does not duplicate them. |
| PUI-027 | IMPLEMENTED_UI_B | Advanced Transform dialog routes Skew / Distort / Perspective / Warp through promoted transform/deformation helpers. |
| PUI-028 | RETAINED_UI_A | Navigator panel/proxy/pan/zoom shell already promoted in UI-A. |
| PUI-029 | RETAINED_UI_A | Color panel already binds foreground color/HEX to existing app color authority. |
| PUI-030 | IMPLEMENTED_UI_B | Channels panel now exposes process/alpha/spot readout plus alpha/spot add/remove/rename/reorder. |
| PUI-031 | IMPLEMENTED_UI_B | Adjustments panel populated from promoted adjustment family. |
| PUI-032 | IMPLEMENTED_UI_B | Existing target-aware Properties retained and expanded with Raster/Image and Vector Appearance sections. |
| PUI-033 | IMPLEMENTED_UI_B | Layers gains Blend / Mask / fx / Select-and-Mask controls without a second layer state. |
| PUI-034 | RETAINED_UI_A | History panel remains UI-A single HistoryManager view. |
| PUI-035 | RETAINED_UI_A | Pages panel remains UI-A single Page authority. |
| PUI-036 | RETAINED_UI_A | Libraries panel home retained; native asset authority remains existing product authority. |
| PUI-037 | RETAINED_EXISTING | Reference stage already provides direct extraction/progress/cancel/result workflow. |
| PUI-038 | RETAINED_EXISTING | Compose stage already owns reconstruction/Recipe/advanced creative workflow. |
| PUI-039 | RETAINED_EXISTING | CHAT panel/stage remains existing governed CHAT authority. |
| PUI-040 | RETAINED_EXISTING | Revision stage already owns capture/restore/compare/provenance readout. |
| PUI-041 | IMPLEMENTED_UI_B | Select and Mask dialog applies promoted refine selection to existing raster-mask authority. |
| PUI-042 | IMPLEMENTED_UI_B | One Layer Effects dialog covers Drop Shadow / Inner Shadow / Outer Glow / Color Overlay / Stroke. |
| PUI-043 | IMPLEMENTED_UI_B | Filter-specific bounded parameter dialog writes existing filter stack. |
| PUI-044 | IMPLEMENTED_UI_B | Filter Gallery is generated from promoted FILTER_GALLERY descriptors. |
| PUI-045 | IMPLEMENTED_UI_B | Liquify modal exposes Forward Warp / Twirl / Pucker / Bloat / Reconstruct + selection freeze/protect mask. |
| PUI-046 | IMPLEMENTED_UI_B | One Gradient editor dispatches to raster options or vector fill descriptor by target. |
| PUI-047 | IMPLEMENTED_UI_B | Pattern fill editor writes promoted vector Pattern descriptor. |
| PUI-048 | BOUNDED_ROUTE | Color Profile dialog inspects/assigns ICC using existing ICC authority; unsupported color transforms are not claimed. |
| PUI-049 | IMPLEMENTED_UI_B | Existing Export dialog retained and extended with bounded PSD/TIFF/EXR/PSB/RAW disclosure. |
| PUI-050 | IMPLEMENTED_UI_B | Pen Calibration dialog routes to existing Specialist calibration controls; no second calibration model. |
| PUI-051 | IMPLEMENTED_UI_B | Recovery modal lists verified current/previous/checkpoint records and restores through existing document/storage authority. |
| PUI-052 | IMPLEMENTED_UI_B | Filter top-level menu is live and populated; old disabled placeholder is removed by UI-B installer. |
| PUI-053 | BOUNDED_ROUTE | Image mode routes expose 8/16/32-bit and RGB/CMYK/Lab; Multichannel conversion refuses without explicit channel construction. |
| PUI-054 | BOUNDED_ROUTE | Image > Color Profile routes to bounded ICC inspect/assign dialog. |
| PUI-055 | IMPLEMENTED_UI_B | UI-A rulers/guides retained; View menu adds Snap, Snap To categories, Grid and guide visibility through page.snap authority. |
| PUI-056 | BOUNDED_ROUTE | External import uses existing PSD/PSB/TIFF/RAW/EXR decoder authority; export explicitly discloses missing PSB encoder and unsupported RAW export. |
| PUI-057 | HEADLESS_CONFIRMED | Storage internals remain non-creative; recovery/diagnostics are the only user-facing routes. |
| PUI-058 | HEADLESS_CONFIRMED | Renderer internals remain automatic/Specialist only. |
| PUI-059 | HEADLESS_CONFIRMED | Natural-media renderer internals remain automatic. |
| PUI-060 | HEADLESS_CONFIRMED | GPU/tile/cache infrastructure remains automatic/diagnostic. |
| PUI-061 | HEADLESS_CONFIRMED | Dependency/recompute internals remain automatic. |
| PUI-062 | HEADLESS_CONFIRMED | Semantic grounding remains CHAT/internal; no standalone semantic toolbar/panel. |
| PUI-063 | HEADLESS_CONFIRMED | Asset lifecycle/platform-support atomics remain headless. |
| PUI-064 | HEADLESS_CONFIRMED | Output-handle lifecycle remains headless. |
| PUI-065 | HEADLESS_CONFIRMED | Stylus signal stream remains automatic; validation is diagnostic. |
| PUI-066 | HEADLESS_CONFIRMED | Service-worker update lifecycle remains automatic; activation/status is separate. |
| PUI-067 | IMPLEMENTED_UI_B | Help > Updates routes to existing update manager/Specialist controls. |
| PUI-068 | IMPLEMENTED_UI_B | Help > Product Diagnostics routes to existing Specialist product-health surface. |
| PUI-069 | IMPLEMENTED_UI_B | Export retains existing progress/cancel and adds checkpoint Resume for cancelled tiled PNG jobs using existing TiledExportJob.resume authority. |
| PUI-070 | IMPLEMENTED_UI_B | Draw flyout exposes Brush Package import/export using existing INK_STUDIO brush registry. |
| PUI-071 | IMPLEMENTED_UI_B | Raster Properties exposes Histogram / Snapshot / Compare using promoted image-core readout functions. |
| PUI-072 | RETAINED_EXISTING | Revision stage already exposes compare route and uses existing comparison authority. |
| PUI-073 | RETAINED_EXISTING | CHAT/Compose already expose Creative Memory / Research advisory readouts as READ ONLY. |
| PUI-074 | RETAINED_EXISTING | Specialist already owns benchmarks/diagnostics; Help route normalizes discoverability. |

Result:

```text
PUI_ROWS_DISPOSED = 74 / 74
VISIBLE_DEAD_CONTROL_DISPOSITIONS = 0
HEADLESS_FORCED_INTO_GENERAL_UI = 0
```

## 3. G-01–G-34 disposition

| Gap | Result | Closure |
|---|---|---|
| G-01 | RESOLVED | UI-A Pages panel retained as one Page authority. |
| G-02 | RESOLVED | Existing Creation/Layout switcher retained; View secondary workspace routes added. |
| G-03 | RESOLVED | Existing Properties Document/Layout controls remain primary for Artboard/print state. |
| G-04 | RESOLVED | UI-A Navigator panel/proxy retained. |
| G-05 | RESOLVED | Lasso + Smart Selection flyouts, Select menu, contextual options implemented. |
| G-06 | RESOLVED | UI-A rulers/guides retained; View Snap/Snap To UI-B routes use page.snap only. |
| G-07 | RESOLVED | Shape flyout normalized to all currently supported primitives. |
| G-08 | RESOLVED | Skew/Distort/Perspective routes + bounded dialog implemented. |
| G-09 | RESOLVED | Warp route uses existing non-destructive deformation; no Puppet Warp invented. |
| G-10 | RESOLVED | Existing Properties Layout sections retained; no second layout authority. |
| G-11 | BOUNDED_RESOLVED | Text modes and Text-on-Path descriptors exposed; renderer/font-engine remains existing bounded authority. |
| G-12 | RESOLVED | Raster Properties exposes state, Crop, Resize, Histogram, Snapshot, Compare and Color Profile. |
| G-13 | RESOLVED | Mask creation/refinement promoted to Layers/Properties/dialog. |
| G-14 | RESOLVED | Adjustments panel + Image route populated. |
| G-15 | RESOLVED | Filter menu + parameter dialogs + Gallery + stack readout/reorder implemented. |
| G-16 | RESOLVED | Layers Blend control uses existing object compositing authority. |
| G-17 | RESOLVED | Layers fx + one five-effect dialog implemented. |
| G-18 | RESOLVED | Raster source state is exposed as readout; no second Smart Object model invented. |
| G-19 | RESOLVED | Existing Brush Properties retained; Brush Package import/export promoted to Draw flyout. |
| G-20 | RESOLVED | Existing natural-media presets/properties retained; no separate media toolbar. |
| G-21 | RESOLVED | Existing Brush Dynamics Properties retained as the coherent dynamics authority. |
| G-22 | BOUNDED_RESOLVED | Blender/Smudge promoted to Draw flyout and routed to existing Brush Engine/Stroke Session authority; no fake direct-render implementation. |
| G-23 | RESOLVED | Stylus behavior stays automatic; diagnostics/calibration are secondary. |
| G-24 | RESOLVED_NO_P2_EXPANSION | Pen Calibration dialog only normalizes existing controls; no new P2 capability/SDK. |
| G-25 | RESOLVED | Existing Document/Media/Paper Properties retained. |
| G-26 | RESOLVED | Existing Reference stage already provides extraction/progress/cancel/result flow. |
| G-27 | RESOLVED | Existing Compose stage owns structure reconstruction. |
| G-28 | RESOLVED | Existing Revision stage owns compare mode/evidence. |
| G-29 | RESOLVED | Automatic recovery remains existing; UI-B adds verified checkpoint Recovery modal. |
| G-30 | RESOLVED | Existing Export progress/cancel retained; UI-B adds checkpoint Resume for tiled PNG. |
| G-31 | BOUNDED_RESOLVED | PSD/TIFF/EXR routes exposed; PSB/RAW limitations are explicit. |
| G-32 | RESOLVED | Normal Compose vs Specialist Recipe engineering separation retained. |
| G-33 | RESOLVED | Existing CHAT/Compose Memory/Research advisory remains read-only. |
| G-34 | RESOLVED | Help > Updates and Diagnostics route to existing authorities. |

Result:

```text
GAP_ROWS_DISPOSED = 34 / 34
INTEGRATION_REQUIRED_BLOCKER = NONE_FOUND
CORE_SEMANTIC_CHANGE = 0
NEW_PRODUCT_CAPABILITY = 0
SECOND_STATE_AUTHORITY = 0
FORMAT_VERSION_CHANGE = 0
CENTRAL_RUNTIME = NOT RUN
```

## 4. Explicit bounded limitations

The following are not hidden and are not promotion blockers for UI-B:

1. Blender/Smudge are promoted as normal creative routes to the existing Brush Engine / Stroke Session authority. UI-B does not alter the current direct-canvas Renderer to fake unsupported mixing behavior.
2. Vertical Text and Text-on-Path write accepted Text descriptors; renderer/glyph layout remains the existing bounded Text authority.
3. Vector Gradient/Pattern editors write promoted appearance descriptors. Renderer fidelity remains the existing Renderer authority and is not expanded by UI-B.
4. Multichannel conversion is refused unless explicit channel construction exists.
5. ICC UI supports inspect/assign within the promoted contract; unsupported ICC/LUT transforms are not presented as successful.
6. PSB export remains adapter-required and is explicitly rejected.
7. RAW is import-only and RAW export is explicitly rejected.
8. Tiled checkpoint Resume is exposed for PNG, where the existing output encoding path is available without inventing a second export pipeline.

## 5. Review gate

UI-B may proceed to UR promotion only after:
- static acceptance harness pass;
- engineering-health delta pass;
- source review confirms no dead visible routes;
- exact branch HEAD is recorded;
- central Runtime remains unstarted.
