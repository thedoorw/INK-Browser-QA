# INK Connector-005 — Creative Library Search DEV Checkpoint

STATUS: `DEV_HANDOFF / STOP`

DATE: 2026-09-26

TASK:

`INK-CONNECTOR-005-CREATIVE-LIBRARY-SEARCH`

BRANCH:

`work/ink-connector-005`

BASELINE:

`54301b0916a04d0a1c611df4db540481baa12300`

## WHY

Connector-005 adds one bounded, read-only CHAT discovery surface over reusable structures that already exist in INK.

The implementation does not create a second Library engine.

```text
CHAT query
→ search_ink_library
→ app.inkPublicApi.library.query
→ existing current-document authorities
→ stable typed INK_CREATIVE_LIBRARY_REF / 1
→ inspect / report current native reuse route
```

Actual reuse remains a separate existing proposal / approval / native execution path.

## AUTHORITIES_AUDITED

### Components

```text
product/source/src/document/components.js
document.components.definitions
registerComponentDefinition
createComponentInstance
```

Search reads `document.components?.definitions` directly.

It does not create or normalize the Component registry.

### Materials

```text
product/source/src/material/material-library.js
document.materialLibrary.templates
path.material.apply.v1
```

Important read-only boundary:

`ensureMaterialLibrary(document)` creates missing state and therefore is not used.

Search reads only:

`document.materialLibrary?.templates || []`

### Recipes

Audited:

```text
product/source/src/flora/recipe/painting-recipe-runtime.js
page.floraRecipeState.recipes
product/source/src/recipe/recipe-engine.js
app.studio.engine
```

Important read-only boundary:

`PaintingRecipeRuntime.state()` can create missing `page.floraRecipeState`, so Connector-005 does not call it during search.

The v1 document search reads only already-persisted:

`page.floraRecipeState?.recipes`

The generic Studio RecipeEngine was audited, but Connector-005 does not add a new CHAT execution path over it.

Recipe reuse is therefore reported truthfully as:

`READ_ONLY_NO_ACCEPTED_MUTATION_ROUTE`

### Parametric structures

```text
product/source/src/vector/vector-core.js
native object.type === "repeat"
walkPageObjects(page)
object.clone.v1
```

No second Repeat engine or expansion authority was added.

### Reference-derived structures

Audited:

```text
product/source/src/ai/chat-reference-handoff.js
product/source/src/extraction/workspace.js
product/source/src/extraction/core.js
product/source/src/extraction/structure.js
```

Search uses existing persisted object metadata:

```text
metadata.decomposition
metadata.extraction
metadata.structureAware
```

This preserves the existing Reference / decomposition / structure provenance identities without a second store.

## SEARCH_FAMILIES

Implemented exact initial families:

```text
component
material
recipe
parametric-structure
reference-derived-structure
```

Missing or non-instantiated families return an empty array.

No asset is fabricated.

Search behavior:

```text
normalized substring query
optional type filter
deterministic family/label/id/scope ordering
default limit = 20
hard maximum = 50
bounded metadata only
source/provenance where available
reuse-route classification
```

## STABLE_REF_CONTRACT

Returned refs use:

```text
schema = INK_CREATIVE_LIBRARY_REF
version = 1
type
scope.documentId
scope.pageId? / scope.layerId?
id
source
```

Properties:

- deterministic for the same underlying current asset;
- family/type-disambiguated;
- JSON-safe;
- no function/eval/executable payload;
- exact current-document scope;
- inspect resolves the same underlying native authority;
- document mismatch, missing asset or non-exact match returns explicit `INK_CREATIVE_LIBRARY_REF_STALE`;
- no fallback to another asset.

Inspect result includes:

```text
ref
valid = true
item.type
item.label
bounded metadata
provenance/source
reuse route
```

## NEW_NAMED_TOOL

Exactly one new primary named tool:

`search_ink_library`

Public route:

`app.inkPublicApi.library.query`

Capability:

```text
id = library.search
availability = true
routingClass = NAMED_TOOL
role = READ
publicMethod = library.query
```

Registry evaluation on exact branch source proved:

```text
NAMED_TOOLS = 22
tools[0..20] = exact accepted 21-tool prefix
tools[21] = search_ink_library
```

No mutation named tool was added.

## FILES_CHANGED

Authorized product:

```text
product/source/src/agent/creative-library-search.js
product/source/src/agent/public-creative-api.js
product/source/src/agent/capability-registry.js
```

`product/source/src/agent/index.js` did not require modification.

Focused QA:

`qa/ink-connector-005-creative-library-search.test.mjs`

Governance / Workpack files already on branch:

```text
ACTIVE/INK_DEV_PROGRESS.md
working/INK_CONNECTOR_005_BOUNDED_PLAN.md
working/INK_CONNECTOR_005_DEV_WORKPACK.md
```

Checkpoint:

`working/INK_CONNECTOR_005_CHECKPOINT.md`

No Renderer / History / Revision / Document schema / Material / Component / Recipe / Repeat / Reference engine semantics were changed.

## FOCUSED_QA

Authored executable focused Node test:

`qa/ink-connector-005-creative-library-search.test.mjs`

