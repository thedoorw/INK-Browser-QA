# INK DEV PROGRESS

STATUS: DEV_HANDOFF / STOP

TASK_ID: INK-UI-DEBT-001
TITLE: Shell / Panel Authority Consolidation v0.1
BRANCH: work/ink-ui-debt-001
BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1

TASK_STATUS: DEV_HANDOFF
DEV_HANDOFF: READY
UR_REVIEW: REQUIRED

RUNTIME_QA: PASS / NODE_BROWSER_BATCH
TINYFISH_USED: NO
PORTABLE_WEB_PARITY: PASS

## Checkpoint 1 — primary authority + navigation de-duplication

Implemented:
- explicit desktop primary-panel state set: collapsed / properties / layers / history / reference / compose / chat / revision;
- `web-shell.js` is the desktop open/close + active-selection authority;
- removed legacy `ink.js` ownership of `#inspectorEdgeToggle` and `#closeInspector`;
- desktop object-context reveal routes through `INK_WEB_SHELL.open('properties')`;
- tool changes no longer hijack an already selected Dock Layers / History route;
- mobile Inspector behavior remains separate;
- Inspector top navigation is now explicit Properties-only sub-navigation;
- Layers / History were removed from internal top-level navigation while their content surfaces remain direct Dock destinations;
- fresh entry is explicitly collapsed; only last panel identity is persisted.

Pre-cleanup debt confirmed:
- `ink.js` and `web-shell.js` both bound the same Chevron;
- Layers / History existed both in Dock and Inspector top tabs;
- legacy object/tool context could directly change desktop Inspector open/active state.

## Next checkpoint

- consolidate desktop shell CSS authority;
- relocate Chevron to canvas / primary-panel boundary;
- remove known contradictory legacy shell/tab overrides;
- add architecture-aware unit/parity guards;
- run source/static/unit/parity checks.

## Runtime policy

Runtime has NOT been run.
Complete implementation + source/static/unit/parity checks first.
PowerShell Windows Runtime is final-stage only.
TinyFish is prohibited.

Runtime blocked rule:
`RUNTIME_BLOCKED → STOP`


## Checkpoint 2 — CSS authority consolidation

Implemented:
- replaced former MAINT-001 / MAINT-002 tail overrides with one `INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY` region;
- moved accepted desktop topbar / stage / dock / Inspector / Creative Workspace / Chevron / Properties-subnav geometry into that authority;
- removed global `right:0!important` Chevron override and obsolete open-state translation;
- removed obsolete fixed Inspector tab grid and desktop horizontal-tab overflow;
- neutralized older Phase-1 / Phase-4 competing primary-panel placement / width rules;
- corrected Creative Workspace closed-state presentation: desktop display now requires `.open`;
- Chevron now uses `right:calc(var(--panel-dock-w) + var(--active-panel-w))`, placing it at canvas / primary-panel boundary rather than over Dock;
- Properties sub-navigation is one explicit 31 px row and hidden for direct Dock Layers / History;
- body regions own vertical scroll and suppress horizontal overflow;
- 1120 / 980 / 900 desktop breakpoints are explicit intentional deltas after base authority;
- mobile shell rules remain outside the desktop authority.

CSS static guard:
- brace balance: PASS
- legacy Chevron right:0!important: ABSENT
- obsolete repeat(4) Inspector-tab grid: ABSENT
- global Inspector-tab horizontal overflow: ABSENT

Next:
- architecture-aware unit/parity guards;
- pre-runtime source/static/unit/parity execution.


## Checkpoint 3 — architecture-aware regression guards

Added / updated:
- new `ui-debt-001-shell-panel-authority-v0.1.test.mjs`;
- parity guard now rejects internal Layers / History duplicate tabs while requiring their direct Dock content surfaces;
- parity favicon expectation updated to accepted dedicated `assets/favicon.svg`;
- MAINT-002 guard now targets consolidated UI-DEBT-001 authority and verifies Creative Workspace closed/open display semantics;
- responsive guard updated to accepted 244–340 px medium creative-panel bound;
- panel hierarchy guard now keys off consolidated shell authority.

