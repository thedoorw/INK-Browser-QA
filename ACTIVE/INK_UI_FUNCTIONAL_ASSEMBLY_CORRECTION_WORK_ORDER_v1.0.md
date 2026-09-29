# INK Functional UI Assembly Correction Work Order v1.0

STATUS: `ACTIVE / USER_AUTHORIZED / FUNCTIONAL_ASSEMBLY_ONLY`

TASK: `INK-UI-FUNCTIONAL-ASSEMBLY-CORRECTION-001`

DATE: 2026-09-29

## Mission

Complete the actual functional UI assembly that the rejected `INK-UI-ASSEMBLY-COMPLETION-001` did not complete.

This task is **not a visual redesign pass**.

Do not spend this pass restyling the workstation, changing theme direction, or adding another Photoshop-look CSS layer.

The only objective is:

```text
installed 501-capability base
+ authoritative 74-PUI placement
→ real visible/operable routes in current UI
```

## Read

- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
- `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
- current `main`

## Rejection baseline

Current main at rejection:

`32b446a662a6f2269333433dd0c3ac1c4b08d2a8`

Observed:

```text
File = 4 commands
Edit = 3
Image = 1
Layer = 1
Type = 1
Select = 1
Filter = 0
Object = 1
View = 3
Help = 1

panel tabs = brush / object / geometry / ai / studio
dialogs = 1
toolbar tool identities = 12
```

These counts demonstrate that the 74-PUI plan has not been assembled.

## Hard rule

A menu label, panel label, hidden proxy, placeholder, route name, CSS class, or disabled item does **not** count as an assembled UI capability.

An item counts only if the user can reach the existing capability through a real interaction path.

## Required assembly

Use the existing authoritative placement matrix.

Complete the real routes for all non-headless PUI identities, including:

### Top menus

Populate and wire the planned File / Edit / Image / Layer / Type / Select / Filter / Object / View / Window / Help command hierarchy.

The Filter menu must contain real supported filter commands, Filter Gallery and Liquify routes. It may not be empty or placeholder-only.

### Toolbar/flyouts

Expose the planned Draw, Selection, Fill/Sampling, Raster Retouch and Structure tool families through direct slots/flyouts.

### Contextual Options

Implement tool/selection-specific controls that actually change based on active context.

### Right dock/panels

Provide real panel homes for:

```text
Properties
Layers
History
Navigator
Pages
Color
Channels
Adjustments
Libraries
Reference
Compose
CHAT
Revision
Specialist
```

Panel homes must be openable from Window and must use one shared panel-state authority.

### Dialogs/workspaces

Provide real UI routes, where supported by existing Core, for:

```text
Select and Mask
Layer Effects
Filter parameter dialogs
Filter Gallery
Liquify
Gradient editor
Color Profile
Export
Recovery
Pen Calibration
```

### Move misplaced normal creative functions

Mask, Adjustments, Filters, Layer Effects and Channels must no longer depend on Specialist as their primary user route when the placement matrix assigns them a normal creative home.

## Preservation

Preserve:

```text
64 capability families
496 product atomics
5 headless platform atomics
501 total normalized atomics
22 CHAT named tools
34 bounded edit operations
Branding
Web Runtime
Portable Runtime
FORMAT_VERSION = 4
```

Do not create second Core authorities.

## USER-locked CSS / visual rule

The USER explicitly requires a **LIGHT CSS workstation**.

```text
CSS_THEME = LIGHT / USER_LOCKED
DARK_WORKSTATION_THEME = REJECTED
```

The dark CSS layer introduced by the rejected assembly is not authoritative and must not remain as the target theme.

Use `ps-1.png / ps-2.png` for workstation structure, density, hierarchy, toolbar/panel grammar, spacing and control proportions — **not for dark palette inheritance**.

For this functional-assembly pass:
- restore/maintain a light professional CSS system;
- keep contrast and density suitable for a mature desktop graphics workstation;
- do not switch the product to a dark Photoshop palette;
- do not claim final visual fidelity yet; functional placement/assembly remains the main objective.

## Required verification

Before reporting completion, inspect the current source and prove:

1. every PUI-001…PUI-074 has one of:
   - a real reachable UI route;
   - an explicit CONTEXTUAL_ONLY route that appears under its real context;
   - the existing authoritative HEADLESS_NO_CONTROL disposition.
2. no normal-GENERAL PUI is satisfied by a hidden proxy or Specialist-only fallback.
3. Filter menu is not empty.
4. Window routes all planned panels.
5. normal creative panel homes exist in DOM and are user-openable.
6. planned dialogs/workspaces have real launch paths where current Core supports them.
7. unresolved implementation placeholder labels = 0.
8. unresolved template tokens = 0.

Create a compact machine-checkable/source-check evidence file under `working/` that maps PUI-001…PUI-074 to the actual selector/route or HEADLESS disposition.

## Execution

Directly implement on current `main` using bounded reversible commits.

Do not split into UR/DEV.

Do not wait for MR approval.

Do not use Runtime as an iteration gate.

Do not stop for cosmetic review.

## Report

Return only:

```text
FUNCTIONAL UI ASSEMBLY IMPLEMENTED

main HEAD = <sha>
PUI routes = 74 / 74 accounted
GENERAL/CONTEXTUAL real routes = <count>
HEADLESS_NO_CONTROL = <count>
Filter menu = wired
Window panel homes = wired
Specialist-only misplaced normal creative routes = 0

USER ACTION:
重新整理 INK，先檢查功能組裝；視覺尚未宣告完成。
```

Do not declare `UI_COMPLETE`.
