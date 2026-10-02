# INK UI Micro-Module Normalization — Supervisor Review 2026-10-02

STATUS: NORMALIZATION_CANDIDATE_ACCEPTED_WITH_OPEN_VISUAL_REFERENCE / NO PRODUCT MUTATION BY SUPERVISOR
ROLE: INK UI Standards Supervisor MR
CANDIDATE: a17cf7d46c151744668cf42f55b15212fe758415
BASE: 361ebc21ae6917b23031180bfd1b7b8fa278cfde
DISPATCH: ACTIVE/INK_UI_MICRO_MODULE_NORMALIZATION_DEV_DISPATCH_v1.0.md

## Review method

This review does not accept the DEV result document as evidence by itself.

Inspected:
- exact candidate diff;
- final product source;
- DEV before/after rendered screenshots;
- final computed-state browser evidence;
- capability-surface matrix;
- technical-debt health evidence;
- Photoshop reference morphology where needed.

Historical PASS labels were not used to close current visible deltas.

## Confirmed improvements

The candidate materially improves the current UI system:
- current double/single Tools render at the intended Photoshop-class widths and the single-column state keeps required bottom controls inside the rail;
- Reference panel removes the previous green CTA/card-heavy presentation in its normal state;
- panel tabs use a shared 28 px / regular-weight grammar;
- panel-group splitters are now a distinct 3 px structural class;
- sliders use a shared thin-track/circular-thumb grammar and touched scrollbars use rectangular treatment;
- Edit menu is reorganized using existing INK commands rather than invented Photoshop commands;
- Layers row density, footer actions, selection/lock/visibility/reorder behavior are substantially normalized;
- contextual tool parameters are expanded through existing state authorities rather than a second parameter model;
- `!important` count is independently confirmed to decrease from 116 to 104, with no new breakpoint family or new state authority reported.

These observations do not constitute final Photoshop fidelity or USER acceptance.

## Blocking findings

### SUP-01 — PANEL STACK STATE IDENTITY / SPECIALIST LEAK

Current source defines the overview group with:

```text
navigator / properties / color / adjustments / specialist
```

but the rendered expanded tab strip explicitly filters out both `adjustments` and `specialist`.

Consequences:
- `Adjustments` is a valid Group-A panel but has no visible expanded tab;
- `Specialist` can remain the selected body state while the visible header shows unrelated normal tabs;
- DEV evidence `after-options-clone.png` reproduces this: the upper group header shows normal overview tabs while the body presents `進階製作／診斷` / Program Import diagnostic content.

Required correction:
- expose `Adjustments` as a normal Group-A tab;
- remove `Specialist` from the normal default stack authority;
- keep Specialist reachable through its diagnostic/Help/Window route, with visible identity when explicitly opened;
- changing back to an ordinary creative tool must not leave an invisible Specialist selection underneath unrelated tabs.

This is a state-identity defect, not a styling preference.

### SUP-02 — REFERENCE EXPANDED STATE STILL VIOLATES PANEL GRAMMAR

Normal Reference state is substantially improved, but expanded/detail state still exposes:
- `Radial count`;
- `Not executed. 直接擷取 remains active.`;
- explanatory workflow/status prose inside the ordinary creative panel.

This conflicts with the current rules for:
- Traditional-Chinese normal product chrome;
- removal/rehome of engineering/status prose from ordinary creative panels;
- compact parameter rows rather than dashboard/workflow narration.

Required correction:
- localize or rename user-facing parameter labels;
- keep only the compact parameter/control needed for the creative task;
- move diagnostic/execution prose to Specialist/diagnostic surfaces or remove it where it does not carry necessary interaction feedback.

### SUP-03 — COVERED LEGACY CSS STILL COEXISTS WITH NEW AUTHORITY

**RESOLVED by cleanup candidate `f7e387c2977b3c69c160356bd368b4f387c602c2`.**

