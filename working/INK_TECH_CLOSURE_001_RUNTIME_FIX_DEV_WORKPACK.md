# INK-TECH-CLOSURE-001 — Final Runtime Fix DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

DATE: 2026-09-26

BRANCH:

`work/ink-tech-closure-001`

DISPATCH_HEAD:

`f5eaf45715859004436d15d4645209b7be29a120`

## 1. Mission

Fix only the two defects isolated by the final Closure Windows Runtime.

Do not continue broad Closure development.

Do not add capabilities.

Do not run promotion.

DEV must diagnose, implement the smallest proven fix, run focused QA, record a checkpoint, hand off, and STOP.

## 2. Preserved accepted baseline

The following remain accepted and must not be reopened without direct evidence:

```text
C1 source integration = MR_SOURCE_PASS
C2-A source integration = MR_SOURCE_PASS
C2-B source integration = MR_SOURCE_PASS
C2-C source integration = MR_SOURCE_PASS

bounded use_ink vocabulary = 34
named tools = 21

UI Runtime = PASS
Geometry Runtime = PASS
focused Node contracts = PASS
FORMAT_VERSION = 4

repeat.expand.v1
= CORE_ONLY_ACCEPTED / NOT_EXPOSED
```

The prior Runtime also found and fixed one real C1 product conflict:

`object.reparent.v1`

Grouped descendants with stable refs may now be reparented only through the explicit hierarchy reparent operation. Do not broaden that exception to general editing/hit-testing.

## 3. Authoritative Runtime evidence

### Run 36205464046

Target:

`7f09eca0c25ad567e3ce7d2b56431e4fc00c4b9a`

Established:

```text
focused contracts = PASS
UI = PASS
Geometry = PASS
Closure = FAIL
Creative = FAIL
```

### Run 36206166651

Target:

`bf2640f7d9ca28249e4c9c427abf9f01bf9d6622`

Established:

```text
focused contracts = PASS
UI = PASS
Geometry = PASS

Closure failure:
  first C2-C Component registration proposal does not reach PROPOSED

Creative failure:
  Properties panel open is not the cause
  grounded OBSERVE read changes Document JSON
  History unchanged
  Revision unchanged
```

After that run, MR added diagnostics only:

```text
99d391d358893bf0830ac644a50bdfa93b71899a
  expose C2-C proposal diagnostics

f5eaf45715859004436d15d4645209b7be29a120
  report field-level grounded read Document mutation
```

These diagnostics are part of the dispatch baseline.

## 4. Defect A — C2-C component.register proposal failure

Observed Runtime boundary:

```text
operation = component.register.v1
phase = propose
expected = PROPOSED / mutation-neutral
actual = FAILED
```

The source checkpoint and focused Node tests passed before browser Runtime.

DEV must use the diagnostic-enhanced Closure harness to identify the exact failure code and state condition.

Required investigation order:

1. reproduce/read the C2-C proposal diagnostics;
2. verify target stable ref and Frame identity at the exact C2-C handoff point;
3. verify `validateChatEditTaskAgainstState` target validation;
4. verify proposal-time mutation-neutrality;
5. verify Component native preconditions are not incorrectly being applied during proposal;
6. identify the smallest mismatch between browser state and focused Node fixture.

### Native authority that must remain authoritative

```text
document/components.js:registerComponentDefinition
```

Existing Component commands remain authoritative:

```text
registerComponentDefinition
createComponentInstance
setComponentOverride
detachComponentInstance
duplicateComponentDefinition
repairComponentReference
```

### Authorized product mutation for Defect A

Primary:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
```

Inspection-only by default:

```text
product/source/src/document/components.js
product/source/src/document/hierarchy.js
```

If the fix requires changing `document/components.js`, Document schema, History semantics, Revision semantics, or Component data format:

```text
STOP → MR
```

Do not invent a second Component validator/store.

## 5. Defect B — grounded OBSERVE mutates Document

Observed Runtime boundary:

```text
tool = get_grounded_creative_context
permission = OBSERVE

