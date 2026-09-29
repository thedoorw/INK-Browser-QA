# INK AI Development Orchestration & Software Reproduction Framework v0.1

STATUS: `RESEARCH_BASELINE / IMPLEMENTATION_NOT_YET_AUTHORIZED`

DATE: 2026-09-29

## Purpose

Preserve the development-method discussion derived from INK and define the next research target: a reusable system for reproducing mature software/tool patterns and automating AI-assisted development handoffs without requiring the USER to act as the project event bus.

This document is intentionally broader than the current INK UI program. It is a candidate framework for future creative Web tools and later INK development automation.

## 1. Problem learned from INK

INK demonstrates that AI can write code, review code, produce QA and maintain substantial project context, but the human USER still performs too much orchestration:

```text
MR finishes → USER tells DEV
DEV finishes → USER tells MR/UR
UR finds issue → USER relays it back
new chat opens → USER tells it what to read
one subgate passes → USER may need to notice another mandatory gate is still open
```

The structural problem is:

```text
GitHub = SSOT
USER = still acting as event bus / dispatcher / completion reconciler
```

Target:

```text
USER = direction / priority / acceptance / creative judgment
AI + deterministic automation = memory / routing / handoff / QA / reconciliation / closure tracking
```

## 2. Two linked systems

The future method should be separated into two reusable systems.

### A. Reference-Driven Tool Development Framework

For creating a new mature Web tool by studying existing successful software.

Core sequence:

```text
REFERENCE CAPTURE
→ CAPABILITY CENSUS
→ INTERACTION CENSUS
→ AUTHORITY MAP
→ UI PLACEMENT / UI GRAMMAR
→ DEPENDENCY GRAPH
→ BOUNDED WORK PACKAGES
→ IMPLEMENTATION
→ CONTINUOUS RECONCILIATION
→ RUNTIME / CERTIFICATION
→ TEMPLATE / LESSON EXTRACTION
```

Key principle:

> Do not jump directly from screenshots/reference software to code.

The mature reference must first be decomposed into capabilities, interaction behavior, UI placement, state/data authority, dependencies and QA contracts.

### B. Autonomous Development Orchestration System

For removing manual cross-chat handoff and project-state reconciliation.

Core sequence:

```text
GitHub state
→ event
→ Supervisor
→ load current role contract
→ execute/review
→ write structured result
→ state transition
→ next owner / next gate
```

## 3. Minimum machine-readable state

First prototype should stay small. Candidate authoritative machine state:

```text
PROJECT_STATE.json
CAPABILITY_REGISTRY.json
WORK_ORDER.json
COMPLETION_GATES.json
FINDINGS.json       (when needed)
```

Markdown remains useful for humans and AI reasoning, but terminal-state decisions should not depend on prose interpretation alone.

Candidate rule:

```text
JSON/YAML = machine authority
Markdown = readable/generated explanation and evidence
```

Example project state:

```json
{
  "program": "NEW-DRAWING-TOOL-001",
  "phase": "UI_IMPLEMENTATION",
  "state": "DEV_IN_PROGRESS",
  "owner": "DEV",
  "next_owner": "UR",
  "work_order": "UI-A-001",
  "branch": "work/ui-a-001",
  "required_gates": ["SOURCE_QA", "BROWSER_QA", "UR_REVIEW"]
}
```

## 4. State machine

Agents must not invent the next step from prose when the program defines an explicit transition.

Candidate lifecycle:

```text
AUTHORIZED
→ DEV_IN_PROGRESS
→ DEV_HANDOFF
→ REVIEW_REQUIRED
   ├─ REVISION_REQUIRED → DEV_IN_PROGRESS
   └─ PASS → PROMOTION_READY
→ MERGED / PROMOTED
→ RECONCILE
→ NEXT_PACKAGE_READY
```

Terminal transition is separately guarded:

```text
READY_FOR_COMPLETION
→ PROGRAM_COMPLETE
```

only when every mandatory completion predicate is true.

