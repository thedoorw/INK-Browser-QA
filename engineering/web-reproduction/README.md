# INK Web Reproduction Tools

Executable support for `INK-WEB-REPRODUCTION-PRODUCTION-LINE-001`.

Current implemented slice:

```text
A. Site Census
B. deterministic page-family grouping
C. multi-viewport reference capture / measurement
```

## CASE-001

Reference:

`https://www.theminimalists.com/`

Config:

`config/case-001.json`

## Run

```bash
npm install
npx playwright install chromium

npm run census -- --config config/case-001.json
npm run classify -- --config config/case-001.json
npm run capture -- --config config/case-001.json
```

Artifacts are written under `artifacts/` and are intentionally gitignored.

Reference screenshots may contain third-party website content and are QA evidence only. Do not deploy or commit them as portfolio assets.

## Current dependencies

- Crawlee 3.18.1
- Playwright 1.63.0

The production-line research authority is:

`research/INK_WEB_REPRODUCTION_PRODUCTION_LINE_v0.1.md`

CASE-001 authority is:

`working/INK_WEB_REPRODUCTION_CASE_001_THE_MINIMALISTS_WORK_ORDER_v0.1.md`
