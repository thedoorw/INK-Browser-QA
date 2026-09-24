# INK-WEB-UI-006 — Phase C + D DEV Evidence

STATUS: DEV_HANDOFF / STATIC_PASS / RUNTIME_DISPATCH_PENDING / STOP
BRANCH: `work/ink-web-ui-006-cd`
BASELINE_MAIN: `c2e0b91cd1cbf96240e212a290877e7b82bd690e`
SOURCE_HEAD: `27d21138db1a6311ec1084e8f3b3735c21d8a133`

## Implemented scope

### Phase C — top-area cleanup

- `檔案` is the primary desktop home for:
  - 新增
  - 開啟
  - 儲存
  - 匯出
- File-menu items proxy the existing authoritative endpoint buttons:
  - `newBtn`
  - `openBtn`
  - `saveBtn`
  - `exportBtn`
- No duplicate document/file implementation was introduced.
- Permanent desktop New/Open/Save/Export copies are hidden.
- Existing compact Undo/Redo, workspace switch, fullscreen and canvas settings remain.
- Contextual Options remains the main top work surface.

### Phase D — left toolbar single / dual column

- Frozen tool family/order preserved:
  1. Draw family
  2. Eraser
  3. Select
  4. Lasso
  5. Shape
  6. Text
  7. Image
  8. Pan
- Default desktop layout: single column.
- Optional desktop dual-column layout:
  - UI-only localStorage key: `ink.web.ui.toolbar-layout.v0.1`
  - same tools/order/grouping/shortcuts
  - `--tool-w` changes from 40px to 68px
  - stage and brush-popover geometry continue using `var(--tool-w)`
- Mobile keeps the existing responsive authority; desktop dual mode is not forced into mobile.

## Changed product / QA files

- `product/source/shell.template.html`
- `product/source/index.html` — generated
- `product/source/index-standalone.html` — generated
- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/runtime/ink-web-ui-001-harness.html`
- `working/INK_WEB_UI_006_PHASE_CD_DEV_HANDOFF.md`

## Static / source verification

PASS:

- shell generator parity equivalent to `node product/source/generate-shell.mjs --check`
- Web output exactly matches template substitutions
- Portable output exactly matches template substitutions
- no unresolved shell tokens
- `web-shell.js` parses successfully
- UI runtime harness inline JavaScript parses successfully
- explicit `ink:runtime-ready` contract preserved
- File menu proxy mapping targets existing endpoint IDs
- toolbar layout preference is UI-only
- task-specific Phase C/D runtime assertions are present
- `FORMAT_VERSION = 4`
- `product/source/src/ink.js` blob is unchanged from baseline main
- no Service Worker / bootstrap / build identity / Core / Document / History / Revision / Renderer source changed

## Runtime harness coverage added

The existing UI runtime harness now asserts:

- single-column desktop default
- exact frozen tool order
- dual-column width and stage adjacency
- no additional tools in dual mode
- single ↔ dual geometry restoration
- File menu contains New/Open/Save/Export
- permanent desktop file-command copies are hidden
- File-menu Export proxies the authoritative Export endpoint
- desktop toolbar layout does not override mobile
- existing contextual Draw / Selection, right-panel, narrow-desktop and fullscreen checks remain in the same harness

## Exact-SHA Windows Runtime status

NOT EXECUTED by this DEV connection.

Reason:
- the available GitHub connector can read workflow runs/artifacts and rerun existing jobs, but does not expose a `workflow_dispatch` action;
- the central Runtime workflow is manual for branch/exact-SHA targets;
- mutating `main` / the Runtime queue only to trigger a run is outside this UI branch authorization.

Therefore no exact-SHA Runtime PASS is claimed here.

Required review action:
- run the existing central Windows Runtime batch against the final DEV exact HEAD before promotion.

## Boundary confirmation

- Core semantics unchanged: YES
- Document semantics unchanged: YES
- History semantics unchanged: YES
- Revision semantics unchanged: YES
- Renderer unchanged: YES
- Service Worker unchanged: YES
- bootstrap unchanged: YES
- build/cache identity unchanged: YES
- `FORMAT_VERSION` unchanged: YES
- Phase E started: NO

Completion state:

`DEV_HANDOFF → UR_REVIEW → STOP`
