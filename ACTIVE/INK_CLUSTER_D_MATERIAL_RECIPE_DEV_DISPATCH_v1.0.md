# INK Cluster D — Material / Recipe DEV Dispatch v1.0

DATE = 2026-10-03
ROLE = INK Cluster D Material / Recipe DEV
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
GITHUB = ONLY SSOT
STATUS = AUTHORIZED DEV PACKAGE
MERGE = NO
LIVE_DEPLOY = NO
FINAL_ACCEPTANCE = CHAT / Core / Live authority

## Read first

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`
- `ACTIVE/INK_LIVE_TEST_PROGRESS.md`
- `working/INK_LIVE_CLUSTER_D_MATERIAL_RECIPE_SOURCE_AUDIT_20261002.md`

Re-read latest main and current Material / Recipe authority before implementation. Check concurrent branches/PRs first.

## Objective

Close Cluster D reusable-creative-asset gaps without creating a second Material or Recipe system.

Current classification:

```text
Material engine = PRODUCT EXISTS
Material template/instance creation = PRODUCT EXISTS / CHAT EXPOSURE GAP
Fresh catalog = empty by design unless assets are installed/created
Recipe engine = PRODUCT EXISTS
FLORA PaintingRecipeRuntime = PRODUCT EXISTS / HISTORY-ATOMIC
CHAT-governed Recipe execution = INTEGRATION / EXPOSURE GAP
Creative Library Recipe reuse = READ-ONLY BY DESIGN until governed execution exists
```

## Branch

Create from latest main:

```text
work/ink-cluster-d-material-recipe-001
```

If another active owner already modifies the same Material/Recipe authority surface, STOP and record the conflict.

## Package D1 — Material creation / reuse

Preferred bounded operations:

```text
material.template.create.v1
material.instance.create.v1
```

Use the existing Material Library authority only.

Requirements:
- proposal → approval → execute;
- existing Document `materialLibrary`;
- existing History;
- strict native template validation;
- stable template / instance IDs;
- no arbitrary executable expressions;
- committed material must be rediscoverable through Creative Library.

Initial qualification must use one genuine supported semantic:
- compatible reusable Path fill/stroke appearance; or
- an existing validated geometry Material template when the case genuinely requires instance reuse.

Do not seed unrelated assets merely to make search non-zero.
Do not claim rich Path Material rendering beyond current native semantics.

## Package D2 — Recipe inventory

Add a read-only bridge over existing recipe registries where needed.

Possible sources:
- Studio `RecipeEngine.list()`;
- page-stored FLORA recipes already indexed by Creative Library.

Inventory is discovery only. It does not by itself close C55 and must not imply executable reuse.

## Package D3 — CHAT-governed Recipe execution

Expose **one existing Recipe authority**, not a new common engine.

Choose after current-source audit:
- generic Studio RecipeEngine for pre-registered recipes; OR
- FLORA `PaintingRecipeRuntime` for validated painting recipes.

Do not merge the two schemas into a synthetic third Recipe model in v1.0.

Requirements:
- explicit recipe identity;
- explicit stable inputs / target region when required;
- native schema validation;
- proposal / user-governed approval;
- existing History / rollback authority;
- structured execution receipt;
- replay / checkpoint receipt where the chosen engine provides it;
- stored recipe becomes Creative Library discoverable where native persistence supports it.

If truthful governed exposure requires a new cross-engine architecture, STOP and return the architecture conflict instead of inventing it.

## Qualification

At minimum:

1. prove fresh-document zero-result Creative Library behavior is expected;
2. create/install one valid material using native authority;
3. Creative Library rediscovery;
4. apply/create one material instance or compatible appearance;
5. Preview + History + Undo / Redo;
6. expose one existing recipe inventory;
7. execute one existing recipe through the chosen governed authority;
8. verify History / rollback / replay receipt as applicable;
9. verify stored recipe rediscovery when applicable;
10. rerun relevant C001 / C002 / C007 / C008 / C013 C39/C55 subsets;
11. run affected existing CHAT regressions.

Tool-call success alone is not PASS.

## Evidence / return

Record:
- latest-main base SHA;
- exact candidate SHA;
- changed files;
- which native Material and Recipe authorities were reused;
- why the selected Recipe engine is the truthful first governed route;
- browser evidence;
- History / rollback / Undo / Redo evidence;
- Creative Library rediscovery evidence;
- remaining semantic limits.

Create branch-local return under `working/` and evidence under `qa/evidence/`.

## Hard boundaries

Do not touch:
- External Workflow Translation / Workflow IR R&D;
- B3 Raster / masks;
- Cluster C Layout/Page/Artboard;
- C019 Text Warp;
- New Document architecture;
- UI work;
- History redesign;
- FORMAT_VERSION.

External Actions / Skills / Workflow IR may later feed Recipe authority, but cannot be used to disguise the current C55 gap.

## Completion gate

```text
current source audit
→ native Material/Recipe authority selected
→ bounded CHAT route
→ exact candidate
→ focused QA + affected regressions
→ branch-local return/evidence
→ STOP → CHAT / Core / Live authority
```

Do not merge to main.
Do not deploy to `thedoorw/INK`.
Do not claim Formal Live closure.