The candidate removed a large amount of CSS debt, but covered component families still retain earlier Web-App-era base rules underneath later Photoshop/shared rules.

Examples still present in the same current stylesheet include earlier declarations such as:
- rounded/elevated `.tool-rail` geometry;
- large rounded/colored `.primary-button` grammar;
- repeated component-family definitions that are later overridden by the new shared workstation block.

The rendered result may currently be correct because later rules win, but this still leaves two styling grammars active in source for covered classes.

Required correction:
- for component families touched by this normalization, remove superseded visual declarations rather than relying on cascade override;
- keep intentional responsive/state variants, but remove dead conflicting base geometry/theme declarations;
- do not broaden this into an unrelated whole-stylesheet rewrite.

The DEV debt report remains useful evidence, but `935 declarations removed` does not by itself prove that covered dual authority is gone.

### SUP-04 — TOOLS COLOR SWATCH STATE SCALE

**REOPENED after USER correction.**

The prior withdrawal was incorrect. Photoshop single-column and double-column Tools intentionally use different foreground/background swatch scales.

Current INK uses one shared `--ui-swatch-size:18px` primitive for both layouts. That is not faithful to the Photoshop reference behavior.

Required correction:
- define separate single-column and double-column swatch-size tokens;
- measure each state from Photoshop reference evidence before implementation;
- preserve the same semantic foreground/background diagonal composition while allowing state-specific size and overlap;
- reset/swap utilities must reflow with each state;
- do not solve fit by arbitrary per-instance scaling or local overrides.

This is a state-specific reference rule, not a same-class consistency rule.

### SUP-05 — LEFT/RIGHT COLLAPSE GLYPH SIZE OVERRIDE BREAKS SAME-CLASS ALIGNMENT

**RESOLVED by cleanup candidate `f7e387c2977b3c69c160356bd368b4f387c602c2`.**

The left and right collapse controls use the same `i-collapse` SVG source, but current CSS does not render them at the same geometry.

Shared authority defines:
```text
.edge-chevron svg = 7 × 5 px
```

A later left-only override changes:
```text
.tool-layout-toggle svg = 9 × 8 px
```

The right panel-edge control remains at the shared 7 × 5 px geometry.

Result:
- the two same-class double-chevron controls acquire different optical envelopes;
- despite both being centered in a nominal 12 px strip, their perceived vertical position/baseline differs;
- this creates the USER-observed “one high, one low” mismatch.

Required correction:
- remove the left-only 9 × 8 px override;
- left and right collapse/expand controls must use the same 7 × 5 px glyph primitive, same strip height, same button box and same optical-centering rule;
- direction changes by transform/orientation only, not by size;
- verify both expanded and collapsed states side-by-side at 1:1 screenshot scale.

This is a same-class numeric defect and also evidence that a local override survived the shared-primitive migration.

## Capability → UI exposure disposition

The new matrix is useful and the candidate exposes several real existing parameters through their existing authorities.

However the matrix itself correctly states that it is a bounded audit and that every atomic parameter has not been individually reconciled.

Therefore:

```text
CURRENT NORMALIZATION = BATCH A + BOUNDED PARTIAL B
FULL CAPABILITY → UI EXPOSURE = NOT CLOSED
```

This is not a blocker to finishing the current micro-module normalization revision. Full exposure should remain a separate later batch using the normalized primitives created here.

## Photoshop glyph clarification

Direct recheck of the Photoshop reference confirms:
- side collapse/expand glyph = compact double chevron, approximately 7×5 px visible envelope;
- panel menu glyph = three horizontal lines, approximately 10×7 px visible envelope.

The DEV SVG direction for these two glyph classes is therefore broadly correct.

The Dataset and Master Guide were corrected to state this explicitly. Do not revert these glyphs to a single-chevron interpretation.

## USER ten-point disposition after candidate

