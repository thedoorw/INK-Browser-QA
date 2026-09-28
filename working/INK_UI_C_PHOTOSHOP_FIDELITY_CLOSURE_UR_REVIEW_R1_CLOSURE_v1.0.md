# INK UI-C Photoshop Fidelity Closure — UR Review R1 Closure v1.0

STATUS: `UR_PASS / PROMOTION_READY / FINAL_RUNTIME_PENDING`

TASK: `INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

REVIEWED_DEV_HEAD: `8cefbb8d42bb5363cc9cf98b4d2f94def00afe70`

BASE_MAIN: `fe0ad7dd8aec3cb51314378d4b6b628f5bfbab56`

CENTRAL_RUNTIME: `NOT RUN`

## R1 bounded findings

```text
R1_DYNAMIC_RULERS = PASS
R2_NAVIGATOR_SYNC = PASS
R3_TOOL_ACTIVE_FILL = PASS
R4_POPUP_SEPARATOR = PASS
```

### R1 Dynamic rulers
- ruler rendering now derives markings from existing `renderer.screenToWorld()`;
- horizontal and vertical ruler canvases are state-derived;
- ruler updates are synchronized to view changes;
- guide creation continues through existing `app.addGuide()`;
- 17px ruler/corner geometry is preserved.

### R2 Navigator synchronization
- Navigator thumbnail now renders stable document/content world bounds rather than the current viewport screenshot;
- proxy width/height and left/top are derived from existing `renderer.viewportWorldBounds()` against the same Navigator bounds;
- proxy is no longer hard-centered on render;
- click/drag changes only existing `page.camera` through the existing renderer mapping;
- `grab / grabbing` semantics are preserved.

### R3 selected tool fill
- 26px tool row/hit pitch retained;
- selected visual fill is approximately 31×24 px centered inside the hit target.

### R4 popup separator
- one semantic popup separator role exists: `--ink-ui-popup-separator:#C0C0C0`;
- application/workspace separators use 1px / 2px-inset popup grammar;
- panel options menu reuses the same separator class;
- general soft-border authority remains separate.

Non-blocking polish also closed:
`Guide readout = X: / Y:`.

## UR final static gate

```text
R1_FINDINGS = 4 / 4 PASS
TOP_SHELL = 61px PRESERVED
DOCUMENT_TAB = 28+1 PRESERVED
RULERS = 17px PRESERVED
DOCUMENT_STATUS = 16+1 PRESERVED
TOOLS_TOTAL = 39+1 / 72+1 PRESERVED
DOCK_COLLAPSED = 39+1 PRESERVED
PANEL_REFERENCE = 252px ELASTIC PRESERVED
PANEL_HEADER = 28px PRESERVED
SPLITTER = 3px PRESERVED
LIGHT_TOKENS = PRESERVED
FORMAT_VERSION = 4 / UNCHANGED
BUILD_ID_CONFIG_SW = SYNC
DUPLICATE_LITERAL_DOM_IDS = 0
UI_B_CONTRIBUTION_BOUNDARY = PRESERVED
MENU_CONTROLLER_COUNT = 1
CENTRAL_RUNTIME = NOT RUN
INTEGRATION_REQUIRED = NO
```

Authorized responsive thresholds observed by UR remain within the approved family; no unauthorized threshold was introduced.

## Promotion decision

`UR_PASS / PROMOTE_UI_C`

UI-C promotion does not constitute the final integrated Runtime acceptance.

After promotion:
`STOP → MR`

MR owns the one final exact-SHA integrated Runtime, screenshot inspection, final current-main health confirmation and any cross-lane integration issue discovered there.