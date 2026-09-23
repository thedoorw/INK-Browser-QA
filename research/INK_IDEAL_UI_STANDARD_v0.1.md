# INK Ideal UI Standard v0.1

STATUS: UR_DRAFT / UI_LANE / REFERENCE_ALIGNMENT
ROLE: INK UR (UI REVIEW)
BRANCH: `work/ink-web-ui-standard-001`
SCOPE: UI only. No Core/document/history/revision authority changes.

## 1. Purpose

建立 INK 的日常工作站 UI 基準。方法不是閉門造車，而是：

```
INK actual source/runtime
+ user-provided Photoshop reference screenshots
+ Adobe documented interaction grammar
→ INK-specific UI standard
```

Photoshop 是主要成熟範本；INK 保留自己的 Creative Loop、CHAT、Reference、Compose、Revision 等能力。

## 2. Reference baseline

### 2.1 User-provided Photoshop screenshots

Reference images:
- `ps-1.png` — expanded right panel dock
- `ps-2.png` — collapsed icon-only right dock

Both references are 1280 × 1024 screenshots.

Observed reference geometry at this screenshot scale (measurement reference, not a claim of universal Photoshop fixed pixels):
- top application/menu row: ~24 px
- contextual/options row: ~36 px
- total top stack: ~60 px
- left toolbar expanded reference: ~70 px gross occupied width
- right expanded dock: ~252 px
- right collapsed icon dock: ~39 px
- central canvas/workspace remains the dominant visual field

### 2.2 INK current source baseline

Current source uses:
- `--topbar-h: 64px`
- `--status-h: 30px`
- toolbar rendered width: 68px
- `--inspector-w: 280px`
- inspector min/max: 248–420px
- UI font stack: `Inter, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`

Current HTML inventory:
- 214 buttons
- 135 input/select/textarea controls
- Inspector alone carries 129 buttons + 80 other controls

This density must be reduced at the everyday-workspace level without deleting capability.

## 3. Core UI principles

### UI-01 Canvas first
Canvas/workspace is the visual subject. Permanent chrome may support it but must not dominate it.

### UI-02 One Primary Home per capability
Each capability has one authoritative UI home. Other appearances must be explicitly one of:
- contextual shortcut
- keyboard shortcut
- responsive alternative
- temporary task action

No ambiguous duplicated homes.

### UI-03 Mature-reference alignment
When Photoshop already solves a common workstation problem, INK should adopt the proven interaction grammar unless INK has a documented reason to differ.

### UI-04 UI does not redefine Core
UI placement, grouping, visibility, density and interaction shell may change. Document authority, History semantics, Revision semantics, renderer contracts and Core commands are out of UR scope.

### UI-05 Everyday vs specialist separation
General editing controls remain in the everyday workspace.
AI/Core diagnostics/benchmarks/program-import engineering controls must not permanently occupy the normal editing surface.

## 4. Global layout model

Target desktop shell:

```
Application/Menu bar
Contextual Options bar
--------------------------------
Toolbar | Canvas | Panel Dock
--------------------------------
Low-noise Status bar
```

Reference target:
- top stack should visually approach the compact two-level Photoshop grammar
- left/right chrome must be independently collapsible
- canvas expands immediately when a dock is collapsed

## 5. Top area

### 5.1 Menu bar
Primary homes:
- File
- Edit
- View
- Select
- Object
- Layer
- Brush
- Window
- Help

Low-frequency commands should live here instead of remaining permanent buttons.

### 5.2 File controls
Current permanent top buttons:
- New
- Open
- Save
- Export

Target:
- New/Open/Save → File menu primary home
- Export → File menu primary home
- an optional single high-value quick action may remain only if later runtime evidence justifies it

Do not keep four file-management buttons permanently across the main top bar.

### 5.3 Contextual Options
The second top row is contextual.

Examples:
- drawing tool → color / size / opacity / tool-specific quick values
- selection → transform / align / relevant object actions
- text → font / size / alignment
- shape → geometry/fill options

Deep properties belong in Properties panel, not duplicated as another primary UI.

### 5.4 Undo/Redo
Primary semantic home: Edit + keyboard shortcuts.
Top presence is optional and must be judged against available width and Photoshop-style density.

## 6. Left Toolbar

### 6.1 Primary tools
Primary home:
- Draw family
- Eraser
- Select
- Lasso
- Shape
- Text
- Image
- Pan

### 6.2 Tool families
Related tools may share one slot with a flyout/stack:
- Pen / Pencil / Marker / Brush / Airbrush

Tool identity, shortcut and order remain stable.

### 6.3 One-column / two-column mode
Desktop toolbar must support:
- single-column compact mode — default
- two-column expanded mode — user-selectable

Rules:
- switching columns must not change command identity or shortcut
- tool order/grouping remains stable
- two-column mode reduces vertical height; it is not permission to expose unrelated commands
- toolbar collapse/expand control should be visually quiet and stable
- canvas remains dominant

## 7. Right Panel Dock

