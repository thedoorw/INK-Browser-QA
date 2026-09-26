# INK-TECH-CLOSURE-001 — Final Runtime Fix 3 DEV Checkpoint

STATUS: `DEV_HANDOFF / STOP`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

## DISPATCH_HEAD

`d6ce01dc47614100bedea2592e64c18f66bc28d3`

## LATEST_COMMIT

Latest implementation / focused-regression head before this checkpoint:

`198f4b3b721c32d5170af13e19ddb231531ee70a`

Final effective implementation commits:

```text
8c4460ef71e6cce9189fddd8ab5c74f7ecba797d  qa: make final Closure History retention assertion limit-aware
5858925caecb231c5bba4a426cbab943b12ce93f  test: add Runtime Fix 3 focused regressions
a489bf4fd8bf127848878ec08283d07b959525a8  product: bind workspace switching only to explicit workspace controls
198f4b3b721c32d5170af13e19ddb231531ee70a  test: align selector regression with final explicit DOM query
```

Intermediate selector-write commits were superseded before handoff. The final branch diff is authoritative.

## DEFECT_E_ROOT_CAUSE

Runtime run `36225935515` failed the final Closure assertion:

```text
CLOSURE_HISTORY_ACCUMULATED
actual applied = 30
History limit = 30
```

The final assertion still required `applied >= 35`.

The Closure sequence has strict operation-level History evidence for:

```text
Geometry = 14
C2-A = 7
C2-B = 7
C2-C = 7
expected accumulated operations = 35
```

But `get_ink_history` reports the retained timeline. Native History intentionally caps retained undo entries at `history.limit`.

Classification:

`QA_FALSE_NEGATIVE_AT_HISTORY_RETENTION_LIMIT`

No History product defect was found.

## DEFECT_E_FIX

Changed only the final Closure browser assertion.

The proof now derives:

```text
expectedAccumulatedHistory =
  geometryHistorySteps.length
  + c2aHistorySteps.length
  + c2bHistorySteps.length
  + c2cHistorySteps.length

expectedRetainedApplied =
  min(expectedAccumulatedHistory, finalHistory.limit)
```

It then requires:

```text
get_ink_history.status = COMPLETED
pending = false
reported limit = app.history.limit
applied = expectedRetainedApplied
retainedCount = entries.length
retainedCount = applied
latest retained label = Repair Component Reference
```

The existing seven C2-C per-operation checks remain strict:

```text
afterUndoCount = min(beforeUndoCount + 1, history.limit)
latestLabel = exact native operation label
pending = false
```

History limit, push/shift behavior, public History API, and History semantics were not changed.

## DEFECT_F_ROOT_CAUSE

Runtime run `36225935515` captured the exact writer stack:

```text
app.markDirty
→ InkApp.switchWorkspace
→ HTMLDivElement click listener
→ propertiesButton.click()
```

The root application node carries state:

```html
<div id="app" ... data-space="creation" ...>
```

The real workspace controls are buttons under `#workspaceSwitch`.

The old binding used the broad selector:

```js
$$('[data-space]')
```

That selector included `#app[data-space]`. Because descendant clicks bubble to the root app node, an unrelated Properties action could invoke:

```text
switchWorkspace('creation')
→ markDirty()
→ doc.modifiedAt changes
```

Classification:

`PRODUCT_EVENT_SELECTOR_COLLISION / ROOT_STATE_ATTRIBUTE_MISTAKEN_FOR_CONTROL`

## DEFECT_F_FIX

Changed one product binding in:

`product/source/src/ink.js`

Final binding:

```js
document.querySelectorAll('#workspaceSwitch button[data-space]')
```

Only actual workspace-control buttons receive the existing click handler.

Preserved:

- `#app[data-space]` remains the workspace state/CSS authority;
- creation/layout buttons remain present;
- `switchWorkspace()` remains the workspace transition authority;
- `markDirty()` remains unchanged;
- no grounded CHAT special case;
- no event-propagation workaround.

The existing Creative browser proof remains strict:

```text
grounded-selection-refresh click
→ groundedDirtyCalls.length === 0
→ Document / History / Revision exact equality
→ modifiedAt remains included
```

