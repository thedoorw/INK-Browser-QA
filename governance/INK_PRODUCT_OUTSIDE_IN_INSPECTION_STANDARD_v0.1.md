# INK Product Outside-In Inspection Standard v0.1

STATUS: `ACTIVE / DURABLE PRODUCT INSPECTION RULE`

DATE: 2026-09-29

## Purpose

INK must be inspected as a complete assembled product from the USER-visible exterior inward.

A parts inventory, capability ledger, Runtime result, source registry, or checklist count cannot substitute for inspection of the assembled product.

## Mandatory inspection order

All full-product inspections and completion reviews use this order:

```text
1. LOOK
2. STRUCTURE
3. STYLE
4. INTERACTION
5. FUNCTION
6. RENDER
7. CORE / DATA
8. CAPABILITY
9. END-TO-END WORKFLOW
10. USER
```

### 1. LOOK — finished product exterior

Open the current deployed/current-main product as a USER would.

Check first:
- whether the product appears assembled as one coherent application;
- major regions, proportions, density and hierarchy;
- whether expected menus, toolbar, canvas/work area, docks/panels and status regions are visibly present;
- whether the result visibly matches the current USER/reference authority.

Do not begin by counting internal capabilities.

### 2. STRUCTURE — final HTML / post-Runtime DOM

Inspect the actual assembled HTML/DOM.

Verify:
- major UI regions exist in the final DOM;
- controls are mounted under the intended parents/hosts;
- dynamically injected controls are present after installation;
- no required UI is orphaned, placeholder-only, hidden by missing entrypoints, or absent from the final assembled tree.

This layer follows:
`governance/INK_UI_HTML_CSS_ASSEMBLY_VERIFICATION_RULE_v0.1.md`

### 3. STYLE — effective CSS / computed layout

Inspect the CSS that actually affects the assembled DOM.

Verify:
- display / visibility;
- position / dimensions;
- spacing / typography;
- overflow / z-index;
- expanded / collapsed / fullscreen states;
- responsive behavior;
- computed styles where source CSS alone is ambiguous.

### 4. INTERACTION — visible control behavior

Check the real UI:
- menus open;
- panels expand/collapse;
- controls can be clicked;
- drag/reorder/resize/toggle behavior works;
- visible controls route to the intended command or state;
- no dead, disabled-without-reason, or wrong-target controls remain.

### 5. FUNCTION — application logic

Verify the visible interaction actually invokes the intended JavaScript/application behavior and changes the correct product state.

### 6. RENDER — drawing/output surface

Verify renderer-dependent behavior separately:
- Canvas / SVG / WebGL output;
- drawing/editing feedback;
- selections;
- filters/effects/compositing;
- preview and output rendering.

HTML/CSS evidence alone does not prove renderer correctness.

### 7. CORE / DATA — authoritative product state

Verify authoritative internals such as:
- Document;
- Layers;
- History;
- Revision;
- Geometry;
- Recipe;
- persistence;
- import/export;
- format/schema constraints.

### 8. CAPABILITY — complete inventory

Only after product assembly is established, reconcile the capability inventory.

For the current INK baseline this includes the authoritative capability census and intentional headless/support capabilities.

The capability inventory answers:
`ARE THE PARTS PRESENT?`

It does not answer:
`IS THE PRODUCT ASSEMBLED?`

### 9. END-TO-END WORKFLOW — whole product use

Run representative complete workflows through the assembled product, for example:

```text
open/create
→ edit
→ inspect/change state
→ undo/redo
→ save/export
```

Passing isolated controls does not prove a complete workflow.

### 10. USER — final product authority

USER inspection is the final authority for whether the product satisfies the intended visible/product goal.

AI may establish technical evidence but may not substitute another PASS for USER acceptance where USER acceptance is required.

## Reference-difference rule for reference-led UI work

When the USER supplies a concrete UI reference and designates it as visual authority, inspection uses a difference-first model.

```text
REFERENCE_DIFFERENCE = DEFECT
unless
EXPLICIT_USER_EXCEPTION
```

For the current Photoshop-aligned INK UI, the allowed exceptions are only:

1. color/palette where the USER has explicitly chosen a different INK palette;
2. Photoshop capabilities that do not exist in the authoritative INK capability baseline (for example, do not invent missing 3D features merely to copy Photoshop);
3. another deviation explicitly approved by the USER.

Everything else is compared against the reference by default, including:

- region topology;
- toolbar row/column structure;
- panel grouping and stacking;
- dock segmentation;
- control placement and hierarchy;
- menu organization;
- spacing, density and dimensions;
- icon/control duplication;
- interaction grammar;
- expanded/collapsed panel behavior.

Do not reinterpret a visible difference as an acceptable abstraction merely because all capabilities can still be reached.

A duplicated or competing visible control is a defect unless the reference itself intentionally uses the same duplication pattern or the USER explicitly authorizes it.

## Gate dependency

A deeper layer may not be used to close an unresolved outer layer.

```text
CAPABILITY_PASS cannot close LOOK / STRUCTURE / STYLE
RUNTIME_PASS cannot close LOOK / STRUCTURE / STYLE
FUNCTION_PASS cannot close PRODUCT_ASSEMBLY
CHECKLIST_COUNT cannot close PRODUCT_ASSEMBLY
SOURCE_IMPLEMENTED cannot close VISIBLE_UI_IMPLEMENTED
```

If an outer layer fails, record the deeper-layer evidence separately and keep the outer layer open.

## Checklist construction rule

A full-product checklist must follow the same outside-in order.

Do not begin with hundreds of atomic parts.

Every full-product checklist must first establish:
1. assembled product exterior;
2. HTML/DOM structure;
3. effective CSS/layout;
4. visible interaction;
then proceed inward to function, renderer, Core and capability inventory.

## Completion language

Use distinct evidence states when needed:

```text
LOOK_PASS
STRUCTURE_PASS
STYLE_PASS
INTERACTION_PASS
FUNCTION_PASS
RENDER_PASS
CORE_PASS
CAPABILITY_PASS
WORKFLOW_PASS
USER_PASS
```

Do not collapse these into one generic PASS when the distinction matters.

`UI_COMPLETE` or equivalent product-completion language requires all mandatory outer-to-inner layers for the current task plus required USER acceptance.
