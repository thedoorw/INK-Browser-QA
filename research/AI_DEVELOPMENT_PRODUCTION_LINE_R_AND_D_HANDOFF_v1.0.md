# AI Development Production Line — R&D Handoff v1.0

STATUS: ACTIVE / R&D BASELINE / USER-AUTHORIZED
DATE: 2026-09-30

## 1. Purpose

This document records the production-line concept developed during INK work and the major failures exposed by the INK UI program. It is the baseline for a separate MR/research lane that will continue developing a reliable AI-assisted software production system.

The goal is not to add more review ceremony. The goal is to reduce manual relay while making product reality harder to misread.

## 2. Original production-line concept

The intended operating model was:

```text
GitHub SSOT
  ├─ Project State
  ├─ Role Contracts
  ├─ Work Orders
  ├─ Evidence
  └─ deterministic state checks
          ↓
   AI / CHAT Supervisor
          ↓
      reads NEXT_OWNER
          ↓
   dispatches next bounded role
          ↓
   evidence returned to GitHub
          ↓
      next transition
```

Candidate machine-readable state file:

`ACTIVE/AI_DEV_STATE.json`

Candidate role contracts:

- governance/roles/DEV.md
- governance/roles/UR.md
- governance/roles/MR.md

Candidate deterministic checks:

- STATE_SCHEMA_VALID
- ONE_OWNER_ONLY
- KNOWN_STATE_ONLY
- LEGAL_TRANSITION_ONLY
- BRANCH_MATCH
- HEAD_SHA_MATCH
- REQUIRED_EVIDENCE_PRESENT
- NEXT_OWNER_DEFINED
- NO_CONTRADICTORY_GATE

The intended benefit was to eliminate USER-as-message-bus work: copying instructions between DEV, UR and MR, reminding roles what comes next, and manually reconciling contradictory state.

## 3. Environment and operating constraints

Current practical constraints from the USER:

- GitHub is the sole SSOT.
- Avoid GitHub Actions / metered API workflows where possible.
- Prefer bounded direct repository operations and visible browser/product evidence.
- USER remains final product and visual authority.
- AI roles may automate handoff and verification, but may not silently replace USER goals.

The production-line R&D must therefore distinguish between:

1. automation of state/handoff;
2. automation of evidence collection;
3. automation of bounded implementation;
4. final human product judgment.

## 4. Major failures exposed by INK

### 4.1 Parts completeness was mistaken for product completeness

INK accumulated capability inventories, PUI placement, route ledgers and focused tests. These proved that many parts existed, but did not prove they were assembled into the product the USER actually saw.

Core lesson:

```text
COMPONENT_COMPLETENESS != SYSTEM_ASSEMBLY != PRODUCT_REALITY
```

### 4.2 Placement PASS was mistaken for UI implementation PASS

The 74 PUI plan was a placement/disposition plan. It explicitly did not itself implement the UI, yet later role reasoning treated 74/74 disposition as evidence of product completion.

Core lesson:

```text
PLACEMENT_PASS != UI_IMPLEMENTATION_PASS
```

### 4.3 Source / Runtime evidence was mistaken for rendered UI evidence

UI-B used runtime contribution registries and dynamic injection. A contribution existing in JavaScript or a Runtime assertion did not prove the final browser DOM and CSS produced the intended visible workstation.

Core lesson:

```text
SOURCE_PRESENT != VISIBLE_UI_PRESENT
RUNTIME_PASS != UI_ASSEMBLY_PASS
```

### 4.4 Checklist proxy evidence replaced the actual requirement

Example: a requirement for a left double-column Tools reference was accepted using evidence from a different two-row top/contextual toolbar state.

This is an evidence-type mismatch, not a valid PASS.

Required future rule:

```text
EVIDENCE_MUST_MATCH_THE_REQUIREMENT
EVIDENCE_MISMATCH = FAIL
```

### 4.5 AI reviewers inherited the same narrative

