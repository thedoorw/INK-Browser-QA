# INK First Visible Web Platform — Pre-Runtime Audit v0.1

Task: `INK-CLOUD-018`

Status: `MR_PRE_RUNTIME_PREPARATION_COMPLETE`

## Existing visible web foundation

The repository already contains a browser application:

- entrypoint: `product/source/index.html`
- primary runtime: `product/source/src/ink.js`
- styles: `product/source/styles.css`
- PWA manifest: `product/source/manifest.webmanifest`
- Service Worker: `product/source/service-worker.js`

The browser runtime already installs:

- extraction;
- Path editing;
- expressive stroke;
- repaint/material;
- bounded CHAT edit;
- multi-step CHAT plan;
- Creative Workspace;
- Revision.

Therefore INK-CLOUD-018 is an integration/runtime/deployment stage, not a new editor build.

## Existing image and Creative Workspace paths

The primary UI already exposes image import through `imageInput`.

`InkApp.importImage()` reads a browser File into an INK image object.

Creative Workspace already exposes a dedicated Reference input and delegates extraction to the accepted extraction controller.

Visible Creative Workspace stages already include:

`Reference / Edit / Compose / CHAT / Revision`

The current CHAT pane is operation-oriented. A natural-language transcript/prompt surface remains an 018 requirement.

## Static-hosting assessment

The current source is compatible in principle with static HTTP hosting:

- `index.html` imports `./src/ink.js`;
- manifest `start_url` is `./index.html`;
- manifest scope is `./`;
- Service Worker defaults to `./service-worker.js` and `./` scope;
- editor core does not require a backend;
- remote AI endpoint is optional.

Local validation must use HTTP(S), not `file://`.

## PowerShell runtime preparation

Prepared:

- `qa/runtime/start-ink-local.ps1`
- `qa/runtime/check-ink-local.ps1`
- `qa/runtime/INK_CLOUD_018_POWERSHELL_RUNTIME_RUNBOOK.md`

The local server:

- is implemented with PowerShell/.NET only;
- requires no Python, Node package install, GitHub Actions or external proxy;
- binds to `127.0.0.1` only;
- serves correct MIME types for HTML/CSS/ESM/manifest/images/WASM;
- disables browser cache at the local HTTP layer to reduce stale-source confusion during QA.

## Pre-deployment findings

### 1. Version/cache drift

Current version sources are inconsistent:

```text
product/source/src/config.js
INK_VERSION = 1.6.5-RC

product/source/index.html
visible title/brand still contains 1.5.1 RC

product/source/service-worker.js
RELEASE_VERSION = 1.5.1
```

This is not a blocker to initial local HTTP smoke testing, but it is a deployment blocker for a clean first web release because stale Service Worker cache names can obscure upgrades.

Bounded 018 fix required before final deployment.

### 2. Legacy/compat shell remains in Service Worker inventory

The Service Worker caches:

- `index.html`
- `index-standalone.html`
- `dist/ink.compat.js`
- modular ESM source closure

All referenced files currently exist.

For 018, `product/source/index.html` + modular ESM must remain the primary web entry. Do not shift authority to the standalone/compat artifact merely to simplify deployment.

### 3. CHAT distinction

The shared runtime contains provider/context/credential abstractions, and Creative Workspace exposes bounded CHAT operations and multi-step plan approval.

What is not yet established as a user-facing platform is a normal natural-language conversation surface tied to that runtime.

018 must add that surface without bypassing:

- context boundary;
- proposal/plan validation;
- explicit approval;
- History/Revision;
- credential safety.

## Gate sequencing recommendation

```text
pre-runtime static preparation
→ local PowerShell HTTP preflight
→ bounded web integration
→ local browser runtime QA
→ Rose Window visible case
→ deployment preparation
→ fixed public URL
```

GitHub Actions quota is not required for this sequence.

Final 018 gate still requires actual browser runtime evidence from the user's machine or another authorized real browser runtime.
