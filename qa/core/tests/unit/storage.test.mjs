import test from 'node:test';
import assert from 'node:assert/strict';
import { InkStore } from '../../src/document/index.js';

test('storage keeps a previous autosave generation and recovers from an invalid current record', async () => {
  const store = new InkStore({ databaseName: 'INK_TEST' });
  await store.save('autosave', { format: 'INK', modifiedAt: 'one', pages: [] });
  await store.save('autosave', { format: 'INK', modifiedAt: 'two', pages: [{}] });
  store.memory.set('autosave', { schema: 'INK_STORAGE_V2', value: { invalid: true } });
  const result = await store.loadWithRecovery('autosave', value => value?.format === 'INK');
  assert.equal(result.recovered, true);
  assert.equal(result.value.modifiedAt, 'one');
});
