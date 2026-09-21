# INK CURRENT WORK ORDER

STATUS: `READY_FOR_DEV / INK-CLOUD-018 / FIRST_VISIBLE_WEB_PLATFORM`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-018` |
| TITLE | `First Visible Web Platform + Rose Window Runtime v0.1` |
| AUTHORITY | `USER_EXPLICIT_PREPARE_WEB_PLATFORM` |
| DEV_WORK_BRANCH | `work/ink-cloud-018` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_WEB_INTEGRATION_SCOPE` |
| DEPLOYMENT_PREPARATION | `AUTHORIZED` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |
| REMOTE_AI | `OPTIONAL_ADAPTER_ONLY` |
| RUNTIME_QA | `REQUIRED_FOR_GATE` |

## User product decision

The next priority is not Figma feature parity and not another invisible engine expansion.

Target:

```text
existing INK shared core
→ visible browser platform
→ image import
→ Reference / Extract / Path / Overlay
→ natural-language CHAT surface
→ bounded proposal / approval / execution
→ Revision
→ Rose Window first visible runtime case
→ fixed web URL
```

The first web platform is for one user. It does not require multi-user collaboration, team workspace, comments, presence, account administration or broad SaaS infrastructure.

## Accepted baseline

INK-CLOUD-017 is closed and promoted.

Accepted core:

```text
Reference
→ Extract
→ editable Path
→ Edit
→ Expressive Stroke
→ Multi-Contour Compose
→ Repaint / Material
→ CHAT bounded edit
→ CHAT multi-step plan
→ Revision
```

Additional accepted state:

```text
Creative Workspace minimum UX = IMPLEMENTED
Portable/shared-core integrity = VERIFIED
Structure-Aware multi-Path reconstruction = TECHNICALLY_CLOSED
Direct Extraction = DEFAULT
Structure-Aware = OPTIONAL_STRUCTURED_RECONSTRUCTION
FORMAT_VERSION = 4
```

Current browser source already exists at:

`product/source/index.html`

The task is to expose and validate the accepted capabilities as one real web platform, not to create a second application.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `governance/INK_Product_Delivery_Model_v0.1.md`
7. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
8. `research/INK_CREATIVE_WORKSPACE_MINIMUM_UX_REPORT_v0.1.md`
9. `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`
10. `research/INK_CHAT_MULTI_STEP_CREATIVE_COLLABORATION_REPORT_v0.1.md`
11. `research/INK_STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_REPORT_v0.1.md`
12. `product/source/index.html`
13. `product/source/src/ink.js`
14. `product/source/src/editor/creative-workspace.js`
15. `product/source/src/ai/chat-runtime.js`
16. existing extraction / Structure-Aware / Revision controllers only as required

## Product principle

```text
WEB_PLATFORM
=
VISIBLE SHELL OVER EXISTING AUTHORITIES

WEB_PLATFORM
≠
SECOND EDITOR
≠
SECOND DOCUMENT MODEL
≠
FIGMA CLONE
```

Do not duplicate accepted INK engines merely to make deployment easier.

## Objective

Deliver the first visible INK Web platform that the user can open in a normal desktop browser and use to inspect what INK can currently do.

Minimum visible experience:

```text
open fixed web URL
→ INK workspace loads
→ import reference image
→ see reference on canvas
→ run Direct Extraction
→ see editable Paths + overlay
→ optionally run Structure-Aware reconstruction
→ inspect structure/result diagnostics
→ make bounded edits / repaint / compose
→ discuss through visible CHAT surface
→ approve bounded CHAT operation/plan
→ capture/restore Revision
```

The Rose Window is the first runtime case.

## Phase A — Existing-web audit + deployment closure plan

Audit the current `product/source` browser application before changing UI.

Required findings:

- exact static entrypoint and module closure;
- relative-path / CSP / Service Worker constraints under static hosting;
- whether Creative Workspace is already mounted and how it is reached;
- current image import route;
- current extraction + overlay route;
- current Structure-Aware route and what UI wiring is missing;
- current CHAT runtime vs current Creative Workspace CHAT controls;
- exact deployment payload needed for a static web URL;
- any blocker to GitHub Pages or equivalent static hosting.

Do not add product features in this phase.

Checkpoint commit required.

## Phase B — First visible web shell

Make the existing application usable as the first INK Web surface.

Required:

- normal browser load from HTTP(S), not file-only assumptions;
- existing canvas/editor is the primary workspace;
- Creative Workspace is visible or clearly discoverable on first use;
- image/reference import is visible and usable;
- no sign-in requirement for this first single-user version;
- no duplicate editor shell;
- no new document authority.

UI polish should be bounded. This is a visibility/usability integration task, not a broad redesign.

Checkpoint commit required.

## Phase C — Visible conversational CHAT surface

The current Creative Workspace CHAT controls expose structured edit operations, but they are not sufficient as the user's first visible discussion surface.

Add a bounded conversational panel over the existing CHAT runtime.

Required visible behavior:

- transcript area;
- natural-language prompt input;
- current document/context binding through the existing context/runtime contract;
- visible provider/runtime status;
- ability to inspect the current document before proposing edits;
- AI/manual response may discuss the artwork without mutating it;
- any actual document mutation must still become an existing bounded edit task or multi-step creative plan;
- explicit approval remains required before execution;
- Revision/History authority remains unchanged;
- no direct model access to DOM/canvas/file system;
- no committed API key or secret;
- credential handling must remain session-only or use an explicitly configured external endpoint;
- local/manual mode remains available when no remote provider is configured.

For a real AI provider path, reuse the existing provider/endpoint adapter contract where possible. Do not hard-wire a vendor into the document/editor core.

