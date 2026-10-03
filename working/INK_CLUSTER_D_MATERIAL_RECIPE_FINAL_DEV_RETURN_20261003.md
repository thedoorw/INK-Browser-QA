# INK Cluster D — Material / Recipe DEV Return

Status: **DEV_COMPLETE — AWAITING CHAT / CORE / LIVE AUTHORITY REVIEW**

## Identity

- Repo: `thedoorw/INK-Browser-QA`
- Branch: `work/ink-cluster-d-material-recipe-001`
- Dispatch base main: `b6f837643064100b04cad12e338db782709ce255`
- Latest main reconciled before final qualification: `b0bd825a8d8ce97763ec45046219ce78f799b4ed`
- Exact browser-qualified candidate: `da40f868ebdb17c6cacb46d74867f75235ba77e5`
- Post-qualification latest main integrated: `9c5915eaf9a67149e94cad7dc6e87552609e4de3` (evidence-only `working/INK_LIVE_CHAT_RESULT.json`; no product/QA delta)
- Draft PR: #154
- FORMAT_VERSION: `4` — unchanged
- Merge to main: **NO**
- Deploy: **NO**

## Authority selection

Cluster D reuses existing native authorities only.

Material:
- `product/source/src/material/material-library.js`
- existing Document `materialLibrary`
- existing `createMaterialTemplate()` / `createMaterialInstance()`
- existing Path Material route `path.material.apply.v1`
- existing History / Renderer

Recipe:
- existing Studio `RecipeEngine` from `product/source/src/recipe/recipe-engine.js`
- installed by existing `product/source/src/studio-core.js`
- selected first governed route: pre-registered `ink.flower.common.v1` / **Adaptive Flower Finish**

The Studio RecipeEngine is the truthful first D3 route because it already owns a registered recipe inventory, native schema, execution, replay report and checkpoints. No Studio/FLORA schema merger or third Recipe model was created.

## D1 — Material creation / reuse

Added bounded CHAT operations:

- `material.template.create.v1`
- `material.instance.create.v1`

Both use the existing proposal → approval → execute lifecycle.

Verified behavior:
- fresh Document material/recipe Creative Library result is zero by design;
- proposal validation is mutation-neutral;
- native template validation is retained;
- arbitrary executable `$...` tokens are rejected; only existing native `$param` / `$calc` material tokens are accepted;
- stable template/version and instance identity are explicit;
- committed template is rediscoverable through existing Creative Library;
- native instance creation uses existing Material geometry realization;
- compatible Path fill/stroke appearance reuses existing `path.material.apply.v1`;
- Preview changes visibly;
- History + exact Undo / Redo pass.

A bounded renderer integration defect was also closed in the existing Studio renderer override: the existing vector renderer is now passed the active Document so native Path Material lookup can resolve the already-stored template. No second Renderer or Material engine was added.

## D2 — Recipe inventory

Added read-only named tool:

`get_ink_recipe_inventory`

Capability:

`recipe.inventory`

It reads:
- current Studio `RecipeEngine.list()/describe()`;
- existing page-stored FLORA recipe identities where present.

It does not register, import, translate, approve or execute recipes. FLORA stored recipes remain discovery-only in this package.

## D3 — governed existing Recipe execution

Added bounded operation:

`recipe.studio.execute.v1`

Requirements enforced:
- explicit registered recipe id;
- exact recipe version;
- explicit stable native Path targets;
- one explicit role binding per target;
- existing recipe parameter schema type/range/enum validation;
- proposal → approval → execute;
- existing History transaction;
- structured execution receipt;
- replay receipt and checkpoint receipt;
- exact failure rollback.

Two existing-engine integration repairs were required for truthful governed execution:
1. Recipe `layer` steps move the target Path into the destination layer instead of retaining the same object in two layers.
2. Recipe failure rollback uses existing `replaceDocument(..., { fromHistory:true, skipSanitize:true })` so the engine restores its exact pre-run Document without clearing the surrounding CHAT History transaction.

The outer CHAT transaction then clears its pending state after native rollback; no History redesign was introduced.

## Exact candidate browser QA

PASS against:

`da40f868ebdb17c6cacb46d74867f75235ba77e5`

