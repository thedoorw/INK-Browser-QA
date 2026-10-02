# INK UI Post-SUP11 Refinement — Supervisor Review 2026-10-02

STATUS: SUPERVISOR REVIEWED / USER CHECKPOINT

Repository: `thedoorw/INK-Browser-QA`

Baseline:
`a9d122ccba14734caf6220a53044545494a8429b`

Candidate branch:
`work/ink-ui-post-sup11-refinement-20261002`

Candidate:
`592134bd814b6e684ed60abe008d9d039ea79b57`

Authority:
- `ACTIVE/INK_UI_POST_SUP11_REFINEMENT_DEV_DISPATCH_v1.0.md`
- `working/INK_UI_MICRO_MODULE_NORMALIZATION_SUPERVISOR_REVIEW_20261002.md`
- `ACTIVE/INK_UI_MICRO_MODULE_GRAMMAR_v1.0.md`

## Independent scope check

Product mutation is bounded to:
- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/service-worker.js`
- `product/source/shell.template.html`
- `product/source/styles.css`

No `web-shell.js`, Core, History, spatial-index, New Document or FORMAT_VERSION mutation is present.

The remaining candidate files are evidence / DEV return only.

## UI-13A / SUP-12 — ACCEPTED

Independent source and rendered-evidence review supports the DEV diagnosis.

Before:
- global `.app * { scrollbar-color: ... }` was present;
- Chromium rendered the native thumb as a rounded/pill form even though the WebKit pseudo-element reported zero radius.

Candidate:
- removes that competing `scrollbar-color` authority;
- keeps the existing single shared WebKit scrollbar primitive;
- does not add panel-specific scrollbar skins.

Fresh 1:1 evidence was inspected for Reference, Layers, History, Libraries and Properties scroll owners. The visible thumb/track geometry is rectilinear in the sampled states.

Disposition:
```text
SUP-12 = RESOLVED
RIGHT_PANEL_SCROLLBAR_GRAMMAR = ACCEPTED
PANEL_SPECIFIC_SCROLLBAR_SKIN = NONE
```

## UI-13B / Options Bar workspace switch — PLACEMENT ACCEPTED / FUNCTIONAL HOLD

The existing `#workspaceSwitch` is rehomed to the far-right side of `#contextualOptions`.

Independent checks:
- exactly one `#workspaceSwitch` exists in each of the three HTML/template delivery files;
- no new workspace state owner is introduced;
- 1280×1024 and 960×800 evidence keeps the switch visible while contextual controls change;
- long Brush controls remain inside the contextual host and do not push the switch offscreen.

However the existing workspace authority does not currently provide two functioning document states:
- initial state = `layout`;
- clicking `layout` remains `layout`;
- clicking `creation` also remains `layout`.

Because this candidate contains no workspace JS/Core mutation, this is not a regression introduced by the re-home. It is an existing C04 authority defect exposed by the required state test.

Disposition:
```text
OPTIONS_BAR_WORKSPACE_SWITCH_POSITION = ACCEPTED
ONE_EXISTING_WORKSPACE_AUTHORITY = PRESERVED
C04_CREATION_LAYOUT_TWO_STATE_BEHAVIOR = OPEN / AUTHORITY DEFECT
DO_NOT_DECLARE_WORKSPACE_SWITCH_FUNCTIONALLY CLOSED
```

## UI-13C / application-menu spacing — ACCEPTED

The candidate removes the eleven fixed per-menu widths and the superseded 7 px desktop padding.

All eleven triggers now use one shared 8 px inline padding authority and content-driven width:
`檔案(F) 編輯(E) 影像(I) 圖層(L) 文字(Y) 選取(S) 濾鏡(T) 物件(O) 檢視(V) 視窗(W) 說明(H)`.

Independent source audit finds no remaining `data-application-menu="..."` one-off width rule in the candidate stylesheet.

Disposition:
```text
TOP_MENU_EQUAL_SPACING = RESOLVED
OBJECT_MENU_ONE_OFF_PATCH = NONE
```

## Technical-debt guard

Independent recheck:
```text
!important                   103 -> 103
BREAKPOINT_FAMILIES          [760, 761, 1120] -> unchanged
scrollbar-color declarations 1 -> 0
PER-MENU WIDTH AUTHORITY      11 -> 0
WORKSPACE SWITCH NODE         1 per entry/template
NEW UI STATE AUTHORITY        none observed
```

The candidate also updates delivery identity only through the stylesheet version and service-worker build ID.

## Supervisor disposition

```text
CANDIDATE_592134b = ACCEPTED_WITH_C04_AUTHORITY_HOLD

SUP-12_PANEL_SCROLLBAR = RESOLVED
OPTIONS_BAR_RIGHT_WORKSPACE_SWITCH_PLACEMENT = ACCEPTED
C04_WORKSPACE_TWO_STATE_FUNCTION = OPEN
TOP_MENU_EQUAL_SPACING = RESOLVED
TECH_DEBT_GUARD = ACCEPTED

PRODUCT_SOURCE_MUTATION_BY_SUPERVISOR = NONE
FINAL_UI_COMPLETE = NOT CLAIMED
USER_VISUAL_AUTHORITY = FINAL
```

No Core repair, New Document decision or unrelated UI redesign is authorized by this review.
