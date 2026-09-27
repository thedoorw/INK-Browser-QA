# INK UI — Photoshop Interaction Detail Measurement v0.1

STATUS: UR_MEASUREMENT_AUTHORITY / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION
DATE: 2026-09-27
BASE_MAIN: dacd56883d4dbbddccc238c994a5a43b0754aba9

Purpose: record USER-supplied Photoshop 21.2.12 interaction-state references for Tooltip, Tool flyout, guide dragging, Status information menu, empty workspace, scrollbars, Navigator high-zoom proxy and Layers drag-reorder.

All captures are 1280×1024 and belong to the same Traditional Chinese / dark-theme reference family. Exact Windows/UI scaling remains unknown, so numeric values are authoritative only inside this matched environment.

## Reference set

- image(20260927-121943).png — SHA256 b6fbca2fb00abc8b7d285a0511170b4796abc9db0094a95d052c81bdee0fa9b8 — Tooltip visible
- image(20260927-121958).png — SHA256 eb6dd863f1dd1a2b695d8ae9d731d7aaa1d484f7a4224f2536924b438b48433a — Tool flyout open
- image(20260927-122019).png — SHA256 70e932f240299ce4745c882fdbf20b530ea31f55b7770d298621d90758bb0396 — guide/origin-related placed state
- image(20260927-122031).png — SHA256 e5368290e18ad925f1e1ff82422da4c983a3ee9faef10cc6fbd4182ad18dd5ea — horizontal guide drag + live Y readout
- image(20260927-122046).png — SHA256 f08d83f315a492a306d6b122360a09abe0bac7c54791eb678c5a2f2f96e187e4 — vertical guide drag + live X readout
- image(20260927-122101).png — SHA256 21a0d640c051eba5da49e8659fb9b137abf9832f3fac7e9a3a576512c237bbdc — Status information menu open
- image(20260927-123009).png — SHA256 b81787997bf3e4e53e7bf410b8149eede99204db268b5b0af36b1fbd4c056a2b — empty workspace
- image(20260927-123042).png — SHA256 2244630c51b2557fccf71ea7ebe3410efc8d96931b99bbb28e9bd1170bb358ed — high-zoom scrollbars + Navigator proxy
- image(20260927-123347).png — SHA256 2cd4cd8f23421b904c61828d17d6b83af4ed259002f7ae6680f2798f71d32f3a — Layers normal
- image(20260927-123359).png — SHA256 e932170ea8275e8effe68267a938477a8caab6edbf8c2f0faa6e861c4626b1f4 — Layers reorder drag in progress

## Tooltip

Measured white body bbox: x [80,232), y [142,195), size 152×53 px.
Outer rounded/shadow extent is slightly larger and remains VISUAL_REFERENCE_ONLY.
Tooltip is placed to the right of the originating tool, uses a light surface, a primary tool-name line and a secondary explanatory line.
152×53 is a reference state, not a fixed universal INK tooltip size.

## Tool flyout

Measured outer reference: x≈[68,240), y≈[168,268), size≈172×100 px.
Five visible rows imply row pitch≈20 px.
Observed structure: icon column + label + right-aligned shortcut key.
Width is content-dependent and remains REFERENCE_STATE_ONLY.

## Guide dragging

Horizontal guide drag shows a cyan guide preview and a compact black Y-coordinate readout.
Vertical guide drag shows a cyan guide preview and a compact black X-coordinate readout.
Live readout height≈22 px OBSERVED_DENSITY; width depends on numeric text.
INK requires transient live positional feedback from the single ruler/guide coordinate authority.

## Ruler origin disposition

The current capture set does not unambiguously show an in-progress ruler zero-origin drag.
USER reports this interaction is rarely used.
Disposition: RULER_ORIGIN_DRAG = OPTIONAL / NON-CLOSURE-BLOCKING.
Rulers, guide create/move/delete/lock/show-hide, snapping, and live position feedback remain REQUIRED.

## Document Status information menu

Measured outer popup: x [305,419), y [759,993), size 114×234 px.
Measured interior: x [306,418), y [760,992), size 112×232 px.
Border=1 px, border gray≈RGB(160), body≈RGB(240).
Width/height are content-dependent reference-state values.

## Empty workspace

Reference directly confirms:
- no Document tab band
- no rulers
- no Document Status Strip
- no reserved bottom document-status height
- workbench begins immediately below the 61 px application/options chrome
Right-side application panels remain valid application chrome.

## Document scrollbars

At high zoom:
- vertical scrollbar track x=[1002,1018) = 16 px
- horizontal scrollbar track y=[977,993) = 16 px
- scrollbar corner≈16×16 px
- horizontal thumb reference x≈[589,707), width≈118 px
Thumb length is ELASTIC and view/content dependent.

## Navigator high-zoom proxy

Navigator proxy becomes relatively small at high main-document zoom while remaining synchronized with the main viewport.
Proxy geometry is STATE_DERIVED, not fixed.

## Layers drag reorder

Normal repeated Layer rows show row pitch≈35 px in this reference configuration.
During drag, the dragged row becomes a transient ghost and the destination displays a horizontal insertion indicator.
Paired-image difference region is approximately y [792,827), height≈35 px.
The insertion-indicator transition occurs around y≈798 and spans nearly the full panel interior.
Exact ghost opacity and indicator span remain VISUAL_REFERENCE_ONLY.

INK requirements:
- drag reorder shows a clear insertion target before drop
- feedback does not rely only on cursor shape
- hierarchy/reparent behavior distinguishes insert-between from nest-inside when applicable
- reorder uses the existing Layer/Document hierarchy authority and History semantics

## Closed gaps

TOOLTIP_VISIBLE_REFERENCE = CLOSED
TOOL_FLYOUT_REFERENCE = CLOSED
GUIDE_HORIZONTAL_DRAG_REFERENCE = CLOSED
GUIDE_VERTICAL_DRAG_REFERENCE = CLOSED
GUIDE_LIVE_COORDINATE_FEEDBACK = CLOSED
STATUS_INFO_POPUP_REFERENCE = CLOSED
EMPTY_WORKSPACE_REFERENCE = CLOSED
DOCUMENT_SCROLLBAR_REFERENCE = CLOSED
NAVIGATOR_HIGH_ZOOM_REFERENCE = CLOSED
LAYERS_DRAG_REORDER_REFERENCE = CLOSED
RULER_ORIGIN_DRAG = OPTIONAL / NON-BLOCKING

## Remaining targeted reference gaps

No additional generic Photoshop screenshots are required. Only targeted states remain if pixel-level evidence is desired:
1. Navigator proxy while actively dragging
2. Panel width resize while actively dragging
3. keyboard-focus visual
4. disabled control close-up
5. scrollbar hover/drag close-up
6. equal-spacing / smart-snap feedback
7. optional ruler-origin drag