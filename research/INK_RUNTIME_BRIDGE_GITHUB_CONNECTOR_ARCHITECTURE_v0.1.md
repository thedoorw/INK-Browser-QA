# INK Runtime Bridge + GitHub Connector Architecture v0.1

STATUS: PHASE_0_COMPLETE / ARCHITECTURE + SECURITY DECISION / STOP FOR USER-MR REVIEW

DATE: 2026-10-03

REPO: thedoorw/INK-Browser-QA

LIVE: https://thedoorw.github.io/INK/

AUTHORITATIVE INPUT:
- research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PLAN_v0.1.md
- ACTIVE/INK_RUNTIME_BRIDGE_CONNECTOR_NEW_WINDOW_HANDOFF_v0.1.md
- ACTIVE/INK_CURRENT_WORK_ORDER.md
- ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md
- ACTIVE/INK_LIVE_TEST_PROGRESS.md
- .github/workflows/ink-live-chat-request.yml
- qa/live-chat/run-live-chat-request.mjs
- product/source/src/agent/public-creative-api.js
- thedoorw/INK/BUILD_INFO.json

## 1. Decision summary

Phase 0 finds the direct-runtime architecture feasible without replacing any INK authority.

Keep:

~~~text
window.INK_APP.inkPublicApi
→ tools.invoke(name, input)
→ existing bounded proposal / approval / execute routes
→ existing Document / History / Renderer / Stroke / Raster / Material / Recipe authorities
~~~

Replace only the normal CHAT-control host/transport:

~~~text
CURRENT
CHAT
→ GitHub request commit
→ GitHub Actions ubuntu-latest
→ hosted Chromium + CDP
→ Live INK
→ inkPublicApi
→ GitHub Actions GITHUB_TOKEN writes result
→ GitHub
→ CHAT
~~~

with:

~~~text
TARGET
CHAT
→ GitHub SSOT mailbox
→ user's already-open INK WEB Runtime Bridge
→ inkPublicApi
→ existing native INK authorities
→ authenticated transport adapter
→ GitHub SSOT result
→ CHAT
~~~

The hosted browser runner remains available for independent QA/regression and is not deleted.

The recommended final authentication architecture is:

~~~text
GitHub App
+ thin relay / auth broker
+ short-lived Runtime session capability
+ GitHub mailbox as SSOT
~~~

The relay holds the GitHub App private key / installation credentials. Public INK Web never receives the App private key, OAuth client secret, PAT, refresh token, or installation token.

If USER requires zero hosted relay/backend, the supported fallback is:

~~~text
GitHub App
+ extension/local helper
+ credential isolated from the public page
+ narrow postMessage/local bridge to INK Runtime Bridge
~~~

Directly storing a GitHub credential in the public INK page is rejected.

Phase 1 can remain read-only and credential-free by reading the public GitHub request mailbox manually/on demand. This proves the Runtime Bridge before a Phase 2 authenticated write-back choice is implemented.

## 2. Baseline confirmed in Phase 0

The current Live lane already proves the creative authority boundary:

- Live INK exposes window.INK_APP.inkPublicApi.
- public-creative-api.js exposes named tools through tools.registry() and tools.invoke().
- bounded mutations continue through proposal → explicit approval → execute.
- Preview, History, Undo, Redo and structured results already route through native INK authorities.
- the hosted runner does not mouse-drive the UI; it evaluates named-tool calls in the Live page through CDP.
- the GitHub Actions workflow currently has contents: write and writes working/INK_LIVE_CHAT_RESULT.json.
- the runner validates request shape, exact Live URL and optional expectedSourceSha.
- current authoritative Live BUILD_INFO.json at Phase 0 review points to source_sha 4188e9cc7673313726abd7986310d758912f63cf and reports FORMAT_VERSION=4 / 24 named tools.

This architecture does not claim that 4188e9cc... will remain the Phase 1 candidate. Phase 1 must resolve latest main and exact candidate identity at implementation time.

## 3. Authority invariant

Runtime Bridge is transport/orchestration only.

It may:

1. identify the running Web Runtime;
2. receive a bounded JSON request;
3. validate transport/session/request guards;
4. call an allowed existing named tool through app.inkPublicApi.tools.invoke();
5. serialize the already-structured result;
6. remember request IDs for idempotency;
7. hand the result to a transport adapter.

