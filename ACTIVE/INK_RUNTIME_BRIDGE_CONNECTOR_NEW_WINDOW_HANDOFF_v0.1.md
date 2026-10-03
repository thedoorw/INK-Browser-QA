# INK Runtime Bridge + GitHub Connector — New Window Handoff v0.1

STATUS: `NEW WINDOW / R&D OWNER`

DATE: 2026-10-03

## Mission

Design the smallest safe path from the already-proven CHAT-operated Live test lane to direct control of the user's open INK Web Runtime.

Authoritative plan:
- `research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PLAN_v0.1.md`

## Required reading

- `README.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`
- `ACTIVE/INK_LIVE_TEST_PROGRESS.md`
- `research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PLAN_v0.1.md`
- `.github/workflows/ink-live-chat-request.yml`
- `qa/live-chat/run-live-chat-request.mjs`
- `product/source/src/agent/public-creative-api.js`

Also inspect current Live `BUILD_INFO.json`.

## Current proven baseline

The current lane already proves:

```text
CHAT
→ GitHub SSOT request
→ GitHub Actions hosted browser runner
→ Live INK
→ window.INK_APP.inkPublicApi
→ named tools / native authorities
→ structured result
→ GitHub SSOT
→ CHAT
```

The hosted runner is a temporary `ubuntu-latest` GitHub Actions environment launching Chrome/Chromium and calling the Runtime through CDP. It is not the user's local browser.

The new architecture should preserve `inkPublicApi` and replace only the transport/runtime-host role for daily CHAT control.

## First assignment

Phase 0 only:

1. map current hosted-runner transport;
2. design an INK WEB `Runtime Bridge` that is only a relay to existing `inkPublicApi`;
3. design the GitHub request/result mailbox protocol;
4. compare GitHub App / OAuth / thin relay / extension-local-helper only as needed for safe browser authentication;
5. explicitly prove why no credential can be embedded in public INK JavaScript;
6. define request/session/idempotency/expiry/source-SHA guards;
7. identify exact source files/modules that would be added or changed;
8. produce an implementation workpack for Phase 1 read-only proof;
9. STOP → USER / MR review.

Do not implement product mutation in Phase 0.

## Hard boundaries

- GitHub remains SSOT.
- Hosted browser runner remains QA infrastructure; do not delete it.
- No second Document/History/Renderer/Recipe/Material authority.
- No pointer/mouse emulation.
- No Workflow IR.
- Do not reopen Cluster C, Cluster D, C019, B3 or advanced mutable raster ingest.
- Do not touch UI PR #109, PWA, C06 or New Document.
- Do not change `FORMAT_VERSION=4`.
- Never commit PAT, App private key, OAuth client secret or long-lived token into INK Web/public repo.
- If safe GitHub result write requires backend/relay/extension or any recurring paid service, document it and STOP for user decision before implementation.

## Required Phase 0 output

Create:
- `research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_ARCHITECTURE_v0.1.md`
- `working/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PHASE1_WORKPACK_v0.1.md`

Then update `ACTIVE/INK_CURRENT_WORK_ORDER.md` with:
`PHASE_0_COMPLETE / STOP → USER DECISION`.

## Short instruction

```text
你是 INK Runtime Bridge / GitHub Connector R&D。

Repo：thedoorw/INK-Browser-QA
GitHub 是唯一 SSOT。

先讀：
- research/INK_RUNTIME_BRIDGE_GITHUB_CONNECTOR_PLAN_v0.1.md
- ACTIVE/INK_RUNTIME_BRIDGE_CONNECTOR_NEW_WINDOW_HANDOFF_v0.1.md
- ACTIVE/INK_CURRENT_WORK_ORDER.md
- ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md
- ACTIVE/INK_LIVE_TEST_PROGRESS.md
- .github/workflows/ink-live-chat-request.yml
- qa/live-chat/run-live-chat-request.mjs
- product/source/src/agent/public-creative-api.js

本輪只做 Phase 0：設計 INK WEB Runtime Bridge + GitHub transport/auth architecture，沿用現有 inkPublicApi，不做第二套 authority，不刪 hosted runner，不修改正式產品。

比較 GitHub App / OAuth / thin relay / 必要時 extension-local helper；禁止把任何 secret/token 放進公開 INK Web。

完成 architecture v0.1 + Phase1 workpack 後 STOP → USER / MR review。
```
