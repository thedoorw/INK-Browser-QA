# INK UI — USER Acceptance Rejection R31 v1.0

STATUS: `USER_REJECTED / UI_FIDELITY_REOPENED / FINAL_RUNTIME_PASS_RETAINED_AS_TECHNICAL_EVIDENCE_ONLY / UI_COMPLETE_HOLD`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`

## USER evidence

The USER inspected the deployed INK main UI after R30 final Runtime PASS and explicitly rejected it as the final Photoshop-aligned result.

USER finding:

- the delivered UI is not visually recognizable as aligned to the supplied Photoshop references;
- the result appears unrelated to the supplied screenshots;
- final visual acceptance is denied.

This is authoritative USER acceptance evidence. No AI/UR/MR review may override it.

## MR root-cause finding

The current reference stack contains a specification error.

`working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md` correctly identifies:

- `ps-1.png` and `ps-2.png` as the fixed Photoshop reference pack;
- dark Photoshop shell roles such as approximately `#535353` chrome and `#262626` central workspace;
- exact shell geometry and dock/panel reference states.

However the same document later states that those dark colors are geometry-reading aids only and that INK should target a USER-requested light-gray Photoshop version.

The implementation then promoted a separate authority:

`working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`

and current `product/source/styles.css` explicitly establishes:

```text
color-scheme: light
--ink-ui-bg-base: #E9E9E9
--ink-ui-surface: #FFFFFF
--ink-ui-text: #222222
```

The final delivered page therefore follows a light semantic reconstruction rather than the visual system of the supplied Photoshop captures.

This abstraction was too aggressive. Passing geometry/interaction/runtime gates did not prove visual fidelity to the USER reference.

## Governance correction

Effective immediately:

```text
USER_ACCEPTANCE = REJECTED
UI_COMPLETE = HOLD
AF10 = FAIL / USER_REJECTED
AF11 = FAIL
UR_PREVIOUS_VISUAL_PASS = SUPERSEDED_BY_USER_REJECTION
R30_RUNTIME_PASS = TECHNICAL_EVIDENCE_ONLY / NOT_UI_ACCEPTANCE
PRODUCT_MUTATION_AUTHORIZED = NO UNTIL_NEW_BOUNDED_UI_WORKPACK
NEXT_OWNER = MR
```

## New visual authority rule

For the next correction pass:

1. `ps-1.png` and `ps-2.png` are the primary visual authority, not geometry-only aids.
2. Match shell hierarchy, density, contrast, edge attachment, toolbar grammar, dock/panel grammar and default workstation impression.
3. Do not substitute a generic Adobe/Photoshop Light web palette for the supplied captures unless the USER explicitly asks for a light variant.
4. The deployed page itself must be compared visually against the reference pack before USER acceptance is requested again.
5. Runtime PASS cannot close visual fidelity.

## Required next work

MR must issue a new bounded Photoshop visual-fidelity correction workpack before product mutation.

The workpack must explicitly cover:

- dark Photoshop workstation palette from the supplied screenshots;
- top shell visual density;
- tool rail density and selected-tool treatment;
- right dock / expanded panel visual grammar;
- central workspace contrast and hierarchy;
- panel/header/tab typography and density;
- removal of generic light/white visual treatment that breaks reference identity;
- exact side-by-side screenshot evidence at the same normalized viewport.

No final closure may be declared until the USER sees and accepts the corrected deployed UI.
