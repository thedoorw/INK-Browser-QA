# INK Program Completion Gate Standard v0.1

STATUS: `ACTIVE / DURABLE GOVERNANCE`

DATE: 2026-09-28

## Purpose

Prevent a program from being declared complete merely because one major subgate, such as Runtime, has passed.

This standard exists because the Photoshop-aligned UI program reached a successful final Runtime while its mandatory final UI completion checklist still contained undispositioned items. The user identified the missing closure gate after the assistant had already declared `UI_COMPLETE`.

That is a process failure, not a user responsibility.

## Failure record

Program:
`INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001`

Observed sequence:

```text
UI-A/B/C promoted
→ final exact-SHA Runtime PASS
→ assistant/MR declared UI_COMPLETE
→ mandatory final completion checklist still contained [ ] items
→ user detected missing full UR audit
```

Root cause:

```text
closure logic accepted summary evidence
without reconciling every mandatory completion authority
```

The workflow treated `FINAL_RUNTIME_PASS` as though it implied `UI_COMPLETE`. That implication is invalid.

## Durable rule

```text
SUBGATE_PASS != PROGRAM_COMPLETE
```

For any program with one or more mandatory completion authorities:

```text
PROGRAM_COMPLETE =
  every mandatory gate closed
  + every required checklist item dispositioned
  + zero unresolved required findings
  + required user acceptance complete
```

No agent may infer completion from a summary PASS if another mandatory authority remains open.

## Checklist gate

For every required checklist item:

```text
DISPOSITION ∈ {PASS, FAIL, N_A}
EVIDENCE_OR_REASON != EMPTY
```

A raw unchecked item such as `- [ ]` is machine-interpreted as `UNREVIEWED / OPEN` unless an explicit structured disposition exists elsewhere in the same authoritative checklist record.

Final gate requires:

```text
UNREVIEWED_CHECKLIST_ITEMS = 0
OPEN_CHECKLIST_ITEMS = 0
FAIL_ITEMS = 0
```

If USER evidence is required by the checklist, `USER_VISUAL_ACCEPTANCE = COMPLETE` must also be true.

## Runtime relationship

Runtime is a mandatory evidence gate when required, but Runtime proves only the scope it actually tests.

```text
RUNTIME_PASS = runtime subgate closed
RUNTIME_PASS != full UI audit
RUNTIME_PASS != user acceptance
RUNTIME_PASS != program completion
```

## Automatic orchestration requirement

Any future orchestration/state-machine implementation must automatically evaluate completion prerequisites before permitting a terminal state.

Minimum required state:

```text
required_gates[]
gate_status{}
required_checklist
unreviewed_checklist_items
open_checklist_items
fail_items
required_user_acceptance
user_acceptance_status
```

Terminal transition `READY_FOR_COMPLETION → PROGRAM_COMPLETE` is allowed only if all required predicates evaluate true.

Otherwise:

```text
PROGRAM_COMPLETE = BLOCKED
NEXT_OWNER = owner of first open mandatory gate
```

The user must not be required to remember, inspect, or manually reintroduce a missing mandatory gate.

## Review-authority responsibility

MR / UR / any future supervisor must reconcile:

1. original program completion criteria;
2. current Work Order;
3. mandatory checklists;
4. Runtime/QA evidence;
5. unresolved findings;
6. required USER acceptance;

before writing any terminal `COMPLETE`, `CLOSED`, or equivalent state.

## Current application

For the current INK UI program:

```text
FINAL_RUNTIME = PASS
UR_FULL_CHECKLIST_AUDIT = OPEN
UI_COMPLETE = HOLD
NEXT_OWNER = UR
```

Authority:
`working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`

Only after the full UR checklist audit reaches zero open/unreviewed required items and required USER visual acceptance is complete may `UI_COMPLETE` be restored.
