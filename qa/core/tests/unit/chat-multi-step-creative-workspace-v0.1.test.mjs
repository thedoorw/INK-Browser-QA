import test from 'node:test';
import assert from 'node:assert/strict';

import { CreativeWorkspaceController } from '../../../../product/source/src/editor/creative-workspace.js';

function fakeRoot() {
  const nodes = new Map();
  const node = (selector, value = '') => {
    if (!nodes.has(selector)) {
      nodes.set(selector, {
        value,
        textContent: '',
        disabled: false,
        files: [],
        dataset: {},
        append() {}
      });
    }
    return nodes.get(selector);
  };
  return {
    dataset: {},
    node,
    querySelector(selector) { return node(selector); },
    querySelectorAll() { return []; }
  };
}

test('Creative Workspace delegates ordered plan review through explicit approval before execution', async () => {
  const root = fakeRoot();
  root.node('[data-workspace-input="chat-operation"]').value = 'path.repaint.v1';
  root.node('[data-workspace-input="chat-color"]').value = '#b63c36';
  root.node('[data-workspace-input="chat-dx"]').value = '12';
  root.node('[data-workspace-input="chat-dy"]').value = '0';
  root.node('[data-workspace-input="chat-material-id"]').value = 'workspace-material';
  root.node('[data-workspace-input="chat-plan-intent"]').value = 'Refine selected artwork';

  const path = { id: 'path-a', type: 'path' };
  let plan = null;
  const calls = [];
  const app = {
    doc: { id: 'doc-015', title: 'Plan Workspace', formatVersion: 4 },
    tool: 'select',
    selection: [{ layerId: 'layer-a', objectId: 'path-a' }],
    page() { return { id: 'page-a', name: 'Page A', activeLayerId: 'layer-a' }; },
    selectedObjects() { return [{ layer: { id: 'layer-a' }, object: path }]; },
    history: { pending: false, undoStack: [], redoStack: [] },
    revisions: {
      revisionIdFor() { return 'revision-a'; },
      diagnostics() { return {}; }
    },
    chatBoundedEdit: { getProposal() { return null; } },
    chatCreativePlan: {
      getPlan(id) { return id === plan?.planId ? plan : null; }
    },
    chatCreativePlanAdapter: {
      propose(raw) {
        calls.push(['propose', raw.steps.map(step => step.stepId)]);
        plan = {
          ...raw,
          planId: 'plan-a',
          source: {
            documentId: 'doc-015',
            pageId: 'page-a',
            revisionId: 'revision-a',
            documentFingerprint: 'fp-a'
          },
          status: 'PROPOSED',
          validation: { steps: raw.steps.map((step, index) => ({ stepId: step.stepId, stepIndex: index, valid: true })) },
          stepResults: [],
          result: null
        };
        return { ok: true, result: plan };
      },
      approve(id) {
        calls.push(['approve', id]);
        plan.status = 'APPROVED';
        plan.approvalToken = 'local-plan-token';
        return { ok: true, result: { ...plan, approvalToken: 'local-plan-token' } };
      },
      reject(id) {
        calls.push(['reject', id]);
        plan.status = 'REJECTED';
        return { ok: true, result: plan };
      },
      async execute(id, token) {
        calls.push(['execute', id, token]);
        assert.equal(token, 'local-plan-token');
        plan.status = 'COMPLETED';
        plan.stepResults = plan.steps.map((step, stepIndex) => ({
          stepId: step.stepId,
          stepIndex,
          operation: step.operation,
          state: 'COMPLETED',
          ok: true
        }));
        plan.result = {
          status: 'COMPLETED',
          revision: { startingRevisionId: 'revision-a', endingRevisionId: 'revision-b' }
        };
        return { ok: true, result: plan.result };
      }
    }
  };

  const controller = new CreativeWorkspaceController(app);
  controller.root = root;
  controller.refresh = () => null;
  controller.refreshRevisionList = async () => [];

  await controller.runChatPlanAction('chat-plan-add-step');
  root.node('[data-workspace-input="chat-operation"]').value = 'object.translate.v1';
  await controller.runChatPlanAction('chat-plan-add-step');

  assert.equal(controller.draftPlanSteps.length, 2);
  assert.deepEqual(controller.draftPlanSteps[1].dependsOn, [controller.draftPlanSteps[0].stepId]);

  await controller.runChatPlanAction('chat-plan-propose');
  assert.equal(controller.activePlanId, 'plan-a');
  assert.equal(controller.planApprovalToken, null);
  assert.deepEqual(calls.map(call => call[0]), ['propose']);

  await controller.runChatPlanAction('chat-plan-approve');
  assert.equal(controller.planApprovalToken, 'local-plan-token');

  await controller.runChatPlanAction('chat-plan-execute');
  assert.equal(controller.planApprovalToken, null);
  assert.equal(controller.lastPlanResult.status, 'COMPLETED');
  assert.deepEqual(calls.map(call => call[0]), ['propose', 'approve', 'execute']);
  assert.equal(calls[2][2], 'local-plan-token');
});
