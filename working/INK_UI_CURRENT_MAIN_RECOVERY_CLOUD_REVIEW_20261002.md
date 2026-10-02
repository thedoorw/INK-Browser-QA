> Completion update — 2026-10-02: the partial-evidence disposition below is historical. All required gates and the final DEV handoff are now recorded in [INK_UI_CURRENT_MAIN_RECOVERY_FINAL_DEV_RETURN_20261002.md](INK_UI_CURRENT_MAIN_RECOVERY_FINAL_DEV_RETURN_20261002.md). Product candidate remains cdb90787; Supervisor acceptance is pending. C04 is not started.

# UI recovery cloud-browser review — 2026-10-02

STATUS: FRESH_PARTIAL_BROWSER_EVIDENCE / RECOVERY_ACCEPTANCE_HOLD

Candidate: cdb90787b8a17729a67e6318ded6557fee5b730f.
Candidate product/source tree: 86bdf0eacebb6f930062d9d2c1bb9b048b9fc7ca.
Exact candidate tree exposed under qa/previews/ui-recovery-cdb90787 by QA-only main commit e18fdcb9a19b89741c3e12a0258b05d018e2e48d. Official product/source unchanged.
Matched-size iframe harnesses: QA-only main commit 208aa8424c6f8314d2a060dfa2daa72d0f00270c.

## Correction
The earlier SOURCE_RETURN environment statement was incomplete. WORK cloud Chrome is available and successfully operated. Only local Chromium was absent; its installer failed. Cloud localhost navigation was ERR_BLOCKED_BY_CLIENT, so exact Git-tree QA preview was used. No product promotion was needed.

## Reviewer exposure
Reviewer already read historical conclusions. This is a delta-first/source-informed bounded recheck, not fully blind independent review.

## Fresh observations
Top-level viewport 1363x936, DPR1.
- No document: Navigator numeric/slider/+/- are disabled; no drawable stage. Screenshot captured before test document creation.
- Native File > New creates a finite A4 document; Navigator controls become enabled.
- workspaceSwitch count1, parent contextualOptions, rectangle x1241.5 y29.5 w112.5 h26.
- contextualControlHost x83 right1235.5; gap to switch6px; switch right1354, app viewport right1363 (9px).
- Brush/Text/Lasso selected through visible controls/flyouts; switch remains fixed-right. Horizontal contextual overflow is intentional.
- All11 menu triggers measured content-dependent widths and8px inline padding.
- Clicking Creation after document creation leaves visible Layout selected and app DOM data-space=layout. C04 defect independently reproduced; FUNCTIONAL HOLD.
- Reference expanded sections produce visible square thumb; computed scrollbar-color auto and WebKit thumb radius0.
-12 native Add Layer clicks produce Layers overflow and12 History entries. Layers/History square scrollbar samples captured.
- Libraries empty state still produces an overflow body; square scrollbar sample captured.
- Properties fixed cards visibly crop content in observed state; overflow:hidden cards include preview49/68px, color39/54px, slider43/60px client/scroll height. No actual Properties overflow-scrollbar sample established. This is an additional observed delta, not automatically a new recovery mutation authorization.
- Sampled browser warning/error list contained cloud extension metadata errors; no product-origin error observed in that sampled list. This is not full console-error coverage.

## Matched-size framed evidence
Iframe content geometry is measured separately from the outer1363x936 browser.
1280x1024: contextual host right1152.5; switch x1158.5 right1271.
960x800: Brush/Text/Lasso operated; switch remains visible, captured representative Brush screenshot.
Full-page1280 screenshot API timed out. Viewport captures are partial (outer page scroll may crop the top); those incomplete/transitional captures are not used as full1280 evidence. Runtime DOM updates and screenshots can lag; intermediate snapshots are not stable visual closure.

## Evidence scope / remaining gates
NOT FULL_RECOVERY_PASS.
Still required:
- complete stable1280x1024 no-document/document screenshots;
- complete stable960x800 document/tool coverage (framed measurements supplement, not silently replace top-level contract);
- actual Properties scrollbar sample or reproduced current-source explanation/disposition;
- loaded HTML/CSS/content identity attestation beyond URLs + deployment Git tree; transitive runtime bytes remain unverified;
- full fresh state/error evidence and Supervisor final bounded review.
C04 entry remains blocked. No UI merge to official product/source. C06/New Document/Options semantics excluded.

## QA baseline
Old shared-portable-web-shell-parity test's same3 failures reproduced on unchanged0ad0c663 baseline; current exact normalized delivery parity and generator check pass. No assertions weakened, no coverage deleted.

## Durable next action
Continue fresh recovery browser evidence and resolve the named evidence gaps; do not claim no browser and do not start C04 until recovery acceptance is recorded.
