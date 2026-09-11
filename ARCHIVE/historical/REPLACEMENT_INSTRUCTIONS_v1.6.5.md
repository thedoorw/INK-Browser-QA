# INK v1.6.5 RC Replacement Instructions

Replace the previous candidate directory with the complete `INK_Core_Main_Program_v1.6.5_RC` directory. Do not mix individual runtime files with v1.6.4.

Run:

```bash
npm ci
npm run build
npm run ink:doctor
npm run test:v1.6.5
```

Document Format remains 4 and Recipe Schema remains 1.0. No migration is required.
