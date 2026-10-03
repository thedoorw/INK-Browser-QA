# INK Runtime Bridge + GitHub Connector — Phase 1 Workpack v0.1

STATUS: READY FOR USER / MR REVIEW — NOT AUTHORIZED TO IMPLEMENT YET

DATE: 2026-10-03

OWNER: INK Runtime Bridge / GitHub Connector DEV after USER authorization

UPSTREAM:
- research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PLAN_v0.1.md
- research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_ARCHITECTURE_v0.1.md
- ACTIVE/INK_RUNTIME_BRIDGE_CONNECTOR_NEW_WINDOW_HANDOFF_v0.1.md
- ACTIVE/INK_CURRENT_WORK_ORDER.md

## 1. Objective

Implement the smallest read-only proof that a normal user-opened INK Web Runtime can discover a GitHub SSOT request and dispatch it through the existing inkPublicApi.

Required proof:

~~~text
CHAT writes GitHub request
→ user's normal INK WEB Runtime Bridge discovers request
→ validates session / source / expiry / idempotency
→ inkPublicApi.tools.invoke("get_ink_context")
→ structured result exists inside that Runtime
~~~

Phase 1 does not write the result back to GitHub.

No GitHub credential is present in the page.

Phase 2 owns authenticated result return.

## 2. Hard scope

Phase 1 MAY:

- add a thin Runtime Bridge module;
- add request protocol validation;
- add one read-only GitHub mailbox transport;
- wire the bridge after inkPublicApi installation;
- add focused QA/tests/evidence;
- add ACTIVE/INK_RUNTIME_REQUEST.json as the proof mailbox.

Phase 1 MUST NOT:

- add mutation tools;
- change existing proposal/approval/execute behavior;
- change public-creative-api.js unless a concrete blocker is proven and separately reviewed;
- add a GitHub PAT/token/client secret/private key to Web source;
- deploy a relay;
- build an extension;
- delete or modify the hosted browser runner;
- change .github/workflows/ink-live-chat-request.yml;
- touch UI PR #109 / PWA / C06 / New Document;
- change FORMAT_VERSION=4;
- add Workflow IR;
- emulate pointer/mouse input.

## 3. Start gate

Before implementation:

1. update from latest main;
2. record exact starting commit;
3. verify concurrent owners and do not overwrite unrelated work;
4. verify current Live BUILD_INFO.json separately;
5. create a dedicated work branch;
6. keep Phase 1 source diff bounded to the files named below unless DEV return explains a blocker.

Suggested branch:

- work/runtime-bridge-github-readonly-001

## 4. Proposed files

New:

- product/source/src/agent/runtime-bridge-protocol.js
- product/source/src/agent/runtime-bridge.js
- product/source/src/agent/runtime-bridge-github-read-transport.js
- qa/runtime-bridge/runtime-bridge-protocol.test.mjs
- qa/runtime-bridge/runtime-bridge-readonly.test.mjs

Minimal wiring only:

- product/source/src/agent/index.js
- product/source/src/ink.js

Proof mailbox:

- ACTIVE/INK_RUNTIME_REQUEST.json

Evidence:

- qa/evidence/runtime-bridge-phase1-001/

Return:

- working/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PHASE1_RETURN_20261003.md

Do not edit:

- product/source/src/agent/public-creative-api.js
- qa/live-chat/run-live-chat-request.mjs
- .github/workflows/ink-live-chat-request.yml

unless Phase 1 is stopped and a new USER/MR decision explicitly authorizes the deviation.

## 5. Protocol module requirements

runtime-bridge-protocol.js owns transport validation only.

Export bounded helpers for:

- request schema/version validation;
- requestId validation;
- sessionId exact match;
- expectedSourceSha exact match;
- createdAt / expiresAt parse;
- max TTL = 5 minutes;
- stale/future-date rejection;
- Phase 1 tool allowlist;
- bounded JSON input size;
- deterministic request fingerprint/hash input;
- stable rejection codes.

Phase 1 only allowed tool:

- get_ink_context

Suggested rejection codes:

- INK_RUNTIME_REQUEST_SCHEMA_INVALID
- INK_RUNTIME_REQUEST_VERSION_UNSUPPORTED
- INK_RUNTIME_REQUEST_ID_INVALID
- INK_RUNTIME_SESSION_MISMATCH
- INK_RUNTIME_SOURCE_MISMATCH
- INK_RUNTIME_REQUEST_EXPIRED
- INK_RUNTIME_REQUEST_TIME_INVALID
- INK_RUNTIME_REQUEST_TTL_EXCEEDED
- INK_RUNTIME_TOOL_NOT_ALLOWED
- INK_RUNTIME_INPUT_INVALID
- INK_RUNTIME_REQUEST_DUPLICATE
- INK_RUNTIME_REQUEST_ID_CONFLICT

No code evaluation is accepted from the request.

## 6. Runtime Bridge requirements

runtime-bridge.js must install only after app.inkPublicApi exists.

Required public surface:

~~~text
window.INK_APP.runtimeBridge.status()
window.INK_APP.runtimeBridge.checkNow()
window.INK_APP.runtimeBridge.inspectLast()
~~~

Names may be adjusted during implementation only if the same functions remain clear and bounded.

### status()

Returns JSON-safe non-secret state:

- schema/version;
- ready;
- sessionId;
- sourceSha;
- bridgeVersion;
- publicApi schema/version;
- tool count;
- last requestId;
- last terminal state.

### checkNow()

Performs exactly one request discovery attempt.

No interval is required for Phase 1.

If a timer is added for QA convenience:
- minimum interval must be conservative with unauthenticated GitHub REST limits;
- it must be disabled by default;
- explicit backoff/rate-limit handling is required.

### inspectLast()

Returns the last locally retained request/result/rejection record.

It does not expose any credential because Phase 1 has none.

## 7. Session identity

Generate sessionId using browser cryptographic randomness.

Phase 1 lifetime:

- one loaded Runtime instance;
- new full reload = new sessionId;
- new tab = new sessionId;
- tab close = Runtime Bridge ends.

Do not store sessionId in IndexedDB/localStorage for Phase 1.

The goal is to make an old GitHub request unaddressable after reload.

## 8. Source identity

Read actual Runtime source SHA from:

- meta[name="ink-live-source-sha"]

Bridge must not report READY if:

- inkPublicApi.tools.invoke is absent; or
- source SHA is absent/invalid.

The request expectedSourceSha is mandatory in Phase 1 and must match before tools.invoke().

No copied status document SHA may override loaded Runtime identity.

## 9. GitHub read transport

runtime-bridge-github-read-transport.js is read-only.

Repository:

- thedoorw/INK-Browser-QA

Branch:

- main

Path:

- ACTIVE/INK_RUNTIME_REQUEST.json

Use public GitHub repository content read only.

No Authorization header.
No OAuth.
No App token.
No PAT.

Phase 1 should prefer an explicit one-shot fetch through checkNow() rather than continuous polling.

Reason:
- unauthenticated GitHub REST public-data requests are rate-limited;
- Phase 1 is a capability proof, not the final daily transport.

Transport returns:
- parsed request JSON;
- observed GitHub blob SHA if available;
- fetch timestamp;
- HTTP/rate-limit diagnostics needed for evidence.

It does not commit anything.

## 10. Idempotency

Runtime Bridge maintains a bounded in-memory ledger keyed by requestId.

For each requestId store:

- request fingerprint;
- requestId;
- terminal status;
- completion/rejection timestamp;
- compact result/rejection metadata.

Rules:

1. unseen valid request → invoke once;
2. seen request + same fingerprint → do not invoke again; return duplicate terminal record;
3. seen request + different fingerprint → reject REQUEST_ID_CONFLICT.

get_ink_context is read-only, but Phase 1 must still prove the replay guard before mutation is ever authorized.

## 11. Dispatch

The only dispatch call under Phase 1 is equivalent to:

~~~text
await Promise.resolve(
  app.inkPublicApi.tools.invoke("get_ink_context", request.input || {})
)
~~~

Do not call internal Document/Renderer APIs.

Do not add a bridge-specific context implementation.

The returned object must remain the existing INK_AGENT_RESULT.

Runtime Bridge may wrap it only with transport metadata.

## 12. Proof request

The Phase 1 mailbox request must be generated after the candidate Runtime session is known.

Required shape:

~~~json
{
  "schema": "INK-RUNTIME-REQUEST",
  "version": 1,
  "requestId": "runtime-bridge-phase1-context-001",
  "sessionId": "<exact-current-runtime-session>",
  "expectedSourceSha": "<exact-candidate-or-deployed-source-sha>",
  "createdAt": "<ISO-8601>",
  "expiresAt": "<within-5-minutes>",
  "tool": "get_ink_context",
  "input": {
    "maxObjects": 30
  }
}
~~~

