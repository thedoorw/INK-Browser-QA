# INK UI REBUILD 001 — Master Development / Review Checklist

STATUS: ACCEPTANCE_BASELINE
OWNER: INK UR
REFERENCE: Photoshop workstation screenshots supplied by user
MAIN_BASELINE: `d56c8a824247dd52f91a3dac75503eeee0b8cba7`

Use this checklist throughout development. A phase cannot override an OPEN item here.

## 1. Photoshop workstation alignment

- [ ] Top application/menu row visually aligned in height/density.
- [ ] Contextual options row directly under menu.
- [ ] Left toolbar edge-attached.
- [ ] Left toolbar single-column default.
- [ ] Left toolbar actual two-column mode.
- [ ] Toolbar single/two toggle integrated into toolbar.
- [ ] Same tool order/groups in both modes.
- [ ] Center canvas visually dominant.
- [ ] Right Panel Dock edge-attached.
- [ ] Collapsed right dock remains as icon rail.
- [ ] Expanded panel opens inward from dock.
- [ ] Active dock button clicked again closes panel.
- [ ] Panel width resize works.
- [ ] No floating edge tab for opening panels.
- [ ] Bottom status/zoom/rotation treatment compact.
- [ ] Narrow desktop preserves same workstation grammar.

## 2. Menus

- [ ] File menu functional.
- [ ] Edit menu functional.
- [ ] View menu functional.
- [ ] Select menu functional or intentionally removed.
- [ ] Object menu functional.
- [ ] Layer menu functional.
- [ ] Brush menu functional or intentionally removed.
- [ ] Window menu functional.
- [ ] Help menu functional or intentionally removed.
- [ ] No visible dead menu label.
- [ ] Escape closes menus.
- [ ] Outside click closes menus.
- [ ] Keyboard focus states visible.
- [ ] Menu shortcuts match actual shortcuts.

## 3. Duplicate-function elimination

- [ ] Every visible function has one Primary Home.
- [ ] File top buttons removed/reclassified.
- [ ] Workspace large buttons/dropdown reconciled.
- [ ] Properties/Dock/Advanced/Inspector/edge-tab authority reconciled.
- [ ] Selection duplicates reconciled.
- [ ] Layer duplicates reconciled.
- [ ] Viewport duplicates reconciled.
- [ ] Specialist diagnostics removed from ordinary UI.
- [ ] Hidden compatibility endpoints remain visually hidden.
- [ ] No dead placeholder controls.

## 4. Right-side panel behavior

- [ ] Properties toggle works open/close from same dock button.
- [ ] Layers toggle works open/close.
- [ ] History toggle works open/close.
- [ ] Reference toggle works open/close.
- [ ] Compose toggle works open/close.
- [ ] CHAT toggle works open/close.
- [ ] Revision toggle works open/close.
- [ ] Specialist toggle works open/close.
- [ ] Only one primary panel open.
- [ ] Last active panel restore behavior intentional.
- [ ] Window menu routes to same panel authority.
- [ ] Contextual Advanced navigates inside Properties, not second panel authority.
- [ ] No legacy Inspector opener visible.
- [ ] No floating panel-opening tab visible.
- [ ] Panel/canvas boundary has zero gap/overlap.

## 5. Left toolbar

- [ ] Tools: draw family.
- [ ] Eraser.
- [ ] Select.
- [ ] Lasso.
- [ ] Shape.
- [ ] Text.
- [ ] Image.
- [ ] Pan.
- [ ] Draw family contains Pen/Pencil/Marker/Brush/Airbrush.
- [ ] Keyboard shortcuts accurate.
- [ ] Active tool state clear.
- [ ] Single-column layout visually checked.
- [ ] Two-column layout visually checked.
- [ ] Toggle placement matches Photoshop logic.
- [ ] No tool disappears between layouts.
- [ ] No duplicate permanent tool family elsewhere.

## 6. Top-right cleanup

- [ ] Every current top-right control inventoried.
- [ ] Workspace mode does not appear twice at equal weight.
- [ ] File/export does not dominate ordinary workspace unnecessarily.
- [ ] Properties/Inspector/Advanced controls not duplicated.
- [ ] Fullscreen remains reachable.
- [ ] Canvas settings remains reachable from a logical home.
- [ ] No unexplained icon.
- [ ] No oversized button where compact menu/icon suffices.

## 7. Typography

- [ ] One UI font-family stack.
- [ ] Monospace reserved only for code/status where justified.
- [ ] Decorative font removed from workstation UI unless explicitly approved.
- [ ] One tokenized size scale.
- [ ] One weight scale.
- [ ] One line-height scale.
- [ ] Legacy competing font-size blocks removed.
- [ ] No unnecessary `!important` typography overrides.
- [ ] CJK/Latin/numbers visually balanced.
- [ ] Labels readable at 100% Windows Chrome.
- [ ] No critical label below accepted minimum.
- [ ] Photoshop comfort/density comparison performed.

## 8. Color / visual weight

