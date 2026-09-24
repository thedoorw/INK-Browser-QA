# INK DEV PROGRESS

STATUS: `INK-CHAT-CLOSED-LOOP-001 / AUTHORIZED / DEV_NOT_STARTED`

## Task

```text
TASK_ID = INK-CHAT-CLOSED-LOOP-001
TITLE = Reference → Color + Line → CHAT Smart Closed Loop Proof v0.1
BRANCH = work/ink-chat-closed-loop-001
BRANCH_BASE = 9ab4a6b557628f8fcdd1b58312b219423c68fe34
TARGET_GATE = SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP
FORMAT_VERSION = 4 / PRESERVE
UI_CHANGE = 0
IMAGE_MODEL = 0
EXTERNAL_TRANSPORT = 0
NEW_NATIVE_OPERATION_FAMILIES = 0
CURRENT_PHASE = DEV_START
```

## Required route

```text
get_ink_capabilities
→ import_ink_reference
→ decompose_ink_reference
→ get_ink_preview
→ stable Color / Line refs
→ use_ink
→ approve
→ execute existing path.repaint.v1 × 2
→ History
→ Revision
→ get_ink_preview
→ Runtime evidence PNG before / after
```

## Product scope

Only:

```text
product/source/src/agent/public-creative-api.js
product/source/src/agent/capability-registry.js
```

Required addition:

```text
reference.import
→ existing app.chatReferenceHandoff.importReference

Named Tool #20:
import_ink_reference
```

Connector-004 19 tools remain exact prefix.

## QA scope

```text
qa/ink-chat-closed-loop-001-smart-proof.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
```

Runtime must materialize:

```text
evidence/smart-loop-before.png
evidence/smart-loop-after.png
evidence/smart-loop.json
```

The QA-only payload materialization may use the existing internal `resolveInkOutputPayload` path. It is not product external transport.

## Hard boundaries

```text
Boolean / Repeat / Group / Frame / Component / Layout = 0
Path geometry / raw Path creation = 0
new trace engine = 0
UI = 0
external transport = 0
MCP / WebSocket / postMessage = 0
arbitrary JS / eval / Function = 0
direct Document JSON write = 0
automatic approval = 0
FORMAT_VERSION change = 0
package/ink-current mutation = 0
```

## DEV completion

Update:

```text
focused QA
Runtime browser evidence support
research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md
working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md
this progress file
```

Then report exact HEAD and:

`DEV_HANDOFF → STOP`
