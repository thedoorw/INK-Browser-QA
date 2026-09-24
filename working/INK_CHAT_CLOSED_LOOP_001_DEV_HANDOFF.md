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
