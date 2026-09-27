# INK UI — Photoshop Active Document & Popup Measurement v0.1

STATUS: `UR_MEASUREMENT_AUTHORITY / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION`

DATE: 2026-09-27

BASE_MAIN: `2a697164ccfd40e659dd55dcfc23e529641cc798`

PURPOSE:
Record pixel measurements from the USER-supplied 1280×1024 Photoshop 21.2.12 capture set with an active document. This closes major Fine Detail gaps for document tabs, rulers, status bar, application menu popup, panel menu popup, Navigator shell and History row density.

## 1. Reference captures

All five captures are 1280×1024 and visibly belong to the same Photoshop 21.2.12 / Traditional Chinese / dark-theme workstation family as the prior reference pack.

| Capture | SHA256 | Role |
|---|---|---|
| image(20260927-114023).png | `68b5bfaf3ae4a918b8ceb4911864bc8b562dc67783aff7c974a95cbd027dda92` | active document, rulers OFF |
| image(20260927-114103).png | `098a5615234941a8dd20a7ac35e3d7473d96dc0a9b572d2839b73c4adcda7d62` | same document, rulers ON |
| image(20260927-114205).png | `1aeaa22f79c3650683b1d54853ee491336889998cea689a6c64c8eeec989afa7` | right Panel Options Menu open |
| image(20260927-114335).png | `a4092b92a2eaf21666bfd86e22c3b1119bb8553d0ea5a7c0642ccee962e58ba6` | Navigator + History populated |
| image(20260927-114432).png | `92b34f318edb141e2ae28718c8889ad34585e2f3bd607a8dab22e9b6eb53c6af` | application Edit menu open |

Unknown environment values remain:
- exact Windows version;
- Windows display scale;
- Photoshop UI scaling;
- UI Font Size preference;
- Scale UI To Font.

These measurements are authoritative only within this matched reference environment.

---

# 2. Active-document vertical geometry

Common top chrome remains unchanged:

```text
Application/menu row  [0,24)   = 24 px
divider                [24,25)  = 1 px
Options row            [25,60)  = 35 px
divider                [60,61)  = 1 px
```

New active-document geometry:

```text
Document tab band      [61,89)  = 28 px
tab/workspace divider  [89,90)  = 1 px
```

Therefore:

### Rulers OFF
```text
document/workspace content origin Y = 90 px
```

### Rulers ON
```text
horizontal ruler       [90,107) = 17 px
document/workspace Y   = 107 px
```

The 17 px difference is directly confirmed by matched screenshots.

---

# 3. Active-document horizontal ruler geometry

With Rulers ON:

```text
vertical ruler         x=[74,91) = 17 px
document/workspace X   = 91 px
```

Without Rulers:

```text
document/workspace X   = 74 px
```

Ruler-origin corner:

```text
x=[74,91)
y=[90,107)
size = 17×17 px
```

Classification:
- ruler thickness = `MEASURED / REFERENCE_STATE`
- ruler-origin corner = `MEASURED`
- label/tick micro-geometry = still requires dedicated close reference if pixel-level replication is required.

---

# 4. Document tab reference state

For the supplied title state:

```text
tab band height = 28 px
visible active-tab reference X ≈ [73,306)
visible width ≈ 233 px
```

The 233 px width is `REFERENCE_STATE_ONLY` because title length, zoom text, mode text and unsaved state change the required width.

Required invariant:
- document tab occupies the active-document band;
- title text and close/unsaved affordances must not change the 28 px reference band height;
- tab width remains content/state dependent.

---

# 5. Document Status Bar

Active document captures confirm:

```text
status content band    [977,993) = 16 px
bottom boundary        [993,994) = 1 px
total document bottom  = 17 px
```

The bar is visible only with the active document and does not belong to the left Tools or right Panel stack.

Observed left-side segmentation in the reference state:

```text
zoom region            x≈[74,122)  = 48 px
document-info region   x≈[122,306) = 184 px reference
remaining region       = document horizontal-view/scroll/status area
```

These horizontal widths are `REFERENCE_STATE_ONLY`; content can vary.

This reinforces the existing INK rule:

```text
NO ACTIVE DOCUMENT → DOCUMENT_STATUS_STRIP = HIDDEN
ACTIVE DOCUMENT    → DOCUMENT_STATUS_STRIP = ELIGIBLE
```

---

# 6. Navigator group reference

In the populated active-document state:

```text
Navigator panel group starts at y=73
tab/header band        [73,101)  = 28 px
main preview/body      [101,309) = 208 px reference state
zoom/footer region     [309,342) = 33 px reference state
group splitter         [342,345) = 3 px observed
```

The body/footer heights remain `REFERENCE_STATE_ONLY` because panel groups are resizable.

Useful locked density evidence:
- header = 28 px;
- splitter ≈3 px.

---

# 7. History populated-state density

The History panel group uses the same 28 px header grammar.

Repeated History list separators occur at approximately:

```text
y=725
y=748
y=771
y=794
```

Therefore the repeated History row pitch is:

```text
≈23 px
```

Classification:
`OBSERVED_DENSITY / MEASURED_REPEAT`

The selected/current-state row is visibly differentiated and remains within the same row-pitch grammar.

Do not infer History semantic behavior from row color alone; current/future/past semantics remain governed by the existing History spec.

---

# 8. Panel Options Menu popup

The Paths-panel options menu capture provides a direct popup reference.

Outer popup:

```text
x=[1162,1280) = 118 px
y=[650,969)   = 319 px
```

Interior:

```text
x=[1163,1279) = 116 px
```

Measured color/boundary roles from this reference:

```text
outer border = 1 px, RGB≈160
menu background = RGB≈240
separator = 1 px, RGB≈192
separator horizontal inset = 2 px each side of interior
```

Observed separator Y positions:
`715 / 745 / 813 / 843 / 892 / 922`

Menu height and width are content-dependent and therefore `REFERENCE_STATE_ONLY`.

Repeated command text pitch visually falls around the compact 19–20 px range, but this is retained as `OBSERVED_DENSITY`, not a locked hitbox height.

---

# 9. Application Edit menu popup

Direct reference:

```text
outer popup x=[78,297) = 219 px
outer popup y=[20,839) = 819 px
interior x=[79,296)    = 217 px
```

Measured:
- outer border = 1 px RGB≈160;
- background = RGB≈240;
- separator = 1 px RGB≈192;
- separator X range ≈[81,294), giving ≈2 px horizontal inset on each side.

Observed separator Y positions:

`85 / 115 / 240 / 308 / 376 / 520 / 588 / 618 / 686 / 754`

Important:
- popup width/height are content-dependent;
- menu item pitch is compact and visually ~19–20 px in repeated rows, but exact hitbox height remains unresolved;
- popup top overlaps the 24 px application-menu band in this Photoshop/Windows reference and must not be generalized across platforms without evidence.

---

# 10. Newly closed Fine Detail gaps

```text
ACTIVE_DOCUMENT_TAB_BAND = 28 PX / MEASURED
ACTIVE_DOCUMENT_DIVIDER = 1 PX / MEASURED
RULER_HORIZONTAL = 17 PX / MEASURED
RULER_VERTICAL = 17 PX / MEASURED
RULER_ORIGIN_CORNER = 17×17 PX / MEASURED
DOCUMENT_STATUS_CONTENT = 16 PX / MEASURED
DOCUMENT_STATUS_BOTTOM_BOUNDARY = 1 PX / MEASURED
NAVIGATOR_HEADER = 28 PX / MEASURED
NAVIGATOR_BODY_REFERENCE = 208 PX / REFERENCE_STATE
NAVIGATOR_FOOTER_REFERENCE = 33 PX / REFERENCE_STATE
HISTORY_ROW_PITCH ≈ 23 PX / OBSERVED_DENSITY
PANEL_MENU_BORDER = 1 PX / MEASURED
PANEL_MENU_SEPARATOR = 1 PX / MEASURED
PANEL_MENU_SEPARATOR_INSET = 2 PX / MEASURED
APPLICATION_MENU_BORDER = 1 PX / MEASURED
APPLICATION_MENU_SEPARATOR = 1 PX / MEASURED
APPLICATION_MENU_SEPARATOR_INSET = 2 PX / MEASURED
```

---

# 11. Remaining high-value reference gaps

Still worth capturing only if final pixel fidelity is required:

1. tool flyout open;
2. Status Bar information popup open;
3. horizontal guide drag from top ruler;
4. vertical guide drag from left ruler;
5. ruler-origin drag;
6. equal-spacing/snap feedback;
7. Layers drag-reorder insertion state;
8. Navigator proxy drag;
9. standard tooltip;
10. keyboard-focus state;
11. disabled control;
12. scrollbar hover/drag;
13. panel resize in progress;
14. empty workspace after closing the last document.

The current five-image set already closes the need for additional generic active-document, ruler, panel-menu, History-populated and application-menu screenshots.
