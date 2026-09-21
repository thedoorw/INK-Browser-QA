# INK-CLOUD-018 PowerShell Runtime Runbook

Purpose: run the first visible INK Web platform on the user's Windows computer without GitHub Actions and without any external proxy.

## Architecture

```text
GitHub repository checkout
→ PowerShell
→ local static HTTP server on 127.0.0.1
→ Chrome / Edge
→ product/source/index.html
```

No cloud backend is required for the editor core.

## Why HTTP is required

Do not open `product/source/index.html` with `file://`.

INK uses ES modules, a web manifest and Service Worker behavior. The supported local validation path is a local HTTP origin such as:

`http://127.0.0.1:4173/`

## Step 1 — open PowerShell in the repository root

Expected repository folder contains:

- `README.md`
- `product/source/index.html`
- `qa/runtime/start-ink-local.ps1`

## Step 2 — start INK

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\start-ink-local.ps1
```

Default URL:

`http://127.0.0.1:4173/`

The script binds only to `127.0.0.1`.

If port 4173 is busy:

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\start-ink-local.ps1 -Port 4174
```

Keep this PowerShell window open while testing.

## Step 3 — preflight from a second PowerShell window

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\check-ink-local.ps1
```

For a different port:

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\check-ink-local.ps1 -BaseUrl http://127.0.0.1:4174
```

Expected final line:

`PRECHECK = PASS`

## Step 4 — browser smoke test

Open the URL in Chrome or Edge and verify:

1. INK shell renders.
2. Canvas renders.
3. no fatal module-load error is visible.
4. Creative Workspace control is present and opens.
5. image import dialog opens.
6. no login is required.

Do not proceed to Rose Window functional QA until these pass.

## Step 5 — browser developer console checkpoint

Open DevTools → Console.

Record:

- fatal red errors, if any;
- Service Worker registration status;
- page URL;
- `window.INK_ARCHITECTURE` result if available.

Useful console checks:

```js
location.href
window.INK_ARCHITECTURE
navigator.serviceWorker?.controller?.scriptURL
```

## Step 6 — Rose Window runtime QA

After the 018 web integration is ready:

1. import the 1086 × 1448 Rose Window;
2. run Direct Extraction;
3. verify editable Path result;
4. change overlay opacity;
5. inspect Path/node/provenance diagnostics;
6. exercise optional Structure-Aware reconstruction;
7. perform one bounded edit;
8. capture Revision;
9. restore Revision;
10. open CHAT surface and bind current document context;
11. verify mutation still requires explicit approval.

## Evidence to return to MR

Copy/paste the following values:

```text
POWERSHELL_VERSION =
LOCAL_URL =
PRECHECK =
BROWSER =
INK_SHELL =
CANVAS =
CREATIVE_WORKSPACE =
IMAGE_IMPORT =
CONSOLE_FATAL_ERRORS =
SERVICE_WORKER =
ROSE_WINDOW_IMPORT =
DIRECT_EXTRACTION =
OVERLAY =
EDITABLE_PATH =
STRUCTURE_AWARE =
CHAT_CONTEXT =
CHAT_APPROVAL_BOUNDARY =
REVISION_CAPTURE_RESTORE =
NOTES =
```

Screenshots are optional but useful if the visible UI is wrong.

## Security / deployment notes

- No API key belongs in the repository.
- Local editor runtime does not require an external service.
- Remote AI remains optional.
- The local server intentionally exposes only the repository's `product/source` directory on loopback.
- This runbook does not mutate `package/ink-current`.
