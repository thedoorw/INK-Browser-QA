import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { imageDifference, decodePNG, encodePNG } from './image-difference.js';
import { parameterDifference } from './parameter-difference.js';
import { semanticDifference } from './semantic-difference.js';
import { compareReportMarkdown } from './compare-report.js';

const writeJSON = (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`);

export class PreviewCompare {
  constructor({ exporter }) { this.exporter = exporter; }
  async create(before, after, { output, declaredTargets = [], beforeParameters = {}, afterParameters = {} } = {}) {
    const destination = path.resolve(output); await mkdir(destination, { recursive: true });
    const beforeExport = await this.exporter.export(before, { output: destination, formats: ['png', 'svg'], basename: 'before', background: 'white', deterministic: true });
    const afterExport = await this.exporter.export(after, { output: destination, formats: ['png', 'svg'], basename: 'after', background: 'white', deterministic: true });
    const beforePNG = decodePNG(await readFile(beforeExport.files.png.path)), afterPNG = decodePNG(await readFile(afterExport.files.png.path)), images = imageDifference(beforePNG, afterPNG);
    await Promise.all([
      writeFile(path.join(destination, 'side_by_side.png'), encodePNG(images.sideBySide)), writeFile(path.join(destination, 'overlay.png'), encodePNG(images.overlay)), writeFile(path.join(destination, 'difference.png'), encodePNG(images.difference))
    ]);
    const semantic = semanticDifference(before, after, declaredTargets), parameters = parameterDifference(beforeParameters, afterParameters);
    const beforeLayers = new Map((before.pages?.[0]?.layers || []).map(layer => [layer.id, JSON.stringify(layer)])), afterLayers = new Map((after.pages?.[0]?.layers || []).map(layer => [layer.id, JSON.stringify(layer)]));
    const layerDifference = { format: 'INK-LAYER-DIFFERENCE', version: '1.0', added: [...afterLayers.keys()].filter(id => !beforeLayers.has(id)), deleted: [...beforeLayers.keys()].filter(id => !afterLayers.has(id)), modified: [...beforeLayers.keys()].filter(id => afterLayers.has(id) && beforeLayers.get(id) !== afterLayers.get(id)) };
    const stableIdDifference = { preserved: [...beforeLayers.keys()].filter(id => afterLayers.has(id)), added: layerDifference.added, deleted: layerDifference.deleted };
    const difference = { format: 'INK-PREVIEW-DIFFERENCE', version: '1.0', classification: { Preserve: semantic.preserved, Changed: semantic.modified, Deleted: semantic.deleted, Added: semantic.added }, undeclaredChanges: semantic.undeclaredChanges };
    const report = { format: 'INK-PREVIEW-COMPARE', version: '1.0', status: semantic.passed ? 'PASS' : 'FAIL', imageDifference: images.metrics, semanticDifference: semantic, parameterDifference: parameters, layerDifference, stableIdDifference, files: ['before.png', 'after.png', 'side_by_side.png', 'overlay.png', 'difference.png', 'before.svg', 'after.svg', 'difference.json', 'parameter_difference.json', 'semantic_difference.json', 'layer_difference.json', 'compare_report.md'] };
    await Promise.all([
      writeJSON(path.join(destination, 'difference.json'), difference), writeJSON(path.join(destination, 'parameter_difference.json'), parameters), writeJSON(path.join(destination, 'semantic_difference.json'), semantic), writeJSON(path.join(destination, 'layer_difference.json'), layerDifference), writeFile(path.join(destination, 'compare_report.md'), compareReportMarkdown(report))
    ]);
    return report;
  }
}
