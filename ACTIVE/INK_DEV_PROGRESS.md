# INK DEV PROGRESS

STATUS: AUTHORIZED / NOT_STARTED

TASK_ID: INK-UI-MAINT-002
TITLE: Typography Readability / Panel Authority / Content Containment / Favicon v0.1
BRANCH: work/ink-ui-maint-002
BASE_MAIN: 19ce5f7d03a32600493a550ae2d2262340c229ee
TASK_STATUS: AUTHORIZED / NOT_STARTED
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

## User-reported defects

1. Desktop text too small and too dim compared with Photoshop reference.
2. “進階” is not a two-way toggle and has no active color/state.
3. Right panel content is compressed/unreadable; panel containment is broken.
4. Three controls effectively open the same Inspector system; consolidate to one authority.
5. Favicon must be fixed now; simple light blue or light blue + white Y is acceptable.

## Authority model target

```text
Dock item = select primary panel content
Chevron = collapse / expand primary panel
進階 = contextual route to Properties in same authority
Legacy top Inspector toggle = remove/retire on desktop
```

## Stop rule

Renderer / Document / History / Revision / Geometry / Core / CHAT execution / persistence / package change required:
INTEGRATION_REQUIRED → STOP → MR

Runtime unavailable:
RUNTIME_BLOCKED → STOP
