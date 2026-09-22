# INK Runtime Automation 001 — Central Queue & Auto Dispatch Report v0.1

STATUS: `DEV_SOURCE_READY / WINDOWS_RUNTIME_PENDING_MR_PROMOTION`

## Scope

This change centralizes Runtime scheduling without changing INK product source,
document/schema behavior, UI layout, History, Revision, Geometry, renderer or
`FORMAT_VERSION = 4`.

## Delivered contract

`ACTIVE/INK_RUNTIME_QUEUE.json` is the deterministic governance/runtime queue.
It records:

- schema/version and queue state;
- exact target SHA;
- pending and covered Work Order IDs;
- bounded batch policy: default 3, allowed 2–4;
- explicit high-risk immediate-run reason;
- last run ID, tested SHA and result.

The initial queue is `IDLE`; it cannot start Runtime.

## Dispatch behavior

The single central workflow remains:

`.github/workflows/ink-runtime-batch-windows.yml`

Automatic path:

```text
main changes ACTIVE/INK_RUNTIME_QUEUE.json
→ lightweight controller reads that exact push revision
→ non-READY: Windows job skipped
→ READY: validate policy + exact target SHA + Git object existence
→ pass pinned SHA to serialized self-hosted Windows job
```

No `product/source/**` push trigger exists. Ordinary main/DEV pushes do not run
the full Windows Runtime.

Manual fallback:

```text
workflow_dispatch with blank target_ref
→ resolve main once
→ pin exact SHA
→ run the same Windows batch
```

An explicit SHA/ref remains available only as an advanced/debug override. The
user no longer needs to copy and paste a SHA for the fallback.

## Preserved Runtime properties

- runner: `[self-hosted, Windows, X64]`;
- git-free bounded Git blob materialization;
- exact blob integrity checks;
- UI + Creative + Geometry suites;
- `FORMAT_VERSION = 4` validation;
- `shell: false` and `windowsHide: true`;
- per-suite JSON/logs, batch report and exact-revision artifact;
- serialized concurrency with no in-progress cancellation;
- temporary-source cleanup;
- no PowerShell policy change or bypass;
- no TinyFish or external browser-agent dependency.

## Source/static evidence

Command:

```text
node qa/runtime/ink-runtime-automation-001-static.test.mjs
```

Verified:

- blank manual path resolves main exactly once;
- explicit override remains;
- `ACCUMULATING` skips the Windows job;
- normal `READY` starts with 2–4 items;
- high-risk `READY` may start with one item only when reason is explicit;
- malformed target SHA is rejected;
- queue target SHA is passed unchanged into materialization/evidence;
- queue-only main push trigger;
- batch policy 3 / 2–4;
- no external browser agent or forbidden PowerShell policy mutation;
- existing UI/Creative/Geometry helper and `FORMAT_VERSION` guard remain;
- all embedded GitHub Script bodies parse.

Additional checks:

```text
workflow YAML parse = PASS
existing run-ink-runtime-batch.mjs syntax = PASS
```

## Changed files

```text
ACTIVE/INK_RUNTIME_QUEUE.json
.github/workflows/ink-runtime-batch-windows.yml
qa/runtime/ink-runtime-automation-001-static.test.mjs
governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md
research/INK_RUNTIME_AUTOMATION_001_CENTRAL_QUEUE_AUTO_DISPATCH_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
```

## Remaining acceptance gate

This DEV branch does not claim Runtime PASS. Per Work Order, MR must first review
and clean-promote the accepted source, then run one real self-hosted Windows test
through the central zero-text/queue path. Required final evidence remains UI,
Creative and Geometry PASS plus artifact exact tested SHA.
