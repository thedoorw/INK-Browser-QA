# INK CHAT Connector Plan Integrity Audit v0.1

STATUS: `MR_AUDIT / USER_DIRECTIVE_RECORDED / NO_IMPLEMENTATION_AUTHORIZATION`

AUDIT_BASELINE_MAIN: `c5725b817deaac686d076561de9e1d5ad97255f6`

## 1. Why this audit exists

The original INK CHAT connector direction was explicitly based on reusing operation models CHAT already knows from Figma, Penpot and Adobe instead of inventing a separate bespoke editor language.

A later cross-check exposed a project-integrity problem:

```text
planned
!= implemented
!= exposed to CHAT
!= Runtime verified
!= promoted to current main
```

Some capabilities were researched and planned, some were implemented, some were exposed, and some were even fully coded on a branch but never promoted. These states were not kept together in one durable closure ledger.

This audit records that discrepancy and prevents future completion claims from silently dropping unresolved items.

---

## 2. Responsibility for remembering agreed plans

User question:

> 使用者該不該提醒 AI 那些說好的計畫？該由誰記得？

Project answer:

```text
USER
= decides goals, priorities, acceptance, changes of direction

MR / AI
= owns durable plan continuity
= owns unresolved-item tracking
= owns recovery from GitHub SSOT after context loss
= must not require the user to remember every deferred or unfinished item
```

The user may change, cancel, postpone or reprioritize a plan at any time.

But once a plan has been accepted and recorded in GitHub, the burden of remembering its unresolved state belongs to the project governance layer, not to the user.

If CHAT/MR loses conversational context, it must recover from GitHub SSOT before claiming completion.

A user reminder is useful input, but must not be the mechanism that keeps an agreed technical plan alive.

---

## 3. Closure rule

For any planned connector capability:

```text
PLANNED
→ IMPLEMENTED
→ CHAT_SURFACE_EXPOSED
→ QA / RUNTIME VERIFIED as required
→ PROMOTED_TO_CURRENT_MAIN
→ CLOSED
```

Therefore:

```text
CODE_WRITTEN != COMPLETE
DEV_HANDOFF != COMPLETE
BRANCH_PASS != COMPLETE
RUNTIME_DEBT != COMPLETE
OLD_BRANCH_EXISTENCE != INSTALLED
```

Every future connector ledger must preserve at least:

```text
ORIGINAL_TARGET
ORIGINAL_SCOPE_LEVEL
CORE_IMPLEMENTED
CHAT_SURFACE
WRAPPER_IMPLEMENTED
QA_STATUS
RUNTIME_STATUS
PROMOTION_STATUS
CURRENT_DISPOSITION
DISPOSITION_REASON
```

No unresolved item may disappear merely because a later work order changes topic.

---

## 4. Original capability-map cross-check

Source:

`research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md`

The original operational-equivalence table contains:

```text
40 operation families
+ 1 operation-provenance invariant
= 41 table entries
```

At this audit baseline:

```text
operation families with at least real INK implementation basis = 33
original GAP / later / N/A families                         = 7
provenance invariant implemented                           = 1
```

Strict current CHAT exposure classification:

```text
fully CHAT-usable operation families = 15
partially CHAT-exposed families      = 3
implemented but not fully exposed    = 15
not implemented / original future    = 7
provenance invariant                 = installed
```

The counts use operation family as the unit. Subcommands are not double-counted as separate families.

---

## 5. Geometry Ops integration debt

The unpromoted branch:

`work/ink-chat-geometry-ops-001`

contains eight additional implemented bounded `use_ink` operations:

```text
path.create.v1
path.edit.v1
object.rotate.v1
object.clone.v1
repeat.radial.v1
boolean.apply.v1
group.create.v1
object.reparent.v1
```

Main currently exposes the original six operations only.

The eight additions have implementation, capability schemas, native-authority routing, focused QA, browser proof code, DEV handoff and report.

They were not rejected by product decision. The MR Runtime reached:

```text
UI = PASS
Creative = HARNESS TIMEOUT
Geometry suite = NOT REACHED
```

Therefore their current state is:

```text
IMPLEMENTED
NOT RUNTIME ACCEPTED
NOT PROMOTED
UNFINISHED_INTEGRATION_DEBT
```

