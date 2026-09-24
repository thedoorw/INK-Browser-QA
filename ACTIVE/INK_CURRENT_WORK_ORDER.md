## MR_REVISE — smart preview diagnostic only — 2026-09-24

```text
TASK = INK-CHAT-CLOSED-LOOP-001
RUNTIME_RUN = 36006888089
TESTED_SHA = 74c02f41dd9bde3262a6e7ee507126b74c2e18c9
RUNNER = DESKTOP-NSOQH69

UI = PASS / 106 of 106
CREATIVE = FAIL
GEOMETRY = NOT_REACHED

PASS_BEFORE_FAILURE =
  SMART_LOOP_CAPABILITIES_DISCOVERED
  SMART_LOOP_REFERENCE_IMPORTED
  SMART_LOOP_IMPORT_HISTORY_PROVENANCE_RECORDED
  SMART_LOOP_COLOR_LINE_DECOMPOSED
  SMART_LOOP_STABLE_REFS_RETURNED

DECOMPOSITION =
  Color Paths = 1471
  Line Paths = 1471

FAIL_AT =
  SMART_LOOP_PREVIEW_BEFORE_CAPTURED

PRODUCT_PREVIEW_FAIL = NOT YET ESTABLISHED
QA_BRIDGE_FAIL = NOT YET ESTABLISHED
CURRENT_MISSING_EVIDENCE =
  smartBefore.status / diagnostics / result were not attached to the failed assertion

MR = REVISE / DIAGNOSTIC_ONLY
PRODUCT_SOURCE = FROZEN
QA_RESOLVER_ROUTE = FROZEN
NEW_OPERATION_FAMILIES = 0
EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4
```

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

Required change:

At the `SMART_LOOP_PREVIEW_BEFORE_CAPTURED` assertion, attach a JSON-safe diagnostic payload containing at minimum:

```text
smartBefore.status
smartBefore.diagnostics
smartBefore.result
smartBefore.outputHandles
preview options
```

Do not alter the preview request, renderer, product API, output registry, resolver route, fixture, decomposition, or acceptance condition in this revision.

Goal: one exact-SHA Runtime rerun that identifies the real `INK_PREVIEW_*` failure code without changing behavior.

`DEV_HANDOFF → STOP → MR REVIEW`

---

## INK-CHAT-CLOSED-LOOP-001 MR bounded revision — 2026-09-24

```text
REVIEWED_HEAD = 2b3c2f79147b6122f5ac78ed47d19c9878522386
RUNTIME_RUN = 36003623197
RUNTIME_TESTED_SHA = 2b3c2f79147b6122f5ac78ed47d19c9878522386
RUNNER = DESKTOP-NSOQH69

UI = PASS
CREATIVE = FAIL / QA artifact resolver injection timeout
GEOMETRY = NOT_REACHED

SMART_CHAIN_REACHED =
  capability discovery
  → reference import
  → import History/provenance
  → Color + Line decomposition
  → 1471 Color refs + 1471 Line refs

FAIL_LOCATION =
  before first get_ink_preview
  dynamic inline module did not install __INK_SMART_LOOP_QA_RESOLVE

PRODUCT_DEFECT = NOT_ESTABLISHED
PRODUCT_SOURCE = FROZEN
MR = REVISE / QA_BRIDGE_ONLY
PROMOTION = BLOCKED
```

Authorized revision only:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
qa/ink-chat-closed-loop-001-smart-proof.test.mjs   // only if needed for QA coverage
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
```

Required correction:

- replace the failing dynamically injected inline module with a deterministic same-origin external QA module/route or equivalent static QA-only loading path;
- the resolver must execute in the INK app iframe realm so it reaches that realm's existing output registry;
- keep the resolver fixed-purpose: `resolveInkOutputPayload(window.INK_APP, handleId)` only;
- remove the temporary QA global after smart-loop materialization;
- no product hook, public payload API, external transport, eval, Function, arbitrary module execution or alternate renderer;
- preserve all 17 SMART_LOOP markers and the same before/after artifact contract.

Then:

`DEV_HANDOFF → STOP → MR source re-check → new exact-SHA Runtime`

---

# INK CURRENT WORK ORDER — SMART CLOSED LOOP PROOF

STATUS: `INK-CHAT-CLOSED-LOOP-001 / MR_REVISE / QA_BRIDGE_ONLY`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CLOSED-LOOP-001` |
| TITLE | `Reference → Color + Line → CHAT Smart Closed Loop Proof v0.1` |
| DEV_BRANCH | `work/ink-chat-closed-loop-001` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-004 / CLOSED / MR_PASS / PROMOTED` |
| TARGET_GATE | `SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| UI_CHANGE | `0` |
| IMAGE_MODEL | `0` |
| EXTERNAL_TRANSPORT | `0` |
| NEW_NATIVE_OPERATION_FAMILIES | `0` |

