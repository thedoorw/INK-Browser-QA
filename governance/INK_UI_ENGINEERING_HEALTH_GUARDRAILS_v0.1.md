# INK UI Engineering Health Guardrails v0.1

STATUS: `UR_PREPARED / GOVERNANCE_PROPOSAL / MR_ADOPTION_REQUIRED`

BASELINE_MAIN: `79b76ccafd6e1d3443d2565fcc6d4f284e1d6eac`

SOURCE_HEALTH_BASELINE:
- `working/INK_UI_REBUILD_001_TECH_DEBT_CLEANUP_COMPLETION_RECORD.md`
- `working/INK_UI_REBUILD_001_TECH_DEBT_CLEANUP_EVIDENCE.md`
- `research/INK_UI_REBUILD_001_TECH_DEBT_HEALTH_REPORT_v0.1.md`

## 1. Purpose

Keep UI development from recreating the debt removed by INK UI REBUILD 001.

These rules apply to future UI work orders, not only the Photoshop alignment program.

The governing principle is:

> Change the accepted authority; do not create a second authority that visually wins over the first.

## 2. Protected health baseline

Post-cleanup accepted state:

```text
styles.css characters             = 156111 baseline
!important                         = 19 semantic-only baseline
presentation !important            = 0
hard-coded normal UI px font-size  = 0
normal UI font-family authorities  = 1
width layout modes                 = 3
panel state owners                 = 1
menu state controllers             = 1
duplicate literal DOM ids          = 0
visible logo authorities           = 1
favicon authorities                = 1
first-paint black flash            = 0
frozen Core mutation               = 0
```

Accepted width taxonomy:

```text
DESKTOP_WIDE    > 1120
DESKTOP_NARROW  761–1120
COMPACT         <= 760
```

## 3. CSS authority rules

### 3.1 No final override layer

Forbidden pattern:

```text
old rule remains
→ new rule appended later
→ another stronger selector / !important wins
```

Required pattern:

```text
find accepted authority
→ remove/replace obsolete rule
→ keep one current authority
```

A work order may not close by adding a new “final”, “ultimate”, “hotfix”, “last override” or equivalent presentation block.

### 3.2 Presentation !important budget

`PRESENTATION_IMPORTANT_BUDGET = 0`

Any new presentation `!important` is an automatic STOP → MR.

The existing semantic-only uses are not a general allowance. They must remain limited to:
- state visibility;
- reduced-motion behavior;
- equivalent explicit semantic exceptions already documented.

If a new semantic `!important` is genuinely required, it needs:
- named reason;
- source location;
- QA coverage;
- MR approval.

### 3.3 Selector authority

For every touched shell surface:
- one accepted desktop authority;
- one accepted responsive authority per applicable mode;
- state/modifier selectors may extend behavior but may not become a competing base presentation.

When touching one of the historically duplicated selectors, the change should maintain or reduce definition count, not increase it without explicit justification.

Tracked surfaces include:
- `.topbar`
- `.tool-rail`
- `.inspector`
- `.stage-wrap`
- `.statusbar`
- `.control-row`
- `.inspector-tab`
- `.creative-workspace-panel`

### 3.4 styles.css growth

File size alone is not a defect, but growth must be visible.

Every UI handoff records before/after CSS character count.

If one bounded work order increases `styles.css` by more than 5% without deleting/replacing obsolete presentation, MR must explicitly decide whether:
- the growth is justified;
- the surface should be modularized;
- the scope is too broad.

This is a review trigger, not a target to game.

## 4. Typography rules

Normal workstation UI must use:
- `var(--ui-font)` / inherited UI font authority;
- semantic size tokens;
- semantic weight tokens;
- semantic line-height tokens.

Forbidden in ordinary workstation UI:
- direct competing font stacks;
- decorative font families;
- raw hard-coded pixel font sizes;
- typography `!important` used to win the cascade.

Allowed separate typography:
- monospace for code / diagnostic output with explicit semantic class.

Health contract:

```text
NORMAL_UI_FONT_AUTHORITIES = 1
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
TYPOGRAPHY_PRESENTATION_IMPORTANT = 0
```

## 5. Responsive rules

No new width family may be added casually.

Allowed width boundaries remain:
- 1120;
- 760 / 761.

Pointer, height and reduced-motion queries may exist as capability modifiers but may not create a fourth width-mode product grammar.

A new width threshold requires:
1. a documented layout failure that cannot be solved inside an existing mode;
2. MR authorization;
3. update to the named responsive taxonomy;
4. regression coverage;
5. before/after health report.

Hard contract:

`WIDTH_LAYOUT_MODES = 3`

until explicitly revised by MR.

## 6. Menu / panel / command authority

### Menu

`MENU_STATE_CONTROLLER = 1`

All application menus must use the shared controller for:
- open;
- close;
- one menu at a time;
- Escape;
- outside click;
- focus return;
- command routing.

