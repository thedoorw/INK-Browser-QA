# INK UI REBUILD 001 — Technical Debt Pre-flight

STATUS: PREFLIGHT_COMPLETE / TECH_DEBT_GATE_REQUIRED
OWNER: INK UR
BASELINE: `d56c8a824247dd52f91a3dac75503eeee0b8cba7`
AUDIT_BRANCH: `work/ink-ui-rebuild-001`

## Decision

A bounded UI technical-debt cleanup is required **before** normal UI feature/polish development continues.

Core / Renderer / Document / History / Revision / Geometry / CHAT semantics remain frozen.

The cleanup target is only debt that would otherwise cause the UI rebuild to create more overrides, duplicate state owners, invalid regression baselines, or stale delivery behavior.

## Evidence snapshot

Current UI source audit:

- `styles.css` size: 157,379 characters;
- `!important`: 223 occurrences;
- repeated selector authorities:
  - `.topbar`: 14 definitions;
  - `.tool-rail`: 9;
  - `.inspector`: 14;
  - `.stage-wrap`: 18;
  - `.statusbar`: 6;
  - `.control-row`: 12;
  - `.inspector-tab`: 8;
  - `.creative-workspace-panel`: 12;
- media-query families include 1120 / 980 / 900 / 860 / 760 / 560 / 440 / 410 plus coarse-pointer;
- hard-coded typography still spans 6px through 17px in addition to Phase-G tokens;
- multiple font authorities remain, including Inter stack, Segoe UI stack, Georgia and direct system-ui / monospace shorthands.

Current shell/control audit:

- only File is a complete static application command menu;
- Edit / View / Select / Object / Layer / Brush / Window / Help appear as plain menu buttons in source;
- Window is later enhanced dynamically by `web-shell.js`;
- right-side control sources still include:
  - Panel Dock;
  - `contextualAdvancedBtn`;
  - legacy `inspectorToggle`;
  - `inspectorEdgeToggle`;
  - panel close control;
  - Window-menu routes;
- Dock click currently calls `selectPanel(...)`;
- `selectPanel(...)` deliberately returns without closing an already-active panel;
- a correct `togglePanel(...)` function already exists but the Dock does not use it;
- floating `inspectorEdgeToggle` remains in product markup;
- source includes toolbar single/dual code, but deployed evidence supplied by user does not present the accepted Photoshop-like control clearly/consistently.

Current brand/delivery audit:

- visible shell mark uses `assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`;
- favicon route uses `assets/favicon.svg?v=0.1`;
- repository also contains `assets/ink-mark.svg`;
- exact user-approved current brand asset is therefore not represented by one authoritative contract;
- service-worker build identity is `20260924-ui-006-main-r1`.

Current regression-baseline audit:

- `ui-debt-001-shell-panel-authority-v0.1.test.mjs` still asserts the obsolete JPG favicon route;
- `ui-maint-002-readability-panel-favicon-v0.1.test.mjs` asserts the SVG favicon route;
- the two accepted tests therefore encode contradictory favicon contracts;
- MAINT-002 tests explicitly preserve `contextualAdvancedBtn`, `inspectorToggle`, and `inspectorEdgeToggle`;
- Runtime harness explicitly exercises `inspectorEdgeToggle`;
- Runtime harness preserves the current mobile bottom-dock interaction model;
- Runtime harness explicitly verifies the old JPG visible INK mark.

This means a future correct redesign would currently be rejected by some existing tests for changing behavior that is now intentionally obsolete.

## Eight-gate disposition

| Gate | Current state | Decision | Must happen before normal UI development |
|---|---|---|---|
| CSS presentation authority | historical layers + repeated selectors + heavy override chain | `CLEAN / REPLACE` | yes |
| Typography authority | Phase-G tokens exist but do not own all typography | `CLEAN / REPLACE` | yes |
| Panel authority | one shell state owner exists, visible routes/interaction remain duplicated | `KEEP OWNER / CLEAN ROUTES` | yes |
| Menu infrastructure | File/Window bespoke; other visible menus incomplete | `REPLACE WITH ONE MENU CONTROLLER` | yes |
| Responsive authority | many breakpoint families; compact mode changes interaction grammar | `REDEFINE` | contract first; implementation with shell rebuild |
| Brand asset authority | SVG/JPG routes coexist; intended asset not authoritative | `HOLD ASSET / REPLACE CONTRACT` | contract yes; exact asset requires user-approved source |
| Startup first paint | intended workspace not authoritative in initial shell paint; user reproduced dark flash | `REPLACE BOOT CONTRACT` | yes |
| Regression baseline validity | contradictory/obsolete tests protect old UI | `CLEAN FIRST` | mandatory |

## What is preserved

The following technical work is useful and should not be discarded:

- `shell.template.html → generate-shell.mjs → Web/Portable` generation authority;
- exact Web/Portable parity concept;
- service-worker-owned build identity concept;
- `web-shell.js` as the single UI shell state-controller location;
- existing Core/Document/History/Revision/Renderer command semantics;
- existing Inspector resize mechanism, subject to new Panel Dock presentation;
- existing real A4 / creation-space product behavior;
- existing runtime harness infrastructure, after obsolete UI assertions are replaced.

## What must not be preserved merely for compatibility

These are not accepted design authorities for UI REBUILD 001:

- old JPG brand route;
- floating right-edge panel tab;
- legacy Inspector opener;
- multiple equal-weight Properties/Advanced/Dock panel entrances;
- dead application-menu labels;
- current mobile bottom-dock grammar if it conflicts with the unified workstation model;
- historical typography hard-codes;
- historical desktop presentation blocks that are only kept alive by later overrides;
- regression tests whose expected state is already rejected by the user.

## Technical debt gate

Before feature-level UI work is allowed to accumulate on top of current source:

```text
OBSOLETE_UI_REGRESSION_CONTRACTS = 0
VISIBLE_PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLER = 1
FIRST_PAINT_AUTHORITY = 1
TYPOGRAPHY_FAMILY_AUTHORITY = 1
TYPOGRAPHY_SCALE_AUTHORITY = 1
NEW_CSS_OVERRIDE_LAYERS = 0
NEW_UNCLASSIFIED_BREAKPOINTS = 0
BRAND_ASSET_CONTRACT = 1
```

## Sequencing

The cleanup must be executed in this order:

1. regression baseline validity;
2. menu/panel state contracts;
3. startup first-paint contract;
4. typography/token authority;
5. desktop shell CSS authority replacement;
6. responsive contract replacement;
7. brand asset contract;
8. then Photoshop alignment implementation proceeds on this clean authority.

CSS cleanup and Photoshop skeleton may share one implementation batch **only if old presentation blocks are deleted/replaced, not overridden by another late block**.

## Gate result

`UI_TECH_DEBT_PREFLIGHT = COMPLETE`

`UI_TECH_DEBT_CLEANUP = REQUIRED`

`NORMAL_UI_FEATURE_DEVELOPMENT = HOLD UNTIL CLEAN FOUNDATION`