The new guard fails on:
- restored open panel at fresh entry;
- legacy competing Chevron / close onclick ownership;
- duplicated Layers / History Inspector navigation;
- missing direct Dock routes;
- Creative Workspace visible without `.open`;
- Chevron returning to Dock-side `right:0`;
- obsolete repeat(4) / horizontal-overflow Inspector tab geometry;
- broken Web / Portable parity, favicon, version or FORMAT_VERSION.


### Pre-runtime guard maintenance
- updated Photoshop shell geometry regression to target the consolidated `INK-UI-DEBT-001` authority marker instead of requiring the removed MAINT-001 late override.


## Runtime harness hardening before final execution

Updated the existing authoritative `qa/runtime/ink-web-ui-001-harness.html` rather than creating a second UI runtime authority.

Added explicit gates for:
- 1280x1024 collapsed shell containment;
- Chevron canvas/panel-boundary geometry;
- zero Dock overlap / Properties hit-area occlusion;
- real Dock Properties click after collapse;
- Chevron reopen of last selected Properties;
- Inspector/Creative mutual exclusion on every Creative Loop route.

Existing harness already covers:
- fresh load collapsed/canvas-first;
- 1280x800;
- 960x800;
- short desktop height;
- Layers / History direct routing;
- Reference / Compose / CHAT / Revision routing;
- Advanced open/active/second-press collapse;
- panel body vertical scroll / horizontal containment;
- collapsed stage width restoration;
- favicon HTTP resolution;
- service worker / document integrity / fatal runtime health.


## Pre-runtime attempt 1 — stopped before Runtime

Run: `35806247844`
Tested SHA: `cecd5e4006c431192e65ae259864072d0d4c4417`

Result:
- exact bounded materialization: PASS;
- source/static gate: PASS;
- focused unit/parity: 37 / 39 PASS;
- PowerShell Runtime: SKIPPED by gate, as required.

Two failures were stale test contracts:
1. contextual-tool-options expected the old direct `advanced.hidden = ![...].includes(...)` spelling; current equivalent authority uses `const available` then `advanced.hidden = !available`;
2. parity mutation still targeted obsolete `assets/ink-mark.svg` favicon after accepted migration to `assets/favicon.svg`.

No product implementation change is required for these two failures.


## Final attempted Runtime gate — RUNTIME_BLOCKED

Run: `35806396592`
Tested SHA: `0207b647ecf41d872abd7ba37ab27bdd541999ff`
Runner: `DESKTOP-NSOQH69` / self-hosted Windows / X64 / runner 2.337.0

Pre-runtime gates:
- exact bounded materialization: PASS;
- source/static: PASS;
- focused unit/parity: 39 / 39 PASS;
- Web / Portable parity: PASS.

PowerShell Runtime:
- GitHub entered the PowerShell Runtime step only after all pre-runtime gates passed;
- Windows PowerShell refused to load the generated Actions temporary `.ps1` because script execution is disabled by Execution Policy;
- failure occurred before the Runtime body executed;
- loopback server was not started by this step;
- Chromium UI harness was not executed;
- therefore no Runtime visual/browser PASS can be claimed.

Governance:
- do not change machine/user Execution Policy;
- do not use `ExecutionPolicy Bypass`;
- TinyFish was not used.

Required terminal state:
`RUNTIME_BLOCKED → STOP`

No `DEV_HANDOFF` is issued.


## Final authoritative Runtime — PASS

Run: `35808747337`
Tested exact SHA: `08dbb9633ffda84fc11832f4b1186646e10f8dda`
Runner: `DESKTOP-NSOQH69` / self-hosted Windows / X64 / runner 2.337.0
Runtime path: Node-based bounded browser batch
Browser: Google Chrome
TinyFish: NOT USED

Result:
- exact-SHA materialization: PASS;
- UI suite: PASS;
- creative suite: PASS;
- geometry suite: PASS;
- overall Runtime batch: PASS;
- artifact: `10728174589`;
- artifact digest: `sha256:5235b0a7d9d72028387fcce7dbdb7dcf27ccfc5c8b2a5a5308dadba3606b9c6d`.

The prior PowerShell Execution Policy blocker is superseded by this authoritative Node-based Runtime result.

## DEV handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-UI-DEBT-001
BRANCH = work/ink-ui-debt-001
FINAL_HEAD = 08dbb9633ffda84fc11832f4b1186646e10f8dda

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
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
