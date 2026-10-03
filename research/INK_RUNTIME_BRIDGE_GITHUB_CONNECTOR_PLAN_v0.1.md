# INK Runtime Bridge + GitHub Connector Plan v0.1

STATUS: `R&D / DESIGN FIRST / NEW WINDOW OWNER`

DATE: 2026-10-03

REPO: `thedoorw/INK-Browser-QA`

LIVE: `https://thedoorw.github.io/INK/`

## 1. Goal

Replace the current daily CHAT-control transport:

```text
CHAT
→ GitHub request
→ GitHub Actions hosted browser runner
→ Live INK
→ window.INK_APP.inkPublicApi
→ GitHub result
→ CHAT
```

with a thinner direct-runtime transport:

```text
CHAT
↕
GitHub transport / Connector
↕
INK WEB Runtime Bridge
↕
window.INK_APP.inkPublicApi
↕
existing INK native authorities
```

The hosted browser runner remains available as QA / regression infrastructure. It is not deleted in v0.1.

## 2. Non-goals

Do not:
- create a second Document, History, Renderer, Selection, Recipe, Material or storage authority;
- add pointer/mouse emulation;
- redesign INK UI;
- reopen closed capability work;
- touch PWA, C06, New Document or UI PR #109 unless separately authorized;
- introduce Workflow IR;
- place a GitHub PAT, GitHub App private key, client secret or other long-lived credential in public INK source;
- change `FORMAT_VERSION=4`.

## 3. Existing assets to reuse

Already proven:
- `window.INK_APP.inkPublicApi`;
- named-tool registry and `tools.invoke()`;
- proposal → explicit approval → execute mutation authority;
- Context / Preview / History / Undo / Redo;
- exact-SHA Runtime identity checks;
- existing request/result schema patterns;
- existing runner request sequencing and reference resolution.

Current hosted implementation:
- `.github/workflows/ink-live-chat-request.yml`;
- `qa/live-chat/run-live-chat-request.mjs`;
- `ACTIVE/INK_LIVE_CHAT_REQUEST.json`;
- `working/INK_LIVE_CHAT_RESULT.json`.

## 4. Target architecture

### 4.1 INK WEB Runtime Bridge

A thin module inside the INK Web runtime.

Responsibilities only:
1. create/retain a runtime session identity;
2. expose Bridge readiness and Runtime/source identity;
3. receive a bounded transport request;
4. validate schema, session, request ID, expiry and source identity;
5. dispatch only named tools through existing `inkPublicApi.tools.invoke()`;
6. preserve proposal → approval → execute;
7. serialize structured result / error / selected output handles;
8. enforce idempotency so the same `requestId` cannot execute twice;
9. return the result through a transport adapter.

It must not implement creative/editor behavior.

### 4.2 GitHub transport

v0.1 proof may use a simple mailbox:

```text
ACTIVE/INK_RUNTIME_REQUEST.json
working/INK_RUNTIME_RESULT.json
```

CHAT uses the existing GitHub connector to write/read the mailbox.

The Runtime Bridge reads only new requests addressed to its session.

Before any write-back implementation, the new owner must resolve the browser-auth model. No secret may be embedded in the public Web app.

### 4.3 Authentication decision

Research and choose the smallest safe method for INK WEB → GitHub authenticated result write.

Compare at minimum:
- GitHub App;
- GitHub OAuth;
- a thin authenticated relay/serverless token exchange;
- browser extension/local helper only if browser-only auth cannot meet the security boundary.

Required decision criteria:
- no long-lived secret in public JS;
- repo-scoped least privilege;
- revocable authorization;
- acceptable setup friction;
- $0 or effectively $0 for the current single-user development use if practical;
- no hosted browser requirement for normal execution.

Do not implement an unsafe shortcut merely to prove the transport.

## 5. Minimal protocol

Request minimum:

```json
{
  "schema": "INK-RUNTIME-REQUEST",
  "version": 1,
  "requestId": "unique-id",
  "sessionId": "target-runtime-session",
  "expectedSourceSha": "optional-exact-sha",
  "createdAt": "ISO-8601",
  "expiresAt": "ISO-8601",
  "tool": "get_ink_context",
  "input": {}
}
```

Result minimum:

```json
{
  "schema": "INK-RUNTIME-RESULT",
  "version": 1,
  "requestId": "same-id",
  "sessionId": "same-runtime-session",
  "sourceSha": "actual-runtime-source",
  "status": "COMPLETED",
  "result": {}
}
```

For multi-step mutation proof, either:
- preserve the existing formal request step/reference model; or
- execute one request per named-tool call.

Do not invent a second mutation policy.

## 6. Phases

### Phase 0 — architecture / security spike

Deliver:
- current transport map;
- target transport map;
- authentication comparison;
- threat/secret boundary;
- exact files/modules proposed;
- recommendation.

STOP for review if the solution requires a backend/relay, extension, new paid service or new credential class.

### Phase 1 — Runtime Bridge read-only prototype

Implement only if Phase 0 is accepted.

Prove:
- Runtime Bridge initializes inside normal INK WEB;
- stable session ID;
- source/runtime identity;
- GitHub request discovery;
- duplicate/stale/wrong-session rejection;
- read-only `get_ink_context` or equivalent named-tool execution.

No mutation yet.

### Phase 2 — authenticated result return

Add accepted GitHub auth adapter.

Prove:
- result written back to GitHub;
- no secret appears in repo/source;
- failure/revocation is explicit;
- reconnect/reload does not replay an old request.

### Phase 3 — bounded mutation closed loop

Use existing named tools only.

Minimum proof:
```text
CHAT writes request
→ user's open INK WEB receives it
→ propose
→ approve
→ execute
→ Preview
→ History
→ Undo
→ Redo
→ result returned to GitHub
→ CHAT reads result
```

No GitHub Actions hosted browser may execute the operation under test.

### Phase 4 — operational decision

Measure:
- request latency;
- polling/API cost/rate-limit behavior;
- commit/history noise;
- reconnect behavior;
- multiple-tab/session behavior.

Then decide whether GitHub mailbox is acceptable for daily use or only for v0.1 proof.

## 7. v0.1 acceptance gates

All must pass:

1. User opens normal INK Web in their own browser.
2. Bridge reports READY with unique session ID and exact Runtime/source identity.
3. CHAT can address that session through GitHub.
4. Read-only named tool executes in that user's Runtime.
5. At least one bounded mutation completes via existing proposal/approval/execute.
6. Preview and History prove native INK execution.
7. Undo/Redo prove native History integration.
8. Structured result returns through GitHub.
9. Duplicate request does not execute twice.
10. Expired/wrong-session/wrong-source request is rejected safely.
11. Closing the INK tab stops execution; no cloud browser silently substitutes.
12. No GitHub secret/private key is present in public INK source or committed assets.
13. Existing hosted browser runner remains usable for independent QA.
14. `FORMAT_VERSION=4` unchanged.

## 8. Success definition

v0.1 is successful when this is proven:

```text
CHAT
→ GitHub transport
→ user's already-open INK WEB Runtime Bridge
→ inkPublicApi
→ native INK authority
→ GitHub result
→ CHAT
```

without GitHub Actions hosted Chrome being the Runtime that executes the creative operation.

## 9. First task for the new owner

Do Phase 0 only.

Do not start product mutation until the architecture/authentication decision is written and reviewed.