It must not:

- mutate Document directly;
- call Renderer internals directly;
- reimplement History;
- reimplement bounded edit approval;
- translate arbitrary JavaScript from GitHub into eval;
- create a second Recipe, Material, Raster, Stroke or Selection authority;
- emulate pointer/mouse events;
- persist a GitHub credential in the page;
- continue execution after the page is closed.

The authoritative creative dispatch remains:

~~~text
Runtime Bridge
→ inkPublicApi.tools.invoke()
→ existing INK authority
~~~

## 4. Current transport map

### 4.1 Request

CHAT updates:

- ACTIVE/INK_LIVE_CHAT_REQUEST.json

Push to main triggers:

- .github/workflows/ink-live-chat-request.yml

### 4.2 Hosted runtime

The workflow:

- runs on ubuntu-latest;
- launches qa/live-chat/run-live-chat-request.mjs;
- launches Chrome/Chromium headlessly;
- opens https://thedoorw.github.io/INK/;
- waits for window.INK_APP.inkPublicApi.tools.invoke;
- verifies optional expectedSourceSha;
- invokes named tools through CDP Runtime.evaluate.

### 4.3 Result

The Actions job uses its server-side GITHUB_TOKEN / contents: write authority to update:

- working/INK_LIVE_CHAT_RESULT.json

and uploads screenshot/result evidence artifacts.

The present security property is therefore simple: the browser itself has no GitHub write credential. The write credential exists only in GitHub Actions.

The new architecture should preserve that property: the public page should still not hold a GitHub write credential.

## 5. Target transport map

### 5.1 Logical architecture

~~~text
CHAT
│
│ GitHub connector writes request
▼
GitHub SSOT
ACTIVE/INK_RUNTIME_REQUEST.json
│
│ request discovery
▼
INK WEB Runtime Bridge
│
│ exact named-tool dispatch only
▼
window.INK_APP.inkPublicApi.tools.invoke()
│
▼
existing INK native authorities
│
│ structured INK_AGENT_RESULT
▼
INK WEB Runtime Bridge
│
│ authenticated return adapter
▼
GitHub SSOT
working/INK_RUNTIME_RESULT.json
│
▼
CHAT
~~~

Optional later presence record:

- working/INK_RUNTIME_SESSION.json

This may advertise only non-secret runtime presence data such as sessionId, sourceSha, bridge version and last-seen timestamp.

### 5.2 Runtime lifetime

sessionId is a cryptographically random identifier for one loaded Runtime instance.

v0.1 rule:

- new page load/new tab = new sessionId;
- stable while that Runtime instance remains loaded;
- reload = new sessionId;
- closing the tab destroys the executing Runtime;
- no Service Worker or background worker may continue Runtime Bridge execution.

This deliberately makes stale pre-reload requests fail by wrong-session identity.

Multiple tabs therefore have different session IDs.

## 6. GitHub mailbox protocol v0.1

v0.1 keeps a single outstanding request invariant. It does not pretend to be a general message queue.

### 6.1 Request file

Path:

- ACTIVE/INK_RUNTIME_REQUEST.json

Minimum request:

~~~json
{
  "schema": "INK-RUNTIME-REQUEST",
  "version": 1,
  "requestId": "unique-request-id",
  "sessionId": "target-runtime-session-id",
  "expectedSourceSha": "40-char-source-sha",
  "createdAt": "2026-10-03T13:00:00.000Z",
  "expiresAt": "2026-10-03T13:05:00.000Z",
  "tool": "get_ink_context",
  "input": {}
}
~~~

Phase 1 requires expectedSourceSha.

Phase 1 allowlist is read-only only:

- get_ink_context

Optional additional read-only tools must be separately justified in the Phase 1 change, not silently widened.

No steps array, file payload, mutation tool or arbitrary script is needed for the Phase 1 proof.

### 6.2 Result file

Path:

- working/INK_RUNTIME_RESULT.json

Minimum result:

