# INK-UI-DEBT-001 — Shell / Panel Authority Report v0.1

STATUS: UR_REVIEW_PASS / CLEAN_PROMOTION_READY

TASK_ID: INK-UI-DEBT-001
SOURCE_BRANCH: work/ink-ui-debt-001
PROMOTION_BRANCH: promote/ink-ui-debt-001
SOURCE_BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1
PROMOTION_BASE_MAIN: 023906f0cab0fab6d01dd6151bc3b32eda4f34b0
TINYFISH_USED: NO

## Scope

This workpack clears accumulated desktop shell / primary-panel technical debt without adding new UI features or mutating Core contracts.

## Authority result

Desktop primary-panel state is consolidated around:

```text
collapsed
properties
layers
history
reference
compose
chat
revision
```

Results:
- `PRIMARY_PANEL_AUTHORITY = SINGLE`
- `COMPETING_PANEL_EVENT_OWNERS = 0`
- legacy desktop Chevron / Inspector-close ownership removed from `src/ink.js`
- `web-shell.js` owns desktop open/close and destination routing
- Inspector and Creative Workspace are mutually exclusive
- fresh entry is collapsed / canvas-first
- only last selected panel identity may persist

## Navigation result

Dock is the single primary destination layer.

Properties owns contextual sub-navigation only:
- Tool
- Object
- AI
- Core

Layers and History are direct Dock destinations and are not duplicated as top-level Inspector tabs.

`DUPLICATE_PANEL_NAVIGATION = 0`

## Chevron result

Desktop collapse control:
- opens/closes the whole primary panel only
- reopens last selected panel from collapsed state
- is positioned at the canvas / primary-panel boundary
- does not overlap Dock Properties

Accepted geometry:

```css
right: calc(var(--panel-dock-w) + var(--active-panel-w));
width: 18px;
```

Results:
- `PANEL_COLLAPSE_CONTROL = SINGLE_CHEVRON`
- `DOCK_OCCLUSION = 0`

## CSS consolidation

Accepted desktop shell geometry is consolidated into the single
`INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY` region.

Removed / neutralized debt includes:
- legacy Chevron `right:0!important`
- obsolete open-state Chevron translation
- obsolete multi-row Inspector tab grid
- desktop Inspector-tab horizontal overflow
- competing Phase-1 / Phase-4 panel placement authorities
- separate MAINT-001 / MAINT-002 late desktop authority blocks

Mobile-specific behavior remains separate.

Results:
- `CSS_SHELL_AUTHORITY = SINGLE`
- `OBSOLETE_CONTRADICTORY_DESKTOP_RULES = 0`

## Source / unit / parity evidence

Source branch pre-runtime gates:
- focused unit/parity: 39 / 39 PASS
- Web / Portable parity: PASS
- FORMAT_VERSION 4 preserved
- product base version v0.1 preserved
- favicon contract preserved

Architecture-aware regression guards cover:
- fresh load collapsed
- no competing desktop collapse handler
- direct Dock Layers / History routing
- no duplicate top-level navigation
- Creative Workspace hidden unless open
- Chevron / Dock non-overlap
- stage-width restoration after collapse
- Web / Portable parity

## Authoritative source-branch Runtime

Run: `35808747337`
Tested SHA: `08dbb9633ffda84fc11832f4b1186646e10f8dda`
Runner: `DESKTOP-NSOQH69`
Browser: Google Chrome
Artifact: `10728174589`
Artifact digest: `sha256:5235b0a7d9d72028387fcce7dbdb7dcf27ccfc5c8b2a5a5308dadba3606b9c6d`

Result:
- UI = PASS
- Creative = PASS
- Geometry = PASS
- Runtime batch = PASS

## Clean-promotion compatibility check

While UI-DEBT-001 was being developed, main advanced through Core / Integration work.

Latest promotion base:
`023906f0cab0fab6d01dd6151bc3b32eda4f34b0`

The intervening Core changes did not overlap the UI-DEBT-001 product files:
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/src/ink.js`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/runtime/ink-web-ui-001-harness.html`

The promotion payload was therefore replayed cleanly onto latest main.

## Authoritative clean-promotion Runtime

Run: `35812535559`
Tested exact SHA: `c4fad9af9cbc975afa453bf79a02ab33a0a48739`
Runner: `DESKTOP-NSOQH69`
Browser: Google Chrome
Artifact: `10730761141`
Artifact digest: `sha256:189c82f3b2af1c9936bc3d6b9ca83b91b49e4379f660ae0c9d4fce8251bc0bf9`

Result:
- UI = PASS
- Creative = PASS
- Geometry = PASS
- Runtime batch = PASS

The promotion-only Runtime workflow was removed after the PASS. That removal and this evidence file do not modify product or QA behavior.

## Clean promotion payload

Promote:
- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/src/ink.js`
- `product/source/styles.css`
- `product/source/web-shell.js`
- focused UI regression tests
- `qa/runtime/ink-web-ui-001-harness.html`
- this report

Explicitly excluded:
- branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- branch-local `ACTIVE/INK_DEV_PROGRESS.md`
- temporary branch Runtime workflows

## Final gates

```text
PRIMARY_PANEL_AUTHORITY = SINGLE
COMPETING_PANEL_EVENT_OWNERS = 0
DEFAULT_PANEL_STATE = COLLAPSED
CANVAS_FIRST_ENTRY = PASS
PANEL_COLLAPSE_CONTROL = SINGLE_CHEVRON
DOCK_OCCLUSION = 0
DUPLICATE_PANEL_NAVIGATION = 0
RIGHT_PANEL_HEADER_GEOMETRY = PASS
RIGHT_PANEL_CONTENT_CONTAINMENT = PASS
HORIZONTAL_PANEL_OVERFLOW = 0
CSS_SHELL_AUTHORITY = SINGLE
CONTEXTUAL_ADVANCED_AUTHORITY = SHARED
FAVICON = PRESERVED_PASS
PORTABLE_WEB_PARITY = PASS
RUNTIME_QA = PASS
TINYFISH_USED = NO
CORE_MUTATION = 0
PACKAGE_MUTATION = 0
UR_REVIEW = PASS
CLEAN_PROMOTION = READY
```
