# INK CURRENT WORK ORDER

STATUS: `INK-WEB-UI-003 / UR_AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-WEB-UI-003` |
| TITLE | `Contextual Controls / Top Options v0.1` |
| AUTHORITY | `UR_DELEGATED_UI_LANE` |
| DEV_WORK_BRANCH | `work/ink-web-ui-003` |
| BASE_MAIN | `73b54efe6d7db1f9fd15531603056c82e4c9de1e` |
| DEV_MODE | `BOUNDED_UI_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / UI_ONLY` |
| UI_SHELL | `PORTABLE_WEB_SHARED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| CORE_MUTATION | `PROHIBITED` |
| RUNTIME_QA | `DEFERRED_TO_UI_INTEGRATION_BATCH` |

## Objective

Complete the next bounded UI convergence stage:

```text
current active tool / selection
→ one quiet contextual options surface near the top
→ high-frequency controls immediately reachable
→ advanced/specialist controls remain on-demand
→ canvas remains visually dominant
```

This is a UI exposure/re-layout task only. Existing command behavior and product semantics remain authoritative.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this branch-local Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
8. current shared shell files required by the task

## Current source facts to preserve

Current shell already contains:

- compact left tool rail;
- top application/document bar;
- floating `#quickControls`;
- floating `#selectionBar`;
- right inspector Tool tab with drawing/eraser/shape/text controls;
- shared Web/Portable entry shells;
- Portable/Web parity guard.

Relevant existing command-bearing IDs and bindings must be preserved whenever practical.

## Required UI behavior

### A — Contextual top-options host

Create one shared contextual options surface logically below / adjacent to the application top bar.

Rules:

- visible content follows the current tool or selection state;
- the row must not become a second permanent dense toolbar;
- show only high-frequency controls/actions;
- specialist/advanced settings remain in an on-demand inspector/panel/popover;
- canvas-first geometry must remain intact;
- avoid overlapping canvas controls where the top options row can replace them.

Gate: `CONTEXTUAL_OPTIONS_HOST_WORKS`

### B — Drawing tools

For Pen / Pencil / Marker / Brush / Airbrush:

- expose current tool identity;
- expose high-frequency Color / Size / Opacity;
- retain existing brush preset access;
- keep Smoothing / Pressure and brush-engine dynamics available without permanently occupying the top row;
- do not change brush/render semantics.

Prefer reuse of existing bound controls/state over introducing duplicate independent state.

Gate: `DRAW_CONTEXT_OPTIONS_WORK`

### C — Eraser / Shape / Text

Eraser:
- size plus existing eraser mode access.

Shape:
- geometry type;
- fill toggle;
- existing shared color/stroke controls where applicable.

Text:
- font family;
- font size;
- existing color state.

Do not change object creation semantics.

Gate: `TOOL_CONTEXT_OPTIONS_WORK`

### D — Selection context

When a selection exists, the same contextual surface may expose the existing high-frequency selection actions:

- duplicate;
- group;
- front;
- horizontal center;
- delete.

Detailed object/path/stroke transforms and editing controls stay in the Object inspector. Do not alter selection, grouping, History, geometry, transform, or object semantics.

The existing floating `#selectionBar` may be removed, hidden, or absorbed only if the same command reachability is preserved.

Gate: `SELECTION_CONTEXT_OPTIONS_WORK`

### E — Portable / Web shared shell

Any structural UI change must be applied consistently to:

- `product/source/index.html`
- `product/source/index-standalone.html`

Shared CSS/coordinator changes must remain common where possible.

Run the existing Portable/Web shell parity guard. If a new contextual-region invariant is introduced, extend the parity test so Web-only drift fails deterministically.

Gate: `PORTABLE_WEB_CONTEXT_PARITY_WORKS`

## Candidate files

Expected UI-only scope may include:

- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- only existing UI binding/source modules strictly necessary to preserve current controls
- focused UI/parity unit/static tests
- `research/INK_WEB_UI_003_CONTEXTUAL_CONTROLS_REPORT_v0.1.md`

Do not touch unrelated Core modules.

## Hard boundaries / STOP

Immediately STOP and mark `INTEGRATION_REQUIRED` if implementation requires changing:

- Document authority / schema / migration;
- History semantics;
- Revision semantics;
- Recipe or Geometry contracts;
- renderer / WebGL / Canvas engine;
- Core module contracts;
- persistence semantics;
- product base version;
- package/certification;
- another lane's owned implementation.

Moving/re-hosting existing controls and adding UI-only presentation/wiring is allowed. Changing what the commands mean is not.

## Source/static acceptance

Before DEV_HANDOFF:

- parse/import/static checks for changed UI sources PASS;
- existing shared Portable/Web parity test PASS;
- focused contextual-options test/static contract PASS;
- both Web and Portable contain the same shared contextual structure;
- left tool rail remains compact;
- right inspector remains reachable;
- Layers / History / CHAT / Reference / Compose / Revision remain reachable;
- existing command-bearing IDs are preserved or any necessary UI-only rewiring is explicitly documented;
- no document/History/Revision/Core semantic files changed;
- `FORMAT_VERSION = 4`;
- product base version remains `v0.1`;
- no package mutation;
- full browser Runtime not claimed unless actually executed.

Final source gate:

`CONTEXTUAL_TOOL_OPTIONS_WORK`

## Evidence

Create/update:

`research/INK_WEB_UI_003_CONTEXTUAL_CONTROLS_REPORT_v0.1.md`

Include:

- before/after control-placement inventory;
- files changed;
- binding/ID preservation notes;
- Portable/Web parity evidence;
- tests/checks executed;
- deferred Runtime statement;
- any `INTEGRATION_REQUIRED` finding.

## DEV discipline

At each meaningful checkpoint:

- commit;
- update branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- record exact HEAD;
- record files changed;
- record checks actually run;
- do not merge `main`;
- do not start UI-004.

## Completion / STOP

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-003
BRANCH = work/ink-web-ui-003
GATE = CONTEXTUAL_TOOL_OPTIONS_WORK
FORMAT_VERSION = 4 / PRESERVED
PRODUCT_BASE_VERSION = v0.1 / PRESERVED
PORTABLE_WEB_PARITY = PASS
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