## Purpose

Prove the original first creative lesson as one coherent mature-connector workflow instead of another isolated feature test.

```text
CHAT-style capability discovery
→ import_ink_reference
→ decompose_ink_reference
→ get_ink_preview
→ inspect stable Color / Line refs
→ use_ink
→ explicit approval
→ existing path.repaint.v1 operations
→ History
→ Revision
→ get_ink_preview
→ before/after PNG evidence materialized
→ MR returns those Runtime artifacts to CHAT
```

This Work Order proves that the Figma / Penpot / Adobe-inspired connector grammar already installed in INK can operate as one workflow.

It does not attempt to expand the general native-operation vocabulary.

## A — Existing authorities are mandatory

Reuse exactly:

```text
app.chatReferenceHandoff.importReference
app.chatReferenceHandoff.decomposeReference
app.inkPublicApi capability discovery
app.inkPublicApi get_ink_preview / output handles
app.inkPublicApi use_ink
app.chatCreativePlan
app.chatBoundedEditAdapter
path.repaint.v1
History
Revision
Renderer
```

Do not create a second Reference importer, decomposition engine, plan executor, History, Revision, Renderer, or Document mutation route.

## B — Only product connector gap to close

Expose the already-implemented Reference import authority through the existing Public Creative API and Named Tool facade.

Required Public API:

```text
reference.import(input, options?)
→ app.chatReferenceHandoff.importReference(input, options)
```

Required Named Tool:

```text
20. import_ink_reference
```

The accepted Connector-004 19-tool registry must remain the exact ordered prefix.

Required capability descriptor:

```text
reference.import
availability = true
namedTool = import_ink_reference
publicMethod = reference.import
routingClass = NAMED_TOOL
```

The input may be a browser-local File/Blob handoff as already accepted by `normalizeChatAttachment`.

The returned public result must remain JSON-safe `INK_AGENT_RESULT / 1`; raw File/Blob bytes must not escape through the result envelope.

## C — Smart routing proof

The browser proof must not jump directly to implementation methods.

It must begin through the accepted connector surface:

```text
get_ink_capabilities
→ describe_ink_capability where needed
→ choose narrow named tool first
→ use_ink only for the coherent multi-step correction
```

This is the intended combined mature pattern:

```text
Adobe:
named capability routing + result handle + preview verification

Figma / Penpot:
stable native object refs + programmable multi-step native edit

INK:
same grammar over existing INK authorities
```

## D — One sequential browser proof

Use the already-versioned Runtime fixture:

`qa/fixtures/rose-window/rose-window-primary.png`

The exact browser sequence must be one traceable chain:

1. discover the required capabilities;
2. create a browser File/Blob from the Runtime fixture;
3. call `import_ink_reference`;
4. verify Reference stable ID + History/provenance receipt;
5. call `decompose_ink_reference`;
6. verify separate Color / Line layers and stable Path IDs;
7. call `get_ink_preview` and retain the output handle;
8. materialize the internal preview payload in the **QA harness only** as `smart-loop-before.png`;
9. choose at least one returned Color Path and one returned Line Path by their real stable refs;
10. call `use_ink` with a two-step plan using only existing `path.repaint.v1`:
    - visibly change one Color Path fill;
    - visibly change one Line Path stroke;
11. prove propose is mutation-neutral;
12. prove execute-before-approval is blocked;
13. approve and execute;
14. verify ordered execution + History receipts + final Revision;
15. call `get_ink_preview` again;
16. materialize `smart-loop-after.png` in the QA harness only;
17. prove before/after render fingerprints differ;
18. emit one JSON evidence record binding input source, stable refs, plan ID, History, Revision, preview handles and materialized image names.

