# INK-TECH-CLOSURE-001 — C2-C DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

BRANCH: `work/ink-tech-closure-001`

C2B_REVIEW: `MR_SOURCE_PASS`

C2B_REVIEWED_HEAD: `f44416b6a41af0235adeb01ed402408c005b4255`

RUNTIME_POLICY: `DEFERRED_TO_FINAL_CLOSURE_BATCH`

## Mission

Close the accepted Component Definition / Instance / Override CHAT exposure debt using only the existing `document/components.js` authority.

This is bounded connector exposure. It is not a Component Variant system, token system, nested-component engine or new component store.

## Target bounded use_ink operations

Add exactly:

```text
component.register.v1
component.instance.create.v1
component.override.set.v1
component.override.reset.v1
component.instance.detach.v1
component.definition.duplicate.v1
component.reference.repair.v1
```

Expected vocabulary:

```text
C2-B accepted total = 27
C2-C additions = 7
expected final Closure bounded use_ink total = 34
```

No other operation family is authorized.

## Native authorities

### component.register.v1

Reuse:

`document/components.js:registerComponentDefinition`

Target:
- exactly one current structural container accepted by native authority;
- Group or Frame according to existing `isStructuralContainer` rules.

Arguments:

`name`

Native validation remains authoritative, including rejection of embedded/nested instances.

The source geometry remains in place.

### component.instance.create.v1

Reuse:

`createComponentInstance`

Zero object targets.

Arguments:

```text
definitionId
pageId
layerId
parentId?   // current structural parent destination only
matrix?     // existing 6-number affine matrix; identity when omitted
```

Do not invent auto-placement, responsive layout or instance-owned children.

### component.override.set.v1

Reuse:

`setComponentOverride`

Target:
- exactly one Component Instance.

Arguments:

```text
sourceNodeId
opacity 0..1
```

Only the currently supported opacity override is exposed.

No fill/stroke/text/property expansion.

### component.override.reset.v1

Reuse:

`setComponentOverride(app, instanceId, sourceNodeId, null)`

Target one Component Instance.

Arguments:

`sourceNodeId`

### component.instance.detach.v1

Reuse:

`detachComponentInstance`

Target one Component Instance.

The native authority resolves the instance, remaps geometry IDs and replaces the instance with ordinary geometry under one History-backed transaction.

Return the new ordinary geometry stable ref.

Do not duplicate detach logic.

### component.definition.duplicate.v1

Reuse:

`duplicateComponentDefinition`

Zero object targets.

Arguments:

```text
definitionId
name?   // native default when omitted
```

The native authority duplicates both source geometry and definition identity under one transaction.

Return the new definition id and duplicated source-root ref when resolvable.

### component.reference.repair.v1

Reuse:

`repairComponentReference`

Target one Component Instance.

Arguments:

`definitionId`

No automatic repair. This remains explicit user/CHAT-approved repair only.

## History boundary

Every native component command already owns an authoritative History-backed `transaction(...)`.

Therefore:

```text
DO NOT wrap component native commands in another history.pushScoped
```

The bounded edit controller may call them after proposal/approval and report their History receipt.

## Zero-target rule

Only:

```text
component.instance.create.v1
component.definition.duplicate.v1
```

use zero object targets.

They still require proposal → explicit approval → execute.

No mutation may occur at proposal time.

## Authorized product files

Primary only:

```text
product/source/src/editor/chat-bounded-edit.js
product/source/src/agent/capability-registry.js
```

Conditionally authorized only for export surface wiring if current exports require it:

```text
product/source/src/document/index.js
```

Frozen native authority:

`product/source/src/document/components.js`

If native authority modification appears necessary, STOP for MR.

No UI source is authorized.

## QA authorization

DEV may add/update:

```text
qa/ink-tech-closure-001-c2c.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
```

Do not modify:

`qa/runtime/run-ink-runtime-batch.mjs`

without separate MR authorization.

## Hard prohibitions

```text
Component Variant system = 0
Variables/Tokens = 0
nested component expansion = 0
new component store = 0
new definition resolver = 0
automatic reference repair = 0
new override properties beyond opacity = 0
Document schema change = 0
migration change = 0
History semantic change = 0
Revision semantic change = 0
Renderer / Canvas / WebGL change = 0
UI mutation = 0
service worker / cache = 0
external transport = 0
IMAGE = 0
FORMAT_VERSION change = 0
product version change = 0
Connector-005 = 0
main product promotion = 0
```

## Focused QA gate

At minimum verify:

1. exact 27-operation C2-B prefix remains unchanged;
2. exactly seven C2-C operations appended;
3. final bounded vocabulary = 34;
4. all seven capability schemas discoverable;
5. register routes only to `registerComponentDefinition`;
6. instance create routes only to `createComponentInstance`;
7. set/reset override route only to `setComponentOverride`;
8. only opacity override is exposed;
9. detach routes only to `detachComponentInstance`;
10. duplicate routes only to `duplicateComponentDefinition`;
11. repair routes only to `repairComponentReference`;
12. component native commands are not nested inside new `history.pushScoped`;
13. zero-target instance-create/definition-duplicate are proposal-neutral before approval;
14. detach returns the new ordinary-geometry ref;
15. duplicate returns new definition identity and source-root evidence;
16. no Component Variants / Variables / Tokens are introduced;
17. native `components.js` blob remains unchanged;
18. C1/C2-A/C2-B operation prefix remains exact;
19. `export_ink_asset` remains unchanged;
20. no eval / Function / arbitrary JS / direct Document JSON replacement;
21. FORMAT_VERSION = 4;
22. central Runtime runner unchanged;
23. final-batch browser proof includes C2-C;
24. source does not claim Windows Runtime PASS.

Executable focused QA should be authored. If not executable in the current tool environment, record that explicitly.

## Runtime policy

```text
FULL_WINDOWS_RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
```

If a high-risk exception is encountered, STOP and report.

## Required checkpoint

Create:

`working/INK_TECH_CLOSURE_001_C2C_CHECKPOINT.md`

Required sections:

```text
WHY
NATIVE_AUTHORITY
WHAT_CHANGED
WHAT_DID_NOT_CHANGE
FOCUSED_QA
RESULT
REMAINS
NEXT
```

Successful result:

```text
RESULT = C2C_SOURCE_FOCUSED_PASS
RUNTIME = DEFERRED_TO_FINAL_CLOSURE_BATCH
NEXT = MR_SOURCE_REVIEW / FINAL_RUNTIME_PREP
DEV_HANDOFF → STOP
```

Do not begin Runtime independently.
