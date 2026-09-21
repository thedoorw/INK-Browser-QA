# RA0.9 ZIP Drop

Upload exactly one file here:

`RA0_9_AI_Review_Mode_Current_Baseline_v1.0.zip`

When the ZIP is committed to `main`, the self-hosted Windows import workflow will:

1. extract it into `reference/RA0_9_baseline/source/`;
2. preserve the ZIP's internal directory structure;
3. calculate ZIP SHA256, file count and extracted bytes;
4. write `reference/RA0_9_baseline/IMPORT_MANIFEST.md`;
5. remove the uploaded ZIP from Git after successful extraction;
6. commit the unpacked reference baseline back to `main`.

The Windows self-hosted runner must be online:

`C:\actions-runner-ink → .\run.cmd`

Do not upload multiple ZIP files at once.
