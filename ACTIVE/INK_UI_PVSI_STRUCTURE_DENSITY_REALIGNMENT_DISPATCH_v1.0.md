# INK UI — PvsI Structure / Size / Density Realignment Dispatch v1.0

STATUS: SUPERSEDED / DO_NOT_EXECUTE / HISTORICAL
DATE: 2026-09-30
TASK: INK-UI-PVSI-STRUCTURE-DENSITY-REALIGNMENT-001
OWNER: INK DIRECT UI MR

## Supersession — 2026-10-01

USER deleted `PvsI-1 / PvsI-2 / PvsI-3` because the INK interface had changed. This dispatch is retained only as history and must not be used as current visual authority or mutation authorization. Use the original Photoshop references together with a fresh current-INK capture for future comparison.

## 1. Historical mission

Re-align the current INK desktop UI against Photoshop using the USER-supplied three PvsI comparison images as the immediate visual execution authority.

This pass is not a general cleanup and not a source-led verification exercise.

Primary task:

```text
PvsI-1.png
PvsI-2.png
PvsI-3.png
→ compare current INK directly against Photoshop
→ make structure / dimensions / density / grouping / control grammar match
→ preserve the USER-locked INK light palette
→ preserve existing INK Core/capabilities
```

## 2. Durable GitHub image authority

The comparison images are now stored in GitHub and are the canonical visual artifacts:

- `reference/ui/photoshop/PvsI-1.png`
- `reference/ui/photoshop/PvsI-2.png`
- `reference/ui/photoshop/PvsI-3.png`

Original Photoshop references are also stored:

- `reference/ui/photoshop/ps-1.png`
- `reference/ui/photoshop/PS-2.png`
- `reference/ui/photoshop/PS-3.png`

The executor MUST inspect these exact images before editing.

A new CHAT no longer depends on USER re-upload as the authority source. If the current tool cannot render repository binary images directly, retrieve/materialize the exact GitHub asset or use an attached mirror of the same file; do not substitute a text description, reconstructed image or unrelated screenshot.

The GitHub path/blob identity remains authoritative.

## 3. Read order

1. `ACTIVE/INK_UI_PS_ALIGNMENT_MASTER_GUIDE_v1.0.md`
2. this dispatch
3. inspect PvsI-1 / PvsI-2 / PvsI-3 visually
4. inspect the current deployed/current-main INK page
5. only then inspect HTML / effective CSS / JS to trace causes

Do not begin from old PASS claims or old checklist totals.

## 4. Inspection discipline

Before changing code, perform a blind delta sweep.

Phase A — VISUAL DELTA ONLY:
- no PASS language;
- no 'already close';
- no explanation;
- no source justification;
- enumerate visible differences from top-left to bottom-right.

Phase B — SAME-CLASS CONSISTENCY:
- all application menus;
- all dropdowns/popups;
- all tool buttons;
- all icon families;
- all panel tabs;
- all scrollbars;
- all inputs/selects;
- all panel footers;
- all dialog headers/close controls.

Phase C — SOURCE CAUSE TRACE:
- final HTML/post-runtime DOM;
- effective/computed CSS;
- UI-facing JS state/wiring;
- capability authority when placement depends on whether INK actually has the function.

Phase D — DISPOSITION:
```text
FIX_NOW
THEME_OR_COLOR_OVERRIDE
CAPABILITY_ABSENT
USER_OVERRIDE
```

No fifth category.

## 5. Required visual re-alignment scope

### 5.1 Application menu / top shell
- same structural height/density as Photoshop reference;
- same class of application menu uses one visual language;
- no single dark menu among otherwise light menus;
- current Window menu must use the same light menu grammar as File/Edit/etc.;
- evaluate Photoshop mnemonic presentation `(F) (E) ...` and classify explicitly;
- keep INK-only menu taxonomy only where product capability requires it; do not silently treat extra menu groups as reference-equivalent;
- Options Bar remains contextual, compact and aligned.