They must not be described as installed until reconciled onto the current main baseline, verified and promoted.

---

## 6. The seven original GAP / later / N/A items are not one category

The earlier research did not classify all seven the same way.

### A. Explicit deferred targets

1. Grid layout
   - original status: `GAP / not equivalent mature executor`
   - original target: `later`
   - interpretation: deferred capability, not a v0.1 completion claim.

2. Component Variants
   - original status: `GAP / no mature equivalent`
   - original target: `later`
   - interpretation: deferred capability, not a v0.1 completion claim.

3. Variables / Tokens
   - original status: `GAP as general design-token system`
   - original target: `connector phase after base drawing`
   - interpretation: explicitly deferred phase item.

These three remain valid research targets unless a later decision retires them. Their current value should be reassessed; they should not be silently treated as either completed or cancelled.

### B. Explicitly outside the initial image-workstation scope

4. Prototype interactions
   - original target: `N/A-v0.1 for image workstation`

5. Design → code
   - original target: `N/A initially`

6. Code / live UI → design
   - original target: `optional later`

These were not promises to implement during the initial connector phase.

Absence of implementation is not, by itself, a failure of the original plan.

They become active debt only if the product direction later explicitly adopts them.

### C. Explicit later connector step

7. Design-system search / Creative Library Search
   - original table: `important later for mature reusable artwork modules`
   - original staged plan: `Connector-005 — Creative Library Search`
   - intended contents: components, materials, recipes, parametric structures, reference-derived structures, future tokens/styles.

This item has stronger planning status than a generic “later” note.

It was part of the staged connector development order and therefore must remain visible as unresolved planned work unless the user explicitly retires or replaces it.

---

## 7. Was the earlier CHAT research meaningless?

Audit conclusion:

```text
NO — not wholesale.
```

The research correctly distinguished:

- existing INK capability;
- partial capability;
- genuine gap;
- later work;
- optional work;
- v0.1 non-goals.

It also correctly identified reusable Figma/Penpot/Adobe operation patterns.

The failure occurred later if project state or completion language allowed deferred items to disappear without a durable disposition.

Therefore the correction is:

```text
DO NOT overturn the earlier research wholesale.
DO audit each deferred item against:
  original reason
  current INK architecture
  current user direction
  current value
and assign one explicit disposition:
  REAFFIRM
  PROMOTE_TO_ACTIVE_PLAN
  KEEP_DEFERRED
  RETIRE_WITH_REASON
```

No item may be silently forgotten.

---

## 8. Current interpretation of the seven items

At this audit point, without authorizing implementation:

| Item | Original commitment level | Current audit treatment |
|---|---|---|
| Grid layout | later | REASSESS / KEEP VISIBLE |
| Component Variants | later | REASSESS / KEEP VISIBLE |
| Variables / Tokens | phase after base drawing | REASSESS / KEEP VISIBLE |
| Prototype interactions | N/A-v0.1 | NO CURRENT DEBT unless direction changes |
| Design → code | N/A initially | NO CURRENT DEBT unless direction changes |
| Code/live UI → design | optional later | OPTIONAL / NO CURRENT DEBT |
| Design-system / Creative Library Search | Connector-005 planned step | UNRESOLVED PLANNED WORK |

This classification is a plan-integrity audit, not an instruction to implement all seven.

---

## 9. Governance defect identified

The defect is not simply “some features are missing.”

It is:

```text
PLAN_STATE_FRAGMENTATION
```

Research, implementation, Runtime, promotion and later deferral were recorded in different files/branches without one closure ledger that survived task changes.

This can create the false impression that:

```text
foundation completed
=
original plan completed
```

when the actual state may be:

```text
foundation completed
+ deferred capabilities remain
+ implemented-but-unpromoted work remains
```

Future MR completion statements must distinguish those states explicitly.

---

## 10. No implementation authorization

This audit does not itself authorize:

- replay or promotion of Geometry Ops;
- Grid Layout;
- Variants;
- Tokens;
- Prototype;
- Design/code bridges;
- Creative Library Search;
- any new product-source change.

It establishes the durable record that these items exist and that their disposition must be explicit rather than forgotten.
