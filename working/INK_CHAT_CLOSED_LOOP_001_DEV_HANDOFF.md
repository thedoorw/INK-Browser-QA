# INK-CHAT-CLOSED-LOOP-001 DEV Handoff

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Fingerprint

- Branch: `work/ink-chat-closed-loop-001`
- Starting exact HEAD: `2634e5481906c248ee3396bf83e2ddc7bb341cbe`
- GitHub implementation checkpoint: `baa716942febdd4be0f16070799d215efb06c4f1`
- Handoff HEAD: the subsequent evidence/progress commit containing this document; use the exact SHA in the DEV final response and pin it before review/Runtime.
- Expected changed files: the eight listed below, and no others.

## Delivered

- Public `reference.import(input, options?)` delegates existing `app.chatReferenceHandoff.importReference`.
- Named Tool 20 `import_ink_reference`; original 19-tool prefix preserved in full.
- JSON-safe import envelope with stable refs, History/Revision/provenance/error receipts.
- One sequential connector-first Reference → Color/Line → preview → use_ink two-repaint proposal/approval/execution → History/Revision → preview proof.
- QA-only output-handle payload materialization and exact-SHA JSON binding, with all 17 mandatory smart markers.

## Files

1. `product/source/src/agent/public-creative-api.js`
2. `product/source/src/agent/capability-registry.js`
3. `qa/ink-chat-closed-loop-001-smart-proof.test.mjs`
4. `qa/runtime/ink-cloud-018-browser-harness.html`
5. `qa/runtime/run-ink-runtime-batch.mjs`
6. `research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md`
7. `working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md`
8. `ACTIVE/INK_DEV_PROGRESS.md`

## Validation

- New focused QA: **8/8 PASS**.
- Existing Reference handoff QA: **PASS**.
- Entire 19-tool metadata prefix: **unchanged**.
- Legacy Connector diagnostic run: **29/36 PASS, 7 FAIL**. Four frozen tool-count assertions expect 19; three failures also occur on original source. Full details and baseline comparison are in the report. Those out-of-allowlist tests were not modified.
- Browser Runtime: **NOT RUN BY DEV**; not declared PASS or unavailable.
- Real smart-loop PNG/JSON artifacts: **not yet produced**. Unit-test temporary files are not Runtime evidence.

## MR next gate

Review the exact handoff HEAD, then use the existing `.github/workflows/ink-runtime-batch-windows.yml` with that exact SHA through the MR-owned Runtime route.

Required:

- UI, Creative and Geometry PASS.
- All 17 `SMART_LOOP_*` markers PASS.
- `smart-loop-before.png`, `smart-loop-after.png`, `smart-loop.json` in the existing Runtime artifact's evidence directory.
- JSON testedSha matches exact target; input/PNG hashes, stable refs, plan, History, Revision and preview handles bind correctly.
- Retrieve both actual PNGs into CHAT before declaring the smart closed-loop gate PASS.

Proof transport label: `RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT`.

No main merge, package mutation, Runtime queue mutation, new operation families, geometry editing, raw Path creation, drawing engine, UI, external transport, arbitrary execution, automatic product approval or FORMAT_VERSION change.

`DEV_HANDOFF → STOP`


## MR_REVISE / QA_BRIDGE_ONLY completion

- Revision baseline: `2b3c2f79147b6122f5ac78ed47d19c9878522386`.
- Product source frozen: `product/source/src/agent/public-creative-api.js` and `product/source/src/agent/capability-registry.js` were not modified in this revision.
- Browser loader now uses deterministic same-origin external QA route `/__qa_smart_loop_resolver.js`; no dynamic inline module text remains.
- Route is Creative-suite-only and provides only `resolveInkOutputPayload(window.INK_APP, handleId)` through temporary `window.__INK_SMART_LOOP_QA_RESOLVE`.
- The INK iframe loads the route with `script.src`; after the after-preview is materialized, the temporary global is deleted and the script node is removed.
- Focused QA contract covers route body/content type, external loader, cleanup and forbidden bridge primitives.
- Browser Runtime and real `smart-loop-before.png` / `smart-loop-after.png` remain MR-owned exact-SHA evidence; DEV does not claim Runtime PASS.
- Revision changes only QA/runtime proof files plus report/handoff/progress. No UI, transport, product authority, native operation vocabulary, package or FORMAT_VERSION changes.

