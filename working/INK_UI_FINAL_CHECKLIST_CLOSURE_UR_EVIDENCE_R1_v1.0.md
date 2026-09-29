# INK UI final checklist closure — UR evidence R1

STATUS: `EVIDENCE_R1 / UI_COMPLETE_HOLD / DEV_BOUNDED_FINDINGS_REQUIRED`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`  
BASE_MAIN: `a8383c297fc3f24130f8ed81bbfb6768ca2bedb1`  
BRANCH: `work/ink-ui-final-checklist-closure-001`

## Recheck result

```text
TOTAL = 592
PASS = 399
FAIL = 192
N_A = 1
UNREVIEWED = 0
OPEN = 192
USER_ACCEPTANCE_PENDING = 10
UI_COMPLETE = HOLD
```

New evidence closes exactly 15 IDs: `B05 C07 AC04 AC05 AC07 AC13 AC14 AK01 AK03 AK04 AK05 AK08 AK12 AN02 AF08`. The authoritative per-ID ledger has their updated dispositions and references. No other FAIL was silently carried to PASS.

## Focused QA

`AF08`: the legacy UI-A static test expected the old literal `const camera = app.page().camera`. The current Navigator obtains `app.renderer.viewportWorldBounds()` and updates the existing page camera through `centerCameraOnWorld`. The QA assertion was updated to check these actual authorities. On this branch:

```text
node --test qa/ink-ui-a-photoshop-shell-panels.test.mjs \
  qa/ink-ui-b-full-capability-controls.test.mjs \
  qa/ink-ui-c-photoshop-fidelity-closure.test.mjs

25 PASS / 0 FAIL
```

This is a QA-only correction. It does not alter Navigator product behavior.

## Reference and visual evidence

- Adobe official behavior sources: [Navigator](https://helpx.adobe.com/photoshop/using/viewing-images.html), [Snap and Snap To](https://helpx.adobe.com/photoshop/using/positioning-elements-snapping.html), [panel docking](https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/dock-undock-panels.html), [panel edge resizing](https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/stack-floating-panels.html). Adobe reference behavior is distinct from the 21.2.12 screenshot geometry.
- Legacy reference environment: `working/INK_UI_PS_REFERENCE_CAPTURE_AND_MEASUREMENT_PLAN_v0.1.md` §A and `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md` §1 establish Photoshop 21.2.12, Traditional Chinese, dark theme, 1280×1024 capture, 1280×994 app crop. Windows display and Photoshop UI scaling are explicitly unknown. Five active-document captures and hashes are listed. The incomplete P0 capture set remains open.
- Derived current-main visual evidence is in `qa/evidence/ink-ui-final-checklist-closure-001/`; `manifest.json` names artifact `10979718534`, exact source hashes, crop rectangles, dimensions and generated-file hashes. The three crops prove the top 61px, single Tools and collapsed Dock states. The overlay and difference image compare major structural boundaries. These images do not prove a double toolbar, expanded panels, interaction, or light-gray user acceptance.
- Final Runtime artifact remains 110/110 UI PASS on unchanged product bytes. No central Runtime was rerun.

## Reproduced source findings

`AB02` concerns **presentation** `!important` count, not the total count. Current `styles.css` has 36 total occurrences. At least two are presentation declarations: `.document-status-info{gap:8px!important}` (line 3004) and `.shell-panel-section{padding:0!important;overflow:hidden!important}` (line 3046; padding is presentation). State visibility and reduced-motion cases must be classified separately, preserving necessary semantic behavior. Prior audit wording that treated all 36 as failures was overbroad; the ledger now records the narrower verified cause. The requirement still FAILS.

`AO03` is also directly reproduced. Final Light UI CSS contains component-local gray literals outside semantic roles, including `.panel-dock-button{color:#555}`, `.inspector-head strong{color:#303030}`, `.panel-options-menu button:hover{background:#ddd}`, and `.shell-panel-footer button` border `#c9c9c9`. The ledger now identifies these exact source facts. This is an additional bounded UI presentation finding, not a Core issue.

## Bounded DEV correction gate

Workpack: `working/INK_UI_FINAL_CHECKLIST_CSS_BOUNDED_DEV_WORKPACK_v1.0.md`.

DEV should change only the confirmed presentation violations and required adjacent QA contracts. UR will recheck `AB02`, `AO03`, related Light state and responsive behavior, plus any adjacent checklist IDs affected by the diff. Product source changes trigger a Runtime revalidation decision; they do not automatically rerun central Runtime. Any Core/global authority requirement is `STOP → MR / INTEGRATION_REQUIRED`.

The remaining evidence-only findings `UI-AUD-02/03/05/06/07/08/09` require targeted captures, exact source assertions and interaction QA. Missing proof is not an instruction to alter product. The ten USER acceptance items remain FAIL pending the user's own review after AI/QA closure.
