# INK UI — Photoshop Alignment Master Guide v1.0

STATUS: ACTIVE / CANONICAL UI DESIGN + INSPECTION GUIDE
DATE: 2026-09-30
PROGRAM: INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001

## 1. Purpose

This document consolidates the previously scattered Photoshop-alignment requirements into one normal operating guide for INK UI design, implementation and inspection.

Old measurement, workpack and audit files remain provenance/evidence. Normal implementation should not reconstruct the UI rules by reading them all independently.

Normal read order:

1. this Master Guide;
2. the current ACTIVE UI dispatch/work order;
3. only the specific provenance/evidence file named by this guide when exact measurement or historical proof is needed.

Generic reusable rules are in:

`governance/UI_REFERENCE_DRIVEN_DESIGN_AND_INSPECTION_STANDARD_v1.0.md`

## 2. Authority

### Primary visible authority

Durable GitHub reference assets:

- `reference/ui/photoshop/ps-1.png`
- `reference/ui/photoshop/PS-2.png`
- `reference/ui/photoshop/PS-3.png`
- `reference/ui/photoshop/PvsI-1.png`
- `reference/ui/photoshop/PvsI-2.png`
- `reference/ui/photoshop/PvsI-3.png`

USER current visual instructions and acceptance/rejection remain the highest current authority.

### Target-product authority

- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- current INK Core and FORMAT_VERSION 4

### Rule

```text
Photoshop/reference decides WHERE and HOW.
INK capability authority decides WHAT actually exists.
USER decides exceptions and final acceptance.
```

## 3. Allowed deviations from Photoshop

Only these are allowed without being treated as defects:

1. INK uses the USER-locked light palette rather than Photoshop dark colors;
2. Photoshop functionality absent from authoritative INK capability is not invented merely for visual imitation, e.g. unsupported 3D capability;
3. USER explicitly approves a difference.

Everything else is difference-first:

```text
REFERENCE_DIFFERENCE = DEFECT
```

## 4. Canonical macro workstation structure

Desktop INK follows this model:

```text
APPLICATION MENU
────────────────────────────────────────
CONTEXTUAL OPTIONS BAR
────────────────────────────────────────
LEFT TOOLS      CENTRAL WORKSPACE      RIGHT PANEL STACK
double/single                         group A
                                     splitter
                                     group B
                                     splitter
                                     group C
────────────────────────────────────────
DOCUMENT / WORKSPACE STATUS
```

Do not add an extra permanent visual row unless it carries real product behavior.

## 5. Top application shell

Reference top-shell measurement:

```text
application menu + options chrome ≈ 61 px total reference
```

Rules:

- application menus remain compact and aligned;
- Options Bar is contextual to the current tool;
- global commands do not permanently occupy Options Bar;
- document title does not consume Options Bar merely as a replacement for a removed fake document tab;
- permanent duplicate File / Undo / Redo controls are not required when File/Edit/History/shortcuts are the authority;
- icons, labels, inputs and sliders share stable vertical alignment.

## 6. Document tab rule

Photoshop has real multi-document tabs. Current INK baseline does not expose an equivalent complete multi-document authority.

Therefore:

- no fake persistent Photoshop-looking document-tab row;
- do not show a tab that cannot represent switching/closing/reordering documents;
- preserve the document title through legitimate document/title surfaces;
- if real multi-document support is added later, reuse the historical 28 px Photoshop tab reference.

## 7. Left Tools

Desktop default reference state:

```text
double-column Tools ≈ 72 px + 1 px divider
single/collapsed Tools ≈ 39 px + 1 px divider
```

Rules:

- default desktop state is true double-column Tools;
- single-column is an alternate/collapsed state;
- same tool authority in both states;
- grouped/subtools use flyout grammar rather than one permanent button for every subtool;
- one-shot commands do not occupy permanent Tools slots;
- icons are optically centered and use consistent hit boxes;
- active tool, hover, focus and disabled states are readable;
- tool density follows Photoshop rhythm but never becomes tiny/faint.

### 7.1 Tools collapse grammar

Left Tools collapse/expand uses a narrow side/control strip with one small centered arrow/chevron.

This is a region-state control, not an ordinary tool button.

## 8. Global foreground/background color system

