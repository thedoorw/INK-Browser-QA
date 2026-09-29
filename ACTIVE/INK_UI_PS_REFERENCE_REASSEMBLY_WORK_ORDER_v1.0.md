# INK UI — Photoshop Reference Reassembly Work Order v1.0

STATUS: `ACTIVE / USER_AUTHORIZED / DIRECT_MR_EXECUTION`

DATE: 2026-09-29

TASK: `INK-UI-PS-REFERENCE-REASSEMBLY-001`

OWNER: `DIRECT UI MR EXECUTOR`

## 1. Purpose

Replace the current generic/duplicated workstation controls with the Photoshop-aligned shell, Tools, panel-stack and interaction grammar that was already measured from the USER-supplied Photoshop references.

This task does **not** invent a new UI plan.

It restores requirements already recorded in the existing Photoshop reference pack and completion checklist but previously accepted with invalid proxy evidence.

## 2. Primary authority

Read and implement from these existing records before touching source:

1. `ps-1.png`
2. `ps-2.png`
3. `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
4. `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
5. `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
6. `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
7. `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
8. `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`
9. `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`
10. `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

Current USER rule:

```text
REFERENCE_DIFFERENCE = DEFECT
unless
COLOR_PALETTE_OVERRIDE
or
PS_CAPABILITY_DOES_NOT_EXIST_IN_INK
or
USER_EXPLICIT_OVERRIDE
```

The light INK palette remains USER-locked. Photoshop dark colors are not the target.

## 3. Implementation rule

Do not preserve the current visible arrangement merely because its buttons route correctly.

Use existing INK Core/capabilities as the content source and the Photoshop references as the visible structure/interaction source.

```text
KEEP CORE
REBUILD SHELL/PRESENTATION
REMOVE DUPLICATE VISIBLE ROUTES
REHOME CAPABILITIES INTO PS-LIKE PRIMARY HOMES
```

A visible control that duplicates another primary control without Photoshop/reference justification must be removed, hidden, or converted to a contextual route.

## 4. Left Tools — required reconstruction

The current single vertical rail is not the accepted default reference state.

Implement:

- default desktop Tools state matching `ps-1`: true double-column Tools structure;
- reference width: approximately 72 px + 1 px divider;
- same tool membership authority in single and double modes;
- optional/collapsed single-column state matching `ps-2`: approximately 39 px + divider;
- grouped tools use Photoshop-like flyout grammar instead of creating one persistent button for every subtool;
- preserve active-tool state, hover/focus and existing tool authority;
- remove/rehome persistent one-shot or duplicate buttons that do not belong in Tools;
- retain the current light palette.

Relevant checklist/reference rows include:
`F01–F24 / AG03–AG06 / AC05–AC06`.

The previous `AC06` PASS based on a top two-row contextual-toolbar crop is not valid evidence for a left double-column Tools state.

## 5. Right side — replace current category bars/icon clutter

The current expanded presentation consisting of one panel plus category bars such as:

- Editor
- Color / Output
- Creative Loop
- Specialist

is not the Photoshop panel-stack target.

For the expanded desktop state, implement one right-side panel authority with **three vertically stacked panel groups** separated by draggable splitters, matching the structure visible in `ps-1`.

Reference geometry:

```text
expanded panel width ≈ 252 px reference state / elastic
panel header-tab band ≈ 28 px
stack splitter ≈ 3 px

reference group heights at 1280×994:
A ≈ 269 px
B ≈ 261 px
C ≈ 384 px
```

Use a stable INK panel grouping with Photoshop grammar:

```text
GROUP A — overview / appearance
Navigator | Properties | Color | Adjustments

GROUP B — creative / content
Libraries | Reference | Compose | CHAT | Revision

GROUP C — document structure
Layers | History | Channels | Pages
```

`Specialist` is not a normal always-visible creative panel. Keep it available from Window/Help/diagnostic routing, but do not let it consume a default visible stack slot unless the USER later requests it.

Requirements:

- each group has compact tabs, one active body, one panel-options trigger;
- three groups remain simultaneously visible in expanded state;
- splitters resize groups vertically with `ns-resize`;
- outer panel edge resizes width with `ew-resize`;
- Window menu and tabs/dock all route to the same panel authority;
- no second panel state owner;
- canvas reflows instead of being covered;
- no duplicate row of panel icons alongside the same expanded tabs.

Collapsed state may use the `ps-2` icon-dock grammar:

- approximately 39 px + divider;
- grouped/separated compact icons;
- no duplicate icon for a panel already represented by a visible expanded tab.

Relevant rows include:
`H01–H14 / I / AG11–AG16 / AH01–AH13 / AC07–AC08 / AJ04 / AN02`.

## 6. Remove/rehome duplicated and low-sense controls

