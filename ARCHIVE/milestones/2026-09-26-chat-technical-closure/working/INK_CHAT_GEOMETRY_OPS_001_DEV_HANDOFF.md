# INK-CHAT-GEOMETRY-OPS-001 — DEV Handoff

STATUS: `DEV_HANDOFF / STOP`

## Task

`INK-CHAT-GEOMETRY-OPS-001`

Branch:

`work/ink-chat-geometry-ops-001`

Target gate:

`CHAT_NATIVE_GEOMETRY_OPS_V01`

## Implemented

The accepted six Connector-004 operations remain unchanged. Eight additive bounded geometry operations are now exposed:

```text
path.create.v1
path.edit.v1
object.rotate.v1
object.clone.v1
repeat.radial.v1
boolean.apply.v1
group.create.v1
object.reparent.v1
```

Total bounded operation vocabulary: 14.

All new mutation routes delegate existing INK native authorities. No second geometry engine was added.

## Safety / governance

Preserved:

```text
proposal → explicit approval → execute
History authority
Chat Creative Plan Revision authority
stable object refs
FORMAT_VERSION = 4
```

Not added:

```text
arbitrary JavaScript
eval / Function
direct Document JSON writes
external transport
IMAGE
UI changes
new renderer
new geometry engine
```

## QA evidence

Focused DEV source/contract QA:

```text
modified JS syntax = PASS
browser harness syntax = PASS
operation exposure = PASS
native authority mapping = PASS
world-space radial center conversion = PASS
guardrails = PASS
Runtime markers = 13 / 13 present
```

Focused executable test file added:

`qa/ink-chat-geometry-ops-001.test.mjs`

Existing Connector-004 regression updated only to recognize the authorized additive vocabulary while preserving the original six as exact prefix.

Real-browser proof added to:

`qa/runtime/ink-cloud-018-browser-harness.html`

The browser proof covers:

```text
create
→ path edit
→ rotate around explicit center
→ clone
→ radial repeat
→ boolean
→ group
→ reparent
→ History
→ Revision
→ Preview
```

## DEV limitation

DEV did not run Windows Runtime. MR owns the exact-SHA Windows Runtime.

The executable focused Node test was authored but could not be executed in the current DEV tool environment because the repository is not mounted locally and direct container GitHub network access is unavailable. No PASS is claimed for that executable test; the focused source/contract QA above was actually executed.

MR should therefore treat Windows exact-SHA Runtime as the behavioral authority.

## MR next

1. Verify branch exact HEAD and authorized diff.
2. Review the two product-source changes.
3. Queue one exact-SHA Windows Runtime on `DESKTOP-NSOQH69`.
4. Require:
   - UI PASS
   - Creative PASS
   - Geometry PASS
   - all existing smart-loop regressions remain PASS
   - `GEOMETRY_OPS_GATE_PASS`
5. Only then promote.

Exact final branch HEAD is reported in the DEV response after this handoff commit.

`DEV_HANDOFF → STOP`