- Workflow run: `37116951905`
- Job: `111185489317`
- Artifact: `11271832120`
- Artifact digest: `sha256:909218129dad5d4645eec625c19ab5f8c84ed68d0c79a303e36a3e11e59da027`
- Runtime API ready: true
- Tool count: 24
- App version: 0.1

D qualification PASS:
- C001 / C002 / C007 / C008 / C013
- C39 / C55 family coverage
- fresh zero-result behavior;
- native Material creation;
- Creative Library rediscovery;
- Material instance create + Undo / Redo;
- Path Material apply + Preview + Undo / Redo;
- arbitrary Material token rejection;
- read-only Recipe inventory;
- registered Recipe identity/version discovery;
- invalid Recipe parameter range rejection;
- governed Recipe execution;
- one replay checkpoint;
- atomic History;
- exact Undo / Redo;
- forced Recipe failure with native rollback receipt and exact Document restoration;
- no second Material engine;
- no second Recipe engine;
- Workflow IR unused.

Stored Recipe rediscovery is **not applicable** to this selected D3 route: `ink.flower.common.v1` is an already-registered Studio runtime recipe, not a new page-persisted FLORA recipe. This limitation is recorded rather than manufacturing persistence.

## Regression result

All PASS on the exact candidate:

- C2 `align-distribute-c2`
- C1 `page-ops-c1`
- B4 `path-deformation-b4`
- A2 `stroke-create-a2`
- B2 `raster-stack-adjustment-b2`

Detailed evidence:
- `qa/evidence/cluster-d-material-recipe-20261003/D_BROWSER_QA_EVIDENCE.json`
- `qa/evidence/cluster-d-material-recipe-20261003/D_SOURCE_CANDIDATE_QA_REQUEST.json`

Temporary branch-only browser routing/workflow was removed after evidence capture. The focused deterministic Cluster D contract test remains:
- `qa/ink-cluster-d-material-recipe-001.test.mjs`

## Latest-main reconciliation

Main advanced during DEV. Before final qualification, current main `b0bd825a8d8ce97763ec45046219ce78f799b4ed` was merged into the DEV branch with manual resolution limited to the two shared CHAT integration files:

- `product/source/src/agent/capability-registry.js`
- `product/source/src/editor/chat-bounded-edit.js`

Current Cluster C Artboard and C019 Text Path semantics from main were preserved. After reconciliation GitHub reported:

- behind main: `0`
- merge base: `b0bd825a8d8ce97763ec45046219ce78f799b4ed`

The reconciled candidate then passed the final browser qualification and regressions above.

After qualification, main advanced once to `9c5915eaf9a67149e94cad7dc6e87552609e4de3` only by updating `working/INK_LIVE_CHAT_RESULT.json`. That evidence-only commit was integrated into this DEV branch after qualification. Cluster D product and QA candidate bytes were unchanged, so the exact browser-qualified product candidate remains `da40f868ebdb17c6cacb46d74867f75235ba77e5`.

## Product changes

Cluster D product authority changes only:

- `product/source/src/agent/capability-registry.js`
- `product/source/src/agent/public-creative-api.js`
- `product/source/src/editor/chat-bounded-edit.js`
- `product/source/src/recipe/recipe-engine.js`
- `product/source/src/studio-core.js`

## Remaining semantic limits

- Path Material qualification is intentionally limited to current native fill/stroke appearance semantics.
- Rich Material effects are not claimed.
- D3 executes existing registered Studio recipes only; inline Recipe definitions are prohibited.
- FLORA PaintingRecipeRuntime remains a separate existing authority and was not merged into Studio RecipeEngine.
- Page-stored FLORA recipes remain inventory/discovery only in this package.
- External Actions / Skills / Workflow IR translation is outside scope.
- No Recipe persistence model was invented to force a Creative Library stored-recipe PASS.

## Boundary check

Not touched:
- B3 Raster / masks
- Cluster C product authority
- C019 product authority
- New Document
- UI
- External Workflow Translation / Workflow IR R&D
- History redesign
- FORMAT_VERSION
- Live repo / deployment

## STOP

DEV work is complete.

**STOP → CHAT / Core / Live authority.**

Authority owner must independently review PR #154, select/accept the exact source candidate, merge only if accepted, perform exact-SHA deployment if authorized, and execute Formal Live closure. This DEV does not self-merge or self-deploy.
