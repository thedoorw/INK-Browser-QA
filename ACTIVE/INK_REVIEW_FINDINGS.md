# INK REVIEW FINDINGS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-005`

Reviewed fingerprint:

```text
BRANCH work/ink-cloud-005
HEAD   315d4ac2b33894630c0d1a67333fc40acbc145e9
```

## MR decision

`MR_PASS`

The Component / Instance Data Model Foundation satisfies the bounded source-level requirements of the Current Work Order.

## Accepted findings

- Component definition authority is a single optional native registry referencing ordinary INK structural roots.
- Definition IDs, source-node IDs, and Instance object IDs remain distinct identities.
- Source-node targeting uses stable object IDs rather than array positions.
- Linked Instances remain ordinary INK-owned objects using existing matrix/parent semantics.
- Instance resolution produces disposable ordinary geometry rather than a second scene graph.
- Instance transforms do not mutate Component definitions.
- Missing definitions, invalid source roots, duplicate definition IDs, ambiguous source-node IDs, malformed override envelopes, unsupported nested Instances, and cycles fail safely.
- v0.1 override scope is explicitly bounded to opacity and is serialized by stable source-node ID.
- stale override targets remain diagnostic and non-destructive.
- detach materializes ordinary editable INK structure, removes linkage, generates fresh IDs, preserves placement/appearance, and is undoable.
- register/create/override/reset/detach/duplicate/repair operations use the existing HistoryManager.
- renderer, bounds, hit-test, spatial and SVG paths resolve through the same ordinary geometry semantics.
- native save/load retains definition / Instance / override data, including broken references.
- integrity exposes Component reference problems as diagnostics without silently retargeting data.
- structured SVG exports resolved structural geometry without raster flattening.
- existing Frame / Group / Transform / Repeat compatibility suites remain passing in DEV evidence.
- no parallel renderer, hierarchy, transform, selection or History engine was introduced.
- no Cloud backend, variants, constraints, auto-layout, full Component UI, package update or product-version promotion was introduced.
- `FORMAT_VERSION = 4` remains unchanged.

## Format-version conclusion

MR accepts the v0.1 decision:

`FORMAT_VERSION_CHANGE = 0`

The Component model is implemented as an optional identified extension within the existing format-4 envelope, and DEV evidence verifies that the pre-task format-4 migration retains the new registry and Instance payload.

This does not claim that older INK builds understand or render Components; it establishes current-format data retention and forward capability within the accepted extensible document model.

## Runtime QA

`RUNTIME_QA_DEFERRED`

Browser/runtime evidence remains validation debt, including Canvas/WebGL visual equivalence, pointer transforms, browser IndexedDB/open-save behavior, and browser SVG inspection.

No Runtime certification claim is made.

## Gate

```text
INK-CLOUD-005
→ MR_PASS
→ SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED
→ USER_PROMOTION_DECISION_REQUIRED
```

Cloud implementation remains blocked.