Do not use IMAGE generation, Python image modification, direct Document JSON mutation, DOM screenshotting, or an alternate renderer.

## E — Runtime artifact bridge is proof transport, not product transport

For this proof only:

```text
INK_OUTPUT_HANDLE
→ internal payload resolver
→ QA-only Runtime materialization
→ evidence/*.png
→ GitHub Runtime artifact
→ MR retrieves artifact into CHAT
```

This is allowed as the existing Visual / Asset Interchange Standard Runtime fallback.

It must not change:

```text
external.transport = unavailable
```

No MCP, WebSocket, postMessage, arbitrary upload/download API, persistence service, or live ChatGPT connector transport is authorized here.

The proof must label the return path truthfully:

`RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT`

## F — Required browser markers

At minimum:

```text
SMART_LOOP_CAPABILITIES_DISCOVERED
SMART_LOOP_REFERENCE_IMPORTED
SMART_LOOP_IMPORT_HISTORY_PROVENANCE_RECORDED
SMART_LOOP_COLOR_LINE_DECOMPOSED
SMART_LOOP_STABLE_REFS_RETURNED
SMART_LOOP_PREVIEW_BEFORE_CAPTURED
SMART_LOOP_PREVIEW_BEFORE_MATERIALIZED
SMART_LOOP_USE_INK_PROPOSE_MUTATION_NEUTRAL
SMART_LOOP_USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
SMART_LOOP_USE_INK_APPROVED
SMART_LOOP_TWO_STEP_REPAINT_EXECUTED
SMART_LOOP_HISTORY_RECORDED
SMART_LOOP_FINAL_REVISION_CAPTURED
SMART_LOOP_PREVIEW_AFTER_CAPTURED
SMART_LOOP_PREVIEW_AFTER_MATERIALIZED
SMART_LOOP_RENDER_FINGERPRINT_CHANGED
SMART_LOOP_ARTIFACT_EVIDENCE_READY
```

## G — Allowed files

Product:

```text
product/source/src/agent/public-creative-api.js
product/source/src/agent/capability-registry.js
```

QA / Runtime, as necessary:

```text
qa/ink-chat-closed-loop-001-smart-proof.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
```

Evidence / handoff:

```text
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
ACTIVE/INK_DEV_PROGRESS.md
```

If another product source file appears necessary, STOP and return to MR before modifying it.

## H — Hard non-goals

```text
Boolean / Repeat / Group / Frame / Component / Layout exposure
raw Path creation
Path geometry editing
new transform operations
new drawing or trace engine
Creative Library Search
UI changes
external transport
arbitrary JS / eval / Function
arbitrary app method dispatch
direct Document JSON writes
automatic approval
automatic retry
FORMAT_VERSION change
package/ink-current mutation
```

## I — Completion gate

DEV handoff is allowed only when source/focused QA evidence supports the exact chain.

MR acceptance requires:

```text
exact-HEAD source review
→ Windows self-hosted browser Runtime
→ all existing UI / Creative / Geometry regression PASS
→ all SMART_LOOP_* markers PASS
→ smart-loop-before.png present
→ smart-loop-after.png present
→ evidence JSON present
→ tested exact SHA pinned
→ MR retrieves both PNGs into this CHAT
```

Only after the images are actually retrieved and inspectable here may MR declare:

`SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP = PASS`

Then:

`DEV_HANDOFF → STOP → MR REVIEW`

---