1. gray-role reduction — materially improved; USER visual checkpoint remains;
2. panel-group boundaries / fewer internal frames — materially improved;
3. collapsed Tools overflow — focused evidence supports correction;
4. parameter design — shared grammar established; capability exposure remains partial by design;
5. rectangular scrollbars / circular slider thumbs — shared primitives established and sampled;
6. window controls — normalized source geometry; USER visual checkpoint remains;
7. collapse strip / arrow / panel menu glyph — morphology now aligned to Photoshop reference; state/identity issue remains under SUP-01;
8. Reference panel — normal state improved; expanded/detail state remains open under SUP-02;
9. Edit menu — reorganized using supported INK commands;
10. Layers — substantial structural/interaction improvement; final USER visual checkpoint remains.

## Disposition

```text
SUPERVISOR_RESULT = REVISION_REQUIRED
PRODUCT_SOURCE_MUTATION_BY_SUPERVISOR = NONE
FINAL_UI_COMPLETE = NOT CLAIMED
FULL_CAPABILITY_UI_EXPOSURE = SEPARATE LATER BATCH
```

Next bounded DEV revision should address only:
- SUP-01 panel-state identity / Specialist placement;
- SUP-02 Reference expanded-state cleanup;
- SUP-03 removal of superseded covered CSS declarations.

After that, return fresh rendered evidence for USER review.


## Cleanup follow-up — 2026-10-02

Candidate:
`f7e387c2977b3c69c160356bd368b4f387c602c2`

Independent Supervisor checks:
- product mutation is CSS-only;
- JS/HTML/state/command authority unchanged;
- no new `!important` (104 before / 104 after);
- no new breakpoint family;
- covered exact-selector duplicates within identical context reduced to zero by the delivered audit;
- legacy covered desktop declarations were removed or isolated as explicit compact/state variants rather than replaced by higher-specificity patches;
- left-only `9×8` collapse SVG override is absent from final source;
- shared collapse primitive is `7×5` for both left/right controls;
- current INK still uses one `18×18` swatch primitive for both dual/single Tools; this is now identified as a remaining reference mismatch under SUP-04;
- visible panel tabs remain 28 px;
- sampled rendered states preserve current normalized geometry except for the intended left-chevron correction;
- focused behavior checks for Layers/Edit/Preferences/splitter continue to pass in the DEV evidence.

Disposition:
```text
TECH_DEBT_CLEANUP = ACCEPTED
SUP-03 = RESOLVED
SUP-04 = OPEN (single/dual Photoshop swatch scales are intentionally different)
SUP-05 = RESOLVED
SUP-01 = OPEN
SUP-02 = OPEN
OVERALL_UI = NOT PASS / USER VISUAL REVIEW STILL REQUIRED
```

The cleanup acceptance does not approve Photoshop fidelity and does not authorize Capability → UI Exposure Batch B.


### SUP-06 — OBJECT MENU MNEMONIC MISSING

Current top application menu labels consistently expose keyboard mnemonic letters in parentheses, e.g. 檔案(F), 編輯(E), 影像(I), 圖層(L), 文字(Y), 選取(S), 濾鏡(T), 檢視(V), 視窗(W), 說明(H).

The Object menu is currently rendered as:

```text
物件
```

Source confirms the trigger text lacks a mnemonic.

Required correction:

```text
物件(O)
```

This is a top-menu same-class consistency defect. Keep the existing object menu command routing unchanged; only normalize the visible menu label/mnemonic.


## Completion follow-up — candidate a17cf7d

Candidate:
`a17cf7d46c151744668cf42f55b15212fe758415`

Baseline for this follow-up:
`f7e387c2977b3c69c160356bd368b4f387c602c2`

Independent checks performed:
- inspected final product source and commit diff;
- inspected fresh rendered evidence for active, single Tools, expanded/collapsed dock, Reference normal/details, Layers, Adjustments, Diagnostic and Edit menu states;
- inspected browser summary and source-health evidence;
- rechecked current CSS for reintroduced covered duplicate authority.

### Technical-debt gate

