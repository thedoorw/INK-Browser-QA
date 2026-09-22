# INK DEV PROGRESS

STATUS: IMPLEMENTATION_COMPLETE / SOURCE_STATIC_UNIT_PARITY_PASS / RUNTIME_PENDING

TASK_ID: INK-UI-MAINT-002
TITLE: Typography Readability / Panel Authority / Content Containment / Favicon v0.1
BRANCH: work/ink-ui-maint-002
BASE_MAIN: 19ce5f7d03a32600493a550ae2d2262340c229ee
TASK_STATUS: RUNTIME_PENDING
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
- [x] Single primary-panel select + chevron collapse authority.
- [x] Contextual Properties two-way toggle + ARIA/visual synchronization.
- [x] Desktop containment and typography authority.
- [x] Web / Portable mirrored markup.
- [x] Dedicated local favicon.
- [x] Focused source/static/unit/parity checks — deterministic connected-branch assertions 11/11 PASS.
- [ ] PowerShell Windows Runtime — final stage only / pending execution.
- [ ] Evidence report + DEV_HANDOFF — Runtime gate still open.

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


## Source/static/unit/parity checkpoint

Exact connected branch assertions:

```text
shared-shell-parity = PASS
web-shell-parse = PASS
shared-hook-uniqueness = PASS
selection-first-authority = PASS
desktop-duplicate-retirement = PASS
advanced-two-way-state = PASS
advanced-markup-parity = PASS
panel-containment = PASS
readability-lift = PASS
favicon-contract = PASS
version-boundaries = PASS
TOTAL = 11 PASS / 0 FAIL
```

Focused deterministic unit contract:
`qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs`

The connected tool environment does not provide a checked-out branch for a literal local `node --test` invocation; equivalent deterministic assertions were executed directly against the exact GitHub branch files, matching the established UI-lane evidence pattern. No literal Node-run claim is made.

## Boundary check

Compare against authorized base `19ce5f7d03a32600493a550ae2d2262340c229ee`:

```text
ahead = 12
behind = 0
implementation files =
  product/source/web-shell.js
  product/source/styles.css
  product/source/index.html
  product/source/index-standalone.html
  product/source/assets/favicon.svg
QA =
  qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs
CORE / Renderer / History / Revision / Geometry mutation = 0
FORMAT_VERSION = 4 / preserved
product base version = v0.1 / preserved
```
