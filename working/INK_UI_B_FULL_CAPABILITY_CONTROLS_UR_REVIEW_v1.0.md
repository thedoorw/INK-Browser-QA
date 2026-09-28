# INK UI-B Full Capability Creative Controls — UR Review v1.0

STATUS: `UR_PASS / PROMOTION_READY / CENTRAL_RUNTIME_NOT_RUN`

TASK: `INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

BASE_MAIN: `0289aed18492a4123fed6f1578ccb71e27929d87`

REVIEWED_BRANCH_HEAD: `52a66e940a95ee008acc45db3973d9f91329f1f8`

BRANCH: `work/ink-ui-b-full-capability-controls-001`

OWNER: `UR / UI REVIEW`

## 1. Review result

UI-B is accepted for UI-only promotion.

```text
UI_B_UR = PASS
PUI_DISPOSITION = 74 / 74
GAP_DISPOSITION = 34 / 34
INTEGRATION_REQUIRED = NO
CORE_SEMANTIC_CHANGE = 0
SECOND_STATE_AUTHORITY = 0
FORMAT_VERSION = 4 / UNCHANGED
P2_PLUGIN_SDK = ABSENT
CENTRAL_RUNTIME = NOT RUN
NEXT_AFTER_PROMOTION = UI-C / UR → DEV
```

## 2. What UI-B completed

- centralized bounded UI contribution metadata and duplicate-ID validation;
- Photoshop-style application-menu wiring across File/Edit/Image/Layer/Type/Select/Filter/Object/View/Help;
- promoted P1 creative tool groups/flyouts and contextual Options controls;
- normal Color / Channels / Adjustments / Layers / Properties routes;
- Select and Mask, Layer Effects, Filter parameter, Filter Gallery, Liquify, Gradient, Pattern, Color Profile, Image Size/Crop, Advanced Transform, Pen Calibration and Recovery dialogs;
- PSD/TIFF/EXR bounded export routing plus explicit PSB/RAW limitations;
- raster retouch/select/fill/sampling controls delegated to promoted image-core functions;
- guide/snap menu routes use existing page.snap authority;
- Object menu mapping now routes Align/Distribute/Path Boolean/Repeat/Frame through existing authorities;
- checkpoint Resume for cancelled tiled PNG export through existing `TiledExportJob.resume()`;
- Brush Package import/export via existing drawing registry;
- Histogram / Snapshot / Compare readouts;
- INK brand/favicons preserved.

## 3. Bounded review findings closed

During UR review the following UI-only findings were corrected on the same branch:

1. generic image-stack commands were separated from raster-state-only commands;
2. document colorState changes were added to the same scoped History transaction as bit-depth/color-mode changes;
3. raster edits invalidate the existing Studio image/layer caches;
4. Recovery candidate labels now preserve source names instead of serializing source objects;
5. dialog Escape closure now queries a collection correctly;
6. Object menu was completed through proxy routes to existing Align/Boolean/Repeat/Frame authorities;
7. Filter reorder, Pattern image input, Gradient target routing and tiled-export Resume were completed;
8. unsupported PSB/RAW/Multichannel operations remain explicit refusals rather than false success.

## 4. Focused source/static QA

UR executed an equivalent focused source/static acceptance pass against the reviewed head:

```text
UR_SOURCE_STATIC_ASSERTIONS = 108 / 108 PASS
PUI_RANGE = PUI-001 .. PUI-074 / 74
GAP_RANGE = G-01 .. G-34 / 34
MENU_CONTRIBUTIONS = 95
TOOL_GROUPS = 11
DIALOGS = 14
REQUIRED_PANELS = 14
UNHANDLED_VISIBLE_MENU_COMMANDS = 0
MISSING_PROXY_TARGETS = 0
DUPLICATE_LITERAL_DOM_IDS = 0
ESM_SOURCE_PARSE_CHECKS = PASS
```

Focused QA source:
`qa/ink-ui-b-full-capability-controls.test.mjs`

UI-B central Runtime was intentionally not started. UI-C owns final Photoshop visual/interaction reconciliation; the one authoritative exact-SHA integrated Runtime remains after UI-C promotion.

## 5. UI engineering health delta

Against UI-B baseline main `0289aed...`:

```text
styles.css chars: 172654 → 178767  (+6113 / +3.54%)
!important total: 49 → 49
new presentation !important: 0
hard-coded normal UI px font-size: 0 → 0
new width thresholds: none
accepted width thresholds observed: 760 / 761 only
tracked selector definition counts: unchanged
menu state controllers: 1 → 1
panel state authority: unchanged
duplicate literal DOM ids: 0 → 0
new generated-shell hand edits: 0
FORMAT_VERSION: 4 → 4
frozen Core mutation: 0
```

Tracked selector counts unchanged for:
- `.topbar`
- `.tool-rail`
- `.inspector`
- `.stage-wrap`
- `.statusbar`
- `.control-row`
- `.inspector-tab`
- `.creative-workspace-panel`

CSS growth remains below the 5% explicit review trigger.

## 6. Delivery / brand / parity

```text
BUILD_ID config = 20260928-ui-b-full-capability-controls-001
BUILD_ID service-worker = same
UI-B ESM modules cached by service worker = YES
shell.template.html changed = NO
generated Web shell changed manually = NO
generated Portable shell changed manually = NO
visible logo authority = assets/INK_MARK_SOURCE_W-300.jpg
browser favicon = assets/favicon.svg
favicon 32×32 / #69BFE3 / white Y = PRESERVED
Adobe branding/assets copied = NO
```

Because the authoritative shell template and generated shells were not hand-edited by UI-B, Web/Portable structural parity remains inherited from the promoted UI-A shell-generation authority.

## 7. Contribution boundary

Authority:
`working/INK_UI_B_CONTRIBUTION_BOUNDARY_CONTRACT_v1.0.md`

```text
UI_CONTRIBUTION_BOUNDARY = PRESENT
DUPLICATE_CONTRIBUTION_IDS = REJECTED
CORE_AUTHORITY_MAPPING_REQUIRED = YES
FULL_PLUGIN_SDK = P2 / ABSENT
REMOTE_PLUGIN_LOADING = ABSENT
```

## 8. PUI / gap evidence

Authority:
`working/INK_UI_B_PUI_AND_GAP_DISPOSITION_v1.0.md`

Result:

```text
PUI_ROWS_DISPOSED = 74 / 74
GAP_ROWS_DISPOSED = 34 / 34
VISIBLE_DEAD_CONTROL_DISPOSITIONS = 0
HEADLESS_FORCED_INTO_GENERAL_UI = 0
```

## 9. Bounded limitations carried into UI-C visual closure

- Blender/Smudge remain routes to the promoted Brush Engine/Stroke Session authority; UI-B does not invent a second renderer behavior.
- Vertical Text/Text-on-Path remain bounded by the promoted text renderer.
- Vector Gradient/Pattern editors write promoted descriptors; renderer fidelity remains existing authority.
- ICC UI is inspect/assign within the promoted contract.
- PSB export requires an adapter and is rejected.
- RAW export is not exposed as supported.
- Multichannel conversion is rejected without explicit channel construction.

These are capability-boundary facts, not UI-C visual defects.

## 10. Promotion decision

`UR_PASS / PROMOTE_UI_B`

After promotion, activate:
`INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

Mandatory UI-C branch:
`work/ink-ui-c-photoshop-fidelity-closure-001`

UI-C returns to the normal delegated sequence:
`UR → DEV → UR review → bounded revision if needed → UR promotion`.