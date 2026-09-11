# INK Version Identity Register v0.1

STATUS: `OBSERVED / NOT NORMALIZED`

This register records version identifiers found in the authoritative source. It does not select, repair, or certify a product version.

| Identifier | Source location | Observed use |
|---|---|---|
| `INK_Core_Main_Program_v1.6.5_RC` | ZIP top-level directory | Source directory / package label |
| `1.6.5-rc.1` | `engineering/source/package.json` | npm package version |
| `1.6.5-RC` | `product/source/src/config.js` | Browser runtime `INK_VERSION` |
| `1.6.5` / `v1.6.5` | `governance/source/docs/INK_v1.6.5_Release_*.md`, `qa/validation/Validation/v1.6.5/` | Release documentation and validation generation |
| `1.5.1 RC` | `product/source/manifest.webmanifest` | PWA name and short name |
| `1.5.1` | `product/source/service-worker.js` | Service-worker cache/release version |
| `v0.8.3-p3` | `governance/source/docs/INK_MASTER_SPEC_v2.5.md` | Document-state / visual-history baseline |
| `v0.8.3` | `governance/source/docs/INK_MASTER_SPEC_v2.5.md` | Product version named by the Master Spec |
| `v3.3.0-rc.2` | `governance/source/docs/INK_MASTER_SPEC_v2.5.md` | Internal engineering source identity |
| `4` | `product/source/src/config.js`, `governance/source/docs/INK_MASTER_SPEC_v2.5.md` | INK document Format Version |
| `1.0` | `product/source/src/recipe/recipe-asset.js`, `product/source/src/recipe/recipe-validator.js`, `product/source/schemas/ink-recipe-v1.schema.json` | INK-RECIPE asset and schema version |
| `2` | `product/source/src/recipe/recipe-engine.js` | Recipe engine normalized `schemaVersion` default |
| `v2.5` | `governance/source/docs/INK_MASTER_SPEC_v2.5.md` | Master Spec document revision |

## Historical version families also present

The source preserves release, migration, tests, reports, fixtures, and evidence carrying historical identifiers including `v0.8.1`, `v0.8.2`, `v0.9.0`, `v1.0.0`, `v1.1.0`, `v1.2.0`, `v1.3.0`, `v1.4.0`, `v1.5.0`, `v1.5.1`, `v1.6.0`, `v1.6.1`, `v1.6.2`, `v1.6.3`, `v1.6.4`, and `v1.6.5`. These are retained as historical or QA identities and are not interpreted as the current certified baseline.

## Recorded risks

- npm package, runtime config, PWA manifest, service worker, Master Spec product identity, and internal engineering identity do not use one version value.
- Format Version 4 is a document-format identity, not a product release number.
- Recipe schema `1.0` and recipe-engine `schemaVersion: 2` appear on different recipe model surfaces; no normalization was attempted.
- No version identifier was changed in this import.
