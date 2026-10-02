# INK UI Micro-Module Grammar + Application Map v1.0

STATUS: ACTIVE / AUTHORITATIVE INK MICRO-UI GRAMMAR
DATE: 2026-10-01
REFERENCE: ACTIVE/INK_UI_PS_INSTANCE_DATASET_v1.0.md

## 1. Purpose

This document defines one shared UI grammar for current INK.

It answers:

```text
HOW SHOULD INK APPLY THE REFERENCE GRAMMAR?
WHERE DOES EACH SHARED RULE APPLY?
```

It is not a list of isolated CSS fixes.

Required implementation model:

```text
DEFINE SHARED TOKENS / PRIMITIVES
→ MIGRATE ALL APPLICABLE SURFACES
→ REMOVE SUPERSEDED LOCAL OVERRIDES
→ VERIFY STATES
```

## 2. Anti-technical-debt rules

For this normalization pass:

- no new one-off visual patches when a shared primitive can solve the class;
- no new `!important`;
- do not increase existing `!important` count;
- no new independent gray/color literals for covered UI classes;
- no duplicated state authority;
- no fake Photoshop affordance;
- no new breakpoint family unless required by an already-authorized responsive contract;
- no positional selector hacks tied to current DOM sibling order where a semantic class can be used;
- no second implementation of sliders, scrollbars, tabs, panel headers, icon wrappers, or control heights;
- preserve existing command IDs, handlers, Core state and FORMAT_VERSION;
- when a local legacy rule becomes obsolete, remove it in the same change rather than layering over it;
- exceptions must be explicit, named, and justified.

## 3. Typography grammar

Use a small role system.

Required roles:
```text
UI_MENU
UI_CONTROL
UI_PANEL_TAB
UI_PANEL_ROW
UI_SECTION_LABEL
UI_SECONDARY
UI_STATUS
UI_DIALOG
UI_DIAGNOSTIC_MONO
```

Rules:
- normal UI text uses normal weight by default;
- active state is primarily indicated by darker text / state contrast, not bold inflation;
- no oversized card-title treatment inside ordinary tool panels;
- equivalent roles use one font-size/weight/line-height token;
- Chinese and English within the same role share the same hierarchy;
- diagnostic monospace does not leak into ordinary UI.

Current INK correction:
- remove bold from Reference panel ordinary rows/actions;
- `結構分析` and `研究 → 創作` must not behave as bold dashboard cards;
- panel tabs and active items may use contrast emphasis without unrelated size jumps.

## 4. Gray hierarchy

Use the fewest semantic grayscale roles that preserve hierarchy.

Required role family:
```text
SURFACE_APP
SURFACE_PANEL
SURFACE_CONTROL
SURFACE_SELECTED
SURFACE_DISABLED
WORKSPACE_BACKGROUND
TEXT_PRIMARY
TEXT_SECONDARY
TEXT_DISABLED
DIVIDER_NORMAL
DIVIDER_MAJOR
SPLITTER
FOCUS_OR_ACCENT
```

Rules:
- no per-component decorative gray unless it maps to a role;
- ordinary panel rows should usually have no background fill;
- active/inactive distinction prefers text/small state surface changes;
- special saturated colors are reserved for actual semantic accent/state, not ordinary actions.

Current INK correction:
- remove special green treatment from `直接擷取`;
- remove unnecessary gray cards/background blocks in Reference panel;
- do not add new light-gray shades merely to separate each row.

## 5. Divider hierarchy

Use exactly three structural levels:

### Normal divider
- 1 px
- low contrast
- local separation only

### Major boundary
- 1 px
- stronger than normal divider
- shell / major panel boundary

### Panel-group splitter
- visible seam = 1 px
- slightly stronger contrast than an ordinary divider
- draggable hit area ≈5 px, centered transparently on the visible seam
- draggable only where resize behavior exists
- never render the interaction hit area as a thick gray band

Rules:
- do not frame every row;
- do not surround sliders with boxes;
- do not use both border and filled card when spacing alone is sufficient.

Current INK correction:
- right upper/middle/lower panel groups need a clear structural seam;
- internal Reference panel rows should lose most boxes and borders.

## 6. Control geometry

Shared families:

```text
CONTROL_OPTIONS_COMPACT
CONTROL_PANEL_COMPACT
CONTROL_DIALOG
CONTROL_ICON_BUTTON
CONTROL_TOOL_CELL
```

