# INK CORE INTEGRATION 005 — Creative Intelligence Memory + Research Integration Report v0.1

## Status

`INK_CORE_INTEGRATION_005_SOURCE_READY`

Task: `INK-CORE-INTEGRATION-005`

Branch: `work/ink-core-integration-005`

Runtime: `DEFERRED_TO_CENTRAL_RUNTIME_QUEUE`

## Objective

Connect the accepted Creative Memory and Research → Creation modules to the existing grounded CHAT path without creating a second runtime or changing execution authority:

```text
INK document + grounded context
+ selected Creative Memory advisory context
+ selected Research → Creation advisory context
→ bounded grounded CHAT reasoning
→ existing grounded creative decision
→ existing editable creative-plan proposal
→ existing user approval / execution boundary
```

The integration is advisory and read-only. It does not write Creative Memory, fetch or scrape research sources, approve plans, execute plans, or mutate the Document / History / Revision / Geometry / Renderer before the existing user-governed boundary.

## Existing context root integration

`product/source/src/ai/creative-intelligence-context.js` remains the only grounded creative-intelligence context root.

The existing adapter now optionally accepts:

- a Creative Memory provider exposing `readAdvisoryContext()`;
- a Research → Creation provider exposing `advisory()`.

When absent, the prior context path remains valid and the optional module sections are omitted.

When present, the root may expose:

```text
modules.creativeMemory
modules.researchCreation
```

Each section retains:

- the upstream advisory context fingerprint;
- upstream read-only authority metadata;
- selected records / research evidence / principles / constraints;
- unresolved evidence;
- exact upstream provenance/reference structures, subject to the existing CHAT object-disclosure projection.

The root `contextFingerprint` includes the optional sections when present. Provider failures become explicit unresolved evidence instead of producing hidden fallback state.

Default root integration bounds are deliberately narrower than the standalone module hard limits:

- Creative Memory: 16 records / 32 KiB;
- Research → Creation: 16 evidence / 16 principles / 16 constraints / 48 KiB.

The existing root output bound remains authoritative.

## Read-only CHAT tool integration

`product/source/src/ai/chat-runtime.js` adds two grounded tools to the existing `ToolCallRouter`:

```text
get_creative_memory_context
get_research_creation_context
```

They reuse the Integration-001 grounded provider and the Integration-003 one-round continuation.

Creative Memory tool behavior:

- accepts an advisory query and bounded options;
- returns the existing Creative Memory advisory context;
- exposes no add / replace / write operation.

Research → Creation tool behavior:

- accepts evidence / principle / constraint selection and bounded options;
- returns the existing Research → Creation advisory context;
- intentionally does not expose Creative Memory promotion controls;
- performs no remote fetch or scrape.

Provider absence or rejection returns a bounded read-only diagnostic.

No new tool exists for:

- Creative Memory write / add / replace;
- research fetch / scrape;
- plan approval;
- execution;
- Revision capture.

## Bounded reasoning and plan boundary

Both new tools are members of the existing grounded read-only tool family, so:

```text
GROUNDED_CONTINUATION_MAX = 1
```

remains unchanged.

A grounded continuation can consume the advisory evidence once. A second grounded tool round remains blocked by the existing continuation limiter. Mixed mutation/write/fetch intents are surfaced for the existing user-governed flow and are not auto-routed during grounded reasoning.

The existing `INK-GROUNDED-CREATIVE-DECISION` and `INK-CHAT-CREATIVE-PLAN` contracts remain authoritative. Advisory tool results can be cited through the existing trusted `toolEvidence` mechanism. A valid advisory-assisted decision may only create an existing:

```text
status = PROPOSED
approved = false
approvalToken = null
```

plan. Approval and execution are unchanged.

## Task-specific QA

Added:

`qa/core-integration-005-creative-intelligence.test.mjs`

Coverage includes:

- old grounded context with neither provider;
- Creative Memory only;
- Research → Creation only;
- both providers together;
- deterministic root fingerprints for equivalent provider inputs;
- bounded Creative Memory selection / truncation;
- provider failure retained as unresolved evidence;
- read-only routing for both new tools;
- provider-unavailable diagnostics;
- unsupported memory-write and research-fetch intents not auto-routed;
- one-round continuation preserved;
- discussion-only path creates no plan;
- advisory-assisted grounded decision creates only an existing `PROPOSED` plan;
- no approval token;
- no Document / History / Revision mutation before approval;
- no Creative Memory write and no research remote fetch / scrape;
- `FORMAT_VERSION = 4`.

## Full source regression

Branch-only source workflow:

`.github/workflows/ink-core-integration-005-source-qa.yml`

Passing run:

`35810111857`

Validated commit:

`c28b9e4625931c9d2f7b53f1f352c7009281d1e4`

Result:

```text
Integration-001 = PASS
Integration-002 = PASS
Integration-003 = PASS
Integration-004 = PASS
Integration-005 = PASS
CORE-MOD-006 Creative Memory = PASS
CORE-MOD-007 Research → Creation = PASS
existing creative-plan / bounded-edit unit + source checks = 21 / 21 PASS
FORMAT_VERSION = 4
```

The first task-local run failed only because the new QA fixture supplied one creative-plan step while the existing authoritative plan schema requires a minimum of two. The fixture was corrected; product plan constraints were not relaxed. The complete suite then passed.

## Authority / mutation audit

```text
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
```

No package or `main` mutation was performed.

## Runtime disposition

Windows / Chrome Runtime was not executed by DEV.

Per the Work Order:

```text
RUNTIME_QA = DEFERRED_TO_CENTRAL_RUNTIME_QUEUE
```

The task is source-ready only; MR owns review, promotion, and central Runtime queue mutation.

## DEV conclusion

```text
GATE = INK_CORE_INTEGRATION_005_SOURCE_READY
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
