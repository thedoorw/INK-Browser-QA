# INK CORE INTEGRATION 002 — Grounded Creative Tool Surface Report v0.1

## Task

```text
TASK_ID = INK-CORE-INTEGRATION-002
TITLE = Grounded Creative Tool Surface v0.1
BRANCH = work/ink-core-integration-002
AUTHORIZED_FROM_MAIN = 148087b904781b6cf69ca2e0097b7ed648c1cdee
TARGET_GATE = INK_CORE_INTEGRATION_002_SOURCE_READY
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_NEXT_COMPATIBLE_BATCH
```

## Implemented public CHAT tools

The existing CHAT public tool contract now publishes three bounded tools:

```text
get_grounded_creative_context = OBSERVE
compare_visual_subjects = OBSERVE
resolve_parametric_structure = PROPOSE / READ_ONLY_PLAN
```

Contracts are JSON-compatible and explicitly bounded:

- grounded context accepts no document-write instruction and reads the existing Integration-001 provider;
- visual compare requires explicit `subjectA` and `subjectB`;
- parametric structure requires an explicit `descriptor`;
- missing explicit inputs return bounded diagnostic evidence rather than synthesizing subjects/descriptors;
- existing legacy CHAT tool names and permission checks remain published and unchanged.

## Router integration

All three tools are wired through the existing `ToolCallRouter`; no second router or execution authority was created.

Implementation reuses:

```text
Integration-001 grounded creative context provider
→ createCreativeIntelligenceContextAdapter

Visual Compare
→ compareVisualSubjects

Parametric Creative Structure
→ resolveParametricStructure
```

Results continue through the existing tool-result envelope, secret redaction, call-rate limiting and audit path.

The new router cases do not call approval, execution, rollback, restore, commit, renderer, DOM or network APIs.

## CHAT request compatibility

Both existing CHAT paths now advertise the same published tool definitions:

```text
requestPlan
requestConversation
```

Planning and conversation responses retain tool calls and their structured tool results so CHAT can reason with read-only evidence.

Remote providers remain optional. Local/manual CHAT remains valid. No automatic document execution was introduced. Existing preview → approval → execution → rollback authority remains separate.

## Permission and mutation boundaries

Verified boundaries:

```text
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
DOCUMENT_WRITE_AUTHORITY_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
```

`resolve_parametric_structure` requires `PROPOSE` permission but returns only the existing read-only structure plan. It does not insert generated nodes.

## Deterministic/source QA

QA source:

`qa/core-integration-002-grounded-tool-surface.test.mjs`

GitHub-hosted Node QA:

```text
RUN = 35728730503
JOB = 106748707255
RESULT = PASS
NODE = 22
```

Passed checks:

- CHAT runtime syntax;
- stable publication of all three new tool contracts;
- legacy tool publication compatibility;
- current grounded context tool/provider reuse;
- explicit visual compare deterministic evidence;
- explicit parametric structure deterministic plan evidence;
- missing compare subjects diagnostic;
- missing parametric descriptor diagnostic;
- document byte content unchanged by the new tools;
- History state unchanged;
- Revision state unchanged;
- OBSERVE access for grounded/compare;
- PROPOSE requirement for parametric planning;
- existing mutation-tool permission gates preserved;
- no execute/approve/rollback/restore/commit/renderer/DOM/network call in the new router cases;
- both planning and conversation paths publish/use the new tools;
- `FORMAT_VERSION = 4`;
- Integration-001 deterministic/source QA remains PASS.

Temporary DEV QA workflow was removed after successful evidence capture.

## Runtime disposition

No browser/Windows Runtime was executed in this workpack.

```text
RUNTIME_QA = DEFERRED_TO_NEXT_COMPATIBLE_BATCH
HIGH_RISK_TRIGGER = NOT_OBSERVED
```

## Source gate

```text
GROUNDED_TOOL_CONTRACT_DEFINED = PASS
GROUNDED_TOOL_ROUTER_WORKS = PASS
CHAT_GROUNDED_TOOLS_AVAILABLE = PASS
INK_CORE_INTEGRATION_002_SOURCE_READY = PASS
```