Global creative color authority belongs in the lower left Tools area, following Photoshop grammar.

Required structure:

```text
foreground swatch
overlapping background swatch
swap colors
reset to default colors
```

Use the existing INK color state authority. Do not create a second color owner.

Options Bar may expose a color control only when the active tool needs contextual color adjustment.

Any contextual color ring/swatch must be geometrically and optically centered in its hit box.

## 9. Right panel authority

Expanded desktop state uses one right-side authority with three simultaneously visible vertically stacked panel groups.

Reference geometry:

```text
expanded width ≈ 252 px / elastic
panel header/tab band ≈ 28 px
stack splitter ≈ 3 px

1280×994 reference state:
group A ≈ 269 px
group B ≈ 261 px
group C ≈ 384 px
```

Current INK grouping:

```text
GROUP A — overview / appearance
Navigator | Properties | Color | Adjustments

GROUP B — creative / content
Libraries | Reference | Compose | CHAT | Revision

GROUP C — document structure
Layers | History | Channels | Pages
```

`Specialist` remains diagnostic/advanced and does not occupy a normal default stack slot unless USER requests it.

## 10. Panel grammar

Every panel group uses:

- compact tabs;
- one active body;
- one panel-local options trigger;
- consistent 28 px-class header/tab grammar;
- predictable padding;
- panel-local footer only where needed;
- one state authority shared with Window/menu/dock routes.

Stack groups are separated by draggable splitters with `ns-resize` behavior.

Outer panel edge resizes width with `ew-resize` behavior.

Canvas/workspace reflows; expanded panels do not simply cover the work area.

### 10.1 Right collapse grammar

Expanded panel stack ↔ collapsed icon dock uses the same narrow-strip/centered-arrow language as the left Tools state control.

Collapsed reference width:

```text
≈39 px + divider
```

Do not display a redundant expanded icon rail when the corresponding panel tabs are already visible.

## 11. Current panel-content cleanup rules

Normal creative panels must not contain engineering/debug telemetry.

Remove/rehome:

- redundant nested `Edit` tab/row where the outer panel already selects Reference/Compose/etc.;
- `WORKSPACE_READY`, `Creative workspace ready`, and equivalent engineering status copy;
- duplicated panel openers;
- diagnostic controls in normal creative chrome.

Diagnostics belong in Specialist / Help / dedicated diagnostic surfaces.

## 12. Layers reference behavior

Layers must preserve:

- compact Photoshop-like row rhythm;
- selected row state;
- visibility/lock semantics;
- opacity and applicable appearance controls;
- drag reorder;
- drag ghost distinct from selection;
- insertion target before drop;
- reorder through existing hierarchy + History;
- coherent panel-local bottom actions.

Historical reference row pitch is approximately 35 px in the captured state; use it as density guidance, not permission to make labels unreadable.

## 13. Navigator reference behavior

Navigator must preserve:

- preview/thumbnail;
- viewport proxy synchronized to main viewport;
- proxy drag using the existing camera authority;
- high-zoom proxy state;
- compact zoom/footer controls;
- no second camera/state authority.

Historical captured header band ≈28 px.

## 14. Rulers / guides / snap

Required reference behavior:

- rulers OFF/ON;
- top ruler ≈17 px;
- left ruler ≈17 px;
- ruler origin corner ≈17×17 px;
- horizontal guide drag from top ruler;
- vertical guide drag from left ruler;
- transient live X/Y coordinate readout;
- guide show/hide/move/delete/lock;
- snap feedback through the existing snap authority.

Do not classify these as optional just because they are interaction grammar rather than Core capability names.

## 15. Preferences / Settings

INK has one primary Preferences entry.

Preferences is a settings framework, not a Branding-only card.

Current target categories, only where supported by existing INK settings:

```text
一般
介面
工具
畫布與輸入
尺規／參考線／貼齊
效能
儲存
Branding
```

Branding is one category and retains:

- Application Name;
- Application Title;
- Logo;
- Favicon;
- live preview;
- reload persistence;
- Reset to Product Default;
- Promote as Product Default;
- Restore Factory INK.

Preferences dialog grammar:

- one clear titlebar;
- correct text/icon contrast;
- close glyph clearly visible;
- left category navigation;
- right content region;
- consistent input/select/button geometry;
- localized visible labels where practical;
- no second Branding-only menu command.

