import { createHash, randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { AICommandLayer, DocumentStateReader, hashValue } from '../ai/ai-core.js';
import { parseIntent } from '../ai/intent/intent-parser.js';
import { validateIntent } from '../ai/intent/intent-validator.js';
import { intentToPlan } from '../ai/intent/intent-to-plan.js';
import { SessionManager, deterministicBlankDocument } from './session-manager.js';
import { ExportRunner } from './export-runner.js';
import { inspectPreservation } from './preservation-guard.js';
import { runStructuralQA } from './structural-qa.js';
import { runVisualQA, visualQAToMarkdown } from './visual-qa.js';
import { ensureDirectory, writeJSON, writeText } from './result-packager.js';
import { migrateDocument } from '../document/migration.js';
import { migrateSemanticDocument } from '../semantic/semantic-migration.js';
import { analyzeLocalRecompute } from '../recompute/local-recompute.js';
import { recomputeReportToMarkdown } from '../recompute/recompute-report.js';
import { PreviewCompare } from '../compare/preview-compare.js';

const clone = value => structuredClone(value);
const iso = () => new Date().toISOString();
const sha256 = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');

async function readJSON(value) { return typeof value === 'string' ? JSON.parse(await readFile(value, 'utf8')) : clone(value); }
async function readPrompt(value) { return typeof value === 'string' && !value.includes('\n') && value.endsWith('.txt') ? readFile(value, 'utf8') : String(value || ''); }

function appFor(document) { return { doc: document, replaceDocument(next) { this.doc = next; } }; }
function layerFor(document) { const app = appFor(document), layer = new AICommandLayer({ app }); return { app, layer }; }
function activePage(document) { return document.pages.find(item => item.id === document.activePageId) || document.pages[0]; }
function inventory(document) {
  const page = activePage(document), objects = page.layers.flatMap(layer => (layer.objects || []).map(object => ({ layer, object })));
  return {
    documentHash: hashValue(document),
    layerHashes: Object.fromEntries(page.layers.map(layer => [layer.id, hashValue(layer)])),
    targetHashes: Object.fromEntries(objects.map(({ object }) => [object.id, hashValue(object)])),
    objectIds: objects.filter(item => item.object.type !== 'stroke').map(item => item.object.id),
    strokeIds: objects.filter(item => item.object.type === 'stroke').map(item => item.object.id)
  };
}

function semanticDocumentHash(document) {
  const value = clone(document); delete value.createdAt; delete value.modifiedAt;
  if (value.ai) { delete value.ai.audit; delete value.ai.checkpoints; value.ai.recipes = (value.ai.recipes || []).map(recipe => ({ seed: recipe.seed, steps: recipe.steps })); }
  for (const page of value.pages || []) for (const layer of page.layers || []) for (const object of layer.objects || []) for (const subpath of object.subpaths || []) for (const anchor of subpath.anchors || []) delete anchor.id;
  return sha256(value);
}

export class InkHeadlessRuntime {
  constructor({ root = path.resolve('.ink-headless'), projectRoot = path.resolve('.') } = {}) {
    this.root = path.resolve(root); this.projectRoot = path.resolve(projectRoot);
    this.sessions = new SessionManager({ root: path.join(this.root, 'sessions') }); this.exporter = new ExportRunner({ root: this.projectRoot }); this.compareEngine = new PreviewCompare({ exporter: this.exporter });
  }
  async close() { await this.exporter.close(); }
  async createSession(options = {}) { return this.sessions.create(options); }

  async context({ sessionId = null, document = null, seed = 15101 } = {}) {
    if (sessionId) { const loaded = await this.sessions.document(sessionId); return { ...loaded, sessionId: loaded.session.sessionId }; }
    let loadedDocument;
    try { loadedDocument = document ? migrateDocument(await readJSON(document)) : migrateDocument(deterministicBlankDocument(seed)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; loadedDocument = migrateDocument(deterministicBlankDocument(seed)); }
    return { session: null, file: null, directory: null, documentPath: typeof document === 'string' ? path.resolve(document) : null, document: loadedDocument, sessionId: null };
  }

  async plan({ sessionId = null, document = null, prompt, seed = 15101, target = null, allowedScope = null, output = null } = {}) {
    const context = await this.context({ sessionId, document, seed }), text = (await readPrompt(prompt)).trim(), { layer } = layerFor(context.document);
    const intent = parseIntent(text, { seed }), validation = validateIntent(intent);
    if (!validation.valid) { intent.status = 'UNSUPPORTED'; intent.unsupportedItems.push(...validation.errors); }
    const proposal = intentToPlan(layer, intent); proposal.targetOverride = target; proposal.allowedScope = allowedScope;
    const destination = output || (context.directory ? path.join(context.directory, 'plans', `${proposal.planId.replace(/[^a-z0-9_.:-]/gi, '_')}.json`) : null);
    if (destination) await writeJSON(destination, proposal);
    if (context.session) {
      context.session.activeTargets = proposal.targets || []; context.session.unresolvedItems = proposal.unresolvedItems || []; context.session.constraints = proposal.constraints || {};
      context.session.pending = { phase: 'PLAN', planId: proposal.planId, planPath: path.relative(context.directory, destination), prompt: text };
      await this.sessions.save(context.file, context.session);
    }
    return proposal;
  }

  async preview({ sessionId = null, document = null, plan, output = null } = {}) {
    const context = await this.context({ sessionId, document }), proposal = await readJSON(plan || (context.session && path.join(context.directory, context.session.pending?.planPath || '')));
    if (proposal.status !== 'READY' || !proposal.recipeDraft) throw Object.assign(new Error(`Plan is not previewable: ${proposal.status}`), { code: proposal.status || 'PLAN_NOT_READY' });
    const { layer } = layerFor(context.document); layer.plans.set(proposal.planId, clone(proposal)); layer.recipes.set(proposal.recipeDraft.recipeId, clone(proposal.recipeDraft));
    const preview = layer.preview(proposal.recipeDraft.recipeId, { quality: 'BALANCED' }), branch = layer.previewEngine.branch(preview.previewId);
    const destination = path.resolve(output || (context.directory ? path.join(context.directory, 'previews', preview.previewId) : 'result'));
    await ensureDirectory(destination);
    const exportReport = await this.exporter.export(branch, { output: destination, formats: ['png', 'svg'], basename: 'preview', background: 'white', deterministic: true });
    migrateSemanticDocument(branch);
    const declaredTargets = [...new Set([...(proposal.targets || []), ...(proposal.expectedDifferences || []).flatMap(item => item.targets || [])])];
    const compare = await this.compareEngine.create(context.document, branch, { output: destination, declaredTargets, beforeParameters: {}, afterParameters: proposal.recipeDraft?.editableParameters || proposal.recipeDraft?.constraints || {} });
    const structural = runStructuralQA(branch, { before: context.document, plan: proposal });
    const visual = await runVisualQA(branch, { before: context.document, intent: proposal.parsedIntent });
    const result = { ...preview, status: 'READY', plan: { planId: proposal.planId, recipeId: proposal.recipeDraft.recipeId }, export: exportReport.files, compare, structuralQA: structural, visualQA: visual, branchDocumentHash: hashValue(branch), approvalRequired: true };
    await Promise.all([
      writeJSON(path.join(destination, 'preview.json'), result), writeJSON(path.join(destination, 'engine_difference.json'), preview.difference),
      writeJSON(path.join(destination, 'visual_checks.json'), visual), writeText(path.join(destination, 'visual_checks.md'), visualQAToMarkdown(visual)),
      writeJSON(path.join(destination, 'structural_checks.json'), structural), writeJSON(path.join(destination, 'preview_document.ink'), branch)
    ]);
    if (context.session) {
      context.session.pending = { ...context.session.pending, phase: 'PREVIEW', previewId: preview.previewId, previewPath: path.relative(context.directory, path.join(destination, 'preview.json')), previewDirectory: path.relative(context.directory, destination) };
      await this.sessions.save(context.file, context.session);
    }
    return result;
  }

  async approve({ sessionId = null, preview, decision = 'approve', selectedSteps = null, parameters = null, output = null } = {}) {
    const context = sessionId ? await this.context({ sessionId }) : null;
    const previewValue = await readJSON(preview || (context && path.join(context.directory, context.session.pending?.previewPath || ''))), normalized = String(decision).toUpperCase();
    if (['REVISE', 'MODIFY', '修改'].includes(normalized) || parameters) {
      const result = { format: 'INK-HEADLESS-APPROVAL', version: '1.0', status: 'REPREVIEW_REQUIRED', decision: 'REVISE', previewId: previewValue.previewId, parameters: parameters || {}, timestamp: iso() };
      if (output) await writeJSON(output, result); return result;
    }
    if (!['APPROVE', 'REJECT'].includes(normalized)) throw Object.assign(new Error('Approval decision must be approve, reject, or revise'), { code: 'APPROVAL_INVALID' });
    const approval = {
      format: 'INK-AI-APPROVAL', version: '1.0', approvalId: `approval-${randomUUID()}`, previewId: previewValue.previewId,
      planId: previewValue.plan.planId, recipeId: previewValue.plan.recipeId, decision: normalized,
      selectedSteps: selectedSteps || previewValue.steps, actor: { type: 'user', id: 'headless-cli' },
      baseDocumentHash: previewValue.baseDocumentHash, previewSnapshot: previewValue, timestamp: iso(), status: normalized === 'APPROVE' ? 'APPROVED' : 'REJECTED'
    };
    const destination = output || (context?.directory ? path.join(context.directory, 'approvals', `${approval.approvalId}.json`) : null);
    if (destination) await writeJSON(destination, approval);
    if (context?.session) { context.session.pending = { ...context.session.pending, phase: approval.status, approvalId: approval.approvalId, approvalPath: path.relative(context.directory, destination) }; await this.sessions.save(context.file, context.session); }
    return approval;
  }

  async execute({ sessionId = null, document = null, plan, approval, output = null } = {}) {
    const context = await this.context({ sessionId, document }), proposal = await readJSON(plan || (context.session && path.join(context.directory, context.session.pending?.planPath || ''))), approvalValue = await readJSON(approval || (context.session && path.join(context.directory, context.session.pending?.approvalPath || '')));
    if (approvalValue.decision !== 'APPROVE' || approvalValue.status !== 'APPROVED') throw Object.assign(new Error('Explicit approved preview is required'), { code: 'APPROVAL_REQUIRED' });
    if (approvalValue.planId !== proposal.planId || approvalValue.recipeId !== proposal.recipeDraft?.recipeId) throw Object.assign(new Error('Approval and Plan do not match'), { code: 'APPROVAL_PLAN_MISMATCH' });
    const before = clone(context.document), beforeInventory = inventory(before), { app, layer } = layerFor(context.document), preview = approvalValue.previewSnapshot;
    layer.plans.set(proposal.planId, clone(proposal)); layer.recipes.set(proposal.recipeDraft.recipeId, clone(proposal.recipeDraft)); layer.previews.set(preview.previewId, clone(preview)); layer.approvals.set(approvalValue.approvalId, clone(approvalValue));
    let execution, guard;
    try {
      execution = layer.executeApproval(approvalValue.approvalId); guard = inspectPreservation(before, app.doc, proposal);
      if (!guard.passed) throw Object.assign(new Error('Preservation Guard rejected undeclared changes'), { code: 'PRESERVATION_GUARD_REJECTED', details: guard });
    } catch (error) {
      app.replaceDocument(before);
      if (error.code === 'PRESERVATION_GUARD_REJECTED') error.details = { ...error.details, automaticRollback: true, documentHash: hashValue(before) };
      throw error;
    }
    const after = app.doc; migrateSemanticDocument(after);
    const recompute = proposal.constraints?.localEditOnly ? analyzeLocalRecompute(before, after, proposal) : { format: 'INK-LOCAL-RECOMPUTE-REPORT', version: '1.0', status: 'FULL_DOCUMENT_INITIAL_CREATION', changedObjectIds: inventory(after).objectIds, preservedObjectIds: [] };
    if (recompute.status === 'REJECTED') { app.replaceDocument(before); throw Object.assign(new Error('Local Recompute validation rejected execution'), { code: 'LOCAL_RECOMPUTE_REJECTED', details: recompute }); }
    const afterInventory = inventory(after), structural = runStructuralQA(after, { before, plan: proposal }), visual = await runVisualQA(after, { before, intent: proposal.parsedIntent });
    if (!structural.passed) { app.replaceDocument(before); throw Object.assign(new Error('Structural QA rejected execution'), { code: 'STRUCTURAL_QA_FAILED', details: structural }); }
    const destination = path.resolve(output || (context.directory ? path.join(context.directory, 'executions', execution.executionId) : 'result'));
    await ensureDirectory(destination);
    const checkpoint = { format: 'INK-HEADLESS-CHECKPOINT', version: '1.0', checkpointId: execution.checkpointId, executionId: execution.executionId, beforeHash: beforeInventory.documentHash, afterHash: afterInventory.documentHash, beforeInventory, afterInventory, createdAt: iso() };
    const audit = { format: 'INK-HEADLESS-AUDIT', version: '1.0', auditId: execution.auditId, executionId: execution.executionId, approvalId: approvalValue.approvalId, planId: proposal.planId, recipeId: proposal.recipeDraft.recipeId, preservationGuard: guard, localRecompute: recompute, structuralQA: structural, visualQA: visual, timestamp: iso() };
    const result = { ...execution, documentHash: afterInventory.documentHash, layerHashes: afterInventory.layerHashes, targetHashes: afterInventory.targetHashes, objectIds: afterInventory.objectIds, strokeIds: afterInventory.strokeIds, recipeId: proposal.recipeDraft.recipeId, executionId: execution.executionId, checkpointId: execution.checkpointId, preservationGuard: guard, localRecompute: recompute, structuralQA: structural, visualQA: visual, deterministicSemanticHash: semanticDocumentHash(after) };
    await Promise.all([
      writeJSON(path.join(destination, 'document_before.ink'), before), writeJSON(path.join(destination, 'document_after.ink'), after),
      writeJSON(path.join(destination, 'execution.json'), result), writeJSON(path.join(destination, 'difference.json'), execution.difference),
      writeJSON(path.join(destination, 'audit.json'), audit), writeJSON(path.join(destination, 'checkpoint.json'), checkpoint),
      writeJSON(path.join(destination, 'recompute_report.json'), recompute), writeText(path.join(destination, 'recompute_report.md'), recomputeReportToMarkdown(recompute))
    ]);
    if (context.session) {
      const currentPath = path.resolve(context.directory, context.session.documentPath); await writeJSON(currentPath, after);
      const roundNumber = context.session.rounds.length + 1, round = {
        round: roundNumber, prompt: proposal.userIntent, planId: proposal.planId, recipeId: proposal.recipeDraft.recipeId, previewId: preview.previewId,
        approvalId: approvalValue.approvalId, executionId: execution.executionId, checkpointId: execution.checkpointId,
        beforeHash: beforeInventory.documentHash, afterHash: afterInventory.documentHash, changedTargets: [...guard.differences.modified, ...guard.differences.added, ...guard.differences.deleted],
        exports: {}, status: 'COMPLETED', beforeDocumentPath: path.relative(context.directory, path.join(destination, 'document_before.ink')), afterDocumentPath: path.relative(context.directory, path.join(destination, 'document_after.ink'))
      };
      context.session.rounds.push(round); context.session.currentDocumentHash = afterInventory.documentHash; context.session.currentExecutionId = execution.executionId; context.session.currentCheckpointId = execution.checkpointId; context.session.pending = null;
      await this.sessions.save(context.file, context.session);
    }
    return result;
  }

  async export({ sessionId = null, document = null, formats = ['png', 'svg'], output, basename = 'output', background = 'white', range = 'artboard', width = null, height = null, ppi = 96 } = {}) {
    const context = await this.context({ sessionId, document }), report = await this.exporter.export(context.document, { output, formats, basename, background, range, width, height, ppi, deterministic: true });
    await writeJSON(path.join(path.resolve(output), 'export_report.json'), report);
    if (context.session?.rounds.length) { context.session.rounds.at(-1).exports = Object.fromEntries(Object.entries(report.files).map(([key, value]) => [key, { path: value.path, sha256: value.sha256 }])); await this.sessions.save(context.file, context.session); }
    return report;
  }

  async modify({ sessionId, prompt, output, seed = 15101 } = {}) {
    const proposal = await this.plan({ sessionId, prompt, seed });
    if (proposal.status !== 'READY') { if (output) await writeJSON(path.join(output, 'plan.json'), proposal); return { status: proposal.status, plan: proposal }; }
    const preview = await this.preview({ sessionId, plan: proposal, output });
    return { status: 'AWAITING_APPROVAL', plan: proposal, preview };
  }

  async rollback({ sessionId, executionId = null, output } = {}) {
    const context = await this.context({ sessionId }), round = executionId ? context.session.rounds.find(item => item.executionId === executionId) : context.session.rounds.at(-1);
    if (!round) throw Object.assign(new Error('Rollback execution was not found in Session'), { code: 'EXECUTION_NOT_FOUND' });
    const beforePath = path.resolve(context.directory, round.beforeDocumentPath), rollbackDocument = JSON.parse(await readFile(beforePath, 'utf8'));
    const currentBefore = inventory(context.document), restored = inventory(rollbackDocument); await writeJSON(path.resolve(context.directory, context.session.documentPath), rollbackDocument);
    const destination = path.resolve(output), exportReport = await this.exporter.export(rollbackDocument, { output: destination, formats: ['png', 'svg'], basename: 'rollback', background: 'white', deterministic: true });
    const report = { format: 'INK-HEADLESS-ROLLBACK', version: '1.0', status: 'ROLLED_BACK', sourceExecutionId: round.executionId, checkpointId: round.checkpointId, beforeHash: currentBefore.documentHash, restoredHash: restored.documentHash, expectedHash: round.beforeHash, hashMatch: restored.documentHash === round.beforeHash, objectIds: restored.objectIds, layerHashes: restored.layerHashes, pngSha256: exportReport.files.png?.sha256, svgSha256: exportReport.files.svg?.sha256, auditId: `audit-rollback-${randomUUID()}`, timestamp: iso() };
    await Promise.all([writeJSON(path.join(destination, 'document_rollback.ink'), rollbackDocument), writeJSON(path.join(destination, 'rollback.json'), report), writeJSON(path.join(destination, 'audit.json'), { ...report, format: 'INK-HEADLESS-ROLLBACK-AUDIT' })]);
    context.session.currentDocumentHash = restored.documentHash; context.session.currentExecutionId = context.session.rounds.find(item => item.afterHash === restored.documentHash)?.executionId || null; context.session.currentCheckpointId = null; context.session.rounds.push({ round: context.session.rounds.length + 1, prompt: 'rollback', planId: null, recipeId: null, previewId: null, approvalId: null, executionId: `rollback:${round.executionId}`, checkpointId: round.checkpointId, beforeHash: currentBefore.documentHash, afterHash: restored.documentHash, changedTargets: [], exports: report, status: 'ROLLED_BACK' });
    await this.sessions.save(context.file, context.session); return report;
  }
}

export async function createInkHeadlessRuntime(options = {}) { return new InkHeadlessRuntime(options); }
export { semanticDocumentHash };
