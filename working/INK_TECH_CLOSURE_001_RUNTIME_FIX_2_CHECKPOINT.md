# INK-TECH-CLOSURE-001 — Final Runtime Fix 2 DEV Checkpoint

STATUS: `DEV_HANDOFF / STOP`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

## DISPATCH_HEAD

`399b039ffcd4677e073391418f50e77f8b0a0a63`

## LATEST_COMMIT

Latest implementation / focused-regression commit before this checkpoint:

`bd4cc696e96e5e2dd2c529bdda06a9ab6ffb5ee3`

Implementation commits:

```text
b510992138fa4d08a3b3a0248b50dd469b682f7a  qa: accept saturated native component history
8259dbc4dac93c875fa56375f2489a6db06467b2  qa: isolate grounded observe mutation window
bd4cc696e96e5e2dd2c529bdda06a9ab6ffb5ee3  test: cover saturated history and real grounded audit
```

## DEFECT_C_ROOT_CAUSE

Runtime run `36220214402` failed:

`C2C_HISTORY_RECORDED_WITH_NATIVE_COMPONENT_TRANSACTIONS`

The C2-C browser assertion required:

`afterUndoCount = beforeUndoCount + 1`

for every Component transaction.

At the accepted History capacity of 30, native `HistoryManager.commit()` appends the new entry and shifts the oldest entry. Therefore the committed transaction is real, the newest native label changes correctly, but the retained undo count remains 30.

Classification:

`QA_FALSE_NEGATIVE_AT_HISTORY_SATURATION`

No History authority defect was found.

## DEFECT_C_FIX

Changed only the C2-C browser proof.

For every one of the seven Component operations the proof now requires:

```text
expectedAfter = min(beforeUndoCount + 1, history.limit)
afterUndoCount = expectedAfter
latestLabel = exact native Component operation label
history pending = false
```

Exact native labels are checked for:

```text
Register Component
Create Instance
Override Component Opacity
Reset Component Override
Detach Component Instance
Duplicate Component Definition
Repair Component Reference
```

History limit and push/shift semantics are unchanged.

## DEFECT_D_ROOT_CAUSE

Runtime run `36220214402` established one exact residual delta during the Properties grounded read proof:

```text
permission = OBSERVE
Document changed = true
History changed = false
Revision changed = false
documentDiff = $.modifiedAt
```

DEV re-traced the required browser path:

`grounded-selection-refresh → runCapabilityAction → callGroundedTool → ToolCallRouter.route → grounded provider → audit/status/refresh`

and inspected the authorized product writers.

Findings:

1. `creative-workspace.js` contains no `markDirty()` or direct `modifiedAt` writer in the grounded read path.
2. `chat-runtime.js` routes `get_grounded_creative_context` through OBSERVE and its real `AuditBridge` writes only to `AuditLog`, not the Document.
3. `creative-intelligence-context.js` already snapshots the Document with `clone(getDocument())`.
4. `ai-core.js` directly updates `modifiedAt` only in approved execution; that path is not used by OBSERVE.
5. In the authorized Ink app source, live timestamp updates are owned by `markDirty()` or explicit save/execute paths; the grounded read path does not invoke them.
6. The existing focused Node regression previously used a stub audit bridge, so it did not prove the real AuditBridge integration path.

Therefore DEV did not find evidence supporting another product read-path mutation fix. The exact browser callsite that caused the historical Runtime timestamp change is not recoverable from run `36220214402`, because that run did not capture a writer stack.

Root-cause disposition at DEV handoff:

`BROWSER_INTEGRATION_WRITER_NOT_YET_IDENTIFIED / PRODUCT_READ_PATH_WRITER_NOT_PROVEN`

DEV does not invent or mask a product cause.

## DEFECT_D_FIX

The Creative browser proof is strengthened without weakening the read-only contract.

QA now:

1. wraps the real `app.markDirty` only for diagnostics and records:
   - timestamp before call;
   - undo count;
   - pending state;
   - call stack;
