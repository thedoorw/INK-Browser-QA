# INK Cluster C — Layout / Page / Artboard DEV Return

Status: **DEV_COMPLETE — AWAITING CHAT / CORE / LIVE AUTHORITY REVIEW**

## Identity

- Repo: `thedoorw/INK-Browser-QA`
- Branch: `work/ink-cluster-c-layout-page-artboard-001`
- Base main at dispatch: `b6f837643064100b04cad12e338db782709ce255`
- Exact product candidate: `6dca38862352a5ffcd2193b943c017f70eecd4e2`
- Draft PR: #151
- Merge: **NO**
- Deploy: **NO**

## Scope reconciliation against latest main

The dispatch named C1–C4, but latest SSOT already contained completed authority for C1/C2, and PR #149 had already merged C3 before this branch was created.

Therefore this DEV did not duplicate existing owners:

- C1 Page: inherited Formal Live baseline.
- C2 Align/Distribute: inherited Formal Live baseline.
- C3 Snap/Guides: inherited merged + candidate-qualified baseline from PR #149.
- C4 Artboard CHAT exposure: implemented and qualified in this branch.

## C4 implementation

Added bounded CHAT operation:

`page.artboard.set.v1`

It exposes only existing native Artboard authority through the existing proposal → approval → execute lifecycle.

Native mutation authority remains:

`InkApp.changeArtboard(key, value)`

Accepted existing fields:

`orientation / ppi / bleedMm / safeMarginMm / unit / showBleed / showSafeArea / showCenter / clipContent`

No new Document, History, Layout, Artboard engine or Renderer was created.

Product candidate changes only:

- `product/source/src/editor/chat-bounded-edit.js`
- `product/source/src/agent/capability-registry.js`

The operation adds bounded arguments, Artboard optimistic-concurrency fingerprinting, stale/no-op/bounds guards, context exposure, result receipts and discoverable capability metadata. History/render/view behavior stays inside the existing native controller.

## Browser QA

PASS against exact product candidate:

`6dca38862352a5ffcd2193b943c017f70eecd4e2`

- Workflow run: `37112623108`
- Job: `111173346342`
- Artifact: `11270164226`
- Artifact digest: `sha256:f641600e0f6bafe03044fd8ee318e48a5af2d082be393174c5b665e2029f1e0b`

C4 verified:

- capability discovery and zero-target schema;
- Artboard present in CHAT context;
- proposal → approval → execute;
- native History label `調整畫板`;
- stale Artboard rejection;
- no-op rejection;
- invalid orientation/PPI/bleed/safe-margin rejection;
- exact Undo / Redo / reset;
- Preview before and after orientation mutation;
- Preview fingerprint changed `fnv1a32:4281700a → fnv1a32:c18c13a4`;
- Preview bounds changed A4 portrait `793.700787 × 1122.519685` → landscape `1122.519685 × 793.700787`;
- final Artboard restored exactly to baseline.

The earlier run `37112581299` failed before browser execution because the branch-only QA runner contained an escaped template delimiter. It produced no product failure evidence. The runner was corrected and the exact same product candidate then passed run `37112623108`.

## Regression result

All PASS in fresh browser profiles against the exact candidate:

- C3 `snap-guides-c3`
- C2 `align-distribute-c2`
- C1 `page-ops-c1`
- A2 `stroke-create-a2`
- B2 `raster-stack-adjustment-b2`
- B4 `path-deformation-b4`

Detailed evidence:

`qa/evidence/cluster-c-layout-page-artboard-20261003/C4_BROWSER_QA_EVIDENCE.json`

Candidate request:

`qa/evidence/cluster-c-layout-page-artboard-20261003/C4_SOURCE_CANDIDATE_QA_REQUEST.json`

## Boundary check

Not touched:

- UI C04 / C06
- New Document
- B3
- D
- C019
- FORMAT_VERSION
- deployment repo
- Live deployment

Temporary branch-only QA runner/workflow changes were removed from the final diff after evidence capture.

## STOP

DEV work is complete.

**STOP → CHAT / Core / Live authority.**

Authority owner must independently review/integrate, choose the accepted source SHA, perform any required exact-SHA deployment and Formal Live closure. This DEV does not self-merge or self-deploy.
