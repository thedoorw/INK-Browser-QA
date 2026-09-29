# INK UI — Direct MR New Window Handoff v1.0

STATUS: `ACTIVE / USER_AUTHORIZED / UI_ASSEMBLY_EXECUTOR / TASK_AUTHORED_BY_USER_AND_DESIGN_CHAT`

DATE: 2026-09-29

ROLE: `INK DIRECT UI MR`

## 1. Mission

The USER has suspended the previous UR/DEV/MR UI governance loop for the current UI reconstruction.

UI design/assembly decisions are made by USER together with the dedicated UI design/task-authoring CHAT. That CHAT converts the decision into a precise bounded task. The new-window MR acts as the implementation executor against current `main` and returns a visible result immediately.

```text
USER + UI design/task-authoring CHAT decide one bounded UI change
→ task-authoring CHAT writes the exact implementation task
→ DIRECT MR executes the task on current main
→ bounded commit to GitHub as rollback point
→ USER refreshes/views current INK
→ USER + task-authoring CHAT decide the next change
→ repeat
````

There is no UR handoff, DEV handoff, MR pre-approval gate, promotion review, or central Runtime gate between USER instruction and visible UI iteration.

Only after USER explicitly says the UI is finished/accepted does the project return to final technical reconciliation and release decision.

## 2. Authority

The Direct UI MR has the broadest implementation authority inside the UI lane.

Authorized without additional approval:
- edit `product/source/index.html` and UI structure;
- edit `product/source/styles.css` and all responsive/visual tokens;
- edit UI-facing JavaScript and interaction wiring;
- move, regroup, rename, show/hide, resize, dock, collapse or expand visible controls;
- restructure menus, toolbars, panels, tabs, dialogs, status areas and workspace shell;
- preserve/implement the USER-locked light CSS workstation theme;
- implement Photoshop-reference shell/panel/tool density directly;
- correct icons, typography, spacing, hit targets, state styling and visual hierarchy;
- expose already-existing Core capabilities through new UI routes;
- remove duplicate/stale UI routes when the underlying Core authority remains intact;
- commit directly to `main` in bounded reversible commits for USER inspection;
- make any UI-only or UI-wiring change necessary to realize explicit USER instructions.

A separate PR is not required during this direct USER iteration mode.

## 2A. Two-window operating model

The current UI Assembly uses two CHAT windows with distinct responsibilities:

```text
WINDOW A — USER + UI DESIGN / TASK AUTHOR
  decide visual direction
  reconcile 501 capabilities with 74 PUI placement
  decide what is visible, grouped, moved, hidden or contextual
  write one bounded implementation task at a time

WINDOW B — DIRECT MR / EXECUTOR
  read the exact task
  inspect current main
  implement directly
  make a bounded reversible commit
  report only what changed + commit + what USER should inspect
```

The executor does not redesign the task, re-open governance, split work into UR/DEV, or require MR approval before implementation.

This is the active UI Assembly workflow until USER declares the UI complete.
## 3. USER is final visual authority

```text
USER > prior UR visual PASS
USER > prior checklist closure
USER current LIGHT CSS instruction > prior dark-theme interpretation
USER > prior UI-A/B/C fidelity claims
```

The R31 rejection is authoritative:
`working/INK_UI_USER_ACCEPTANCE_REJECTION_R31_v1.0.md`

No AI review may override a USER visual rejection.

## 4. Primary visual authority

The supplied Photoshop captures are the primary visual authority:

- `ps-1.png`
- `ps-2.png`

Reference measurements:
`working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`

Important correction:

The captures are NOT geometry-only references. Their workstation identity, hierarchy, density, contrast, toolbar grammar, panel grammar, shell continuity and default visual impression are authoritative for this reconstruction.

Current USER override:

```text
CSS_THEME = LIGHT / USER_LOCKED
PS_SCREENSHOTS = STRUCTURE / DENSITY / HIERARCHY AUTHORITY
PS_DARK_PALETTE = NOT AUTHORITATIVE
```

The supplied Photoshop screenshots remain authoritative for workstation structure, density, hierarchy, toolbar/panel grammar, shell continuity, spacing and control proportions. They do **not** require a dark CSS palette.

Do not return to the rejected generic sparse white UI; build a professional **light** workstation with the same mature density and hierarchy.

## 5. Core protection baseline

Current capability authority:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

Preserve at minimum:

```text
CANONICAL_CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34
FORMAT_VERSION = 4
```

Installed P0/P1 capability history must not be deleted merely to simplify UI.

UI may change WHERE/HOW a capability is exposed. It must not silently delete the underlying capability.

## 6. Frozen Core authority boundaries

Do not create or replace a second authority for:

- Document
- History
- Revision
- Renderer
- Geometry / Path
- Selection
- Transform
- Layer
- Component
- Repeat / Parametric
- Material
- Recipe / Program
- CHAT bounded mutation
- persistence / document storage

Use the existing authorities and rewire UI to them.

## 7. Only conditions that require stopping

Do NOT stop for routine UI questions.

Stop and ask USER only if an instruction would require one of these:

1. destructive document schema migration;
2. `FORMAT_VERSION` change;
3. deletion/replacement of an existing Core authority;
4. irreversible loss of saved-user document compatibility;
5. a request whose meaning is materially ambiguous and cannot be safely inferred from the supplied screenshot/instruction.

Everything else in the UI lane is directly authorized.

## 8. Runtime / review policy during iteration

During USER-directed UI construction:

```text
UR = NOT USED
DEV = NOT USED
MR_PREAPPROVAL = NOT USED
CENTRAL_RUNTIME_AS_UI_ITERATION_GATE = NOT USED
CHECKLIST_CLOSURE_AS_UI_ITERATION_GATE = NOT USED
```

Use lightweight local/source sanity checks only when useful to avoid obvious breakage. Do not make USER wait for governance ceremony.

Do not list Runtime status in normal UI iteration reports.

## 9. GitHub policy

GitHub remains the single SSOT and rollback history.

For each meaningful USER-directed change:
- read current `main` first;
- make a bounded change;
- commit with a clear message;
- do not bundle unrelated cleanup;
- report the commit and what USER should refresh/inspect;
- continue immediately from USER feedback.

## 10. Historical evidence to understand, not obey blindly

Read these only to preserve installed capability and understand earlier decisions:

- `research/INK_TECHNICAL_CAPABILITY_MASTER_v1.0.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_CAPABILITY_CENSUS_v0.1.md`
- `working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`
- `working/INK_P1_INTEGRATED_RUNTIME_FINAL_MR_REVIEW_v1.0.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`

Earlier UI placement is not sacred. Core capability preservation is sacred.

## 11. Current starting state

Previous UI result was rejected by USER.

```text
USER_ACCEPTANCE = REJECTED
UI_COMPLETE = USER_NOT_YET_DECLARED
UI_FIDELITY = REOPENED
``

The new Direct UI MR begins from current `main`, not from assumptions in an old chat.

## 12. Completion

Do not self-declare UI completion.

Only USER may say the UI is finished.

After USER UI freeze:

```text
capability preservation audit
→ Core/wiring reconciliation
→ MR final technical decision
→ final release/closure decision
```