Do not create a bespoke menu state machine for a new menu.

### Panel

`VISIBLE_PANEL_STATE_OWNERS = 1`

All right-side primary panels must route through the same panel authority.

Do not add:
- another Inspector state owner;
- another floating edge opener;
- another equal-weight Properties opener;
- a mobile-only second panel state model.

### Commands

A function may have multiple routes only when each route is explicitly classified:
- PRIMARY;
- CONTEXTUAL;
- SHORTCUT;
- RESPONSIVE;
- KEYBOARD;
- SPECIALIST.

`PRIMARY_HOME_PER_FUNCTION = 1`

No new visible route is allowed without updating the function inventory/classification.

## 7. DOM and shell authority

`shell.template.html` remains the sole editable shell markup authority.

Generated Web / Portable output must not be hand-edited.

Every shell-affecting change must prove:
- generator check PASS;
- Web/Portable parity PASS;
- duplicate literal DOM IDs = 0.

Do not preserve obsolete hidden duplicate elements merely because an old test points at them. Update the test to the accepted authority instead.

## 8. Delivery / first-paint rules

The server/generated shell owns the intended first visible state.

Do not rely on Runtime boot to repaint the workstation from an obsolete intermediate theme.

Required:
- first visible frame matches accepted workspace;
- black/dark startup flash = 0;
- service worker cannot preserve stale visual shell.

When a shell visual contract changes:
- `config.js` BUILD_ID;
- `service-worker.js` BUILD_ID;

must remain synchronized.

Do not modify:
- product version;
- FORMAT_VERSION;

for a UI-only visual change unless separately authorized.

## 9. Regression-test rules

Regression QA protects accepted product behavior, not historical implementation.

Forbidden:
- keeping an obsolete UI solely because a test expects it;
- weakening a real assertion to constant PASS;
- deleting coverage without replacing the retired contract;
- testing implementation trivia when the accepted behavior can be tested directly.

When a UI contract changes:
1. state the retired behavior;
2. state the new accepted behavior;
3. replace the assertion;
4. run focused QA;
5. run browser Runtime when interaction/visual behavior is affected.

## 10. Core boundary

UI work does not authorize mutation of:
- Renderer / WebGL / Canvas engine;
- Document schema / migration;
- History semantics;
- Revision semantics;
- Geometry / Recipe;
- CHAT approval / execution authority;
- persistence semantics;
- FORMAT_VERSION;
- product version.

If UI work appears to require any of the above:

`STOP → MR → separate bounded Work Order`

Do not solve a UI layout problem by changing Core semantics.

## 11. Mandatory UI health delta at every DEV_HANDOFF

Every UI handoff must include:

```text
BASELINE_SHA =
HANDOFF_SHA =

styles.css chars: before → after
!important total: before → after
presentation !important: before → after
hard-coded normal UI px font sizes: before → after
width layout modes: before → after
new width thresholds: list / none
tracked selector definition counts: before → after
panel state owners: before → after
menu state controllers: before → after
duplicate literal DOM ids: before → after
visible Primary Home duplicates: before → after
dead visible controls: before → after
Web/Portable parity: PASS/FAIL
first paint: PASS/FAIL
Core mutation: 0 / STOP
```

A UI feature is not handoff-ready without this delta.

## 12. Work-order health gate

Before implementation:
- identify existing selector authority;
- identify state owner;
- identify Primary Home;
- identify tests to retire/update;
- identify responsive mode affected.

During implementation:
- remove/replace obsolete authority;
- do not add late overrides;
- keep scope bounded;
- record meaningful commits.

Before handoff:
- focused static/source QA;
- health delta;
- required browser interaction;
- required visual captures;
- no silent baseline regression.

## 13. Automatic STOP conditions

Any of the following blocks progression:

```text
NEW_PRESENTATION_IMPORTANT > 0
NEW_UNAUTHORIZED_WIDTH_THRESHOLD > 0
PANEL_STATE_OWNERS > 1
MENU_STATE_CONTROLLERS > 1
DUPLICATE_LITERAL_DOM_IDS > 0
PRIMARY_HOME_PER_FUNCTION > 1
DEAD_VISIBLE_CONTROLS > 0
HARD_CODED_NORMAL_UI_PX_FONT_SIZE > 0
HAND_EDITED_GENERATED_SHELL = 1
FINAL_OVERRIDE_LAYER_ADDED = 1
FIRST_PAINT_BLACK_FLASH = 1
FROZEN_CORE_MUTATION > 0
```

Result:

`STOP → MR_REVIEW`

## 14. Periodic health review

At minimum:
- after each Photoshop alignment stage;
- before promotion to main;
- after any UI work order with broad CSS changes.

The health report should compare against the post-cleanup baseline, not only against the immediately previous commit.

This prevents gradual regression across many individually small changes.
