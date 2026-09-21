import assert from 'node:assert/strict';
import { defaultDocument } from '../../../../product/source/src/document/model.js';
import { inspectDocument } from '../../../../product/source/src/document/integrity.js';
import { HistoryManager } from '../../../../product/source/src/history/history.js';
import { createAnchor, createPath, pathMetrics } from '../../../../product/source/src/vector/vector-core.js';
import {
  applyPathGeometryResult,
  fitCircle,
  fitLine,
  intersectPathSegments,
  measurePathGeometry,
  offsetPathRobust,
  projectPointToPath,
  splitPathSegmentGeometry
} from '../../../../product/source/src/vector/geometry-kernel.js';

const anchor = (id, x, y, incoming = null, outgoing = null) => createAnchor(x, y, incoming, outgoing, { id });

function rectanglePath(id = 'rect', withHole = false) {
  const subpaths = [{
    id: `${id}:outer`, role: 'outer', closed: true,
    anchors: [anchor(`${id}:o0`, 0, 0), anchor(`${id}:o1`, 100, 0), anchor(`${id}:o2`, 100, 100), anchor(`${id}:o3`, 0, 100)]
  }];
  if (withHole) subpaths.push({
    id: `${id}:hole`, role: 'hole', closed: true,
    anchors: [anchor(`${id}:h0`, 30, 30), anchor(`${id}:h1`, 70, 30), anchor(`${id}:h2`, 70, 70), anchor(`${id}:h3`, 30, 70)]
  });
  return createPath({ id, name: id, subpaths, fillRule: 'evenodd' });
}

function cubicPath(id, values) {
  const [p0, p1, p2, p3] = values;
  return createPath({ id, subpaths: [{ id: `${id}:s0`, role: 'outer', closed: false, anchors: [
    anchor(`${id}:a0`, p0.x, p0.y, null, { x: p1.x - p0.x, y: p1.y - p0.y }),
    anchor(`${id}:a1`, p3.x, p3.y, { x: p2.x - p3.x, y: p2.y - p3.y }, null)
  ] }] });
}

const curveA = cubicPath('curve-a', [{ x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: -100 }, { x: 150, y: 0 }]);
const curveB = cubicPath('curve-b', [{ x: 0, y: 50 }, { x: 50, y: -50 }, { x: 100, y: 150 }, { x: 150, y: -50 }]);

const intersections = intersectPathSegments(curveA, { subpathIndex: 0, segmentIndex: 0 }, curveB, { subpathIndex: 0, segmentIndex: 0 });
assert.equal(intersections.intersections.length, 3);
assert.deepEqual(intersections, intersectPathSegments(curveA, { subpathIndex: 0, segmentIndex: 0 }, curveB, { subpathIndex: 0, segmentIndex: 0 }));

const projection = projectPointToPath(curveA, { x: 70, y: 20 });
assert.equal(projection.pathId, 'curve-a');
assert.ok(projection.t > 0 && projection.t < 1 && projection.distance > 0);
const split = splitPathSegmentGeometry(curveA, { subpathIndex: 0, segmentIndex: 0 }, 0.375);
assert.deepEqual(split.left.at(-1), split.right[0]);

const square = rectanglePath('square');
const positive = offsetPathRobust(square, 10);
const negative = offsetPathRobust(square, -10);
assert.equal(Math.round(pathMetrics(positive).area), 14400);
assert.equal(Math.round(pathMetrics(negative).area), 6400);
assert.deepEqual(positive, offsetPathRobust(square, 10));

const compound = rectanglePath('compound', true);
const compoundOffset = offsetPathRobust(compound, 10);
assert.equal(compoundOffset.subpaths.filter(subpath => subpath.role === 'outer').length, 1);
assert.equal(compoundOffset.subpaths.filter(subpath => subpath.role === 'hole').length, 1);
assert.equal(Math.round(pathMetrics(compoundOffset).area), 14000);

assert.throws(() => offsetPathRobust(createPath({ id: 'open', subpaths: [{ closed: false, anchors: [anchor('a', 0, 0), anchor('b', 10, 0)] }] }), 2), /OFFSET_REQUIRES_CLOSED_SUBPATH/);
assert.throws(() => offsetPathRobust(square, -1000), /OFFSET_COLLAPSED/);

const lineFit = fitLine([{ x: 0, y: 1 }, { x: 5, y: 11 }, { x: 10, y: 21 }]);
const circleFit = fitCircle([0, 90, 180, 270].map(degrees => ({ x: 4 + 10 * Math.cos(degrees * Math.PI / 180), y: -3 + 10 * Math.sin(degrees * Math.PI / 180) })));
assert.equal(lineFit.metrics.rmse, 0);
assert.deepEqual(circleFit.parameters, { center: { x: 4, y: -3 }, radius: 10 });
const measurement = measurePathGeometry(compound);
assert.equal(measurement.metrics.holes, 1);
assert.equal(measurement.fits.length, 2);

const document = defaultDocument();
const layer = document.pages[0].layers[0];
layer.objects.push(square);
const app = {
  doc: document,
  replaceDocument(next) { this.doc = next; },
  updateHistoryUI() {},
  refreshAll() {},
  renderer: { render() {} }
};
app.history = new HistoryManager(app, 20);
const historyPath = ['pages', 0, 'layers', 0, 'objects', 0];
applyPathGeometryResult(app, { targetPath: square, historyPath, resultPath: positive, label: 'Robust offset' });
assert.equal(app.doc.pages[0].layers[0].objects[0].id, 'square');
assert.equal(Math.round(pathMetrics(app.doc.pages[0].layers[0].objects[0]).area), 14400);
assert.equal(app.history.undo(), true);
assert.equal(Math.round(pathMetrics(app.doc.pages[0].layers[0].objects[0]).area), 10000);
assert.equal(app.history.redo(), true);
assert.equal(Math.round(pathMetrics(app.doc.pages[0].layers[0].objects[0]).area), 14400);

const roundtrip = JSON.parse(JSON.stringify(app.doc));
assert.deepEqual(roundtrip, app.doc);
const integrity = inspectDocument(roundtrip);
assert.equal(integrity.errors.length, 0);
assert.equal(roundtrip.formatVersion, 4);
assert.equal(JSON.stringify(roundtrip).includes('Bezier'), false);
assert.equal(JSON.stringify(roundtrip).includes('Clipper'), false);

console.log(JSON.stringify({
  status: 'PASS',
  intersections: intersections.intersections.length,
  positiveOffsetArea: pathMetrics(positive).area,
  negativeOffsetArea: pathMetrics(negative).area,
  compoundOffsetArea: pathMetrics(compoundOffset).area,
  historyUndoRedo: 'PASS',
  saveLoadRoundtrip: 'PASS',
  documentIntegrity: 'PASS',
  formatVersion: roundtrip.formatVersion,
  externalAuthorityInDocument: false
}, null, 2));
