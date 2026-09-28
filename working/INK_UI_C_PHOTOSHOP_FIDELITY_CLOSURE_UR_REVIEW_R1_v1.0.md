# INK UI-C Photoshop Fidelity Closure — UR Review Round 1

STATUS: `UR_BOUNDED_REVISION_REQUIRED / RETURN_TO_DEV`

TASK: `INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

REVIEWED_DEV_HEAD: `223b3f38d3538953d89c41c93099fb52b48acb74`

BASE_MAIN: `fe0ad7dd8aec3cb51314378d4b6b628f5bfbab56`

CENTRAL_RUNTIME: `NOT RUN`

## Source review result

DEV source closure is structurally strong, but final Photoshop fidelity is not yet promotable.

Four bounded UI-only findings must be closed on the same branch.

## R1 — Dynamic ruler authority

Current ruler visuals are static CSS repeating gradients. They do not derive tick positions/numeric labels from current camera pan/zoom.

Required:
- top and left ruler ticks/numbers must update from the existing renderer/camera coordinate authority;
- pan/zoom must move/re-scale ruler markings correctly;
- no second coordinate engine;
- preserve 17px thickness and 17×17 corner;
- ruler guide drag must continue to call existing `app.addGuide()`.

Acceptance:
`AI01 / AI02 = SOURCE + INTERACTION READY`.

## R2 — Navigator viewport synchronization

Current `renderShellNavigator()` draws the current stage viewport into the thumbnail and then hard-centers proxy left/top. This cannot represent viewport location after pan/drag.

Required:
- thumbnail must represent stable document/content bounds rather than only the current viewport screenshot;
- proxy rectangle size AND position must be derived from existing `renderer.viewportWorldBounds()` relative to the same thumbnail world bounds;
- dragging/clicking Navigator must update the existing page camera only;
- re-render must not force proxy back to center;
- preserve `grab / grabbing` cursor semantics.

Acceptance:
`AM09 = SOURCE + INTERACTION READY`.

## R3 — Tools selected visual fill

Photoshop authority:
`selected visual fill ≈ 31×24 px`, `row pitch ≈ 26 px`.

Current active background occupies the full 31×26 tool button.

Required:
- retain 26px row pitch/hit target;
- selected visual fill must be approximately 31×24 centered inside that pitch;
- do not reduce accessible pointer target solely to mimic fill geometry.

Acceptance:
`TOOLS_ACTIVE_FILL = 31×24 reference / 26 pitch`.

## R4 — Popup separator fidelity

Measured Photoshop menu/panel popup grammar:
- border ≈ RGB 160 / 1px;
- separator ≈ RGB 192 (`#C0C0C0`) / 1px;
- separator inset ≈ 2px.

Current popup separator uses general soft border `#E2E2E2`.

Required:
- define one semantic popup-separator role/token;
- use it for application and panel popup separators where applicable;
- do not change general structural soft-border authority.

Acceptance:
`APPLICATION_MENU_SEPARATOR / PANEL_MENU_SEPARATOR = measured popup grammar`.

## Non-blocking polish in same revision

- guide live readout should visibly use `X:` / `Y:` notation as in reference;
- guide drag line should remain visually distinct from ordinary selection/accent state; exact Photoshop RGB is not claimed if not measured.

## Preserved passes

Do not regress:
- 61px shell geometry;
- 28+1 document tab;
- 17px rulers/corner;
- 16+1 document status;
- 39+1 / 72+1 Tools total widths;
- 39+1 collapsed Dock;
- 252px elastic panel reference;
- 28px panel header;
- 3px splitters;
- 23px History pitch;
- 35px Layers pitch;
- 20px flyout rows;
- 16px scrollbars;
- Light tokens `#E9E9E9 / #FFFFFF / #3B63FB`; 
- UI-B capability wiring/counts;
- contribution boundary;
- brand/favicon;
- FORMAT_VERSION=4;
- central Runtime prohibition.

## Return format

DEV returns:
```text
REVISION_HEAD =
R1_DYNAMIC_RULERS = PASS / FAIL
R2_NAVIGATOR_SYNC = PASS / FAIL
R3_TOOL_ACTIVE_FILL = PASS / FAIL
R4_POPUP_SEPARATOR = PASS / FAIL
FOCUSED_QA =
UI_HEALTH_DELTA =
CENTRAL_RUNTIME = NOT RUN
INTEGRATION_REQUIRED = NO / YES
```

Then: `STOP → UR`.