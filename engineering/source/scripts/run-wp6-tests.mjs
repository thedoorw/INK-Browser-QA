import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'tests', 'wp6', 'flora-wp6.test.mjs');
const patterns = [
  'Composition Plan', 'Whole-page compiler', 'Complete A4 Hero execution', 'background compound',
  'Crown, petal, center', 'same A4 Hero Plan', 'roundtrip preserve all', 'mid-stage Whole-page'
];
let passed = 0;
for (const pattern of patterns) {
  const result = spawnSync(process.execPath, ['--test', `--test-name-pattern=${pattern}`, file], { cwd: root, stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`WP6 test failed: ${pattern}`);
    process.exit(result.status || 1);
  }
  passed += 1;
  console.log(`ok ${passed}/${patterns.length} - ${pattern}`);
}
console.log(`WP6 automated scenarios: ${passed}/${patterns.length} PASS`);
