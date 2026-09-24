# INK UI Modification & Review Checklist v0.1

STATUS: UR_DRAFT / BEFORE_IMPLEMENTATION
BRANCH: `work/ink-web-ui-standard-001`
REFERENCE: `research/INK_IDEAL_UI_STANDARD_v0.1.md`

## A. Inventory / architecture

- [x] Every visible control is mapped to a command/capability.
- [x] Every capability has one Primary Home.
- [x] Duplicate entries are marked contextual shortcut / keyboard shortcut / responsive alternative.
- [x] Everyday editor controls are separated from specialist/Core/diagnostic controls.
- [x] No UI change modifies document/history/revision/Core authority.
- [x] Any Core-boundary need is returned as `INTEGRATION_REQUIRED → MR`.

## B. Top Menu / top bars

- [x] New/Open/Save are moved to File primary home.
- [x] Export is File primary home; permanent top presence is justified or removed.
- [x] Top bar contains no low-frequency file-management clutter.
- [x] Contextual Options change according to active tool/selection.
- [x] Deep settings are not duplicated as equal-status top controls.
- [ ] Top stack is visually compared with Photoshop reference (~60px screenshot reference).
- [ ] No overlap at desktop and narrow widths.
- [x] Undo/Redo location is reviewed against Edit/shortcut/top-density logic.

## C. Left Toolbar

- [x] Tool family order is stable.
- [x] Draw family remains a flyout/stack.
- [x] Single-column mode works.
- [x] Two-column mode works.
- [x] Column switch does not change shortcuts or command identity.
- [x] Two-column mode reduces height without adding unrelated controls.
- [ ] Toolbar collapse/expand control is discoverable but quiet.
- [ ] Toolbar visual weight is balanced against right dock.
- [x] Canvas gains space correctly when toolbar state changes.

## D. Right Panel Dock

- [ ] Right side behaves as a Panel Dock, not one mega-Inspector.
- [ ] Properties is independent.
- [ ] Layers is independent.
- [ ] History is independent.
- [ ] Reference is independent.
- [ ] Compose is independent.
- [ ] CHAT is independent.
- [ ] Revision is independent.
- [ ] AI/advanced/diagnostic surfaces are separated from everyday Properties.
- [ ] Icon-only collapsed state works.
- [ ] Arrow expand/collapse works.
- [ ] Expanded width is draggable/resizable.
- [ ] Default width is compared with Photoshop expanded reference (~252px at supplied screenshot scale).
- [ ] Last active panel is restored.
- [ ] Window menu opens panels.
- [ ] Canvas expands when panel collapses.
- [ ] No white gap/overlay artifact appears at panel boundary.

## E. Properties / Contextual duplication

- [ ] Color has one Primary Home.
- [ ] Size has one Primary Home.
- [ ] Opacity has one Primary Home.
- [ ] Contextual copy is explicitly a shortcut.
- [ ] Object duplicate/group/front/delete do not exist as ambiguous equal-status permanent duplicates.
- [ ] Selection contextual actions contain only high-value immediate actions.

## F. Layers

- [ ] Drag reorder works.
- [ ] Visibility works.
- [ ] Lock works where supported.
- [ ] Add button is in panel action rail.
- [ ] Duplicate button is in panel action rail.
- [ ] Delete button is in panel action rail.
- [ ] Opacity is clearly associated with selected layer.
- [ ] Layer rows fit panel width without clipping.

## G. History

- [ ] History is not buried inside Properties.
- [ ] Step list is readable.
- [ ] Undo/Redo keyboard path remains intact.
- [ ] History limit/settings do not crowd normal step browsing.
- [ ] UI changes do not alter History semantics.

## H. Canvas / workspace

- [ ] First visible INK application frame is already the final shell state; no temporary dark, neutral, color-matched, splash, or placeholder app frame is rendered first.
- [ ] Initial workspace state is visually deterministic.
- [ ] Creation/Layout primary home is defined.
- [ ] Duplicate workspace toggles are removed or explicitly secondary.
- [ ] Canvas remains largest visual area.
- [ ] Fit/Zoom/Rotation controls are consolidated.
- [ ] A4/Layout settings do not permanently occupy main chrome.

## I. Typography

- [ ] UI font stack is centralized.
- [ ] Typography tokens replace scattered arbitrary sizes.
- [ ] Critical controls are not 8–9px.
- [ ] Menu text is readable.
- [ ] Panel titles have consistent scale/weight.
- [ ] Panel tabs have consistent scale/weight.
- [ ] Property labels have consistent scale/weight.
- [ ] Inputs/select values align vertically.
- [ ] Shortcut labels are secondary but legible.
- [ ] Status text is low-noise but readable.
- [ ] Traditional Chinese and Latin baseline/weight are checked together.
- [ ] Numeric fields use consistent numeral styling.

## J. Spacing / geometry

- [ ] Top row heights are tokenized.
- [ ] Toolbar width(s) are tokenized.
- [ ] Panel default/min/max widths are tokenized.
- [ ] Icon sizes are tokenized.
- [ ] Control heights are tokenized.
- [ ] Gaps/paddings use a consistent spacing scale.
- [ ] Left/right margins align across related surfaces.
- [ ] Rounded corners are not overused where Photoshop-style compact geometry is more appropriate.
- [ ] Canvas is not boxed in by unnecessary floating cards.

## K. Responsive / fullscreen

- [ ] Desktop ≥ normal workstation width passes.
- [ ] Narrow desktop passes.
- [ ] Mobile dock/sheet passes.
- [ ] No duplicate command authority appears between desktop/mobile.
- [ ] Fullscreen enters/exits correctly.
- [ ] Essential panel/toolbar collapse controls remain reachable.
- [ ] No clipped menu, popover, dialog or panel.

## L. Runtime visual QA

Phase A/B DEV note: source/static checks are complete; screenshot/runtime comparison remains an UR gate because this DEV execution context has no runnable browser surface for the branch.

Compare after implementation against:
- [ ] current INK before screenshot
- [ ] Photoshop `ps-1.png`
- [ ] Photoshop `ps-2.png`

Check:
- [ ] top density
- [ ] canvas dominance
- [ ] left/right balance
- [ ] panel collapse
- [ ] panel width
- [ ] typography
- [ ] toolbar density
- [ ] hover
- [ ] active
- [ ] disabled
- [ ] modal/dialog hierarchy
- [ ] startup state
- [ ] no regression in core command access

## M. UR gate

Result must be exactly one of:
- `UI_PASS`
- `UI_REVISE`
- `UI_HOLD`
- `INTEGRATION_REQUIRED → MR`

`UI_PASS` requires source/static review plus runtime evidence for all changed visible areas.