## 16. Tooltip / hint policy

Automatic UI-obscuring hint text is disabled by default.

Remove:

- hover tooltip clutter;
- nonessential teaching bubbles;
- noncritical floating workflow/status hints.

Preserve:

- actual menus/dialogs;
- errors and confirmations;
- critical interaction feedback;
- guide/snap/coordinate feedback.

## 17. Typography standard

Global principle:

```text
DENSE != TINY
LIGHT != FAINT
```

Audit these roles consistently:

- application menu;
- Options Bar;
- panel tabs;
- panel headings;
- panel body labels;
- form labels;
- input/select values;
- secondary text;
- disabled text;
- status text;
- dialog title/body/buttons.

Equivalent roles share font size, weight and line-height tokens.

Chinese and English text in the same role must not look as if they came from unrelated UI systems.

## 18. Contrast / surface rule

```text
LIGHT_SURFACE -> DARK_TEXT_AND_ICONS
DARK_SURFACE  -> LIGHT_TEXT_AND_ICONS
```

No black close symbol or dark text may disappear inside a dark title/header strip.

Use semantic text/icon roles instead of one-off opacity fixes.

## 19. Shared control geometry

Use/reuse shared geometry roles:

```text
CONTROL_HEIGHT
SMALL_BUTTON_HEIGHT
INPUT_HEIGHT
SELECT_HEIGHT
ICON_BOX
ICON_VISIBLE_ENVELOPE
ROW_PITCH
LABEL_BASELINE
CONTROL_GAP
GROUP_GAP
SECTION_GAP
PANEL_PADDING
MENU_PADDING
```

Same-role controls use the same geometry. Icons are centered inside hit boxes. Labels share stable baselines.

## 20. Language consistency

Normal product chrome is Traditional Chinese by default.

Keep established technical/product names where translating would reduce clarity, but do not scatter isolated English UI labels through otherwise Chinese menus/panels/dialogs.

## 21. Primary-home / duplication rule

Every visible control receives exactly one disposition:

```text
KEEP_PRIMARY
MOVE_TO_PS_HOME
GROUP_IN_FLYOUT
MOVE_TO_PANEL_BODY_OR_FOOTER
MOVE_TO_MENU
CONTEXTUAL_ONLY
WINDOW_ONLY
DIAGNOSTIC_ONLY
REMOVE_DUPLICATE_UI
```

Do not delete underlying capabilities during UI cleanup.

## 22. No fake affordance rule

Do not reproduce Photoshop appearance without the behavior implied by that appearance.

Examples:
- no fake document tabs;
- no fake splitters;
- no fake draggable panel tabs;
- no decorative collapse control that does not change state.

## 23. Mandatory inspection order

Use the real current page, not only source/checklists.

```text
LOOK
→ FINAL HTML / POST-RUNTIME DOM
→ EFFECTIVE / COMPUTED CSS
→ INTERACTION
→ FUNCTION
→ RENDER
→ CORE / DATA
→ CAPABILITY
→ END-TO-END WORKFLOW
→ USER
```

## 24. UI-specific visible inspection sweep

For each desktop UI pass inspect in this order:

```text
TOP MENU
→ OPTIONS BAR
→ LEFT TOOLS
→ COLOR FOOTER
→ WORKSPACE / RULERS
→ RIGHT PANEL GROUP A
→ SPLITTER
→ RIGHT PANEL GROUP B
→ SPLITTER
→ RIGHT PANEL GROUP C
→ BOTTOM STATUS
→ DIALOGS / PREFERENCES
```

Every visible difference receives exactly one disposition:

```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

## 25. Evidence requirements

Do not close visible requirements with proxy evidence.

Examples:

```text
double-column Tools
requires actual left-Tools rendered evidence;
top two-row toolbar evidence is invalid.

stacked panels
requires actual three-group final DOM/rendered state;
panel registry entries are invalid substitutes.

