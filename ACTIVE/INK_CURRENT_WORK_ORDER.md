# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-006 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-006` |
| TITLE | `Workstation Capability Exposure & UI-Function Mapping v0.1` |
| ROLE_OWNER | `MR / CROSS-LANE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-006` |
| DEV_MODE | `BOUNDED_PRODUCT_WIRING` |
| UI_MUTATION | `AUTHORIZED / EXISTING_SHELL_GRAMMAR_ONLY` |
| CORE_ENGINE_REDESIGN | `PROHIBITED` |
| NEW_SECOND_PANEL_SYSTEM | `PROHIBITED` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_AUTHORITY_CHANGE | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| WEB_PORTABLE_PARITY | `REQUIRED` |
| TINYFISH | `PROHIBITED` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `REQUIRED_AFTER_IMPLEMENTATION` |

## Product intent

All already-completed workstation capabilities must be installed into the visible INK workstation so the user can understand where each capability lives, how it is invoked, how CHAT reaches the same capability, and how History / Revision reflect the result.

This task is not a new engine program.

Target:

```text
completed engines/modules
→ authoritative capability inventory
→ correct UI destination
→ correct user command/control
→ correct CHAT relationship
→ correct History / Revision relationship
→ browser runtime verification
```

## Accepted UI authority

Reuse the current single panel authority from `INK-UI-DEBT-001`:

```text
collapsed
properties
layers
history
reference
compose
chat
revision
```

Current desktop shell ownership remains in `web-shell.js`.

Do not create a parallel inspector, floating feature dashboard, second dock, or alternate panel router.

## Capability set to audit and expose

At minimum cover:

1. Vector Geometry Kernel / Foundation A
   - intersections where already implemented;
   - Boolean/path operations where already implemented;
   - split/project/nearest-point where already implemented;
   - compound-path/topology operations where already implemented;
   - only expose capabilities that actually exist in accepted source.

2. AI Document Bridge
   - grounded object/document context;
   - selection-aware context;
   - document/object identity visibility where useful.

3. Semantic Region Grounding
   - selected object/region identity;
   - semantic relationship/region evidence where already available.

4. Revision / Provenance
   - History relationship;
   - Revision relationship;
   - source / operation / revision provenance visibility.

5. Visual Compare / Variant
   - reference/current/revision/variant compare surfaces already supported;
   - overlay/difference modes only where accepted engine support exists.

6. Parametric Creative Structure
   - Repeat / Transform / generator / parameter controls already supported;
   - deterministic structure status.

7. Creative Memory
   - read-only visibility;
   - selected memory/method evidence;
   - accepted/rejected/unresolved state;
   - explicit promotion/write remains out of scope unless an existing approved write boundary already exists.

8. Research → Creation
   - research evidence;
   - principle;
   - creative constraint;
   - relationship to CHAT plan reasoning;
   - no remote fetch/scrape.

9. Grounded CHAT / Creative Decision / Plan
   - visible relation between CHAT advisory reasoning and the existing proposal → approval → execution path.

## Phase A — authoritative UI × Capability Matrix

Create:

`research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`

For every capability above, record:

- engine/module source;
- exact accepted operation(s);
- current user-visible UI entry;
- current CHAT/tool entry;
- current History behavior;
- current Revision behavior;
- current state visibility;
- Web / Portable parity;
- Runtime testability;
- disposition:
  - `EXPOSED_CORRECTLY`
  - `WIRED_BUT_HIDDEN`
  - `UI_MISSING`
  - `PARTIAL_WIRING`
  - `ENGINE_NOT_PRESENT`
  - `OUT_OF_SCOPE`

Do not mark a capability exposed merely because source code exists.

Gate: `WORKSTATION_CAPABILITY_MATRIX_COMPLETE`

## Phase B — placement rules

Use the existing workstation grammar unless implementation evidence requires a bounded exception.

Preferred placement:

```text
Properties
  → selected-object properties
  → geometry / semantic / parametric controls
  → contextual AI/Core sub-navigation

Reference
  → source/reference handling
  → Research evidence/principles/constraints where suitable

Compose
  → composition / structure / repeat / transform workflows

CHAT
  → grounded context
  → Creative Memory advisory
  → Research → Creation advisory
  → decision / proposal / approval state

Revision
  → revisions
  → compare/variant
  → provenance / derivation

History
  → operation sequence / undo-redo history
```

Layers remains document hierarchy, not a dumping ground for intelligence features.

Gate: `CAPABILITY_PLACEMENT_APPROVED_BY_IMPLEMENTATION`

## Phase C — expose existing completed functions

Implement missing user-visible wiring identified by the matrix.

Requirements:

- expose only accepted existing engine/module capability;
- controls must call existing authoritative command/adapter/module paths;
- no duplicated math/AI/History/Revision logic in UI code;
- disabled/unavailable states must be explicit;
- selected object / selection state must drive contextual controls correctly;
- no fake button that has no authoritative backend;
- no hidden mutation bypassing current approval or History rules;
- preserve collapsed canvas-first default.

Gate: `COMPLETED_CAPABILITIES_VISIBLE_AND_WIRED`

## Phase D — CHAT / UI relationship verification

For capabilities callable or readable by CHAT, verify the visible UI communicates the same state/authority.

Examples:

- CHAT advisory evidence may be visible/readable but cannot auto-write memory;
- Research advisory may inform a plan but cannot remote-fetch;
- plan must remain `PROPOSED` before user approval;
- Geometry/Parametric operations initiated through CHAT and UI must converge on the same authoritative operation path where such CHAT execution exists;
- Revision/History outcomes must not diverge by entry surface.