Return: `DEV_HANDOFF → STOP`.


### Focused QA result

Connector-side static QA: **PASS**.

Verified against revision checkpoint `5637d54e308b994d30d1de59ee67c90557487a30`:

- revision diff contains only the six authorized QA/report/handoff/progress files;
- both frozen product source blob SHAs are unchanged from `2b3c2f79147b6122f5ac78ed47d19c9878522386`;
- no inline resolver module remains in the harness;
- loader uses `/__qa_smart_loop_resolver.js` through `script.src`;
- route is Creative-suite-only and preflighted;
- fixed resolver calls only `resolveInkOutputPayload(window.INK_APP, handleId)`;
- temporary QA global and module node are removed after materialization;
- new loader/resolver implementation contains no WebSocket, postMessage, eval or Function path.

No automatic workflow run was associated with that checkpoint. Browser Runtime remains unexecuted by DEV and is not claimed PASS.


### Final QA-bridge verification

Final code checkpoint: `7d8dbb20dd452d78fd9da029206ed9e97a8b8b12`.

Result: **PASS for the authorized QA-bridge revision scope**.

- exact revision diff: six QA/report/handoff/progress files only;
- frozen product blobs unchanged:
  - `public-creative-api.js` = `72111d866584c7c414cd0e4f061953038e23596a`;
  - `capability-registry.js` = `acb56063c3c8a26bcc0b92c9088786b77620bdf6`;
- external resolver route / iframe loader / cleanup contract: PASS;
- resolver route is Creative-suite-only and calls `resolveInkOutputPayload(window.INK_APP, handleId)` only;
- newly added route-regex literals received a direct Node parse/match smoke check: PASS;
- browser Runtime was not run by DEV and remains the MR exact-SHA gate.

`DEV_HANDOFF → STOP`.

## MR_REVISE / DIAGNOSTIC_ONLY completion

Runtime run `36006888089` is accepted as the diagnostic input for this revision:

- UI `106/106 PASS`;
- import PASS;
- decomposition PASS;
- stable refs PASS;
- first failing marker: `SMART_LOOP_PREVIEW_BEFORE_CAPTURED`.

Bounded implementation checkpoint: `be77d526f963849924e91e2e6e30711207324229`.

Only `qa/runtime/ink-cloud-018-browser-harness.html` behavior was revised. The `SMART_LOOP_PREVIEW_BEFORE_CAPTURED` assertion now:

- safely checks `smartBefore.outputHandles?.length===1`;
- exposes failure details for `status`, `diagnostics`, `result`, `outputHandles`, and `previewOptions`.

Focused connector-side static QA: **PASS**.

The original `smartPreviewOptions` literal is unchanged. Frozen product source blob SHAs remain unchanged from the QA-bridge revision. No product source, renderer, `visual-feedback.js`, output registry, resolver route, timeout, retry, transport, UI or `FORMAT_VERSION` change was made.

DEV did not rerun browser Runtime. The exact final handoff HEAD is the final documentation commit reported in the DEV response.

`DEV_HANDOFF → STOP`.


## MR_REVISE / PRODUCT_DEFECT_ONLY completion

Runtime run `36009581263` attempt 2 is the diagnostic input for this revision:

- UI PASS;
- Reference import PASS;
- Color + Line decomposition PASS;
- stable refs PASS;
- first failing marker: `SMART_LOOP_PREVIEW_BEFORE_CAPTURED`;
- diagnostic: `INK_PREVIEW_DIMENSION_LIMIT_EXCEEDED`;
- preview options: `{scope:'content',maxDimension:960,background:true}`.

Revision baseline: `2a56b602af280fcc923a394d68accab755d0611f`.

Bounded product correction:

