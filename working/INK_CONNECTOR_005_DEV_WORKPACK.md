# INK Connector-005 — Creative Library Search DEV Workpack

STATUS: `DEV_AUTHORIZED / QUEUED_AFTER_RUNTIME_STABILITY_HANDOFF`

DATE: 2026-09-26

## 1. Authority

```text
TASK = INK-CONNECTOR-005-CREATIVE-LIBRARY-SEARCH
BRANCH = work/ink-connector-005
BASELINE = 54301b0916a04d0a1c611df4db540481baa12300
UPSTREAM_PLAN = working/INK_CONNECTOR_005_BOUNDED_PLAN.md

START_TRIGGER =
  INK-RUNTIME-HARNESS-STABILITY-001 reaches DEV_HANDOFF
  regardless of Runtime result = PASS / FAIL / INCONCLUSIVE

DEV = AUTHORIZED
MR = REVIEW / RECONCILE / FINAL_RUNTIME / PROMOTION
PHOTOSHOP_UI_REBUILD = HOLD
```

This Workpack implements the user's decision that Connector-005 must not wait for a clean shared Runtime result.

A Runtime harness failure does **not** stop Connector-005 implementation or focused QA.
It does not waive source correctness, focused QA, or evidence requirements.

## 2. Branch isolation

Connector-005 runs on its own branch from the accepted Closure product baseline:

```text
work/ink-connector-005
base = 54301b0916a04d0a1c611df4db540481baa12300
```

Do not merge or copy Runtime-harness-stability changes into this branch unless MR explicitly reconciles them later.

Reason:

```text
Runtime harness lane = QA / runner stability
Connector-005 lane = product capability
```

MR will reconcile both handoffs onto one final exact-SHA candidate.

## 3. Objective

Add one bounded, read-only CHAT entrypoint for discovering existing reusable INK structures:

```text
CHAT query
→ bounded deterministic search
→ stable typed library refs
→ inspect selected ref
→ report existing native reuse route
→ actual mutation, when requested later, remains under existing approval/native authority
```

No new Library engine may be created.

## 4. Search families

Required initial families:

```text
component
material
recipe
parametric-structure
reference-derived-structure
```

Authoritative existing sources must be audited first. Expected authorities include:

```text
components:
  product/source/src/document/components.js
  document.components.definitions

materials:
  product/source/src/material/material-library.js
  document.materialLibrary.templates

recipes:
  product/source/src/flora/recipe/*
  page.floraRecipeState.recipes where present

parametric structures:
  existing native Repeat / layout / structured objects
  no second Repeat engine

reference-derived structures:
  existing Reference Handoff / decomposition / provenance metadata
  no second decomposition engine
```

If a family has no currently instantiated/searchable records, return an empty bounded result rather than inventing assets.

## 5. New public surface

Authorize exactly one new primary named tool:

```text
search_ink_library
```

Target named-tool count:

```text
existing exact prefix = 21 tools
Connector-005 target = 22 tools
new slot = append only
```

The existing 21-tool prefix must remain byte/order semantically stable.

Recommended public API shape:

```text
library.query({
  action: "search" | "inspect",
  query?,
  types?,
  ref?,
  limit?
})
```

The named tool routes to the public API and is strictly read-only.

Do not add a second named mutation tool for reuse.
Reuse/application must continue through already accepted native mutation paths such as `use_ink`, `propose_ink_edit`, Component transactions, Material authority, or another already-existing native authority proven by source.

## 6. Stable ref contract

Use a structured, non-executable typed ref. Minimum logical fields:

```text
schema = INK_CREATIVE_LIBRARY_REF
version = 1
type
scope
id
source
```

Optional identity fields may include document/page/object/template/definition identifiers when native authority requires them.

Requirements:

- deterministic for the same underlying asset within its documented scope;
- type-disambiguated;
- JSON-safe;
- contains no executable source;
- contains no arbitrary eval/function payload;
- can be resolved by bounded native lookup;
- stale/missing targets return an explicit invalid-ref result;
- no silent fallback to a different asset.

## 7. Search contract

Search is read-only and bounded.

Required behaviors:

```text
query normalization
optional type filtering
deterministic ordering
bounded maximum result count
stable typed ref per result
display label/name when available
bounded metadata
source/provenance metadata when available
reuse-route metadata
```

Search must not mutate:

```text
Document
modifiedAt
History
Revision
Creative Memory
Research state
library/native registries
selection
workspace
```

No remote network search is authorized.

## 8. Inspect contract

Inspect resolves exactly one returned ref through the same native authority used for search.

It must return:

```text
ref
type
label/name
bounded metadata
source/provenance
native reuse route
current validity
```

Inspect must be mutation-neutral.

## 9. Reuse contract

Connector-005 does not create a new mutation engine.

For each search family, explicitly classify the result's reuse route:

