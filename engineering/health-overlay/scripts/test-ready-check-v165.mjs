import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportFile = path.join(root, 'tests', 'browser-evidence-v1.6.5', 'browser-health-report-v1.6.5.json');

try {
  await access(reportFile);
} catch {
  console.error(JSON.stringify({ status: 'BLOCKED', reason: 'BROWSER_HEALTH_EVIDENCE_MISSING', reportFile }, null, 2));
  process.exit(2);
}

const report = JSON.parse(await readFile(reportFile, 'utf8'));
if (report.status === 'BLOCKED_BY_ENVIRONMENT') {
  console.error(JSON.stringify({ status: 'BLOCKED', reason: 'LOCAL_RUNTIME_BLOCKED_BY_ENVIRONMENT', reportFile, environment: report.environment || {} }, null, 2));
  process.exit(2);
}

const failedChecks = (report.checks || []).filter(item => !item.passed);
const valid = report.version === '1.6.5-RC' && report.status === 'PASS' && failedChecks.length === 0 && (report.pageExceptions || []).length === 0 && (report.criticalConsoleErrors || []).length === 0;
if (!valid) {
  console.error(JSON.stringify({ status: 'FAIL', reason: 'BROWSER_HEALTH_GATE_FAILED', reportFile, reportStatus: report.status, failedChecks, pageExceptions: report.pageExceptions || [], criticalConsoleErrors: report.criticalConsoleErrors || [] }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'PASS', version: report.version, reportFile, checks: report.checks.length }, null, 2));