visual alignment
requires rendered/reference comparison;
Runtime PASS is invalid substitute.
```

Dynamic UI must be checked after runtime installation in final DOM plus effective CSS.

## 26. Current active implementation dispatch

Current detail pass:

`ACTIVE/INK_UI_PVSI_PIXEL_ALIGNMENT_DEV_DISPATCH_v1.0.md`

The dispatch is the current bounded mutation task. This Master Guide is the durable design/inspection authority.

## 27. Provenance map — older files

These files remain useful evidence but are no longer the normal entry point:

### Measurement / reference
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md` — macro geometry, double/single Tools, right dock/panel stack measurements.
- `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md` — active-document/rulers/Navigator/History measurements.
- `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md` — guide drag, Layers reorder, Navigator interaction evidence.
- `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md` — panel tabs/options/stacking/status grammar.
- `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md` — detailed visual roles and micro-geometry.
- `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md` — light-theme evidence/roles.
- `working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md` — reference-capture inventory and closure history.

### Architecture / placement
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md` — menu/tool/panel primary-home architecture.
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md` — PUI/capability placement, not proof of implementation.

### Historical workpacks
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

### Historical audit
- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md` — historical requirement inventory; prior PASS labels do not override current actual-page mismatch.

## 28. Historical caution

The scattered evidence was often correct while the acceptance logic was wrong.

Therefore:

```text
OLD REQUIREMENT MAY REMAIN VALID
OLD PASS MAY BE INVALID
CURRENT ACTUAL PAGE + MASTER GUIDE + USER AUTHORITY WINS
```

## 29. Completion

No AI self-declares final UI completion.

Final completion requires the necessary assembly/visual/interaction/function/capability/workflow evidence and USER acceptance.

## 30. Strict visual inspection protocol

The UI inspection order is now mandatory and must not begin from source claims.

### Phase 0 — lock comparison conditions

Record before inspection:

- reference artifact(s);
- current product artifact / commit identity;
- viewport size;
- browser zoom / OS scaling where relevant;
- UI state being compared: collapsed / expanded / menu-open / dialog-open / rulers-on / etc.

Do not compare geometry across screenshots until scale/viewport differences are normalized.

### Phase 1 — blind visual delta sweep

Inspect the actual rendered product against the reference from top-left to bottom-right.

Rules:

```text
NO PASS LANGUAGE
NO "CLOSE ENOUGH"
NO SOURCE EXPLANATION
NO OLD CHECKLIST CLAIMS
NO PRIOR REVIEW CONCLUSION
```

Only enumerate visible differences.

Mandatory sweep order:

```text
APPLICATION MENU
→ OPTIONS BAR
→ LEFT TOOLS
→ GLOBAL COLOR CONTROLS
→ WORKSPACE / RULERS
→ RIGHT GROUP A
→ SPLITTER
→ RIGHT GROUP B
→ SPLITTER
→ RIGHT GROUP C
→ BOTTOM STATUS
→ DIALOGS / PREFERENCES
```

### Phase 2 — same-class consistency sweep

Collect all members of each visible component class and compare them with one another before comparing to Photoshop:

- all application menus;
- all menu popups;
- all panel menus;
- all tool buttons;
- all icon families;
- all tabs;
- all inputs/selects;
- all sliders;
- all scrollbars;
- all panel headers;
- all panel footers;
- all dialog headers / close controls.

One black popup among white application menus is a defect even if that popup works.

### Phase 3 — numeric geometry / density sweep

Measure rather than infer when dimensions matter.

For each major region record:

```text
X / Y
WIDTH / HEIGHT
ROW COUNT
ROW PITCH
CONTROL HEIGHT
PADDING
GAP
ICON BOX
VISIBLE ICON ENVELOPE
FONT SIZE / LINE HEIGHT
SPLITTER SIZE
SCROLLBAR WIDTH
```

A matching outer width does not prove matching density. Tool count, vertical occupation, row rhythm and internal control distribution must also be compared.

### Phase 4 — state coverage matrix

Do not verify only the state shown in one screenshot.

At minimum cover states relevant to the task:

- Tools double / single;
- right panels expanded / collapsed;
- each application menu open;
- panel options menu open;
- Navigator;
- Layers;
- History;
- Reference / Compose / CHAT where applicable;
- Preferences;
- rulers OFF / ON;
- guide drag;
- Layers drag reorder;
- panel width resize;
- stacked splitter resize.

A source implementation of an unobserved state remains unverified.

### Phase 5 — source cause trace

Only after visible differences are enumerated, inspect:

```text
FINAL HTML / POST-RUNTIME DOM
→ EFFECTIVE / COMPUTED CSS
→ UI-FACING JS
→ CAPABILITY AUTHORITY
```

Source analysis explains the defect. It does not substitute for visual discovery.

### Phase 6 — capability / home reconciliation

For every visible Photoshop tool/control absent from INK UI ask:

1. does INK already have the capability?
2. if yes, is it in the wrong home / hidden / duplicated?
3. if no, is it a legitimate CAPABILITY_ABSENT exception?

Do not classify an item as absent merely because it is missing from the current toolbar.

### Phase 7 — interaction verification

For controls whose reference meaning implies behavior, operate the real product:

- click;
- drag;
- resize;
- reorder;
- switch tab;
- collapse/expand;
- open/close;
- persist/reload where relevant.

Event listeners or source handlers are not interaction evidence.

### Phase 8 — disposition

Every observed reference delta receives exactly one status:

```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

