# RA Basic Function Freeze Report v1.0 — Frozen Baseline v1.2

## Result

`RA_BASIC_FUNCTION_FROZEN`

The RA basic-function toolkit is formally frozen. The authoritative decision is recorded in `RA0_9_BASELINE_DECISION_RECORD_v1.0.md`.

## Scope of v1.2 correction

The prior v1.1 package passed CRC, package manifest and the self-contained functional contract, but its governance documents contained contradictory labels: one file stated `RA_BASIC_FUNCTION_FROZEN`, while README, Current Baseline and Freeze Manifest retained the earlier `RA_BASIC_FUNCTION_FREEZE_CANDIDATE` state.

v1.2 corrects only governance and packaging metadata. It does not modify:

- RA main program
- Authoring Schema
- Compiler semantics
- Runtime geometry behavior
- Save/Open format
- JSON Roundtrip
- Deterministic Replay
- Review Authority
- Formal Compiler gates
- iCAD Recipe contract
- Primitive definitions
- Standard 10 geometry

## Verified identity

The RA main program remains:

- File: `Recipe_Authoring_Workbench_RA0_9_RC4.html`
- SHA-256: `70e6ece15b38724a4a5515d6bb27631d6884595529ac3ef54b98c407185827fd`

## Governance state

- Formal status: `RA_BASIC_FUNCTION_FROZEN`
- Formal release: `APPROVED_RA_BASIC_FUNCTION_FROZEN`
- RA1.0: not created
- Unfreeze policy: only a demonstrated general-purpose Tool Gap may trigger review

## Standard 10 separation

Accepted and diagnostic Standard 10 cases are not embedded in this toolkit package. They remain Geometry Brain benchmark assets and do not determine RA toolkit package identity.
