# INK-WEB-UI-006 — UI DEV HANDOFF

STATUS: UR_ISSUED
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

Handoff status on completion:
`DEV_HANDOFF → UR_REVIEW`