No fifth category.

### Phase 9 — USER checkpoint

Present the actual current product after the bounded pass.

Do not declare the UI complete from AI review.

## 31. Reviewer-bias guardrails

The following failure modes are explicitly recognized:

```text
KNOWN_ISSUE_BIAS
LOCAL_PASS_BIAS
PRIOR_NARRATIVE_BIAS
SAME_CLASS_BLINDNESS
SOURCE_FIRST_BIAS
PROXY_EVIDENCE_BIAS
```

Countermeasures:

- discover unknown differences before verifying known ones;
- compare same-class components as a set;
- keep prior PASS statements out of the first visual sweep;
- never infer whole-product conformity from a few matching dimensions;
- use source only after the visible delta inventory;
- preserve USER reference authority over derived interpretations.

## 32. Current PvsI comparison authority

The current bounded implementation pass uses:

- `PvsI-1.png`
- `PvsI-2.png`
- `PvsI-3.png`

These images are now stored as durable GitHub reference assets. A USER re-upload is not required as the authority source; the executor must inspect the exact repository assets, retrieving/materializing them when necessary.

They are immediate comparison authority for:

- structure;
- dimensions;
- density;
- grouping;
- control grammar;
- same-class consistency.

The Photoshop originals remain upstream authority. The INK light palette remains the explicit USER theme override.

## 33. USER exact-fidelity clarification — 2026-09-30

USER explicitly requires absolute similarity rather than approximate similarity before developing an individual INK style.

The current inspection checklist and proposed modification packages are:
`working/INK_UI_PS_EXACT_ALIGNMENT_CHECKLIST_v1.0.md`.
Machine-readable checklist mirror:
`working/INK_UI_PS_EXACT_ALIGNMENT_CHECKLIST_v1.0.csv`.

Shared geometry targets delta=0 at the matched reference environment/state. The previous dispatch's <=1 CSS px residual is not permission to waive a visible discrepancy. Record measurement/raster uncertainty separately and keep unresolved fidelity open. Existing explicit Light-palette, authoritatively absent capability and USER overrides remain named exceptions.

Photoshop document zoom does not scale application chrome. In PvsI composites, outer Photoshop chrome and the embedded INK document image occupy different coordinate systems. Never normalize all chrome from the document's 66.67% zoom. Cross-check multiple chrome anchors against the original reference and record any remaining scale uncertainty.

Ruler thickness alone cannot establish ruler fidelity. Required ruler details include glyph envelope/baseline, vertical label orientation, tick hierarchy/spacing/length, unit conversion, origin and camera synchronization. Placed guides, drag preview and smart guides/snap feedback require separate state references and visual rules. Restore the named original interaction captures before claiming exact guide color/style measurements.

The current rendered sweep identifies the dark Window popup, mixed glyph/SVG tool icons, Navigator zoom-row topology, Layers control homes, Preferences layout and Reference form density as open differences. These are recorded observations, not claims that all unobserved states are defective.

Theoretical flex-ratio residuals are not rendered residuals. SOURCE_COMPUTED and RENDERED_MEASURED must be distinct evidence labels. PLATFORM_RENDERING, REFERENCE_SCALE_LIMIT and VALID_USER_STATE describe evidence conditions; they do not create additional delta dispositions.

This checklist is a supervision/modification plan. It does not alter the active executor task or independently authorize product mutation.
