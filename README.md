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

CURRENT_PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
P0_RESTORE = 61 / 61
FIRST_REBASELINE_RUNTIME = PASS
RUNTIME_VERIFIED_PRODUCT_SHA = f911f777f770cbe290e290c4b0cbc3692b36641e
P0_PROMOTION = CLOSED
PROMOTED_MAIN = 7e3c14004489a816a4163476161626c6fb3d56c2
PROMOTED_SOURCE_EQUIVALENCE = PASS
CURRENT_GATE = FINAL_UR_FULL_CHECKLIST_AUDIT / FINAL_RUNTIME_PASS
P1_IMPLEMENTATION = CLOSED / PROMOTED
P2_IMPLEMENTATION = NOT AUTHORIZED
UI_PROGRAM = Photoshop-aligned final UI rebuild
UI_STATUS = UI-A_B_C PROMOTED / FINAL RUNTIME PASS / UI_COMPLETE HOLD
FINAL_UI_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
FINAL_UI_RUNTIME_RUN = 36445204976
FINAL_UI_RUNTIME_ARTIFACT = 10979718534
```

Current program authority:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Current capability baseline:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

The 22 named tools / 34 bounded edit operations recorded there are the current CHAT public/control surface subset. They must not be interpreted as the complete INK product capability inventory.

Current UI sequence:

```text
UI-A = PROMOTED
→ UI-B = UR PASS / PROMOTED
→ UI-C = UR PASS / PROMOTED
→ final exact-SHA integrated Runtime = PASS
→ UR full completion checklist audit
→ UI_COMPLETE only after zero open/unreviewed items + required USER acceptance
```

P0/P1 technical remediation and capability reconciliation are already closed. P2 remains outside the current authorized UI program.

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

### WR — Web Review
WR is the autonomous authority for the portfolio website lane end to end.

WR owns:
- mature portfolio website discovery and reference selection;
- information architecture, grid, typography, navigation and responsive analysis;
- Web planning and bounded Work Orders;
- WEB DEV supervision;
- source / browser / visual / responsive QA;
- review decisions;
- branch reconciliation, promotion and merge for Web-portfolio-only work;
- GitHub Pages deployment and verification;
- reusable website-reproduction workflow, component/pattern knowledge and development lessons.

For Web-portfolio-only work, WR does **not** require MR review, MR acceptance or MR promotion approval.

WR may close the full loop:

```text
research
→ plan
→ WEB DEV
→ WR review
→ revise as needed
→ merge / promote
→ deploy
→ verify
→ next Web task
```

WR does not own INK product source, Core, Connector authority, workstation UI, Document / History / Revision implementation or `FORMAT_VERSION`.

Only if Web work actually requires an INK product change:

`STOP → MR / relevant INK authority`

### DEV / UI DEV
Works only on the branch and bounded scope named by the owning Review authority.

DEV does not self-promote, self-merge main, change global authority, certify releases, or start the next task without authorization.

Full rules:

`governance/INK_MR_DEV_GOVERNANCE_v0.1.md`

Program completion guardrail:

`governance/INK_PROGRAM_COMPLETION_GATE_STANDARD_v0.1.md`

## Mandatory outside-in product inspection

INK must be inspected as an assembled product from the USER-visible exterior inward, not as a pile of internal parts.

Required order:

```text
LOOK
→ HTML / post-Runtime DOM
→ effective CSS
→ INTERACTION
→ FUNCTION
→ RENDER
→ CORE / DATA
→ CAPABILITY
→ END-TO-END WORKFLOW
→ USER
```

Do not use capability counts, source registries, Runtime PASS, or checklist totals to close an unresolved outer product layer.

Durable standard:

`governance/INK_PRODUCT_OUTSIDE_IN_INSPECTION_STANDARD_v0.1.md`

UI assembly evidence rule:

`governance/INK_UI_HTML_CSS_ASSEMBLY_VERIFICATION_RULE_v0.1.md`

Reusable reference-driven UI design / inspection standard:

`governance/UI_REFERENCE_DRIVEN_DESIGN_AND_INSPECTION_STANDARD_v1.0.md`

Current consolidated Photoshop-alignment authority:

`ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`

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


## AI development orchestration / software reproduction

Reusable development-method research derived from INK:

`research/INK_AI_DEVELOPMENT_ORCHESTRATION_AND_SOFTWARE_REPRODUCTION_FRAMEWORK_v0.1.md`

Current target:

```text
reference software
→ capability / interaction / authority census
→ dependency-driven Work Orders
→ GitHub machine state
→ event-triggered Supervisor
→ MR / UR / DEV role routing
→ deterministic completion gates
→ automatic next-owner transition
```

The USER should set direction and acceptance, not manually transport cross-role handoffs or rediscover missing completion gates.

First prototype target: `AI_DEV_ORCHESTRATOR_v0.1`.

Current R&D baseline incorporating the INK failure case:

`research/AI_DEVELOPMENT_PRODUCTION_LINE_R_AND_D_HANDOFF_v1.0.md`

New-window production-line MR handoff:

`ACTIVE/AI_DEV_PRODUCTION_LINE_MR_NEW_WINDOW_HANDOFF_v1.0.md`

The corrected direction is artifact-driven rather than claim-driven: source/Runtime/checklist PASS cannot substitute for assembled/rendered/interacted product evidence.

## CHAT capability qualification → creative reproduction benchmark

The creative-validation direction now has a mandatory qualification gate before mature-work reproduction.

Primary reference ecosystems:

```text
Figma
Penpot
Adobe
```

Current sequence:

```text
proven GPT / agent examples and operating instructions
→ extract operation patterns
→ map selected cases to INK capabilities
→ identify overlap / unique coverage / missing coverage
→ define CHAT × INK qualification tests
→ Gate 1 isolated capability qualification
→ Gate 2 combined-task qualification
→ mature-work analysis
→ CHAT writes an INK-specific reproduction procedure
→ autonomous INK reproduction
→ Preview / compare / correct
→ History / Revision / provenance evidence
→ selected cases published to the portfolio
```

The current initial evidence set is **33 selected Figma / Penpot / Adobe cases**. Their immediate purpose is not portfolio volume; it is to derive the first complete practical CHAT × INK qualification surface and expose connector/control gaps before execution expands.

The long-term target of **100+ qualified mature works** remains, but aggressive candidate expansion is deferred until qualification direction and coverage gaps are visible.

Qualification plan:

`research/INK_CHAT_CAPABILITY_QUALIFICATION_PLAN_v0.1.md`

Reproduction benchmark:

`research/INK_CREATIVE_REPRODUCTION_BENCHMARK_v0.1.md`

This research direction does not itself authorize product mutation. Current implementation authority remains `ACTIVE/INK_CURRENT_WORK_ORDER.md`.


## Web portfolio / WR program

A separate **WR — Web Review** lane owns the portfolio website program.

First program:

```text
INK-WEB-PORTFOLIO-001
— Mature Portfolio Reference & First Reproduction
```

Sequence:

```text
mature portfolio-site research
→ select one strong reference
→ reproduce the first portfolio website
→ visual / responsive QA
→ GitHub Pages deployment
→ record lessons
→ establish reusable Web reproduction workflow
```

WR should accumulate:

```text
Web Reference Library
Web Pattern / Component Library
Web Development Lessons
```

The first site is intentionally reproduction-first rather than original-design-first. Once the shell is stable, it can present the Creative Reproduction Benchmark cases and results.

Program specification:

`research/INK_WEB_PORTFOLIO_WR_PLAN_v0.1.md`

Current WR status:

`working/INK_WEB_PORTFOLIO_001_WR_STATUS_v0.1.md`

Current Web reproduction Work Order:

`working/INK_WEB_PORTFOLIO_001_WEB_DEV_WORK_ORDER_v0.1.md`


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

For `INK-FULL-CAPABILITY-REBASELINE-001`, the first restored-capability Runtime passed on exact product SHA `f911f777f770cbe290e290c4b0cbc3692b36641e` in run `36255595714`.

Current executable Windows Runtime workflow:

`.github/workflows/ink-runtime-batch-windows.yml`

Queue:

`ACTIVE/INK_RUNTIME_QUEUE.json`

Windows Runtime method:

`governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`

Do not recreate retired task-specific workflows merely because their historical task names still appear in QA files.

## UI authority

The prior UI-A/B/C technical/runtime milestones are historical evidence. USER visual acceptance reopened the UI, and current work is in USER-directed reconstruction mode.

Current authority:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Consolidated Photoshop-alignment design + inspection guide:

`ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`

Current bounded UI dispatch:

`ACTIVE/INK_UI_PS_VISUAL_DETAIL_CONFORMANCE_DISPATCH_v1.0.md`

Direct execution handoff:

`ACTIVE/INK_UI_DIRECT_MR_NEW_WINDOW_HANDOFF_v1.0.md`

Reusable future-program UI standard:

`governance/UI_REFERENCE_DRIVEN_DESIGN_AND_INSPECTION_STANDARD_v1.0.md`

Current capability baseline remains:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

Historical measurement/workpack/checklist files remain provenance. They do not independently override the Master Guide, current actual page, or USER authority.

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