DEV connector environment has no repository checkout/network path for invoking that file with native `node --test`.
The test file itself was syntax-compiled after ESM import normalization.

In addition, the exact branch adapter source was executed directly in the DEV evaluator with representative native-shaped fixtures.

Results:

```text
A  named tools = 22                                  PASS
B  first 21 exact accepted prefix                    PASS
C  all five representative families                  PASS
D  missing query/family returns []                    PASS
E  deterministic ordering                            PASS
F  result limit bounded to 50                        PASS
G  repeated search stable ref equality               PASS
H  same id type-disambiguated                         PASS
I  inspect exact returned ref                         PASS
J  stale ref explicit failure                         PASS
K  Document equality                                  PASS
L  modifiedAt equality                                PASS
M  History mutation route absent + test snapshot      PASS
N  Revision mutation route absent + test snapshot     PASS
O  inspect mutation-neutral                           PASS
P  no eval / Function / executable ref payload        PASS
Q  no fetch/XHR/WebSocket/remote search route         PASS
R  reuse routes existing authorities only             PASS
S  search/inspect do not auto-apply/reuse             PASS
T  CHAT_EDIT_OPERATIONS = 34                          PASS
U  FORMAT_VERSION = 4                                 PASS
```

Source/static gate additionally proved:

```text
creative-library-search.js syntax = PASS
focused test source syntax = PASS
public API imports/installs one adapter = PASS
library.query public API present = PASS
search_ink_library handler present = PASS
library.search descriptor present = PASS
descriptor appended after export_ink_asset = PASS
no network/eval patterns = PASS
no markDirty / History commit / Revision capture / replaceDocument / selection assignment = PASS
```

## RUNTIME_STATUS

`RUNTIME_DEFERRED_MR_RECONCILIATION_WITH_STABLE_HARNESS`

Reason:

Connector-005 branch isolation is authoritative:

```text
work/ink-connector-005
base = 54301b0916a04d0a1c611df4db540481baa12300

Runtime harness lane = QA/runner stability
Connector-005 lane = product capability
do not copy stability-lane changes into Connector branch
```

The separate Runtime-stability lane has already produced a clean usable runner candidate:

```text
RUN = 36237399168
TESTED_SHA = 89d91e3b77198409d384de95f5d595f14f4620ca
FOCUSED_NODE = 26/26 PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS
```

Running this isolated Connector branch would still materialize its pre-reconciliation runner/harness baseline and would not test the final integrated candidate truthfully.

Therefore no Connector browser Runtime was manufactured on this branch.
MR owns reconciliation of both handoffs and integrated exact-SHA Runtime.

## REUSE_ROUTE_MATRIX

| Family | v1 reuse classification | Existing authority |
|---|---|---|
| component | `REUSE_AVAILABLE_EXISTING_AUTHORITY` when source root is valid | `propose_ink_edit → component.instance.create.v1 → native Component transaction` |
| material | `REUSE_AVAILABLE_EXISTING_AUTHORITY` | `propose_ink_edit → path.material.apply.v1 → existing Material authority` |
| recipe | `READ_ONLY_NO_ACCEPTED_MUTATION_ROUTE` | Existing recipe runtimes audited; no new CHAT execution path added |
| parametric-structure | `REUSE_AVAILABLE_EXISTING_AUTHORITY` | `propose_ink_edit → object.clone.v1` for current native Repeat |
| reference-derived-structure | `REUSE_AVAILABLE_EXISTING_AUTHORITY` | Existing stable object ref → `object.clone.v1`; provenance remains existing metadata |

A Component definition with a missing source root is classified:

`STALE_OR_INVALID`

## MUTATION_NEUTRALITY_EVIDENCE

Search and inspect read only current in-memory authorities.

The new adapter contains no:

```text
markDirty
History push/begin/commit/cancel
Revision capture/restore
replaceDocument
selection assignment
workspace switch
Creative Memory write
Research write
fetch / XHR / WebSocket / EventSource
eval / Function
```

Representative execution snapshots preserved:

```text
Document byte/deep state
modifiedAt
History counts/pending
Revision identity
selection
```

Reuse metadata is descriptive only.
No reuse/application occurs during search or inspect.

## PRESERVED BASELINE

```text
BOUNDED_EDIT_OPERATIONS = 34 / unchanged
NAMED_TOOLS = 22
FORMAT_VERSION = 4 / unchanged
NEW_MUTATION_TOOL = 0
NEW_LIBRARY_ENGINE = 0
NETWORK_SEARCH = 0
UI_CHANGE = 0
PROMOTION = NOT_RUN
```

## NEXT

MR:

1. review exact Connector-005 handoff HEAD and this checkpoint;
2. run native `node --test qa/ink-connector-005-creative-library-search.test.mjs`;
3. reconcile this product/QA payload with the Runtime-stability handoff;
4. update integrated browser expectations from the 21-tool Closure baseline to the append-only 22-tool Connector baseline where required;
5. execute one integrated exact-SHA Runtime;
6. only MR may classify final acceptance / promotion / capability-baseline refresh.

```text
RESULT = DEV_CONNECTOR_005_IMPLEMENTATION_READY_FOR_MR_REVIEW
PROMOTION = NOT_RUN
DEV_HANDOFF → STOP
```