### 7.1 Panel system, not a mega-Inspector
The right side is a dock/container of separate panels.

General Editor group:
- Properties
- Layers
- History

Creative Loop group:
- Reference
- Compose
- CHAT
- Revision

Specialist group:
- AI
- Recipe / advanced production controls
- Diagnostics / validation

### 7.2 Panel behavior
Required:
- icon-only collapsed dock
- arrow control for expand/collapse
- resizable expanded panel width
- preserve last active panel
- opening another primary panel replaces the current primary panel unless a future multi-column dock is explicitly designed
- Window menu can call panels
- panel visibility must not gate underlying CHAT/Core capability

### 7.3 Width
Current INK inspector already supports 248–420px.
Keep user-resizable width.

Reference checkpoint:
- supplied Photoshop expanded dock ≈252px at 1280px screenshot width
- INK default should be visually compared against that density; exact final token requires runtime validation

## 8. Properties vs other panels

Properties may contain:
- current tool deep settings
- selected object transform
- appearance
- relevant contextual properties

Properties must not permanently contain unrelated development systems.

Move conceptually out of the everyday Properties hierarchy:
- AI connection engineering
- Program Asset import
- Recipe development consoles
- GPU self-test
- Device benchmark
- interactive rendering benchmark
- QA/diagnostic exports

These capabilities are retained but must be surfaced as specialist/diagnostic UI.

## 9. Layers

Layers is an independent panel.

Primary actions:
- reorder by drag
- visibility
- lock
- new
- duplicate
- delete
- opacity

Bottom action rail is preferred for frequent layer operations.

## 10. History

History is an independent panel.

Primary semantic homes:
- step list → History panel
- Undo/Redo → keyboard/Edit, with optional top shortcut

History UI must not redefine History authority or semantics.

## 11. Creative Loop

Separate dock entries:
- Reference
- Compose
- CHAT
- Revision

They are not sub-tabs of generic Properties.

The right dock may visually group them, but their capabilities remain independently addressable.

## 12. Canvas and workspace states

### 12.1 Startup
Do not flash an unrelated dark workspace before the final paper/canvas state.

Loading state must either:
- use the same expected workspace background, or
- show an explicit neutral loading state

### 12.2 Creation vs Layout
Creation/Layout are workspace/view concepts.
Avoid duplicate permanent switches plus redundant menu entries without a clear primary/shortcut distinction.

### 12.3 View controls
Zoom/Fit/Rotation primarily belong to:
- status/view area
- View menu
- keyboard/gesture shortcuts

## 13. Typography system

### 13.1 Font stack
Keep a robust Traditional Chinese UI stack:
`Inter, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`

Do not use decorative fonts for functional UI.

### 13.2 Tokenize typography
Replace scattered arbitrary sizes with named tokens.

Draft tokens:
- UI-XS: metadata / shortcut / secondary status
- UI-SM: compact control labels
- UI-MD: normal menu / input / panel controls
- UI-LG: panel/document titles
- BRAND: product mark only

Exact px values are not frozen until runtime comparison against Photoshop references.

### 13.3 Rules
- avoid critical functional text below readable desktop minimum
- 8–9px text is reserved for non-critical metadata only
- menu, property labels and tabs require stronger legibility than current scattered 8–10px usage
- line-height and weight must be standardized
- Traditional Chinese and Latin must be checked together
- numeric fields should use tabular numerals where useful

## 14. Density and duplication rules

Known duplicate candidates requiring normalization:
- color / size / opacity: contextual vs Properties
- duplicate / group / front / delete: selection bar vs Object panel
- Creation / Layout: top switch vs workspace menu
- Inspector entry: legacy toggle vs edge arrow vs dock

Decision pattern:
```
Primary Home
+ optional contextual shortcut
+ optional keyboard shortcut
```

Never multiple equal-status permanent homes.

## 15. Status bar

Status bar should remain low-noise.

Allowed:
- current tool
- zoom
- rotation
- document/workspace state
- compact autosave/runtime state when meaningful

Avoid turning the status bar into another command toolbar.

## 16. Responsive/fullscreen

Desktop:
- full Menu + contextual bar
- one/two-column toolbar
- resizable right dock

Narrow:
- reduce permanent labels before removing core tools
- panels become overlay/drawer where needed

Mobile:
- mobile dock/sheet is a responsive alternative, not a second command system

Fullscreen:
- must preserve access to collapse controls and essential editing state

## 17. Visual review criteria

Every UI change must be reviewed for:
- canvas dominance
- horizontal/vertical balance
- left/right visual weight
- alignment
- spacing rhythm
- typography hierarchy
- icon consistency
- hover/active/disabled clarity
- panel width/collapse behavior
- absence of accidental gaps/overlaps
- no UI flash between startup states

## 18. Governing rule

When unsure how to place a standard workstation capability:

1. inspect current INK command/behavior
2. inspect Photoshop reference and Adobe documented behavior
3. adopt the mature grammar when compatible
4. diverge only for a documented INK-specific need
5. validate again in runtime

