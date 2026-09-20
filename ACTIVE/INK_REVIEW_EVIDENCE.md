# INK REVIEW EVIDENCE — INK-CLOUD-005

STATUS: `MR_PASS_EVIDENCE / RUNTIME_QA_DEFERRED`

## Fingerprint

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-005` |
| DEV_BRANCH | `work/ink-cloud-005` |
| REVIEW_HEAD | `315d4ac2b33894630c0d1a67333fc40acbc145e9` |
| IMPLEMENTATION_QA_HEAD | `a40885903c2e17e910b6a57672a2be1576e5f29a` |
| FORMAT_VERSION_CHANGE | `0` |
| RUNTIME_QA | `DEFERRED` |

## Scope reviewed

Relative to the DEV initialization checkpoint, MR reviewed the Component/Instance implementation and bounded integration across:

- `product/source/src/document/components.js`
- `product/source/src/document/hierarchy.js`
- `product/source/src/document/index.js`
- `product/source/src/document/integrity.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- `qa/core/tests/unit/component-instance-v0.1.test.mjs`
- retained Frame / Group / Transform regression evidence
- `research/INK_COMPONENT_INSTANCE_DATA_MODEL_REPORT_v0.1.md`

## Source evidence

MR directly verified:

1. Definition authority is registry metadata referencing ordinary Frame/Group roots.
2. Resolution clones source geometry into a disposable view and does not persist resolved children.
3. Source root canvas placement is explicitly excluded; instance placement remains the ordinary INK local matrix.
4. source-node identity is ordinary stable object ID and survives reorder / rename / reparent.
5. duplicate source-node IDs fail closed.
6. Instance-owned children are rejected.
7. nested Instances are explicitly unsupported and rejected rather than recursively resolved.
8. missing / duplicate / invalid definitions produce broken diagnostic results rather than silent retargeting.
9. override application is restricted to validated opacity data.
10. detach remaps all ordinary geometry IDs and removes Component linkage.
11. mutation commands reject when History is already pending and otherwise use existing scoped History.
12. broken detach / invalid placement reject before mutation.
13. renderer, world bounds, atomic hit-test and SVG all resolve the same linked geometry path.
14. Component documents conservatively rebuild the existing spatial index to avoid stale linked bounds.
15. integrity reports Component diagnostics without converting broken links into structural corruption.
16. `FORMAT_VERSION` and app version remain unchanged.

## DEV execution evidence

Recorded branch evidence reports:

- Component/current contract tests: `62/62 PASS`
- retained compatibility tests: `29/29 PASS`
- total Node tests: `91/91 PASS`
- source syntax checks: `6/6 PASS`
- `FORMAT_VERSION = 4`: PASS
- `git diff --check`: PASS

The evidence log is:

`qa/core/evidence/INK_CLOUD_005_NODE_CHECKS.txt`

MR did not independently execute the complete Node suite; these results are treated as DEV execution evidence. MR independently reviewed the relevant source paths and test definitions.

## Deferred evidence

Still deferred:

- live browser Canvas/WebGL rendering;
- pointer move/scale/rotate;
- browser nested visibility/lock/opacity interaction;
- real browser IndexedDB recovery;
- browser project open/save;
- browser SVG inspection;
- GPU/tile/natural-media fidelity.

Therefore:

`SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`
