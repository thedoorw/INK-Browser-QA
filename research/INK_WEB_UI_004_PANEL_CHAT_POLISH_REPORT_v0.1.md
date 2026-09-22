# INK Web UI-004 Panel / CHAT Polish Report v0.1

Task: `INK-WEB-UI-004 — Panel Hierarchy / Spacing / CHAT Placement Polish v0.1`  
Branch: `work/ink-web-ui-004`  
Base main: `9adc2ef09141e4015fc9d4657fb5b3f932a39c41`  
Source/static checkpoint before this report: `dc136414b6b410bd9d8e54813a29bf7e749989e4`

## Result

```text
accepted UI-003 shell
→ explicit Editor / Creative Loop hierarchy
→ tighter panel / control rhythm
→ CHAT / Reference / Compose / Revision remain right-dock on demand
→ canvas-first default preserved
→ capability semantics unchanged
```

Final source/static gate: `PANEL_CHAT_UI_POLISH_WORKS = PASS`.  
Runtime: `DEFERRED_TO_UI_INTEGRATION_BATCH`.

## Before / after hierarchy

| Area | Before | After |
|---|---|---|
| Right dock grouping | visually separated but mostly implicit | explicit `Editor` and `Creative Loop` groups with shared group state |
| Window menu | flat list of all panels | mirrors Editor / Creative Loop hierarchy |
| Active panel grammar | Inspector and Creative Workspace both primary, with different historical chrome | same compact edge grammar; single-primary guard preserved |
| Creative header | generic “Creative Workspace” plus eyebrow | compact stage-aware heading, presentation only |
| Creative state | tall legacy status preamble | compact two-column status matrix; all state remains available |
| Inspector | older header/tab/body spacing | reduced header/tab/body chrome and consistent control rhythm |
| Context row | UI-003 accepted baseline | retained; small spacing alignment only |
| Canvas edge | accepted UI-003 offsets | left rail/pages clearance tightened without new floating chrome |

The dock remains collapsed by default. Opening one primary surface closes the competing one through the existing shell coordinator.

## Panel grouping

Editor group:

- Properties;
- Layers;
- History.

Creative Loop group:

- Reference;
- Compose;
- CHAT;
- Revision.

The existing internal `Edit` stage remains available inside Creative Workspace. It does not gain a second dock command or new authority.

`web-shell.js` now records group identity only for presentation and synchronizes the visible Creative Workspace heading with the current stage. Internal stage clicks trigger a shared-shell presentation refresh so active dock/header state remains predictable.

## CHAT / creative-loop placement

Reference, Compose, CHAT and Revision continue to use the existing:

```text
creativeWorkspace.setStage(...)
creativeWorkspace.setOpen(...)
```

No simulated mouse execution was introduced.

CHAT remains the existing Creative Workspace CHAT pane. UI-004 only gives its existing transcript and prompt more visual space and reduces surrounding chrome.

Preserved CHAT authorities include:

- conversation send / clear / inspect / transmission approval;
- bounded mutation inspect / propose / approve / reject / execute;
- multi-step plan propose / approve / reject / execute.

Closing the panel still calls the existing workspace visibility API only. It does not clear proposal, plan, conversation, document or revision state.

## Semantic / binding preservation

UI-004 product implementation changes only:

- `product/source/web-shell.js`;
- `product/source/styles.css`.

Unchanged by UI-004:

- `product/source/src/editor/creative-workspace.js`;
- `product/source/src/ink.js`;
- Document / schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry contracts;
- Renderer / WebGL / Canvas engine;
- persistence contracts;
- product base version;
- package / certification.

UI-003 contextual controls remain in the same shared host with the same IDs and bindings.

## Portable / Web parity

No entry-shell HTML fork was introduced. Web and Portable continue to load the same:

- `styles.css`;
- `web-shell.js`;
- dynamic panel dock / Window menu;
- Creative Workspace controller.

The existing strict shell-parity test was extended to require the new panel grouping contract.

Current connected branch source check:

- full delivery-only normalized HTML parity: PASS;
- shared required IDs / duplicate IDs: PASS;
- UI-003 contextual hooks: PASS;
- new dynamic panel-group invariants: PASS.

## Source / static checks

Executed directly against exact GitHub branch content:

| Check | Result |
|---|---|
| `web-shell.js` JavaScript parse | PASS |
| shared shell parity test source parse | PASS |
| contextual-options test source parse | PASS |
| new panel/CHAT polish test source parse | PASS |
| strict Portable/Web normalized parity | PASS |
| unique command/region IDs | PASS |
| explicit Editor / Creative Loop grouping | PASS |
| one-primary-panel guard | PASS |
| existing Creative Workspace controller routing | PASS |
| no simulated `.click()` authority | PASS |
| CHAT state/execution ownership absent from shell | PASS |
| UI-003 contextual coordinator preserved | PASS |
| UI-004 CSS hierarchy / CHAT presentation contract | PASS |
| UI-004 CSS brace balance / malformed token check | PASS |
| `FORMAT_VERSION = 4` | PASS |
| `INK v0.1 · Web / Portable` identity | PASS |

Equivalent focused assertions executed: **75 PASS / 0 FAIL**.

Checked-in QA files:

- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`;
- `qa/core/tests/unit/contextual-tool-options-v0.1.test.mjs`;
- `qa/core/tests/unit/panel-chat-polish-v0.1.test.mjs`.

The local execution container could not resolve GitHub for a checkout, so a literal local `node --test` invocation was not used. The same deterministic contracts were executed against the exact connected GitHub branch contents. Browser Runtime was not executed or claimed.

## Changed-file inventory

Implementation:

- `product/source/web-shell.js`
- `product/source/styles.css`

QA:

- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
- `qa/core/tests/unit/panel-chat-polish-v0.1.test.mjs`

Task evidence/control:

- branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` — authorization baseline;
- branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- this report.

No Web/Portable HTML mutation was required.

## Runtime debt

```text
RUNTIME_QA = DEFERRED_TO_UI_INTEGRATION_BATCH
```

Integration Runtime should verify actual visual density, panel switching, internal Creative stage switching, CHAT transcript/prompt sizing, narrow overflow, and canvas reflow after panel open/close.

## Integration finding

`INTEGRATION_REQUIRED = NO`

No cross-lane or Core-authority change was required.

Final source/static gate:

`PANEL_CHAT_UI_POLISH_WORKS = PASS`


## UR review bounded correction

During UR review, `INK_WEB_SHELL.state()` was found to declare the same `creativeStage` key twice with the same value. The clean-promotion payload removes the duplicate declaration and adds a focused static assertion requiring exactly one `creativeStage` field.

This correction is presentation/shell hygiene only and does not change Creative Workspace, CHAT, Document, History, Revision, Geometry, Renderer, persistence, or Core semantics.