2. settles the browser boundary after prior legitimate mutation work with two animation frames plus the existing local timer window before taking the strict read-only baseline;
3. takes the full Document / History / Revision snapshot including `modifiedAt`;
4. runs the exact Properties grounded OBSERVE path;
5. requires zero `markDirty` calls during that OBSERVE window;
6. still requires byte-state equality for Document / History / Revision;
7. does not exclude, restore, normalize, or ignore `modifiedAt`.

The focused Node regression now uses the real `AuditBridge` rather than a no-op audit stub for the grounded OBSERVE proof.

If MR Windows Runtime still observes `$.modifiedAt`, the new `WORKSTATION_PROPERTIES_GROUNDED_NO_DIRTY_WRITER` evidence and captured stack are authoritative for the next exact fix. DEV did not change product mutation authority without that evidence.

## FILES_CHANGED

Authorized QA / regression files only:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
working/INK_TECH_CLOSURE_001_RUNTIME_FIX_2_CHECKPOINT.md
ACTIVE/INK_DEV_PROGRESS.md
```

No product source file was modified in Final Runtime Fix 2.

## WHAT_DID_NOT_CHANGE

Preserved accepted baseline:

```text
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
repeat.expand.v1 = CORE_ONLY_ACCEPTED / NOT_EXPOSED
UI Runtime accepted baseline = PASS
Geometry Runtime accepted baseline = PASS
focused contracts accepted baseline = 25 / 25 PASS
```

Not changed:

- History limit;
- History push/shift semantics;
- Component authority or Component data;
- Revision semantics;
- Document schema / migration;
- Creative Memory write policy;
- Research fetch/write policy;
- Runtime runner / Windows workflow;
- Renderer / Canvas / WebGL;
- UI feature scope;
- product version;
- main;
- promotion.

No new capability was added.

## FOCUSED_QA

DEV did not run Windows Runtime.

PASS — current browser harness inline script syntax:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html = INLINE_SCRIPT_SYNTAX_PASS
qa/runtime/ink-cloud-018-browser-harness.html = INLINE_SCRIPT_SYNTAX_PASS
```

PASS — focused regression source syntax after ESM import stripping / `import.meta` normalization:

```text
qa/ink-tech-closure-001-runtime-fix.test.mjs = FOCUSED_TEST_SYNTAX_PASS
```

PASS — source regression inspection:

```text
C2-C saturation formula present
C2-C exact native latestLabel proof present
C2-C pending=false proof present
Creative markDirty writer trace present
Creative OBSERVE requires groundedDirtyCalls.length === 0
Creative strict Document/History/Revision assert retained
No modifiedAt exclusion / restore workaround present
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
```

The regression suite additionally contains executable coverage for:

```text
C2-C History at saturated limit
real AuditBridge + get_grounded_creative_context OBSERVE
Document / History / Revision neutrality
browser source gates for strict modifiedAt handling
```

Normal Node execution remains for MR because the DEV connector environment does not provide a local repository checkout.

## KNOWN_GAPS

1. Windows Runtime was not run by DEV, per Workpack prohibition.
2. DEV cannot claim the new browser instrumentation has observed the historical D writer until MR runs the authorized Windows Runtime.
3. If D reproduces, the new markDirty stack must be used to identify the exact browser/integration writer before any product mutation-authority change.
4. The accepted UI / Geometry Runtime gates were not reopened.

## NEXT

MR only:

1. inspect this checkpoint and the three implementation commits;
2. run the focused Node superset including:
   `node --test qa/ink-tech-closure-001-runtime-fix.test.mjs`;
3. run the authorized Windows Runtime / batch gate;
4. require:
   - Closure C2-C History proof PASS at saturation;
   - `WORKSTATION_PROPERTIES_GROUNDED_NO_DIRTY_WRITER` PASS;
   - `WORKSTATION_PROPERTIES_GROUNDED_READ_ONLY` PASS including `modifiedAt`;
   - preserved UI / Geometry / focused contracts remain PASS;
5. if D still fails, return only the captured exact writer stack / field evidence to DEV;
6. promotion remains a separate MR decision.

```text
RESULT = DEV_FIX_2_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
