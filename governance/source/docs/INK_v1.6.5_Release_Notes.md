# INK v1.6.5 RC Release Notes

This compatible maintenance release fixes HERO-DEP-001 without changing the document or Recipe schema.

Modified runtime modules:

- `src/recompute/change-domain.js`
- `src/recompute/dependency-graph.js`
- `src/recompute/affected-scope.js`
- `src/recompute/local-recompute.js`
- `src/recompute/recompute-validator.js`
- `src/recompute/recompute-report.js`

Added validation:

- DS-01 through DS-09
- HERO-WC-01 domain-aware Round 2 and Round 3 regression
- Dependency reason trace evidence

No new Brush Runtime, raster simulation, UI or Recipe system was introduced.
