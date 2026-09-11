# INK Product Identity v0.1

STATUS: `ACTIVE`

## Fixed product identity

Until INK is considered genuinely complete, the user-facing product version remains:

`INK v0.1`

The numeric identity is intentionally stable during development. Development progress is expressed only by a short stage suffix, for example:

- `INK v0.1 — Health`
- `INK v0.1 — Runtime`
- `INK v0.1 — Boundary`
- `INK v0.1 — Candidate`
- `INK v0.1 — Review`
- `INK v0.1 — Certified`

## Engineering mapping

- Runtime/product display version: `0.1`
- npm/SemVer package identity: `0.1.0`
- PWA/service-worker release identity: `0.1`
- Document `appVersion`: inherited from runtime `INK_VERSION`, therefore `0.1`

## Historical preservation rule

Historical identifiers such as `1.5.1`, `1.6.0`, `1.6.5-RC`, `v0.8.3`, and `v3.3.0-rc.2` remain unchanged wherever they are part of imported source history, QA evidence, validation records, archived reports, migration fixtures, or historical documentation.

They are source-history identities, not the current product version.

Do not perform source-wide search/replace across preserved evidence.

## Development-history rule

Use branch names, stage labels, commit SHAs, run IDs, dates, and evidence records to distinguish development states. Do not increment the public product version merely to represent another development iteration.

## Current stage

`INK v0.1 — Health`
