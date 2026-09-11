import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { decodePNG } from '../compare/png-codec.js';
import { vectorObjectToSVG } from '../vector/vector-core.js';
import { renderHtmlToPng } from './chromium-cdp-renderer.js';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const esc = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);

function activePage(document) { return document.pages.find(item => item.id === document.activePageId) || document.pages[0]; }

function documentSVG(document, { background = 'white', range = 'artboard', width = null, height = null } = {}) {
  const page = activePage(document), defaultWidth = Math.round((page.artboard?.widthMm || 210) / 25.4 * 96), defaultHeight = Math.round((page.artboard?.heightMm || 297) / 25.4 * 96);
  const w = Number(width || defaultWidth), h = Number(height || defaultHeight), defs = [];
  const layers = page.layers.filter(layer => layer.visible !== false).map(layer => { const blend = layer.blendMode && !['source-over','normal'].includes(layer.blendMode) ? ` style="mix-blend-mode:${esc(layer.blendMode)}"` : ''; return `<g id="${esc(layer.id)}" data-ink-layer="${esc(layer.id)}" opacity="${layer.opacity ?? 1}"${blend}>${(layer.objects || []).map(object => vectorObjectToSVG(object, defs)).join('')}</g>`; }).join('');
  const paper = background === 'transparent' ? '' : `<rect width="100%" height="100%" fill="${background === 'white' ? '#ffffff' : esc(page.paper?.color || '#ffffff')}"/>`;
  return { svg: `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 1123" width="${w}" height="${h}" data-ink-range="${esc(range)}">${paper}${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${layers}</svg>\n`, width: w, height: h };
}

function pngMetrics(bytes) {
  const image = decodePNG(bytes);
  let nonTransparentPixels = 0, transparentPixels = 0, partialAlphaPixels = 0, nonWhitePixels = 0;
  for (let index = 0; index < image.data.length; index += 4) {
    const r = image.data[index], g = image.data[index + 1], b = image.data[index + 2], a = image.data[index + 3];
    if (a === 0) transparentPixels += 1; else nonTransparentPixels += 1;
    if (a > 0 && a < 255) partialAlphaPixels += 1;
    if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) nonWhitePixels += 1;
  }
  return { width: image.width, height: image.height, colorFormat: 'RGBA8', alpha: true, transparentPixels, nonTransparentPixels, partialAlphaPixels, nonWhitePixels };
}

export class ExportRunner {
  constructor({ root = path.resolve('.') } = {}) { this.root = root; }
  async close() { return true; }

  async export(document, { output, formats = ['png', 'svg'], basename = 'output', background = 'white', range = 'artboard', width = null, height = null, ppi = 96, deterministic = true } = {}) {
    const directory = path.resolve(output), requested = Array.isArray(formats) ? formats : String(formats).split(',').map(item => item.trim()); await mkdir(directory, { recursive: true });
    const rendered = documentSVG(document, { background, range, width, height }), files = {};
    if (requested.includes('svg')) {
      const file = path.join(directory, `${basename}.svg`); await writeFile(file, rendered.svg); files.svg = { path: file, bytes: Buffer.byteLength(rendered.svg), sha256: sha256(rendered.svg), backend: 'INK_VECTOR_SVG' };
    }
    if (requested.includes('png')) {
      const file = path.join(directory, `${basename}.png`), diagnosticsFile = path.join(directory, `${basename}.headless.json`);
      const renderReport = await renderHtmlToPng(rendered.svg, file, { width: rendered.width, height: rendered.height, background, diagnosticsFile, stageTimeoutMs: 5000, browserExitTimeoutMs: 350 });
      const bytes = await readFile(file);
      files.png = {
        path: file,
        bytes: bytes.length,
        sha256: sha256(bytes),
        backend: renderReport.renderer,
        rendererVersion: renderReport.rendererVersion,
        durationMs: renderReport.durationMs,
        diagnosticsPath: diagnosticsFile,
        metrics: pngMetrics(bytes)
      };
    }
    return { format: 'INK-EXPORT-REPORT', version: '1.0', status: 'PASS', files, options: { formats: requested, background, range, width: rendered.width, height: rendered.height, ppi, deterministic }, limitations: range === 'content' ? ['Content range currently retains the canonical artboard coordinate system.'] : [] };
  }
}

export { documentSVG, pngMetrics };
