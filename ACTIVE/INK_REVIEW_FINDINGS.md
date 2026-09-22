# INK REVIEW FINDINGS

STATUS: `CORE-MOD-004 / MR_REVISE`

TASK: `CORE-MOD-004 — Visual Compare + Variant Module v0.1`

REVIEW_PAYLOAD_HEAD: `1f21b9442357903131da7226df29f6efff0534c8`

## Decision

`MR_REVISE / QA_FIX_ONLY`

## Accepted source-boundary observations

- new product code is confined to `product/source/src/compare/visual-compare.js`;
- no UI path changed;
- no Revision / History / renderer authority file changed;
- comparison is read-only and does not invoke Revision restore;
- mode support is descriptor-only;
- variant decision state is metadata-only and does not auto-select;
- `FORMAT_VERSION = 4` is preserved;
- Runtime remains correctly deferred to the Integration batch.

## Blocking finding

The committed test fixture in `qa/core-mod-004-visual-compare.test.mjs` is stale relative to the current document contract.

The fixture currently provides an artboard with only:

```text
widthMm / heightMm / ppi
```

and does not provide the current required page `workspace` contract. The authoritative `inspectDocument()` now requires a fixed artboard contract and valid creation/layout workspace cameras/viewports.

Because the test calls `createRevisionRecord(before, ...)`, that function first calls `inspectDocument(before)`. The fixture therefore fails before the CORE-MOD-004 comparison assertions can run.

DEV already disclosed that the repository-native Node QA was not executed. The authored test cannot be accepted as executable evidence in its present form.

## Required bounded fix

Update only the QA fixture/evidence necessary to match the current FORMAT_VERSION 4 document contract, execute the committed Node test, record actual PASS evidence, and hand off again.

No product-module redesign is requested by this review.
