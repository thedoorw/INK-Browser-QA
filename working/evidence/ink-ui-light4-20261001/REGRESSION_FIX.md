# INK toolbar and guide regression fix — 2026-10-01

Source: cb210f7ed22d71bff37f63b1af53c09f1fa2fcad; rendered build: 20261001-ui-light4.

## Fixed
- Guide hit testing now adds the canvas viewport offset to local renderer coordinates. Native move/remove commands remain the authority. Pointer cancellation does not delete guides.
- Native toolbar and keyboard tool changes clear active Raster tools. Raster activation guards its own internal native select call, avoiding stale input ownership and stale capability options.
- Window controls use the menu's white surface, neutral icons, and 3px bottom corners. Their functions remain intentionally pending user discussion.
- Raster object selection is explicitly labeled 影像物件選取.

## Actual browser checks
- Reproduced old build: Raster object selection remained active after native select.
- New build: object selection to native select, brush, eraser, pan, and V shortcut exits Raster options and activates requested native tool.
- Seven Raster group entries each activate and exit to select: quick selection, eyedropper, healing brush, clone stamp, gradient, local blur, dodge.
- Native draw, lasso, shape, and text group routes activate with Raster options hidden.
- Horizontal guide moved from screen y280 to y360 with native select, then to y430 with Raster object selection; dragging to ruler y68 removes it.
- Vertical guide created at x350, moved to x450, then dragged to ruler x80 and removed.
- At 3% zoom: horizontal guide created at y280, moved to y360, and dragged to ruler y68 for removal.
- Actual loaded asset URLs contain light4; effective CSS white rgb(255,255,255), bottom corners 3px.
- JS syntax and generated shell consistency checks passed.

These checks verify routing and the reported guide regression; they do not certify every Raster editing algorithm or final whole-UI acceptance.
