# INK UI final checklist — bounded CSS correction workpack v1.0

STATUS: `UR_FINDING / DEV_AUTHORIZED_AFTER_R1_EVIDENCE_PROMOTION`

TASK: `INK-UI-FINAL-CHECKLIST-CSS-001`  
OWNER: `UI DEV → UR RECHECK`  
BRANCH: `work/ink-ui-final-checklist-css-001`  
BASE: promoted `INK-UI-FINAL-CHECKLIST-CLOSURE-001` R1 main (pin exact SHA before editing)

## Confirmed scope

1. `AB02`: presentation `!important` budget is zero. At minimum, `styles.css` has `gap:8px!important` on `.document-status-info` and `padding:0!important` on `.shell-panel-section`. Classify all 36 occurrences under the guardrail; remove presentation importance through selector/cascade cleanup while preserving state visibility and reduced-motion semantics. Do not treat the total count as the requirement.
2. `AO03`: final Light UI has component-local gray literals bypassing semantic tokens, including `#555`, `#303030`, `#ddd`, `#c9c9c9` in the final panel/Dock rules. Reconcile the affected normal UI color roles with the existing semantic token authority. Do not add a parallel palette or a final override layer.

Changed product scope is limited to `product/source/styles.css` and any directly necessary semantic CSS tokens in that file. Update focused QA assertions that currently require the old literal `!important` spelling. Do not alter Core, Renderer, Document, History, Geometry, CHAT, FORMAT_VERSION, shell state ownership, or unrelated UI.

## Required proof and handoff

- Before/after inventory of all 36 `!important` occurrences with semantic/presentation classification and reasons for retained semantic cases.
- Focused static QA for `AB02` and `AO03`, plus UI-A/B/C QA suite. Keep hidden-state, reduced-motion, panel scrolling/stacking, status strip, responsive Tools/Dock and first paint intact.
- Current-main browser visual/interaction evidence at 1280×1024 and 960×800 for affected CSS surfaces; compact mode if touched. Capture panel expanded/collapsed, status, hover and disabled cases as applicable.
- CSS size/selector counts, no new width family, no extra panel/menu authority, no hand-edit of generated shells.
- Exact DEV HEAD and changed-file list. State whether the product delta requires exact-SHA integrated Runtime under the repository revalidation policy. DEV does not launch the central Runtime or promote itself.

Return `STOP → UR`. UR rechecks `AB02`, `AO03` and affected IDs. If a fix requires Core/global authority, `STOP → MR / INTEGRATION_REQUIRED` before modifying that authority.
