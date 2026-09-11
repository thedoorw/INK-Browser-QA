# INK Original Import Verification

STATUS: `PASS`

## Source package identity

| Field | Verified value |
|---|---|
| Filename | `INK_v1.6.5_RC_MAIN.zip` |
| Supplied upload name | `INK_v1.6.5_RC_MAIN(2).zip` |
| SHA256 | `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d` |
| ZIP bytes | `60406367` |
| File entries excluding directories | `1471` |
| Extracted file bytes | `215908955` |
| ZIP integrity test | `PASS` |
| Import date | `2026-09-11` |
| Work branch | `work/full-original-import-v0.1` |
| Source package identity | `INK-ORIGINAL-IMPORT-1.6.5-RC-001` |

The authoritative ZIP was verified before repository mutation. A second supplied copy, `INK_v1.6.5_RC_MAIN(1).zip`, independently produced the same SHA256 and byte size. Only the `(2)` copy was used for extraction.

## Classification summary

| Classification | Files | Bytes | Destination area |
|---|---:|---:|---|
| PRODUCT | 173 | 1,964,465 | `product/source/` |
| QA | 1,076 | 201,599,510 | `qa/core/`, `qa/validation/` |
| RESEARCH | 89 | 11,148,870 | `research/source/` |
| ENGINEERING | 71 | 673,758 | `engineering/source/` |
| GOVERNANCE | 32 | 101,227 | `governance/source/` |
| BOUNDARY_PENDING | 25 | 24,609 | preserved under `product/source/` |
| ARCHIVE_CANDIDATE | 5 | 396,516 | `ARCHIVE/historical/` |
| **Total** | **1,471** | **215,908,955** | |

The prior reference counts were PRODUCT 169 and ENGINEERING 75. Reanalysis produced PRODUCT 173 and ENGINEERING 71. Browser-imported modules, including `src/release/` and `src/assets/`, remain with product source; root build metadata (`package.json`, `package-lock.json`, `tsconfig.json`) is engineering. The source files themselves were not modified.

## Preservation and storage

- All 1,471 source files have exactly one inventory destination.
- Every copied file was checked by byte size and SHA256 against the extracted source.
- The raw ZIP is represented by immutable identity evidence and was not added as a product artifact.
- Validation evidence is isolated in `qa/validation/` and committed separately on the dedicated import branch.
- Largest file: `Validation/v1.6.5/HERO-Dependency-Scope/HERO-WC-01/HERO_WC_01_Result.json`, 50,471,344 bytes.
- No individual source file exceeds GitHub's 100 MB hard limit; Git LFS was not introduced.

The exhaustive mapping and per-file hashes are in `governance/INK_FILE_INVENTORY_v0.1.csv`.