~~~json
{
  "schema": "INK-RUNTIME-RESULT",
  "version": 1,
  "requestId": "same-request-id",
  "sessionId": "same-runtime-session-id",
  "sourceSha": "actual-runtime-source-sha",
  "status": "COMPLETED",
  "completedAt": "ISO-8601",
  "result": {}
}
~~~

Rejection result should use status REJECTED and a stable reason code.

Recommended transport metadata after authenticated return exists:

~~~json
{
  "requestBlobSha": "GitHub blob SHA observed by bridge/relay",
  "bridgeVersion": 1
}
~~~

This binds the result to the exact GitHub request object that was consumed.

### 6.3 Single outstanding request rule

For v0.1:

- CHAT MUST wait for the prior request result/rejection before replacing the mailbox request.
- Runtime Bridge MUST compare requestId before invocation.
- duplicate requestId with identical payload MUST NOT invoke inkPublicApi twice;
- duplicate requestId with different payload MUST be rejected as REQUEST_ID_CONFLICT.

A queued/per-request directory protocol is deferred to Phase 4 only if single-mailbox operation becomes a real daily-use limitation.

## 7. Validation / replay guards

Runtime Bridge validates before dispatch, in this order:

1. schema === INK-RUNTIME-REQUEST;
2. version === 1;
3. requestId syntax and bounded length;
4. sessionId === current sessionId;
5. expectedSourceSha === actual runtime source SHA;
6. createdAt is parseable and not unreasonably future-dated;
7. expiresAt is parseable and not expired;
8. bounded TTL; recommended v0.1 maximum = 5 minutes;
9. tool is in the Phase-specific allowlist;
10. input is a JSON object and within bounded serialized size;
11. requestId has not already executed/rejected;
12. no arbitrary code/file URL/eval payload is present.

Idempotency ledger is in-memory for the loaded Runtime. Because a reload creates a new sessionId, old GitHub requests cannot address the new Runtime.

For the same live session, keep a bounded requestId ledger with at least the request hash and terminal status. A repeated identical request returns the recorded terminal state without a second tools.invoke().

## 8. Runtime/source identity

Runtime Bridge derives actual source identity from the same Live source marker already used by the hosted runner:

- meta[name="ink-live-source-sha"]

Bridge readiness must expose at least:

~~~json
{
  "schema": "INK-RUNTIME-BRIDGE-STATUS",
  "version": 1,
  "ready": true,
  "sessionId": "...",
  "sourceSha": "...",
  "publicApiSchema": "INK-PUBLIC-CREATIVE-API",
  "publicApiVersion": 1,
  "toolCount": 24
}
~~~

The bridge must refuse READY if inkPublicApi.tools.invoke is unavailable.

BUILD_INFO.json remains deployment authority. Bridge sourceSha is the loaded page identity and must agree with the deployment under qualification.

## 9. Authentication comparison

### 9.1 GitHub App + thin relay

Security:
- strongest fit for least privilege;
- App can be installed only on the INK-Browser-QA repository;
- GitHub App permissions are finer-grained than OAuth scopes;
- installation access tokens expire after one hour;
- App private key stays server-side;
- the GitHub Contents endpoint accepts GitHub App installation/user tokens with repository contents write permission;
- GitHub App single-file permission can be configured for a small set of specific mailbox paths if the chosen API path supports the required operations.

Runtime credential exposure:
- no GitHub credential in public INK Web;
- Runtime receives only an opaque, short-lived relay session capability.

Operational shape:
- relay authenticates to GitHub;
- relay reads the request or is notified of a request;
- relay forwards only validated mailbox data to the paired Runtime;
- relay accepts a structured result and commits it to GitHub;
- GitHub remains SSOT.

Cost:
- GitHub App registration is not the architecture cost driver;
- relay hosting is the only potential recurring infrastructure cost and must be chosen/approved separately;
- free-tier/serverless may be practical but is not assumed as a guarantee.

Disposition:
- RECOMMENDED for the final daily-control path if USER accepts a minimal backend/relay.

### 9.2 GitHub App directly in public INK Web

A GitHub App installation token cannot be safely minted in the page because minting it requires App private-key/JWT authority.

A GitHub App user access token can be obtained through user authorization, but putting that credential into a public single-page Runtime increases exposure to XSS/page compromise and moves credential storage into the product page.

Disposition:
- NOT RECOMMENDED for INK Web.