Gate: `CHAT_UI_AUTHORITY_RELATIONSHIP_CORRECT`

## Phase E — History / Revision relationship

Audit each exposed mutation-capable capability:

```text
user action / approved CHAT action
→ authoritative command
→ History entry where applicable
→ Revision/provenance linkage where applicable
```

Read-only/advisory operations must not fabricate History mutations.

Gate: `WORKSTATION_HISTORY_REVISION_RELATIONSHIP_CORRECT`

## Phase F — Web / Portable parity

All visible capability exposure must be mirrored between:

- `product/source/index.html`
- `product/source/index-standalone.html`

Delivery-specific labels may differ; capability structure must not.

Gate: `WORKSTATION_WEB_PORTABLE_PARITY_PASS`

## Phase G — Runtime QA

This task requires actual Windows Chrome Runtime after implementation.

Runtime must exercise, where applicable:

- open/close existing workstation panels;
- selection → Properties contextual route;
- at least one exposed Geometry capability;
- Semantic/Document context visibility;
- Parametric/Compose route;
- Compare/Revision route;
- Creative Memory read-only route;
- Research → Creation read-only route;
- CHAT proposal/approval boundary;
- History/Revision effects for a mutation-capable operation;
- Web shell integrity;
- narrow desktop containment;
- Web / Portable parity evidence;
- exact tested SHA;
- UI / Creative / Geometry regressions.

If a capability is not executable in the current browser harness, record that explicitly in the matrix and add the smallest bounded harness assertion needed. Do not claim Runtime coverage from source tests alone.

Gate: `WORKSTATION_CAPABILITY_RUNTIME_PASS`

## Required QA / report

Add focused QA for the matrix and wiring.

Required report:

`research/INK_CORE_INTEGRATION_006_WORKSTATION_CAPABILITY_EXPOSURE_REPORT_v0.1.md`

The report must include:

- before/after capability matrix summary;
- every newly exposed UI route;
- exact engine/command behind each route;
- CHAT relationship;
- History/Revision relationship;
- any capability still not exposed and why;
- Runtime evidence.

## Hard boundaries

Do not:

- invent new engine capability to fill a UI hole;
- redesign the whole shell;
- undo `INK-UI-DEBT-001` single panel authority;
- create a new primary panel category unless MR_HOLD is raised with evidence;
- create duplicate History or Revision logic;
- create a second Geometry/Document/CHAT authority;
- add auto memory write;
- add remote research fetch/scrape;
- add autonomous agent recursion;
- change continuation max above 1;
- auto approve/execute;
- change FORMAT_VERSION;
- mutate package/ink-current;
- use TinyFish.

If an important expected workstation function is missing from engine source, mark it `ENGINE_NOT_PRESENT`; do not silently implement a new engine inside this integration task.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-006
BRANCH = work/ink-core-integration-006
GATE_A = WORKSTATION_CAPABILITY_MATRIX_COMPLETE
GATE_B = COMPLETED_CAPABILITIES_VISIBLE_AND_WIRED
GATE_C = CHAT_UI_AUTHORITY_RELATIONSHIP_CORRECT
GATE_D = WORKSTATION_HISTORY_REVISION_RELATIONSHIP_CORRECT
GATE_E = WORKSTATION_WEB_PORTABLE_PARITY_PASS
GATE_F = WORKSTATION_CAPABILITY_RUNTIME_PASS
UI_PANEL_AUTHORITY = SINGLE / PRESERVED
NEW_ENGINE_FEATURES = 0
TINYFISH_USED = 0
FORMAT_VERSION = 4
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Cross-lane hold — UI line

USER direction:

```text
UI_LANE = PAUSED
REASON = INK-CORE-INTEGRATION-006 is establishing authoritative workstation capability placement and UI-function mapping
STRUCTURAL_UI_WORK = HOLD
UI_REDESIGN = HOLD
PANEL_HIERARCHY_CHANGE = HOLD
BUGFIX_ONLY = ALLOWED IF BOUNDED AND NON-STRUCTURAL
RESUME_GATE = INK-CORE-INTEGRATION-006 MR closure + accepted UI × Capability Matrix
```

Until the resume gate, no independent UI workpack may redefine panel hierarchy, capability placement, contextual-control ownership, or workstation navigation.


## MR revision — Runtime harness closure required

Review of DEV handoff `08a719c0f8bfe903944eba95f43265a247d3e3ec`:

```text
SOURCE_DIFF = PASS
SOURCE_STATIC_QA = PASS
PRODUCT_WIRING_SCOPE = ACCEPTED
WORKSTATION_CAPABILITY_RUNTIME_PASS = NOT YET MET
MR_DECISION = REVISE
```

Bounded continuation only:

1. preserve current product wiring unless browser evidence finds a real defect;
2. extend the existing authoritative browser Runtime harness with Integration-006 assertions;
3. explicitly exercise Properties / Reference / Compose / CHAT / Revision capability routes;
4. verify read-only/unavailable states and single-panel authority;
5. do not create a GitHub-hosted task workflow;
6. do not run GitHub-hosted Actions for this revision;
7. DEV does not need to execute the self-hosted Runtime itself;
8. return new DEV_HANDOFF → STOP;
9. MR will run the promoted exact SHA through the existing self-hosted Windows Runtime.

No new engine features are authorized.

Gate remains:

`WORKSTATION_CAPABILITY_RUNTIME_PASS`
