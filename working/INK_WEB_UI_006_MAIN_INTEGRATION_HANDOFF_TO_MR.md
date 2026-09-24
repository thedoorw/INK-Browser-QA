# INK-WEB-UI-006 — Main Integration Handoff to MR

STATUS: READY_FOR_MR_INTEGRATION / RUNTIME_HOLD / VISUAL_GATE_REQUIRED
OWNER: MR
UR: PREPARED

## Current exact state

- current main HEAD: `0495094e0dfff2c5991438909ac132f2a2383499`
- UI-006 branch: `work/ink-web-ui-006-i`
- UI-006 branch HEAD: `eb39eb2bada376a311d964456f0eb85cd730d8e9`
- common accepted technical-debt baseline: `7d99d2bf093f10ce2d489e6ebf68f28a2740ebe1`
- UI-006 branch is ahead of the technical-debt baseline;
- current main and UI-006 are now diverged because later Connector governance/product work continued on main.

## Important integration fact

The five UI authority files on main have not been modified after the technical-debt promotion commit `7d99d2bf...`.

Therefore do NOT merge the whole UI-006 branch into main.

Preferred integration method:

1. start from current main;
2. transplant/reconcile only the accepted UI-006 UI authority payload;
3. preserve all later Connector-003 / Connector-004 work on main;
4. regenerate Web / Portable delivery from the accepted shell authority where required;
5. do not run Runtime yet;
6. wait for deployed GitHub Pages screenshot;
7. UR performs visual gate before any Runtime.

## UI authority payload to reconcile

- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`

Do not replace unrelated `product/source/src/**` Connector work.

## Branding blocker discovered during UR audit

Current main and UI-006 HTML still reference:

`assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`

for both:
- top-left brand mark;
- favicon.

Repository also contains:
- `assets/favicon.svg`;
- `assets/ink-mark.svg`;

but the current HTML does not use those assets for the active favicon/brand path.

This means branding must NOT be considered complete merely by transplanting UI-006 files.

MR integration must explicitly reconcile the user-approved current brand asset before visual review.

If the exact intended brand asset cannot be proven from SSOT, STOP and request the asset instead of guessing.

## Main deployment visual gate

After integration and Pages deployment, capture the actual deployed main target:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

First capture only:
- 1280×1024
- default startup state
- APP_FULL / VIEWPORT

UR must then check:
- no legacy black/dark startup canvas;
- intended logo;
- intended favicon;
- top menu / contextual options;
- left toolbar;
- right Panel Dock;
- no stale controls;
- typography / density;
- full modification checklist coverage;
- actual deployed main, not branch preview.

## Runtime hold

`RUNTIME = DO_NOT_RUN`

Runtime may resume only after UR visually accepts the deployed-main screenshot.

## Certification

`UI-006 = REOPENED / MAIN_INTEGRATION_PENDING / VISUAL_GATE_REQUIRED / FINAL_CERTIFIED_WITHDRAWN`