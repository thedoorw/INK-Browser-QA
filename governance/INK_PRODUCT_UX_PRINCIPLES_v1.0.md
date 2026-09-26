# INK Product / UX Principles v1.0

STATUS: `ACTIVE / DURABLE PRODUCT PRINCIPLES`

DATE: 2026-09-26

This file extracts still-valid product principles from earlier INK specifications. It does not replace current capability truth, which is defined by `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`.

## Product definition

INK is a browser-based creative editor centered on:
- editable strokes and structured objects;
- an infinite creative workspace plus layout/print space;
- vector, raster and natural-media directions;
- direct manipulation;
- low-interference creative flow;
- one shared product core across portable/web and cloud delivery.

## Experience principles

1. **Canvas first** — the artwork/workspace remains visually dominant.
2. **Direct manipulation first** — move/scale/rotate/select primarily on canvas; numeric controls refine rather than replace direct interaction.
3. **Contextual UI** — expose controls relevant to the current object/tool/workflow; avoid permanent control overload.
4. **Single authority per function** — one primary home for each function; contextual/shortcut routes may exist but must not create competing state owners.
5. **Editable over flattened** — preserve paths, components, layout and provenance where the target workflow requires continued editing.
6. **Quiet workstation** — UI supports creation rather than becoming the visual subject.
7. **Cross-device reflow** — desktop/tablet/mobile share product language and core semantics but may rearrange controls.
8. **Shared Core** — portable/web and cloud consume the same accepted document/editor capability set.
9. **Non-destructive history** — History/Revision remain inspectable and explicit.
10. **AI/CHAT is governed collaboration** — CHAT reasons over the native structure and uses bounded native authorities; it does not become a hidden second editor engine.

## UI engineering constraint

Photoshop is a workstation interaction/reference target for the current UI program, not a requirement to copy fixed panel dimensions.

Resizable/collapsible panels, structural boundaries, command placement and interaction behavior may align with Photoshop while preserving INK's own product principles.

Detailed UI health rules:
`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`
