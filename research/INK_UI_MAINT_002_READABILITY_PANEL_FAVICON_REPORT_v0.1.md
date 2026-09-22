# INK UI MAINT-002 Readability / Panel / Favicon Report v0.1

Task: `INK-UI-MAINT-002 — Typography Readability / Panel Authority / Content Containment / Favicon v0.1`  
Branch: `work/ink-ui-maint-002`  
Authorized base: `19ce5f7d03a32600493a550ae2d2262340c229ee`  
Source/static checkpoint: `11cf6e38961e7252c3d6fb12a1fb030b98537bce`

## Result

```text
IMPLEMENTATION = COMPLETE
SOURCE_STATIC_UNIT_PARITY = PASS
POWER_SHELL_WINDOWS_RUNTIME = BLOCKED
UI_PASS = NOT_CLAIMED
DEV_HANDOFF = NOT_ISSUED
```

The implementation is complete and the connected-branch deterministic QA is clean. The mandatory final PowerShell Windows Runtime could not be initiated from the available GitHub connection, so this task stops at `RUNTIME_BLOCKED` as required by the Work Order.

## Typography before / after

The maintenance intentionally does not globally inflate the UI. Existing menu and primary labels that were already around 10–11 px are preserved.

Targeted readability lifts:

| Surface | Earlier active rule | MAINT-002 authority |
|---|---:|---:|
| contextual Advanced | 9 px | 10 px |
| contextual control labels / values | 9 px | 10 px |
| Creative state labels | 7 px | 9 px |
| Creative state values | 8 px | 9.5 px |
| Creative tabs | 8 px | 10 px |
| Creative field labels | 8 px | 10 px |
| Creative inputs / actions | 9 px | 10 px |
| Creative output / status | 8 px | 9.5 px |
| layer metadata | 8.5 px | 9 px |
| status bar | 8 px class of compact rules | 9.5 px |

Secondary foreground colors were also raised from faint gray toward the existing `#aeb0b3` / `#bfc1c3` family where needed.

## Primary panel authority

Before:

```text
legacy top-right Inspector button
+ contextual Advanced
+ right Dock Properties
+ legacy edge control
→ overlapping open/close authority
```

After:

```text
right Dock item
→ select primary-panel content

contextual Advanced / Object
→ route to Properties
→ if Properties is already active, close it
→ synchronized aria-pressed / aria-expanded / active state

single lightweight chevron
→ collapse current primary panel
→ restore last selected primary panel
```

The desktop legacy `#inspectorToggle` remains in DOM only for existing runtime/mobile compatibility and is retired from the desktop shell with `legacy-inspector-toggle`.

Desktop close controls in Inspector / Creative Workspace are also presentation-retired so the global chevron is the single whole-panel collapse control. Underlying command semantics remain unchanged.

Dock clicks now call `selectPanel(...)`; selecting an already-active Dock item does not collapse the panel. No simulated `.click()` routing was introduced.

## Contextual Advanced state

`openContextualAdvanced()` no longer unconditionally forces Inspector open.

Current contract:

```text
active primary panel = Properties
→ Advanced second press
→ closePrimaryPanels()

active primary panel = Layers / History / Reference / Compose / CHAT / Revision / collapsed
→ Advanced press
→ selectPanel('properties')
→ current selection routes Object; otherwise Tool/Brush properties
```

Synchronized state:

- CSS `.active`;
- `aria-pressed`;
- `aria-expanded`;
- contextual label/title;
- Dock active state;
- global collapse chevron state.

## Content containment model

Desktop primary panels now use one explicit flex/overflow authority:

```text
primary panel
  header             flex: 0 0 auto
  tabs/state          flex: 0 0 auto
  body                flex: 1 1 auto
                      min-height: 0
                      min-width: 0
                      overflow-y: auto
                      overflow-x: hidden
  status              flex: 0 0 auto
```

Controls, property cards, Creative fields, transcript/output/pre blocks are bounded with `min-width:0`, `max-width:100%`, and `box-sizing:border-box` where relevant.

Target gate remains Runtime-dependent:

