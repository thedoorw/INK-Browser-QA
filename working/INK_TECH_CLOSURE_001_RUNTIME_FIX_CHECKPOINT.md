# INK-TECH-CLOSURE-001 — Runtime Fix DEV Checkpoint

STATUS: `DEV_HANDOFF / STOP`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

## DISPATCH_HEAD

`f5eaf45715859004436d15d4645209b7be29a120`

DEV observed that the branch had already advanced by documentation-only dispatch commits before implementation began.

DEV implementation start head:

`804eca24d4d0acf5eff02be262f29f8dd24cafae`

No product or QA implementation changes existed between the dispatch product baseline and that DEV start head.

## LATEST_COMMIT

Latest fix / focused-regression implementation commit before this checkpoint:

`10acb8f44139f0f4f63a82e6ca4982b144faedbc`

## DEFECT_A_ROOT_CAUSE

Observed browser failure:

`component.register.v1` did not reach `PROPOSED` at the first C2-C browser step.

Root cause was Closure browser orchestration, not Component authority or bounded-edit validation.

The C2-C browser harness wrapped each C2-C operation in a one-step:

`INK-CHAT-CREATIVE-PLAN`

and sent it through:

`use_ink(action=propose)`

The accepted Chat Creative Plan contract requires 2–32 steps. Therefore the first one-step Component registration request failed at plan normalization before the accepted single-edit bounded authority was reached.

This also explains the source/runtime split:

- focused C2-C Node contracts called `chatBoundedEditAdapter.propose / approve / execute` directly and passed;
- the browser Closure harness used the wrong public routing class for a single dynamically chained edit.

The native Component authority remains:

`document/components.js:registerComponentDefinition`

No Component product contract change was required.

## DEFECT_A_FIX

Changed only the C2-C browser proof routing.

Each of the seven single-step Component operations now uses the already published named bounded-edit flow:

`propose_ink_edit → approve_ink_edit → execute_ink_edit`

The browser proof now explicitly verifies:

- proposal reaches `PROPOSED`;
- proposal is Document / History / Revision mutation-neutral;
- execute is blocked before explicit approval;
- accepted `INK-LOCAL-APPROVAL:...` token is required;
- execution reaches the existing bounded edit authority;
- Component registration is verified from the native document Component Definition;
- every C2-C operation records exactly one native History transaction;
- all seven C2-C operations execute through the same single-edit route.

C1 / C2-A / C2-B remain on `use_ink` multi-step Plan routing.

The plan-specific Revision-capture aggregate assertion now covers only actual approved Plans. C2-C named bounded edits retain their existing capability policy:

`NO_AUTO_CAPTURE`

No Revision semantic change was made.

## DEFECT_B_ROOT_CAUSE

Prior Windows Runtime established:

- `get_grounded_creative_context`
- permission = `OBSERVE`
- Document JSON changed
- History unchanged
- Revision unchanged

The dispatched field-level diagnostic commit `f5eaf457...` was itself malformed: its `diffJson` edit inserted nearly the remainder of the Creative browser harness into an unterminated diagnostic block. As a result, the exact historical changed JSON path was not recoverable from the previous Runtime artifact.

Inspection of the grounded read path found no intentional Document writer in:

- `chat-runtime.js`
- `document-bridge.js`
- `semantic-region-grounding.js`
- `provenance-graph.js`
- `ai-core.js`
- `install-ai.js`

The read-authority defect was at the adapter isolation boundary in:

`product/source/src/ai/creative-intelligence-context.js`

All other provider inputs were cloned before grounded context construction, but the Document was passed as the live object:

`document: getDocument()`

This left the formal Document reachable through a shared-reference alias during a contractually read-only composition pass.

The defect class is therefore:

`shared-reference alias / missing read snapshot boundary`

A focused executable isolation test used the exact current adapter function with a deliberately mutating downstream builder. Before isolation such a downstream write would have reached the live object; with the fix the mutation is confined to the snapshot and the formal Document remains byte-for-byte unchanged.

## DEFECT_B_FIX

The grounded context adapter now takes a call-time JSON snapshot:

`document: clone(getDocument())`

No schema field, migration, History behavior, Revision behavior, semantic format, provenance format, Creative Memory policy, or Research policy changed.

The Creative browser harness was also repaired from the clean pre-`f5eaf457` version and now has bounded recursive diagnostics for:

- `documentDiff`
- `historyDiff`
- Revision before / after

This diagnostic remains QA-only and is ready to expose an exact path if MR Runtime finds any residual mutation.

## FILES_CHANGED

DEV implementation scope from `804eca24...`:

1. `product/source/src/ai/creative-intelligence-context.js`
   - one-line live Document → cloned snapshot boundary.

