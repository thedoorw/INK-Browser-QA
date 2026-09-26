# INK-TECH-CLOSURE-001 — Final Runtime Fix 2 DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

DISPATCH_HEAD:

`399b039ffcd4677e073391418f50e77f8b0a0a63`

AUTHORITATIVE_RUNTIME:

```text
RUN = 36220214402
TESTED_SHA = 399b039ffcd4677e073391418f50e77f8b0a0a63
FOCUSED_NODE = 25 / 25 PASS
UI = PASS
GEOMETRY = PASS
CLOSURE = FAIL
CREATIVE = FAIL
ARTIFACT_ID = 10899262233
```

## 1. Mission

Fix only the two residual defects isolated by Runtime run `36220214402`.

Do not broaden Closure scope. Do not add capabilities. Do not promote. Do not run Windows Runtime from DEV.

## 2. Preserved accepted evidence

The following are accepted and must not be reopened without new direct evidence:

```text
C1 / C2-A / C2-B / C2-C focused Node contracts = PASS
runtime-fix regression = PASS
25 / 25 focused tests = PASS
UI Runtime = PASS
Geometry Runtime = PASS
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
repeat.expand.v1 = CORE_ONLY_ACCEPTED / NOT_EXPOSED
```

The earlier C2-C proposal-routing defect is resolved. Browser Runtime executed all seven C2-C named bounded edits through proposal → explicit approval → execution.

The earlier grounded shared-reference defect is partially resolved: no structural Document field, History, or Revision mutation remains. Runtime now identifies one exact residual Document change: `$.modifiedAt`.

## 3. Defect C — C2-C History saturation assertion

Runtime failure:

```text
QA = C2C_HISTORY_RECORDED_WITH_NATIVE_COMPONENT_TRANSACTIONS
stepCount = 7
```

Evidence shows native Component operations executed and returned History receipts.

At History capacity:

```text
history limit = 30
beforeUndoCount = 30
afterUndoCount = 30
latestLabel changes to the native operation label
```

Examples observed:

```text
Override Component Opacity
Reset Component Override
Duplicate Component Definition
Repair Component Reference
Detach Component Instance
```

This is consistent with the accepted bounded History behavior:

```text
push new entry
→ if undoStack.length > limit, shift oldest entry
→ count remains at limit
```

### Default classification

`QA_FALSE_NEGATIVE_AT_HISTORY_SATURATION`

### Authorized fix

Primary file:

`qa/runtime/ink-tech-closure-001-browser-harness.html`

Update the C2-C History proof so each operation proves one native committed transaction both below and at capacity. Do not require `afterUndoCount = beforeUndoCount + 1` when the stack is already saturated.

Acceptable evidence should use the execution History receipt plus newest/native label and bounded expected count:

```text
expectedAfter = min(before + 1, history.limit)
afterUndoCount = expectedAfter
native latestLabel = expected operation label
no pending transaction
```

If evidence proves History semantics themselves are wrong rather than the assertion, STOP → MR.

### Prohibited for Defect C

Do not change:

- History limit;
- History push/shift semantics;
- Component authority;
- Component data;
- Revision semantics;
- product behavior merely to satisfy QA.

## 4. Defect D — grounded OBSERVE changes only $.modifiedAt

Runtime exact evidence:

```text
QA = WORKSTATION_PROPERTIES_GROUNDED_READ_ONLY
permission = OBSERVE

changed.document = true
changed.history = false
changed.revision = false

documentDiff =
  $.modifiedAt
  before = 2026-09-26T05:19:05.209Z
  after  = 2026-09-26T05:19:11.272Z
```

The current adapter already uses:

`document: clone(getDocument())`

The focused Node regression for that snapshot boundary passes.

Therefore DEV must not repeat the prior shared-reference diagnosis. The remaining defect is a browser/integration-side writer that reaches the live Document timestamp during the grounded selection read window.

### Required investigation order

1. reproduce/trace the exact browser path:
   `grounded-selection-refresh → runCapabilityAction → callGroundedTool → ToolCallRouter.route → grounded provider → audit/status/refresh`;
2. instrument QA first to identify the exact writer/call site that changes `app.doc.modifiedAt`;
3. check all `markDirty()` / direct `modifiedAt` writes reachable during this OBSERVE path, including asynchronous callbacks;
4. prove whether the writer belongs to:
   - tool routing,
   - audit integration,
   - grounded provider integration,
   - workspace status/refresh,
   - delayed prior mutation,
   - another exact source;
5. fix the smallest true authority;
6. retain the strict contract:
   `Document / History / Revision byte-state unchanged by OBSERVE`.

### Do not mask the defect

Do not:

- exclude `modifiedAt` from the read-only comparison;
- restore the timestamp after the read as a cosmetic workaround;
- disable audit globally;
- suppress legitimate `markDirty` for real mutations;
- change autosave semantics without direct causal evidence.

### Authorized product inspection

```text
product/source/src/editor/creative-workspace.js
product/source/src/ai/chat-runtime.js
product/source/src/ai/creative-intelligence-context.js
product/source/src/ai/ai-core.js
product/source/src/ai/install-ai.js
product/source/src/ink.js
```

Modify only the smallest file(s) proven causal.

If the required fix changes Document schema/migration, History semantics, Revision semantics, mutation authority, Creative Memory write policy, Research fetch/write policy, or FORMAT_VERSION:

`STOP → MR`

## 5. Required focused QA

Defect C:

```text
all seven C2-C operations execute
native History transaction evidence valid below/saturated limit
History limit semantics unchanged
C2-C vocabulary unchanged
```

Defect D:

```text
get_grounded_creative_context OBSERVE = COMPLETED
Document before === after including modifiedAt
History before === after
Revision before === after
grounded selection result remains correct
browser integration path covered
existing runtime-fix focused Node regression remains PASS
```

Also preserve:

```text
25 focused contracts or equivalent superset = PASS
UI/Geometry source untouched unless QA-only evidence requires otherwise
34 operations
21 named tools
FORMAT_VERSION = 4
```

## 6. Allowed QA/evidence files

```text
qa/runtime/ink-tech-closure-001-browser-harness.html
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
new narrowly scoped regression test if required
working/INK_TECH_CLOSURE_001_RUNTIME_FIX_2_CHECKPOINT.md
ACTIVE/INK_DEV_PROGRESS.md
```

Do not modify the central Windows workflow/runner unless the defect is proven to be runner orchestration. If so STOP → MR.

## 7. Hard prohibitions

```text
new capability = 0
UI feature work = 0
Renderer/Canvas/WebGL work = 0
History semantics change = 0 unless STOP → MR
Revision semantics change = 0
Document schema/migration = 0
FORMAT_VERSION change = 0
Connector-005 = 0
Grid/Variants/Tokens expansion = 0
IMAGE = 0
Windows Runtime by DEV = 0
promotion = 0
main mutation = 0
```

## 8. Required handoff

Create:

`working/INK_TECH_CLOSURE_001_RUNTIME_FIX_2_CHECKPOINT.md`

Required sections:

```text
DISPATCH_HEAD
LATEST_COMMIT
DEFECT_C_ROOT_CAUSE
DEFECT_C_FIX
DEFECT_D_ROOT_CAUSE
DEFECT_D_FIX
FILES_CHANGED
WHAT_DID_NOT_CHANGE
FOCUSED_QA
KNOWN_GAPS
NEXT
```

Final state:

```text
RESULT = DEV_FIX_2_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