```text
RIGHT_PANEL_CONTENT_CONTAINMENT = SOURCE_PASS / RUNTIME_REQUIRED
HORIZONTAL_PANEL_OVERFLOW = SOURCE_GUARD_PRESENT / RUNTIME_REQUIRED
```

## Favicon

Web and Portable now use:

`product/source/assets/favicon.svg`

Contract:

- local asset only;
- 32 × 32 integer geometry;
- solid light-blue background `#69BFE3`;
- white simplified `Y`;
- no fractional SVG coordinates;
- both delivery pages link the same asset;
- old full `ink-mark.svg` is no longer used as the favicon.

Visible shell branding continues to use the existing INK mark where already intended; this change is favicon-only.

## Web / Portable parity

Delivery-normalized HTML parity: `PASS`.

Allowed delivery differences remain only:

- Web vs Portable application/title/status identity;
- Web-only `WEB` badge;
- Web `src/ink.js` module boot vs Portable `dist/ink.compat.js`;
- Web manifest vs Portable manifest.

MAINT-002 markup is mirrored in both pages:

- favicon link;
- Advanced ARIA hooks;
- legacy Inspector marker;
- global chevron markup.

## Focused QA

Added:

`qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs`

Equivalent deterministic assertions were executed directly against exact files fetched from the connected branch.

```text
shared-shell-parity = PASS
web-shell-parse = PASS
shared-hook-uniqueness = PASS
selection-first-authority = PASS
desktop-duplicate-retirement = PASS
advanced-two-way-state = PASS
advanced-markup-parity = PASS
panel-containment = PASS
readability-lift = PASS
favicon-contract = PASS
version-boundaries = PASS

TOTAL = 11 PASS / 0 FAIL
```

As in the accepted previous UI-lane source evidence pattern, the current connection does not expose a checked-out branch for a literal local `node --test` invocation. No literal Node-run result is claimed.

## Runtime requirement and block

Required final Runtime viewports from the Work Order:

- 1280 × 1024 @ 100%;
- 1280 × 800;
- 960 × 800;
- one short-height desktop viewport;
- Web shell plus Portable parity guards.

Required Runtime proof still includes:

- text readability and no overlap;
- Advanced open/close synchronization;
- Dock Properties and Properties route share one authority;
- legacy top-right desktop Inspector control absent;
- chevron collapse / restore;
- Inspector tabs and Creative Loop bodies vertically reachable;
- zero unintended horizontal primary-panel scrollbar;
- favicon HTTP success;
- Layout / Creation regression guard;
- fullscreen / narrow desktop containment.

### Block reason

The repository contains the established self-hosted Windows Runtime infrastructure, but the currently available GitHub connection in this execution environment does not expose a command to initiate a new `workflow_dispatch` run for the exact task ref/SHA.

Available actions can read workflow runs and re-run an existing run/job. Re-running an older run would preserve its older event input and therefore would **not** test the MAINT-002 exact revision. That would not satisfy this Work Order.

The current manual batch workflow also deliberately requires explicit `workflow_dispatch`; ordinary DEV pushes must not wake the Windows runner. This task does not weaken that governance or add a push-trigger bypass.

```text
RUNTIME_STATUS = RUNTIME_BLOCKED
TINYFISH_USED = NO
FALLBACK_RUNTIME_USED = NO
UI_PASS = NOT_CLAIMED
DEV_HANDOFF = NOT_ISSUED
```

## Changed files

Implementation:

- `product/source/web-shell.js`
- `product/source/styles.css`
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/assets/favicon.svg`

QA:

- `qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs`

Task control / evidence:

- branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` — authorization baseline already present on branch;
- branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- `research/INK_UI_MAINT_002_READABILITY_PANEL_FAVICON_REPORT_v0.1.md`.

## Boundaries

Preserved:

```text
Renderer / WebGL / Canvas engine = unchanged
Document schema / migration = unchanged
History semantics = unchanged
Revision semantics = unchanged
Recipe / Geometry = unchanged
Core modules = unchanged
CHAT execution semantics = unchanged
Persistence = unchanged
FORMAT_VERSION = 4
product base version = v0.1
package mutation = 0
```

No cross-lane implementation dependency was introduced.
