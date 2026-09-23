import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument } from '../product/source/src/document/index.js';
import { createCreativeMemoryAdapter } from '../product/source/src/memory/creative-memory.js';
import { createResearchCreationBridgeAdapter } from '../product/source/src/research/research-creation-bridge.js';
import { createCreativeIntelligenceContextAdapter } from '../product/source/src/ai/creative-intelligence-context.js';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const workspace = read('../product/source/src/editor/creative-workspace.js');
const installAI = read('../product/source/src/ai/install-ai.js');
const shell = read('../product/source/web-shell.js');
const web = read('../product/source/index.html');
const portable = read('../product/source/index-standalone.html');

assert.equal(FORMAT_VERSION, 4, 'FORMAT_VERSION must remain 4');

for (const panel of ['properties','layers','history','reference','compose','chat','revision']) {
  assert.ok(shell.includes(`${panel}:`), `single-panel authority must retain ${panel}`);
}
assert.equal(shell.includes('workstation-capability-panel'), false, 'must not add a second panel category');

for (const action of ['grounded-context-refresh','creative-memory-refresh','research-context-refresh','revision-compare']) {
  assert.ok(workspace.includes(`data-workspace-action="${action}"`) || workspace.includes(`'${action}'`), `missing UI wiring: ${action}`);
}
for (const tool of ['get_grounded_creative_context','get_creative_memory_context','get_research_creation_context','compare_visual_subjects']) {
  assert.ok(workspace.includes(`callGroundedTool('${tool}'`), `UI must converge on existing grounded CHAT tool: ${tool}`);
}
assert.ok(workspace.includes('resolve_parametric_structure'), 'Compose must expose the existing parametric tool route');
assert.ok(workspace.includes('Document Bridge'), 'Properties/CHAT must expose document grounding');
assert.ok(workspace.includes('Semantic'), 'Properties/CHAT must expose semantic grounding');
assert.ok(workspace.includes('Provenance'), 'Revision/CHAT must expose provenance');

assert.ok(installAI.includes('createCreativeMemoryAdapter'));
assert.ok(installAI.includes('createResearchCreationBridgeAdapter'));
assert.ok(installAI.includes('createChatRuntime(layer, { creativeMemoryProvider, researchCreationProvider })'));
assert.equal(/write_creative_memory|fetch_research_source|scrape_research_source/.test(workspace), false);
assert.ok(workspace.includes("permission: 'OBSERVE'"), 'new capability reads must remain OBSERVE');
assert.equal(workspace.includes("permission: 'EXECUTE'"), false, 'capability exposure must not add execution authority');

const memoryProvider = createCreativeMemoryAdapter({ getRecords: () => [] });
const researchProvider = createResearchCreationBridgeAdapter({
  getEvidence: () => [],
  getPrinciples: () => [],
  getConstraints: () => []
});
const document = defaultDocument();
const grounded = createCreativeIntelligenceContextAdapter({
  getDocument: () => document,
  getSelectedObjectIds: () => [],
  creativeMemoryProvider: memoryProvider,
  researchCreationProvider: researchProvider
}).read();
assert.equal(grounded.modules.documentBridge.status, 'AVAILABLE');
assert.equal(grounded.modules.semanticRegions.status, 'AVAILABLE');
assert.equal(grounded.modules.provenance.status, 'AVAILABLE');
assert.equal(grounded.modules.creativeMemory.status, 'AVAILABLE');
assert.equal(grounded.modules.creativeMemory.context.selectedRecords.length, 0);
assert.equal(grounded.modules.researchCreation.status, 'AVAILABLE');
assert.equal(grounded.modules.researchCreation.context.selectedResearchEvidence.length, 0);
assert.equal(grounded.modules.researchCreation.context.authority.networkRequired, false);
assert.equal(grounded.modules.researchCreation.context.authority.creativeMemoryAutoWrite, false);

const scriptPattern = /<script type="module" src="\.\/src\/ink\.js"><\/script>/;
assert.ok(scriptPattern.test(web), 'Web must load shared source entry');
assert.ok(scriptPattern.test(portable), 'Portable must load shared source entry');
assert.ok(web.includes('web-shell.js') && portable.includes('web-shell.js'), 'Web/Portable must share shell authority');

console.log('INK-CORE-INTEGRATION-006 workstation capability exposure tests: PASS');
