# INK UI HTML/CSS Assembly Verification Rule v0.1

STATUS: `ACTIVE / DURABLE UI VERIFICATION RULE`

DATE: 2026-09-29

## Purpose

Visible UI must be verified as an assembled product, not inferred from capability ledgers, JavaScript registries, Runtime results, workpack claims, or checklist counts.

## Core rule

```text
VISIBLE_UI_PASS
requires
FINAL_HTML_OR_POST_RUNTIME_DOM
+
EFFECTIVE_CSS
```

For every visible UI requirement, the reviewer must verify where it actually exists in the assembled HTML/DOM and how CSS actually places, sizes, groups, shows, hides, and styles it.

A capability that exists only in source code, a registry, a contribution table, a Runtime assertion, or a workpack is not sufficient evidence that the UI is assembled.

## Required inspection order

Before checking individual controls:

1. inspect the whole current-main HTML/DOM structure;
2. inspect the effective CSS that determines the visible workstation structure;
3. verify menus, tool hosts, panel hosts, dialogs, and major layout regions are assembled in their intended homes;
4. only then check individual controls and interactions.

```text
PARTS_PRESENT != UI_ASSEMBLED
SOURCE_PRESENT != VISIBLE_UI_PRESENT
RUNTIME_PASS != UI_ASSEMBLY_PASS
CHECKLIST_PASS != UI_ASSEMBLY_PASS
```

## Dynamic UI

If visible controls are injected at Runtime, static source registries do not count as UI evidence.

The reviewer must inspect the post-install DOM/HTML produced in the browser and the effective/computed CSS for that DOM.

Without that evidence, status is:

`SOURCE_ONLY / UI_NOT_VERIFIED`

## Checklist rule

Any UI checklist must be grounded in the assembled HTML/DOM + CSS.

For a visible item to pass, the evidence must establish at minimum:

- actual DOM location;
- intended visible parent/host;
- CSS/layout rule that makes it part of the workstation;
- not hidden, orphaned, off-canvas, placeholder-only, or dependent on a missing Runtime entrypoint.

A checklist may count components only after assembly is established.

## Completion language

Without HTML/DOM + CSS assembly evidence, AI may say:

`SOURCE_IMPLEMENTED`

It may not say:

`UI_IMPLEMENTED`
`UI_COMPLETE`
`PHOTOSHOP_ALIGNED`

USER visual acceptance remains final authority.