### 9.3 OAuth App directly in public INK Web

GitHub supports browser authorization flows and PKCE, but OAuth App access remains user-token based and is less repository-granular than GitHub App installation permissions.

GitHub security guidance notes that public clients/SPAs cannot secure client secrets and that website/web-app tokens should preferably be protected on a backend.

Disposition:
- NOT RECOMMENDED for INK Web;
- no advantage over the GitHub App + relay design for this single-repo transport.

### 9.4 Extension / local helper

A browser extension or local helper can keep the GitHub credential outside the public INK page and expose only narrow transport messages to the Runtime Bridge.

Possible authorization:
- GitHub App device/user flow or other approved local-client flow;
- token stored only in extension/local secure storage;
- page receives no GitHub token.

Advantages:
- no hosted relay;
- local execution path;
- suitable if zero backend is a hard requirement.

Costs:
- install/update friction;
- browser-specific integration and permissions;
- local credential lifecycle and refresh handling;
- additional local attack surface.

Disposition:
- ACCEPTABLE FALLBACK if USER rejects a relay.

### 9.5 PAT in page

Disposition:
- REJECTED.

No PAT or other long-lived token may be embedded in source, localStorage, IndexedDB, query strings or ordinary page JavaScript state as the normal design.

### 9.6 Existing GitHub Actions hosted runner

Disposition:
- RETAIN as QA/regression;
- not the normal direct-runtime execution host.

## 10. Why public INK Web must not own the GitHub write secret

Public INK Web source is downloadable by anyone.

Any client secret/private key committed into it is public by definition.

Even if a generated access token is not committed, a token stored in ordinary page storage or JS memory is available to code running in the page origin and increases the consequence of an XSS/supply-chain defect.

The browser page therefore must not be the long-term credential vault.

The safe split is:

~~~text
PUBLIC PAGE
session identity
request validation
inkPublicApi dispatch
structured result

PRIVATE CREDENTIAL HOLDER
GitHub App private key / installation token
or extension-local credential store
~~~

This is the central Phase 0 security boundary.

## 11. Threat model and controls

### Stale request / replay
Control:
- sessionId;
- exact requestId;
- expiry;
- expectedSourceSha;
- idempotency ledger.

### Wrong browser tab
Control:
- unique per-load sessionId.

### Wrong deployed source
Control:
- expectedSourceSha must equal loaded meta source SHA before dispatch.

### GitHub mailbox replacement race
Control:
- one outstanding request rule;
- bind result to requestId and, after authenticated transport exists, request blob SHA.

### Malicious request content
Control:
- fixed schema;
- fixed named-tool allowlist;
- JSON only;
- no eval;
- no arbitrary URL/module import;
- input size bounds.

### Mutation bypass
Control:
- Runtime Bridge never implements mutation semantics;
- Phase 3 mutation remains propose → approve → execute through existing named tools.

### Token theft from public page
Control:
- no GitHub credential in the page;
- relay or extension/helper owns credential.

### Relay compromise
Control:
- GitHub App installed only on selected repo;
- minimum mailbox permissions;
- preferably single-file paths for the mailbox;
- short-lived installation tokens;
- no Workflow permission;
- server-side secret rotation/revocation;
- validate repo, branch, path, session, request and source identity.

### Browser closed
Control:
- no background Runtime Bridge;
- no cloud runner substitution;
- request remains unexecuted until a matching user Runtime exists.

## 12. Polling / rate-limit decision

INK-Browser-QA is currently public.

GitHub REST allows unauthenticated reads of public repository content, but unauthenticated REST requests are limited to 60 requests/hour per originating IP.

Therefore Phase 1 MUST NOT implement high-frequency anonymous polling.

Phase 1 transport is one of:

- explicit checkNow() / user- or QA-triggered request fetch; or
- no faster than a conservative approximately one-minute cadence with rate-limit/backoff handling.

This is proof-only.

The final daily path should use the authenticated relay/helper and can use notification/push or authenticated polling. GitHub must remain the request/result SSOT even if the relay uses a WebSocket/SSE notification channel.

## 13. Recommended relay shape for Phase 2+

The relay is not a second INK authority.

It owns only GitHub credentialed transport.

