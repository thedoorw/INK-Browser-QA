# Reference-Driven UI Design & Inspection Standard v1.0

STATUS: ACTIVE / DURABLE / REUSABLE FOR FUTURE PROGRAMS
DATE: 2026-09-30

## 1. Purpose

This is the reusable UI design and inspection standard distilled from the INK Photoshop-alignment program.

It applies when a new program uses an existing mature product, screenshot set, design system, prototype, or other concrete interface as its reference authority.

The standard separates four questions that must never be collapsed:

```text
WHAT capabilities exist?
WHERE should they live?
HOW should they look/behave?
WHAT does the USER actually receive?
```

## 2. Authority hierarchy

For reference-led UI work use this hierarchy:

```text
L0 USER intent / explicit override
L1 primary reference artifacts
L2 measured / derived design requirements
L3 implementation plan
L4 source and automated checks
L5 rendered / interaction evidence
```

A lower layer may refine an upper layer but may not silently override it.

If a derived rule conflicts with the primary reference or current USER instruction, the primary reference/USER instruction wins.

## 3. Separate capability authority from UI authority

Capability inventory answers WHAT exists.

Reference/design authority answers WHERE and HOW it appears.

```text
CAPABILITY_PRESENT != UI_HOME_VALID
UI_HOME_VALID != UI_ASSEMBLED
UI_ASSEMBLED != VISUALLY_CONFORMANT
VISUALLY_CONFORMANT != INTERACTION_VALID
```

Do not invent product capability solely to imitate a reference. Conversely, do not remove a reference UI grammar merely because it is not listed as a Core capability.

## 4. Reference-difference rule

When the USER designates a concrete reference as authority:

```text
REFERENCE_DIFFERENCE = DEFECT
unless:
1. USER explicitly overrides it;
2. the reference depends on a capability not present in the target product;
3. the approved target palette/theme intentionally differs.
```

No AI-created fifth category such as 'close enough', 'reasonable adaptation', or 'technically reachable' is allowed.

## 5. Reference decomposition before implementation

Before coding, decompose the reference into these layers:

### 5.1 Macro topology
- top shell / menubar
- contextual/options bar
- left tools/navigation
- central workspace/canvas
- right dock/panels
- bottom/status region
- dialogs/preferences

### 5.2 Geometry
- widths/heights
- rows/columns
- splitters/dividers
- panel stack proportions
- padding/gaps
- icon hit boxes
- control heights

### 5.3 Information hierarchy
- primary controls
- contextual controls
- panel-local controls
- one-shot commands
- diagnostic controls
- secondary/help text

### 5.4 Interaction grammar
- expand/collapse
- dock/undock if supported
- tab switching
- drag/reorder
- resize
- hover/focus/active/disabled
- menus/dialogs

### 5.5 Visual roles
- application chrome
- workspace surface
- panel surface
- input/control surface
- border/divider
- primary text
- secondary text
- disabled text
- accent/focus

## 6. Design-system rules

Do not style each control independently. Define shared role tokens for:

```text
CONTROL_HEIGHT
SMALL_BUTTON_HEIGHT
INPUT_HEIGHT
SELECT_HEIGHT
ICON_BOX
ICON_VISIBLE_ENVELOPE
ROW_PITCH
LABEL_BASELINE
CONTROL_GAP
GROUP_GAP
SECTION_GAP
PANEL_PADDING
MENU_PADDING
PRIMARY_TEXT
SECONDARY_TEXT
DISABLED_TEXT
SURFACE_BASE
SURFACE_RAISED
BORDER
ACCENT
FOCUS
```

Equivalent roles must share the same geometry and visual hierarchy.

Core principle:

```text
DENSE != TINY
LIGHT != FAINT
```

Density comes from controlled spacing and hierarchy, not unreadably small text.

## 7. Primary-home rule

Every visible capability/control receives one primary disposition:

```text
KEEP_PRIMARY
MOVE_TO_REFERENCE_HOME
GROUP_IN_FLYOUT
MOVE_TO_PANEL_BODY_OR_FOOTER
MOVE_TO_MENU
CONTEXTUAL_ONLY
WINDOW_OR_NAVIGATION_ONLY
DIAGNOSTIC_ONLY
REMOVE_DUPLICATE_UI
```

Underlying capability is preserved unless the program separately authorizes removal.

Repeated controls are defects unless the reference or workflow intentionally duplicates them.

## 8. Do not create fake affordances

A reference-looking control must carry the behavior implied by that control.

Examples:
- a document tab should switch/close/reorder documents only if such authority exists;
- a resize handle should actually resize;
- a panel tab should actually switch the panel body;
- a collapse arrow should actually change the region state.

If the behavior is absent, either omit the affordance or obtain USER approval for a limited approximation.

## 9. Contextual vs global controls

Global state belongs in stable global homes.

Contextual state belongs in contextual/options areas.

Do not permanently occupy contextual bars with global controls simply because the implementation makes it convenient.