## FILES_CHANGED

Final Runtime Fix 3 implementation / focused QA:

```text
product/source/src/ink.js
qa/runtime/ink-tech-closure-001-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
working/INK_TECH_CLOSURE_001_RUNTIME_FIX_3_CHECKPOINT.md
ACTIVE/INK_DEV_PROGRESS.md
```

The Workpack and initial Fix 3 progress activation were already placed on the branch by MR.

## WHAT_DID_NOT_CHANGE

Preserved accepted baseline:

```text
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
repeat.expand.v1 = CORE_ONLY_ACCEPTED / NOT_EXPOSED
UI Runtime accepted baseline = PASS
Geometry Runtime accepted baseline = PASS
focused Node accepted baseline = 26 / 26 PASS
```

Not changed:

- capability registry;
- bounded-edit operation vocabulary;
- Component native authorities or data format;
- History limit / transaction semantics;
- Revision semantics;
- Document schema / migration;
- Renderer / Canvas / WebGL;
- Creative Memory policy;
- Research fetch/write policy;
- Runtime runner;
- service worker/cache;
- UI layout/rebuild;
- Connector-005;
- product version;
- FORMAT_VERSION;
- main;
- promotion.

No new capability was added.

## FOCUSED_QA

Windows Runtime was not run by DEV.

PASS — source/static focused gate:

```text
Defect F:
  precise workspace selector present
  broad [data-space] workspace binding absent
  #app[data-space] state authority preserved
  creation/layout controls preserved
  grounded no-dirty browser assertion preserved
  strict modifiedAt equality preserved

Defect E:
  old impossible >=35 final assertion absent
  accumulated expected count derived from strict history step sets
  retention uses min(expected, limit)
  reported limit must equal native app.history.limit
  pending=false required
  retainedCount / entries / applied internally consistent
  latest native Component History label required
  strict C2-C per-operation saturation proof preserved
```

PASS — syntax/source checks in connector environment:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html
  inline browser script compile = PASS

qa/ink-tech-closure-001-runtime-fix.test.mjs
  syntax compile after ESM import stripping / import.meta normalization = PASS
```

PASS — focused regression source now includes executable checks for:

```text
History inspection at saturated limit
retainedCount = limit
latest retained native label
explicit workspace-control selector
root data-space state preserved
creation/layout controls preserved
broad selector rejected
```

PASS — branch delta review from dispatch head:

```text
authorized implementation files only:
  product/source/src/ink.js
  qa/runtime/ink-tech-closure-001-browser-harness.html
  qa/ink-tech-closure-001-runtime-fix.test.mjs

plus MR-authored:
  ACTIVE/INK_DEV_PROGRESS.md
  working/INK_TECH_CLOSURE_001_RUNTIME_FIX_3_DEV_WORKPACK.md
```

Normal Node execution is deferred to MR because the DEV connector environment does not provide a local repository checkout. Windows Runtime remains explicitly prohibited for DEV.

## KNOWN_GAPS

1. Windows Runtime was not run by DEV, per Workpack prohibition.
2. The existing executable focused Node test was updated but not executed locally because the connector environment has no repository checkout.
3. MR must verify the real browser event path on the exact handoff HEAD.
4. No claim is made about promotion or C3 baseline freeze.

## NEXT

MR only:

1. pin the exact DEV handoff HEAD;
2. inspect this checkpoint and final three-file implementation delta;
3. run the focused Node superset including:
   `node --test qa/ink-tech-closure-001-runtime-fix.test.mjs`;
4. run the authorized exact-SHA Windows Runtime;
5. require:
   - UI PASS;
   - Geometry PASS;
   - Closure `CLOSURE_HISTORY_ACCUMULATED` PASS at History limit;
   - Creative `WORKSTATION_PROPERTIES_GROUNDED_NO_DIRTY_WRITER` PASS;
   - Creative `WORKSTATION_PROPERTIES_GROUNDED_READ_ONLY` PASS including `modifiedAt`;
   - bounded operations remain 34;
   - named tools remain 21;
   - FORMAT_VERSION remains 4;
6. promotion remains a separate MR decision.

```text
RESULT = DEV_FIX_3_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
