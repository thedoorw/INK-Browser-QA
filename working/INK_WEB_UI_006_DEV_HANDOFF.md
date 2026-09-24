# INK-WEB-UI-006 — UI DEV HANDOFF

STATUS: DEV_HANDOFF / PHASE_C_D / UR_REVIEW
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-standard-001`
CURRENT PACKAGE: PHASE_C_D
SOURCE OF TRUTH:
- `research/INK_IDEAL_UI_STANDARD_v0.1.md`
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- `working/INK_WEB_UI_006_WORK_ORDER.md`

## Prior Phase A/B package (historical)

The following section records the completed Phase A/B package.

### Phase A — Final UI command map
1. Produce a complete command/control inventory from current runtime/source.
2. Classify every visible control as:
   - Primary Home
   - Contextual Shortcut
   - Keyboard Shortcut
   - Responsive Alternative
   - Specialist/Diagnostic
3. Produce duplicate-resolution mapping for:
   - New / Open / Save / Export
   - Creation / Layout
   - Color / Size / Opacity
   - Duplicate / Group / Front / Delete
   - Inspector/panel open-close entry points
   - Zoom / Fit / Rotation
4. Do not change Core semantics.

Deliverable:
- branch-local inventory / mapping note
- no speculative Core changes

### Phase B — Global shell + branding + startup
Implement:
1. Light UI chrome direction
   - top shell
   - left toolbar surface
   - right panel/dock surfaces
   - status bar
   - preserve clear separation from workspace and paper/canvas
2. Original Y-mark direct-scale test
   - top-left app mark
   - favicon
   - use original user-provided image as-is
   - no redraw, simplification, cleanup or stylization in this phase
3. Remove dark→white startup flash
   - startup must visually match final workspace or show a deliberate neutral loading state

## Explicit exclusions

Do NOT implement yet:
- Phase C top command cleanup
- Phase D one/two-column toolbar
- Phase E right-panel structural refactor
- Phase F duplicate removal
- Phase G typography refactor
- Phase H responsive/fullscreen changes beyond what is strictly required by Phase B
- Core/document/history/revision changes
- renderer/WebGL/Canvas engine changes
- persistence/FORMAT_VERSION changes
- package/certification changes

If any requested UI behavior requires those boundaries:
`INTEGRATION_REQUIRED → UR → MR`

## Evidence required for handback

Return:
- changed file list
- summary of UI-only changes
- runtime screenshot: normal desktop
- runtime screenshot: startup/final state
- runtime screenshot: Y-mark top-left
- favicon evidence
- note confirming no Core/schema/FORMAT_VERSION changes

## DEV completion — Phase A + B

### Phase A
- Added `working/INK_WEB_UI_006_PHASE_A_COMMAND_MAP.md`.
- Mapped 349 fixed HTML controls plus 14 runtime shell panel entries = 363 fixed UI command/control entries.
- Classified Primary Home / Contextual Shortcut / Keyboard Shortcut / Responsive Alternative / Specialist-Diagnostic.
- Added explicit duplicate-resolution table for all A2-required groups.
- Boundary result: no Core semantic integration required.

### Phase B
- Desktop shell moved from dark chrome to a light neutral workstation shell while retaining workspace/paper separation.
- Copied the original Y-mark blob byte-for-byte from `reference/brand/INK_MARK_SOURCE_W-300.jpg` to `product/source/assets/INK_MARK_SOURCE_W-300.jpg`.
- Web and Portable top-left marks reference that original JPG directly; no redraw/simplification/cleanup/stylization.
- Browser favicon now references the same original JPG directly.
- Web and Portable theme/startup colors changed from dark to light neutral; an inline startup background is present before the external stylesheet to prevent the old dark pre-style frame.
- PWA manifest startup/theme colors aligned to the same light direction.

### Changed files
- `product/source/assets/INK_MARK_SOURCE_W-300.jpg`
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/manifest.webmanifest`
- `product/source/manifest-portable.webmanifest`
- `working/INK_WEB_UI_006_PHASE_A_COMMAND_MAP.md`
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- `working/INK_WEB_UI_006_DEV_HANDOFF.md`

### Static evidence
- Original brand source blob SHA: `a1cae552c47fbc658500ba74735ab383b136c3a9`
- Product brand asset blob SHA: `a1cae552c47fbc658500ba74735ab383b136c3a9`
- Web/Portable source parity confirmed for direct brand reference, light theme meta and startup shell.
- CSS brace balance: 0.
- Compare from Phase A/B start commit `02f038f37a4a8d2a5ecc90e652250ce513843f76` shows UI/docs/assets only; no Core/schema/renderer/FORMAT_VERSION files changed.

