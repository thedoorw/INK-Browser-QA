# INK Web UI-003 Contextual Controls Report v0.1

Task: `INK-WEB-UI-003 — Contextual Controls / Top Options v0.1`  
Branch: `work/ink-web-ui-003`  
Base main: `73b54efe6d7db1f9fd15531603056c82e4c9de1e`  
Source/static checkpoint before this report: `35b94dec65d69fc6f813258fb55b37cefbbf8cbd`

## Result

```text
current tool / selection
→ one shared contextual top-options surface
→ high-frequency controls use existing command-bearing nodes
→ advanced controls remain Inspector/on-demand
→ Portable/Web shell stays shared
→ no Core semantic change
```

Source gate: `CONTEXTUAL_TOOL_OPTIONS_WORK` — PASS on source/static evidence.  
Runtime: `DEFERRED_TO_UI_INTEGRATION_BATCH`.

## Before / after placement inventory

| Area | Before | After |
|---|---|---|
| Drawing Color / Size / Opacity | floating `#quickControls` over canvas | existing `#quickControls` re-hosted in `#contextualControlHost` |
| Active tool identity | left rail + Inspector title/status | compact `#contextualToolName` / `#contextualToolUse` added to top contextual row |
| Eraser | mode in Inspector; size inherited from current draw size | existing quick Size + existing `[data-eraser-mode]` in contextual row |
| Shape | `[data-shape]` + `#shapeFill` in Inspector | existing type/fill controls + shared existing color in contextual row |
| Text | `#fontFamily` + `#fontSize` in Inspector | existing font/size + shared existing color in contextual row |
| Selection | floating `#selectionBar` over canvas | same `#selectionBar` commands re-hosted in contextual row |
| Brush presets / smoothing / pressure / media dynamics | Inspector | unchanged in Inspector; reached through contextual `進階` |
| Object/path/stroke transforms | Object Inspector | unchanged |

Selection has contextual priority while one or more objects are selected. With no selection, the row follows the current tool.

## Binding / ID preservation

No new tool state or command authority was introduced.

Preserved command-bearing IDs include:

- `#quickColorInput`
- `#quickSizeInput`
- `#quickOpacityInput`
- `#selectionBar`
- `#shapeFill`
- `#fontFamily`
- `#fontSize`

Preserved command hooks include:

- `[data-selection-action]`
- `[data-eraser-mode]`
- `[data-shape]`

`web-shell.js` moves the existing nodes into the contextual host with `host.append(node)`; it does not clone them. Existing listeners therefore remain the authority.

`product/source/src/ink.js` is unchanged by UI-003. Existing bindings remain:

- quick Color → existing `setColor`;
- quick Size / Opacity → existing `updateBrushSetting`;
- eraser mode → existing `eraserMode`;
- shape type/fill → existing `shapeType` / `shapeFill`;
- text font/size → existing `font`;
- selection actions → existing duplicate/group/front/center/delete methods.

The contextual `進階` button only opens the existing Tool Inspector; with a selection it opens the existing Object Inspector.

## Context matrix

| Context | Top row |
|---|---|
| Pen / Pencil / Marker / Brush / Airbrush | tool identity · Color · Size · Opacity · Advanced |
| Eraser | tool identity · Size · segment/object mode · Advanced |
| Shape | tool identity · Color · shape type · Fill · Advanced |
| Text | tool identity · Color · font family · font size · Advanced |
| Selection present | selection identity/count · duplicate · group · front · horizontal center · delete · Object Inspector |
| Other tools | identity only |

## Portable / Web parity

Both entry shells contain the same:

- `#contextualOptions`;
- `#contextualToolUse`;
- `#contextualToolName`;
- `#contextualControlHost`;
- `#contextualAdvancedBtn`;
- contextual data-control annotations.

The existing strict full-shell parity test was extended so these IDs and the `contextual-options` region are required in both deliveries.

Current exact branch source was checked with the same delivery-only normalization contract used by the checked-in parity test:

- full normalized Web/Portable HTML: PASS;
- duplicate ID guard: PASS;
- required contextual IDs: PASS;
- required existing panel/tool hooks: PASS;
- asymmetric mutation rejection: PASS, including all existing Web mutation cases plus Portable mutation rejection.

No delivery-specific contextual fork was added.

## Source / static checks executed

Executed against exact files from `work/ink-web-ui-003`:

| Check | Result |
|---|---|
| `web-shell.js` JavaScript parse in V8 | PASS |
| updated shared parity test source parse | PASS |
| new contextual-options test source parse | PASS |
| full Portable/Web delivery-only normalized parity | PASS |
| contextual ID uniqueness / command-hook matrix | PASS |
| drawing/eraser/shape/text/selection binding assertions against unchanged `src/ink.js` | PASS |
| contextual mode CSS matrix | PASS |
| canvas / rail / panel top-offset contract | PASS |
| existing parity mutation-failure contract | PASS |
| `FORMAT_VERSION = 4` | PASS |
| user-facing product base identity `v0.1` | PASS |
| forbidden Core semantic source mutation | PASS — none present in branch diff |

The checked-in deterministic tests are:

- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
- `qa/core/tests/unit/contextual-tool-options-v0.1.test.mjs`

The current tool environment did not provide a local GitHub checkout for a literal `node --test` process; instead the checked contracts and equivalent assertions were executed directly against the exact connected GitHub branch source. No browser Runtime result is claimed.

## Files changed by implementation

Product UI:

- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/web-shell.js`
- `product/source/styles.css`

QA:

- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
- `qa/core/tests/unit/contextual-tool-options-v0.1.test.mjs`

Task evidence / control:

- branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` — authorization baseline already present at branch start;
- branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- this report.

Not changed by UI-003 implementation:

- Document / schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry;
- Renderer / WebGL / Canvas engine;
- persistence contracts;
- product base version;
- package / certification;
- `product/source/src/ink.js`.

## Runtime debt

```text
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
```

Future UI integration Runtime should verify visual density, desktop/narrow overflow, panel opening, tool switching, selection-context switching, and browser-native color/range interactions.

## Integration finding

`INTEGRATION_REQUIRED = NO`

No forbidden cross-lane or Core dependency was encountered.

Final source/static gate:

`CONTEXTUAL_TOOL_OPTIONS_WORK = PASS`