DEV, UR and MR often read the same workpacks, PASS statements and derived specifications. A mistaken assumption could propagate through every role and become consensus.

Core lesson:

```text
ROLE_CONSENSUS_DOES_NOT_OVERRIDE_SOURCE_AUTHORITY
```

Independent reviewers must sometimes receive different information:

- builder: specification + source;
- source reviewer: source + contract;
- visual reviewer: reference + final rendered artifact;
- interaction reviewer: running product only;
- USER: final product and goal.

### 4.6 Reference authority drift

USER-supplied Photoshop captures were gradually displaced by derived semantic/UI interpretations. A later light-theme abstraction preserved some measurements but lost the actual workstation structure and hierarchy.

Core lesson:

```text
PRIMARY_REFERENCE_CANNOT_BE_SUPERSEDED_BY_DERIVED_SPEC_WITHOUT_USER_APPROVAL
```

### 4.7 Runtime PASS was temporarily treated as product completion

A final integrated Runtime could pass while the visible UI still failed USER expectations and while completion-checklist/user gates remained unresolved.

Core lesson:

```text
RUNTIME_PASS != USER_GOAL_PASS
```

### 4.8 AI-created N/A / adaptation decisions removed reference requirements

Some Photoshop details were converted to NOT_APPLICABLE or 'INK adaptation' because they were not represented as explicit product capabilities. This confused UI grammar with Core capability.

Future rule:

An AI may not waive a visible reference requirement merely because it is absent from the capability census.

N/A is allowed only when:

- the authoritative product capability truly does not exist and adding it would invent product scope; or
- USER explicitly approves the deviation.

### 4.9 USER validation happened too late

Large checklists and long technical closure cycles occurred before the USER saw the actual assembled result. Directional errors therefore survived too long.

Future rule:

Use representative vertical slices and early USER checkpoints before scaling implementation.

### 4.10 Generated-entrypoint regression hid runtime UI

A Branding change left template tokens in generated entrypoints, including the runtime-script placeholder. The shell still rendered, but dynamic capability UI failed to load.

Core lesson:

Generated artifacts must be verified as artifacts, not assumed from source templates.

Required identity chain:

```text
commit SHA
→ build/generated artifact
→ deployed asset
→ browser-loaded build
→ screenshot / interaction evidence
```

### 4.11 Duplicate and low-sense visible controls accumulated

Capabilities were exposed wherever routing was convenient instead of being reconciled into one coherent workstation grammar. The result could be technically reachable but visually nonsensical.

Core lesson:

```text
CAPABILITY_PRESERVED != CAPABILITY_DISCOVERABLE_IN_A_COHERENT_UI
```

### 4.12 Fake UI affordances appeared without real product authority

A Photoshop-like document-tab row existed although INK did not have a true multi-document tab/window authority. A visual imitation that does not carry the interaction semantics of the reference is not valid conformance.

Core lesson:

Do not imitate a reference affordance unless the corresponding product behavior exists, except when the USER explicitly authorizes a decorative approximation.

## 5. Corrected production-line model

The production line must become artifact-driven instead of claim-driven.

```text
USER INTENT / PRIMARY REFERENCE
↓
REFERENCE LOCK
↓
BOUNDED BUILD
↓
FINAL ARTIFACT
↓
OUTSIDE-IN INSPECTION
↓
BLACK-BOX INTERACTION
↓
CORE / CAPABILITY AUDIT
↓
END-TO-END WORKFLOW
↓
USER ACCEPTANCE
```

## 6. Evidence-layer rule

Evidence cannot close a different layer.

```text
SOURCE evidence      -> source claim only
DOM/CSS evidence     -> assembled UI claim
screenshot evidence  -> rendered visual claim
interaction evidence -> interaction claim
Core tests           -> Core claim
capability census    -> capability-presence claim
USER acceptance      -> USER-goal claim
```

No deeper technical PASS may close an unresolved outer product layer.