Reference targets:
- Options compact ≈21 px
- panel compact ≈19–22 px-class
- dialog input/select ≈23 px-class
- dialog action ≈26 px-class
- tool active fill 31×24 px / row pitch ≈26 px

Rules:
- same family = same height/baseline/padding;
- do not make a normal panel action look like a CTA card;
- borders exist only when the control requires an input/action boundary;
- parameter rows use label + control alignment, not ad-hoc cards.

## 7. Parameter UI grammar

Every functional parameter must resolve into one of these primitives:

```text
LABEL + VALUE/INPUT
LABEL + SELECT
LABEL + SLIDER
LABEL + TOGGLE
ACTION ROW
COMPACT BUTTON GROUP
READOUT
```

Rules:
- labels align to a stable baseline;
- values align in a stable control column where practical;
- sliders are unboxed;
- state is visible without oversized background containers;
- parameter groups use spacing, not decorative cards;
- functionality must not remain as an unnamed raw HTML control.

This applies to all current panels, not only Reference.

## 8. Spacing grammar

Shared rhythm:
```text
2 / 4 / 6 / 8 / 10 / 16 px
```

Use:
- 2–4 px for icon/internal micro alignment;
- 4–6 px for compact control adjacency;
- 6–10 px for panel body/control grouping;
- 10–16 px for section separation.

Rules:
- no arbitrary 7/11/13/18 etc. margins unless optically justified and documented;
- card-like vertical padding is prohibited in normal compact panels;
- blank space should communicate grouping, not make a panel feel sparse.

## 9. Icon grammar

Required shared properties:
```text
ICON_WRAPPER
ICON_VISIBLE_ENVELOPE
ICON_STROKE
ICON_CAP
ICON_JOIN
ICON_OPTICAL_OFFSET
ICON_ACTIVE
ICON_DISABLED
```

Tools:
- common optical target ≈20×18 px-class
- observed reference range permits shape-specific variation
- wrapper/hitbox is stable even when visible shape differs
- optical correction normally limited to ±1 px unless evidence requires more

Rules:
- no arbitrary Unicode glyphs for window/collapse/panel-menu controls;
- no mixed filled/stroked families without semantic reason;
- same family uses same stroke character.

## 10. Scrollbar grammar

All INK workstation scrollbars:
- rectangular / square-ended;
- no pill/capsule radius;
- compact width consistent by class;
- thumb/track contrast indicates state;
- no panel-specific scrollbar design.

Must be checked in:
- right panel bodies;
- menus where scrollable;
- Layers/History/Libraries;
- document/workspace scroll surfaces where applicable.

## 11. Slider grammar

All sliders:
- thin track;
- circular thumb;
- no extra rectangular outer frame;
- shared track thickness;
- shared thumb diameter;
- disabled state via contrast;
- value readout, when present, is separate from track geometry.

Current Reference panel slider must be migrated to this grammar.

## 12. Panel-content grammar

Normal tool panel:
```text
HEADER/TABS
→ optional compact toolbar/readout
→ aligned parameter rows
→ sparse section separators only when needed
→ optional compact footer actions
```

Prohibited default patterns:
- large rounded dashboard cards;
- bold feature titles;
- colored CTA buttons for ordinary commands;
- boxed slider rows;
- nested panel-within-panel framing;
- engineering/status prose in creative panels.

Active/inactive state:
- text contrast first;
- subtle surface state second;
- bold only where semantically required;
- no size jump.

## 13. Side collapse grammar

Left Tools and right Panels:
- dedicated narrow collapse strip;
- clear separator from adjacent content;
- small controlled arrow/chevron icon;
- arrow direction reflects current state;
- icon optically centered;
- collapsed state must reflow/repack content rather than clipping the expanded layout.

Current INK correction:
- fix missing separators;
- replace incorrect arrow form;
- eliminate collapsed Tools content overflow;
- verify bottom swatches/utility controls remain inside viewport.

## 14. Window-control grammar

Top-right window controls:
- fixed shared hitbox row;
- crisp vector icons;
- optical centering;
- consistent line weight;
- correct minimize / restore-maximize / close positions;
- no fuzzy/scaled raster or text-glyph substitutions.

Exact OS pixel copy is not required; geometry and crispness are.

