# INK DEV PROGRESS

STATUS: `INK-CHAT-CLOSED-LOOP-001 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

- Branch: `work/ink-chat-closed-loop-001`
- Starting exact HEAD: `2634e5481906c248ee3396bf83e2ddc7bb341cbe`
- Work Order upstream base: `9ab4a6b557628f8fcdd1b58312b219423c68fe34`
- Latest GitHub implementation checkpoint: `baa716942febdd4be0f16070799d215efb06c4f1`
- Handoff HEAD: subsequent evidence/progress commit, reported exactly in the DEV final response.
- Milestone: import facade + tool 20 + sequential smart browser proof + QA-only PNG materialization implemented.
- Product files: only `product/source/src/agent/public-creative-api.js` and `capability-registry.js`.
- QA files: `qa/ink-chat-closed-loop-001-smart-proof.test.mjs`, `qa/runtime/ink-cloud-018-browser-harness.html`, `qa/runtime/run-ink-runtime-batch.mjs`.
- Focused QA: 8/8 PASS on Node v24.19.0; existing reference handoff QA PASS.
- Full Connector 001–004 diagnostic run: 29/36 PASS, 7 FAIL. Four old exact-total assertions expect 19 instead of authorized 20. Three other failures reproduce on unchanged starting source (baseline 33/36 PASS). These tests are outside this Work Order's file allowlist and were not modified.
- Browser Runtime: NOT_RUN_BY_DEV; exact-SHA Windows self-hosted Runtime and CHAT image retrieval remain the MR gate, per Work Order I.
- Evidence report: `research/INK_CHAT_CLOSED_LOOP_001_SMART_PROOF_REPORT_v0.1.md`.
- Handoff: `working/INK_CHAT_CLOSED_LOOP_001_DEV_HANDOFF.md`.
- QA helper and harness EOF whitespace normalized after the implementation checkpoint; no semantic source changes.
- Current gate: `DEV_HANDOFF → STOP`. MR owns exact-SHA Runtime and real PNG retrieval.
- No Runtime queue, main, package, UI, transport, operation vocabulary or FORMAT_VERSION changes.

Read: README, AGENTS, 我說, ACTIVE README/Current Work Order/DEV New Window Start/branch-local Progress, Working Status, MR/DEV governance, development handoff, Windows Runtime standard, existing Reference Handoff/Public API/capability registry/output registry/preview/plan/History/Revision paths and focused QA.


## MR_REVISE / QA_BRIDGE_ONLY — realm-local output resolver loader

- Revision baseline: `2b3c2f79147b6122f5ac78ed47d19c9878522386`.
- Scope: QA-only resolver loader; product source frozen.
- Replaced iframe dynamic inline module text with deterministic same-origin external QA route `/__qa_smart_loop_resolver.js`.
- Route is available only to the Creative Runtime suite and contains one fixed resolver binding to `resolveInkOutputPayload(window.INK_APP, handleId)`.
- Loader executes in the INK iframe realm via `script.src`.
- Cleanup after after-preview: delete temporary QA global + remove script node + explicit harness assertion.
- Focused QA contract extended for route body, JavaScript content type, external loader, inline-code absence, cleanup and forbidden bridge primitive absence.
- Runtime: NOT_RUN_BY_DEV; exact-SHA Windows Runtime remains MR gate.
- Product transport / external transport / MCP / WebSocket / postMessage / eval / Function / alternate renderer / UI / native operation / FORMAT_VERSION changes: 0.
- Current gate: `DEV_HANDOFF → STOP`.


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
