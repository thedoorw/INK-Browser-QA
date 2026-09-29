import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const shell = await readFile(new URL('../product/source/web-shell.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../product/source/styles.css', import.meta.url), 'utf8');

test('Navigator exposes one bounded zoom slider and routes through existing zoomBy authority', () => {
  assert.equal((shell.match(/id="shellNavigatorZoomSlider"/g) || []).length, 1);
  assert.match(shell, /id="shellNavigatorZoomSlider" type="range" min="3" max="2400" step="1"/);
  assert.match(shell, /zoomSlider\.addEventListener\('input'/);
  assert.match(shell, /app\.zoomBy\?\.\(requested \/ current\)/);
  assert.doesNotMatch(shell, /zoomSlider[\s\S]{0,500}?camera\.scale\s*=/);
});

test('Navigator renderer synchronizes slider and readout from the same camera scale', () => {
  assert.match(shell, /const slider = document\.querySelector\('#shellNavigatorZoomSlider'\)/);
  assert.match(shell, /slider\.value = String\(percent\)/);
  assert.match(shell, /slider\.setAttribute\('aria-valuetext', zoom\.value\)/);
});

test('Navigator slider uses compact footer geometry and focus treatment', () => {
  assert.match(css, /\.navigator-footer input\[type="range"\]\{[^}]*flex:1 1 auto;[^}]*min-width:48px;[^}]*height:18px/);
  assert.match(css, /\.navigator-footer input\[type="range"\]:focus-visible\{[^}]*outline:1px solid var\(--ink-ui-focus\)/);
});