- modified only `product/source/src/agent/visual-feedback.js` in product source;
- content preview planning now preserves the raw padded width/height used by the existing `renderExportCanvas` content sizing path;
- planned content pixels are calculated from those same raw base dimensions;
- when floating rounding would make `Math.ceil(baseDimension * scale)` exceed requested `maxDimension`, `safeContentScale` applies a tiny `Number.EPSILON`-derived backoff;
- existing hard dimension and hard pixel limits remain enforced by the unchanged assertions;
- refs and output-handle behavior are unchanged.

Deterministic regression was added to `qa/ink-chat-closed-loop-001-smart-proof.test.mjs` for the fractional boundary where the previous arithmetic produced:

```text
960.0000000000001 → Math.ceil = 961
```

Corrected result:

```text
959.9999999999991 → 960 × 478
```

Focused connector-side QA: **PASS**.

Verified:

- fractional defect reproduces under the old arithmetic and closes under the corrected arithmetic;
- renderer/content sizing remains `Math.ceil(bounds.w * scale)` / `Math.ceil(bounds.h * scale)`;
- modified product source and focused QA syntax compile after module-syntax normalization;
- pre-handoff revision diff contains only the authorized product file, focused QA, report and progress files;
- `smartPreviewOptions`, renderer, `renderExportCanvas`, output registry, resolver route, timeout, retry, external transport, UI, `FORMAT_VERSION` and native operation vocabulary were not modified.

DEV did not rerun browser Runtime.

Exact final handoff HEAD is the commit containing this section and is reported in the DEV response.

`DEV_HANDOFF → STOP`.

## MR_REVISE / QA_ASSERTION_ONLY completion

Runtime run `36012548161` at tested SHA `20262d942c7a4d1a5ca03898856a2d7ddff9f5d6` is the diagnostic input for this revision.

MR classification:

```text
FIRST_FAIL = SMART_LOOP_HISTORY_RECORDED
PRODUCT_RUNTIME_FAIL = NOT ESTABLISHED
CLASSIFICATION = QA_ASSERTION_SEMANTICS_MISMATCH
PRODUCT_SOURCE = FROZEN
```

The browser harness no longer treats repaint target membership in `HistoryEntry.objectIds` as proof that History was recorded.

The corrected `SMART_LOOP_HISTORY_RECORDED` gate now requires:

- exactly two `smartExecuted.historyReceipt.steps`;
- per step: integer `beforeUndoCount`, exact +1 `afterUndoCount`, and `latestLabel === "CHAT repaint Path"`;
- completed `get_ink_history`;
- final two History entries both `captureMode === "scoped"`, `label === "CHAT repaint Path"`, `patchCount > 0`;
- at least two applied and retained History entries.

Focused QA additionally asserts that the smart History proof block contains no `objectIds` dependency.

Code checkpoints:

- `43ceec0af6b8acfd60e1f21b7cd1b756eda37174` — browser harness;
- `3901d2bd5cae0aba029170ca7cc943ec0df7fd86` — focused QA contract.

Focused connector-side QA: **PASS**.

Pre-documentation diff from the Runtime tested SHA contains only:

1. `qa/runtime/ink-cloud-018-browser-harness.html`
2. `qa/ink-chat-closed-loop-001-smart-proof.test.mjs`

Frozen product blobs remain unchanged:

- `product/source/src/agent/visual-feedback.js` = `f24dbe4f231bdc8c1acb9c197e59485815f8dc22`;
- `product/source/src/agent/public-creative-api.js` = `72111d866584c7c414cd0e4f061953038e23596a`;
- `product/source/src/agent/capability-registry.js` = `acb56063c3c8a26bcc0b92c9088786b77620bdf6`.

DEV did not rerun Windows Runtime. MR must rerun the new exact handoff HEAD and retrieve the real Runtime-produced `smart-loop-before.png`, `smart-loop-after.png`, and `smart-loop.json` before the target gate can be declared PASS.

Exact final handoff HEAD is reported in the DEV response.

`DEV_HANDOFF → STOP`.