Current durable completion rule is already governed by:

`governance/INK_PROGRAM_COMPLETION_GATE_STANDARD_v0.1.md`

## 5. Deterministic automation vs AI reasoning

Do not make an LLM responsible for facts that normal code can enforce.

### Deterministic automation

GitHub Actions / ordinary scripts should check:

- schema-valid project state;
- exactly one current owner;
- branch / PR / HEAD consistency;
- reviewed SHA equals promotion SHA where required;
- required QA/check status;
- checklist item counts and dispositions;
- unresolved findings;
- required USER acceptance state;
- product-byte changes since last Runtime;
- whether Runtime covers current product;
- stale Current Work Order / global-state contradictions;
- duplicate authority / missing next-owner invariants where machine-readable.

### AI reasoning

AI should handle:

- reference interpretation;
- capability extraction;
- interaction/UI analysis;
- architectural review;
- defect classification;
- evidence sufficiency judgment;
- bounded revision design;
- Core/global escalation decisions;
- comparison of implementation against mature reference behavior.

Principle:

```text
automation owns invariants
AI owns interpretation
```

## 6. Role model

Future orchestration should not require three permanent chat windows to retain project memory.

Candidate model:

```text
                 GitHub Event
                      ↓
                Work Supervisor
                      ↓
              read PROJECT_STATE
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       MR ROLE      UR ROLE      DEV ROLE
```

Roles should be durable contracts stored in GitHub, for example:

```text
governance/roles/MR.md
governance/roles/UR.md
governance/roles/DEV.md
```

A role is therefore a state/authority profile, not necessarily a permanently open CHAT.

## 7. Supervisor / dispatcher

Supervisor responsibility:

```text
read current machine state
→ identify current owner / next owner
→ load role contract
→ load bounded task evidence
→ execute role work
→ write result
→ request/perform allowed state transition
```

Example:

```text
DEV pushes commit
→ PR event
→ Supervisor triggered
→ PROJECT_STATE says NEXT_OWNER=UR
→ load UR role
→ review exact SHA
→ result = REVISION_REQUIRED
→ FINDINGS written
→ owner = DEV
→ state = DEV_REVISION_REQUIRED
```

The USER should not need to carry the handoff message.

## 8. Reference-driven software reproduction

Input may include:

- mature software/screenshots;
- official documentation;
- tutorials;
- interaction recordings;
- feature lists;
- user-defined differences and product goals.

Before implementation, create stable capability records.

Example:

```json
{
  "id": "CAP-LAYER-001",
  "name": "Layer reorder",
  "reference": "Photoshop Layers",
  "interaction": "drag reorder",
  "authority": "LayerModel",
  "ui_home": "Layers Panel",
  "dependencies": ["History"],
  "qa": ["drag reorder", "undo reorder", "save/reload"],
  "status": "NOT_IMPLEMENTED"
}
```

Completeness identities should exist from the start, not at the end.

Candidate examples:

```text
TOTAL_TARGET_CAPABILITIES = IMPLEMENTED + DEFERRED + RETIRED/EXCLUDED
IMPLEMENTED = UI_EXPOSED + INTENTIONAL_HEADLESS
UNPLACED_REQUIRED_CAPABILITIES = 0
UNCLASSIFIED_CAPABILITIES = 0
DUPLICATE_PRIMARY_AUTHORITIES = 0
```

## 9. Dependency-driven work packaging

Work should be derived from capability dependencies rather than invented ad hoc.

Example:

```text
Document
↓
History
↓
Selection
↓
Transform
↓
Layers
↓
UI exposure
```

A dependency resolver can identify READY capabilities deterministically.

Planner then groups them into bounded packages, e.g.:

```text
WORK-001 Document + Persistence
WORK-002 History + Undo/Redo
WORK-003 Layer model
WORK-004 Layer UI
```

Each Work Order should carry:

- scope;
- dependencies;
- exact allowed files/authorities;
- prohibited changes;
- QA contract;
- evidence requirements;
- owner/reviewer;
- promotion gate;
- Runtime policy.

