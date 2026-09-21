# RA0.9 AI Review Mode Baseline Decision Record v1.0

## Decision

`RA_AI_REVIEW_MODE_ACCEPTED`

Final package status: `ACCEPTED_CURRENT_BASELINE`

The accepted UI layer and frozen core are intentionally represented by two independent governance states:

- Core: `RA_BASIC_FUNCTION_FROZEN`
- UI: `RA_AI_REVIEW_MODE_ACCEPTED`

## Inputs

- Frozen core parent baseline: `RA0_9_Frozen_Toolkit_Baseline_v1.2.zip`
- Parent baseline SHA-256: `72beebf6bcd0d15c7a82ce17d77a78504cb830ba28a5846d9a6d76b3db2689f9`
- Accepted Candidate: `RA0_9_AI_Review_Mode_Visual_Verified_Candidate.zip`
- Candidate SHA-256: `ad52fb582ed3ae258c0cec36f4aa292d6d4e5fd74421c4a82be64b2861d6673e`
- Frozen main program SHA-256: `70e6ece15b38724a4a5515d6bb27631d6884595529ac3ef54b98c407185827fd`

No earlier Candidate or other RA package was substituted.

## Acceptance Gates

All required gates passed:

- Candidate ZIP CRC and clean extraction
- no nested ZIP, `__pycache__`, or `.pyc`
- Candidate state `PASS_VISUAL_VERIFIED_CANDIDATE`
- 99/99 v1.2 controlled files byte-identical before acceptance
- frozen main program identity
- Authoring, Compile, Save/Open, JSON Roundtrip, Deterministic Replay, iCAD Compatibility, Review Authority, and Primitive Coverage
- AI Review Mode, Task State, Action Hooks, Blocking Summary, Raw Boundary Evidence-only, and invalid-ID handling
- Chrome/Chromium real visual verification
- Accepted `PL-015` and Diagnostic `PL-036` provenance
- no placeholder, AI-generated image, fake case, or Reference-as-Runtime substitution

## Visual evidence

The evidence source was `RA0_9_RC4_Standard10_Review_and_Correction_Minimal_Package.zip`, SHA-256 `213cde7a0227ce0ef8b495182519f1a94ef2e7f3297192534acaab2987a3e334`, verified `9/9 PASS` in the Candidate process. Delivered assets are exact crops from authoritative Final Review Sheets and remain `TEST_ONLY_NON_AUTHORITATIVE`.

## Unmodified areas

No change was made to Schema, Compiler semantics, Runtime geometry, Save/Open, JSON Roundtrip, Deterministic Replay, Review Authority, Formal Compiler Gate, Primitive definitions, iCAD Recipe contract, Geometry Brain SKILL, Standard 10 geometry, AI Task State semantics, Action Hook semantics, or visual asset pixels.

Only current-package governance documents, compatibility verifier entry points, manifests, and acceptance reports were updated or added.

## Limitations

- Visual verification uses only one Accepted and one Diagnostic case.
- Test assets are not formal Authoring parents.
- Geometry Brain Engine is not complete because this UI was accepted.
- Measurement Request remains a non-persistent UI hook.

## Naming and continuation

This decision does not create RA1.0 and does not re-freeze the core. Later UI work must use this package or an accepted successor as its parent. Any core change requires a separately demonstrated `POTENTIAL_RA_TOOL_GAP` review.