No cleanup regression found in the latest candidate:
- covered exact duplicate definitions remain zero in the delivered source-health audit;
- `!important` decreases from 104 to 103 relative to the cleanup candidate;
- breakpoint families are unchanged;
- no new font declaration family is introduced by the latest pass;
- shared left/right collapse glyph primitive remains 7×5 px;
- panel tabs remain on the shared 28 px grammar;
- the latest source does not reintroduce the removed left-only 9×8 collapse override;
- browser-loaded response bytes match the reviewed source.

Therefore:
```text
TECH_DEBT_CLEANUP = STILL ACCEPTED
SUP-03 = RESOLVED
SUP-05 = RESOLVED
```

### SUP-01 follow-up — RESOLVED

Fresh evidence shows:
- Adjustments has a visible top-group tab and the selected body matches it;
- Specialist/Diagnostic receives an explicit visible `診斷` tab only when that route is active;
- ordinary native/raster tool selection clears the diagnostic state;
- Help and Window diagnostic routes remain reachable.

The prior hidden Specialist/body identity leak is not reproduced.

### SUP-02 follow-up — RESOLVED

Reference detail state is now compact and localized:
- `Radial count` → `放射數量`;
- explanatory execution/debug prose is removed from the ordinary creative panel;
- the required-image error is concise Chinese;
- no explanatory paragraph block remains in the reference pane.

### SUP-06 follow-up — RESOLVED

The top menu now renders:
```text
物件(O)
```
with existing routing unchanged.

### SUP-04 follow-up — OPEN / REFERENCE_MISSING

The latest pass corrected the canonical **dual-column** Photoshop measurement from source raster:
- dual foreground/background swatches = 25×25 px each;
- diagonal origin offset = 16×16 px;
- resulting visible overlap = 9×9 px.

Current INK dual Tools now follows that measured state.

However:
- no original Photoshop **single-column** source capture has been recovered;
- current INK single-column 18×18 / 10 px offset is explicitly provisional implementation evidence, not a verified Photoshop measurement;
- therefore the USER-observed single-column swatch concern cannot be closed by the current dataset.

Required disposition:
```text
DUAL_SWATCH = MEASURED / IMPLEMENTED
SINGLE_SWATCH = REFERENCE_MISSING / USER CHECKPOINT
```

Do not claim that the current single-column shrink is Photoshop-faithful until a valid single-column reference is measured.

### Window controls

The latest pass now anchors the visual controls at the right edge and uses explicit vector geometry. Source-raster reference envelopes were also recorded for minimize / restore / close.

This is an improvement, but final optical fidelity remains a USER visual checkpoint; browser geometry alone does not prove the glyphs visually match Photoshop.

### Capability exposure

The latest normalization candidate does not close the separate full Capability → UI Exposure problem.

The current top Options Bar can still be sparse for contexts whose parameters have not yet been surfaced. This remains the later Batch B task and is not a reason to reopen the accepted technical-debt cleanup.

### Current disposition

```text
NORMALIZATION_SYSTEM = ACCEPTED AS CURRENT BASE
TECH_DEBT_CLEANUP = ACCEPTED
SUP-01 = RESOLVED
SUP-02 = RESOLVED
SUP-03 = RESOLVED
SUP-05 = RESOLVED
SUP-06 = RESOLVED
SUP-04 = OPEN / SINGLE-COLUMN PHOTOSHOP REFERENCE MISSING
WINDOW_CONTROL_OPTICAL_FIDELITY = USER CHECKPOINT
FULL_CAPABILITY_UI_EXPOSURE = NOT CLOSED
FINAL_UI_COMPLETE = NOT CLAIMED
```

Do not start Capability → UI Exposure Batch B until USER completes the current visual checkpoint on the normalized base.


### SUP-07 — RIGHT-PANEL ROW TEXT OPTICAL VERTICAL CENTERING

USER visual checkpoint on the normalized 1280×1024 render identifies inconsistent optical vertical placement of text inside fixed-height right-panel rows.