## 10. Promotion gate

AI review alone should not authorize merge.

Candidate machine promotion predicate:

```text
required_source_qa = PASS
required_browser_qa = PASS
review = PASS
open_findings = 0
head_sha = reviewed_sha
authority_change = false_or_explicitly_approved
```

Only then:

`PROMOTION_READY = true`

Use GitHub branch protection / required checks where practical.

## 11. Failure learning

The most valuable development memory is not a narrative of mistakes; it is a new invariant that prevents recurrence.

INK examples:

```text
failure: UI work began before complete capability reconciliation
guardrail: NO_UI_IMPLEMENTATION_BEFORE_CAPABILITY_CENSUS_COMPLETE
```

```text
failure: reviewer ownership drifted
guardrail: ONE_OWNER_PER_LANE + explicit STOP/ESCALATION boundary
```

```text
failure: review result and Current Work Order diverged
guardrail: ROLE_RESULT_COMMIT → GLOBAL_STATE_RECONCILIATION
```

```text
failure: Runtime passed while mandatory completion checklist remained open
guardrail: SUBGATE_PASS != PROGRAM_COMPLETE
```

```text
failure: final Runtime harness encoded superseded UI assumptions
guardrail: QA contracts must be reconciled when accepted authority changes
```

```text
failure: targeted UI correction exposed a first-paint regression
guardrail: evidence → reproduce → bounded correction → exact-SHA recheck → promotion
```

Principle:

> Experience is durable only when the system prevents the same failure from recurring.

## 12. First implementation experiment

Do not begin by building a large autonomous platform.

Prototype:

`AI_DEV_ORCHESTRATOR_v0.1`

First proof should demonstrate only:

```text
1. GitHub machine state identifies current owner.
2. GitHub event can trigger the appropriate supervisory work.
3. Mandatory gates automatically block invalid terminal state.
4. Result automatically produces the next state / next owner.
```

Target test loop:

```text
DEV_HANDOFF
→ UR_REVIEW
→ REVISION_REQUIRED
→ DEV
→ UR_PASS
→ MR / RUNTIME gate
```

Success criterion:

> The USER does not manually transport any handoff message.

Initially the prototype may use simulated/no-op code changes. Prove orchestration before entrusting it with product mutation.

## 13. Current Plus feasibility snapshot

Current discussion conclusion as of 2026-09-29:

```text
GitHub as durable project memory / SSOT        = high feasibility
machine gate reconciliation                   = high feasibility
GitHub PR event → supervisory task             = high feasibility
DEV ↔ UR automated revision loop              = medium-high feasibility
automatic next Work Order generation          = medium-high feasibility
reference/capability extraction                = medium-high feasibility
fully unattended development through release  = materially lower feasibility
```

Important implementation assumption:

- use current ChatGPT Work / GitHub-trigger capabilities where available;
- do not assume ChatGPT Plus includes general OpenAI API usage;
- current plan/account task limits and external-write approval behavior are product constraints and must be reverified immediately before implementation;
- do not design the architecture around a capability that has not been demonstrated in the user's actual environment.

## 14. Development framework target

Long-term target:

```text
mature reference software
→ evidence capture
→ capability / interaction / authority model
→ dependency graph
→ automated bounded planning
→ supervised AI implementation
→ deterministic + reasoning QA
→ automated review/revision routing
→ exact-SHA promotion
→ certification
→ reusable patterns / lessons
```

This is not merely software cloning.

It is:

> decompose mature software into capabilities, authorities, interactions, UI grammar and quality standards, then recompose those patterns into the user's own tools.

## 15. Relationship to current INK work

This document does not authorize changes to current INK product source.

Current execution remains governed by:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`;
- `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`;
- `governance/INK_PROGRAM_COMPLETION_GATE_STANDARD_v0.1.md`.

The current Photoshop UI checklist closure should continue independently under UR while this orchestration/reproduction framework is discussed and later prototyped.
