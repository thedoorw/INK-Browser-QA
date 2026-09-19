# INK DEV PROGRESS

STATUS: `DEV_IN_PROGRESS`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-005` |
| AUTHORIZED_SCOPE | `COMPONENT / INSTANCE DATA MODEL FOUNDATION` |
| DEV_STATE | `IMPLEMENTATION_CHECKPOINT` |
| MR_GATE | `REQUIRED_AFTER_HANDOFF` |
| DEV_WORK_BRANCH | `work/ink-cloud-005` |
| BASE_BRANCH_HEAD_AT_START | `2ed1e9cbb4b77ac38b0c6798b8d75691f5325f46` |
| LATEST_DEV_COMMIT | `c0ed73c3382ab4d9f9acd0710125c81ee8cdc198` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION_CHANGE | `UNDECIDED / MR_GATE_IF_REQUIRED` |

## Baseline

Accepted INK-CLOUD-004 was promoted to main at:

`37418ab7f6b994425126e73c60810401d5e6e826`

This branch starts from the new INK-CLOUD-005 control baseline:

`2ed1e9cbb4b77ac38b0c6798b8d75691f5325f46`

## Authorized objective

Implement only the bounded Component / Instance data-model foundation defined in:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Primary structural goals:

- stable Component-definition identity;
- stable source-node identity;
- linked Instance reference model;
- minimum override envelope;
- deterministic detach;
- broken-reference / cycle safety;
- existing History integration;
- native serialization/migration/integrity;
- preserve accepted Frame / Group / Transform contracts.

## Required progress rule

Commit meaningful checkpoints and update this file continuously with:

- checkpoint SHA;
- files changed;
- model/schema decisions;
- checks actually executed;
- checks not executed;
- known gaps;
- any FORMAT_VERSION concern.

If a format-version bump appears necessary:

`STOP and request MR decision before changing FORMAT_VERSION.`

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-005
BRANCH = work/ink-cloud-005
FINAL_HEAD = <exact SHA>
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

## Checkpoint 1 — design

GitHub work branch checked out at `c0a0e441c1b699398167a8559b72af750ba496a8`. Required README/AGENTS/current order/status/progress, named governance and accepted 001–004 reports read; source model, migration, integrity, hierarchy, History, renderer/studio/SVG/spatial paths inspected.

Proposed additive optional document registry referencing ordinary Frame/Group roots; atomic instance objects contain definition ID and serialized source-ID opacity overrides, never persistent resolved children. Resolution feeds the existing renderer/bounds/SVG paths. Nested instances explicitly rejected. No FORMAT_VERSION modification planned; compatibility to be verified.

Executed: remote branch lookup, clean checkout and source inspection. No implementation tests yet. Browser Runtime QA remains DEFERRED.

## Checkpoint 2 — model and editor integration

Previous published checkpoint: `c0ed73c3382ab4d9f9acd0710125c81ee8cdc198`.

Added optional `INK-COMPONENTS-1` registry, source-ID opacity overrides, resolution diagnostics, atomic History commands (register/create/override/reset/detach/duplicate/repair). Existing renderer, bounds, hit/SVG and spatial paths consume disposable ordinary geometry. Integrity warnings preserve broken data for repair. Guarded existing hierarchy traversal against repeated object references.

Files: `document/components.js`, `document/{hierarchy,index,integrity}.js`, `ink.js`, `studio-core.js`, new `qa/core/tests/unit/component-instance-v0.1.test.mjs`.

Actually executed: syntax checks (components, ink, studio); existing Frame/Group/Transform Node tests **24/24 PASS**; new component model + actual editor method tests **15/15 PASS**. Test harness initially needed DOM boot isolation and the correct InkStore key/value signature; corrected and rerun. No browser runtime run. Remaining: bounded edge-case hardening, compatibility suite and report.
