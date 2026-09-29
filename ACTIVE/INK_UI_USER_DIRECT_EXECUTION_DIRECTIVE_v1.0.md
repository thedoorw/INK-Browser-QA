# INK UI — USER Direct Execution Directive v1.0

STATUS: `ACTIVE / USER_DIRECT_UI_MODE / SUPERSEDES_UR_DEV_MR_UI_GATING`

DATE: 2026-09-29

SCOPE: current INK UI correction and reconstruction until USER explicitly declares the UI complete.

## 1. USER command

```text
UI_OWNER = USER
UR_ROLE = NOT_USED
DEV_ROLE = NOT_USED
MR_APPROVAL_BEFORE_UI_CHANGE = NOT_REQUIRED
RUNTIME_GATE_DURING_UI_ITERATION = NOT_USED
RUNTIME_STATUS_IN_UI_WORK_LIST = OMIT
```

The USER gives the UI instruction directly. The active CHAT executes the change directly and returns the visible result for immediate inspection.

## 2. Execution loop

```text
USER instruction
→ direct source edit
→ commit as rollback point
→ deployed/current page refreshed
→ USER inspects
→ next USER instruction
→ repeat
```

No UR handoff, DEV handoff, MR intermediary, promotion review, or central Runtime gate is inserted between USER instruction and visible UI revision.

## 3. GitHub role

GitHub remains the SSOT and rollback history.

Every direct UI iteration should:
- use a bounded commit;
- record what the USER asked to change;
- avoid unrelated Core mutation;
- remain reversible by commit;
- update the visible current product as directly as the repository/deployment path permits.

A separate PR is not mandatory for these USER-directed UI iterations.

## 4. Scope boundary

The direct mode authorizes visible UI implementation and UI wiring needed to realize the USER instruction.

If a requested visible UI change truly requires a destructive document-format change, irreversible data migration, or replacement of a Core authority, stop only for that concrete technical conflict and explain it to USER. Do not invoke routine governance as a blocker.

## 5. Completion rule

During this mode:

```text
UI_COMPLETE = USER_NOT_YET_DECLARED
```

No AI role may declare completion.

Only after USER says the UI is finished / accepted:

```text
USER_UI_FREEZE
→ technical reconciliation
→ MR final decision
→ release / closure decision
```

The final technical reconciliation happens after the visual/UI work is complete, not between UI iterations.

## 6. Supersession

For this current UI correction lane, this directive supersedes:
- UR-owned UI execution routing;
- DEV handoff routing;
- MR approval as a prerequisite to each UI mutation;
- Runtime gating/checklist status as an iteration controller.

Earlier governance remains historical evidence and can be revisited only after USER UI freeze.
