import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const reportRoot = resolve(root, 'reports/hand-drawing-v1.4.0');
const read = async path => readFile(resolve(root, path), 'utf8');
const json = async path => JSON.parse(await read(path));
const writeJSON = async (name, value) => writeFile(resolve(reportRoot, name), `${JSON.stringify(value, null, 2)}\n`);
const stripAnsi = text => text.replace(/\x1b\[[0-9;]*m/g, '');

await mkdir(reportRoot, { recursive: true });
const unitLog = stripAnsi(await read('tests/test-results-v1.4.0/unit-tap.log'));
const unitTests = unitLog.split('\n').filter(line => line.startsWith('✔ ') || line.startsWith('✖ ')).map(line => ({
  name: line.replace(/^[✔✖] /, '').replace(/ \([^)]*ms\)$/, ''),
  passed: line.startsWith('✔ ')
}));
const unitSummary = Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(key => [key, Number(unitLog.match(new RegExp(`ℹ ${key} (\\d+)`))?.[1] || 0)]));
const browser = await json('tests/browser-evidence-v1.4.0/browser-smoke-report-v1.4.0.json');
const performance = await json('tests/browser-evidence-v1.4.0/browser-interactive-performance-report.json');
const ready = await json('tests/test-ready-report-v1.4.0.json');
const delivery = await json('reports/hand-drawing-v1.4.0/delivery-summary.json');
const exportOperation = performance.operations.find(item => item.name === 'Export PNG');
const automated = {
  total: unitSummary.tests + browser.checks.length + ready.checksTotal,
  passed: unitSummary.pass + browser.checks.filter(item => item.passed).length + ready.checksPassed,
  failed: unitSummary.fail + browser.checks.filter(item => !item.passed).length + (ready.checksTotal - ready.checksPassed),
  skipped: unitSummary.skipped,
  aborted: unitSummary.cancelled
};
const notExecuted = [
  { item: 'HP x360 + MPP physical stylus run', reason: 'USER VALIDATION REQUIRED' },
  { item: 'Subjective stylus feel scoring', reason: 'USER VALIDATION REQUIRED' },
  { item: 'Professional artwork visual scoring and final approval', reason: 'USER VALIDATION REQUIRED' },
  { item: 'Krita oil/impasto vendor execution', reason: 'EXTERNAL EXECUTION REQUIRED' },
  { item: '30-minute wall-clock human drawing', reason: 'USER VALIDATION REQUIRED; accelerated actual-render simulation completed' }
];
const observedFailures = [{
  id: 'PERF-PNG-EXPORT-MAIN-THREAD-BLOCK',
  status: 'OPEN',
  reproducible: true,
  elapsedMs: exportOperation?.elapsedMs,
  longestEventLoopBlockMs: exportOperation?.longestEventLoopBlockMs,
  crash: exportOperation?.crash,
  recoveryStatus: exportOperation?.recoveryStatus,
  reason: 'Chromium CPU Canvas PNG encoding blocks the main event loop for more than one second even through toBlob.',
  proposedNextRepair: 'Move export composition and encoding to an OffscreenCanvas worker or stream tiled export.'
}];