Affected row classes to inspect as one same-class problem:
- Reference parameter rows;
- `結構分析 / 選用`;
- `研究 → 創作 / 唯讀`;
- Layers `透明度` row;
- Layers `鎖定` row;
- panel tabs and other fixed-height compact rows where the visible glyph envelope appears high/low.

The requirement is not merely that the CSS box contains `align-items:center`.

Required correction criterion:
```text
ROW VISUAL CENTER
≈ TEXT VISIBLE-GLYPH CENTER
≈ ICON / CONTROL CENTER
≈ RIGHT-SIDE STATE TEXT CENTER
```

Implementation rule:
- fixed row height stays authoritative;
- center children with shared flex/grid alignment;
- use the shared line-height token;
- remove local vertical padding/baseline nudges that shift one row independently;
- where `line-height == row height` creates CJK optical drift, switch the row to flex/grid centering rather than adding a local top/bottom patch;
- verify same-class row centers at 1:1 render, approximately within ±1 px.

This is a micro-module grammar issue, not a request for isolated per-label offsets.


### SUP-08 — VISUAL REFINEMENT DISPATCH HAS NO PRODUCT EXECUTION EVIDENCE

Current repository inspection after USER review shows:
- latest product mutation remains `a17cf7d46c151744668cf42f55b15212fe758415`;
- `ACTIVE/INK_UI_NORMALIZED_BASE_VISUAL_REFINEMENT_DEV_DISPATCH_v1.0.md` was published afterward;
- no later product commit, visual-refinement evidence directory, completion marker or row-center measurement evidence is present in the SSOT.

Therefore the current USER screenshot must not be treated as proof that the latest visual-refinement dispatch was executed.

Disposition:
```text
VISUAL_REFINEMENT_DISPATCH = NOT EVIDENCED AS EXECUTED
LAST VERIFIED PRODUCT BASE = a17cf7d...
```

### SUP-09 — WINDOW CONTROL CLUSTER POSITION / GLYPH WEIGHT

USER visual review of the current rendered base identifies two remaining top-right deltas:
- the window-control cluster should sit slightly further left than the current render;
- minimize / restore / close glyphs are optically too heavy.

Current source uses:
```text
--ui-window-icon-size: 12px
--ui-window-icon-stroke: 2
```

The Photoshop source-raster glyph envelopes are materially lighter than the current rendered appearance.

Required correction:
- move the three-control cluster as one shared unit; do not apply per-button positional patches;
- reduce visual stroke/weight through the shared window-icon primitive;
- preserve crisp vector geometry and common optical centering;
- verify minimize / restore / close independently against the reference raster at 1:1;
- do not use Unicode glyphs.

Exact left inset / final stroke must be derived from the rendered comparison, not guessed by independent per-icon offsets.

Next-review enforcement for SUP-09:
- require Photoshop cluster outer-bound/right-edge measurement;
- require INK cluster outer-bound/right-edge measurement from the same 1:1 viewport class;
- compare the cluster as one unit before judging individual glyphs;
- reject a result that only reports `margin-left/right`, `translateX`, or “moved left” without Photoshop reference evidence;
- then inspect minimize / restore / close visible envelopes and stroke weight separately.

### SUP-10 — LASSO SELECTION DISABLES THE TWO FOLLOWING TOOL ACTIONS

USER reports that after selecting Lasso, the two buttons directly below it become non-clickable.

Source inspection confirms this is explicit state logic, not only a visual hitbox issue:

```js
crop.disabled = !selectedFound(app, object => object.type === 'image' && object.rasterState?.colorRaster)
frame.disabled = !app.selection?.length
```

The two controls are therefore disabled when Lasso changes/clears the prerequisite selection state.

Required UX correction:
- selecting one tool must not accidentally make neighboring tool/actions appear broken;
- determine whether Crop / Frame are true tools or prerequisite-bound commands;
- if they are commands requiring a target, keep their route discoverable and communicate the missing prerequisite on activation rather than silently becoming unusable as a side effect of selecting Lasso, unless the product authority explicitly requires disabled state;
- do not duplicate selection state or invent new capability semantics.