## 15. Application menu grammar

Application menus use:
- compact normal-weight labels;
- one menu row grammar;
- aligned shortcut column;
- sparse 1 px separators;
- no card styling;
- common popup surface.

### Edit menu information architecture

Reorganize INK's existing Edit-family commands using Photoshop's mature grouping logic, without inventing unsupported capabilities.

Required grouping logic:
1. Undo / Redo / history-state commands
2. Cut / Copy / Paste / duplicate-copy family where applicable
3. search/find/text-extraction utilities where they genuinely belong
4. fill / transform / deformation / content operations according to actual INK command semantics
5. presets/settings/keyboard/menu/tool configuration
6. Preferences entry at the lower settings region

Rules:
- preserve command semantics and handlers;
- remove duplicate or historically accidental placement;
- separators correspond to semantic groups, not arbitrary visual spacing;
- unsupported Photoshop commands are not added.

## 16. Layers panel grammar

Layers must be brought into the same structural grammar as Photoshop while preserving INK capability.

Required structure:
```text
Layers/History/Channels/Pages tabs
→ panel-local menu
→ only supported filter/appearance controls
→ opacity / lock / applicable appearance controls
→ compact layer list
→ compact footer actions
```

Layer row must define:
- visibility control
- thumbnail
- layer name
- selection
- lock state
- hierarchy/indent
- hover
- drag ghost
- insertion target
- truncation
- scrollbar

Footer:
- Add
- Duplicate
- Delete
- other actions only if authoritative INK capability requires them

Rules:
- no fake Photoshop layer-search/filter control if INK lacks that authority;
- INK image-effect filterStack must not be mislabeled as Photoshop layer search;
- drag reorder must remain connected to existing hierarchy + History;
- row density should target the measured ≈35 px reference class unless content requires a justified adaptation.

## 17. Reference panel specific normalization

Current Reference panel is the highest-priority example of panel-content normalization.

Required:
- remove large rounded `結構分析` and `研究 → 創作` cards;
- convert them to compact rows/sections;
- no bold ordinary text;
- no special green `直接擷取` button;
- no gray fill behind ordinary text-only rows;
- slider has no surrounding box;
- controls use common compact heights;
- active state via text/surface contrast;
- align labels and values;
- use the common scrollbar;
- retain actual functionality and command handlers.

## 18. Application Map

| INK surface | Required grammar |
| --- | --- |
| Top Menu | Typography + Gray + Divider + Menu + Icon |
| Options Bar | Typography + Control + Spacing + Icon + Divider |
| Left Tools | Icon + Spacing + Gray + Side Collapse + Color controls |
| Rulers/Workspace | Divider + Gray + Scrollbar |
| Right panel shell | Gray + Divider + Side Collapse + Panel-content |
| Navigator | Panel-content + Slider + Control + Scrollbar |
| Reference | Panel-content + Parameter + Control + Slider + Scrollbar |
| Compose | Panel-content + Parameter + Control |
| CHAT | Panel-content + Typography + Control + Scrollbar |
| Revision | Panel-content + Typography + Scrollbar |
| Properties | Parameter + Control + Typography |
| Layers | Layers grammar + Scrollbar + Icon + Control |
| History | Panel-content + Scrollbar + Typography |
| Channels | Panel-content + Scrollbar |
| Pages | Panel-content + Control + Scrollbar |
| Libraries | Panel-content + Control + Scrollbar |
| Preferences | Typography + Control + Spacing + Gray + Divider |
| Application menus | Menu + Typography + Divider + Spacing |
| Window controls | Window-control + Icon |
| All sliders | Slider |
| All scrollbars | Scrollbar |

## 19. USER issue register — current normalization scope

This grammar incorporates the current ten USER findings:

1. minimal gray usage outside text/workspace/panel hierarchy;
2. preserve right upper/middle/lower panel boundaries while reducing internal frames/lines;
3. collapsed left Tools overflow;
4. missing coherent parameter design;
5. square scrollbars + circular slider thumbs;
6. top-right window controls position/icon sharpness;
7. side collapse separator/arrow and panel-menu glyph corrections;
8. Reference panel simplification and state-by-contrast;
9. Edit menu reorganization from existing INK commands;
10. Layers panel alignment to Photoshop grammar.

## 20. Implementation acceptance

