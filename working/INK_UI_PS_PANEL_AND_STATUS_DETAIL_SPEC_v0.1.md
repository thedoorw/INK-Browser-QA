# INK UI — Photoshop Panel Tabs / Panel Menus / Document Status Detail Spec v0.1

STATUS: `UR_PREPARATION / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION`

DATE: 2026-09-27

BASE_MAIN: `88a6735ae34ef9308b423471fce01aba7e4f3482`

PURPOSE:
Complete Photoshop-alignment detail that is independent of the still-changing INK capability baseline:
1. panel tabs;
2. panel-local option menus;
3. panel grouping / stacking controls;
4. document status-strip purpose and inclusion rule.

This document supplements:
- `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`

It does not authorize UI implementation while `UI_STATUS = HOLD`.

---

# 1. Photoshop behavior authority

Adobe behavior references:

- Workspace / panel grouping:
  https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html
- Add/remove panels:
  https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/add-remove-panels.html
- Panels and panel menus:
  https://helpx.adobe.com/photoshop/using/panels-menus.html
- Image information / document status bar:
  https://helpx.adobe.com/photoshop/using/image-information.html

Behavior facts used:
- panels may be grouped or stacked;
- Window controls panel visibility;
- a panel tab can be used to close a panel through its contextual menu;
- panel menus are a distinct command surface from application menus;
- Photoshop document status bar is part of the document window and is used for magnification, document information and brief tool guidance.

---

# 2. Panel anatomy — required INK grammar

Every ordinary right-side panel must be decomposed into:

```text
PANEL GROUP
├─ TAB / HEADER ROW
│  ├─ active/inactive panel tab(s)
│  ├─ optional collapse/group affordance
│  └─ panel options menu trigger
├─ PANEL BODY
│  └─ scrollable content
└─ OPTIONAL PANEL FOOTER
   └─ panel-local actions only
```

Do not mix application-wide commands into a panel footer/menu merely to fill space.

---

# 3. Panel tab / header row

Required states:
- active;
- inactive;
- hover;
- keyboard focus;
- disabled only if a panel truly cannot be entered;
- drag/reorder state if grouping/reordering is implemented.

Required content:
- panel name;
- optional icon when the collapsed/dock grammar requires it;
- no redundant title duplicated directly below the same tab unless semantic hierarchy needs it.

Required behavior:
- one tab visually owns the visible panel body;
- clicking inactive tab activates that panel within the same group;
- active tab state is visually obvious without relying only on color;
- right-click/context menu may expose Close where appropriate;
- tab/header remains visually compact and Photoshop-like;
- tab/header does not create a second panel state authority.

Reference evidence:
- captured panel tab/header band ≈ 28 px in ps-1;
- treat as `OBSERVED_DENSITY`, not a permanent hard height unless later Runtime/visual validation confirms it.

---

# 4. Panel grouping / stacking

Required:
- grouped panels share one body region at a time;
- stacked panel groups remain vertically arranged within the same right-side authority;
- resize/splitter behavior does not create overlap;
- active group/tab state survives normal panel switching;
- Window menu check/open state remains synchronized;
- collapse to icon Dock retains panel identity.

If drag-to-regroup is not implemented in the first UI pass:
- do not fake draggable tabs;
- use a stable grouped layout;
- classify drag regrouping as a later enhancement.

---

# 5. Panel options menu — required concept

A Photoshop-like panel must have a defined location for commands that belong to that panel but are not primary body controls.

Visual target:
- compact icon button in panel header/tab row;
- preferred symbol: neutral menu/ellipsis/hamburger-style panel-menu mark;
- one consistent location across panels;
- no decorative menu trigger with no commands.

Interaction:
- click opens panel-local menu;
- outside click / Escape closes;
- menu uses the shared menu visual grammar;
- commands route to the owning panel/document authority;
- no independent state machine if the application menu controller can safely support the same primitive.

Panel-menu command rule:

