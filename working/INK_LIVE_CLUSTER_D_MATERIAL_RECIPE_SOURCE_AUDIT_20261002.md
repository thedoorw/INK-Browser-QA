# INK Live Cluster D — Material / Recipe Source Audit — 2026-10-02

TYPE = SOURCE AUDIT / LIVE GAP CLASSIFICATION
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_DEPLOYED_SOURCE = 66cdb5b4ddc322a2b1027cab2627426f868027d3
CASES = C001 / C002 / C007 / C008 / C013
FAMILIES = C39 Material / C55 Recipe

## Result

Cluster D is not a missing-engine problem.

```text
CREATIVE LIBRARY SEARCH = WORKING AS DESIGNED
FRESH MATERIAL DOCUMENT CATALOG = EMPTY BY DEFAULT
MATERIAL TEMPLATE / INSTANCE ENGINE = PRODUCT EXISTS
VALIDATED FLOWER MATERIAL TEMPLATE SET = PRODUCT EXISTS / NOT BOOTSTRAPPED INTO FRESH DOCUMENT
PATH MATERIAL APPLY = CHAT-EXPOSED / CATALOG-DEPENDENT / LIMITED RENDER SEMANTICS
FRESH RECIPE DOCUMENT CATALOG = EMPTY BY DEFAULT
GENERIC RECIPE ENGINE = PRODUCT EXISTS / NOT CHAT-GOVERNED
BUILT-IN COMMON_FLOWER_RECIPE = PRODUCT EXISTS / STUDIO-LOCAL REGISTRY
FLORA PAINTING RECIPE RUNTIME = PRODUCT EXISTS / HISTORY-ATOMIC / NOT CHAT-EXPOSED
CREATIVE LIBRARY RECIPE REUSE = INTENTIONALLY READ_ONLY
```

Therefore the Round 1 zero-result searches are expected for a fresh document. The repair problem is catalog bootstrap / creation / governed execution exposure, plus a bounded material-rendering semantic limitation; not a new Material or Recipe engine.

## Creative Library search behavior

`product/source/src/agent/creative-library-search.js` searches current Document state only.

Material candidates come from:

```text
document.materialLibrary.templates
```

Recipe candidates come from:

```text
page.floraRecipeState.recipes
```

A fresh `defaultDocument()` initializes:

```text
materialLibrary.templates = []
ai.recipes = []
```

and a fresh page has no `floraRecipeState` until a FLORA painting recipe has been executed.

Therefore:

```text
search_ink_library(type=material) → 0
search_ink_library(type=recipe) → 0
```

is not a search bug.

## Material engine exists

`product/source/src/material/material-library.js` already owns:
- `ensureMaterialLibrary()`;
- `createMaterialTemplate()`;
- `installMaterialTemplates()`;
- `createMaterialInstance()`;
- `updateMaterialInstance()`;
- `updateMaterialTemplate()`;
- `detachMaterialInstance()`;
- material instance listing/reporting;
- stable template/instance IDs;
- parameter validation;
- geometry realization;
- repeat-source synchronization.

This is a real reusable material system.

Disposition: do not create another material catalog or instance model.

## Validated built-in templates exist but are not fresh-document assets

`product/source/src/material/flower-batch-01.js` provides:

```text
FLOWER_BATCH_01_TEMPLATES = 10 validated templates
```

including petal, leaf, center, stem, bud and calyx geometry families.

They are installable through `installFlowerBatch01Templates(document)`.

However:
- they are not installed by `defaultDocument()`;
- current fresh-document Creative Library therefore correctly returns zero;
- they are flower geometry templates, not a general-purpose poster/material catalog.

Do not globally bootstrap these 10 assets merely to make C39 search non-zero unless the tested case actually needs those material-instance semantics.

## Path material apply boundary

CHAT already exposes:

```text
path.material.apply.v1
path.material.remove.v1
```

The native path appearance contract stores a material reference and resolves the referenced document template.

Current `resolvePathPaintAppearance()` only recognizes template `pathAppearance` keys:

```text
fill
stroke
```

Other appearance keys are reported as unsupported, and parameter overrides are currently reported as ignored by this path rendering route.

The validated Flower Batch templates are geometry templates and do not provide the general rich Path material rendering implied by a broad "Material" label.

Therefore:

```text
PATH MATERIAL APPLY = REAL BUT SEMANTICALLY BOUNDED
FRESH GENERIC PATH MATERIAL CATALOG = ABSENT
RICH PATH MATERIAL EFFECTS = NOT PROVEN BY EXISTING path.material.apply.v1
```

C39 must not be closed merely by populating any arbitrary template.

## Material gap classification

For Round 1:

```text
MATERIAL ENGINE = PRODUCT EXISTS
MATERIAL TEMPLATE CREATION = PRODUCT EXISTS / NOT CHAT-EXPOSED
FRESH REUSABLE CATALOG = ASSET / BOOTSTRAP GAP
PATH MATERIAL REUSE = CHAT-EXPOSED BUT REQUIRES COMPATIBLE TEMPLATE
RICH PATH MATERIAL RENDERING = PRODUCT SEMANTIC LIMIT / CASE-DEPENDENT
```