### 5.2 Left Tools
- reproduce Photoshop-like tool density and vertical occupation, not only outer width;
- compare number of visible tool-group representatives and group rhythm;
- reconcile existing INK capabilities such as crop/selection/zoom/view tools into Photoshop-like primary homes/flyouts when capability exists;
- no empty lower rail caused merely by under-populated tool placement;
- icon visible envelopes, stroke weight, alignment and flyout-corner grammar must be consistent;
- replace text glyph substitutes where they break the shared icon grammar.

### 5.3 Global foreground/background color controls
- remain at lower Tools area;
- foreground/background overlap geometry follows mature workstation grammar;
- swap/reset controls align with the same icon system;
- do not use arbitrary text glyphs if they produce inconsistent baseline/stroke weight.

### 5.4 Right panel system
- compare actual panel stack proportions against PvsI images and Photoshop;
- compare header/tab heights, body padding, footer heights and splitter positions;
- expanded state must visually read as three coherent stacked panel groups;
- collapsed state must use the same region-collapse language as left Tools;
- no redundant opener/icon rail while expanded.

### 5.5 Navigator
- compare preview/body/footer proportions;
- compare zoom footer structure, order, icon language and spacing against Photoshop;
- current `符合 / − / slider / 100% / +` arrangement must be explicitly reconciled against Photoshop rather than assumed equivalent;
- scrollbar dimensions/track/thumb/arrows must be reviewed.

### 5.6 Reference / creative panels
- reduce generic-Web-form appearance;
- controls must follow workstation row heights, density, spacing and button grammar;
- do not allow one panel to use thicker/general-form controls than neighboring professional panels without reason.

### 5.7 Layers
- compare information architecture, not only colors;
- reconcile filter/type row, blend mode, opacity, lock/fill controls, layer rows and bottom actions against Photoshop grammar where matching INK capabilities exist;
- opacity must not be moved to a visually unrelated lower zone merely for implementation convenience;
- panel actions should use coherent icon/action homes rather than ad-hoc text-button rows;
- layer row geometry, visibility/thumbnail/name/state/lock positions and selected state must be rechecked;
- bottom panel actions must be capability-reconciled rather than arbitrarily reduced.

### 5.8 Scrollbars
- all panel scrollbars are part of the UI design system;
- do not leave obvious browser-native scrollbar grammar if Photoshop/reference uses a different compact workstation scrollbar;
- check track, thumb, width, arrow controls and contrast across Navigator/Reference/Layers/other panels.

### 5.9 Typography / density
- match workstation density through geometry and rhythm, not by tiny text;
- same-role controls use the same font token, row height and baseline;
- compare Chinese/Latin/numeric alignment;
- compare panel tabs, row labels, inputs, buttons and metadata separately.

## 6. Core preservation

Do not remove underlying INK capabilities to simplify visual alignment.

Preserve:
```text
64 capability families
496 product atomics
5 headless/platform atomics
501 normalized atomics
22 CHAT named tools
34 CHAT bounded edit operations
FORMAT_VERSION = 4
```

UI may move/regroup existing capability homes but may not silently delete capability authority.

## 7. Implementation method

- edit current `main` directly under current USER-direct UI mode;
- use bounded reversible commit(s);
- no UR/DEV split;
- no MR pre-approval;
- no central Runtime as an iteration gate;
- preserve Web and Portable entrypoint wiring;
- do not leave unresolved generated-template tokens;
- avoid unrelated cleanup.

## 8. Required return

Return only:
- commit SHA;
- changed files;
- visible structures/controls changed;
- any reference differences that remain and their explicit disposition;
- exact regions USER should refresh/inspect.

Do not declare UI complete.

## 9. Acceptance

```text
PvsI / Photoshop visible comparison
+ current deployed/main actual page
+ USER inspection
= visual acceptance
```

Source counts, Runtime PASS and old checklist PASS are not substitutes.