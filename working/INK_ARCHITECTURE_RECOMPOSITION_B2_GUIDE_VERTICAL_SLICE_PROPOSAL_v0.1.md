# INK Architecture Recomposition — First B2 Bounded Vertical Slice Proposal v0.1

STATUS: **PROPOSED / NOT AUTHORIZED FOR IMPLEMENTATION**  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`

Depends on:
- B0 pre-recomposition baseline = FROZEN;
- `research/INK_COMMAND_STATE_ARCHITECTURE_CONTRACT_v0.1.md`;
- separate MR / USER authorization.

## 1. Recommended first slice

`B2-GUIDE-COMMAND-AUTHORITY-001`

Canonical commands:

```text
guide.add.v1
guide.move.v1
guide.remove.v1
guide.lock.set.v1
guide.visibility.set.v1
```

## 2. Why Guides first

This family already has two real caller paths:

Human:
`web-shell ruler drag → app.addGuide/moveGuide/removeGuide`

CHAT:
`proposal/approval → chat-bounded-edit → app.addGuide/moveGuide/removeGuide/setGuideLocked/setGuideVisible`

Current InkApp guide methods already centralize:
- canonical guide Core helpers;
- scoped History;
- renderer refresh.

This makes Guides a real authority-consolidation test without involving:
- Document schema changes;
- FORMAT_VERSION;
- Raster payloads;
- Renderer algorithm changes;
- UI rebuild;
- Core rewrite.

## 3. Current baseline behavior to preserve

Current `InkApp` behavior:

```text
addGuide
  History: "新增參考線"
  scope: page.guides
  mutate through addRulerGuide()
  render

moveGuide
  History: "移動參考線"
  scope: page.guides
  mutate through moveRulerGuide()
  render

removeGuide
  History: "刪除參考線"
  scope: page.guides
  mutate through removeRulerGuide()
  render

setGuideLocked
  History: "鎖定參考線"
  scope: page.guides
  mutate through setRulerGuideLocked()
  render

setGuideVisible
  History: "顯示參考線"
  scope: page.guides
  mutate through setRulerGuideVisibility()
  render
```

CHAT currently validates duplicate IDs, locked guide movement, missing guide, and no-op lock/visibility changes before execution. Those semantics must remain.

## 4. Proposed bounded implementation shape

Only after B0 is frozen and B2 is authorized:

```text
Shared Command Authority
  └─ Guide command definitions
       ├─ validate
       ├─ resolve active page
       ├─ History policy
       ├─ existing guide Core helper
       └─ OVERLAY/FULL_RENDER invalidation adapter

Human ruler adapter
  └─ execute guide.*.v1

CHAT approved edit adapter
  └─ execute same guide.*.v1
```

Compatibility:
- keep `InkApp.addGuide/moveGuide/removeGuide/setGuideLocked/setGuideVisible` initially;
- convert them to thin adapters or retain them as old-route comparison hooks;
- do not delete any old handler in this slice.

## 5. Explicit non-scope

Do not touch:
- Layer/Raster/Text/Path commands;
- UI visual redesign;
- Photoshop shell rebuild;
- Recipe migration;
- Document schema;
- FORMAT_VERSION;
- Service Worker/PWA;
- C06/New Document;
- Core guide algorithms.

## 6. Required parity evidence

### Command-level

For each of the five commands:
- normalized post-state equals old route;
- same History label;
- same History scope;
- one Undo restores exact pre-state;
- one Redo restores exact post-state;
- same locked/missing/no-op error behavior;
- same rendered guide visibility/position.

### Human UI

Ruler interactions:
- create guide;
- move guide;
- drag placed guide outside to remove;
- locked guide cannot be moved;
- no duplicate History step;
- visible result unchanged.

### CHAT

Preserve:
`proposal → approve → execute`

Verify:
- approval token remains mandatory;
- stale/invalid target still rejects;
- result/precision fingerprint remains equivalent;
- command authority is the mutation owner, not CHAT.

### Regression

At minimum:
- guide/snap focused source tests;
- History Undo/Redo;
- renderer guide overlay;
- no change to PWA;
- no change to FORMAT_VERSION.

## 7. Slice exit gate

```text
GUIDE_COMMANDS = PASS
HUMAN_CALLER = SHARED_COMMAND
CHAT_CALLER = SHARED_COMMAND
OLD_ROUTE = RETAINED / NOT RETIRED
HISTORY_PARITY = PASS
RENDER_PARITY = PASS
PRODUCT_BEHAVIOR_DELTA = NONE
FORMAT_VERSION = 4
STOP → MR / USER REVIEW
```

Only after this slice proves the seam should a second family be authorized.