This needs an interaction test:
```text
select ordinary tool
→ select Lasso
→ click Crop
→ click Frame
→ verify each route either activates legitimately or gives a concise prerequisite response
→ neither control becomes an unexplained dead button
```

### SUP-11 — OPTIONS BAR IS STRUCTURALLY INCOMPLETE

USER again identifies the Options Bar as visibly incomplete.

Source inspection confirms the current contextual exposure is only partial:
- `refreshContextOptions()` renders only the fields listed by `UI_B_RASTER_OPTION_FIELDS`;
- the base `lasso` tool has no field entry;
- polygonal/magnetic lasso expose only the currently enumerated raster-adapter parameters;
- many native/editor tools are not reconciled through the same Tool → Options Bar exposure matrix.

Therefore the current blank/sparse Options Bar is not a spacing bug. It is a capability-exposure gap.

Disposition:
```text
OPTIONS_BAR_VISUAL_GRAMMAR = EXISTS
OPTIONS_BAR_CAPABILITY_EXPOSURE = INCOMPLETE
FULL_TOOL_TO_OPTIONS_RECONCILIATION = REQUIRED
```

This should be implemented as a separate bounded Tool → Options Bar exposure batch using existing INK capability/state authorities, not as ad-hoc controls added to the current visual-refinement CSS pass.


### SUP-12 — PANEL SCROLLBARS STILL RENDER ROUNDED

USER visual review confirms that scrollbars inside the right panel stack still render with rounded/pill thumbs, despite the intended shared scrollbar grammar.

Current stylesheet already contains a global WebKit rule with `border-radius:0`, so this is not accepted as solved by source declaration alone. The rendered result is authoritative.

Required investigation:
- identify which actual panel scroll containers are using native/overlay scrollbar rendering or bypassing the shared `.app *::-webkit-scrollbar*` authority;
- include Reference, Layers, History, Libraries and any generic `.shell-panel-body` / `.inspector-section` scroll surface;
- ensure panel scrollbars render square/rectilinear thumbs and tracks at 1:1;
- do not create per-panel scrollbar skins;
- keep one shared scrollbar primitive.

Acceptance:
```text
ALL_RIGHT_PANEL_SCROLLBARS = RECTILINEAR
THUMB_RADIUS = 0
TRACK_RADIUS = 0
NO_PANEL_SPECIFIC_SCROLLBAR_OVERRIDE = TRUE
```

Rendered screenshot evidence is required; CSS declaration alone is insufficient.


## SUP-08～SUP-11 publication review — candidate a9d122c

Candidate:
`a9d122ccba14734caf6220a53044545494a8429b`

Publication base:
`d8170428710ae06daa00795a932e2a867609200b`

Independent Supervisor review:
- inspected exact one-commit diff from publication base;
- inspected DEV return, Tool → Options matrix, source-health, browser, raster and spatial-probe evidence;
- inspected fresh 1:1 active / Reference / Layers / window-control / representative Options Bar renders;
- did not treat the DEV PASS assertions as sufficient by themselves.

### Scope / technical-debt guard

The product mutation is bounded to 10 product files:
- generated shell / HTML delivery artifacts and build identity;
- `styles.css`;
- `ui/capability-contributions.js`;
- `ui/full-capability-controls.js`;
- `web-shell.js`.

No Core / renderer / History / FORMAT_VERSION mutation is present.

Guard remains intact:
```text
!important = 103 → 103
breakpoint families = unchanged
covered exact-context visual duplicates = 0 → 0
loaded product bytes = candidate source
page/resource errors = none
```

### SUP-08 — ACCEPTED

Right-panel fixed-row treatment is now shared rather than label-specific:
- common row line-height / optical text-edge grammar;
- Reference and Layers visible rows use shared centering;
- no per-label translate/top/bottom nudge is introduced.

