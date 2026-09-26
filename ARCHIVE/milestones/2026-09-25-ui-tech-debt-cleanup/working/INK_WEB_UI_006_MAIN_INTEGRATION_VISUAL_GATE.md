# INK-WEB-UI-006 — Main Integration Visual Gate

STATUS: USER_DIRECTED / INTEGRATION_REQUIRED / VISUAL_GATE_BEFORE_RUNTIME
OWNER: MR for integration / UR for visual review
RUNTIME: HOLD

## User direction — 2026-09-24

UI-006 branch Runtime PASS is not sufficient evidence that the actual deployed product is correct.

The previous FINAL_CERTIFIED conclusion is withdrawn.

Required sequence:

UI-006 branch
→ MR integration into main
→ GitHub Pages / deployed main visible
→ capture actual integrated/deployed UI screenshot
→ UR compares screenshot against Photoshop reference, UI modification requirements, branding, and workspace state
→ visual PASS or bounded correction
→ only after visual PASS may Runtime be considered

## Hard gate

Do NOT queue or run the normal Runtime batch immediately after integration.

MAIN_INTEGRATED → RUNTIME_HOLD → DEPLOYED_SCREENSHOT_REQUIRED → UR_VISUAL_REVIEW

If the screenshot shows stale/old UI, wrong branding, wrong canvas/workspace state, missing checklist items, or any obvious regression:

VISUAL_FAIL → bounded correction → redeploy → new screenshot → compare again

Runtime is not evidence for visual correctness and must not be used to bypass this gate.

## Screenshot target

Use the actual integrated/deployed main surface, not a work branch preview.

Primary target:
https://thedoorw.github.io/INK-Browser-QA/product/source/

Required first capture:
- 1280×1024
- default startup state
- APP_FULL / VIEWPORT

Additional captures may be requested only after the first screenshot is visually correct.

## Visual review must explicitly check

- default canvas/workspace is the intended current design, not stale old black/dark or other legacy state;
- top-left INK brand mark is the intended current asset;
- favicon is the intended current asset;
- top menu / contextual options match accepted UI-006 structure;
- left toolbar layout/order/icons match accepted UI-006 state;
- right Panel Dock matches accepted UI-006 state;
- no stale permanent controls reappear;
- typography and density match accepted UI-006 direction;
- no obvious missing item from the UI modification checklist;
- actual deployed main matches the intended final UI, not merely the branch Runtime geometry.

## Certification state

Until this visual gate passes:

INK-WEB-UI-006 = REOPENED / INTEGRATION_REQUIRED / RUNTIME_HOLD / FINAL_CERTIFIED_WITHDRAWN

No final certification may be restored before the deployed-main screenshot is reviewed and accepted.
