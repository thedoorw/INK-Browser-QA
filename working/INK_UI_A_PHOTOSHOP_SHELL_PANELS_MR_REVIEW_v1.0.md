# INK UI-A Photoshop Shell & Panels — MR Review v1.0

STATUS: `MR_TECHNICAL_PASS / UR_REVIEW_REQUIRED / NOT_PROMOTED`

DATE: 2026-09-28

TASK: `INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`

BRANCH:
`work/ink-ui-a-photoshop-shell-panels-001`

DEV_HANDOFF_HEAD:
`9c1d1ef4c020603296154000cccaea5c9c111dc6`

EXACT_IMPLEMENTATION_QA_HEAD:
`7ca7045b1de50173d33dee187a962b840419410a`

BASELINE_MAIN:
`9a4b374747c049d107b2525fb811faa1929a9770`

## 1. MR result

```text
SCOPE_BOUNDARY = PASS
PRODUCT_CORE_SEMANTIC_MUTATION = 0
FORMAT_VERSION_CHANGE = 0
P2_CAPABILITY_IMPLEMENTATION = 0
CENTRAL_RUNTIME = NOT_RUN / CORRECT
TOP_MENU_HOST = PASS
RIGHT_PANEL_INVENTORY = PASS
PHOTOSHOP_SHELL_GEOMETRY = PASS_STATIC
PANEL_REFLOW = PASS_STATIC
PAGES_AUTHORITY = PASS
NAVIGATOR_AUTHORITY = PASS
COLOR_AUTHORITY = PASS
LOGO_ROUTE_PRESERVED = PASS
FAVICON_ROUTE_PRESERVED = PASS
UI_EXTENSION_REGISTRATION_API = NOT_PRESENT / NON_BLOCKING_FOR_UI_A
MR_RESULT = TECHNICAL_PASS
NEXT_OWNER = UR
```

## 2. Changed-file boundary

UI-A changed only:
- `product/source/shell.template.html`
- generated `product/source/index.html`
- generated `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/ink.js`
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`
- branch progress evidence.

No Document/Image/History/Renderer/Recipe/CHAT/Format-Version Core module was modified.

## 3. Photoshop shell verification

MR independently verified the branch contains:
- exact top-level menu host order:
  `File / Edit / Image / Layer / Type / Select / Filter / Object / View / Window / Help`;
- no top-level Brush menu;
- 14 final panel homes:
  Properties / Layers / History / Navigator / Pages / Color / Channels / Adjustments / Libraries / Reference / Compose / CHAT / Revision / Specialist;
- static geometry tokens for:
  - menu 24 + divider;
  - Options 35 + divider;
  - top shell 61;
  - document tab 28+1;
  - rulers 17;
  - active-document status 16+1;
  - Tools 39+1 / 72+1;
  - collapsed Dock 39+1;
  - expanded panel 252 reference;
  - panel header 28;
- expanded panel reflows the canvas instead of overlaying it.

These remain subject to UR visual/interaction review because central Runtime is intentionally deferred.

## 4. Authority routing

Pages routes to existing page/document methods.

Navigator uses the existing page camera and renderer rather than introducing a second viewport authority.

Color routes to existing `app.setColor`.

The only `ink.js` changes are UI adaptation:
- desktop Pages route converges on `INK_WEB_SHELL`;
- default/resizable inspector width is aligned to the Photoshop panel reference.

No Core semantic change is accepted or observed.

## 5. Brand identity check

The branch preserves:

Visible INK logo:
`assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`

Browser favicon:
`assets/favicon.svg?v=0.1`

No old `ink-mark.svg` favicon route is reintroduced in the shell.

Brand assets themselves are unchanged.

Current authoritative visible-logo contract remains:
- single approved visible-logo asset authority;
- source SHA-256 `08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`.

Current favicon contract remains:
- local `favicon.svg`;
- 32×32;
- light-blue `#69BFE3`;
- white simplified Y.

UI-A focused QA did not itself add explicit brand assertions. This is not an A blocker because no brand route or asset changed; explicit brand QA is required in later UI closure work.

## 6. Extensibility finding

UI-A materially improves structure by centralizing:
- `APPLICATION_MENU_REGISTRY`;
- `PANEL_DEFS`;
- `PANEL_GROUPS`.

However, these remain built-in frozen registries. There is no general:
- `registerPanel`;
- `registerMenu`;
- `registerTool`;
- `registerUIContribution`

interface.

This is not a UI-A failure because a Plugin SDK was not in A scope.

It is a bounded future-architecture requirement:
- later UI work must avoid making the workstation closed to future registered capabilities;
- a small native/adaptor UI-contribution boundary may be added without implementing a full third-party Plugin SDK;
- full Plugin Ecosystem remains P2.

## 7. PWA/App icon disposition

The USER does not require PWA / installed-desktop App Icon work in the current UI program.

```text
PWA_APP_ICON_CURRENT_PROGRAM = OUT_OF_SCOPE
MANIFEST_ICON_REDESIGN = NO
PWA_PLUGIN/INSTALL_IDENTITY_WORK = NO
```

Existing manifest behavior is preserved but receives no new UI work.

## 8. Gate

```text
UI_A_MR_TECHNICAL = PASS
UI_A_UR_VISUAL_INTERACTION = REQUIRED
UI_A_PROMOTION = HOLD_UNTIL_UR_PASS
UI_B = HOLD_UNTIL_UI_A_PROMOTION
CENTRAL_RUNTIME = DEFERRED
```

UR should review Photoshop position/form/interaction against the current reference documents and return PASS or bounded revision findings.
