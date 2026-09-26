# INK CHAT Integration Architecture v1.0

STATUS: `ACTIVE / PROMOTED TECHNICAL ARCHITECTURE`

DATE: 2026-09-26

AUTHORITATIVE CAPABILITY BASELINE:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

## Architecture

```text
CHAT
↓
Capability Discovery
↓
Document / Selection / Grounding
↓
Search / Inspect
↓
Proposal
↓
Explicit Approval
↓
INK Native Authority
↓
History
↓
Revision
↓
Preview / Output
↓
CHAT inspection / continued creation
```

CHAT is a creative control layer over the native INK document/editor authorities. It is not a second drawing engine.

## Accepted invariants

```text
FORMAT_VERSION = 4
BOUNDED_EDIT_OPERATIONS = 34
NAMED_TOOLS = 22
```

The exact operation and tool inventories are frozen in:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`.

## Major capability layers

### Grounded read
- current document/page;
- selection;
- hierarchy and stable object refs;
- semantic/provenance context;
- History;
- Revision;
- Preview/output inspection.

### Bounded mutation
CHAT can propose approved native operations for:
- Path creation/edit/repaint/material/simplify/refine;
- transform/clone/order;
- Group/Frame/hierarchy;
- Boolean;
- Text;
- SVG import;
- Repeat;
- Frame layout and constraints;
- Components/instances/overrides/detach/repair.

Mutation remains governed by native INK authorities.

### Reference and extraction
```text
Reference import
→ decomposition / extraction
→ editable Path / structured objects
→ geometry / composition / repaint
```

Reference identity and provenance remain inspectable.

### Creative plan / closed loop
```text
inspect
→ propose
→ approve
→ execute
→ History receipt
→ Revision
→ Preview
→ inspect again
```

Pre-approval mutation is blocked.

### Creative Library Search — Connector-005
Public named tool:

`search_ink_library`

Families:
- component;
- material;
- recipe;
- parametric-structure;
- reference-derived-structure.

Search/inspect are read-only and mutation-neutral.

Returned refs use the accepted structured ref contract:
`INK_CREATIVE_LIBRARY_REF / 1`.

Reuse routes through existing native authorities; Connector-005 does not create a second Library/Component/Material/Recipe/Repeat engine.

### Visual/output exchange
INK supports preview/output handles and accepted PNG/SVG/PDF export routes.

Cross-tool direction is documented in:
`research/CHAT_TOOL_VISUAL_ASSET_INTERCHANGE_STANDARD_v0.1.md`.

## Security / authority boundary

Forbidden by architecture:
- arbitrary eval/function execution;
- hidden mutation during inspect/search;
- direct ungoverned Document JSON replacement;
- a second History or Revision authority;
- autonomous asset application;
- external transport implied merely by CHAT integration.

## Runtime acceptance

Final integrated technical acceptance:

```text
TESTED_EXACT_SHA = 5d6e6bd81f1bcc65ed9d52cc0249f29f199ffa8f
RUN = 36240038654
FOCUSED_NODE = 32 / 32 PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS
ARTIFACT_ID = 10905628104
ARTIFACT_DIGEST = sha256:beb8790c0c31583cde36eb7c59cf0dbcedbd55b2676f2c5c9b19beccab9fa858
```

Promotion source is recorded in the capability baseline and milestone archive.

## Historical implementation trail

Connector/Core/Closure workpacks and checkpoints are historical evidence, not current architecture authority.

Curated milestone:
`ARCHIVE/milestones/2026-09-26-chat-technical-closure/README.md`