Do not use a mutation tool in Phase 1.

## 13. Required automated tests

Protocol tests:

1. valid request accepted;
2. wrong schema rejected;
3. wrong version rejected;
4. malformed requestId rejected;
5. wrong session rejected;
6. wrong source rejected;
7. expired request rejected;
8. excessive TTL rejected;
9. mutation tool rejected;
10. non-object/oversized input rejected;
11. duplicate identical request does not re-dispatch;
12. duplicate ID/different payload rejected.

Runtime tests:

13. bridge not READY before public API;
14. bridge READY after public API;
15. get_ink_context invokes existing tools.invoke exactly once;
16. returned agent result is preserved;
17. reload/new bridge instance gets a new sessionId;
18. no credential-like field is stored/exposed.

## 14. Browser qualification

Phase 1 is not closed by unit tests alone.

Required normal-browser proof:

1. open normal INK Web;
2. confirm Runtime Bridge READY;
3. capture sessionId and exact loaded sourceSha;
4. CHAT writes a matching GitHub request;
5. invoke checkNow() in that same normal browser Runtime;
6. verify get_ink_context returns COMPLETED;
7. invoke checkNow() again against the same request;
8. verify no second tools.invoke execution;
9. write a wrong-session request and verify rejection;
10. write an expired request and verify rejection;
11. write a wrong-source request and verify rejection;
12. reload the page;
13. verify a new sessionId;
14. verify the old request cannot execute against the new Runtime.

The operation under qualification must execute in the user's normal INK Web Runtime.

The GitHub Actions hosted browser may be used only for independent regression evidence, not as a substitute for this Runtime proof.

## 15. Evidence

Record at minimum:

- source starting SHA;
- candidate SHA;
- loaded Runtime source SHA;
- bridge status before request;
- exact request JSON;
- request GitHub commit/blob identity;
- returned get_ink_context result;
- duplicate check evidence;
- wrong-session rejection;
- expired rejection;
- wrong-source rejection;
- post-reload new session identity;
- diff proving no token/secret;
- diff proving FORMAT_VERSION unchanged;
- diff proving hosted runner/workflow unchanged.

No screenshots are required unless they materially help prove the normal-browser Runtime identity.

## 16. Regression gate

Run focused existing tests sufficient to prove:

- public-creative-api still installs and exposes the existing tool registry;
- get_ink_context behavior is unchanged;
- bounded edit proposal/approval/execute source is untouched;
- no History/Renderer/Document authority changes;
- normal INK boot succeeds.

Do not reopen closed capability qualification.

## 17. PASS criteria

All required:

~~~text
P1_BRIDGE_READY = PASS
P1_UNIQUE_SESSION = PASS
P1_EXACT_SOURCE_IDENTITY = PASS
P1_GITHUB_REQUEST_DISCOVERY = PASS
P1_GET_INK_CONTEXT_VIA_EXISTING_PUBLIC_API = PASS
P1_DUPLICATE_NO_REEXECUTION = PASS
P1_WRONG_SESSION_REJECTED = PASS
P1_EXPIRED_REJECTED = PASS
P1_WRONG_SOURCE_REJECTED = PASS
P1_RELOAD_OLD_REQUEST_BLOCKED = PASS
P1_GITHUB_CREDENTIAL_IN_PAGE = NONE
P1_PRODUCT_AUTHORITY_FORK = NONE
P1_HOSTED_RUNNER = UNCHANGED
P1_FORMAT_VERSION = 4 / UNCHANGED
~~~

## 18. STOP conditions

STOP and return to USER/MR if any of these become necessary:

- changing public-creative-api semantics;
- storing a token/secret in public Web;
- adding mutation to Phase 1;
- deploying a relay/backend;
- requiring extension/local-helper installation;
- changing hosted runner/workflow;
- changing FORMAT_VERSION;
- touching UI/PWA/C06/New Document;
- introducing a new INK authority.

## 19. Phase 1 return

Create:

- working/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PHASE1_RETURN_20261003.md

Return must include:

- exact branch/head;
- exact source diff;
- all test results;
- browser evidence;
- request/rejection receipts;
- unresolved findings;
- explicit statement that no authenticated result return exists yet.

Then:

~~~text
STOP → USER / MR REVIEW
NEXT AUTHORIZATION = Phase 2 authenticated return adapter
~~~

No Phase 2 implementation may start automatically.
