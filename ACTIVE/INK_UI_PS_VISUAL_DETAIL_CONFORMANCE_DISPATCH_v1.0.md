# INK UI — Photoshop Visual Detail Conformance Dispatch v1.0

STATUS: ACTIVE / USER_AUTHORIZED / DIRECT_MR_EXECUTION
DATE: 2026-09-30
TASK: INK-UI-PS-VISUAL-DETAIL-CONFORMANCE-001
OWNER: DIRECT UI MR EXECUTOR

## 1. Purpose

Continue the Photoshop-aligned reconstruction from the current assembled workstation. This is a visible-detail conformance pass, not a new design.

Primary authority:
- ps-1.png
- ps-2.png
- working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md
- working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md
- working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md
- working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md
- working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md
- governance/INK_PRODUCT_OUTSIDE_IN_INSPECTION_STANDARD_v0.1.md

Rule: REFERENCE_DIFFERENCE = DEFECT unless it is the USER light-palette override, a Photoshop capability absent from INK, or an explicit USER override.

## 2. Preserve current assembled gains

- true double-column desktop Tools
- three simultaneous right-side panel groups
- stacked splitters
- duplicate expanded right icon rail removed
- fake document-tab row removed
- one Edit > Preferences primary route
- current Navigator / Reference / Layers stacked structure
- 64 capability families / 496 product atomics / 5 support atomics / 501 total
- 22 CHAT named tools / 34 bounded edits / FORMAT_VERSION 4

## 3. Remove automatic tooltip / popup clutter

- disable automatic hover tooltips that float over the workstation
- disable nonessential teaching/help bubbles and noncritical workflow/status popups
- preserve real menus, panel menus, dialogs, errors, confirmations and interaction-critical feedback
- preserve ruler/guide live X/Y and snap feedback
- controls should not require automatic tooltip clutter to be understandable

Required result: AUTO_TOOLTIP_CLUTTER = 0; NONESSENTIAL_FLOATING_HINTS = 0; CRITICAL_INTERACTION_FEEDBACK = PRESERVED.

## 4. Unify left/right collapse grammar

- left Tools and right Panels use the same narrow edge/control strip language
- one small centered arrow/chevron in the strip
- arrow direction reflects current state
- same geometry and contrast language on both sides
- collapse/expand is not presented as an ordinary tool icon
- right side must gain this control
- preserve dual/single Tools authority and expanded/collapsed panel authority
- collapsed right state remains compact PS-like icon dock
- expanded right state remains the three stacked panel groups

## 5. Typography and contrast audit

Audit the entire workstation: application menu, Options Bar, panel tabs, panel headers, panel body labels, forms, inputs/selects, secondary text, disabled text, status text, dialog titlebars, dialog body and buttons.

Rules:
- DENSE != TINY
- LIGHT != FAINT
- equivalent roles share one font size / weight / line height
- Chinese and English roles follow one hierarchy
- secondary text remains readable
- disabled text is distinct but not invisible
- avoid ad-hoc per-panel font sizing

## 6. Dark/light surface contrast

Required invariant:
- LIGHT_SURFACE -> DARK_TEXT_AND_ICONS
- DARK_SURFACE -> LIGHT_TEXT_AND_ICONS

Inspect Preferences titlebar, modal/dialog titlebars, panel headers, panel menu/close symbols and every dark strip containing text/icons. Close symbols must never disappear into the background. Use shared semantic roles, not random opacity patches.

## 7. Re-home global color system to left Tools footer

Photoshop reference places the global foreground/background color authority at the bottom of Tools.

Required structure:
- foreground color
- overlapping background color
- compact swap colors action
- compact reset-to-default colors action

Use the existing INK color authority. Do not create a second color state owner.

Global color belongs in the lower Tools area. Options Bar may show color only when it is contextual to the active tool. Do not retain a permanent global color control in Options Bar merely because it already exists.

## 8. Options Bar discipline

- remove document-title occupation from Options Bar
- remove permanent global controls unrelated to the active tool
- keep only tool/context-relevant controls
- switching tool changes Options Bar through the existing authority
- normalize baseline and control heights
- fix the current color ring/swatch geometry so it is optically and geometrically centered in its control
- no off-center or hanging color circle

