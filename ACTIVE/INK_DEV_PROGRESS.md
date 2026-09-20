# INK DEV PROGRESS

STATUS: `INK-CLOUD-008A / IN_PROGRESS / PHASE_E_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-008A` |
| TITLE | `Path Editing Core v0.1` |
| BRANCH | `work/ink-cloud-008a` |
| BASE_MAIN | `1c29d4e1eee2158678b5cc351b673717fdd5c15e` |
| LAST_CODE_CHECKPOINT | `aa0d37a52753a2b3ea1a5a00b914a4753db0c37a` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `EDITABLE_PATH_CORE_WORKS` |
| EXPRESSIVE_STROKE | `NOT_STARTED / OUT_OF_SCOPE` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Path edit state and selection contract
2. Phase B — Anchor and Bézier handle editing
3. Phase C — Topology editing
4. Phase D — Simplify / refine
5. Phase E — History / serialization / regression evidence
6. Phase F — report + DEV handoff

## Accepted baseline

INK-CLOUD-007 is promoted to main and provides:

```text
Reference → Extract → authoritative editable INK Path
```

008A reuses existing vector primitives, object identity, History, serialization and SVG.

## Phase A checkpoint

Status: `COMPLETE`

Implemented:

- reusable `PathEditController` in `product/source/src/editor/path-edit.js`;
- enter/exit path edit mode using stable existing Path object IDs;
- single/multi anchor selection and handle-selection state;
- selection-only actions do not mutate document geometry or create History entries;
- busy-History, stale document/page, missing Path, hidden/locked and singular-transform guards;
- finite geometry and anchor-mode validation;
- shared editor export and bounded app installation through existing `InkApp`.

Code commits:

- `90b2269de1e077c874f6d8a4fb39d2f006a1f6e2` — path edit state contract;
- `35a8ebbd355ec5d04c0e4f76c97a22e08afc0982` — editor export;
- `d31cabeae2bdb3363776afdd2cb6acf2162c94f2` — app installation.

No schema/FORMAT_VERSION change. No package/main mutation. Expressive Stroke not started.

## Phase B checkpoint

Status: `COMPLETE`

Implemented through existing vector primitives and scoped History:

- move one or multiple selected anchors;
- direct local anchor reshape;
- select and move incoming/outgoing Bézier handles;
- corner / smooth / symmetric anchor modes;
- all geometry mutations validate finite input/output;
- Path object ID and metadata/provenance are invariant across edits;
- no-op geometry writes rely on existing History diffing and do not create corrupt entries.

Code checkpoint:

- `bf9c61c1b7f0606fec95e98213485527fd65eb69` — anchor / handle / mode editing.

No second vector or History engine introduced.

## Phase C checkpoint

Status: `COMPLETE`

Implemented:

- exact De Casteljau anchor insertion on existing cubic/linear segments;
- topology-local deletion using the existing `deleteAnchor` primitive;
- closed paths protect a minimum of 3 anchors;
- open paths protect a minimum of 2 anchors;
- open/close transition with minimum geometry validation;
- outer/hole subpath roles are validated and never rewritten by node edits;
- invalid/non-finite geometry is rejected;
- ordinary topology edits mutate the existing Path object and preserve stable Path ID/metadata.

Code checkpoint:

- `1650de71d155be19f07c2f4f7fc1d3710ef69619` — topology editing.

## Phase D checkpoint

Status: `COMPLETE`

Implemented deterministic bounded cleanup:

- `simplify({ tolerance, handleTolerance, maxPasses })` removes only near-collinear low-handle anchors;
- `refine({ maxControlLength, maxAddedAnchors })` bisects long Bézier segments exactly with bounded node growth;
- both operations return before/after node-count diagnostics and explicit settings;
- closed/open state, subpath roles, Path identity and metadata/provenance are preserved;
- no rasterization, flattening or benchmark-specific tuning.

Code checkpoint:

- `14beb5f2f4ddf7fadcda76358cfa468cae72d5aa` — bounded simplify/refine.

## Phase E checkpoint

Status: `COMPLETE`

Integration added:

- existing Renderer now displays authoritative `type: 'path'` through existing vector-core `tracePath/pathBounds/flattenSubpath`;
- direct Path anchor/handle overlays and segment hit-testing;
- continuous pointer drag uses existing History begin/commit transaction and existing vector primitives;
- bounded inspector controls mirrored in both `index.html` and `index-standalone.html`;
- Path edit module added to the existing service-worker shell cache;
- `path-editing-core` exposed in architecture diagnostics.

Regression files:

- `qa/core/tests/unit/path-editing-core-v0.1.test.mjs`;
- `qa/core/tests/unit/path-editing-source-v0.1.test.mjs`.

Executed evidence:

- latest Path editor source syntax parse: PASS;
- latest `ink.js` source syntax parse: PASS;
- core regression source syntax parse: PASS;
- source wiring regression syntax parse: PASS;
- FORMAT_VERSION remains 4: PASS;
- both HTML shells contain all Path edit controls: PASS;
- service-worker caches `src/editor/path-edit.js`: PASS;
- no Expressive Stroke implementation in Path core/source integration: PASS;
- isolated Path-edit domain harness: PASS for multi-anchor move, exact undo/redo, symmetric handle, exact segment insertion, ID/provenance preservation, open/closed minimum guards, simplify and refine.

Authored but not executed in the full repo/browser runtime:

- Node product regression suite;
- real file-envelope/migration execution;
- browser pointer/runtime interaction.

Reason: repository checkout/runtime execution is unavailable in this DEV environment and GitHub Actions quota is exhausted. These remain `NOT_EXECUTED / RUNTIME_QA_DEFERRED`, not PASS.

Branch compare against `1c29d4e1eee2158678b5cc351b673717fdd5c15e` shows only authorized source/QA/progress files; no package mutation. Main remains at the authorized base during this checkpoint.

Candidate code/QA HEAD:

`aa0d37a52753a2b3ea1a5a00b914a4753db0c37a`

## QA state

Phase-A source implementation reviewed against existing hierarchy/History/vector contracts.

Executable branch unit/static evidence will be added in Phase E. Browser/runtime interaction remains `RUNTIME_QA_DEFERRED`.

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-008a`.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not start Expressive Stroke.
- Do not run rose-window benchmark.
- Do not begin 008B or later tasks.
- STOP for FORMAT_VERSION change, accepted contract break, second core engine, broad UI redesign or scope expansion.

## Next

`BEGIN_PHASE_F / REPORT_AND_DEV_HANDOFF`
