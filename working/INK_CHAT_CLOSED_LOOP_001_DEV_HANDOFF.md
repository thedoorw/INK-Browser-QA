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
