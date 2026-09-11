import { AICommandLayer } from '../../src/ai/ai-core.js';
import { parseIntent } from '../../src/ai/intent/intent-parser.js';
import { intentToPlan } from '../../src/ai/intent/intent-to-plan.js';
import { deterministicBlankDocument } from '../../src/headless/session-manager.js';

export function executePrompt(document, prompt) {
  const app = { doc: structuredClone(document), replaceDocument(value) { this.doc = value; } }, layer = new AICommandLayer({ app });
  const intent = parseIntent(prompt), plan = intentToPlan(layer, intent);
  const preview = layer.preview(plan.recipeDraft.recipeId), approval = layer.approve(preview.previewId, { decision: 'APPROVE' }), execution = layer.executeApproval(approval.approvalId);
  return { app, layer, intent, plan, preview, approval, execution, document: app.doc };
}

export function createdFlower() { return executePrompt(deterministicBlankDocument(), '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。'); }