Smallest repair must be chosen by case need:
1. if a case only needs reusable fill/stroke styling, create/install validated compatible `pathAppearance` templates through the existing material library;
2. if a case needs reusable geometry assets, expose existing material-template / material-instance authority;
3. if a case needs richer texture/shader semantics, use the existing Raster/Effects authorities where appropriate or treat richer Path material rendering as a separate product enhancement.

## Generic Recipe Engine exists

`product/source/src/recipe/recipe-engine.js` provides:
- role-schema registry;
- recipe validation;
- `registerRecipe()`;
- `list()`;
- `describe()`;
- execution;
- checkpoints / replay reports / rollback support;
- capability checks.

`COMMON_FLOWER_RECIPE` is a built-in validated recipe.

`installStudioCore()` installs the recipe engine and registers `COMMON_FLOWER_RECIPE`.

But this registry is Studio runtime state; Creative Library does not index it, and Public Creative API does not provide a governed CHAT execution surface for it.

Disposition: Recipe engine exists; integration/exposure is incomplete.

## FLORA Painting Recipe Runtime exists

`app.flora.recipe` is installed on InkApp through `installFloraActionLayer()`.

`PaintingRecipeRuntime` already provides:
- validate;
- compile;
- preview;
- execute;
- recompile;
- lookup/mapping;
- atomic History transaction;
- rollback on failure;
- storage into `page.floraRecipeState.recipes`.

Once a FLORA recipe has executed, Creative Library can discover it.

However `creative-library-search.js` intentionally marks recipe reuse:

```text
READ_ONLY_NO_ACCEPTED_MUTATION_ROUTE
reason = NO_ACCEPTED_CHAT_USER_GOVERNED_RECIPE_EXECUTION_ENTRYPOINT
```

This is an explicit product governance/exposure gap, not missing Recipe execution code.

## Recipe gap classification

```text
RECIPE ENGINE = PRODUCT EXISTS
BUILT-IN RECIPE = PRODUCT EXISTS
FLORA RECIPE RUNTIME = PRODUCT EXISTS / HISTORY-ATOMIC
FRESH DOCUMENT RECIPE CATALOG = EMPTY
CREATIVE LIBRARY REUSE = READ-ONLY BY DESIGN
CHAT-GOVERNED EXECUTION = MISSING INTEGRATION / EXPOSURE
```

Do not create a third recipe engine.

## Smallest coherent repair packages

### D1 — Material catalog / creation route

Do not seed unrelated assets merely to make search return non-zero.

Preferred bounded routes:

```text
material.template.create.v1
material.instance.create.v1
```

using the existing material library authority.

Initial qualification should choose one narrowly validated material semantic:
- either a compatible Path appearance template for reusable fill/stroke styling;
- or one existing validated geometry material template where the case genuinely requires material-instance reuse.

Requirements:
- proposal → approval → execute;
- existing Document materialLibrary only;
- existing History;
- strict template validation;
- stable template ID / version;
- no arbitrary executable expressions beyond current template resolver;
- Creative Library must immediately rediscover the committed template.

### D2 — Recipe inventory bridge

Expose read-only recipe inventory from existing runtime registries without pretending it is reusable.

Potential sources:
- Studio `RecipeEngine.list()`;
- page-stored FLORA recipes already indexed by Creative Library.

This can improve discovery but does not close C55 alone.

### D3 — CHAT-governed recipe execution

Add one governed entrypoint over an existing engine; do not build a new engine.

The first implementation must choose one authority explicitly:
- generic Studio RecipeEngine for pre-registered recipes; or
- FLORA PaintingRecipeRuntime for validated painting recipes.

Requirements:
- explicit recipe identity;
- explicit stable input refs / target region;
- parameter schema validation;
- proposal / user-governed approval;
- existing History/rollback authority;
- structured execution + replay receipt;
- resulting stored recipe becomes Creative Library discoverable where the chosen runtime supports persistence.

Do not merge generic Studio and FLORA recipe schemas into one fake common schema in the first repair.

## Qualification order

```text
1. prove Creative Library zero result on fresh document is expected
2. install/create one valid material through existing authority
3. Creative Library rediscovery
4. apply/create material through existing authority
5. History undo/redo and Preview
6. expose one existing recipe inventory
7. execute one existing recipe through governed authority
8. verify History / rollback / replay receipt
9. verify stored recipe rediscovery when applicable
10. rerun C001 / C002 / C007 / C008 / C013 C39/C55 subsets
```

Tool success alone is not PASS.

## Boundary

Keep Cluster D separate from:
- External Workflow Translation / Workflow IR R&D;
- Raster/Effects implementation;
- Drawing repair;
- New Document architecture;
- History redesign.

External Actions / Recipes / Skills translation may later feed the existing Recipe authority, but that R&D must not be used to disguise the current Live C55 gap.

Only an accepted exact source SHA may later be promoted to the Live repo.
