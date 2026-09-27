# INK UI — Photoshop Reference Capture & Measurement Plan v0.1

STATUS: `UR_REFERENCE_ACQUISITION / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION`

DATE: 2026-09-27

PURPOSE:
Provide the exact next Photoshop capture set needed to close the remaining `REFERENCE_MISSING` fields in `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`.

## A. Environment lock — record before capturing

Required:
- Photoshop version
- Windows version
- screen resolution
- application window size
- Windows display scale
- Photoshop UI scaling
- Photoshop UI Font Size
- Scale UI To Font on/off
- UI language
- theme
- capture method / DPR if known

Do not mix pixel measurements across changed scaling/font settings.

Current legacy reference:
- Photoshop 21.2.12
- 1280×1024 screen capture
- 1280×994 Photoshop application area
- Traditional Chinese UI
- dark theme
- exact Windows/display/UI scaling not known

## B. P0 capture set — one active-document session

Keep all environment settings unchanged.

1. active document / rulers OFF
2. active document / rulers ON
3. document status bar visible
4. document status information popup open
5. application menu open
6. nested submenu open
7. tool flyout open
8. panel group with active and inactive tabs
9. panel options menu open
10. Layers populated + one selected row
11. Layers drag reorder in progress
12. History with multiple states
13. History after reverting to an earlier state
14. Navigator with viewport proxy
15. Navigator proxy drag
16. horizontal guide drag from top ruler
17. vertical guide drag from left ruler
18. ruler zero-origin drag/state
19. snapping/equal-spacing feedback
20. standard tooltip visible
21. disabled control
22. keyboard-focused control
23. scrollbar hover
24. scrollbar drag
25. panel resize in progress
26. close last document → empty workspace

## C. P0 measurements derived from those captures

### Active document
- document-tab/title band height
- tab left/right padding
- tab close control box
- unsaved-state indicator
- canvas/document origin with and without rulers

### Rulers
- horizontal ruler height
- vertical ruler width
- ruler origin-square size
- label baseline
- major/minor tick lengths
- guide drag hotspot
- guide line width
- guide hover/selected state
- zero-origin pointer state

### Status
- status strip height
- top divider
- zoom field
- document-information region
- popup trigger/triangle
- item spacing
- left/right padding
- empty-workspace transition geometry

### Menu
- popup vertical offset
- item height
- horizontal padding
- check/icon column
- shortcut column
- submenu arrow column
- separator
- disabled state
- shadow/border/radius

### Tools / flyout
- true hitbox
- icon box
- flyout popup row/cell
- tooltip offset/delay visual state

### Panels
- tab active/inactive presentation
- true panel-menu hitbox
- panel-menu item geometry
- panel resize-handle hitbox
- scrollbar geometry

### Layers
- row height
- thumbnail box
- visibility/lock box
- indent step
- selected/hover state
- insertion line
- footer button hitbox

### History
- row height
- state icon
- selected/current state
- future-state rendering

### Navigator
- thumbnail inset
- proxy line width
- proxy fill
- zoom-control geometry

## D. Search/documentation role

Adobe documentation is behavior authority, not pixel authority.

Confirmed current behavior to use:
- Photoshop document windows can be grouped/tabbed.
- Options bar changes with selected tool.
- Panels can group, stack, dock, undock, reorder and float.
- Panel tabs provide a Close context route.
- Rulers belong to the active window and have a movable/resettable zero origin.
- Guides can be dragged from rulers; Shift snaps to ruler ticks.
- Status bar belongs to the document window.
- UI Font Size and Scale UI To Font can change interface sizing.
- Standard and rich tooltips are both supported.

Internet screenshots with unknown scaling:
`VISUAL_REFERENCE_ONLY`

## E. Exit condition

```text
P0_REFERENCE_PACK_COMPLETE = YES
ENVIRONMENT_METADATA_COMPLETE = YES
ACTIVE_DOCUMENT_GEOMETRY_MEASURED = YES
RULER_GUIDE_GEOMETRY_MEASURED = YES
STATUS_STRIP_GEOMETRY_MEASURED = YES
MENU_POPUP_GEOMETRY_MEASURED = YES
PANEL_TAB_MENU_GEOMETRY_MEASURED = YES
LAYERS_HISTORY_NAVIGATOR_DETAIL_MEASURED = YES
REFERENCE_MISSING_P0 = 0
PRODUCT_MUTATION = 0
```


