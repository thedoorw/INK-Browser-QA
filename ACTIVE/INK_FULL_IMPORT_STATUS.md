# INK Full Import Status

STATUS: `PASS`

| Field | Value |
|---|---|
| SOURCE_SHA256 | `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d` |
| TOTAL_FILES | `1471` |
| TOTAL_BYTES | `215908955` |
| WORK_BRANCH | `work/full-original-import-v0.1` |
| LATEST_COMMIT | `SELF` — the branch-tip commit containing this report |
| MISSING_FILES | `0` |
| MUTATED_FILES | `0` |
| UNACCOUNTED_FILES | `0` |
| BOUNDARY_PENDING_COUNT | `94` |
| LARGE_EVIDENCE_STORAGE_METHOD | Dedicated import branch; `qa/validation/` isolated in a separate commit; no Git LFS |

## Category counts and bytes

| Category | Files | Bytes |
|---|---:|---:|
| PRODUCT | 173 | 1,964,465 |
| QA | 1,076 | 201,599,510 |
| RESEARCH | 89 | 11,148,870 |
| ENGINEERING | 71 | 673,758 |
| GOVERNANCE | 32 | 101,227 |
| BOUNDARY_PENDING | 25 | 24,609 |
| ARCHIVE_CANDIDATE | 5 | 396,516 |

## Accounting result

- Source ZIP identity: PASS
- ZIP integrity: PASS
- Source entries mapped: 1,471 / 1,471
- Destination path collisions: 0
- Missing destination files: 0
- Byte-size mismatches: 0
- SHA256 mismatches: 0
- Silent deletions: 0
- Unexpected imported source files: 0
- `main` mutation: 0 commits

## Disposition

`READY_FOR_REVIEW`

No promotion to `main` is authorized or performed.
