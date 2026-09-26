# INK Browser QA

INK is a browser-based creative editor built on one shared product core.

This repository is the GitHub SSOT for product source, QA, research, engineering, governance and selected milestone evidence.

## Current state

```text
TECHNICAL_CLOSURE = CLOSED / PROMOTED
RUNTIME_STABILITY = CLOSED
CONNECTOR_005 = CLOSED / PROMOTED

FORMAT_VERSION = 4

CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34
CHAT_PUBLIC_SURFACE_IS_NOT_FULL_PRODUCT_CAPABILITY = TRUE

CURRENT_PRIMARY_REMEDIATION = INK-FULL-CAPABILITY-REBASELINE-001
CURRENT_PROGRAM = Full Product Capability Rebaseline / Preservation Recovery
UI_PROGRAM = Photoshop-aligned final UI rebuild
UI_STATUS = HOLD
CURRENT_GATE = MR capability rebaseline before any UI Work Order
```

Current primary remediation authority:

`ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`

Previous capability baseline under active rebaseline:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

The 22 named tools / 34 bounded edit operations recorded there are the current CHAT public/control surface subset. They must not be interpreted as the complete INK product capability inventory.

Current task/gate:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Roles

### USER
Sets direction, priority and acceptance.

### MR — Main Review
Owns technical/Core authority:
- Renderer / Canvas / WebGL;
- Document / schema / migration;
- History / Revision;
- Geometry / Recipe Core;
- CHAT proposal/approval/execution authority;
- persistence;
- product/FORMAT_VERSION;
- technical Work Orders and cross-lane integration.

### UR — UI Review
Owns the delegated UI lane end to end while work remains UI-only:
- UI planning/workpacks;
- Photoshop reference alignment;
- UI DEV supervision;
- UI source/static/Runtime/visual evidence;
- UI health;
- UI-only reconciliation/promotion;
- final UI verification on current main.

If correct UI work requires a frozen Core/global authority change:

`STOP → MR / INTEGRATION_REQUIRED`

### DEV / UI DEV
Works only on the branch and bounded scope named by the owning Review authority.

DEV does not self-promote, self-merge main, change global authority, certify releases, or start the next task without authorization.

Full rules:

`governance/INK_MR_DEV_GOVERNANCE_v0.1.md`

## New-window read order

All roles:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
6. `working/WORKING_STATUS.md`

Then read only role/task-specific files named by the Current Work Order.

DEV:
- read `ACTIVE/INK_DEV_NEW_WINDOW_START.md`;
- if a work branch is named, use branch-local `ACTIVE/INK_DEV_PROGRESS.md` when present.

MR/UR:
- pin the exact task branch HEAD;
- review the task-specific checkpoint/handoff/evidence;
- do not depend on global append-only review logs.

Cross-window recovery:

`governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`

## Product model

INK remains one product with two delivery forms:

```text
                    shared INK Core
                          │
             ┌────────────┴────────────┐
             │                         │
       Portable / Web               Cloud
          INK.html             browser/cloud delivery
             │                         │
      local/offline use        persistent adapters
```

Shared editor capabilities belong in the shared Core. Cloud-only concerns should remain adapters/layers where practical.

Product delivery direction:

`governance/INK_Product_Delivery_Model_v0.1.md`

Durable product/UX principles:

`governance/INK_PRODUCT_UX_PRINCIPLES_v1.0.md`

## CHAT × INK architecture

CHAT is a governed creative control layer over native INK authorities.

```text
Capability Discovery
→ Grounded Read / Search / Inspect
→ Proposal
→ Explicit Approval
→ INK Native Authority
→ History
→ Revision
→ Preview / Output
```

Current architecture:

`governance/INK_CHAT_INTEGRATION_ARCHITECTURE_v1.0.md`

## Repository map

```text
ACTIVE/
  current authority only

working/
  current task only

governance/
  durable rules and current architecture

research/
  technical knowledge / surveys / benchmarks / reports

ARCHIVE/
  selected historical milestones

product/
  product source

qa/
  regression / Runtime / fixture evidence

engineering/
  engineering utilities

reference/
  external/reference baselines

.github/workflows/
  current executable automation only
```

Document lifecycle:

`governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`

## Runtime authority

Current executable Windows Runtime workflow:

`.github/workflows/ink-runtime-batch-windows.yml`

Queue:

`ACTIVE/INK_RUNTIME_QUEUE.json`

Windows Runtime method:

`governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`

Do not recreate retired task-specific workflows merely because their historical task names still appear in QA files.

## UI authority

UI implementation is currently **HOLD** while MR rebuilds the full product capability baseline.

Current remediation/development authority:

`ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`

Previous UI capability snapshot, retained for diff but not sufficient to authorize final UI implementation:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

UI engineering health:

`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

Current UI research/reference:
- `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
- `research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`
- `research/INK_UI_REVIEW_CHECKLIST_v0.1.md`

Historical UI evidence does not override the current UI Work Order.

## Research

Research remains a technical knowledge base, not current authority by default.

Index:

`research/README.md`

## Packaging

Current modular package uses exact Git-object reuse.

Standard:

`governance/INK_GitHub_Fast_Packaging_Standard.md`

Current package branch:

`package/ink-current`

Future certified portable target remains:

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

## Original source baseline

Historical source package:

`INK_v1.6.5_RC_MAIN.zip`

Immutable identity:

```text
SHA256 = 59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d
ZIP bytes = 60406367
entries = 1471
uncompressed bytes = 215908955
```

Original import/classification evidence is curated under:

`ARCHIVE/original-import-1.6.5/`

Imported documentation under `governance/source/` is historical source evidence and is not current authority by default.

## Historical milestone

CHAT technical closure / Runtime stability / Connector-005:

`ARCHIVE/milestones/2026-09-26-chat-technical-closure/README.md`