Perform a visible-control reconciliation before finalizing the pass.

Every current visible control must receive exactly one disposition:

```text
KEEP_PRIMARY
MOVE_TO_PS_HOME
GROUP_IN_FLYOUT
MOVE_TO_PANEL_TAB/BODY/FOOTER
MOVE_TO_MENU
CONTEXTUAL_ONLY
WINDOW_ONLY
REMOVE_DUPLICATE_UI
```

Do not delete underlying capabilities.

Specific rules:

- no duplicated panel opener when the panel already has a normal Photoshop-like tab/home;
- no repeated icon whose purpose is indistinguishable from a neighboring icon without tooltip/context;
- one-shot commands belong in menu/context/panel actions rather than occupying permanent Tools slots;
- engineering/diagnostic controls belong in Specialist/Help, not normal creative chrome;
- panel-local frequent actions belong in panel body/footer;
- panel-local configuration belongs in panel options menu;
- application-wide commands belong in application menus.

## 7. Restore the already-captured interaction states

Do not ask the USER to recapture reference material that already exists.

The implementation must preserve/restore the previously documented states:

### Rulers / Guides

- active-document rulers OFF/ON;
- top and left rulers ≈ 17 px reference;
- 17×17 ruler origin corner;
- horizontal guide drag from top ruler;
- vertical guide drag from left ruler;
- live transient X/Y coordinate readout;
- guide show/hide/move/delete/lock and snap feedback through the existing authority.

Relevant rows:
`AI01–AI20 / AL03–AL06 / AM03–AM04 / AN03–AN07`.

### Navigator

- normal preview/proxy;
- proxy synchronized to main viewport;
- proxy drag using existing camera authority;
- high-zoom proxy state;
- compact zoom/footer grammar.

### Layers

- Photoshop-like compact rows;
- selected state;
- drag reorder;
- drag ghost distinct from selection;
- clear insertion target before drop;
- reorder through existing hierarchy + History;
- bottom panel-local actions grouped coherently.

Relevant rows:
`AJ05 / AM10–AM12`.

### Panel interactions

- tab active/inactive;
- panel options menu;
- panel edge width resize;
- stacked group splitter resize;
- collapsed/expanded states.

## 8. Top shell / document shell

Preserve the existing valid Photoshop-aligned shell measurements unless the actual reference comparison shows a mismatch:

- application menu + options chrome = 61 px total reference;
- active-document tab band = 28 px reference;
- document/workspace boundary = 1 px;
- rulers/status are document-context surfaces;
- empty workspace must not reserve dead document-only bands.

Do not create duplicate Undo/Redo/File controls if Edit/File/menu/shortcut/History remain the primary authority.

## 9. Capability preservation

Preserve:

```text
64 capability families
496 product atomics
5 headless/platform atomics
501 normalized atomics total
22 CHAT named tools
34 CHAT bounded edit operations
FORMAT_VERSION = 4
```

This is a UI reassembly, not a Core rewrite.

No Photoshop-only feature such as missing 3D functionality is to be invented merely to match the reference.

## 10. Required execution method

The executor must work from current `main`.

Before editing:

1. inspect current generated HTML/post-Runtime DOM structure;
2. inspect current effective CSS;
3. compare the current screenshot against `ps-1 / ps-2`;
4. identify the current control dispositions being replaced.

Then implement the full structural pass as one bounded UI task.

After editing:

1. regenerate any generated shell entrypoints correctly;
2. verify no raw template tokens remain;
3. verify Web and Portable runtime entrypoints still load;
4. inspect the assembled HTML/post-Runtime DOM;
5. inspect effective/computed CSS where possible;
6. keep focused source checks only as regression guards.

## 11. Evidence required before reporting back

Do **not** report success using only source tests or route counts.

Return to USER only after the deployed/current page can show:

1. default double-column left Tools;
2. expanded right side with three stacked panel groups;
3. group tabs and splitters visible;
4. no redundant expanded-panel icon rail/category-bar clutter;
5. one collapsed right-dock state;
6. Layers expanded state;
7. one ruler/guide state;
8. one Layers drag state;
9. one Navigator state.

The executor must report:

```text
commit SHA
changed files
visible structures replaced
duplicate controls removed/re-homed
what the USER should refresh and inspect
```

No `UI_COMPLETE` declaration.

## 12. Acceptance

This task is successful only when the actual deployed page visibly follows the reference structure.

```text
SOURCE_PASS != ACCEPTANCE
ROUTE_PASS != ACCEPTANCE
RUNTIME_PASS != ACCEPTANCE
CHECKLIST_PASS != ACCEPTANCE

ACTUAL_PAGE + PS_REFERENCE + USER = ACCEPTANCE
```