const regression = {
  format: 'INK-V140-COMPLETE-REGRESSION-REPORT', schemaVersion: 1, version: '1.4.0', decision: 'VALIDATION REQUIRED',
  baseline: { version: '1.3.0', unit: '300/300', browser: '14/14', testReady: '32/32' },
  automated, qualityGateFailures: observedFailures.length, observedFailures, notExecuted,
  suites: {
    unit: { total: unitSummary.tests, passed: unitSummary.pass, failed: unitSummary.fail, skipped: unitSummary.skipped, aborted: unitSummary.cancelled, tests: unitTests },
    browser: { total: browser.checks.length, passed: browser.checks.filter(item => item.passed).length, failed: browser.checks.filter(item => !item.passed).length, checks: browser.checks },
    testReady: { total: ready.checksTotal, passed: ready.checksPassed, failed: ready.checksTotal - ready.checksPassed, checks: ready.checks }
  },
  coverage: ['v1.2 Universal Import','v1.2 Reference Runner','v1.3 Stroke Model','v1.3 Brush Engine','v1.3 Session','Vector Core','Raster Core','Recipe','Replay','Rollback','.ink Migration','Browser UI']
};
await writeJSON('complete-regression-report.json', regression);
await writeJSON('regression-plan.json', { format: 'INK-V140-REGRESSION-MATRIX', schemaVersion: 1, suites: regression.coverage, results: automated, report: 'complete-regression-report.json' });
await writeJSON('known-limitations.json', { decision: 'VALIDATION REQUIRED', limitations: [
  'Watercolor and oil-like models are APPROXIMATED visual models, not physical equivalence.',
  'HP x360 and MPP measurements require the user device; unavailable values remain NOT MEASURED/NOT AVAILABLE/BROWSER RESTRICTED.',
  'Krita oil/impasto vendor execution was not performed and remains EXTERNAL EXECUTION REQUIRED.',
  'External workflows without trustworthy coordinates remain MANUAL STEP REQUIRED, REFERENCE ONLY, or REJECTED.',
  `PNG export completed and recovered, but blocked the measured Chromium event loop for ${Math.round(exportOperation?.longestEventLoopBlockMs || 0)} ms.`
] });
await writeJSON('performance-repair-report.json', {
  format: 'INK-PERFORMANCE-REPAIR-REPORT', schemaVersion: 2,
  implemented: ['viewport tile rendering','dirty-region compatible rendering','chunked replay','stroke simplification','texture cache reuse','snapshot plus delta history policy','resource pooling hooks'],
  preserved: ['stroke editability','replay determinism','brush identity','layer structure','visual stability'],
  actualBrowserEvidence: {
    cases: performance.cases.map(item => ({ strokes: item.strokes, renderedDabs: item.renderedDabs, viewportOnly: item.viewportOnly, p95FrameTimeMs: item.p95FrameTimeMs, p99FrameTimeMs: item.p99FrameTimeMs, freeze: item.freeze, crash: item.crash, recoveryStatus: item.recoveryStatus })),
    operations: performance.operations.map(item => ({ name: item.name, elapsedMs: item.elapsedMs, longestEventLoopBlockMs: item.longestEventLoopBlockMs, freeze: item.freeze, crash: item.crash, recoveryStatus: item.recoveryStatus })),
    thirtyMinute: performance.thirtyMinuteDrawingSimulation
  },
  unresolved: observedFailures,
  notClaimed: ['device GPU results','30-minute wall-clock human drawing','HP x360 measurements']
});

const md = `# INK v1.4.0 Complete Regression Report

Decision: **VALIDATION REQUIRED**

- Automated checks: ${automated.passed}/${automated.total}
- Failed: ${automated.failed}
- Skipped: ${automated.skipped}
- Aborted: ${automated.aborted}
- Unit: ${unitSummary.pass}/${unitSummary.tests}
- Chromium: ${browser.checks.filter(item => item.passed).length}/${browser.checks.length}
- Test-Ready: ${ready.checksPassed}/${ready.checksTotal}

## Open quality-gate failure

PNG export completed and recovered, but took ${Math.round(exportOperation?.elapsedMs || 0)} ms and blocked the measured event loop for ${Math.round(exportOperation?.longestEventLoopBlockMs || 0)} ms. This is not reported as a pass on interaction quality.

## Not executed

${notExecuted.map(item => `- ${item.item}: ${item.reason}`).join('\n')}

The machine-readable report includes all ${unitTests.length} unit-test names, all browser checks, all Test-Ready checks, and every failure/non-execution reason.
`;
await writeFile(resolve(reportRoot, 'REGRESSION_REPORT_v1.4.0.md'), md);