Properties panel open:
  not established as the mutation source

grounded read:
  Document JSON changed = true
  History changed = false
  Revision changed = false
```

This is a real read-only contract violation unless the enhanced field-level diagnostic proves the changed path is an invalid test artifact.

DEV must use the current recursive `documentDiff` evidence first.

Required investigation order:

1. obtain the exact changed JSON path(s), before, and after;
2. identify which grounded read provider touches that path;
3. determine whether the mutation is:
   - direct write,
   - lazy normalization,
   - cache/materialization written into Document,
   - shared-reference alias,
   - semantic/provenance metadata write,
   - other documented cause;
4. fix the mutation at its true authority;
5. preserve the OBSERVE contract:
   `Document / History / Revision must remain unchanged`.

### Candidate read path for inspection

```text
product/source/src/ai/chat-runtime.js
product/source/src/ai/creative-intelligence-context.js
product/source/src/ai/document-bridge.js
product/source/src/semantic/semantic-region-grounding.js
product/source/src/provenance/provenance-graph.js
product/source/src/ai/ai-core.js
product/source/src/ai/install-ai.js
```

This is an investigation list, not authorization to edit all files.

DEV must modify only the smallest file(s) proven causal.

### Hard stop for Defect B

If the fix would require changing:

```text
Document schema / migration
History semantics
Revision semantics
Creative Memory write policy
Research auto-fetch/write policy
FORMAT_VERSION
```

then:

`STOP → MR`

## 6. QA authorization

DEV may update/add only focused QA needed to prove the two defects:

```text
qa/runtime/ink-tech-closure-001-browser-harness.html
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-c2c.test.mjs
new narrowly-scoped regression tests under qa/
```

Central Windows runner is frozen unless DEV proves the defect is orchestration-only:

`qa/runtime/run-ink-runtime-batch.mjs`

If runner mutation is required:

`STOP → MR`

## 7. Required focused regressions

### Defect A

Must prove:

```text
component.register.v1 proposal = PROPOSED
proposal is mutation-neutral
explicit approval still required
execute routes to registerComponentDefinition
History = exactly native transaction behavior
34-operation vocabulary unchanged
C2-C seven-operation suffix unchanged
```

### Defect B

Must prove:

```text
get_grounded_creative_context = COMPLETED
Document before === Document after
History before === History after
Revision before === Revision after
selection grounding result remains correct
Semantic UNAVAILABLE remains a valid read-only result when no semantic match exists
```

Also prove no regression to:

```text
get_document_summary
get_ink_context
get_ink_selection
get_grounded_creative_context permission = OBSERVE
```

## 8. Hard prohibitions

```text
new capability family = 0
new Component Variant system = 0
Variables/Tokens = 0
Connector-005 = 0
Grid Layout engine = 0
new Repeat/Layout engine = 0
UI feature work = 0
Renderer / Canvas / WebGL work = 0
service worker/cache work = 0
automatic Creative Memory writes = 0
automatic Research fetch/scrape = 0
external network path = 0
IMAGE = 0
FORMAT_VERSION change = 0
product version change = 0
main promotion = 0
full Windows Runtime by DEV = 0
```

## 9. Required checkpoint / handoff

Create:

`working/INK_TECH_CLOSURE_001_RUNTIME_FIX_CHECKPOINT.md`

Required sections:

```text
DISPATCH_HEAD
LATEST_COMMIT
DEFECT_A_ROOT_CAUSE
DEFECT_A_FIX
DEFECT_B_ROOT_CAUSE
DEFECT_B_FIX
FILES_CHANGED
WHAT_DID_NOT_CHANGE
FOCUSED_QA
KNOWN_GAPS
NEXT
```

Required final state:

```text
RESULT = DEV_FIX_READY_FOR_MR_REVIEW
WINDOWS_RUNTIME = NOT_RUN_BY_DEV
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```

Do not continue into Runtime, promotion, baseline freeze, UI work, or other Closure backlog.
