# INK UI Final Design Lock v1.0

STATUS: `UR_LOCKED / READY_FOR_FINAL_UI_WORK_ORDER / NO_PRODUCT_CHANGE`

DATE: 2026-09-26

BASE_MAIN: `b1374ecec242b8206aa3000a784c7498e0044030`

CAPABILITY_AUTHORITY:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

PROGRAM:
`PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD`

## 1. Photoshop role

Photoshop is the primary workstation interaction and spatial-grammar reference for the final INK UI.

INK should reproduce, as closely as practical:
- application/menu hierarchy;
- contextual Options row;
- left Tools-panel grammar;
- dominant central canvas;
- right dock/panel grammar;
- Window ↔ panel convergence;
- panel grouping/collapse/resize behavior;
- compact workstation density;
- familiar History/Navigator interaction patterns.

INK does **not** copy Adobe branding, proprietary icons/assets, or create capabilities that are not in the frozen INK baseline.

Principle:

```text
COPY THE MATURE WORKSTATION GRAMMAR
NOT ADOBE PRODUCT IDENTITY
```

## 2. Light-gray visual decision

The final target is a **light-gray Photoshop-style workstation**, not Photoshop's dark theme.

Required hierarchy:

```text
application/menu chrome
→ light / medium neutral gray

options/tools/dock
→ light neutral gray with clear separators

panels
→ lighter neutral surfaces

canvas surround / model space
→ visibly darker than UI chrome

artboard / paper
→ white or paper-color authority

active / selected
→ restrained INK accent
```

The light theme must preserve Photoshop-like hierarchy and boundary clarity. It must not become a flat all-white interface.

Resizable/collapsible panels remain elastic. Screenshot dimensions are reference states, not permanent hard panel widths.

## 3. Human UI and CHAT must share authority

Photoshop familiarity serves the human-facing UI.

Machine-readable INK command/tool/panel semantics serve CHAT.

They must converge on the same authority.

Required model:

```text
USER:
visible Photoshop-like route
→ same native INK authority

CHAT:
named tool / bounded operation / panel semantic route
→ same native INK authority
```

Examples:

```text
USER: Edit > Undo
CHAT: undo_ink
→ History authority

USER: Object > Boolean > Union
CHAT: boolean.apply.v1
→ Geometry/Document authority

USER: Library Search
CHAT: search_ink_library
→ Creative Library read authority
```

Forbidden:
- CHAT simulated mouse clicks as the primary execution method;
- UI-only duplicate document state;
- CHAT-only duplicate mutation authority;
- separate History/Revision/Library/Renderer authority;
- functionality existing only because a visible button exists.

Principle:

```text
ONE FUNCTION
→ ONE PRIMARY AUTHORITY
→ MULTIPLE EXPLICIT ROUTES
```

## 4. UI simplification rule

Photoshop is useful because it organizes complexity, not because every Photoshop feature must be reproduced.

Therefore:
- persistent canvas interaction modes belong in Tools;
- immediate active-tool parameters belong in Options;
- structural/state information belongs in Panels/Properties;
- general one-shot operations belong in application menus;
- engineering/diagnostic functions remain Specialist;
- unsupported/deferred capabilities remain absent.

Do not expose fake Photoshop-like menus or panels merely for visual similarity.

## 5. Final capability boundary

Installed capability truth is frozen in:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

Current accepted scope includes:
- 34 bounded edit operations;
- 22 named tools;
- Public Creative API;
- Connector-005 Creative Library Search.

Explicit non-capabilities remain hidden:
- full Library Manager;
- cloud asset library;
- Variables/Tokens;
- general Styles;
- Component Variants;
- general Grid Layout engine;
- prototype system;
- design-to-code;
- autonomous Creative Memory writes;
- automatic Research fetch/scrape.

## 6. Final design conclusion

No further product-direction discussion is required before UI implementation.

The final implementation objective is:

```text
Photoshop workstation grammar
+ INK light-gray visual hierarchy
+ INK frozen capabilities
+ machine-readable CHAT/native command convergence
+ canvas-first / low-interference UX
```

Gate:

```text
PHOTOSHOP_DIRECTION = LOCKED
LIGHT_GRAY_THEME = LOCKED
HUMAN_CHAT_SHARED_AUTHORITY = LOCKED
CAPABILITY_BASELINE = FROZEN
CORE_SEMANTIC_CHANGE = 0
READY_FOR_FINAL_UI_WORK_ORDER = YES
```