await writeFile(resolve(reportRoot, 'USER_VALIDATION_INSTRUCTIONS.md'), `# HP x360 + MPP User Validation

Status: **USER VALIDATION REQUIRED**

1. Open \`index-standalone.html\` and select Device Validation Mode.
2. Enter the device name, then complete every named test stroke. No developer tools are required.
3. Save the Device Report and Calibration Profile.
4. Draw a line-art flower or a representative flower section.
5. Rate start, ending, pressure, latency, jitter, corners, long-stroke stability, fast tracking, tilt, erasing, palm rejection, and overall feel.
6. Open the professional artwork QA panel and score all three v1.3/v1.4 side-by-side works. Do not mark APPROVED until reviewed by the user.
7. Export the Device Report, Calibration Profile, and manual QA package.

Unavailable measurements must remain NOT AVAILABLE, NOT MEASURED, DEVICE UNSUPPORTED, or BROWSER RESTRICTED.
`);

await writeFile(resolve(reportRoot, 'REJECTED_MANUAL_EXTERNAL_LIST.md'), `# Rejected, Manual, and External Execution List

- HDW-003: REJECTED — unit test contains no artwork coordinates.
- HDW-005: MANUAL STEP REQUIRED / REFERENCE ONLY — runtime random output was not captured.
- REF-OIL-01: MANUAL STEP REQUIRED — tutorial structure is usable, original pointer events are unavailable.
- REF-OIL-02: EXTERNAL EXECUTION REQUIRED — Krita vendor execution was not available.
- HP x360 + MPP validation: USER VALIDATION REQUIRED.
- Professional visual scoring and final approval: USER VALIDATION REQUIRED.
`);

await writeFile(resolve(reportRoot, 'NEXT_STAGE_RECOMMENDATIONS.md'), `# Next Stage Recommendations

1. Complete HP x360 + MPP validation and tune the saved pressure profile from measured input.
2. Move PNG composition and encoding to an OffscreenCanvas worker or tiled streaming export.
3. Execute the two Krita references in the declared application and import the resulting evidence without synthesizing pointer data.
4. Conduct independent professional visual review of line, watercolor, and oil-like benchmarks before APPROVED.
`);

await writeFile(resolve(reportRoot, 'DELIVERY_MANIFEST_v1.4.0.md'), `# INK v1.4.0 Delivery Manifest

Decision: **VALIDATION REQUIRED**

1. Main program: project root, \`index-standalone.html\`
2. Corrected benchmarks: \`benchmarks-hand-drawing-v1.4.0/\`
3. Side-by-side evidence: one PNG in each benchmark folder
4. External reference packages: \`external-reference-packages-v1.4.0/\`
5. Workflow conversion reports: inside each reference package
6. Stroke/layer/visual difference reports: benchmark and reference-package folders
7. Device Validation Mode: main UI and \`device-validation.html\`
8. Calibration Profile system: main UI and embedded .ink support
9. HP x360 test page: \`device-validation.html\`
10. Browser Interactive Benchmark: \`tests/browser-evidence-v1.4.0/\`
11. Performance repair report: \`performance-repair-report.json\`
12. Capability maturity map: \`capability-maturity-map.json\`
13. Gap frequency ranking: \`gap-frequency-ranking.json\`
14. Complete regression report: \`complete-regression-report.json\`
15. Known limitations: \`known-limitations.json\`
16. Rejected/manual/external list: \`REJECTED_MANUAL_EXTERNAL_LIST.md\`
17. User validation package: \`user-validation-pack.json\` and \`USER_VALIDATION_INSTRUCTIONS.md\`
18. Next-stage recommendations: \`NEXT_STAGE_RECOMMENDATIONS.md\`

Three corrected artworks, six references, four replayable external references, deterministic replay, local replay, rollback, and browser rendering evidence are present. Final artwork and physical stylus approval remain with the user.
`);

console.log(JSON.stringify({ automated, unitTests: unitTests.length, browserChecks: browser.checks.length, testReady: ready.checksTotal, decision: delivery.decision, qualityGateFailures: observedFailures.length }, null, 2));
