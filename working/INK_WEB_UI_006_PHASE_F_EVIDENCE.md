# INK-WEB-UI-006 — Phase F Evidence

STATUS: `DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / UI_ONLY / PHASE_F / STOP`
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-006-f`
BASELINE_PHASE_E_ACCEPTED_BRANCH_HEAD: `1f1151b958a66a44314f0c712942c29c824d5628`
BASELINE_PHASE_E_TESTED_PRODUCT_SHA: `6ee7ef4343a0bc8d70c3340ba7bd12be4b430931`
PHASE_E_RUNTIME: `35943860711 / PASS`
PHASE_F_PRODUCT_QA_CHECKPOINT: `1ccfa450d8fe3248e402d26315c386a50e4f4a1b`

## Scope

Implemented only Phase F — Duplication Cleanup / Primary Home Enforcement.

No Phase G work was started.

## Duplicate inventory — before / after

| Family | Before Phase F | Phase F result | Classification |
|---|---|---|---|
| File | File menu plus retained top-chrome command endpoints | File menu remains the desktop Primary Home; desktop copies remain visually removed; retained file endpoints are explicitly responsive alternatives | `PRIMARY_HOME` + `RESPONSIVE_ALTERNATIVE` |
| Edit / History | top Undo/Redo plus History panel | unchanged behavior; Undo/Redo explicitly treated as shortcuts; History remains the inspection home | `SHORTCUT` + panel Primary Home |
| Tool selection | left Toolbar plus draw-family popover | left Toolbar remains the Primary Home; draw-family popover remains a subordinate tool-family route | `PRIMARY_HOME` |
| Immediate controls | contextual Color / Size / Opacity plus complete Properties controls | both preserved; contextual is explicitly immediate Primary Home, Properties is explicitly deeper configuration | `PRIMARY_HOME` + `DEEP_SETTINGS` |
| Selection actions | contextual Selection bar duplicated by a full Properties action strip | contextual Duplicate / Group / Front / Align Center / Delete remains the fast route; equal-status Properties duplicates are no longer visible | `CONTEXTUAL_SHORTCUT` |
| Selection deep actions | mixed into the duplicate Properties action strip | only non-contextual/deeper `Ungroup` and `Send to Back` remain as the visible compact row; full alignment/transform settings remain deeper Properties | `DEEP_SECONDARY` / `DEEP_SETTINGS` |
| Panels | right dock, Window menu, edge affordance, hidden legacy toggle | dock explicitly Primary Home; Window menu explicitly secondary; edge affordance collapse/restore only; legacy inspector toggle remains hidden | `PRIMARY_HOME` / `SECONDARY_ROUTE` / `COLLAPSE_RESTORE_ONLY` |
| Workspace | top workspace switch plus menu-strip workspace dropdown | top switch explicitly Primary Home; menu-strip dropdown explicitly secondary shortcut | `PRIMARY_HOME` + `SECONDARY_SHORTCUT` |
| Specialist | separate dock group sharing existing Inspector authority | preserved; no engineering/diagnostic controls moved back into normal Properties | Specialist Primary Home |
| Mobile | desktop-equivalent access copies where required | intentional mobile file access remains classified as responsive alternative; desktop cleanup does not remove mobile Export | `RESPONSIVE_ALTERNATIVE` |

## Selection handler preservation

The following existing Properties button IDs remain in the DOM as hidden handler proxies so `product/source/src/ink.js` does not require semantic or command-binding changes:

- `duplicateSelectionBtn`
- `groupSelectionBtn`
- `frontSelectionBtn`
- `deleteSelectionBtn`

Their user-facing equal-status row is removed.

Visible Properties-only deeper actions remain:

- `ungroupSelectionBtn`
- `backSelectionBtn`

The accepted contextual Selection route remains:

- `data-selection-action="duplicate"`
- `data-selection-action="group"`
- `data-selection-action="front"`
- `data-selection-action="alignCenter"`
- `data-selection-action="delete"`

No selection command semantics were changed.

## Changed product / QA files

- `product/source/shell.template.html`
- `product/source/index.html` — regenerated delivery output
- `product/source/index-standalone.html` — regenerated delivery output
- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/runtime/ink-web-ui-001-harness.html`