```text
REUSE_AVAILABLE_EXISTING_AUTHORITY
READ_ONLY_NO_ACCEPTED_MUTATION_ROUTE
STALE_OR_INVALID
```

Examples of accepted existing routes where applicable:

```text
component definition
→ propose_ink_edit
→ component.instance.create.v1
→ approval
→ native Component transaction
→ History

material template
→ propose_ink_edit
→ path.material.apply.v1
→ approval
→ existing Material authority
→ History

native Repeat / reusable structured object
→ existing clone / repeat / hierarchy operations only

reference-derived structure
→ existing object/ref + clone/composition authority only
```

Recipe reuse must use an already-existing recipe runtime/authority if a user-governed route already exists.
Do not add a new autonomous recipe execution path merely to satisfy this Connector.
If no accepted user-governed route exists, report it truthfully as read-only in v1.

No reuse may occur automatically as a side effect of search or inspect.

## 10. Authorized product files

Primary:

```text
product/source/src/agent/creative-library-search.js   # new, if useful
product/source/src/agent/public-creative-api.js
product/source/src/agent/capability-registry.js
product/source/src/agent/index.js                     # export only if required
```

Read-only native authority files may be imported/consulted.

Conditional product changes outside the primary list require a checkpoint note proving why a pure adapter cannot use the existing authority.
Do not alter Renderer, History, Revision, document schema/migration, Component semantics, Material semantics, Recipe semantics, Repeat semantics, or Reference decomposition semantics.

## 11. Authorized QA/evidence

Create focused QA such as:

```text
qa/ink-connector-005-creative-library-search.test.mjs
```

Runtime harness changes are **not** part of Connector-005.
Use the Runtime stability lane for shared harness changes.

Browser harness may receive Connector-specific assertions only if it does not change shared runner stability behavior.

## 12. Required focused QA

At minimum prove:

```text
A. named tools = 22
B. first 21 named tools remain exact accepted prefix
C. search finds representative component/material/recipe/parametric/reference-derived records when fixtures exist
D. empty family returns [] rather than fabricated data
E. deterministic ordering
F. limit is bounded
G. stable ref repeated search equality
H. type-disambiguated refs
I. inspect resolves returned ref
J. stale ref explicitly fails
K. search Document byte/deep equality
L. search modifiedAt equality
M. search History equality
N. search Revision equality
O. inspect Document/History/Revision equality
P. no eval / Function / executable ref payload
Q. no network/remote search route
R. reuse route maps only to existing native authority
S. no mutation before explicit proposal/approval where mutation is applicable
T. existing 34 bounded edit operations remain unchanged
U. FORMAT_VERSION remains 4
```

## 13. Runtime policy for this Workpack

Connector implementation must continue regardless of the current shared Runtime-harness result.

After focused QA PASS:

- if the stability lane has produced a usable exact-SHA runner, DEV may run Connector browser Runtime and record evidence;
- if the runner remains unstable or inconclusive, record `RUNTIME_DEFERRED_SHARED_HARNESS` and continue to handoff;
- do not weaken Connector assertions to manufacture a Runtime PASS.

Therefore:

```text
DEV_CONNECTOR_HANDOFF
does not require
SHARED_RUNTIME_CLEAN_PASS
```

Final Connector closure still requires MR reconciliation, integrated exact-SHA Runtime acceptance, and clean promotion.

## 14. Explicit non-goals

Do not implement:

```text
Library Manager UI
cloud library
remote asset service
AI auto tagging/classification
Variables/Tokens system
Styles system
Component Variants
CRDT/multiplayer library
automatic Creative Memory writes
automatic Research fetch/scrape
autonomous asset application
new renderer
new Component/Material/Recipe/Repeat engine
```

UI exposure beyond the minimum technical Runtime proof is deferred to the Photoshop-aligned final UI rebuild.

## 15. DEV checkpoint and handoff

Create:

`working/INK_CONNECTOR_005_CHECKPOINT.md`

Required contents:

```text
WHY
AUTHORITIES_AUDITED
SEARCH_FAMILIES
STABLE_REF_CONTRACT
NEW_NAMED_TOOL
FILES_CHANGED
FOCUSED_QA
RUNTIME_STATUS
REUSE_ROUTE_MATRIX
MUTATION_NEUTRALITY_EVIDENCE
BOUNDED_EDIT_OPERATIONS = 34 / unchanged
NAMED_TOOLS = 22
FORMAT_VERSION = 4 / unchanged
PROMOTION = NOT_RUN
```

Terminal state:

```text
RESULT = DEV_CONNECTOR_005_IMPLEMENTATION_READY_FOR_MR_REVIEW
DEV_HANDOFF → STOP
```

The DEV handoff is required even when Runtime is FAIL/INCONCLUSIVE/DEFERRED due to the shared harness, provided implementation and focused QA are complete.

MR owns final acceptance, cross-branch reconciliation, integrated Runtime, clean promotion, and CURRENT_CAPABILITY_BASELINE refresh.
