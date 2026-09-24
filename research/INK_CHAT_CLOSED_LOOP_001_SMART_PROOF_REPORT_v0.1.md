# Reference → Color + Line → CHAT Smart Closed Loop Proof v0.1

Status: `IMPLEMENTED / FOCUSED_QA_PASS / MR_RUNTIME_REQUIRED`

## Identity and boundary

- Task: `INK-CHAT-CLOSED-LOOP-001`
- Branch: `work/ink-chat-closed-loop-001`
- Starting exact HEAD: `2634e5481906c248ee3396bf83e2ddc7bb341cbe`
- GitHub implementation checkpoint: `baa716942febdd4be0f16070799d215efb06c4f1`
- Final handoff HEAD is the subsequent report/progress commit reported to MR; review and Runtime must pin that exact SHA.
- `FORMAT_VERSION = 4`, product version, UI, native operation vocabulary and external transport remain unchanged.

## Product delta

Only `public-creative-api.js` and `capability-registry.js` change.

`reference.import(input, options?)` calls `app.chatReferenceHandoff.importReference(input, options)` exactly once. It does not normalize, decode, fetch or mutate the document itself. The existing authority owns import, History, provenance, audit and errors.

Named Tool 20 is `import_ink_reference`, with canonical input `{ input: browserLocalFileOrBlob, options?: existingHandoffOptions }`. Existing normalizeChatAttachment wrappers remain supported. Descriptor examples explicitly label their binary placeholder as symbolic and invalid until replaced with an actual File/Blob.

The complete accepted 19-tool metadata array is byte-for-byte-equivalent as structured data to the starting source prefix. Discovery advertises `reference.import / available / NAMED_TOOL / import_ink_reference`. `external.transport` remains unavailable.

Results use `INK_AGENT_RESULT / 1`, detached JSON-safe receipts and stable created refs. `COMMITTED_WITH_ERROR` keeps its committed identity and receipts. Missing authority, invalid input and thrown errors are explicit failures; raw binary output cannot escape the envelope.

## One browser chain

The existing positive handoff/decomposition regression sequence now enters through named tools. Existing invalid-input, cross-realm, liveness, History and provenance checks are retained. Before unrelated direct extraction and other regression edits:

1. Discover capabilities and descriptions; verify narrow import/decomposition/preview tools and unavailable external transport.
2. Construct a browser File from the existing rose-window fixture and call `import_ink_reference`.
3. Check stable Reference ref, source SHA256, History and provenance.
4. Call `decompose_ink_reference`; validate separate Color/Line layers and real returned stable Path refs.
5. Call `get_ink_preview` and materialize its existing output payload as the before PNG.
6. Choose a prominent returned Color ref and its matching Line ref by read-only inspection.
7. Propose a two-step `use_ink` plan containing only `path.repaint.v1`: Color fill, then Line stroke.
8. Verify proposal mutation-neutrality and execute-before-approval rejection; perform explicit simulated user approval in QA.
9. Execute and verify ordered successful changes, two History receipts and final Revision.
10. Capture/materialize the after preview; require different render fingerprints AND different PNG SHA256 values.
11. Bind source, refs, plan, History, Revision, output handles and files in one proof record.

No direct Document JSON writes, alternative renderer, DOM screenshot, IMAGE model or Python image processing is used in the browser proof. Existing unrelated regression tests retain their prior authorized operations.

## QA-only artifact bridge

`RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT`

A fixed, checked-in module snippet runs only inside the QA iframe to reach that realm's existing `resolveInkOutputPayload` registry. Its temporary resolver is removed after materialization. This is not a product hook or arbitrary-code API.

The existing loopback QA server accepts exactly `before` and `after` PNG slots, only for the Creative suite. Payloads are bounded to 4 MiB and 960 px per dimension. It checks PNG structure, refuses duplicate/unknown slots, writes fixed filenames and returns SHA256/byte receipts. Browser MATERIALIZED markers are emitted only after the write acknowledgment.

The batch clears stale smart artifacts before starting. Finalization re-reads both actual files and the versioned input fixture, checks hashes, dimensions, handles, stable targets, ordered repaint steps, History and Revision bindings, and writes the JSON only after validation. Exact tested SHA is mandatory.

Expected Runtime outputs:

- `evidence/smart-loop-before.png`
- `evidence/smart-loop-after.png`
- `evidence/smart-loop.json`

All 17 required `SMART_LOOP_*` markers are mandatory in the central runner. The existing Windows workflow already materializes these harness/helper paths and uploads the entire `evidence/` directory; no workflow/queue changes are needed.

## Executed focused evidence

Environment: Node `v24.19.0`.

| Check | Result |
|---|---|
| `node --test qa/ink-chat-closed-loop-001-smart-proof.test.mjs` | 8/8 PASS |
| Existing `qa/chat-validation-001-reference-handoff.test.mjs` | PASS |
| Entire original 19-tool metadata prefix vs starting source | PASS |
| Browser harness parse | PASS; included in focused QA |
| Product source/QA diff whitespace check | PASS after final EOF normalization |
| Windows browser Runtime | NOT RUN BY DEV; MR gate |
| Real smart before/after PNGs and final Runtime JSON | NOT YET PRODUCED |

Focused QA exercises File/Blob delegation and real normalization, invalid binary rejection, committed-error receipts, JSON safety, actual bounded-edit/History/Revision two-step execution, actual loopback file writes, artifact validation/tamper rejection, and harness structure. Its tiny temporary PNG fixtures test transport only; they are never reported as browser artwork evidence.

## Legacy Connector QA diagnostic comparison

Full Connector 001–004 suites were run without changing their test files:

- Starting source `2634e5481906c248ee3396bf83e2ddc7bb341cbe`: **33/36 PASS, 3 FAIL**.
- Current source: **29/36 PASS, 7 FAIL**.
- Current source plus new focused suite: **37/44 PASS, 7 FAIL**.

Four additional failures are the old exact-total assertions expecting 19 tools in Connector 001, 002, 003 and 004. The authorized result is now 20; the new focused test verifies the entire ordered 19-name prefix plus tool 20, and a separate comparison verifies all prefix metadata. The old tests are outside this Work Order's QA file allowlist and were left unchanged; the legacy command is NOT reported as passing.

The following three failures reproduce on unmodified starting source:

1. Connector-002 `preview scope planning obeys hard dimension/pixel bounds and optional refs never change the rendered crop` — expected missing-ref diagnostic mismatch.
2. Connector-002 `source boundary preserves existing renderer/export authority, no UI/export transport or external transport, FORMAT_VERSION 4` — inherited Boolean assertion mismatch.
3. Connector-004 `composition.propose and inspect are document/history/revision mutation-neutral and match direct Chat Creative Plan proposal identity` — two independently built fixture plans have differing fingerprints.

No inherited authority was changed to conceal these failures. MR should account for the old count assertions and baseline failures separately from this task's focused evidence.

## Remaining acceptance

Per Work Order I: exact-HEAD source review → Windows self-hosted UI/Creative/Geometry PASS → 17/17 smart markers → all three real artifacts → exact tested SHA → MR retrieves both PNGs into CHAT.

`SMART_REFERENCE_COLOR_LINE_CHAT_CLOSED_LOOP = NOT_YET_ACCEPTED`

`DEV_HANDOFF → STOP → MR REVIEW`