Minimum responsibilities:

1. hold GitHub App private key/webhook secret server-side;
2. mint/refresh installation token server-side;
3. restrict installation to the selected INK repo;
4. read only the Runtime mailbox request;
5. issue a short-lived opaque Runtime pairing/session capability;
6. forward the matching request to that Runtime;
7. accept only bounded structured result payloads;
8. write the result to GitHub;
9. never interpret or execute INK creative commands itself.

Preferred App repository access:
- Only select repositories → thedoorw/INK-Browser-QA.

Preferred permissions:
- narrow mailbox access;
- no Administration;
- no Workflows;
- no Secrets;
- no Actions control.

If multiple-single-file GitHub App permission proves compatible with the required Contents API calls, prefer the three mailbox/status paths only:

- ACTIVE/INK_RUNTIME_REQUEST.json
- working/INK_RUNTIME_RESULT.json
- working/INK_RUNTIME_SESSION.json

Otherwise use repository Contents read/write as the minimum broader fallback and enforce exact-path allowlisting inside the relay.

## 14. Phase 1 exact source/module proposal

No product change is authorized by Phase 0. These are proposed Phase 1 files only.

New:

- product/source/src/agent/runtime-bridge-protocol.js
- product/source/src/agent/runtime-bridge.js
- product/source/src/agent/runtime-bridge-github-read-transport.js
- qa/runtime-bridge/runtime-bridge-protocol.test.mjs
- qa/runtime-bridge/runtime-bridge-readonly.test.mjs

Minimal existing-file wiring:

- product/source/src/agent/index.js
- product/source/src/ink.js

Mailbox fixture/proof:

- ACTIVE/INK_RUNTIME_REQUEST.json

Evidence/return paths may be created under:

- qa/evidence/runtime-bridge-phase1-001/
- working/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PHASE1_RETURN_20261003.md

Must remain unchanged in Phase 1:

- product/source/src/agent/public-creative-api.js unless an implementation blocker is proven;
- .github/workflows/ink-live-chat-request.yml;
- qa/live-chat/run-live-chat-request.mjs;
- UI PR #109;
- PWA;
- C06;
- New Document;
- FORMAT_VERSION=4.

The install order in src/ink.js should remain conceptually:

~~~text
installChatBoundedEdit(...)
installInkPublicCreativeApi(...)
installRuntimeBridge(...)
installChatCreativePlan(...)
~~~

Runtime Bridge depends on inkPublicApi; it does not replace it.

## 15. Phase boundaries

### Phase 1
Read-only Runtime Bridge proof only.

Allowed named tool:
- get_ink_context

No result write credential.

### Phase 2
Implement the USER-approved authenticated return adapter:
- recommended GitHub App + thin relay; or
- approved extension/local helper.

Add session presence/result write.

### Phase 3
Bounded mutation closed loop.

Required native route remains:
- propose_ink_edit
- approve_ink_edit
- execute_ink_edit
- get_ink_preview
- get_ink_history
- undo_ink
- redo_ink

The bridge must not collapse these into a new mutation authority.

### Phase 4
Operational decision:
- latency;
- commit noise;
- rate limits;
- reconnect/reload;
- multi-tab;
- whether single-file GitHub mailbox remains suitable for daily use.

## 16. Phase 0 conclusion

Architecture is feasible.

The key decision is not whether CHAT can reach inkPublicApi; that has already been proven.

The remaining design decision is where the GitHub write credential lives.

Recommended:

~~~text
GitHub App + thin relay
~~~

because it keeps GitHub credentials out of public INK Web while providing repository-scoped, revocable transport.

Fallback if no backend is acceptable:

~~~text
GitHub App + extension/local helper
~~~

Phase 0 does not authorize either backend deployment or product mutation.

NEXT:

~~~text
STOP → USER / MR REVIEW
USER chooses:
A. GitHub App + thin relay (recommended)
B. extension/local helper (zero hosted relay)
then authorize Phase 1 read-only implementation
~~~

## 17. External security references reviewed

Official GitHub documentation, reviewed 2026-10-03:

- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps
- https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation
- https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app
- https://docs.github.com/en/rest/repos/contents
- https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app
- https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/best-practices-for-creating-a-github-app
