import tracer from '../vendor/imagetracer-1.2.6.js';
import { imageTracerAdapter } from './adapters.js';
import { extractIntoDocument, reconstructStructureIntoDocument, decodeReferenceFile, correctExtractionAnchor, setReferenceOverlay } from './workspace.js';

export function installExtraction(app) {
  const adapter = imageTracerAdapter(tracer);
  app.extraction = {
    decode: file => decodeReferenceFile(file),
    extract: (request, options) => extractIntoDocument(app, request, adapter, options),
    structure: (request, options) => reconstructStructureIntoDocument(app, request, adapter, options),
    correct: edit => correctExtractionAnchor(app, edit),
    overlay: (id, value) => setReferenceOverlay(app, id, value),
    diagnostics: () => ({ adapter: 'imagetracer-1.2.6', browserLocal: true, remoteServiceRequired: false, directExtractionDefault: true, structureAwareOptional: true })
  };
  return app.extraction;
}
