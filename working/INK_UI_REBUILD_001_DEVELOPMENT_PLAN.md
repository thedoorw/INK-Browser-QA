# INK UI REBUILD 001 — Development Plan

STATUS: PLANNING_BASELINE / NO_PRODUCT_CHANGE_AUTHORIZED
OWNER: INK UR
BASELINE_MAIN: `d56c8a824247dd52f91a3dac75503eeee0b8cba7`
REFERENCE: user-provided Photoshop workstation screenshots + current deployed INK main

## Goal

Rebuild the INK workstation UI from one authoritative plan instead of closing isolated phases.

Minimum target:

> Match Photoshop's mature workstation grammar first, then apply INK-specific functions and a lighter visual treatment only where it improves usability.

This is not a Photoshop skin. It is a workstation-structure alignment.

## Non-negotiable rules

1. One function has one Primary Home.
2. Secondary entrances must be explicitly classified as Shortcut, Contextual, Keyboard, Responsive Alternative, or Specialist.
3. No visible control may be non-functional.
4. No duplicate control authority may remain because of historical compatibility.
5. A feature is not complete until it is visible and verified on deployed main.
6. Runtime/static PASS cannot substitute for screenshot/interaction PASS.
7. Previously reported user requirements remain OPEN until visually proven closed.
8. No final certification without deployed-main screenshot evidence.
9. Responsive layouts must preserve the same interaction grammar, not become a different product.
10. Every regression test must protect a currently accepted state, not an obsolete one.

## Photoshop alignment baseline

### Top
- application/menu row;
- contextual options row immediately below;
- no oversized permanent command cluster;
- File/Edit/View/Select/Object/Layer/Brush/Window/Help only if their menus are real.

### Left
- edge-attached Photoshop-style tool rail;
- default single column;
- switchable two-column layout;
- same tools/order/groups in both modes;
- layout toggle belongs to toolbar itself;
- no floating edge tab.

### Center
- canvas/work area is visually dominant;
- creation workspace and layout workspace remain one coherent workstation;
- no black/dark startup flash before intended workspace paint.

### Right
- edge-attached Photoshop-style Panel Dock;
- collapsed icon rail;
- expanded panel opens inward from dock;
- clicking the active panel button again closes it;
- no extra floating panel-opening tab;
- no separate Inspector/Properties/Advanced controls competing for the same panel authority;
- panel width resizable;
- one primary panel at a time.

### Bottom
- compact status / zoom / rotation / fit controls;
- no engineering diagnostics in ordinary workspace.

## INK-specific extension

Keep these as INK identity, but fit them into the same workstation grammar:
- Reference
- Compose
- CHAT
- Revision
- Specialist
- Creation / Layout workspace switch

They must not create a second UI system.

## Development sequence

### Stage 0 — Function inventory and duplicate classification
Freeze implementation.
Inventory every visible control and interaction.
Assign each function:
`PRIMARY / CONTEXTUAL / SHORTCUT / RESPONSIVE / SPECIALIST / REMOVE`.

Gate:
`UNCLASSIFIED_VISIBLE_FUNCTIONS = 0`

### Stage 1 — Workstation skeleton
Rebuild shell geometry against Photoshop:
- menu row
- contextual row
- left rail
- central canvas
- right dock
- status row

Gate:
desktop screenshot at 1280×1024 and 960px width.

### Stage 2 — Menus
Build real menus from existing functions.
No dead labels.

Required:
- File
- Edit
- View
- Select
- Object
- Layer
- Brush
- Window
- Help or explicit removal until content exists

Gate:
every visible menu opens, has valid entries, Escape/outside-click works.

### Stage 3 — Left toolbar
Implement Photoshop-style single/two-column rail.
Verify:
- actual two-column rendering;
- toggle visible;
- order/group parity;
- no duplicate tool buttons elsewhere.

### Stage 4 — Right panel system
Replace mixed panel controls with one dock authority.
Required behavior:
- panel button click opens;
- same button click again closes;
- active state synchronized;
- resizable;
- collapsed dock remains;
- remove floating edge tab;
- remove duplicate Inspector/Properties/Advanced panel-open controls.

### Stage 5 — Top-right cleanup
Classify every control currently near top-right.
Remove duplicated workspace, property, inspector and file functions.
Keep only functions that genuinely belong there.

### Stage 6 — Typography and visual system
Consolidate:
- one font-family authority;
- one type scale;
- one weight scale;
- one line-height scale;
- no legacy hard-coded competing typography blocks;
- no microtext below accepted floor except deliberate metadata;
- consistent CJK/Latin/numeric rendering.

### Stage 7 — Branding and first paint
- current user-approved logo;
- current favicon;
- correct browser tab identity;
- no black/dark startup flash;
- first paint matches intended default workspace;
- service-worker/cache build identity updated.

### Stage 8 — Responsive consistency
Desktop, narrow desktop, mobile/compact must remain the same product.
Do not swap to a fundamentally different navigation model merely because width changes.

### Stage 9 — Full visual/interaction audit
Run the master checklist against deployed main.
No closure by source inspection alone.

## Hard stop conditions

Stop and return to audit if any of these are true:
- visible dead control;
- duplicate primary authority;
- old logo/favicon;
- black startup flash;
- menu label without menu;
- active panel button cannot close its own panel;
- left toolbar two-column option missing;
- floating panel edge tab remains;
- desktop/narrow layout changes interaction grammar;
- typography has multiple competing family/scale authorities;
- deployed screenshot differs from accepted source intent.

## Final acceptance formula

```text
FUNCTION_INVENTORY = COMPLETE
DUPLICATE_PRIMARY_HOME = 0
DEAD_VISIBLE_CONTROLS = 0
PS_WORKSTATION_ALIGNMENT = PASS
LEFT_TOOLBAR_SINGLE_DUAL = PASS
RIGHT_PANEL_DOCK = PASS
MENU_COMPLETENESS = PASS
TOP_RIGHT_DEDUPLICATION = PASS
TYPOGRAPHY_CONSOLIDATED = PASS
BRANDING = PASS
FIRST_PAINT_BLACK_FLASH = 0
RESPONSIVE_GRAMMAR_CONSISTENT = PASS
DEPLOYED_MAIN_SCREENSHOT_SET = PASS
USER_REPORTED_LEGACY_ISSUES_OPEN = 0
```

Only then can UI REBUILD 001 be considered complete.
