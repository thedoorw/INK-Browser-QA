# INK DEV Progress

STATUS: `UI-A / DEV_COMPLETE / STOP_TO_MR`
TASK: `INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`
BRANCH: `work/ink-ui-a-photoshop-shell-panels-001`

BASELINE_MAIN: `9a4b374747c049d107b2525fb811faa1929a9770`
DEV_START_HEAD: `840b0e37001c2546c37bbe66dcd942703e54716c`
EXACT_IMPLEMENTATION_QA_HEAD: `7ca7045b1de50173d33dee187a962b840419410a`

> The implementation/QA HEAD above is the exact code tree reviewed before this progress-only commit. The current branch HEAD is the commit containing this report and must be read from GitHub at handoff.

## Scope completed

UI-A only:

- Photoshop-aligned desktop shell geometry normalized to the measured 61 px top shell.
- exact top-level menu host order established:
  - File / Edit / Image / Layer / Type / Select / Filter / Object / View / Window / Help.
- top application menu popup grammar normalized; top-level Brush menu retired.
- active-document shell host added:
  - 28+1 document tab band;
  - optional 17 px top/left rulers + 17×17 origin corner;
  - 16+1 active-document status strip;
  - empty-document CSS state removes document tab/rulers/status reservation.
- Tools shell normalized:
  - 39+1 single-column authority;
  - 72+1 double-column authority;
  - compact 31×26 tool cells;
  - existing draw-tool flyout retained and normalized to compact Photoshop-like popup density.
- right panel authority normalized:
  - 39+1 collapsed Dock;
  - 252 px expanded reference width, edge-attached and resizable;
  - expanded panel reflows canvas without adding the collapsed Dock width;
  - shared panel options menu with reset-width / close;
  - Window menu and Dock use the same panel registry/state.
- final UI-A panel homes exposed through the existing Inspector / Creative Workspace authority:
  - Properties;
  - Layers;
  - History;
  - Navigator;
  - Pages;
  - Color;
  - Channels;
  - Adjustments;
  - Libraries;
  - Reference;
  - Compose;
  - CHAT;
  - Revision;
  - Specialist.
- Navigator uses existing viewport/camera/render authority for thumbnail proxy, drag-pan, fit and zoom controls.
- Pages desktop route uses existing document/page APIs for add/duplicate/delete/switch/rename path; legacy mobile Pages sheet remains the compact responsive route.
- Color panel proxy calls existing `setColor` authority; no duplicate color state was created.
- Channels / Adjustments / Libraries receive normal UI placement homes only; full capability command wiring remains UI-B where required.
- desktop duplicate New/Open/Save, Undo/Redo, Pages opener and legacy inspector opener are retired from visible desktop chrome while existing handler endpoints remain available to menu/shortcut routing.
- existing light shell authority normalized around current Photoshop Web anchors:
  - structural `#E9E9E9`;
  - primary surface `#FFFFFF`;
  - accent `#3B63FB`.

## Changed files

- `product/source/shell.template.html`
- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/ink.js`
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`
- `ACTIVE/INK_DEV_PROGRESS.md` (this report)

Generated delivery HTML was regenerated from `shell.template.html` using the substitutions defined by `product/source/generate-shell.mjs`; exact output parity was verified.

## Focused QA results

Central Runtime: **NOT RUN — forbidden by UI-A gate.**

Focused/static QA against GitHub branch blobs:

- PASS — `web-shell.js` syntax compilation.
- PASS — exact 11-menu order and no top-level Brush menu.
- PASS — exact 14-panel placement inventory.
- PASS — measured geometry contract:
  - 24+1 menu;
  - 35+1 options;
  - y=61 workbench origin;
  - 28+1 active document tab;
  - 17 px rulers;
  - 16+1 active-document status;
  - 39+1 / 72+1 Tools;
  - 39+1 collapsed Dock;
  - 252 px expanded reference;
  - 28 px panel header.
- PASS — expanded panel is edge-attached and canvas-reflowing.
- PASS — active-document status gating exists.
- PASS — desktop duplicate File/History/panel openers are not visible.
- PASS — Pages desktop route converges on `INK_WEB_SHELL`.
- PASS — Navigator calls existing camera / renderer authority.
- PASS — Pages calls existing document/page APIs.
- PASS — Color calls existing color authority.
- PASS — panel options menu has real reset-width / close actions.
- PASS — light semantic anchors are present.
- PASS — `index.html` equals the Web generation of `shell.template.html`.
- PASS — `index-standalone.html` equals the Portable generation of `shell.template.html`.
- ADDED — `qa/ink-ui-a-photoshop-shell-panels.test.mjs` with the same focused source/static contract.
- LOCAL BROWSER SMOKE — not executed in this DEV environment; no central/runtime substitute was used.

## PUI disposition delta

Authoritative PUI register is **not rewritten by DEV**. Candidate disposition delta for MR/UR review:

- `PUI-005..009`: desktop duplicate file/history chrome → **RETIRE_VISIBLE_DESKTOP / handler endpoints retained**.
- `PUI-028..040`: UI-A-owned shell/panel placement homes → **HOST_NORMALIZED / command completion remains package-specific**.
- `PUI-052`: host framework → **IMPLEMENTED_UI_A**.
- `PUI-053..055`: host/menu/ruler framework → **IMPLEMENTED_UI_A**.
- `PUI-057..068`: negative-control / Help-host architecture → **NO_P2_PROMOTION / host only where applicable**.

No P1/P2 disposition is promoted to final acceptance by DEV.

## Gap delta

Authoritative gap register remains unchanged until MR/UR acceptance; `OPEN_UI_GAPS = 34` is therefore not decremented here.

Candidate UI-A implementation delta:

- `G-01 Pages`: **IMPLEMENTED_UI_A / MR_UR_PENDING** — one desktop docked Pages route using existing page authority.
- `G-02 Workspaces`: **PARTIAL_UI_A** — shell/View secondary route host normalized; downstream command completion remains bounded by later package ownership.
- `G-04 Navigator`: **IMPLEMENTED_UI_A / MR_UR_PENDING** — normal panel home with thumbnail/proxy, drag-pan, fit/zoom.
- `G-05 Select/Lasso`: **HOST_ONLY_UI_A** — Select menu host exists; full selection command/flyout completion remains UI-B.
- `G-14 Adjustments`: **PLACEMENT_HOME_UI_A** — normal Adjustments panel home exists; full adjustment command wiring remains UI-B.
- `G-15 Filter`: **MENU_HOST_UI_A** — required top-level Filter host exists; filter commands/dialogs remain UI-B.

## Health delta

- `FORMAT_VERSION`: unchanged.
- Core semantics: unchanged.
- second state/authority: not introduced; shell proxies route to existing document/view/color/Inspector/Creative Workspace authorities.
- P2 capability: not added.
- central Runtime: not started.
- source/static shell health: PASS.
- generated shell parity: PASS.
- runtime health baseline: **UNCHANGED / NOT RE-EVALUATED BY DESIGN**.

## Gate / handoff

- UI-B: **HOLD**.
- UI-C: **HOLD**.
- central Runtime: **HOLD**.
- next owner: **MR**.
- MR action: review UI-A diff, focused QA contract, PUI candidate delta and gap candidate delta.
- DEV: **STOP**.
