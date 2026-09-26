# INK Technical Closure 001 — C2 Exposure Disposition

STATUS: `MR_DISPOSITION_COMPLETE / INSTALL_FIRST_SEQUENCE_APPROVED`

Authority:
- user decision: technical closure before final UI rebuild;
- `working/INK_TECH_CLOSURE_001_CAPABILITY_LEDGER.md`;
- `research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md`;
- `research/INK_TECHNICAL_CAPABILITY_MASTER_v1.0.md`;
- current main native authorities.

## Rule

A family is `ACTIVE_EXPOSURE_WORK` only when all are true:

1. it was part of the accepted connector target or equivalent durable plan;
2. current INK already has a real native authority;
3. exposing it does not require inventing a second engine;
4. it remains useful to the current drawing / USER + CHAT product direction.

## Decisions

| Family | Native authority evidence | Decision |
|---|---|---|
| Frame/container | `document/hierarchy.js:createFrame`, existing hierarchy/reparent | ACTIVE_EXPOSURE_WORK |
| Text | existing editor/vector Text + current text controls | ACTIVE_EXPOSURE_WORK, bounded to current accepted Text semantics |
| SVG import | `vector-core.js:importSVGDocument` and existing import path | ACTIVE_EXPOSURE_WORK |
| Resize/Rotate/Scale | existing transform matrices / `applyWorldTransformBatch`; rotate already coded in Geometry Ops | ACTIVE_EXPOSURE_WORK |
| Z-order/reorder | authoritative parent/layer object ordering already exists | ACTIVE_EXPOSURE_WORK |
| Repeat / parametric | existing Repeat authority; radial already coded in Geometry Ops; mirror/grid/expand exist natively | ACTIVE_EXPOSURE_WORK |
| Auto/Flex layout | `document/layout.js:setFrameLayout` | ACTIVE_EXPOSURE_WORK |
| Constraints/fill/hug | `document/layout.js:setChildLayoutItem` | ACTIVE_EXPOSURE_WORK |
| Components/Instances | `registerComponentDefinition`, `createComponentInstance` | ACTIVE_EXPOSURE_WORK |
| Component overrides | `setComponentOverride`, detach/duplicate/repair native commands | ACTIVE_EXPOSURE_WORK |
| Asset export | existing INK export authorities; current CHAT route stops at user gesture | ACTIVE_EXPOSURE_WORK |
| Creative Memory / Research | Phase-1 accepted as read-only advisory context; automatic write explicitly excluded | CLOSED_AT_ACCEPTED_ADVISORY_SCOPE |

## Already covered by C1 Geometry Ops replay

The following exposure debt is not duplicated in C2 implementation:

```text
Group create
Path / primitive create
Path edit
Rotate
Clone
Radial Repeat
Boolean
Reparent
```

They remain C1 until Runtime PASS and promotion.

## C2 bounded implementation groups

After C1 reaches `C1_SOURCE_FOCUSED_PASS`, exposure work proceeds on the same closure branch without an intervening full Runtime unless the high-risk exception is triggered. Work remains split into separate reviewable checkpoint commits:

### C2-A — Basic structure / transform / import-export

```text
Frame
Text
SVG import
Resize / Scale
Z-order / reorder
Asset export
```

No new Text engine, SVG engine, transform engine or export renderer.

### C2-B — Parametric / layout

```text
Repeat mirror / grid / expand
FrameLayout set/remove
LayoutItem fixed/fill/hug/constraints set/remove
```

No new layout or Repeat engine.

### C2-C — Components

```text
component register
create instance
set/reset accepted override
detach
duplicate definition
repair reference
```

No Variant system and no nested-component expansion beyond current native contract.

## Explicit exclusions from Closure 001

These do not block the current closure:

```text
Grid Layout engine
general Component Variants
general Variables/Tokens
Prototype interactions
Design → code
Code/live UI → design
CRDT/multiplayer/presence/team admin
general constraint solver
automatic Creative Memory writes
automatic Research fetch/scrape
autonomous recursive agents
automatic approval/execution
```

Creative Library Search / Connector-005 remains separately tracked planned work. It is not silently declared complete and is not bundled into C2.

## Closure criterion

C2 is complete only when each ACTIVE_EXPOSURE_WORK family is either:

```text
exposed through existing authoritative native routes
+ focused QA
+ required Runtime evidence
+ promoted

OR

explicitly revised by the user/MR to CORE_ONLY_ACCEPTED with a concrete reason
```

No ambiguous status is permitted.


## Runtime batching rule

Authoritative execution plan:

`working/INK_TECH_CLOSURE_001_EXECUTION_PLAN.md`

```text
C1_SOURCE_FOCUSED_PASS
→ C2A_SOURCE_FOCUSED_PASS
→ C2B_SOURCE_FOCUSED_PASS
→ C2C_SOURCE_FOCUSED_PASS
→ one FINAL exact-SHA Runtime
→ clean promotion
```

No C1/C2 partial promotion occurs before the final Runtime PASS.
