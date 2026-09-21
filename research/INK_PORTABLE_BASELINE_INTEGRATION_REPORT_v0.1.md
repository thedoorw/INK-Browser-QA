# INK Portable Baseline Integration Report v0.1

Task: `INK-CLOUD-016`  
Branch: `work/ink-cloud-016`  
Target gate: `PORTABLE_SHARED_CORE_INTEGRITY_WORKS`  
Runtime QA: `DEFERRED`

## 1. Executive result

The evolved INK creative-loop shared core remains portable/static and browser-local.

Both static entries converge on the same authoritative `product/source/src/ink.js`; no second editor/document/History/Revision core was introduced. Persistence, Revision, CHAT bounded edit, CHAT multi-step plan, and Creative Workspace remain on the accepted shared authorities.

One bounded portable integration defect was found and corrected:

1. the service-worker precache list no longer matched the current modular source tree;
2. two nonexistent PWA icon paths caused `cache.addAll(APP_SHELL)` installation failure.

The correction is limited to:

- `product/source/service-worker.js`
- `product/source/manifest.webmanifest`

No `product/source/src/**` shared-core implementation changed.

## 2. Portable dependency result

Evidence:

`research/INK_PORTABLE_DEPENDENCY_INVENTORY_v0.1.md`

Classification:

| Class | Result |
|---|---|
| `SHARED_CORE` | one authoritative `src/ink.js` + existing document/editor/history/revision/extraction/render/vector modules |
| `STATIC_LOCAL` | HTML entries, CSS, service worker, manifest, compat bootstrap, vendored browser-local assets |
| `OPTIONAL_REMOTE` | model-provider transports in `src/ai/chat-runtime.js`; not required by local editor/CHAT execution |
| `PACKAGE_ONLY` | final package/single-file delivery artifacts; untouched by this task |

```text
MANDATORY_REMOTE_DEPENDENCY = 0
SECOND_EDITOR_CORE = 0
SECOND_DOCUMENT_CORE = 0
SECOND_HISTORY_CORE = 0
SECOND_REVISION_CORE = 0
```

## 3. Static/portable load closure

Implementation checkpoint:

`7811cd37619a8ec864aa7de2dc2f89183fa4aca2`

The service worker now contains a deterministic `SOURCE_SHELL` inventory synchronized to the current `product/source/src` JS/JSON tree.

Exact branch verification:

```text
product/source/src JS+JSON entries    175
SOURCE_SHELL entries                  175
missing                               0
extra                                 0
service-worker syntax                 PASS
manifest parse                        PASS
invalid icon precache refs            0
index.html → src/ink.js               PASS
index-standalone → compat → src/ink.js PASS
deterministic install sequence        PASS
FORMAT_VERSION                        4
```

The manifest no longer advertises nonexistent icon assets.

## 4. Persistence + History + Revision compatibility

Evidence:

`qa/core/evidence/INK_CLOUD_016_PHASE_C_COMPATIBILITY.txt`

Exact branch source/static checks: `14 / 14 PASS`.

Verified boundaries:

- structured document still uses `FORMAT_VERSION = 4`;
- file-envelope wrap/unwrap authority remains in `src/document/file-envelope.js`;
- `InkStore` remains browser-local using IndexedDB with local fallbacks;
- `src/ink.js` constructs one `InkStore` and one `HistoryManager`;
- Revision is installed with the same `this.store`;
- Revision capture/restore retains `RESET_TO_REVISION`;
- no branch change exists under `product/source/src/**`.

## 5. CHAT local collaboration compatibility

Verified:

- `ChatBoundedEditController` remains local and approval-gated;
- bounded edits reuse the existing History/editor authorities;
- `ChatCreativePlanController` retains explicit plan approval and bounded-edit delegation;
- `CreativeWorkspaceController` remains an adapter/view;
- workspace state declares `staticBrowserLocal: true`;
- workspace state declares `remoteServiceRequired: false`;
- persistence/Revision/CHAT local-core files contain no mandatory fetch/XHR/WebSocket/EventSource transport.

Remote model provider adapters remain optional and retain local-only/endpoint guards.

## 6. Portable integration harness

Harness:

`qa/core/tests/unit/portable-baseline-integration-v0.1.test.mjs`

Evidence:

`qa/core/evidence/INK_CLOUD_016_PORTABLE_INTEGRATION_HARNESS.txt`

The deterministic Node harness covers:

- full static source-shell inventory;
- local import/export path resolution;
- entry convergence;
- install sequence;
- document file-envelope roundtrip;
- History undo/redo;
- Revision capture/restore;
- CHAT local-controller presence;
- mandatory-remote absence;
- `FORMAT_VERSION = 4`.

Executed during this DEV session:

```text
exact Git tree ↔ SOURCE_SHELL closure           PASS
static entry/install checks                     10 / 10 PASS
persistence/collaboration source checks         14 / 14 PASS
exact branch harness: node --check              PASS
```

Not executed or claimed:

```text
full node --test from a materialized checkout   DEFERRED
browser/service-worker runtime interaction QA   DEFERRED
```

The reason is environmental: this session has GitHub connector access but no materialized branch checkout/network clone, while GitHub Actions is quota-exhausted. This matches the work-order runtime-QA deferral; the committed harness is runnable directly from a repository checkout.

## 7. Final branch boundary

Final pre-report branch diff against `main`:

```text
branch status                  ahead
behind                         0
package/** changes             0
product/source/src/** changes  0
product source changes         service-worker.js, manifest.webmanifest only
FORMAT_VERSION                 4
```

No package/release artifact was mutated. DEV did not merge `main`.

## 8. Acceptance matrix

| Acceptance item | DEV result |
|---|---|
| `PORTABLE_DEPENDENCY_INVENTORY` | `COMPLETE` |
| `STATIC_MODULE_CLOSURE` | `VERIFIED` — Git tree/shell closure + entry wiring; full Node resolver execution deferred |
| `SHARED_CORE_REUSED` | `VERIFIED` |
| `DOCUMENT_PERSISTENCE_COMPATIBILITY` | `VERIFIED` |
| `HISTORY_AUTHORITY_PRESERVED` | `VERIFIED` |
| `REVISION_COMPATIBILITY` | `VERIFIED` |
| `CHAT_BOUNDED_EDIT_LOCAL` | `VERIFIED` |
| `CHAT_MULTI_STEP_LOCAL` | `VERIFIED` |
| `MANDATORY_REMOTE_DEPENDENCY` | `0` |
| `SECOND_EDITOR_CORE` | `0` |
| `FORMAT_VERSION` | `4` |
| `PACKAGE_MUTATION` | `0` |
| `MAIN_MERGE` | `0` |
| `RUNTIME_QA` | `DEFERRED` |

## 9. Gate disposition

```text
PORTABLE_SHARED_CORE_INTEGRITY_WORKS = DEV_EVIDENCE_PASS
HARD_STOP = NO
DEV_WORK = COMPLETE
NEXT_AUTHORITY = MR_REVIEW
```

DEV does not authorize merge, package promotion, certification, or the next task.