## 9. Shared control geometry

Define/reuse shared roles for CONTROL_HEIGHT, SMALL_BUTTON_HEIGHT, INPUT_HEIGHT, SELECT_HEIGHT, ICON_BOX, ICON_VISIBLE_ENVELOPE, ROW_PITCH, LABEL_BASELINE, CONTROL_GAP, GROUP_GAP, SECTION_GAP, PANEL_PADDING and MENU_PADDING.

Apply them consistently: same-role controls have the same height; icons center in hit boxes; labels share stable baselines; density comes from controlled spacing rather than arbitrary shrinking.

## 10. Right panel detail correction

Preserve the three stacked groups, then refine their internal Photoshop grammar:
- readable compact tabs
- clear active/inactive hierarchy
- consistent panel-local menu icon position
- quiet splitter
- normalized body padding
- aligned footers
- no engineering/debug status text in ordinary creative panels
- no redundant nested tab when the outer panel tab already identifies the active content
- no duplicate panel opener for a currently visible tab

Known current defects to remove:
- redundant inner Edit row beneath creative panel tabs
- WORKSPACE_READY / Creative workspace ready or equivalent engineering-status copy in normal creative UI

Diagnostic state belongs in Specialist / Help / diagnostics.

## 11. Preferences becomes a real Settings framework

The current Preferences surface is still structurally a Branding form with a route to other settings. Replace it with one categorized settings system.

Target categories, only where existing INK settings support them:
- General
- Interface
- Tools
- Canvas & Input
- Rulers / Guides / Snap
- Performance
- Storage
- Branding

Branding becomes one category and retains Application Name, Application Title, Logo, Favicon, live preview, reload persistence, Reset to Product Default, Promote as Product Default and Restore Factory INK.

Dialog grammar:
- clear titlebar
- close glyph with correct contrast
- left category navigation
- right content area
- shared field/control geometry
- localized visible labels where practical
- no duplicate settings primary home

## 12. Language consistency

- ordinary product chrome is consistently Traditional Chinese
- preserve established technical/product names only where translation creates ambiguity
- Branding field/action labels follow the same policy
- avoid isolated English headings in otherwise Chinese menu/panel/dialog chrome

## 13. Visible delta sweep against Photoshop

After the explicit corrections, inspect TOP MENU -> OPTIONS BAR -> LEFT TOOLS -> CANVAS BOUNDARIES -> RIGHT PANEL STACK -> PANEL HEADERS/TABS/FOOTERS -> BOTTOM STATUS -> DIALOG/PREFERENCES.

For every remaining visible Photoshop difference classify exactly one: FIX_NOW / COLOR_OVERRIDE / CAPABILITY_ABSENT / USER_OVERRIDE. Do not silently accept another category.

## 14. Preserve interactions

Do not break dual/single Tools, right expanded/collapsed state, panel width resize, stacked splitter resize, Window-menu synchronization, rulers/guides, Navigator proxy/drag, Layers drag/reorder, History integration, current-tool context or Branding persistence.

## 15. Execution method

Directly edit current main. No UR/DEV split. No MR pre-approval. No central Runtime as an iteration gate.

Before editing inspect current generated HTML/post-Runtime DOM, effective CSS and actual current page against Photoshop references.

After editing preserve Web/Portable runtime entrypoints, leave no unresolved template tokens, inspect final assembled DOM/HTML and effective CSS, use focused checks only as regression guards, and commit bounded reversible changes to main.

## 16. Required return evidence

Do not return only test counts. Report commit SHA, changed files, visible defects corrected, controls moved/removed, Preferences structure changes, USER refresh targets and remaining visible deltas.

The actual page should visibly demonstrate: no automatic tooltip clutter; left/right narrow-strip arrows; readable typography; no dark-on-dark text/icons; foreground/background colors at Tools footer; contextual Options Bar; centered color indicator; cleaned three-stack panels; categorized Preferences.

Do not declare UI_COMPLETE.

## 17. Acceptance

SOURCE_PASS != ACCEPTANCE
RUNTIME_PASS != ACCEPTANCE
ROUTE_PASS != ACCEPTANCE
CURRENT_PAGE + PS_REFERENCE + USER_INSPECTION = ACCEPTANCE