One state must have one authority even when multiple views/controls expose it.

## 10. Tooltip and hint discipline

Automatic floating hints are not a substitute for coherent UI.

Default rule:
- avoid persistent or automatic tooltip clutter;
- keep essential error/confirmation feedback;
- keep interaction-critical transient readouts such as coordinates/snapping when needed;
- use stable labels, icons, placement and hierarchy for discoverability.

## 11. Mandatory outside-in inspection

Inspect the real product in this order:

```text
1. LOOK
2. FINAL HTML / POST-RUNTIME DOM
3. EFFECTIVE / COMPUTED CSS
4. INTERACTION
5. FUNCTION
6. RENDER
7. CORE / DATA
8. CAPABILITY
9. END-TO-END WORKFLOW
10. USER
```

Never start a full-product review by counting internal parts.

## 12. Evidence-type matching

Every requirement must be closed only by evidence of the same type.

| Requirement | Valid evidence | Invalid substitute |
| --- | --- | --- |
| visible region exists | final DOM + rendered page | registry entry |
| layout matches | screenshot/computed geometry | source token only |
| visual reference matches | side-by-side rendered evidence | Runtime PASS |
| button works | black-box click/result | handler source exists |
| drag works | actual drag/result | event listener exists |
| capability exists | authoritative Core/census evidence | visible icon only |
| USER goal met | USER acceptance | AI reviewer consensus |

Rule:

```text
EVIDENCE_MISMATCH = FAIL
```

## 13. Dynamic UI rule

When UI is created by JavaScript/runtime injection, a source contribution list is not UI evidence.

Required verification:

```text
post-runtime DOM
+ effective/computed CSS
+ rendered state
```

Otherwise the maximum claim is SOURCE_IMPLEMENTED.

## 14. Artifact identity chain

Every product-verification package should identify:

```text
source commit SHA
→ generated/build artifact identity
→ deployed asset/version
→ browser-loaded version
→ screenshot/interaction evidence
```

Do not claim that USER and reviewer inspected the same product without an identity chain.

## 15. Reviewer independence

Where practical, separate reviewer inputs:

- Builder sees requirement + source.
- Source reviewer sees implementation + contract.
- Visual reviewer sees reference + rendered artifact, not prior PASS claims.
- Interaction reviewer operates the product black-box.
- Capability reviewer inspects Core/census.
- USER judges goal/direction.

This reduces correlated confirmation error.

## 16. USER checkpoints

Direction-sensitive UI programs require early representative checkpoints:

```text
macro shell
→ USER
major navigation/panel grammar
→ USER
one representative workflow
→ USER
scale remaining implementation
```

Do not defer first meaningful visual inspection until the end of a large capability checklist.

## 17. PASS vocabulary

Use explicit layer states rather than one generic PASS:

- ARTIFACT_PASS
- ASSEMBLY_PASS
- VISUAL_PASS
- INTERACTION_PASS
- FUNCTION_PASS
- RENDER_PASS
- CORE_PASS
- CAPABILITY_PASS
- WORKFLOW_PASS
- USER_PASS

No lower-layer PASS closes a higher unresolved layer.

## 18. N/A / adaptation authority

AI may not waive a reference item on convenience grounds.

N/A requires one of:
- capability is authoritatively absent and implementing it would expand product scope;
- reference item is provably irrelevant to the target state;
- USER explicitly approves the exception.

Record the reason and authority.

## 19. Reference delta register

For each visible difference keep a simple disposition:

```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

Every unresolved difference remains open.

## 20. New-program start template

For a future reference-led program, establish before implementation:

1. USER goal;
2. primary reference artifacts;
3. product capability baseline;
4. explicit allowed deviations;
5. macro UI map;
6. interaction map;
7. shared design tokens;
8. artifact identity mechanism;
9. evidence plan by layer;
10. USER checkpoint schedule.

Then build one representative vertical slice before scaling.

## 21. Completion criterion

A reference-led UI is complete only when the required product layers are independently verified and the USER accepts the intended result.

```text
PARTS PRESENT
+ PRODUCT ASSEMBLED
+ REFERENCE CONFORMANT
+ INTERACTIONS REAL
+ WORKFLOW WORKS
+ USER ACCEPTS
= COMPLETION
```

## 22. Strict inspection sequence

Reference-driven review uses the following fixed order.

### 22.1 Lock comparison conditions

Before judging geometry, record the reference artifact, product artifact identity, viewport, browser zoom / OS scaling where relevant, and UI state.

Normalize scale before comparing pixels.

### 22.2 Blind visual delta sweep

Inspect the rendered product against the reference before reading prior PASS claims.

Rules:

```text
NO PASS LANGUAGE
NO SOURCE EXPLANATION
NO OLD CHECKLIST CONCLUSION
NO "CLOSE ENOUGH"
```

Only enumerate visible differences.

### 22.3 Same-class consistency sweep

Compare every member of the same visual class:

- application menus;
- dropdowns/popups;
- tool buttons;
- icons;
- tabs;
- inputs/selects;
- sliders;
- scrollbars;
- panel headers/footers;
- dialog titlebars/close controls.

A single outlier is a defect even if it is functionally correct.

### 22.4 Numeric geometry / density sweep

Measure major regions and controls:

```text
X / Y
WIDTH / HEIGHT
ROW COUNT
ROW PITCH
CONTROL HEIGHT
PADDING / GAP
ICON BOX / VISIBLE ENVELOPE
FONT SIZE / LINE HEIGHT
SPLITTER SIZE
SCROLLBAR WIDTH
```

Outer dimensions alone are insufficient. Internal density and occupancy must also match the intended reference grammar.

### 22.5 State coverage matrix

Enumerate all UI states required by the reference/task and verify each rendered state separately.

Examples:

- expanded / collapsed;
- single / double toolbar;
- menu open;
- panel menu open;
- dialog open;
- rulers on/off;
- drag/reorder;
- resize;
- hover/focus/disabled where material.

An unobserved runtime state is not visually verified.

### 22.6 Source cause trace

Only after visible deltas are recorded inspect:

```text
FINAL HTML / POST-RUNTIME DOM
→ EFFECTIVE / COMPUTED CSS
→ UI JS
→ CAPABILITY AUTHORITY
```

Source explains why the defect exists; it does not replace the rendered comparison.

### 22.7 Capability/home reconciliation

For each reference control absent from the target UI:

1. determine whether the target product already has the capability;
2. if yes, inspect whether it is misplaced, hidden or duplicated;
3. only if truly absent may it be classified as CAPABILITY_ABSENT.

### 22.8 Interaction verification

Operate the real product for affordances that imply behavior.

Handlers/listeners in source are not interaction proof.

### 22.9 Disposition

Every remaining delta must be one of:

```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

No fifth category.

### 22.10 USER checkpoint

AI review does not replace product acceptance.

## 23. Reviewer-bias guardrails

Recognized failure modes:

```text
KNOWN_ISSUE_BIAS
LOCAL_PASS_BIAS
PRIOR_NARRATIVE_BIAS
SAME_CLASS_BLINDNESS
SOURCE_FIRST_BIAS
PROXY_EVIDENCE_BIAS
```

Required countermeasures:

- search for unknown deltas before verifying known issues;
- compare same-class components as sets;
- keep prior PASS statements out of the first visual sweep;
- do not infer whole-product correctness from a few matching measurements;
- do not let source availability bias visible-product judgment;
- do not let proxy evidence close a different requirement.

## 24. Standard reviewer output

A standards/review role should separate:

```text
OBSERVED DELTA
MEASURED DELTA
SOURCE CAUSE
CAPABILITY STATUS
DISPOSITION
USER DECISION NEEDED
```

Do not mix these stages into one vague PASS/FAIL narrative.

## 25. Exact-fidelity measurement and evidence discipline

When USER requires exact similarity, shared geometry targets zero delta in the matched reference environment/state. An approximate token, estimated dimension or numeric tolerance must not silently weaken that instruction. Record measurement precision and raster/platform uncertainty separately; unknown values stay unverified.

Separate coordinate systems:
- application/OS chrome;
- document content under document zoom;
- embedded screenshots inside that document;
- target browser CSS pixels and screenshot raster pixels.

Document zoom is not UI scaling. Normalize using multiple independent chrome anchors and original capture metadata. Do not assume one composite-wide scale from a zoom label. If a scale is unresolved, retain the evidence gap rather than manufacture an exact measurement.

For every item preserve:
requirement ID, reference artifact/hash/crop, coordinate system, viewport/DPR/zoom/OS scale, UI state, source/artifact/deployment/browser identity, before/after rendered evidence, reference/current values and deltas, measurement uncertainty, interaction result and explicit exception authority.

Keep verification status separate from delta disposition. Unobserved state and missing reference are evidence gaps, not fifth exception categories. PLATFORM_RENDERING, REFERENCE_SCALE_LIMIT and VALID_USER_STATE cannot waive an observed delta.

Distinguish SOURCE_COMPUTED, DOM_MEASURED, RENDERED_MEASURED and INTERACTION_OBSERVED. A theoretical layout residual is not a screenshot residual; matching a container does not verify its contents, and a normal/empty state does not verify other states.

Same-class inspection requires an enumerated member list and a per-member state/evidence matrix. Verify stable rendered state after interactions; accessibility transitions and screenshots may initially describe different animation frames. Keep first-paint evidence separate from stable-state evidence.

A reviewer who has already read previous conclusions may perform a delta-first sweep, but must not claim fully blind independent review. Record input exposure and preserve unreviewed-reference/render-only discovery where practical.

HTTP asset identity plus DOM resource URLs does not prove browser-executed bytes or all transitive modules. State partial identity chains accurately rather than closing them from a source SHA alone.