## INK-CHAT-CONNECTOR-004 final closure — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-004
MR = PASS
TESTED_SHA = bae2353fdd057f5334a219bcdfcda67cc9090c46
RUNTIME_RUN = 35990559349
RUNNER = DESKTOP-NSOQH69
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
USE_INK_BROWSER_MARKERS = 10 / 10 PASS
ARTIFACT_ID = 10804102899
ARTIFACT_DIGEST = sha256:d7abcfa4c2f30b908103fc09fa3feb3ecce58801d90881b59479715dd9693339
PROMOTION_PR = #51 / MERGED
PROMOTED_MAIN = 9af585df4667e37b9676cd73b9fd0b1db9a52530
PROMOTION_EQUIVALENCE = 10 / 10 Connector-004 product/QA/evidence blobs exact
NAMED_TOOL_TOTAL = 19
USE_INK = AVAILABLE
FORMAT_VERSION = 4 / PRESERVED
CONNECTOR_004 = CLOSED
NEXT_CONNECTOR_WORK_ORDER = NOT_AUTHORIZED
```

## UI-006 main integration visual gate — 2026-09-24

```text
UI_INTEGRATION_PR = #49 / MERGED
UI_INTEGRATION_MAIN = 9852f7ef67fd530c683cf1257406494e31c3b51d
UI_PAYLOAD = UI-006 accepted shell/template/styles/web-shell + authoritative UI harness
CONNECTOR_CORE_SOURCE_MUTATION = 0
FAVICON = assets/favicon.svg / restored from accepted UI-MAINT-002 authority
VISIBLE_INK_MARK = existing INK mark / preserved

PAGES_DEPLOY_RUN = 35979527212
PAGES_DEPLOY_HEAD = 9852f7ef67fd530c683cf1257406494e31c3b51d
PAGES_BUILD = PASS
PAGES_DEPLOY = PASS

VISUAL_GATE = REQUIRED
DEPLOYED_SCREENSHOT = NOT_YET_CAPTURED
CAPTURE_BLOCKER = external live-page capture requires Playwright MCP; unavailable in current MR tool surface
RUNTIME = HOLD
CONNECTOR_004_PROMOTION = BLOCKED / unchanged
```

## MR Runtime timeout classification / rerun queued

```text
PRIOR_RUNTIME_RUN = 35970456976
PRIOR_TESTED_SHA = a050e0d87d9b53b2d0ad5c34baffb4a88a070fdc
RUNNER = DESKTOP-NSOQH69 / ACCEPTED JOB
UI = PASS
CREATIVE = HARNESS_TIMEOUT / 240 seconds
GEOMETRY = NOT_REACHED

PRODUCT_RUNTIME_FAIL = NOT_ESTABLISHED
CLASSIFICATION = QA_HARNESS_TIME_BUDGET_INSUFFICIENT
PRODUCT_SOURCE_CHANGE = 0

QA_REVISION =
  run-ink-runtime-batch.mjs
  per-suite timeout 240s → 360s

RERUN_TARGET_SHA = 448eef0fd15a9543464bfd6830a5840f81d196f0
FINAL_RUNTIME_GATE = RERUN_REQUIRED
PROMOTION = BLOCKED_UNTIL_REAL_RUNTIME_RESULT
```

# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-004 / CLOSED / MR_PASS / PROMOTED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-004` |
| PHASE | `USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION` |
| TITLE | `use_ink — CHAT-native programmable composition bridge v0.1` |
| DEV_BRANCH | `work/ink-chat-connector-004` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-003 / CLOSED / MR_PASS / PROMOTED` |
| CONNECTOR_003_PROMOTION | `96f8c553e87fd53b5ca0d2b01cc2972902f2fd69` |
| CONNECTOR_003_RUNTIME | `35961649436 / PASS` |
| TARGET_GATE | `INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |

## Purpose

Connector-004 establishes the general CHAT-native programmable entry:

```text
CHAT
→ Capability Discovery
→ use_ink
→ existing Chat Creative Plan authority
→ existing bounded edit authority
→ existing History
→ existing Revision
→ explicit get_ink_preview when visual verification is needed
```

`use_ink` is declarative plan execution, not arbitrary code execution.

## A — Authoritative route

Required route:

```text
use_ink
→ app.inkPublicApi.composition.*
→ app.chatCreativePlan
→ app.chatBoundedEditAdapter
→ accepted operation authorities
→ History
→ Revision
```

Reuse `product/source/src/editor/chat-creative-plan.js` and its existing proposal / approval / execution / partial-stop / Revision behavior.

Do not create a second plan store, approval-token format, execution loop, History system, Revision system, or Document authority.

## B — Public Creative API

Extend the existing single `app.inkPublicApi` with:

