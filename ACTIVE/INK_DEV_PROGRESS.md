# INK DEV PROGRESS

STATUS: `INK-CLOUD-013 / DEV_IN_PROGRESS / PHASE_A`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-013` |
| TITLE | `Integrated Creative Loop Validation v0.1` |
| BRANCH | `work/ink-cloud-013` |
| BASE_MAIN | `4de2a4324c318abebab6a3fb1dcd096b7d0ac78a` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `INTEGRATED_CREATIVE_LOOP_VALIDATED` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| START_HEAD | `9721e8b4a51f9642dfd4f4aea9eef02360446001` |
| LATEST_CHECKPOINT | `PHASE_C_SAVE_LOAD_CLOSURE_COMPLETE` |

## Authorized sequence

1. Phase A — integrated deterministic fixture
2. Phase B — cross-stage invariants
3. Phase C — save/load integrated closure
4. Phase D — rose-window hard integrated benchmark
5. Phase E — bounded fixes + regression
6. Phase F — report + DEV handoff

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-013`.
- Validation-first; bounded cross-stage fixes only.
- Do not add a broad new feature family.
- Preserve existing Path/document/History/Revision/CHAT authorities.
- Use deterministic non-image fixture for the integrated harness.
- Run rose-window hard benchmark only if the registered fixture is available.
- Fixture unavailable => record `HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE` and continue.
- Do not redesign workspace UI.
- Do not start multi-step CHAT planner/agent work.
- Do not update package.
- Do not merge main.
- Do not change FORMAT_VERSION without STOP.

## Start state

`DEV_IN_PROGRESS / PHASE_A`

## Required reads completed

- `README.md`
- `AGENTS.md`
- `ACTIVE/README.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/WORKING_STATUS.md`
- `ACTIVE/INK_DEV_PROGRESS.md`
- `ACTIVE/INK_DEV_NEW_WINDOW_START.md`
- `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
- `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
- `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
- `research/INK_REVISION_CLOSURE_REPORT_v0.1.md`
- `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`

## Validation-first baseline

Relevant accepted-stage unit suites were executed together before the integrated
harness was added.

```text
node --test \
  qa/core/tests/unit/extraction-core-v0.1.test.mjs \
  qa/core/tests/unit/extraction-structure-v0.1.test.mjs \
  qa/core/tests/unit/path-editing-core-v0.1.test.mjs \
  qa/core/tests/unit/expressive-stroke-core-v0.1.test.mjs \
  qa/core/tests/unit/multi-contour-composition-core-v0.1.test.mjs \
  qa/core/tests/unit/repaint-material-core-v0.1.test.mjs \
  qa/core/tests/unit/repaint-material-composition-v0.1.test.mjs \
  qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs \
  qa/core/tests/unit/revision-closure-core-v0.1.test.mjs \
  qa/core/tests/unit/revision-chat-binding-v0.1.test.mjs
```

Result: `39 PASS / 6 FAIL / 45 TOTAL`.

The six failures are pre-existing cross-suite contract assertions:

- four file-roundtrip assertions compare all metadata even though current
  migration adds the accepted semantic default `semanticLabel`;
- two History assertions expect an absent expressive-stroke property even
  though `createPath()` represents the initial no-style state as `null`.

No product source has been changed. Phase A will use contract-specific
identity/provenance assertions and will retain these baseline failures for
bounded Phase E reconciliation.

## Fixture intake checkpoint

The available user attachment is a horse ink painting, not the registered rose
window reference. Repository search found the benchmark specification but no
canonical rose-window binary. Phase D must therefore record:

`HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE`

## Phase A — integrated deterministic fixture

Checkpoint base: `e9130bfdc643a7854fd67fef006709f40312a8f0`

Added:

- `qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs`

The deterministic non-image contour fixture now traverses:

```text
Extract → editable Path → anchor Edit → Expressive Stroke
→ Multi-Contour Compose → Repaint / Material
→ CHAT proposal / approval / mutation → Revision
```

The fixture runs twice and proves equal final document and Revision
fingerprints. It does not require browser image decoding, a remote service, a
second document engine, or a second History/Revision authority.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.

## Phase B — cross-stage invariants

Checkpoint base: `6422f0f3adb7efe7fa70246e3c166d704120068a`

The integrated fixture now proves:

- extracted object, subpath and anchor IDs remain stable;
- extraction provenance remains exact;
- geometry remains editable after Stroke, nested Frame composition, Repaint,
  Material, CHAT mutation and Revision restore;
- geometry fingerprints do not change during appearance-only stages;
- nested composition parentage survives Revision restore;
- same-Revision CHAT target bindings reject a structural reparent with
  `CHAT_EDIT_TARGET_STALE`;
- cross-Revision CHAT bindings reject with `CHAT_EDIT_STALE_REVISION`;
- Revision restore clears existing undo/redo as `RESET_TO_REVISION` and the
  restored structured Path immediately supports new undo/redo edits.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.

## Phase C — save/load integrated closure

Checkpoint base: `e42a8ae16e0be1f95b4820b15588926ff43dd94b`

Validated three integrated persistence points:

1. immediately after Extract → Path;
2. after nested composition, Repaint / Material and CHAT mutation;
3. after Revision restore.

Each point exercises native file-envelope integrity, JSON serialization,
unwrap/migration and structural inspection. The after-CHAT point also exercises
the existing `InkStore` verified browser-local storage envelope and recovery
validation. IDs, extraction provenance, editable subpaths, nested composition,
appearance extensions and `FORMAT_VERSION = 4` remain intact.

Executed:

```text
node --test qa/core/tests/unit/integrated-creative-loop-v0.1.test.mjs
```

Result: `3 PASS / 0 FAIL`.