2. `qa/runtime/ink-tech-closure-001-browser-harness.html`
   - C2-C single-edit routing through existing named bounded-edit tools.
   - C2-C History assertion retained as native one-transaction-per-operation.
   - plan-only Revision aggregate no longer treats single edits as Chat Creative Plans.

3. `qa/runtime/ink-cloud-018-browser-harness.html`
   - removed malformed `f5eaf457` diagnostic insertion by restoring the clean harness body.
   - added bounded recursive field-level read-only diagnostics.

4. `qa/ink-tech-closure-001-runtime-fix.test.mjs`
   - new narrowly scoped regression coverage for Defect A and Defect B.

5. `working/INK_TECH_CLOSURE_001_RUNTIME_FIX_CHECKPOINT.md`
   - this DEV handoff checkpoint.

## WHAT_DID_NOT_CHANGE

Preserved accepted baseline:

```text
Focused Node contracts = PASS
UI Runtime = PASS
Geometry Runtime = PASS
use_ink bounded operations = 34
named tools = 21
C2-C suffix operations = 7
FORMAT_VERSION = 4
repeat.expand.v1 = CORE_ONLY_ACCEPTED / NOT_EXPOSED
```

Not changed:

- `product/source/src/document/components.js`
- Component Definition / Instance data format
- `chat-creative-plan.js` 2–32 step contract
- `chat-bounded-edit.js`
- capability registry semantics
- History semantics
- Revision semantics
- Document schema / migration
- Creative Memory write policy
- Research fetch/write policy
- Runtime runner
- Renderer / Canvas / WebGL
- service worker / cache
- UI feature scope
- product version
- main

No new capability family was added.

## FOCUSED_QA

### Preserved authoritative evidence

From Windows Runtime run `36206166651` before this fix:

```text
focused Node contracts = PASS
UI Runtime = PASS
Geometry Runtime = PASS
```

Those accepted gates were not reopened.

### DEV executable focused QA

PASS — C2-C browser helper, executed directly from current SSOT source with controlled named-tool receipts:

```text
A_C2C_SINGLE_EDIT_HELPER_EXECUTABLE_QA=PASS
```

Verified route:

```text
propose_ink_edit
execute_ink_edit (blocked before approval)
approve_ink_edit
execute_ink_edit
```

PASS — grounded adapter snapshot isolation, executed from the exact current SSOT adapter function with a deliberately mutating downstream builder:

```text
B_SNAPSHOT_ISOLATION_EXECUTABLE_QA=PASS
```

The downstream mutation changed only the cloned snapshot; the original Document JSON remained unchanged.

PASS — current browser harness inline script compilation:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html = INLINE_SCRIPT_SYNTAX_PASS
qa/runtime/ink-cloud-018-browser-harness.html = INLINE_SCRIPT_SYNTAX_PASS
```

PASS — focused source regression inspection:

```text
named tools = 21
bounded operations = 34
C2-C seven-operation suffix = stable
C2-C browser single-edit calls = 7
Creative field-level documentDiff diagnostic = present
new focused test covers get_document_summary
new focused test covers get_ink_context
new focused test covers get_ink_selection
new focused test covers get_grounded_creative_context OBSERVE
new focused test covers Semantic UNAVAILABLE as valid read-only result
```

PASS — new focused test file syntax compilation after ESM import stripping:

```text
FOCUSED_TEST_SYNTAX_PASS
```

The new repository regression file is ready for normal Node execution by MR:

`qa/ink-tech-closure-001-runtime-fix.test.mjs`

## KNOWN_GAPS

1. DEV did not run the Windows Runtime. This is prohibited by the Workpack.

2. The exact old Document field changed by run `36206166651` cannot be reconstructed from the archived artifact because that run predates field-level diff output, and the subsequent `f5eaf457` diagnostic patch malformed the Creative harness before producing a new Runtime artifact.

3. A full repository `node --test` invocation of the newly added regression file was not available in the connector-only DEV environment. DEV instead executed the exact affected SSOT adapter/helper source in focused isolation and compiled the current browser harnesses. MR should run the normal focused Node test plus the authorized Windows Runtime.

4. If MR Runtime still finds a grounded Document mutation, the repaired `documentDiff` evidence must be treated as authoritative and the task must return to the exact reported path; do not broaden the fix.

## NEXT

MR only:

1. inspect this checkpoint and diff;
2. run the focused Node regression:
   `node --test qa/ink-tech-closure-001-runtime-fix.test.mjs`;
3. run the authorized Windows Runtime / batch gate;
4. require:
   - Closure C2-C PASS;
   - Creative grounded read-only PASS;
   - preserved UI / Geometry / focused contracts remain PASS;
5. only after MR acceptance decide promotion separately.

DEV must not continue.

```text
RESULT = DEV_FIX_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
