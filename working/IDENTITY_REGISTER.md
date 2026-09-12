# INK v0.1 Live Identity Register

STATUS: `M5 LIVE IDENTITY CLEANUP`

Branch: `working/INK-v0.1-structure-optionalization`

Policy: `governance/INK_Product_Identity_v0.1.md`

This register classifies literals in live `product/source` surfaces. Historical QA, Validation, research, archived reports, filenames, and source-lineage evidence were not globally rewritten.

## CURRENT_PRODUCT_IDENTITY — normalized

| Surface | Previous value | Current value | Decision |
|---|---|---|---|
| `index.html` static title | `INK v1.5.1 RC` | `INK v0.1 — Health` | current user-visible product identity |
| `index.html` menu/brand/status badges | `1.5.1` / `1.5.1 RC` / `v1.5.1 RC` | `0.1` / `v0.1` | current user-visible product identity |
| `index.html` Studio heading | `INK Core 1.5.1 RC` | `INK Core v0.1` | live product UI, not a schema |
| `index-standalone.html` equivalent surfaces | `1.5.1` / `1.5.1 RC` | `0.1` / `v0.1` | user-loadable compatibility launcher still belongs to current product |
| `window.INK_STUDIO.version` | `1.6.0` | `INK_VERSION` (`0.1`) | public live facade represented the active product |
| live `UniversalProgramImporter` construction | `inkVersion: '1.6.0'` | `inkVersion: INK_VERSION` | generated compatibility requirement must identify the current app |
| `window.INK_AI.version` | `1.6.0` | `INK_VERSION` (`0.1`) | public live facade represented the active product |
| `INK_TEST.addDemo()` visible text | `INK v0.8` | ``INK v${INK_VERSION}`` | live generated demo content must not display a stale product identity |

Runtime observability is recorded on the root document as `data-ink-runtime-version`, `data-ink-studio-version`, `data-ink-ai-version`, and `data-ink-format-version`; the Node-free Windows workflow asserts `0.1 / 0.1 / 0.1 / 4`.

## COMPONENT_PROTOCOL_VERSION — preserved and named

| Surface | Value | Decision |
|---|---:|---|
| `AI_LAYER_VERSION` | `1.6.0` | AI capability-manifest/command negotiation protocol; preserved |
| `CHAT_RUNTIME_VERSION` | `1.6.0` | chat request/response/envelope protocol; preserved |
| `INK_STUDIO.protocolVersion` | `1.6.0` | historical Studio component contract made explicit while facade `version` becomes product `0.1` |
| `INK_AI.protocolVersion` | `AI_LAYER_VERSION` (`1.6.0`) | protocol identity made explicit while facade `version` becomes product `0.1` |
| `UniversalProgramImporter` constructor defaults and `inkImporterVersion` | `1.5.0` | importer/conversion component compatibility protocol; preserved |
| Studio QA report | `1.5.0` | QA report/component version; preserved |
| built-in brush package id/filename | `v150` / `v1.5.0` | exported component asset identity; preserved |

## FILE / SCHEMA VERSION — preserved

- `FORMAT_VERSION = 4` is unchanged.
- Recipe asset/report `1.0`, recompute/dependency graph `1.2`, semantic/vector/asset report `1.0`, FLORA schema/profile/painting versions, and Recipe `recipeVersion: 1.6.2` remain their own file/schema/algorithm identities.
- AI operation versions and JSON schema filenames remain unchanged.

## HISTORICAL_EVIDENCE — preserved

- `paint-core.js` compatibility-origin comment (`INK v1.3`) remains source-lineage context.
- material validation state/path references to `v1.6.2` remain evidence references.
- all `qa/**`, `research/**`, `ARCHIVE/**`, historical engineering scripts/reports, and imported filenames retain their original identities.

## Runtime dependency identity follow-up

`service-worker.js` now precaches `src/capabilities/optional-capability-registry.js` because it became a mandatory Core import. This is dependency completeness, not a PWA redesign. `RELEASE_VERSION = '0.1'`, manifest identity, document `appVersion = '0.1'`, and `FORMAT_VERSION = 4` remain unchanged.