## F. Capture progress — 2026-09-27

Closed by USER-supplied matched 1280×1024 captures:

- [x] active document / rulers OFF
- [x] active document / rulers ON
- [x] application menu open
- [x] panel options menu open
- [x] History populated
- [x] Navigator visible
- [x] Layers selected-state reference available in the active-document set

Measured authority:
`working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`

Still open only when needed for final pixel-fidelity closure:
- [ ] status information popup
- [ ] tool flyout open
- [ ] Layers drag reorder
- [ ] Navigator proxy drag
- [ ] guide drag from horizontal ruler
- [ ] guide drag from vertical ruler
- [ ] ruler-origin drag
- [ ] snap/equal-spacing feedback
- [ ] tooltip visible
- [ ] disabled control
- [ ] keyboard-focused control
- [ ] scrollbar hover/drag
- [ ] panel resize
- [ ] empty workspace after last document closes


## G. Interaction-reference closure — 2026-09-27

Closed by USER-supplied matched reference captures:

- [x] standard Tooltip visible
- [x] Tool flyout open
- [x] horizontal guide drag + live coordinate readout
- [x] vertical guide drag + live coordinate readout
- [x] Status information popup
- [x] empty workspace after last document closes
- [x] active-document horizontal/vertical scrollbar reference
- [x] Navigator high-zoom proxy reference
- [x] Layers drag reorder

Measurement authority:
`working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`

Ruler origin drag:
`OPTIONAL / NON-CLOSURE-BLOCKING`

Remaining targeted references are optional unless later visual QA exposes a gap:
- keyboard-focus visual;
- disabled control close-up;
- scrollbar hover/drag close-up;
- equal-spacing/smart-snap feedback.

Navigator proxy drag and Panel resize no longer require additional Photoshop screenshots. Their cursor semantics are specified as `grab/grabbing`, `ew-resize`, and `ns-resize`; functional proof belongs to later INK Runtime QA rather than Photoshop pixel-reference acquisition.


## H. Official-source closure — 2026-09-27

The following no longer require additional Photoshop screenshots:

- Navigator proxy drag — current Photoshop documentation explicitly confirms dragging the colored proxy area moves the document view.
- Panel edge resize — current Photoshop documentation explicitly confirms dragging any panel edge resizes it.
- Equal-spacing / Smart Guide behavior — Adobe documentation confirms dynamic pink Smart Guides, edge/center/boundary alignment, pixel-distance readouts, and equal-spacing support.
- Ruler-origin behavior — Adobe documentation confirms crosshairs, Shift-to-ruler-tick snapping, and double-click reset; INK keeps this optional/non-blocking.
- keyboard focus visual — governed by web accessibility authority rather than Photoshop pixel-copy.
- disabled controls — already visible in existing matched Photoshop captures.
- scrollbar hover/drag raster — not required as a Photoshop-specific pixel target; geometry is already captured.

Remaining reference acquisition need:

```text
CONTROLLED_DESKTOP_PHOTOSHOP_LIGHT_THEME
→ only if UR wants exact light-gray RGB/token derivation

otherwise
→ explicit UR-approved INK light-gray adaptation
```

Therefore:
`ADDITIONAL_DARK_THEME_PS_SCREENSHOTS_REQUIRED = 0`


## I. Light-theme web-reference closure — 2026-09-27

Public web research now provides:
- official Photoshop UXP confirmation of Darkest / Dark / Light / Lightest themes;
- official Photoshop theme-aware semantic host CSS variables;
- Adobe Photoshop UXP design guidance for Light/Lightest panel UI;
- public full-workstation Photoshop Light/Lightest screenshots;
- current Adobe Spectrum light-theme numeric token references.

Authority:
`working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`

Result:

```text
ADDITIONAL_USER_LIGHT_THEME_SCREENSHOT_REQUIRED = NO
EXACT_PS_21_2_12_LIGHT_RGB = NOT_REQUIRED
FINAL_INK_LIGHT_TOKENS = UR_ADAPTATION_REQUIRED
```