```text
composition.inspect(input?)
composition.propose({ plan })
composition.approve({ planId })
composition.execute({ planId, approvalToken })
composition.cancel({ planId })
```

Canonical object input is authoritative. Backward-compatible positional forms may remain, but Descriptor v1 must describe the canonical object form.

No `composition.*` method may directly mutate `app.doc`.

## C — Named Tool

Append exactly:

```text
19. use_ink
```

Existing 18 Named Tools remain the exact ordered prefix.

Canonical `use_ink` input:

```text
{
  action: "inspect" | "propose" | "approve" | "execute" | "cancel",
  plan?: INK-CHAT-CREATIVE-PLAN / 1,
  planId?: string,
  approvalToken?: string
}
```

Routing:

```text
inspect  → composition.inspect
propose  → composition.propose
approve  → composition.approve
execute  → composition.execute
cancel   → composition.cancel
```

Unknown action returns deterministic FAILED with:

`INK_USE_INK_ACTION_UNSUPPORTED`

The tool is facade/router only. No Document mutation logic belongs in `use_ink`.

## D — Capability Discovery

Change the existing `composition.programmable` descriptor from unavailable to available:

```text
availability = true
namedTool = use_ink
publicMethod = composition.propose
routingClass = PROPOSAL_REQUIRED
```

Descriptor must state:

- no arbitrary JS;
- proposal is mutation-neutral;
- execute requires explicit plan approval token;
- every step still passes bounded-edit validation;
- History and Revision behavior remains the existing Chat Creative Plan behavior;
- Preview remains a separate `get_ink_preview` action.

`external.transport` remains unavailable.

## E — v0.1 operation scope

Connector-004 validates the programmable bridge before expanding operation vocabulary.

Allowed plan step operations remain exactly:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Do not add Boolean / Repeat / Group / Frame / Component / Layout / raw Path creation or arbitrary property-write operations in this Work Order.

These existing INK capabilities are reserved for a later bounded native-operation exposure stage behind the accepted `use_ink` architecture.

## F — Existing plan semantics must remain authoritative

Preserve:

- 2–32 steps;
- deterministic plan ID and stable step IDs;
- dependency graph validation;
- exact source Document / Revision / fingerprint checks;
- History idle requirement;
- explicit top-level approval;
- execute-before-approval rejection;
- ordered execution;
- stop remaining steps after failure;
- partial execution receipt;
- existing partial/final Revision capture;
- stale Revision rejection;
- no autonomous retry loop.

The existing Chat Creative Plan controller may continue its accepted per-step bounded-edit technical approval only after the explicit top-level plan approval gate is passed.

## G — Result envelope

All `composition.*` methods and `use_ink` return existing `INK_AGENT_RESULT / 1`.

Map real plan receipts into existing fields where available:

```text
status
targetRefs[]
createdRefs[]
changedRefs[]
historyReceipt
revisionReceipt
diagnostics[]
result
```

Do not fabricate refs/status. Keep the raw JSON-safe plan receipt under `result` when useful.

## H — Inspection

`composition.inspect()` must return bounded JSON-safe data from the existing Chat Creative Plan authority only. No live controller record/reference may escape.

At minimum expose plan ID, status, approval state, intent summary, step count/progress, and source Document/Revision identity when the existing authority provides them.

## I — Preview relationship

Expected closed loop:

```text
use_ink(propose)
→ explicit approval
→ use_ink(execute)
→ INK_AGENT_RESULT
→ get_ink_preview
→ visual inspection
→ next bounded plan if needed
```

No automatic Preview generation in Connector-004.

## J — Security boundary

Strictly prohibited:

```text
eval
Function constructor
dynamic import from user input
arbitrary app[method] dispatch
arbitrary property-path writes
raw Document JSON replacement
user-supplied callback/function
unregistered operation execution
unrestricted window/global bridge
MCP transport
postMessage transport
WebSocket transport
```

Every executable step remains inside the accepted bounded-edit allowlist.

## K — Canonical metadata authority

Connector-003 `capability-registry.js` remains the single metadata authority.

Expected:

```text
Named Tools = 19
composition.programmable = available
external.transport = unavailable
```

Do not maintain a second independent `use_ink` metadata table.

## L — Required QA

Focused QA must cover:

