# INK UI Current-Main Recovery — DEV Dispatch v1.0

STATUS: ACTIVE / BLOCKED UNTIL CORE PROMOTION INTEGRATED
DATE: 2026-10-02
REPOSITORY: thedoorw/INK-Browser-QA
SSOT: GitHub

## USER completion directive — 2026-10-02

USER requires this recovery DEV pass to **finish the assigned recovery package before stopping**.

Partial evidence, interim review, a source-only candidate, a preview publication, local-browser unavailability, screenshot timeout, or a temporary QA inconvenience is **not a STOP condition**.

The existing candidate `cdb90787b8a17729a67e6318ded6557fee5b730f` is the product candidate to finish unless fresh evidence proves a product defect that requires a bounded correction. Do not restart or redesign the recovery.

DEV must continue until every required recovery gate below is resolved:

```text
1280x1024_NO_DOCUMENT = COMPLETE
1280x1024_DOCUMENT_OPEN = COMPLETE
960x800_DOCUMENT_OPEN = COMPLETE
BRUSH_OPTIONS = COMPLETE
TEXT_OPTIONS = COMPLETE
LASSO_OPTIONS = COMPLETE
MENU_GEOMETRY = COMPLETE
REFERENCE_SCROLLBAR = COMPLETE
LAYERS_SCROLLBAR = COMPLETE
HISTORY_SCROLLBAR = COMPLETE
LIBRARIES_SCROLLBAR = COMPLETE
PROPERTIES_SCROLLBAR_OR_EXPLICIT_VALID_DISPOSITION = COMPLETE
BROWSER_LOADED_HTML_CSS_IDENTITY = COMPLETE
PAGE_ERROR_CHECK = COMPLETE
TECH_DEBT_RETURN = COMPLETE
FINAL_DEV_RETURN = COMPLETE
```

For Properties:
- first reproduce the real current panel/content state and determine the actual scroll owner;
- if a real overflow scrollbar is part of that state, capture and measure it;
- if the current authoritative Properties topology has no scrollbar owner for the tested state, record the exact DOM/computed-style/source reason and mark the requirement with an explicit evidence-backed disposition rather than fabricating overflow merely to obtain a screenshot;
- cropped/hidden content discovered during this check is a separate visible defect and must be recorded, not silently fixed outside this recovery scope.

Browser/evidence execution rule:
- cloud browser evidence is valid and already proven available;
- local Chrome absence is not a blocker;
- if one capture method times out, use another browser/capture route while preserving exact candidate identity and required viewport geometry;
- do not stop at `FRESH_PARTIAL_BROWSER_EVIDENCE`.

Allowed early STOP conditions are limited to:

```text
A. candidate product bytes must change outside the authorized recovery scope;
B. a Core / FORMAT_VERSION / History / C04 / C06 / New Document conflict is encountered;
C. required repository/browser permissions are unavailable across all authorized execution routes;
D. evidence proves the accepted recovery semantic delta itself is invalid and requires Supervisor redesign.
```

If none of A–D occurs, DEV must continue and complete the package.

## Purpose

Recover already accepted UI work that is absent from current main, without broad redesign and without accumulating another patch layer.

This is a recovery/integration package, not a new visual invention pass.

Authority:
- ACTIVE/INK_CURRENT_WORK_ORDER.md
- working/INK_UI_CURRENT_MAIN_VISUAL_REJECTION_20261002.md
- working/INK_UI_POST_SUP11_REFINEMENT_SUPERVISOR_REVIEW_20261002.md
- ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md
- ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md

Historical accepted UI candidate:
- branch: work/ink-ui-post-sup11-refinement-20261002
- exact accepted candidate: 592134bd814b6e684ed60abe008d9d039ea79b57

## Entry gate

Do not start until the accepted Core spatial-index promotion is integrated into latest main and the integrated main SHA is recorded.

Then:
1. fetch latest main;
2. create fresh branch:
   `work/ink-ui-current-main-recovery-001`;
3. do not merge/cherry-pick the divergent old UI branch wholesale;
4. replay only the accepted semantic UI deltas described below.

## Accepted deltas to recover

### UI-R01 — SUP-12 scrollbar authority cleanup
- remove the competing global non-auto `scrollbar-color` authority;
- retain the existing shared WebKit scrollbar primitive;
- no panel-specific scrollbar skin;
- document scrollbar/range semantics remain separate.

