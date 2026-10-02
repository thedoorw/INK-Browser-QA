# INK New Document Architecture — Decision Workpack v0.1

STATUS: DESIGN / R&D ONLY — NO PRODUCT MUTATION
DATE: 2026-10-02
OWNER: UI / DOCUMENT ARCHITECTURE R&D
BASELINE: a9d122ccba14734caf6220a53044545494a8429b

## Question

INK currently starts with `documentOpen=false`, but pressing New immediately executes `newDocument()` → `defaultDocument()`, which produces the current default page/artboard behavior.

USER has reopened the product decision:

- should A4 remain the default New Document result;
- or should startup remain a true blank / no-active-document state and New first ask what document to create, as in mature creative software;
- how should arbitrary dimensions/aspect ratios work for future CHAT control;
- how should current foreground/background colors participate in initial document/paper creation.

No implementation is authorized in this workpack.

## Current facts to preserve

- C01 owns New/Open/Save document lifecycle.
- C05 currently includes an A4 artboard preset.
- C04 owns the two workspace spaces; document creation must not create a second workspace model.
- current Tools already expose foreground and background colors.
- current page/paper has a paper color authority.
- CHAT will eventually need to request arbitrary document dimensions without going through an A4-specific assumption.

## Architectures to compare

At minimum compare these models:

### Model A — A4 direct default
`New` immediately creates A4.

### Model B — no active document + New Document chooser
Startup remains empty.
`New` opens a creation surface where the user or CHAT specifies dimensions/preset/background.
A4 is one preset, not the document identity.

### Model C — last-used / remembered preset
Startup remains empty; New chooser defaults to last-used creation settings while retaining A4 as a named preset.

For each model assess:
- Human workflow friction;
- CHAT determinism;
- arbitrary W×H support;
- portrait/landscape and unit handling;
- relationship to page/artboard/paper;
- persistence / migration implications;
- whether a new document schema field is actually required.

## Required creation-request model

Define a proposed canonical request without implementing it. It should be able to represent:

```text
width
height
unit
orientation (derived or explicit)
presetId?      // e.g. A4
ppi?
bleed?
safeMargin?
initialBackgroundMode
initialBackgroundColor?
```

Determine whether dimensions belong to Document, Page Artboard, or a creation request that initializes the first Page. Do not duplicate the existing artboard authority.

## Foreground / background color question

Explicitly decide semantics for:
- current Foreground Color;
- current Background Color;
- page Paper Color;
- transparent initial background;
- optional editable background layer.

Important separation to evaluate:

```text
WORKING FOREGROUND/BACKGROUND COLORS
≠ permanently bound document colors
```

If current Background Color is used to initialize a new document/paper, later changing the working Background Color should not silently recolor an existing document unless USER explicitly chooses such a linked mode.

Evaluate whether the New Document chooser should offer:
- Background Color;
- Foreground Color;
- White;
- Transparent;
- Custom color.

Do not assume the final list until USER review.

## CHAT requirements

The architecture must allow deterministic requests such as:
- A4 portrait;
- 1080×1350 px;
- square 2048×2048;
- arbitrary custom ratio;
- transparent or chosen initial background.

CHAT and Human UI must call the same creation authority.

## Required output

Produce one decision document with:
- current-source diagnosis;
- Model A/B/C comparison;
- proposed canonical creation request;
- schema-impact analysis;
- foreground/background/paper semantics;
- USER decisions still required;
- migration risk;
- recommended implementation boundary.

STOP before product code.
