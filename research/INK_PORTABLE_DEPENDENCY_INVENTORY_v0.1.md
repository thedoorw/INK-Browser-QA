# INK Portable Dependency Inventory v0.1

Task: `INK-CLOUD-016`  
Branch: `work/ink-cloud-016`  
Phase: `A — Portable dependency inventory`

## Result

The current portable/static entry path still converges on the same authoritative modular runtime:

```text
index.html
  → src/ink.js

index-standalone.html
  → dist/ink.compat.js
  → dynamic import ../src/ink.js
```

There is no second editor/document runtime in the standalone entry.

## Dependency classification

| Class | Current dependencies |
|---|---|
| `SHARED_CORE` | `src/ink.js`; `src/core/`; `src/document/`; `src/history/`; `src/editor/`; `src/vector/`; `src/extraction/`; `src/render/`; input/spatial/stroke/paint/composition modules used by the editor; accepted Revision and CHAT controllers |
| `STATIC_LOCAL` | `index.html`; `index-standalone.html`; `styles.css`; `service-worker.js`; `manifest.webmanifest`; `dist/ink.compat.js`; vendored browser libraries; local assets |
| `OPTIONAL_REMOTE` | AI provider transports in `src/ai/chat-runtime.js` such as `HTTPModelAdapter`, `OpenAICompatibleAdapter`, and `CustomEndpointAdapter`. They are not imported by the accepted CHAT bounded-edit or creative-plan authorities and are guarded by local-only/provider configuration. |
| `PACKAGE_ONLY` | final single-file `INK.html`, package checksum/status payloads, and `package/ink-current` delivery artifacts. They are not runtime dependencies of `product/source` and are outside this task. |

## Authoritative runtime ownership

`src/ink.js` creates one active structured document, one `InkStore`, and one `HistoryManager`.

The accepted creative-loop install order is deterministic:

```text
Studio
→ Extraction
→ Path Editing
→ Expressive Stroke
→ Repaint / Material
→ Revision
→ CHAT bounded edit
→ CHAT creative plan
→ Creative Workspace
```

Revision reuses the same browser-local `InkStore`; CHAT bounded edit and creative plan delegate to existing editor/History/Revision authorities. Creative Workspace is installed last as a controller/view over those authorities.

## Persistence / collaboration dependencies

- document serialization authority: `src/document/model.js`, migration/integrity, and `file-envelope.js`;
- browser-local persistence: `src/document/storage.js` using IndexedDB with localStorage/memory fallback;
- History: `src/history/history.js`;
- Revision: `src/document/revision.js`, using file envelope + InkStore;
- CHAT bounded edit: `src/editor/chat-bounded-edit.js`, no remote transport import;
- CHAT multi-step plan: `src/editor/chat-creative-plan.js`, no remote transport import;
- workspace: `src/editor/creative-workspace.js`, explicitly reports `staticBrowserLocal: true` and `remoteServiceRequired: false`.

## Static-shell findings

The source tree contains 174 JavaScript modules under `product/source/src`.

The current service-worker shell lists 90 static entries. A source-tree comparison found 91 source JavaScript files absent from the precache list, including dependencies directly reachable from the current entry graph such as:

- `src/core/stable-id.js`;
- `src/document/components.js`;
- `src/document/file-envelope.js`;
- `src/document/hierarchy.js`;
- `src/document/layout.js`;
- `src/editor/bounds.js`;
- the current `src/extraction/` implementation;
- `src/flora/index.js` and its current implementation graph;
- `src/vendor/imagetracer-1.2.6.js`.

This does not create a second core, but it prevents the service-worker shell from being a deterministic closure of the current modular runtime.

A second concrete defect is present:

```text
service-worker.js APP_SHELL
→ ./icons/ink-192.png
→ ./icons/ink-512.png
```

`product/source/icons/` does not exist on this branch. `manifest.webmanifest` references the same missing icon paths. Because the service worker uses `cache.addAll(APP_SHELL)`, either missing response rejects the installation transaction.

## Phase A disposition

```text
PORTABLE_DEPENDENCY_INVENTORY = COMPLETE
SHARED_CORE_IDENTITY = PRESERVED
MANDATORY_REMOTE_DEPENDENCY_FOUND = 0
SECOND_EDITOR_CORE_FOUND = 0
STATIC_SHELL_GAP = CONFIRMED
SERVICE_WORKER_INSTALL_BLOCKER = CONFIRMED
FORMAT_VERSION_CHANGE_REQUIRED = NO
PACKAGE_MUTATION_REQUIRED = NO
HARD_STOP = NO
```

The discovered defects are bounded static integration defects authorized for correction in later phases of INK-CLOUD-016.
