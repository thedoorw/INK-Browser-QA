# INK UI Micro-Module Normalization — Supervisor Review 2026-10-02

STATUS: REVISION_REQUIRED / NO PRODUCT MUTATION BY SUPERVISOR
ROLE: INK UI Standards Supervisor MR
CANDIDATE: c90df990cddedc7d7d7692b88200985a8b50d5aa
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