A DEV change is not accepted merely because the ten screenshots look better.

Required checks:
- shared tokens/primitives exist;
- all touched surfaces use them;
- no new !important;
- no new duplicate component implementation;
- no lost command handlers/IDs;
- collapsed Tools contains all intended controls without overflow;
- right panel splitters remain structurally distinct;
- all scrollbars in touched surfaces are rectangular;
- all sliders in touched surfaces use common circular thumb grammar;
- Reference panel has no dashboard-card treatment;
- Edit menu grouping reflects actual semantics;
- Layers states remain functional;
- normal/hover/active/disabled/focus states do not regress;
- narrow/desktop states do not overflow;
- superseded local rules are removed.

## 21. Technical-debt gate

Before handoff, DEV must report:

```text
NEW_IMPORTANT_COUNT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_UI_STATE_AUTHORITY = 0
NEW_ONE_OFF_GRAY_LITERAL_FOR_COVERED_CLASSES = 0
NEW_FAKE_AFFORDANCE = 0
SUPERSEDED_RULES_REMOVED = YES
SHARED_PRIMITIVES_USED = YES
```

Any exception requires explicit USER review.


## 22. Capability → UI Surface Matrix

The current INK capability baseline is larger than the currently visible UI. Existing capability must not remain invisible merely because the present UI omitted its control.

Before implementation, reconcile visible UI against:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

For every user-facing capability relevant to the creative workstation, assign exactly one primary UI home:

```text
OPTIONS_BAR
PANEL_BODY
PANEL_FOOTER
APPLICATION_MENU
CONTEXT_MENU
DIALOG
WINDOW_MENU
DIAGNOSTIC_ONLY
HEADLESS_ONLY
```

Do not place everything in Options Bar.

Adobe/Photoshop grammar:
- Options Bar is contextual to the currently selected tool;
- shared tool parameters may recur across related tools;
- tool-specific parameters appear only when that tool is active;
- one-shot commands normally remain menus/dialogs;
- persistent object/document state belongs in panels/properties;
- application-wide visibility/workspace state belongs in Window/Preferences;
- diagnostics do not occupy ordinary creative chrome.

For each visible tool or command, DEV must record:

| Field | Required |
| --- | --- |
| TOOL_OR_COMMAND | visible tool/command identity |
| CURRENT_CAPABILITY | authoritative INK capability ID/family |
| ACTIVE_CONTEXT | when this UI is applicable |
| PARAMETERS | actual existing adjustable parameters |
| PRIMARY_HOME | one of the homes above |
| SECONDARY_ROUTE | optional shortcut/context route |
| CURRENT_UI | present / missing / misplaced / duplicate |
| REQUIRED_CONTROL_PRIMITIVE | input/select/slider/toggle/action/readout/etc. |
| STATE_OWNER | authoritative state object/module |
| IMPLEMENTATION_DISPOSITION | expose / move / consolidate / leave headless |
| EVIDENCE | rendered + interaction proof required |

Rules:
- capability present + applicable parameter + no valid visible route = UI_ASSEMBLY_DEFECT;
- capability present but headless/support-only = no normal UI required;
- no parameter may be invented merely to imitate Photoshop;
- no duplicate state owner may be created to expose an existing capability;
- related tools should reuse the same shared parameter-control primitive where semantics match.

High-priority capability families for this audit include:
- C07 Selection;
- C08 Smart guides / snapping;
- C09 Align / distribute;
- C10 Pen / vector Path;
- C11 Shapes;
- C13 Transform;
- C14 Deformation;
- C17 Repeat / parametric;
- C19 Auto / Flex layout;
- C20 Text;
- C22 Raster / Image objects;
- C23 Masks;
- C24 Adjustments;
- C25 Filters;
- C26 Blend modes;
- C27 Layer effects;
- C29 Drawing tools;
- C30 Brush engine;
- C31 Natural media;
- C32 Brush dynamics;
- C33 Blender / Smudge;
- C34 Stroke editing;
- C37 Device calibration;
- C38 Paper / media;
- C39 Material system;
- C40 Reference import;
- C41 Extraction / vectorization;
- C42 Structure reconstruction;
- C43 History;
- C46 Compare / Variant;
- C52 High-resolution export;
- C53 Output.

This matrix is a UI exposure audit, not a new-capability work order.