If real conversational response cannot be supported without a new mandatory backend or unsafe committed credential, STOP and document the exact transport blocker. Do not fake AI conversation.

Checkpoint commit required.

## Phase D — Rose Window first visible runtime case

Use the Rose Window as the first user-visible proof.

Preferred source:

`qa/fixtures/rose-window/rose-window-primary.png`

If the browser runtime cannot directly materialize that repository binary in the test environment, the USER-approved 1086 × 1448 supplied Rose Window may be used. SHA/RGB-RGBA mismatch is not a STOP condition for this visible runtime stage.

Required visible operations:

1. import the Rose Window;
2. display reference image;
3. run Direct Extraction as default;
4. display extracted editable Path result;
5. display reference/path overlay with controllable opacity;
6. expose path/node/provenance diagnostics sufficient to understand the result;
7. expose Structure-Aware as an optional structured reconstruction path;
8. show selected radial count / retained prototype information when Structure-Aware is used;
9. allow at least one bounded Path/appearance/composition edit;
10. capture a Revision and restore it;
11. bind the current artwork state to the visible CHAT panel.

Do not require the Structure-Aware result to beat Direct Extraction.

Checkpoint commit required.

## Phase E — Static deployment preparation

Prepare the exact static deployment payload.

Preferred hosting target:

`GitHub Pages`

unless an existing repository constraint proves another static host materially simpler.

Rules:

- static assets only for core app;
- no mandatory server runtime;
- no GitHub Actions dependency;
- do not mutate `package/ink-current`;
- preserve shared-core module paths or document any bounded deployment mapping;
- Service Worker / manifest scope must be correct for the deployed base path;
- no environment-specific absolute localhost paths;
- no secrets in repository;
- deployment must remain replaceable/upgradeable without forking the product source.

DEV may prepare deployment files/configuration on the work branch.

If activating the final public URL requires a GitHub repository Pages setting unavailable to DEV/MR tooling, record:

`USER_ONE_TIME_PAGES_ACTION_REQUIRED`

with the exact setting required. That is not permission to substitute another external proxy.

Checkpoint commit required.

## Phase F — Real browser runtime QA

Unlike earlier source-only stages, this stage exists to make the platform visible.

Therefore the gate requires actual browser execution.

At minimum validate in current desktop Chrome-compatible runtime:

- page loads without fatal console/module errors;
- canvas/editor renders;
- Creative Workspace opens;
- image/reference import works;
- Rose Window displays;
- Direct Extraction completes;
- overlay works;
- resulting Paths are selectable/editable;
- Structure-Aware visible path executes or reports a bounded actionable error;
- CHAT panel accepts natural-language input;
- document context can be inspected;
- proposal/plan approval boundary is enforced;
- Revision capture/restore works;
- save/reload does not corrupt the document;
- no mandatory remote dependency for non-AI editing core.

Record concrete runtime evidence. Browser/runtime QA may not be marked DEFERRED for final gate closure.

Checkpoint commit required.

## Phase G — report + DEV handoff

Create:

`research/INK_FIRST_VISIBLE_WEB_PLATFORM_REPORT_v0.1.md`

Update branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Return:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

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
PUBLIC_URL = READY_OR_USER_ONE_TIME_PAGES_ACTION_REQUIRED
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

## Explicit exclusions

Do not implement:

- real-time multi-user collaboration;
- team workspace;
- comments/presence;
- account/auth system unless a concrete deployment blocker requires a separate decision;
- Figma feature parity;
- generic plugin marketplace;
- broad UI redesign;
- autonomous/open-ended CHAT agent;
- recursive self-planning;
- second editor/document/History/Revision/renderer engine;
- mandatory Cloud backend for core editing;
- new extraction engine merely for this stage;
- SAM/OpenCV/VTracer integration unless a concrete current runtime dependency already exists and only bounded wiring is required;
- `FORMAT_VERSION` bump;
- `package/ink-current` regeneration.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. deployment requires forking/duplicating the editor core;
3. a mandatory backend becomes required for core editing;
4. CHAT requires committing a secret or unsafe permanent browser credential;
5. current browser source cannot be statically hosted without broad architecture redesign;
6. accepted document/History/Revision behavior must be broken;
7. actual browser runtime cannot be executed and no user-visible platform can be demonstrated;
8. a broader product/hosting decision is required.

A one-time GitHub Pages enable/source-setting action is not an architecture STOP; document it for USER/MR.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-018
BRANCH = work/ink-cloud-018
GATE = INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS
DEFAULT_EXTRACTION = DIRECT_EXTRACTION
STRUCTURE_AWARE = OPTIONAL
FORMAT_VERSION = 4
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = EXECUTED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Local runtime override — GitHub Actions quota exhausted

For INK-CLOUD-018, browser/runtime QA is to be executed from the user's Windows computer through PowerShell and a loopback HTTP server.

Prepared branch artifacts:

- `qa/runtime/start-ink-local.ps1`
- `qa/runtime/check-ink-local.ps1`
- `qa/runtime/INK_CLOUD_018_POWERSHELL_RUNTIME_RUNBOOK.md`
- `research/INK_FIRST_VISIBLE_WEB_PLATFORM_PRE_RUNTIME_AUDIT_v0.1.md`

Rules:

```text
GITHUB_ACTIONS = DO_NOT_USE
EXTERNAL_PROXY = DO_NOT_USE
LOCAL_POWERSHELL_RUNTIME = AUTHORIZED
LOOPBACK = 127.0.0.1
USER_MACHINE_BROWSER_QA = AUTHORITATIVE_FOR_018_RUNTIME_GATE
```

The next checkpoint is a local PowerShell preflight only. Product integration may continue after the local runtime path is confirmed operational.
