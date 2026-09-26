# INK-TECH-CLOSURE-001 — Final Runtime Fix 3 DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

DISPATCH_HEAD:

`d6ce01dc47614100bedea2592e64c18f66bc28d3`

AUTHORITATIVE_RUNTIME:

```text
RUN = 36225935515
TESTED_SHA = d6ce01dc47614100bedea2592e64c18f66bc28d3

MATERIALIZATION = PASS
FOCUSED_NODE = 26 / 26 PASS
UI = PASS
GEOMETRY = PASS
CLOSURE = FAIL
CREATIVE = FAIL
```

## 1. Mission

Fix only the two exact residual defects proven by Runtime run `36225935515`.

Do not reopen C1 / C2-A / C2-B / C2-C product capability work.
Do not add capabilities.
Do not run Windows Runtime from DEV.
Do not promote.

## 2. Preserved accepted evidence

```text
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
repeat.expand.v1 = CORE_ONLY_ACCEPTED / NOT_EXPOSED

focused Node = 26 / 26 PASS
UI Runtime = PASS
Geometry Runtime = PASS

C2-C per-operation History saturation proof = PASS
grounded provider snapshot clone = retained
real AuditBridge focused regression = PASS
```

## 3. Defect E — final Closure History accumulation assertion still ignores retention limit

Runtime exact failure:

```text
QA = CLOSURE_HISTORY_ACCUMULATED
actual applied = 30
History limit = 30
```

All earlier Closure operations and all seven C2-C per-operation native History receipts passed.

The remaining final assertion still requires an impossible retained count:

```text
finalHistory.result.applied >= 35
```

But `get_ink_history` reports the retained timeline. History authority intentionally caps the undo stack at its configured limit.

### Classification

`QA_FALSE_NEGATIVE_AT_HISTORY_RETENTION_LIMIT`

### Authorized fix

Primary file:

`qa/runtime/ink-tech-closure-001-browser-harness.html`

Replace the final accumulation assertion with a limit-aware retained-history contract.

Required evidence should prove:

```text
get_ink_history.status = COMPLETED
pending = false
limit = accepted History limit
applied = min(expected accumulated retained count, limit)
retainedCount is internally consistent
latest retained entries remain native/valid
```

The harness already proves individual operation History receipts. Do not attempt to use retained undo-stack length as proof that every historical operation remains stored beyond the configured limit.

### Prohibited

Do not change:

- History limit;
- History push/shift behavior;
- History timeline semantics;
- public History API behavior;
- product source merely to satisfy this QA assertion.

If source evidence disproves this classification, STOP → MR.

## 4. Defect F — root app state attribute collides with workspace-control selector

Runtime exact writer stack:

```text
WORKSTATION_PROPERTIES_GROUNDED_NO_DIRTY_WRITER

app.markDirty
→ InkApp.switchWorkspace
→ HTMLDivElement click listener
→ propertiesButton.click()
```

Exact source facts:

`product/source/index.html`:

```html
<div id="app" ... data-space="creation" ...>
```

Actual workspace controls are buttons under `#workspaceSwitch`:

```html
<button type="button" data-space="creation">...</button>
<button type="button" data-space="layout">...</button>
```

`product/source/src/ink.js` currently binds:

```js
$$('[data-space]').forEach(button =>
  button.addEventListener('click', () => this.switchWorkspace(button.dataset.space))
);
```

Because `#app` itself also carries `data-space`, the root app receives a click listener. Any descendant click bubbles to `#app`, causing:

```text
unrelated UI click
→ switchWorkspace('creation')
→ markDirty()
→ doc.modifiedAt changes
```

This is the proven cause of the grounded OBSERVE timestamp mutation in the browser Runtime.

### Classification

`PRODUCT_EVENT_SELECTOR_COLLISION / ROOT_STATE_ATTRIBUTE_MISTAKEN_FOR_CONTROL`

### Authorized product fix

Primary product file:

`product/source/src/ink.js`

Restrict the workspace click binding to actual workspace controls only.

Preferred bounded shape:

```js
$$('#workspaceSwitch button[data-space]').forEach(...)
```

or an equivalently precise selector that excludes `#app` and all non-control state containers.

Do not remove `#app[data-space]` if it is required as workspace state/CSS authority.

Do not weaken `markDirty()` globally.

Do not special-case grounded CHAT or Properties.

Do not stop event propagation as a workaround if the selector collision can be fixed at binding authority.

### Required behavior after fix

```text
click grounded-selection-refresh
→ no switchWorkspace
→ no markDirty
→ Document / History / Revision unchanged

click actual creation/layout workspace buttons
→ switchWorkspace still works through existing authority
```

If correcting the selector exposes another independent product writer, record exact stack and STOP → MR rather than broadening scope.

## 5. Required focused QA

Add/adjust regression coverage proving:

### Defect E

```text
History at saturation remains accepted
final retained History proof is limit-aware
per-operation C2-C native History receipt proof remains strict
History authority unchanged
```

### Defect F

```text
#app[data-space] does NOT receive workspace-control click binding
actual workspace buttons DO receive the existing switchWorkspace behavior
unrelated descendant click does not call switchWorkspace
unrelated descendant click does not call markDirty
get_grounded_creative_context browser path remains Document/History/Revision neutral
modifiedAt remains included in strict equality
```

Preserve:

```text
34 bounded operations
21 named tools
FORMAT_VERSION = 4
focused Node superset PASS
```

## 6. Authorized files

Product:

```text
product/source/src/ink.js
```

QA:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
new narrowly scoped regression only if needed
```

Evidence:

```text
working/INK_TECH_CLOSURE_001_RUNTIME_FIX_3_CHECKPOINT.md
ACTIVE/INK_DEV_PROGRESS.md
```

No other product file without STOP → MR.

## 7. Hard prohibitions

```text
new capability = 0
operation vocabulary change = 0
named tool change = 0
FORMAT_VERSION change = 0
History semantics change = 0
Revision semantics change = 0
Document schema/migration = 0
Renderer/Canvas/WebGL = 0
Library/Connector-005 = 0
UI redesign = 0
Windows Runtime by DEV = 0
promotion = 0
main mutation = 0
```

This product change is a bounded event-binding correctness fix, not a UI rebuild.

## 8. Required handoff

Create:

`working/INK_TECH_CLOSURE_001_RUNTIME_FIX_3_CHECKPOINT.md`

Required sections:

```text
DISPATCH_HEAD
LATEST_COMMIT
DEFECT_E_ROOT_CAUSE
DEFECT_E_FIX
DEFECT_F_ROOT_CAUSE
DEFECT_F_FIX
FILES_CHANGED
WHAT_DID_NOT_CHANGE
FOCUSED_QA
KNOWN_GAPS
NEXT
```

Final:

```text
RESULT = DEV_FIX_3_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
