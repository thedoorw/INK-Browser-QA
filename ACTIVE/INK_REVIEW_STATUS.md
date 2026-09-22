# INK REVIEW STATUS

STATUS: `INK-WEB-UI-001 / DEV_READY / MR_REVIEW_PENDING_HANDOFF`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-001` |
| DEV_BRANCH | `work/ink-web-ui-001` |
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| TARGET_GATE | `INK_WEB_UI_PHASE1_COMPLETE` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `NOT_STARTED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| UI_MUTATION | `AUTHORIZED / BOUNDED` |
| WEB_DISPLAY_VERSION | `INK v0.1 · Web / REQUIRED` |
| FAVICON | `USER ORIGINAL MARK / REQUIRED` |
| PACKAGE_INK_CURRENT | `NO_MUTATION` |
| BROWSER_RUNTIME_QA | `REQUIRED_FOR_FINAL_GATE` |

## Review boundary

MR will review:

- exact shell inventory and preservation of JS bindings;
- Photoshop/Illustrator-aligned spatial hierarchy without visual cloning;
- canvas-first initial state;
- compact left tool rail;
- right collapsible panel dock;
- Layers / History / CHAT / Reference / Compose / Revision reachability;
- no capability loss when panels collapse;
- visible Web identity = `INK v0.1 · Web`;
- removal of current-product historical `v1.6.5 RC` strings from active Web surfaces;
- favicon/mark derived from the USER-provided original source;
- service-worker/cache identity and update path;
- fullscreen / save / open / export / shortcut regression;
- desktop + narrow viewport runtime evidence;
- final report `research/INK_WEB_UI_PHASE1_IMPLEMENTATION_REPORT_v0.1.md`.

MR will reject:

- Adobe code/assets/branding copy;
- a second workspace/document/History/Revision authority;
- UI-only command logic that CHAT cannot access through the existing core;
- removal of existing creative-loop capability;
- `FORMAT_VERSION` mutation;
- inferred product version > `v0.1`;
- broad contextual-control or CHAT redesign beyond the bounded package;
- package/certification mutation.

## Brand reference

```text
SOURCE = reference/brand/INK_MARK_SOURCE_W-300.jpg
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
FINE_GRID_AT_FAVICON_SIZE = NOT_REQUIRED
TEMPORARY_MARK = ACCEPTED
```

## Publication review

The work branch is not expected to alter the public staging site.

After MR_PASS and promotion to `main`, MR must verify the actual GitHub Pages staging surface and distinguish:

```text
source merged
Pages deployment complete
service-worker/cache refreshed
favicon browser cache refreshed
```

before declaring public Web closure.