## 7. Required product inspection order

All complete-product inspection follows:

```text
LOOK
→ STRUCTURE / final HTML or post-runtime DOM
→ STYLE / effective CSS
→ INTERACTION
→ FUNCTION
→ RENDER
→ CORE / DATA
→ CAPABILITY
→ END-TO-END WORKFLOW
→ USER
```

This is implemented for INK in:

- governance/INK_PRODUCT_OUTSIDE_IN_INSPECTION_STANDARD_v0.1.md
- governance/INK_UI_HTML_CSS_ASSEMBLY_VERIFICATION_RULE_v0.1.md

## 8. Completion states

Do not collapse different evidence layers into one generic PASS.

Recommended states:

- ARTIFACT_PASS
- ASSEMBLY_PASS
- VISUAL_PASS
- INTERACTION_PASS
- FUNCTION_PASS
- CORE_PASS
- CAPABILITY_PASS
- WORKFLOW_PASS
- USER_PASS

A program declares completion only from the states actually required by that program.

## 9. USER checkpoint strategy

Do not wait for full completion before product viewing.

Recommended sequence:

```text
shell / skeleton
→ USER checkpoint
major navigation + controls
→ USER checkpoint
representative full workflow
→ USER checkpoint
scale remaining capability coverage
→ final verification
```

This reduces the cost of a wrong direction from an entire program to a small bounded slice.

## 10. Production-line automation target

The R&D objective is not 'fully autonomous AI decides everything'. It is:

- automate deterministic handoff;
- automate state validation;
- automate artifact identity tracking;
- automate evidence collection where reliable;
- isolate reviewer information to reduce correlated error;
- surface contradictions instead of smoothing them over;
- preserve explicit USER checkpoints at high-level goal boundaries.

## 11. Suggested state-machine fields

A future ACTIVE/AI_DEV_STATE.json prototype should minimally contain:

- program_id
- task_id
- state
- current_owner
- next_owner
- base_sha
- target_sha
- required_artifacts
- required_evidence_layers
- reference_authority
- user_checkpoint_required
- open_blockers
- allowed_transitions
- last_transition

## 12. Suggested transition rules

Examples:

```text
PLANNED -> BUILDING
  requires: task + authority + base SHA

BUILDING -> ARTIFACT_READY
  requires: target SHA + artifact identity

ARTIFACT_READY -> REVIEWING
  requires: evidence plan

REVIEWING -> USER_CHECKPOINT
  requires: all non-USER required evidence layers

USER_CHECKPOINT -> ACCEPTED
  requires: USER acceptance

any state -> BLOCKED
  requires: explicit blocker + owner
```

No role may invent a legal transition because 'it seems complete'.

## 13. R&D tasks for the next MR

The new production-line MR should continue as a research/prototype lane, not by changing INK product behavior.

Priority tasks:

1. inventory every point in INK where the USER had to relay, remind, correct, re-dispatch, or reconcile roles;
2. classify each as deterministic automation, artifact verification, judgment, or USER-only authority;
3. design ACTIVE/AI_DEV_STATE.json v0.1 and a transition schema;
4. design role contracts that constrain evidence claims, not merely role names;
5. prototype an artifact identity chain from Git commit to deployed/browser-loaded version;
6. prototype an evidence manifest that records evidence type and the exact claim it is allowed to prove;
7. define a reviewer-isolation protocol;
8. define USER checkpoint rules for direction-sensitive work;
9. evaluate what can be implemented in the current ChatGPT Plus + GitHub environment without GitHub Actions/API-heavy infrastructure;
10. produce one small controlled trial before generalizing the theory.

## 14. R&D success criterion

The production-line design is successful only if it measurably reduces USER relay work while making silent product-reality errors less likely.

Do not optimize for number of AI roles, number of tests, or number of PASS labels.

Optimize for:

```text
correct artifact
+ visible evidence
+ legal state transition
+ minimal USER relay
+ preserved USER authority
```