Fresh raster evidence samples 41 Reference/Layers text envelopes with maximum absolute row-center delta ≈1.02 px in the declared QA environment.

Current screenshots visually support the intended correction. USER remains final visual authority.

### SUP-09 — IMPLEMENTATION ACCEPTED / USER VISUAL CHECKPOINT

The window-control cluster is corrected as one shared unit:
- 3 px end inset;
- shared 27.5 px non-close control width;
- 46 px close width;
- 103×19 px outer cluster aligned to the measured Photoshop reference;
- common 12×12 SVG envelope and 1-unit stroke;
- no per-button translation patch / Unicode substitution.

The after/reference crops show a materially closer cluster position and lighter glyph weight.

This closes the source/geometry defect. Final optical preference remains a USER checkpoint.

### SUP-10 — ACCEPTED

Crop / Frame no longer become unexplained dead controls after Lasso:
- both remain discoverable;
- no-target Crop reports the existing raster prerequisite;
- no-target Frame reports a concise selection prerequisite;
- valid Crop and Frame routes still use existing product authorities and History;
- no duplicate selection state was added.

### SUP-11 — ACCEPTED FOR CURRENT INSTALLED TOOL SET

A concrete Tool → Options matrix now exists for the installed tools/subtools.

Independent source inspection confirms the implementation:
- reuses existing native controls/handlers where possible;
- reuses raster adapter option state;
- exposes existing Shape/Text/Pan/selection/replay actions without inventing scalar parameters;
- preserves persistent object/document parameters in their existing panels instead of duplicating them into Options;
- does not claim that all 496 atomics belong in Options Bar.

Focused evidence reports 40 tool/subtool variants and all listed option/interaction assertions passing, including state consumption, focus persistence, tool-switch persistence and compact horizontal containment.

This closes the **current installed Tool → Options reconciliation** represented by this matrix. It does not pre-authorize future capabilities or later USER-requested global Options-Bar controls.

### Separate open defect — Core spatial index

The candidate correctly reproduces, rather than hides, an existing Core defect:
- newly drawn Shape can exist while spatial index remains stale;
- native Lasso may miss it until `refreshAll`.

This is outside the UI candidate and remains OPEN for a separate Core-bounded decision.

### SUP-12 — OPEN

Right-panel scrollbar rectilinear rendering was explicitly outside this candidate and remains unresolved.

### Later USER decisions not included in a9d122c

The following requirements were discussed after the local SUP-08～11 implementation and are **not** considered part of this candidate acceptance:
- New Document architecture: A4 must not be assumed to be the permanent document model; blank/no-document startup and arbitrary document dimensions/presets/background initialization remain to be specified before implementation.
- Restore the existing document/workspace-space switch in the fixed **right zone of the Options Bar**, reusing existing workspace authority rather than creating a second state model.
- Top application-menu labels, including `物件(O)`, must use one equal-spacing/padding grammar rather than a one-off correction.

### Disposition

```text
CANDIDATE_a9d122c = ACCEPTED_AS_REVIEWED_BOUNDED_UI_BASE
SUP-08 = ACCEPTED
SUP-09 = SOURCE_GEOMETRY_ACCEPTED / USER_VISUAL_CHECKPOINT
SUP-10 = ACCEPTED
SUP-11 = ACCEPTED_FOR_CURRENT_INSTALLED_TOOL_SET

CORE_SPATIAL_INDEX = OPEN / OUTSIDE_UI_SCOPE
SUP-12_PANEL_SCROLLBAR = OPEN
A4_NEW_DOCUMENT_MODEL = OPEN_DESIGN_DECISION
OPTIONS_BAR_RIGHT_WORKSPACE_SWITCH = OPEN_USER_REQUIREMENT
TOP_MENU_EQUAL_SPACING = OPEN_USER_REQUIREMENT

FINAL_UI_COMPLETE = NOT CLAIMED
```