### UI-R02 — workspace switch placement recovery
Move the existing single `#workspaceSwitch` node:
- out of the desktop-hidden `.topbar-center`;
- into `#contextualOptions`;
- fixed at the right side after the flexible `#contextualControlHost`;
- preserve existing IDs, handlers and state owner;
- no second workspace switch;
- no C04 behavior repair in this package.

The accepted placement relation is:
`contextual control host → flex/overflow → existing workspace switch fixed-right`.

### UI-R03 — application menu spacing recovery
- remove all eleven per-menu fixed width authorities;
- remove the superseded 7 px desktop trigger padding authority;
- use one shared 8 px inline padding rule;
- width follows label content;
- keep menu labels/routes unchanged.

### UI-R04 — delivery identity
Update only the delivery/cache identity needed so the browser actually loads the recovered HTML/CSS.
Do not alter service-worker behavior.

## Required anti-technical-debt cleanup

Before editing, inventory the current-main source authority for:
- `#workspaceSwitch` parent and visibility chain;
- all `.topbar-center` desktop visibility rules;
- application-menu width/padding rules;
- `scrollbar-color` declarations;
- shared WebKit scrollbar rules.

After editing:
- remove superseded local authorities in the same change;
- do not add a second selector layer to override an obsolete rule;
- no new `!important`;
- no new breakpoint family;
- no panel-specific scrollbar variants;
- no one-off per-menu widths/offsets;
- no duplicate workspace state owner.

## Hard boundaries

Do not:
- modify `product/source/src/ink.js`;
- repair C04 Creation/Layout behavior;
- implement 12800% zoom / C06;
- modify New Document/A4 architecture;
- change History semantics;
- change FORMAT_VERSION;
- redesign Options Bar parameter semantics beyond the accepted switch placement;
- fix unrelated current-main visual findings in this recovery package.

## Required evidence

Use fresh current-main-derived evidence, not the old candidate evidence as proof.

Minimum states:
- 1280×1024 no-document;
- 1280×1024 document-open;
- 960×800 document-open;
- Brush Options Bar;
- Text Options Bar;
- Lasso Options Bar;
- application menu trigger geometry;
- Reference / Layers / History / Libraries / Properties overflow-scrollbar samples.

Record:
- exactly one `#workspaceSwitch`;
- parent = `contextualOptions`;
- right-edge relation;
- no overlap with contextual host;
- menu shared padding / content-driven widths;
- scrollbar rendered geometry;
- browser-loaded HTML/CSS identity vs source;
- no page errors.

C04 expected result remains:
`PLACEMENT PRESENT / FUNCTIONAL HOLD`.
Do not hide that defect.

## Technical-debt return

Report:
```text
NEW_IMPORTANT_COUNT
NEW_BREAKPOINT_FAMILY
NEW_DUPLICATE_UI_STATE_AUTHORITY
PER_MENU_WIDTH_AUTHORITY_COUNT
GLOBAL_SCROLLBAR_COLOR_COUNT
WORKSPACE_SWITCH_NODE_COUNT
SUPERSEDED_RULES_REMOVED
CHANGED_PRODUCT_FILES
CANDIDATE_SHA
EVIDENCE_FILES
```

Required target:
```text
NEW_IMPORTANT_COUNT = 0
NEW_BREAKPOINT_FAMILY = 0
NEW_DUPLICATE_UI_STATE_AUTHORITY = 0
PER_MENU_WIDTH_AUTHORITY_COUNT = 0
GLOBAL_SCROLLBAR_COLOR_COUNT = 0
WORKSPACE_SWITCH_NODE_COUNT = 1 per delivery/template
SUPERSEDED_RULES_REMOVED = YES
```

## Stop

Do not merge to main.

**Do not STOP on partial completion.** A DEV handoff is valid only after every required evidence/completion gate in this dispatch is complete, or one of the explicit early-STOP conditions A–D in the USER completion directive is met and documented with exact evidence.

Normal successful stop condition:

```text
RECOVERY_IMPLEMENTATION = COMPLETE
REQUIRED_BROWSER_EVIDENCE = COMPLETE
REQUIRED_STATE_COVERAGE = COMPLETE
BROWSER_IDENTITY = COMPLETE
TECH_DEBT_RETURN = COMPLETE
FINAL_DEV_RETURN = COMPLETE
→ STOP TO SUPERVISOR
```

Then:
`RECOVERY CANDIDATE → Supervisor review → C04 repair stage`