```text
panel-local configuration
→ PANEL MENU

frequent direct action
→ PANEL BODY / FOOTER

application-wide command
→ APPLICATION MENU

persistent object/document state
→ PANEL BODY / PROPERTIES
```

---

# 6. Panel option examples by panel

These are placement classes, not final capability claims while MR baseline is changing.

## Properties
Panel menu may contain:
- compact/expanded presentation;
- reset panel presentation;
- context display preferences if needed.

Do not duplicate object mutations already exposed in Properties body/Object menu.

## Layers
Panel menu may contain:
- display density / thumbnail presentation;
- panel-local hierarchy display options;
- select/filter display modes if supported;
- panel Close.

Frequent Add/Duplicate/Delete remain footer/body actions.

## History
Panel menu may contain:
- History limit/session display configuration;
- panel display options;
- Close.

Do not invent Photoshop Snapshot/non-linear semantics unless Core later authorizes them.

## Navigator
Panel menu may contain:
- display/overlay preferences for proxy/thumbnail if useful;
- Close.

Zoom and pan controls remain in body/footer because they are frequent.

## Pages
Panel menu may contain:
- page-list display preferences;
- Close.

Add Page remains panel-local direct action.

## Libraries
Panel menu may contain:
- result-view density;
- sort/display preference;
- Clear local query/filter state;
- Close.

Do not imply a full Library Manager.

## Reference
Panel menu may contain:
- display/list preferences;
- Close.

## Compose
Panel menu may contain:
- display/state presentation options;
- Close.

## CHAT
Panel menu may contain:
- panel presentation;
- privacy/context presentation shortcuts where appropriate;
- Close.

Provider/credential engineering does not become ordinary panel menu clutter.

## Revision
Panel menu may contain:
- list/display preferences;
- Close.

## Specialist
Panel menu may contain:
- diagnostic view organization;
- Close.

---

# 7. Panel tab and panel-menu visual audit fields

For Fine Detail Audit, record for each panel state:

```text
TAB_ROW_HEIGHT
TAB_HORIZONTAL_PADDING
TAB_LABEL_FONT_TOKEN
TAB_ACTIVE_INDICATOR
TAB_INACTIVE_CONTRAST
TAB_HOVER_STATE
TAB_FOCUS_STATE
PANEL_MENU_ICON_BOX
PANEL_MENU_ICON_SIZE
PANEL_MENU_TRIGGER_HITBOX
PANEL_MENU_POPUP_OFFSET
PANEL_MENU_ITEM_HEIGHT
PANEL_MENU_SEPARATOR
PANEL_MENU_DISABLED_STATE
PANEL_MENU_CHECK_STATE
BODY_TOP_PADDING
BODY_HORIZONTAL_PADDING
SCROLLBAR_WIDTH
FOOTER_HEIGHT
FOOTER_BUTTON_PITCH
GROUP_SPLITTER_THICKNESS
```

Current measured evidence:
- header/tab band ≈ 28 px;
- stacked splitters ≈ 3 px;
- both are `OBSERVED_DENSITY`.

Everything else is `REFERENCE_MISSING` until measured or behavior-derived.

---

# 8. Status bar question — do not copy blindly

Photoshop has a document status bar, but INK does not automatically need a permanent full-width status bar.

INK rule:

```text
STATUS_STRIP_EXISTS
ONLY IF
IT CARRIES PERSISTENT DOCUMENT/VIEW INFORMATION
THAT IS USEFUL DURING CREATION
AND DOES NOT BELONG MORE NATURALLY IN OPTIONS / PROPERTIES / NAVIGATOR / SPECIALIST
```

Therefore the old generic phrase:
`quiet status / zoom / document state`
is not sufficient as a product requirement by itself.

---

# 9. INK document status-strip purpose

If retained, the surface is defined as:

`DOCUMENT STATUS STRIP`

not:
- diagnostics bar;
- notification center;
- command shelf;
- second Options bar;
- second Navigator;
- second Properties panel.