### Runtime evidence note
The required runtime screenshots could not be captured in this GitHub-only DEV execution context because the branch has no runnable browser surface available here. No screenshot evidence is fabricated. UR must perform the runtime visual gate for:
- normal desktop
- startup/final state
- Y-mark top-left
- favicon
- Photoshop-reference comparison

Handoff status on completion:
`DEV_HANDOFF → UR_REVIEW → STOP`


## UR review — Phase A + B

### Static review result
- Phase A inventory present and complete enough for the issued scope.
- Required duplicate-resolution groups are explicitly mapped.
- Phase B changes are bounded to UI/docs/assets from the issued package start commit.
- No Core/schema/renderer/FORMAT_VERSION files changed.
- Original Y-mark asset is referenced directly by Web and Portable top-left marks.
- Browser `<link rel="icon">` points directly to the original JPG source asset.
- Startup shell/theme values are changed to light values before the external stylesheet.
- Light-shell CSS is isolated as a Phase B override.

### Main-branch drift check
Current branch is behind `main` by 10 commits, but those main-only commits modify only:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_REVIEW_STATUS.md`
- `ACTIVE/INK_RUNTIME_QUEUE.json`
- `working/WORKING_STATUS.md`

No current product-source overlap was found in that drift check.

### Hold reason
Required runtime evidence is still missing. Per the UR gate, Phase A/B cannot receive `UI_PASS` until the visible result is inspected in runtime.

Required runtime gate:
- normal desktop
- startup → final state
- light chrome
- top-left Y-mark
- browser favicon
- workspace/paper separation
- visual comparison against the supplied Photoshop references

### UR result
`UI_HOLD`

No Phase C authorization yet.


## UR runtime gate — Phase A + B

Runtime visual gate was executed by UR in a local Chromium shell harness using the Phase B branch values and the original Y-mark asset.

Observed computed/runtime values:
- body startup/final neutral: `rgb(244, 244, 244)`
- app shell: `rgb(231, 231, 231)`
- canvas/paper: `rgb(255, 254, 249)`
- menu / toolbar / panel surfaces: `rgb(247, 247, 247)`
- top-left original JPG rendered at 18×18 px from the original 300×300 source
- favicon type remains `image/jpeg` and points to the same original Y-mark source

Visual review:
- light chrome direction is coherent
- canvas/paper remains distinguishable from chrome
- original Y-mark remains recognizable at top-left without redraw
- no dark startup color remains in the startup shell path
- Phase B does not introduce a Core/schema/renderer boundary change

Reference note:
- Photoshop references remain the workstation-structure baseline.
- Figma-like lightness is accepted for shell direction only; later phases still need density/spacing/typography alignment.

UR result:
`UI_PASS`

Phase A + B are accepted.


## UR correction — Startup acceptance criterion

The previous runtime PASS was too permissive.

The requirement is NOT:
- hide a dark transient frame by changing it to a similar light color, or
- show a temporary neutral startup frame before the final workstation appears.

The requirement IS:
- the first painted INK application frame must already be the final shell state for the visible regions available at that moment;
- there must be no intentionally rendered temporary app frame that is later replaced only because external CSS/JS finishes loading;
- startup color similarity alone is not sufficient evidence.

### B3 revision required

Revise startup handling so that:
1. the initial painted shell uses the same authoritative visual tokens/geometry as the final shell, not a substitute one-color frame;
2. there is no dark→light, neutral→final, or temporary-shell→final visual swap;
3. do not solve this by inserting a branded splash/loading screen;
4. do not solve this by merely hiding the app and revealing it later unless the browser has not yet painted an application frame; the goal is direct first-paint consistency;
5. keep this UI-only.

Preferred implementation direction:
- inline only the minimum critical shell CSS necessary for the first paint, derived from the same final UI tokens;
- load the normal stylesheet without producing a visible state change in the shell;
- preserve the actual canvas/workspace hierarchy from the first visible app frame.

### Required runtime proof

Use frame-by-frame startup evidence, not only a final screenshot:
- navigation start / first paint
- stylesheet loaded
- app initialized
- final stable frame

The visible app shell must not change between those checkpoints except for actual content/state initialization that is not shell styling.

### Revised UR result

Phase A: `UI_PASS`

Phase B:
- B1 Light shell: `PASS`
- B2 Original Y-mark direct scale: `PASS`
- B3 Startup first-paint consistency: `UI_REVISE`

Overall current result:
`UI_REVISE`

Phase C remains unauthorized until B3 passes.


## UR clarification — B3 is technical-debt removal

B3 must not be closed by recoloring or masking the temporary startup frame.

The technical debt is the duplicate startup visual path itself.

DEV must remove that debt so INK has one authoritative shell state from first visible paint through stable runtime.

Acceptance:
`ONE SHELL STATE / NO STARTUP VISUAL SUBSTITUTE / NO FLASH DEBT`

A same-color temporary frame is still debt and does not pass.


---

## Phase C + D DEV handoff

STATUS: `DEV_HANDOFF → UR_REVIEW → STOP`

Implementation source checkpoint before handoff-document updates:
`7ce6aa86b6881045be3f120655e7becea8e4c937`

Clean baseline:
`main@042b4f9f7528b14df6d10593b61f65565b3779ac`

Branch reconciliation:
- current main product/QA authority was adopted before C/D implementation;
- branch-local UI research/work-order/history documents were retained;
- the pre-cleanup duplicated HTML/CSS/bootstrap implementation was not carried forward.

### Phase C — top cleanup

Implemented:
- `檔案` is the visible desktop Primary Home for New / Open / Save / Export.
- Existing runtime command buttons remain as hidden command endpoints / responsive fallback; their semantics were not changed.
- Contextual Options remains the active-tool/selection surface.
- Undo/Redo remains a compact 24×24 top shortcut; History semantics are unchanged.
- Desktop Creation/Layout equal-weight switch is hidden; the menu/workspace route remains the desktop Primary Home and the existing mobile switch remains a Responsive Alternative.
- Desktop top stack reduced from 60 px to 56 px:
  - menu 24 px
  - options/contextual row 32 px.

### Phase D — left toolbar

Implemented:
- one-column is the default.
- two-column layout is user-selectable.
- tool order remains:
  `Draw → Eraser → Select → Lasso → Shape → Text → Image → Pan`.
- Draw family remains:
  `Pen → Pencil → Marker → Brush → Airbrush`.
- shortcuts and command identity are unchanged.
- two-column mode changes layout only and does not add tools.
- preference key:
  `ink.web.ui.toolbar-columns.v0.1`
- persistence is localStorage-only UI state; no Document / History / Revision write path is used.

### Technical-debt regression guard

Verified against exact branch source:
- generated Web output equals the `shell.template.html` Web substitution exactly.
- generated Portable output equals the `shell.template.html` Portable substitution exactly.
- `generate-shell.mjs` blob is unchanged from current main.
- `service-worker.js` blob is unchanged from current main.
- desktop CSS authority marker count = 1.
- old Phase-B override authority marker count = 0.
- CSS brace balance = 0.
- `:root` count = 14 (guard ceiling 14).
- `!important` count = 220 (guard ceiling 222).
- runtime-ready event contract is present.
- bootstrap retry polling patterns are absent.
- `FORMAT_VERSION = 4`.

Added:
- `qa/core/tests/unit/ink-web-ui-006-phase-cd.test.mjs`
  - directly executes `node product/source/generate-shell.mjs --check` when repository tests run.
- existing Photoshop shell geometry guard updated only for the authorized 32/56 px top geometry.
- existing browser UI harness updated for the same authorized geometry plus File-menu and one/two-column toolbar behavior.

Execution-context note:
- this DEV connector context does not provide a checked-out repository filesystem or workflow-dispatch action, so the Node process itself was not invoked here.
- the exact predicate used by `generate-shell.mjs --check` was evaluated against the committed template and both outputs and returned exact equality for Web and Portable.
- no Runtime PASS is claimed by DEV; UR retains runtime visual/review authority.

### C/D changed paths from clean reconciliation checkpoint

Product UI:
- `product/source/shell.template.html`
- `product/source/index.html` (generated)
- `product/source/index-standalone.html` (generated)
- `product/source/styles.css`
- `product/source/web-shell.js`

QA:
- `qa/core/tests/unit/ink-web-ui-006-phase-cd.test.mjs`
- `qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs`
- `qa/runtime/ink-web-ui-001-harness.html`

Governance / handoff:
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- `working/INK_WEB_UI_006_WORK_ORDER.md`
- `working/INK_WEB_UI_006_DEV_HANDOFF.md`
- `ACTIVE/INK_DEV_PROGRESS.md`

Not changed by C/D:
- Service Worker
- generator authority
- Core
- Document
- History
- Revision
- renderer / WebGL / Canvas engine
- persistence / FORMAT_VERSION
- Phase E–I implementation

Final gate:
`DEV_HANDOFF → UR_REVIEW → STOP`

Phase E is NOT started.
