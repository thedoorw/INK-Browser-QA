# RA0.9 AI Review Mode Current Baseline v1.0

Core status: `RA_BASIC_FUNCTION_FROZEN`  
UI status: `RA_AI_REVIEW_MODE_ACCEPTED`  
Package role: `CURRENT_RA_MAIN_AND_TECHNICAL_BASELINE`

This package is the accepted daily RA main program and technical baseline for RA0.9.

## Frozen core boundary

The Authoring Schema, Compiler semantics, Runtime geometry behavior, Save/Open format, JSON Roundtrip, Deterministic Replay, Review Authority, Formal Compiler Gate, Primitive definitions, and iCAD Recipe contract remain frozen.

Frozen main program:

- `Recipe_Authoring_Workbench_RA0_9_RC4.html`
- SHA-256: `70e6ece15b38724a4a5515d6bb27631d6884595529ac3ef54b98c407185827fd`

## Accepted UI layer

The accepted interface layer consists of AI Review Mode, `window.RA_AI_TASK_STATE`, `window.RA_AI_ACTIONS`, Blocking Reason Summary, Evidence-only Raw Boundary presentation, and the verified Reference/Runtime comparison workflow.

## Visual test assets

Only `PL-015` (Accepted) and `PL-036` (Diagnostic) are included. They are classified as `TEST_ONLY_NON_AUTHORITATIVE` and cannot change Authoring, Review Authority, Formal state, or Standard 10 geometry decisions.

This package is not RA1.0, does not re-freeze the core, and does not declare Geometry Brain or Standard 10 complete.
