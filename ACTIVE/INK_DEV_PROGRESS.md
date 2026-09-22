# INK DEV PROGRESS

STATUS: AUTHORIZED / NOT_STARTED

TASK_ID: INK-UI-MAINT-001
TITLE: Photoshop Shell Geometry / Pixel Alignment v0.1
BRANCH: work/ink-ui-maint-001
BASE_MAIN: c0adc842c1d1b52c8cdf74303e087704b0047caa
TASK_STATUS: AUTHORIZED / NOT_STARTED
DEV_HANDOFF: NOT_YET
UR_REVIEW: PENDING_AFTER_HANDOFF
TARGET_GATE: PS_SHELL_PIXEL_ALIGNMENT_WORKS
FORMAT_VERSION: 4 / PRESERVE
PRODUCT_BASE_VERSION: v0.1 / PRESERVE
PACKAGE_MUTATION: 0 / PROHIBITED
CORE_MUTATION: 0 / PROHIBITED
RUNTIME_QA: REQUIRED_BEFORE_UI_PASS

## Priority order

1. Collapse desktop top chrome to Photoshop-like 2-row geometry.
2. Restore left rail to left:0, width about 40 px.
3. Keep right dock at 40 px; reduce default primary panel toward about 252 px.
4. Reduce document-title dominance and align top controls.
5. Improve dark workbench / real Layout A4 page relationship.
6. Pixel-grid cleanup.
7. Parity/static + mandatory visual Runtime evidence.

## Photoshop reference

1280×1024 screenshot:
menu = 24 px
separator = 1 px
options = 35 px
separator = 1 px
workspace y = 61
left single rail = 40 px
right collapsed dock = 40 px
expanded right panel ≈ 252 px
workspace base ≈ #262626

## Known current regression

UI-001: tool rail left:0
UI-004 later override: tool rail left:7px
→ detached rail

Current top chrome:
28 + 38 + 36 contextual ≈ 102 px
target ≈ 60–61 px

## Stop rule

Renderer / Document / History / Revision / Geometry / Core / CHAT execution change required:
INTEGRATION_REQUIRED → STOP

If visual Runtime cannot be executed:
RUNTIME_BLOCKED → STOP

## Completion

TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-UI-MAINT-001
BRANCH = work/ink-ui-maint-001
FINAL_HEAD = <exact SHA>
GATE = PS_SHELL_PIXEL_ALIGNMENT_WORKS
RUNTIME_QA = PASS
PORTABLE_WEB_PARITY = PASS
FORMAT_VERSION = 4
PRODUCT_BASE_VERSION = v0.1
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP


## Checkpoint — shell geometry implementation

- Desktop shell reduced to a two-row topology: 24 px menu + 36 px shared options/context row.
- Existing `#contextualOptions` moved into the second-row topbar in both Web and Portable; command IDs/bindings preserved.
- Left rail final desktop geometry: `left:0`, `40px`, workspace begins at `x=40`.
- Right dock remains edge-attached at `40px`.
- Fresh primary panel default aligned to `252px`; saved user-resized widths remain authoritative.
- Document title bounded at `236px` (responsive down to 220px / 160px on narrower desktop).
- Layout workbench shell is dark; existing Renderer remains the authority for the real bounded A4 paper/shadow.
- Renderer / Document / History / Revision / Geometry / Core / CHAT semantics untouched.
- Focused static guard added: `qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs`.
- Runtime geometry validation still required before DEV_HANDOFF.
