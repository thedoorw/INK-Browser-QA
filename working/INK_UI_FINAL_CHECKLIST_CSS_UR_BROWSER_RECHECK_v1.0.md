# INK UI Final Checklist CSS — UR Browser Recheck v1.0

STATUS: `UR_PASS / PR93_PROMOTED / RUNTIME_DEBT_DEFERRED`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`

## Exact target

- PR: #93
- corrected candidate: `b7dc5971768893c2d690eed22bf2801fc0aec4ae`
- promoted main merge: `c66b1eba2376f01cfba14f71b6f29d7e2fa022e4`
- browser evidence: `qa/evidence/ink-ui-final-checklist-pr93-targeted-b7dc59717688-hosted-r5/report.json`
- workflow run: `36511504388`
- environment: Windows / Chrome 153.0.8010.53 / DPR 1
- central Runtime: **NOT RUN**

## Source recheck

Focused suite:
`node --test qa/ink-ui-final-checklist-css.test.mjs qa/ink-ui-a-photoshop-shell-panels.test.mjs qa/ink-ui-b-full-capability-controls.test.mjs qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

Result: **26 PASS / 0 FAIL**.

## Browser recheck

Both `1280×1024` and `960×800` are PASS.

Verified directly:
- script-disabled first paint is Light and orphan legacy contextual controls are hidden;
- normal collapsed shell and no horizontal overflow;
- brush flyout and hidden tool labels;
- expanded Layers panel, 4 stack regions / 3 splitters and splitter drag;
- panel body scrolling and 16 px tokenized scrollbar;
- panel options hover/focus and dock normal/hover/active states;
- disabled state is semantically disabled and visually distinct;
- status/document chrome remains visible and does not overlap the open panel;
- Light semantic token roles and primary/secondary text contrast checks.

Visual review of the retained first-paint, expanded-panel and panel-options captures confirms the reproduced dark first-paint orphan-control block is gone at both required sizes.

## Reproduced defect and bounded correction

Old candidate `c0c3ddacd07b3022685990352b93335a8a6bd7eb` reproduced one UI defect at both required viewports: static `#quickControls` painted before `web-shell.js` mounted contextual controls, yielding a dark 39×98 legacy block.

Bounded correction in `b7dc5971768893c2d690eed22bf2801fc0aec4ae`:
- CSS-only first-paint concealment of unmounted legacy contextual controls;
- focused source assertion added;
- no Core/global authority, JS behavior, schema or FORMAT_VERSION change.

The corrected exact candidate passes source and browser recheck and was promoted as PR #93.

## Checklist disposition

Closed by this exact browser/source evidence:
`AB02, AO03, AH02, AH12, AM08, AN09, AN10, AO05, AO06, F21, AC08`.

Not closed by inference:
- `AO04` remains open because disabled-text contrast was not independently quantified against an item-specific acceptance criterion.
- broader Photoshop-reference, final Runtime, USER acceptance and unrelated interaction findings remain open.

## Runtime

`RUNTIME_DEBT = DEFERRED_TO_FINAL_CHECKLIST_BATCH`

The prior final Runtime is historical for its tested product SHA only. No central Runtime was started in this batch.
