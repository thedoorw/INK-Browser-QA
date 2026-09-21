# RA0.9 AI Review Mode Current Baseline v1.0

This is the current RA main program and technical baseline.

- Core status: `RA_BASIC_FUNCTION_FROZEN`
- UI status: `RA_AI_REVIEW_MODE_ACCEPTED`
- Package role: `CURRENT_RA_MAIN_AND_TECHNICAL_BASELINE`
- Final status: `ACCEPTED_CURRENT_BASELINE`

## Start

Open `RA0_9_AI_Review_Mode_Candidate.html` in Chrome or Edge for the accepted AI Review Mode interface.

`Recipe_Authoring_Workbench_RA0_9_RC4.html` is the byte-identical frozen Full Workbench core entry.

## Enter AI Review Mode

The accepted entry opens in AI Review Mode. The interface can also be controlled through:

```javascript
window.RA_AI_ACTIONS.enterReviewMode();
window.RA_AI_ACTIONS.exitReviewMode();
```

## Machine-readable Task State

Read the current serializable state with:

```javascript
window.RA_AI_TASK_STATE
window.RA_AI_ACTIONS.getTaskState()
```

State updates dispatch:

```text
ra:ai-task-state-changed
```

## Action Hooks

`window.RA_AI_ACTIONS` exposes Target and Candidate selection, Confirm, Reject, Mark Unresolved, Request Measurement, Evidence/Raw Boundary viewing, Previous/Next, and state retrieval.

These hooks delegate to existing RA behavior. They do not bypass Review Authority or the Formal Compiler Gate.

## Blocking and Evidence

Blocking Reason Summary derives from existing RA state. Raw Boundary is labeled `Evidence only · Not formal geometry` and is collapsed by default.

## Visual test assets

`visual_test_assets/` contains only:

- `PL-015` — Accepted
- `PL-036` — Diagnostic

All are `TEST_ONLY_NON_AUTHORITATIVE`. They are real Reference/Final Runtime crops for browser verification, not formal geometry, Authoring parents, or a bundled Standard 10 corpus. Overlay and Difference are computed live.

## Verification

From the extracted package root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -B verify_ra_ai_review_current_baseline.py --browser
```

To verify the ZIP CRC and extracted contents in one command:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -B verify_ra_ai_review_current_baseline.py /path/to/RA0_9_AI_Review_Mode_Current_Baseline_v1.0.zip --browser
```

The older `verify_*.py` filenames are compatibility aliases to this single main verifier.

Requirements: Python 3, Node.js, Chromium/Chrome, and the Python packages in `requirements-qa.txt`.

## Governance files

- `PACKAGE_SCOPE.md`
- `CURRENT_BASELINE.json`
- `RA0_9_AI_REVIEW_MODE_BASELINE_DECISION_RECORD_v1.0.md`
- `VERIFICATION_REPORT.md`
- `RA0_9_AI_Review_Mode_Current_Baseline_v1.0_VERIFICATION_REPORT.json`
- `VISUAL_ASSET_PROVENANCE.md`
- `SHA256_MANIFEST.json`

`PACKAGE_SHA256_MANIFEST.json` remains the v1.2 frozen-parent comparison manifest. `SHA256_MANIFEST.json` is the current-package manifest.

## Known limitations

See `KNOWN_LIMITATIONS.md`. This package is not RA1.0 and does not declare Geometry Brain or Standard 10 complete.
