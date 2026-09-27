# INK UI Full Capability Reconciliation — MR Review v1.0

STATUS: `MR_REVISE / BOUNDED_DOCUMENT_CORRECTION_REQUIRED`

DATE: 2026-09-28

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

UR_BRANCH:
`work/ink-ui-full-capability-reconciliation-001`

UR_HEAD_REVIEWED:
`5eb8ab1703d2a2feb6dc8f0ab1ad2732702bd205`

PRODUCT_SOURCE_MUTATION:
`0`

UI_IMPLEMENTATION:
`0`

## 1. MR result

The UR architecture is accepted in principle, but the reconciliation is not yet implementation-authoritative.

```text
64_FAMILY_COVERAGE = PASS
P1_A_TO_H_PLACEMENT = PASS
MENU_TOOLBAR_PANEL_ARCHITECTURE = PASS_IN_PRINCIPLE
HEADLESS_BOUNDARY = PASS_IN_PRINCIPLE
GAP_REGISTER_INTERNAL_COUNTS = PASS
PRODUCT_SOURCE_MUTATION = 0
ATOMIC_LEVEL_DISPOSITION = INCOMPLETE
UPDATED_CONTROL_LEDGER_AS_IMPLEMENTATION_SSOT = INCOMPLETE
MR_RESULT = REVISE
UI_IMPLEMENTATION_HOLD = REMAINS
```

## 2. What passed

MR independently verified:

- branch is ahead of main only by five planning documents;
- no `product/source/**` change;
- no Runtime / FORMAT_VERSION / P2 implementation;
- Placement Matrix contains exactly 64 unique family rows, C01-C64, with no missing or duplicate family;
- Gap Register contains exactly G-01 through G-34;
- gap counts reconcile exactly:
  - P0-UI = 14
  - P1-UI = 15
  - P2-UI = 5
- explicit P1-A through P1-H placement sections are all present;
- Filter menu / Color / Channels / Adjustments / Layer Effects / Liquify / ruler-guide-snap placement direction is consistent with promoted P1 scope;
- C62 / Runtime / renderer-GPU / recompute / semantic internals are correctly prevented from becoming normal creative chrome.

These decisions do not need to be redone.

## 3. Blocking issue A — atomic capability disposition is not explicit enough

The task requires reconciliation of the full capability inventory, not only family-level architecture.

Current Placement Matrix states that every atomic capability inherits its family placement unless an exception is listed.

That rule is too coarse for heterogeneous families.

Examples from the authoritative Registry:

### C30 Brush engine

The same family contains:
- Brush preset selection;
- Brush preset registry;
- Import Brush Package;
- Export Brush Package;
- Persist/reload imported Brush Package;
- Replace brush on existing Stroke/Session;
- Drawing Workflow detect/import.

These do not all belong to one identical primary UI surface.

### C53 Output

The same family contains:
- PNG export;
- SVG export;
- PDF export;
- Browser print;
- Export scope / scale / PPI;
- Output handle inspect/release lifecycle.

The normal export operations are general UI, while output-handle lifecycle is not an ordinary creative control.

### Other heterogeneous families requiring explicit audit

At minimum re-check:
- C22 Raster / Image objects;
- C23 Masks;
- C30 Brush engine;
- C35 Stroke Session;
- C36 Stylus;
- C37 Device calibration;
- C40 Reference import;
- C43 History;
- C46 Compare / Variant;
- C47 Storage;
- C52 High-resolution export;
- C53 Output;
- C55 Recipe / automation;
- C56 Program Import;
- C57 CHAT control;
- C58 Semantic grounding;
- C59 Creative Library;
- C60 Creative Memory / Research;
- C63 PWA / update management;
- C64 Product health / diagnostics.

The family matrix may remain as the high-level architecture, but it cannot substitute for atomic disposition evidence.

## 4. Required correction A — atomic disposition table

Add one authoritative atomic-level table, either:

- as a new section in `INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`; or
- as a new companion file `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`.

It must cover:

```text
PRODUCT_ATOMICS = 496 / 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5 / 5
TOTAL_NORMALIZED_ATOMICS = 501 / 501
```

One row per normalized atomic capability.

Required columns:

```text
Family ID
Atomic capability
Scope = PRODUCT | HEADLESS_PLATFORM_SUPPORT
UI class = GENERAL | CONTEXTUAL | SPECIALIST | HEADLESS | AUTOMATIC/READOUT
Primary surface
Secondary entry
Contextual control
Existing UI state = YES | PARTIAL | NO | INTERNAL
Position issue = YES | NO
Gap ID = G-xx | —
Authority / constraint note
```

An `INHERIT:Cxx` value is allowed only after the row is still explicitly present and the atomic truly shares the family placement.

Automatic/internal atomics must not receive invented controls merely to fill the table.

Promoted P1 A-H overrides remain authoritative.

## 5. Blocking issue B — updated control ledger needs stable planned-control identity

The current Updated Control Ledger correctly preserves the predecessor 212 buttons / 29 selects and clearly distinguishes planned controls from implemented controls.

However, new planned UI requirements are currently represented mainly as prose/group rows without a stable planned-control identity or reconciled planned-control count.

Before UI DEV is authorized, the ledger must distinguish each new/relocated/retired requirement unambiguously.

Required bounded correction:

- retain predecessor IDs 1-212 and existing select names;
- assign stable planning IDs to new planned controls/surfaces, e.g. `PUI-001...`;
- identify each as:
  - NEW
  - RELOCATE
  - EXPAND_FLYOUT
  - RETIRE_DUPLICATE
  - CONTEXTUAL_ONLY
  - PANEL
  - DIALOG/WORKSPACE
  - HEADLESS_NO_CONTROL;
- record its capability/atomic source;
- record primary surface;
- record implementation status = PLANNED only;
- provide totals for new / relocate / retire / contextual / panels / dialogs.

These are planning IDs only and must not prescribe DOM implementation IDs.

## 6. Gap-register correction rule

After atomic disposition is complete, re-run the gap audit.

Do not preserve `OPEN_UI_GAPS = 34` merely because it was the first family-level result.

If atomic review reveals no new gap, keep 34 and explicitly record:

`ATOMIC_AUDIT_NEW_GAPS = 0`.

If it reveals additional real UI gaps, add them and recompute P0/P1/P2 totals.

Do not create gaps for intentionally headless/automatic atomics.

## 7. Accepted architecture decisions

Unless atomic audit proves a conflict, keep these UR decisions:

- top-level Filter menu;
- Color / Channels / Adjustments normal panels;
- Layers `fx` + one Layer Effects surface;
- bounded Liquify temporary workspace/modal;
- compact selection and retouch flyouts;
- one visible Gradient workflow dispatching to existing raster/vector authorities;
- normal ruler/guide/snap workstation UI;
- Image > Mode / Color Profile plus separate Color and Channels panels;
- File-based P1-H interoperability;
- no normal Runtime / asset-lifecycle / GPU / recompute / semantic-internal panels.

## 8. Scope of revision

This is a document-only bounded revision.

```text
product/source/** = NO CHANGES
UI implementation = NO
Runtime = NO
FORMAT_VERSION = NO
P2 implementation = NO
new product capability = NO
new UI architecture redesign = NOT REQUIRED
```

UR should revise the existing branch and STOP again for MR review.

## 9. Gate

```text
CURRENT_RESULT = MR_REVISE
UI_RECONCILIATION = REVISION_REQUIRED
UI_IMPLEMENTATION = HOLD
NEXT_OWNER = UR
```
