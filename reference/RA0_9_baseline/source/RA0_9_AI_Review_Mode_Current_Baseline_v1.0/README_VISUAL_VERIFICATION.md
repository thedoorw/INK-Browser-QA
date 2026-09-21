# AI Review Mode Visual Verification

The accepted current baseline contains real visual assets for `PL-015` and `PL-036`, classified `TEST_ONLY_NON_AUTHORITATIVE`.

Run the single current-baseline verifier:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -B verify_ra_ai_review_current_baseline.py --browser
```

See `VISUAL_ASSET_PROVENANCE.md` and `qa/evidence/ai_review_mode/visual_browser/BROWSER_VISUAL_TEST_REPORT.json`.
