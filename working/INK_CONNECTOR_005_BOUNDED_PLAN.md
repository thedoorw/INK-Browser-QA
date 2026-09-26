# INK Connector-005 — Bounded Creative Library Search Plan

STATUS: `DEV_AUTHORIZED / QUEUED_AFTER_RUNTIME_STABILITY_HANDOFF`

DATE: 2026-09-26

## 1. Program order

User-authorized program order:

```text
INK-RUNTIME-HARNESS-STABILITY-001
→ DEV handoff with PASS / FAIL / INCONCLUSIVE evidence
→ Connector-005 Creative Library Search implementation + focused QA
→ MR reconcile Runtime + Connector branches
→ integrated exact-SHA Runtime / final acceptance
→ clean promotion
→ update CURRENT_CAPABILITY_BASELINE
→ Photoshop-aligned final UI rebuild
```

Connector-005 implementation no longer waits for Closure/Runtime clean promotion.

The final UI rebuild still does not start until Connector-005 is reviewed, reconciled, promoted, and the capability baseline is refreshed.

Implementation branch:

`work/ink-connector-005`

Implementation baseline:

`54301b0916a04d0a1c611df4db540481baa12300`

DEV Workpack:

`working/INK_CONNECTOR_005_DEV_WORKPACK.md`

## 2. Purpose

Connector-005 closes one narrow capability gap:

```text
CHAT query
→ search existing INK reusable assets
→ return stable refs + type + metadata
→ inspect selected result
→ reuse / apply through existing native authority
→ provenance / History / Revision where mutation occurs
```

The goal is not to create a new library subsystem. The goal is to let CHAT discover and reuse reusable structures that already exist in INK, through bounded, inspectable references.

## 3. Searchable reusable asset families

Initial bounded search surface:

```text
components
materials
recipes
parametric structures
reference-derived structures
```

The data model may reserve extensible type identifiers for:

```text
future tokens
future styles
```

This reservation is schema-forward compatibility only. It does not authorize implementation of a Variables/Tokens system or Styles system.

## 4. Required read path

Connector-005 must support:

```text
query reusable assets
→ deterministic/bounded result set
→ stable asset ref
→ asset type
→ display name/label where available
→ bounded metadata
→ provenance/source metadata where available
→ inspect one selected result
```

Search must not mutate Document, History, Revision, library state, Creative Memory, Research state, modifiedAt, selection, or workspace state.

## 5. Required reuse path

Reuse/apply must route through existing native authority for the selected asset type.

No second asset engine, Component engine, Material engine, Recipe engine, Repeat engine, or reference-decomposition engine may be created.

Where reuse mutates the current Document:

```text
explicit proposal
→ explicit approval
→ existing native mutation authority
→ History receipt
→ Revision/provenance behavior according to existing accepted contract
```

Where reuse is read-only, no History/Revision mutation is allowed.

Connector-005 must report truthfully when a searchable type has no currently accepted user-governed mutation route; it must not invent one merely to claim reuse support.

## 6. Stable reference contract

Returned refs must be:

- stable enough for CHAT inspect/reuse within the accepted document/session/library scope;
- type-disambiguated;
- non-eval and non-executable;
- resolvable through bounded native lookup;
- invalidated explicitly when the underlying reusable asset no longer exists.

No opaque arbitrary code payload may be stored in or executed from the ref.

## 7. Explicit non-goals

Do not expand this Work Order into:

```text
full Library Manager UI
cloud asset library
AI auto-classification/tagging
new remote search service
complete Variables / Tokens system
complete Styles system
new Component Variant system
general design-system manager
CRDT / multiplayer library state
automatic Creative Memory writes
automatic Research fetch/scrape
autonomous asset application
```

UI work is limited to any minimum technical surface strictly required for Runtime proof. Final user-facing Library/menu/panel placement belongs to the later Photoshop-aligned UI rebuild.

## 8. Capability-baseline rule

Closure/Runtime may remain under a separate harness-stability review while Connector-005 implementation proceeds.

The baseline handed to UR is not final until MR has reconciled both lanes and Connector-005 is closed.

After Connector-005 + Runtime reconciliation:

```text
re-audit installed CHAT capabilities
re-audit reusable asset search surface
re-audit reusable asset mutation paths
re-audit read-only vs mutating operations
re-audit History / Revision / provenance requirements
→ update CURRENT_CAPABILITY_BASELINE
→ freeze UI-authoritative baseline
→ hand to UR
```

## 9. Acceptance targets

### DEV implementation handoff

DEV Connector work is complete when:

```text
bounded search implemented
stable typed refs implemented
inspect selected result implemented
reuse route classified through existing native authority
read-only search/inspect proven mutation-neutral
mutating reuse path proven user-governed where currently supported
focused QA PASS
DEV checkpoint / handoff complete
```

A shared Runtime-harness FAIL/INCONCLUSIVE/DEFERRED result does not block this DEV handoff.

### Final MR closure

Connector-005 is finally closed only when:

```text
DEV implementation accepted
Runtime-harness and Connector branches reconciled
integrated exact-SHA Runtime accepted
clean promotion to current main
capability baseline refreshed
```

## 10. Current gate

```text
CURRENT_DEV_1 = INK-RUNTIME-HARNESS-STABILITY-001
CURRENT_DEV_2 = Connector-005 queued immediately after DEV Runtime handoff

CONNECTOR_005 = DEV_AUTHORIZED
IMPLEMENTATION_AUTHORIZATION = YES
RUNTIME_CLEAN_PASS_PREREQUISITE = REMOVED

MR_FINAL_ACCEPTANCE = REQUIRED
PROMOTION = HOLD
PHOTOSHOP_UI_REBUILD = HOLD
```
