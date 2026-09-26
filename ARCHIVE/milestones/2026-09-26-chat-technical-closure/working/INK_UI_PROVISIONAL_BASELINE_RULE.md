# INK UI Provisional Baseline Rule

STATUS: `USER_AUTHORIZED / ACTIVE`

DATE: 2026-09-26

## 1. Purpose

Permit Photoshop-aligned UI development to start immediately after the Connector-005 DEV implementation handoff, without treating an unpromoted Connector branch as the final product baseline.

This rule separates:

```text
UI DEVELOPMENT START
from
UI FINAL BASELINE LOCK
```

## 2. Start gate

Provisional Photoshop-aligned UI development may start when:

```text
Connector-005
→ implementation complete
→ focused QA complete
→ DEV_CONNECTOR_005_IMPLEMENTATION_READY_FOR_MR_REVIEW
→ DEV_HANDOFF
```

The following are **not** prerequisites for provisional UI start:

```text
Connector-005 MR promotion
integrated exact-SHA Runtime PASS
CURRENT_CAPABILITY_BASELINE final refresh
Closure final promotion
```

Therefore:

```text
CONNECTOR_005_DEV_HANDOFF
= UI_PROVISIONAL_START_ALLOWED
```

## 3. Final baseline gate

The UI may not declare its final capability mapping or final closure until:

```text
MR accepts Connector-005 source/evidence
→ Runtime-stability + Connector branches reconciled
→ integrated exact-SHA Runtime accepted
→ clean promotion
→ CURRENT_CAPABILITY_BASELINE refreshed
```

Therefore:

```text
MR_PROMOTION + CAPABILITY_BASELINE_REFRESH
= UI_FINAL_BASELINE_MAY_LOCK
```

## 4. Provisional UI source-of-truth

Before final baseline lock, UI work must use this precedence:

```text
1. main / currently promoted product behavior
2. accepted Photoshop UI reference measurements / Adobe behavioral references
3. Connector-005 DEV handoff as PROVISIONAL capability evidence only
4. explicit MR notes for unresolved capability placement
```

An unpromoted Connector branch is **not** the authoritative product baseline.

UI may read it to understand likely future capability exposure, but must not copy its implementation assumptions into unrelated UI/product authority.

## 5. Allowed provisional UI work

The following may proceed before Connector-005 promotion:

```text
Photoshop-aligned shell geometry
top menu / contextual-bar layout
left toolbar placement / single-double column behavior
right panel dock structure
panel collapse / expand / resize / scrolling
canvas-first layout
fullscreen behavior
Navigator panel
History panel
Layers interaction layout
Properties panel layout
typography / brightness / spacing
responsive / desktop geometry
CSS / DOM structure
existing promoted commands and controls
visual measurement sheets
screenshot / CSS / DOM comparison QA
```

Existing promoted capability bindings may be reorganized as long as the underlying command authority and product behavior are not changed.

## 6. Provisional-only / do not lock

Before final baseline lock, the following must remain explicitly provisional:

```text
Connector-005 final Library/Search entry point
Connector-005 final menu location
Connector-005 final panel location
Connector-005 final command name exposed to humans
Connector-005 final icon / shortcut
final command-menu-tool-panel mapping
final capability matrix
final CURRENT_CAPABILITY_BASELINE
final UI feature-completeness declaration
final UI closure / promotion
```

UI may reserve a neutral placeholder slot for future capability exposure, but it must not invent product behavior or make the placeholder itself authoritative.

## 7. Capability-facing guardrail

During provisional UI development:

- do not add a UI command merely because it exists on an unpromoted branch;
- do not remove a promoted command because the Connector branch appears to supersede it;
- do not alter native mutation authority, History, Revision, Document schema, Renderer, or Connector semantics from the UI lane;
- do not duplicate `search_ink_library` behavior in UI code;
- do not create a second Library/Search data source;
- do not bind final Connector UI until MR publishes the refreshed capability baseline.

Where UI needs a future Connector surface, use a bounded adapter/placeholder boundary and record it in the UI handoff as:

```text
PROVISIONAL_CAPABILITY_BINDING
FINAL_BINDING_PENDING_MR_BASELINE
```

## 8. Reconciliation gate

After MR promotion and baseline refresh, UI DEV/UR must run a reconciliation pass:

```text
promoted capability baseline
vs
provisional UI implementation
```

Required checks:

```text
command inventory
menu inventory
tool inventory
panel inventory
Navigator / History behavior
Connector-005 Library/Search exposure
CHAT-visible vs human-visible capability mapping
keyboard shortcuts
hidden/collapsed accessibility
no duplicate authority
no orphan UI entry
no promoted capability omitted without explicit design decision
```

Only after this pass may provisional labels be removed.

## 9. Required status language

Before final baseline lock:

```text
PHOTOSHOP_UI_REBUILD = PROVISIONAL_ACTIVE
FINAL_UI_BASELINE = HOLD
UI_PROMOTION = PROHIBITED
```

After MR reconciliation/promotion + baseline refresh:

```text
FINAL_UI_BASELINE = LOCK_ALLOWED
UI_RECONCILIATION = REQUIRED
UI_PROMOTION = SUBJECT_TO_FINAL_UI_QA
```

## 10. Program sequence

```text
Runtime Stability DEV
→ Connector-005 DEV handoff
→ ┬→ MR review / Runtime reconciliation / promotion
  └→ provisional Photoshop UI development

MR promotion + CURRENT_CAPABILITY_BASELINE refresh
→ UI reconciliation
→ final Connector-005 UI binding
→ integrated-main UI Runtime / visual / interaction QA
→ UI closure
```
