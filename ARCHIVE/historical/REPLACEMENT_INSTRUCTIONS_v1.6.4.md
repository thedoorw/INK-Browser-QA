# INK v1.6.4 RC Replacement Instructions

This package is a complete candidate replacement for INK v1.6.3 RC. Do not merge individual Runtime files into older installations.

1. Preserve the v1.6.3 ZIP as rollback evidence.
2. Extract this ZIP into a clean directory.
3. Run `npm ci`.
4. Run `npm run build` and `npm run ink:doctor`.
5. Run `npm run test:v1.6.4`.

Document Format remains 4 and Recipe Schema remains 1.0. No migration is required.