Documentation:

- `working/INK_WEB_UI_006_PHASE_F_DEV_HANDOFF.md`
- `working/INK_WEB_UI_006_PHASE_F_EVIDENCE.md`

## Static verification

Exact connector-side checks against `work/ink-web-ui-006-f`:

```text
WEB_TEMPLATE_GENERATION_PARITY = PASS
PORTABLE_TEMPLATE_GENERATION_PARITY = PASS
WEB_SHELL_JS_PARSE = PASS
UI_RUNTIME_HARNESS_INLINE_SCRIPT_PARSE = PASS
CSS_BRACE_BALANCE = PASS / 1540 : 1540
SHELL_TEMPLATE_DUPLICATE_DOM_IDS = 0
SELECTION_HANDLER_PROXIES_PRESENT = PASS
PRIMARY_HOME_ROUTE_MARKERS = PASS
RESPONSIVE_ALTERNATIVE_MARKERS = 4
PHASE_F_BASELINE_COMPARE = AHEAD_ONLY / EXPECTED AUTHORIZED SURFACES
```

The committed `index.html` and `index-standalone.html` exactly match the outputs produced by the checked-in `generate-shell.mjs` substitution contract from the modified `shell.template.html`.

The connector environment does not expose a local repository checkout or workflow-dispatch action, so the literal command:

`node product/source/generate-shell.mjs --check`

was not executed on a checkout in this DEV connection. Exact generated-output parity was verified directly from the GitHub SSOT file contents instead.

## Runtime harness additions / updates

`qa/runtime/ink-web-ui-001-harness.html` now verifies:

- Panel Dock = `PRIMARY_HOME`
- Window menu = `SECONDARY_ROUTE`
- edge affordance = `COLLAPSE_RESTORE_ONLY`
- File menu = desktop `PRIMARY_HOME`
- retained file endpoints = `RESPONSIVE_ALTERNATIVE`
- workspace top switch = `PRIMARY_HOME`
- workspace menu = `SECONDARY_SHORTCUT`
- Toolbar = tool-selection `PRIMARY_HOME`
- Selection bar = `CONTEXTUAL_SHORTCUT`
- hidden Properties duplicate action proxies retain existing handlers
- deeper Properties selection actions remain reachable
- contextual immediate controls vs Properties deep settings are explicitly separated
- no duplicate DOM IDs
- mobile Export responsive alternative remains available
- existing Phase C/D/E, narrow desktop, fullscreen, panel routing and regressions remain in the same authoritative harness

## Runtime status

```text
WINDOWS_SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
GITHUB_HOSTED_ACTIONS_USED = 0
AUTHORITATIVE_RUNTIME_HARNESS_UPDATED = PASS
UR_EXACT_SHA_RUNTIME = REQUIRED
DEV_RUNTIME_PASS_CLAIM = 0
```

The GitHub connector available to this DEV window does not expose workflow dispatch. UR should run the existing Windows self-hosted Runtime against the final exact branch HEAD.

## Boundary confirmation

```text
DOCUMENT = UNCHANGED
HISTORY = UNCHANGED
REVISION = UNCHANGED
GEOMETRY_CORE = UNCHANGED
CHAT_SEMANTICS = UNCHANGED
SERVICE_WORKER = UNCHANGED
RUNTIME_BOOTSTRAP = UNCHANGED
BUILD_CACHE_IDENTITY = UNCHANGED
PRODUCT_VERSION = v0.1 / UNCHANGED
FORMAT_VERSION = 4 / UNCHANGED
PHASE_G = NOT_STARTED
```

No `product/source/src/**`, Service Worker, runtime bootstrap, schema, Document, History, Revision, Geometry, Recipe/Core or CHAT reasoning/execution source file is in the Phase F product/QA compare.

## DEV state

```text
TASK = INK-WEB-UI-006 / PHASE_F
STATIC = PASS
RUNTIME = UR_EXACT_SHA_REQUIRED
COMPLETION = DEV_HANDOFF
NEXT = UR_REVIEW
STOP
```