- [ ] Photoshop spatial grammar preserved.
- [ ] Overall chrome lighter than current heavy dark override.
- [ ] Canvas has clear hierarchy over chrome.
- [ ] Accent color restrained and consistent.
- [ ] Disabled controls clearly distinct.
- [ ] Borders/dividers consistent.
- [ ] Hover/active/focus states consistent.
- [ ] No mixed legacy light/dark visual systems.

## 9. Branding

- [ ] User-approved top-left mark installed.
- [ ] Correct favicon installed.
- [ ] Browser tab screenshot verifies favicon.
- [ ] No old JPG branding route remains unless explicitly approved.
- [ ] Web and Portable use intended identity.
- [ ] Service worker cache/version updated with branding change.

## 10. Startup / first paint

- [ ] Reload produces no black flash.
- [ ] Reload produces no dark legacy intermediate frame.
- [ ] First visible frame matches intended default workspace.
- [ ] Runtime-ready transition does not visibly restyle whole app.
- [ ] Creation workspace background correct.
- [ ] Layout workspace background correct.
- [ ] Service worker does not return stale visual shell.

## 11. Canvas / workspace

- [ ] Creation workspace default confirmed.
- [ ] Layout workspace confirmed.
- [ ] A4 behavior correct.
- [ ] Workspace switch compact and singular.
- [ ] Fit current works.
- [ ] Reset current works.
- [ ] Fit A4/view works.
- [ ] Fullscreen works.
- [ ] Zoom +/- works.
- [ ] Rotation reset works.
- [ ] Canvas remains dominant with panels closed/open.

## 12. Layers / History / Properties

- [ ] Layer drag reorder.
- [ ] Add layer.
- [ ] Duplicate layer.
- [ ] Delete layer.
- [ ] Lock layer.
- [ ] Layer opacity.
- [ ] History list.
- [ ] Undo/Redo relationship clear.
- [ ] Properties Tool section.
- [ ] Properties Object section.
- [ ] Properties Geometry section.
- [ ] Specialist separated from Properties.

## 13. Responsive consistency

- [ ] 1280×1024.
- [ ] 1280×800.
- [ ] 960×800.
- [ ] short-height desktop.
- [ ] compact/mobile representative width.
- [ ] no horizontal shell overflow.
- [ ] same command taxonomy across widths.
- [ ] no mobile-only redesign that contradicts desktop grammar.
- [ ] right panels become responsive without new authority.
- [ ] toolbar remains logically equivalent.

## 14. Interaction quality

- [ ] Every visible button works or is disabled.
- [ ] Active button can toggle where expected.
- [ ] Tooltip text accurate.
- [ ] Shortcut labels accurate.
- [ ] focus-visible states.
- [ ] disabled states truthful.
- [ ] resize cursor/affordance correct.
- [ ] panel state ARIA synchronized.
- [ ] no duplicate DOM IDs.

## 15. Delivery / source authority

- [ ] `shell.template.html` is sole editable shell markup authority.
- [ ] Web generated from template.
- [ ] Portable generated from template.
- [ ] generated parity PASS.
- [ ] one current presentation authority in CSS.
- [ ] obsolete style blocks removed rather than merely overridden.
- [ ] web-shell has one panel/menu authority.
- [ ] regression tests protect accepted current behavior.
- [ ] no test preserves obsolete logo/favicon/layout.

## 16. Mandatory deployed screenshot set

- [ ] 1280×1024 first frame after reload.
- [ ] 1280×1024 settled default workspace.
- [ ] left toolbar single-column.
- [ ] left toolbar two-column.
- [ ] Properties open.
- [ ] Layers open.
- [ ] History open.
- [ ] one Creative panel open.
- [ ] right dock collapsed.
- [ ] 960px narrow desktop.
- [ ] Fullscreen.
- [ ] mobile/compact.
- [ ] browser tab favicon.
- [ ] top-left logo close crop.
- [ ] top-right controls close crop.

## 17. Previously reported user issues — cannot be silently closed

- [ ] black startup flash.
- [ ] logo stale.
- [ ] favicon stale/regressed.
- [ ] empty menus.
- [ ] left toolbar two-column missing.
- [ ] floating right-side panel tag disliked / must be removed.
- [ ] Properties active button cannot close panel.
- [ ] Inspector / Properties / Advanced overlap and duplication.
- [ ] top-right control cluster too crowded/redundant.
- [ ] workspace/mode controls duplicated.
- [ ] responsive/narrow-window UI inconsistent with full-window UI.
- [ ] typography not actually consolidated.
- [ ] duplicate-function cleanup not reflected in deployed UI.

## Final gate

No item above may be marked complete from documentation alone.

Required closeout:
```text
OPEN_CHECKLIST_ITEMS = 0
DEAD_VISIBLE_CONTROLS = 0
DUPLICATE_PRIMARY_HOME = 0
USER_REPORTED_OLD_ISSUES = 0
DEPLOYED_SCREENSHOT_SET = PASS
PHOTOSHOP_ALIGNMENT_REVIEW = PASS
FUNCTIONAL_RUNTIME = PASS
```
