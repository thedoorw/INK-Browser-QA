# RA0.9 Baseline Decision Record v1.0

## Decision

Authoritative baseline state:

`RA_BASIC_FUNCTION_FROZEN`

Authoritative package:

`RA0_9_Frozen_Toolkit_Baseline_v1.2.zip`

## Basis

The RA basic-function loop has passed the self-contained functional contract covering authoring, compile, save/open, JSON roundtrip, deterministic replay, iCAD compatibility, Review Authority and primitive coverage. The v1.1 package also preserved the approved RA main program byte-for-byte.

The remaining contradiction was documentary: some files retained the earlier Candidate label after the project-level freeze decision had already been made. This record resolves that conflict and is the highest-authority status document within the package.

## Program identity

- Main program: `Recipe_Authoring_Workbench_RA0_9_RC4.html`
- SHA-256: `70e6ece15b38724a4a5515d6bb27631d6884595529ac3ef54b98c407185827fd`
- Core modification in v1.2: none

## Frozen boundary

The following remain frozen:

- Authoring Schema
- Compiler semantics
- Runtime geometry behavior
- Save/Open format
- JSON Roundtrip
- Deterministic Replay
- Review Authority
- Formal Compiler blocking rules
- iCAD Recipe contract
- Primitive definitions

UI-only work may proceed without unfreezing the core, provided it does not bypass or duplicate frozen authority logic.

## Unfreeze condition

RA may be reconsidered only when a reproducible general-purpose Tool Gap is demonstrated in Schema, Compiler, Runtime, Replay/Roundtrip, iCAD interface, Review Authority, primitive coverage or topology coverage. A single visual mismatch or benchmark failure is a Geometry Brain gap unless such a Tool Gap is proven.

## Supersession

This decision supersedes all `RA_BASIC_FUNCTION_FREEZE_CANDIDATE` labels in the v1.1 governance documents. Historical Candidate wording may appear only inside explicit historical context and has no authority over this baseline.
