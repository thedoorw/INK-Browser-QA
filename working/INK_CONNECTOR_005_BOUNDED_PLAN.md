# INK Connector-005 — Bounded Creative Library Search Plan

STATUS: `PLANNED / NOT_YET_AUTHORIZED`

DATE: 2026-09-26

## 1. Program order

```text
INK-TECH-CLOSURE-001
→ Connector-005 Creative Library Search
→ update CURRENT_CAPABILITY_BASELINE
→ Photoshop-aligned final UI rebuild
```

Connector-005 starts only after Closure 001 reaches clean promotion and technical closure.

The final UI rebuild does not start from the Closure-only baseline. UR receives the baseline refreshed after Connector-005.

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

Search must not mutate Document, History, Revision, library state, Creative Memory, or Research state.

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

Closure 001 may finish with its own technical closure record, but the baseline handed to UR is not final until Connector-005 is closed.

After Connector-005:

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

## 9. Acceptance target

Connector-005 is complete only when all of the following are true:

```text
bounded search implemented
stable typed refs implemented
inspect selected result implemented
reuse/apply routes through existing native authority
read-only search proven mutation-neutral
mutating reuse proven user-governed
History / Revision / provenance contracts verified where applicable
focused QA PASS
exact-SHA Runtime PASS
clean promotion to current main
capability baseline refreshed
```

## 10. Current gate

```text
CURRENT = INK-TECH-CLOSURE-001
CONNECTOR_005 = PLANNED / HOLD
IMPLEMENTATION_AUTHORIZATION = NO
NEXT_AUTHORITY = MR after Closure 001 clean promotion
```
