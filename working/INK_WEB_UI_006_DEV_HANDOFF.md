# INK-WEB-UI-006 — UI DEV HANDOFF

STATUS: UR_REVIEW / STATIC_PASS / RUNTIME_HOLD
OWNER: UI DEV
REVIEWER: INK UR
BRANCH: `work/ink-web-ui-standard-001`
CURRENT PACKAGE: PHASE_A_B
SOURCE OF TRUTH:
- `research/INK_IDEAL_UI_STANDARD_v0.1.md`
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- `working/INK_WEB_UI_006_WORK_ORDER.md`

## Scope for this package

Implement only Phase A and Phase B.

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
