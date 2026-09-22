# INK DEV PROGRESS

STATUS: IN_PROGRESS / BOUNDED_UI_IMPLEMENTATION

TASK_ID: INK-UI-MAINT-002
TITLE: Typography Readability / Panel Authority / Content Containment / Favicon v0.1
BRANCH: work/ink-ui-maint-002
BASE_MAIN: 19ce5f7d03a32600493a550ae2d2262340c229ee
TASK_STATUS: IN_PROGRESS
DEV_HANDOFF: NOT_YET
UR_REVIEW: PENDING_AFTER_HANDOFF
RUNTIME_QA: REQUIRED_BEFORE_UI_PASS
PORTABLE_WEB_PARITY: REQUIRED
FORMAT_VERSION: 4 / PRESERVE
PRODUCT_BASE_VERSION: v0.1 / PRESERVE
PACKAGE_MUTATION: 0 / PROHIBITED
CORE_MUTATION: 0 / PROHIBITED

## Priority

P0:
RIGHT_PANEL_CONTENT_CONTAINMENT

P1:
PRIMARY_PANEL_AUTHORITY_CONSOLIDATED
CONTEXTUAL_ADVANCED_TOGGLE_STATE

P2:
TYPOGRAPHY_READABILITY
BRAND_ASSET_CLARITY
CSS_AUTHORITY_CLEAN

## SSOT checkpoint

Read on assigned branch:
- README.md
- AGENTS.md
- ACTIVE/INK_CURRENT_WORK_ORDER.md
- ACTIVE/INK_DEV_PROGRESS.md
- research/INK_UI_REVIEW_CHECKLIST_v0.1.md
- governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md

## Localized defects

1. `openContextualAdvanced()` unconditionally opens Inspector; no two-way state.
2. Dock currently calls a toggle command; selection and collapse authority are conflated.
3. `#inspectorEdgeToggle` still carries legacy Inspector semantics and is hidden by desktop Web-shell CSS.
4. Legacy top-right `#inspectorToggle` remains a desktop duplicate entry control.
5. Creative Loop retains multiple 7–9 px secondary labels/status values.
6. Primary panel containment lacks one final explicit overflow/min-size authority across Inspector and Creative Loop.
7. Web and Portable still point favicon at the full `ink-mark.svg` asset.

## Implementation checkpoints

- [x] SSOT / branch / boundaries confirmed.
- [x] Existing panel state and CSS authority localized.
- [ ] Single primary-panel select + chevron collapse authority.
- [ ] Contextual Properties two-way toggle + ARIA/visual synchronization.
- [ ] Desktop containment and typography authority.
- [ ] Web / Portable mirrored markup.
- [ ] Dedicated local favicon.
- [ ] Focused source/static/unit/parity checks.
- [ ] PowerShell Windows Runtime — final stage only.
- [ ] Evidence report + DEV_HANDOFF.

## Stop rule

Renderer / Document / History / Revision / Geometry / Core / CHAT execution / persistence / package change required:
INTEGRATION_REQUIRED → STOP → MR

Runtime unavailable:
RUNTIME_BLOCKED → STOP

## Runtime execution policy

- Complete the entire bounded implementation first.
- Complete all source/static/unit/parity checks before Runtime.
- Runtime is the final validation stage, not an iterative browser-debugging substitute.
- Use the established local/self-hosted **PowerShell Windows Runtime** path.
- **DO NOT use TinyFish** for Runtime, browsing, UI validation, screenshot capture, or fallback.
- Do not substitute TinyFish if PowerShell Runtime is blocked.
- If PowerShell Runtime cannot execute after implementation is complete:
  `TASK_STATUS = RUNTIME_BLOCKED → STOP`
- Do not claim `DEV_HANDOFF` or `UI_PASS` without the required PowerShell Runtime evidence.
