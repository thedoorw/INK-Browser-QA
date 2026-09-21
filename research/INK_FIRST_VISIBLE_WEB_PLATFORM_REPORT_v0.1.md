# INK First Visible Web Platform Report v0.1

Task: `INK-CLOUD-018 — First Visible Web Platform + Rose Window Runtime v0.1`  
Branch: `work/ink-cloud-018`  
Gate: `INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS`

## 1. Result

INK-CLOUD-018 closes the first visible static Web platform over the existing INK shared core.

The accepted visible path is:

```text
existing INK browser source
→ visible static Web shell
→ reference image import
→ Direct Extraction
→ editable Path + Reference Overlay
→ optional Structure-Aware reconstruction
→ visible natural-language CHAT surface
→ bounded proposal / approval / execution
→ Revision
→ project save / reload
```

No second editor, document model, History authority, Revision authority or renderer was introduced.

Final phase state:

```text
PHASE_B = COMPLETE
PHASE_C = COMPLETE
PHASE_D = COMPLETE
PHASE_E = COMPLETE
PHASE_F = PASS
BROWSER_RUNTIME_QA = EXECUTED
PRODUCT_CORE_BOUNDED_FIX = NOT_REQUIRED
```

Preserved product decisions:

```text
DEFAULT_EXTRACTION = DIRECT_EXTRACTION
STRUCTURE_AWARE = OPTIONAL
FORMAT_VERSION = 4
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
```

## 2. Visible Web platform

The existing `product/source/index.html` remains the authoritative browser/editor entrypoint.

Phase B exposed the accepted browser/editor/Creative Workspace capabilities as the first visible INK Web shell without creating a second application.

Verified product boundary:

- existing INK canvas/editor authority reused;
- Creative Workspace visible on startup;
- Reference → Direct Extraction entry visible;
- browser-local startup retained;
- static-host-compatible relative paths retained;
- visible shell / manifest / Service Worker release identity aligned to `1.6.5-RC`;
- no mandatory sign-in or backend introduced.

## 3. Conversational CHAT surface

Phase C exposes natural-language conversation over the accepted CHAT runtime.

Visible capabilities include:

- transcript;
- natural-language prompt;
- current document context inspection;
- runtime/provider status;
- local/manual conversation without a remote provider;
- optional external provider adapter using the existing session-only credential and transmission-approval contract.

The mutation boundary remains:

```text
conversation / inspection
→ bounded proposal
→ explicit local approval
→ bounded execution
→ existing History / Revision
```

The conversation surface does not receive direct DOM, Canvas, filesystem or credential mutation authority.

## 4. Rose Window visible runtime case

The Rose Window is the first full real-browser case for the visible platform.

Authoritative runtime:

```text
WORKFLOW_RUN = 35586901099
RESULT = SUCCESS
TESTED_SHA = ed5ea6c6660da52f3b18cf4b7f66deb8ad0253a3
RUNNER = self-hosted / Windows / X64
BROWSER = Google Chrome / Chromium-compatible runtime
```

The successful run executed exact-SHA bounded materialization, static invariants, Chrome discovery, loopback HTTP/MIME preflight and the real Chromium Rose Window acceptance harness.

### Runtime evidence

```text
Rose Window real-browser acceptance = PASS

Direct Extraction = PASS
directPaths = 2504
directNodes = 17930
directGeometrySha256 = 68efbcdb4a73b61f0b3220bc7a8ce1b31db45ab078dc18144dbe47e2b6763fdf

Reference image display = PASS
Reference Overlay = PASS
Editable Path result = PASS
Path Edit entry = PASS

CHAT proposal = PASS
CHAT approval boundary = PASS
mutation before approval = BLOCKED / APPROVAL_REQUIRED
bounded approved edit = PASS

Natural-language CHAT context = PASS
CHAT_DOCUMENT_CONTEXT_BOUND = PASS
CHAT_NATURAL_LANGUAGE_RESPONSE = PASS
CHAT discussion non-mutating = PASS
conversation source = LOCAL_CONTEXT
provider = manual-json

Structure-Aware = PASS
radialCount = 6
prototypePaths = 232
prototypeNodes = 1563

Revision baseline capture = PASS
Revision structure capture = PASS
Revision capture / restore = PASS
document integrity after restore = PASS

Project save = PASS
saved project size = 18148870 bytes
Project reload integrity = PASS
reloaded FORMAT_VERSION = 4

Fatal runtime errors = 0
FORMAT_VERSION = 4
```

The final runtime evidence also reports:

```text
directExtractionDefault = true
structureAwareOptional = true
final document integrity = PASS
duplicateIds = 0
duplicateOwnership = 0
structuralCycles = 0
staleParentIds = 0
```

## 5. Runtime correction history

Earlier Phase F attempts exposed QA-harness/process-synchronization issues, not a requirement to change the product core.

The bounded runtime work corrected:

- blank `Start-Process.ExitCode` interpretation;
- asynchronous browser-harness completion synchronization;
- structured failure evidence visibility.

The successful final runtime required no further product-core bounded fix.

Therefore:

```text
PRODUCT_CORE_BOUNDED_FIX = NOT_REQUIRED
```

## 6. Static deployment preparation

Phase E prepared the repository for static branch-root hosting without copying or forking the product source.

Prepared deployment surface:

- root `index.html` redirects relatively to `./product/source/`;
- root `.nojekyll` is present;
- product source remains authoritative;
- manifest retains `start_url = ./index.html` and `scope = ./`;
- Service Worker paths remain relative;
- mandatory backend dependency = 0;
- deployment build pipeline requirement = 0.

GitHub Pages has not been changed by DEV.

```text
PUBLIC_URL = USER_ONE_TIME_PAGES_ACTION_REQUIRED
```

The one-time Pages enable/source-setting action remains for USER/MR after promotion decision.

## 7. Acceptance gate

```text
STATIC_WEB_ENTRY = VERIFIED
FIRST_VISIBLE_WEB_SHELL = WORKS
CREATIVE_WORKSPACE_VISIBLE = VERIFIED
REFERENCE_IMAGE_IMPORT = WORKS
DIRECT_EXTRACTION_VISIBLE = WORKS
EDITABLE_PATH_RESULT_VISIBLE = WORKS
REFERENCE_OVERLAY_VISIBLE = WORKS
STRUCTURE_AWARE_OPTION_VISIBLE = WORKS
ROSE_WINDOW_RUNTIME_CASE = EXECUTED
CHAT_CONVERSATION_UI = IMPLEMENTED
CHAT_DOCUMENT_CONTEXT = VERIFIED
CHAT_MUTATION_APPROVAL_BOUNDARY = PRESERVED
CHAT_REMOTE_PROVIDER = OPTIONAL
NO_COMMITTED_SECRET = VERIFIED
REVISION_CAPTURE_RESTORE = VERIFIED
STATIC_DEPLOYMENT_PAYLOAD = READY
PUBLIC_URL = USER_ONE_TIME_PAGES_ACTION_REQUIRED
SHARED_CORE_REUSED = VERIFIED
SECOND_EDITOR_CORE = 0
SECOND_DOCUMENT_AUTHORITY = 0
MANDATORY_REMOTE_DEPENDENCY_FOR_EDITOR = 0
FORMAT_VERSION = 4
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = EXECUTED
```

Target gate:

`INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS`

## 8. DEV boundary

DEV did not:

- modify `package/ink-current`;
- merge `main`;
- change `FORMAT_VERSION`;
- enable or modify GitHub Pages repository settings;
- start another Work Order.

Phase G ends at:

```text
DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ STOP
```