Its allowed purposes are limited to three classes.

## A. View telemetry — allowed

Candidate persistent information:
- zoom percentage;
- view rotation, only when non-zero or useful;
- fit/view mode indicator if compact.

Interactive zoom controls may remain nearby if they do not duplicate Navigator as a state owner.

Authority:
existing viewport state.

## B. Document production telemetry — allowed when capability exists

Candidate read-only information:
- document/artboard dimensions when useful;
- current color mode;
- bit depth;
- color profile;
- other production-critical document mode that MR eventually confirms.

These become especially relevant after P1-G color/bit-depth/channel capability completion.

Authority:
Document / color-management state.

## C. Brief contextual hint — optional

Possible:
- short active-tool usage hint;
- short mode instruction;
- transient bounded status message.

Conditions:
- must be unobtrusive;
- must disappear/change with context;
- must not replace tooltip, error toast or explicit warning UI.

---

# 10. Information prohibited from persistent status strip

Do not permanently show:
- GPU engine status;
- benchmark FPS;
- QA state;
- storage diagnostics;
- service-worker/update status;
- AI provider/connection diagnostics;
- raw autosave internals;
- full selection properties;
- History count;
- Revision count;
- Library result count;
- long help text;
- duplicated current tool properties.

These belong in Specialist, Help diagnostics, relevant panels, transient toast, or contextual UI.

---

# 11. Status-strip inclusion decision

Current decision before MR completes P1:

```text
FULL-WIDTH_GENERIC_STATUS_BAR = NOT YET REQUIRED
DOCUMENT_STATUS_STRIP = CONDITIONAL / PURPOSE-DRIVEN
BOTTOM_ZOOM_VIEW_CLUSTER = ALLOWED
DIAGNOSTIC_CONTENT = PROHIBITED
FINAL_DOCUMENT_TELEMETRY = WAIT_FOR_P1_G_REBASELINE
```

This means:
- do not reserve a fixed Photoshop-style bottom height merely because Photoshop has one;
- do not remove the possibility of a compact document-status strip;
- final presence/height/content is decided after P1-G/P1-H baseline reconciliation and a usability pass;
- if only zoom remains useful, use a compact bottom view cluster rather than a full-width bar.

---

# 12. Decision test after MR capability completion

For every proposed status item ask:

1. Is this information useful continuously while drawing/designing?
2. Is it document/view state rather than diagnostics?
3. Is there no better existing home?
4. Does keeping it visible justify the pixels it occupies?
5. Can it remain compact at DESKTOP_NARROW?
6. Does it avoid becoming a second state authority?

If fewer than 4 answers are YES:
`DO NOT PLACE IN STATUS STRIP`

---

# 13. AI acceptance additions

Panel:
```text
PANEL_TAB_STATES_DEFINED = PASS
PANEL_OPTIONS_MENU_DEFINED = PASS
PANEL_MENU_DEAD_TRIGGERS = 0
PANEL_MENU_DUPLICATE_AUTHORITY = 0
PANEL_BODY_OVERFLOW = 0
PANEL_GROUP_STATE_OWNER = 1
```

Status:
```text
STATUS_STRIP_PURPOSE_DEFINED = PASS
STATUS_STRIP_DIAGNOSTIC_CLUTTER = 0
STATUS_STRIP_DUPLICATE_PROPERTIES = 0
STATUS_STRIP_DUPLICATE_NAVIGATOR = 0
STATUS_STRIP_FINAL_CONTENT = RECONCILE_AFTER_P1_G
```

---

# 14. Current conclusion

Panel tabs were already present in the broad Photoshop-alignment plan, but panel-local option menus were under-specified.

This document closes the conceptual gap by explicitly defining:
- tab/header;
- panel grouping;
- panel options menu;
- panel footer boundary;
- detail fields to measure.

Status bar remains intentionally **not locked as a mandatory full-width bar**. INK will retain only a compact document/view status surface if its actual information value justifies the space after the refreshed capability baseline is complete.
