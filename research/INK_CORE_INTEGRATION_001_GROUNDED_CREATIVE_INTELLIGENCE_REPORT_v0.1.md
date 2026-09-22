# INK-CORE-INTEGRATION-001 — Grounded Creative Intelligence Context Integration v0.1

STATUS: `DEV_HANDOFF`

## 1. Scope

Task:

`INK-CORE-INTEGRATION-001 — Grounded Creative Intelligence Context Integration v0.1`

Branch:

`work/ink-core-integration-001`

Authoritative branch base:

`89770b215a0c3d0aef30e1c0565fcb8e2975a997`

DEV source-review base before this report:

`c51c2dcc24d2ce0b8f81c5bd4a670a8b41dd525d`

This workpack integrates existing Core evidence modules into the existing CHAT context-construction path. It does not create a second document authority, editor authority, execution engine, renderer path, history path, or revision path.

## 2. Implemented integration

New integration service:

`product/source/src/ai/creative-intelligence-context.js`

It composes the existing modules:

- AI Document Bridge;
- Semantic Region Grounding;
- Revision Provenance Graph;
- Visual Compare;
- Parametric Structure.

The aggregate context contains:

- authoritative document/revision identity;
- preserved module fingerprints;
- bounded document/selection context;
- bounded semantic-region/relationship context;
- bounded provenance lineage context;
- explicit unresolved/unsupported evidence;
- deterministic aggregate fingerprint;
- aggregate output byte bound;
- explicit read-only authority metadata.

Visual Compare evidence is created only when explicit comparison subjects are supplied.

Parametric Structure evidence is created only when an explicit structure descriptor is supplied.

Unsupported `FORMAT_VERSION` values are rejected. No migration is attempted. `FORMAT_VERSION = 4` is preserved.

## 3. CHAT wiring

Modified:

`product/source/src/ai/chat-runtime.js`

The existing `ContextBuilder` now accepts an optional grounded-context provider.

Behavior:

- grounded context is advisory/read-only;
- existing planning and conversation request paths consume it through the normal context payload;
- `groundedContext: false` preserves the prior CHAT context path;
- missing/failing grounded provider falls back to the prior CHAT context path;
- no external service is required;
- token-budget fitting may omit grounded context before older required CHAT context sections;
- the existing protected/locked target filtering supplies the allowed-object projection;
- object/stroke IDs already admitted by the existing `DocumentStateProvider` are the only current-document IDs eligible for grounded transmission;
- `includeHistory=false` explicitly suppresses grounded History evidence, preserving the existing CHAT history-disclosure choice.

Preview → approval → execution → rollback semantics are unchanged.

## 4. Deterministic/source QA

Committed QA:

`qa/core-integration-001-grounded-context.test.mjs`

Coverage includes:

- same document/evidence → same integrated context/fingerprint;
- reordered equivalent evidence → same normalized output;
- selection/document-bridge identity preservation;
- semantic-region references;
- provenance lineage references;
- explicit-only Visual Compare;
- explicit-only Parametric Structure;
- no implicit comparison/structure generation;
- unresolved evidence remains explicit;
- provider/document immutability;
- disclosure projection for protected/filtered IDs;
- no restore/history push/revision write/document replace/renderer/DOM/network dependency in the integration module;
- CHAT grounded context enabled;
- CHAT grounded context disabled;
- grounded provider unavailable fallback;
- History disclosure boundary;
- `FORMAT_VERSION = 4` and unsupported-version rejection.

DEV source QA executed against the actual GitHub branch source using direct syntax parsing plus an in-memory contract execution harness.

Results:

```text
SOURCE_SYNTAX_PARSE = PASS
INTEGRATION_CONTRACT_EXECUTION = PASS
DETERMINISTIC_REORDER = PASS
EXPLICIT_ONLY_COMPARE_STRUCTURE = PASS
DISCLOSURE_PROJECTION = PASS
FORMAT_VERSION_4_GUARD = PASS
CHAT_CONTEXT_ENABLED_DISABLED_FALLBACK = PASS
CHAT_HISTORY_DISCLOSURE_BOUNDARY = PASS
FORBIDDEN_SIDE_EFFECT_STATIC_SCAN = PASS
```

The committed Node QA file remains available for MR/local repository execution.

Browser/Windows Runtime QA was intentionally not executed by DEV.

`RUNTIME_QA = PENDING_MR_PROMOTION_AND_MANUAL_BATCH`

## 5. Scope-diff audit

Comparison:

`89770b215a0c3d0aef30e1c0565fcb8e2975a997...c51c2dcc24d2ce0b8f81c5bd4a670a8b41dd525d`

At the pre-report checkpoint the branch was 5 commits ahead and 0 behind its authorized base.

Task implementation touched only:

- `ACTIVE/INK_DEV_PROGRESS.md`;
- `product/source/src/ai/chat-runtime.js`;
- `product/source/src/ai/creative-intelligence-context.js`;
- `qa/core-integration-001-grounded-context.test.mjs`.

This final checkpoint additionally adds this required report.

Boundary audit:

```text
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
```

## 6. Gate

```text
CREATIVE_INTELLIGENCE_CONTEXT_DEFINED = PASS
CREATIVE_INTELLIGENCE_CONTEXT_WORKS = PASS
CHAT_GROUNDED_CONTEXT_WIRED = PASS
INK_CORE_INTEGRATION_001_SOURCE_READY = PASS
```

## 7. Handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-001
BRANCH = work/ink-core-integration-001
GATE = INK_CORE_INTEGRATION_001_SOURCE_READY
RUNTIME_QA = PENDING_MR_PROMOTION_AND_MANUAL_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