1. existing 18 tools remain exact prefix; total = 19;
2. `use_ink` appended exactly once;
3. `composition.programmable` available and mapped to `use_ink`;
4. `external.transport` still unavailable;
5. no eval / Function / arbitrary dispatch / direct Document write;
6. inspect/propose are mutation-neutral;
7. proposal identity/state matches direct Chat Creative Plan;
8. execute-before-approval rejected;
9. approve uses existing plan approval-token contract;
10. execute delegates to existing Chat Creative Plan;
11. unsupported step operation still rejected by bounded edit;
12. deterministic two-step execution order;
13. History behavior matches direct Chat Creative Plan;
14. Revision behavior matches direct Chat Creative Plan;
15. stale Revision blocks before mutation;
16. mid-plan failure stops remaining steps;
17. partial-success Revision behavior preserved;
18. cancel preserves existing semantics;
19. unknown action returns `INK_USE_INK_ACTION_UNSUPPORTED`;
20. canonical object input works through Named Tool and Public API;
21. result JSON-safe; no live refs/functions/binary;
22. no automatic Preview;
23. Connector-001/002/003 QA remain PASS;
24. Chat Creative Plan unit/source QA remain PASS;
25. bounded edit / History / Revision regressions remain PASS;
26. `FORMAT_VERSION = 4`;
27. Web / Portable share implementation.

## M — Runtime coordination

UI/main work remains a separate lane. Connector DEV must not rewrite UI or central Runtime queue.

```text
DEV = source + focused QA
DEV_HANDOFF → STOP
browser Runtime = MR exact-HEAD stage
```

## Explicit non-goals

- new geometry algorithm;
- new Boolean/Repeat engine;
- new Group/Frame/Component/Layout command exposure;
- arbitrary native-object mutation;
- external connector transport;
- Creative Library / Recipe / Workflow / Creative Session / Design Critic;
- automatic approval;
- autonomous agent loop;
- automatic Preview;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema / FORMAT_VERSION change.

## Planned next — not authorized by Connector-004

```text
Native operation exposure
= Boolean / Repeat / Group / Frame / Component / Layout
  added behind accepted use_ink

Connector-005
= INK Skill / Capability Router

Connector-006
= Creative Library + Recipe

Connector-007
= Creative Session + reusable Workflow

Connector-008
= Design Critic / Fix

Final
= full creative closed loop
```

## MR bounded revision — browser feature coverage

```text
REVIEW_HEAD = adb994650c62ea7e917cb15af574545ab0d72d9a
SOURCE_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS / REGRESSION ONLY
RUNTIME_RUN = 35968312192
RUNTIME_TESTED_SHA = adb994650c62ea7e917cb15af574545ab0d72d9a

BLOCKER =
  browser Runtime does not exercise use_ink / composition.*
  therefore target gate is not yet proven

MR = REVISE
PROMOTION = BLOCKED
```

### Revision scope

Stay on:

`work/ink-chat-connector-004`

Product source is frozen unless browser QA exposes a real defect.

Authorized:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs   (only if needed)
research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/WORKING_STATUS.md
working/INK_CHAT_CONNECTOR_004_DEV_HANDOFF.md
```

Required new browser checks:

```text
USE_INK_TOOL_AVAILABLE
USE_INK_PROPOSE_MUTATION_NEUTRAL
USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
USE_INK_APPROVAL_TOKEN_ISSUED
USE_INK_TWO_STEP_EXECUTION_ORDERED
USE_INK_HISTORY_RECORDED
USE_INK_FINAL_REVISION_CAPTURED
USE_INK_UNSUPPORTED_ACTION_REJECTED
USE_INK_NO_AUTO_PREVIEW
```

Equivalent marker names are acceptable, but `run-ink-runtime-batch.mjs` must require them.

No new native operation families, external transport, UI changes, eval/arbitrary execution, or FORMAT_VERSION change.

Return:

`DEV_HANDOFF → STOP`.


## Gate

```text
DEV_AUTHORIZED
→ implement use_ink facade over existing Chat Creative Plan
→ focused QA + regressions
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ MR exact-SHA Runtime
→ MR_PASS / MR_REVISE
```

Acceptance:

`INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS`
