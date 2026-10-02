# INK UI Post-SUP11 Refinement — DEV Return 2026-10-02

STATUS: REVIEW CANDIDATE / STOP → SUPERVISOR + USER

Baseline product: `a9d122ccba14734caf6220a53044545494a8429b`
Candidate branch: `work/ink-ui-post-sup11-refinement-20261002`
Scope: SUP-12 scrollbar grammar; fixed-right existing workspace switch; shared application-menu trigger spacing.

## Result and limits

| Item | Result |
| --- | --- |
| SUP-12 | The five sampled right-panel scroll owners render rectangular thumbs and tracks in Chromium at 1:1. |
| Options Bar placement | The original `#workspaceSwitch` is the single node, inside `#contextualOptions`, fixed at its right edge. Brush overflow remains inside `#contextualControlHost`. |
| C04 workspace action | **FUNCTIONAL HOLD.** After clicking 創作, both the DOM and existing document authority still report `layout`. No UI or Core state workaround was added. |
| Menu rhythm | All eleven triggers have 8 px left/right padding, 24 px height, 14.4 px line-height, and 16 px adjacent text-box gaps in the 1280×1024 capture. Width follows text. |

### SUP-12 diagnosis

The old global `.app * { scrollbar-color: thumb track }` declaration activated Chromium's standard scrollbar styling, which took precedence over the `::-webkit-scrollbar-thumb` geometry. The old computed pseudo-element already reported `border-radius: 0px`, while the rendered thumb was a pill. Removing that competing declaration lets the existing **one shared WebKit primitive** render its 12 px scrollbar and square thumb/track. No panel-specific skin was added. The separate document scrollbar remains a range-control surface.

The browser inspection used a temporary 700 px overflow fixture inside each actual scrolling owner, removed when the page closed. Its sole purpose was to make the native scrollbar visible; no fixture is included in product source.

| Panel | Actual scroll owner | Before → after `scrollbar-color` | Thumb / track radius after |
| --- | --- | --- | --- |
| Reference | `.creative-workspace-body` | explicit gray pair → `auto` | 0 / 0 px |
| Layers | `.inspector-section.layers-panel` | explicit gray pair → `auto` | 0 / 0 px |
| History | `.inspector-section.history-panel` | explicit gray pair → `auto` | 0 / 0 px |
| Libraries | `.shell-library-panel .shell-panel-body` | explicit gray pair → `auto` | 0 / 0 px |
| Properties | `.inspector-section` in overview | explicit gray pair → `auto` | 0 / 0 px |

See [before owners](../qa/evidence/ink-ui-post-sup11-20261002/before-scroll-owners.json), [after owners](../qa/evidence/ink-ui-post-sup11-20261002/after-scroll-owners.json), and paired 1:1 crops named `before/after-{reference,layers,history,libraries,properties}-scroll-1280.png` in the [evidence directory](../qa/evidence/ink-ui-post-sup11-20261002/).

### Workspace switch and C04 authority

The existing node was rehomed from the hidden `.topbar-center` into the Options Bar, following the flexing contextual host. There is one `#workspaceSwitch` in each of the three HTML entry/template files and no new state code. At both 1280×1024 and 960×800 the switch is visible, 5 px inside the Options Bar right edge, without overlap. Brush's contextual host scrolls horizontally (1535/1070 px and 1395/750 px scroll/client width); the switch does not move. Text and Lasso resolve to their own tool contexts through the existing flyouts.

The current C04 route itself fails the required two-state behavior. The page starts in `layout` after a document is opened; clicking `layout` retains it; clicking `creation` also retains `layout`. `InkApp.switchWorkspace()` currently rewrites `creation` to `layout`, and `refreshWorkspaceUI()` enforces `layout` on a document page. Both controls are exposed in the requested position, but **the two-space interaction is not accepted or declared complete**. This Core/workspace authority defect needs its separate Supervisor decision; the present UI candidate does not alter it.

See [Brush/Text/Lasso layout, menu and state measurements](../qa/evidence/ink-ui-post-sup11-20261002/after-options-state-menu.json) and the six `after-options-{brush,text,lasso}-{1280,960}.png` crops in the evidence directory. The `after-options-state-after-creation-1280.png` crop shows that layout remains selected after the creation click.

### Top menu

Removed all eleven fixed per-menu widths and the superseded 7 px desktop padding. The shared trigger retains one 8 px inline padding authority. Menu labels and routes, including `物件(O)`, are unchanged. The Object popup still opens on click. See [before menu](../qa/evidence/ink-ui-post-sup11-20261002/before-menu-1280.png), [after menu](../qa/evidence/ink-ui-post-sup11-20261002/after-menu-1280.png), and exact measurements in `after-options-state-menu.json`.

## Technical-debt and delivery guard

```text
NEW_IMPORTANT = 0 (103 → 103)
NEW_BREAKPOINT_FAMILY = 0
NEW_STATE_AUTHORITY = 0
NEW_DUPLICATE_COVERED_VISUAL_AUTHORITY = 0
NO_ONE_OFF_MENU_OFFSET = TRUE
NO_PANEL_SPECIFIC_SCROLLBAR_SKIN = TRUE
NO_SECOND_WORKSPACE_STATE_OWNER = TRUE
SUPERSEDED_MENU_WIDTH_RULES_REMOVED = YES (11)
FORMAT_VERSION = 4 / UNCHANGED
CORE / HISTORY = UNCHANGED
```

The service-worker build ID and stylesheet URL version change only to identify this UI delivery and avoid reuse of the prior cached CSS. No service-worker behavior or Core code changed.

Validation: `git diff --check`; `node engineering/source/scripts/check-functional-ui-assembly.mjs` reports `PUI 74/74`; Chromium 153 at device scale 1, 1280×1024 and 960×800, no page errors. Fresh HTML and CSS response SHA-256 values match the candidate source ([browser-loaded identity](../qa/evidence/ink-ui-post-sup11-20261002/browser-loaded-identity.json)). The local browser used a temporary Noto Sans CJK TC font for readable Traditional Chinese screenshots; this font is not shipped with INK. Service workers were blocked in the local clean browser contexts; the deployed page is not claimed as verified by this branch evidence.

No New Document/A4 structure, spatial index, or broader UI redesign is in this candidate. **STOP for Supervisor / USER review. No final UI PASS is claimed.**
