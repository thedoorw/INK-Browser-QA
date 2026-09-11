export async function runHeadlessCommand(runtime, command, parameters = {}) {
  const methods = {
    plan: 'plan', preview: 'preview', approve: 'approve', execute: 'execute', export: 'export', modify: 'modify', rollback: 'rollback'
  };
  const method = methods[command];
  if (!method || typeof runtime?.[method] !== 'function') throw Object.assign(new Error(`Unknown Headless command: ${command}`), { code: 'HEADLESS_COMMAND_UNKNOWN' });
  return runtime[method](parameters);
}
