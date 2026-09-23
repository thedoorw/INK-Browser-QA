# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-005 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-005` |
| TITLE | `Creative Intelligence Memory + Research Integration v0.1` |
| ROLE_OWNER | `MR / CORE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-005` |
| DEV_MODE | `BOUNDED_INTEGRATION` |
| PRODUCT_UI_MUTATION | `PROHIBITED` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_AUTHORITY_CHANGE | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| CREATIVE_MEMORY_AUTO_WRITE | `PROHIBITED` |
| RESEARCH_REMOTE_FETCH | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `CENTRAL_QUEUE_AFTER_MR_PASS_AND_PROMOTION` |

## Accepted upstream

```text
INK-CORE-INTEGRATION-001 = grounded creative context / LIVE
INK-CORE-INTEGRATION-002 = grounded read-only tool surface / LIVE
INK-CORE-INTEGRATION-003 = bounded grounded reasoning continuation / LIVE
INK-CORE-INTEGRATION-004 = grounded decision → existing editable plan / LIVE
CORE-MOD-006 = Creative Memory / MODULE_READY
CORE-MOD-007 = Research → Creation / MODULE_READY
```

## Objective

Integrate Creative Memory and Research → Creation advisory intelligence into the existing grounded CHAT reasoning path without creating a second execution authority.

Target path:

```text
INK document + grounded context
+ selected Creative Memory
+ selected Research → Creation advisory context
→ bounded grounded CHAT reasoning
→ grounded creative decision
→ existing creative plan proposal
→ existing user approval
→ existing execution / Revision
```

The new intelligence is advisory. It may influence reasoning, but cannot mutate the document, approve plans, execute edits, or silently persist memory.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/memory/creative-memory.js`
7. `product/source/src/research/research-creation-bridge.js`
8. `product/source/src/ai/creative-intelligence-context.js`
9. `product/source/src/ai/chat-runtime.js`
10. `product/source/src/ai/grounded-creative-decision.js`
11. Integration-001/002/003/004 QA and reports as needed

## Phase A — advisory provider integration

Add bounded provider/adapter support so the existing grounded creative context can optionally include:

- Creative Memory advisory context;
- Research → Creation advisory context.

Requirements:

- providers may be absent without breaking existing behavior;
- outputs must retain their own fingerprints and authority metadata;
- context inclusion must be deterministic;
- selection/filtering must be bounded;
- no implicit persistence or mutation;
- no remote fetch requirement.

Gate: `CREATIVE_INTELLIGENCE_ADVISORY_PROVIDERS_INTEGRATED`

## Phase B — grounded context extension

Extend the existing grounded creative context with explicit optional sections for:

```text
creativeMemory
researchCreation
```

Requirements:

- preserve prior context schema behavior for callers without these providers;
- expose fingerprints, selected records/principles/constraints and unresolved evidence;
- preserve exact upstream evidence references;
- bound output size;
- deterministic context fingerprint must include these sections when present;
- authority must remain read-only/advisory.

Do not create a new parallel context root if the existing grounded context can be extended safely.

Gate: `GROUNDED_CONTEXT_HIGH_LEVEL_INTELLIGENCE_READY`

## Phase C — read-only CHAT tool surface

Expose bounded read-only tool access through the existing CHAT tool contract where appropriate.

Target tools may include:

- `get_creative_memory_context`
- `get_research_creation_context`

or equivalent names consistent with existing tool naming.

Rules:

- read-only only;
- no add/replace/write Creative Memory tool;
- no research fetch/scrape tool;
- no execution command;
- no approval token;
- no document mutation;
- existing ToolCallRouter / permission model remains authoritative.

Gate: `HIGH_LEVEL_INTELLIGENCE_TOOL_SURFACE_READY`

## Phase D — bounded reasoning interoperability

The existing one-round grounded continuation must be able to consume the new advisory tool/context results.

Verify:

```text
grounded tool call
→ local advisory result
→ one bounded continuation
→ grounded decision
→ optional existing creative-plan proposal
```

Rules:

- continuation max remains 1;
- no autonomous recursion;
- no automatic memory write from model output;
- no research-source fetch from model output;
- no automatic approval/execution;
- if research/memory evidence is missing or unresolved, it remains explicit in the final evidence chain.

Gate: `HIGH_LEVEL_INTELLIGENCE_REASONING_LOOP_WORKS`

## Phase E — plan-boundary preservation

If high-level advisory intelligence contributes to a `PLAN_PROPOSAL`:

- existing grounded decision contract remains authoritative;
- existing creative-plan validation remains authoritative;
- advisory evidence should be traceable in decision metadata/evidence where structurally supported;
- no plan target may bypass grounding;
- no additional execution authority is created.

Gate: `HIGH_LEVEL_INTELLIGENCE_PLAN_BOUNDARY_PRESERVED`

## Phase F — deterministic/source QA

At minimum verify:

- existing grounded context works without new providers;
- Creative Memory-only context;
- Research-only context;
- both contexts together;
- deterministic fingerprints for equivalent advisory inputs;
- bounded output and truncation;
- read-only tool routing;
- unsupported write/fetch intents are not auto-routed;
- one-round continuation still enforced;
- discussion-only response creates no plan;
- valid advisory-assisted decision may create existing PROPOSED plan only;
- no memory auto-write;
- no research fetch/scrape;
- no approval token during reasoning/proposal creation;
- no Document / History / Revision / Geometry / Renderer mutation before approval;
- Integration-001 regression PASS;
- Integration-002 regression PASS;
- Integration-003 regression PASS;
- Integration-004 regression PASS;
- CORE-MOD-006 QA PASS;
- CORE-MOD-007 QA PASS;
- `FORMAT_VERSION = 4`.

Gate: `INK_CORE_INTEGRATION_005_SOURCE_READY`

## Runtime disposition

After MR source PASS + clean promotion:

- add `INK-CORE-INTEGRATION-005` to the central Runtime Queue;
- preserve existing pending `INK-CORE-INTEGRATION-004`;
- MR may set the queue to READY because two compatible pending tasks satisfy the allowed batch minimum of 2.

Runtime acceptance should cover:

- current UI shell still loads;
- Creative and Geometry suites remain PASS;
- grounded CHAT can read high-level advisory context;
- no mutation before approval;
- existing proposal/approval/execution path remains intact;
- exact tested SHA evidence.

## Hard boundaries

Do not:

- redesign UI;
- add a second CHAT runtime;
- change continuation max above 1;
- add autonomous agent recursion;
- add Creative Memory write tools;
- auto-learn from user actions;
- fetch/scrape research sources;
- add backend/vector DB/embeddings requirements;
- change Document / History / Revision / Geometry / Renderer authority;
- auto-approve or auto-execute;
- infer user personality/psychology;
- change FORMAT_VERSION;
- mutate package/ink-current.

## Required report

`research/INK_CORE_INTEGRATION_005_CREATIVE_INTELLIGENCE_MEMORY_RESEARCH_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-005
BRANCH = work/ink-core-integration-005
GATE = INK_CORE_INTEGRATION_005_SOURCE_READY
CREATIVE_MEMORY_AUTO_WRITE = 0
RESEARCH_REMOTE_FETCH = 0
AUTO_APPROVAL = 0
AUTO_EXECUTION = 0
AUTONOMOUS_RECURSION = 0
CONTINUATION_MAX = 1
UI_MUTATION = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_AUTHORITY_CHANGE = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_CENTRAL_RUNTIME_QUEUE
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
