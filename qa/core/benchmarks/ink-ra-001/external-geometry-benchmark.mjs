import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import paper from 'paper';
import { Bezier } from 'bezier-js';
import { difference, EndType, FillRule, inflatePaths, intersect, JoinType, union } from 'clipper2-ts';

paper.setup(new paper.Size(1600, 1600));

const round = (value, digits = 6) => Number(Number(value).toFixed(digits));
const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

function polygonArea(path) {
  let area = 0;
  for (let index = 0; index < path.length; index += 1) {
    const point = path[index];
    const next = path[(index + 1) % path.length];
    area += Number(point.x) * Number(next.y) - Number(next.x) * Number(point.y);
  }
  return area / 2;
}

function totalArea(paths) {
  return [...paths].reduce((sum, path) => sum + polygonArea(path), 0);
}

function serializeClipper(paths) {
  return [...paths].map(path => [...path].map(point => [round(point.x), round(point.y)]));
}

function uniqueBezierIntersections(values, epsilon = 0.004) {
  const parsed = values.map(value => value.split('/').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return parsed.filter((value, index) => !parsed.slice(0, index).some(other => Math.abs(value[0] - other[0]) <= epsilon && Math.abs(value[1] - other[1]) <= epsilon));
}

function rectangle(x, y, width, height) {
  return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
}

function rosePetals(count = 12, inner = 140, outer = 360, halfWidth = 34) {
  const polygons = [];
  for (let index = 0; index < count; index += 1) {
    const angle = index * Math.PI * 2 / count;
    const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };
    const radial = { x: Math.cos(angle), y: Math.sin(angle) };
    const center = { x: 500, y: 500 };
    polygons.push([
      [center.x + radial.x * inner + tangent.x * halfWidth, center.y + radial.y * inner + tangent.y * halfWidth],
      [center.x + radial.x * outer + tangent.x * halfWidth * 0.28, center.y + radial.y * outer + tangent.y * halfWidth * 0.28],
      [center.x + radial.x * outer - tangent.x * halfWidth * 0.28, center.y + radial.y * outer - tangent.y * halfWidth * 0.28],
      [center.x + radial.x * inner - tangent.x * halfWidth, center.y + radial.y * inner - tangent.y * halfWidth]
    ].map(([x, y]) => [Math.round(x * 1000), Math.round(y * 1000)]));
  }
  return polygons;
}

function runOnce() {
  const cubicA = new Bezier(0, 0, 50, 100, 100, -100, 150, 0);
  const cubicB = new Bezier(0, 50, 50, -50, 100, 150, 150, -50);
  const bezierIntersections = uniqueBezierIntersections(cubicA.intersects(cubicB));
  const projection = cubicA.project({ x: 70, y: 20 });
  const split = cubicA.split(0.375);
  assert.ok(bezierIntersections.length >= 3);
  assert.ok(Number.isFinite(projection.t) && Number.isFinite(projection.d));
  assert.deepEqual(split.left.points.at(-1), split.right.points[0]);

  const paperA = new paper.Path({ segments: [[0, 0], [100, 0], [100, 100], [0, 100]], closed: true, insert: false });
  const paperB = new paper.Path({ segments: [[50, 0], [150, 0], [150, 100], [50, 100]], closed: true, insert: false });
  const paperUnion = paperA.unite(paperB, { insert: false });
  const paperIntersection = paperA.intersect(paperB, { insert: false });
  const paperSubtract = paperA.subtract(new paper.Path({ segments: [[25, 25], [75, 25], [75, 75], [25, 75]], closed: true, insert: false }), { insert: false });
  assert.ok(Math.abs(Math.abs(paperUnion.area) - 15000) < 1e-6);
  assert.ok(Math.abs(Math.abs(paperIntersection.area) - 5000) < 1e-6);
  assert.ok(Math.abs(Math.abs(paperSubtract.area) - 7500) < 1e-6);
  assert.equal(paperSubtract.children?.length || 1, 2);

  const clipA = [rectangle(0, 0, 100, 100).map(([x, y]) => ({ x, y }))];
  const clipB = [rectangle(50, 0, 100, 100).map(([x, y]) => ({ x, y }))];
  const clipHole = [rectangle(25, 25, 50, 50).map(([x, y]) => ({ x, y }))];
  const clipUnion = union(clipA, clipB, FillRule.NonZero);
  const clipIntersection = intersect(clipA, clipB, FillRule.NonZero);
  const clipSubtract = difference(clipA, clipHole, FillRule.NonZero);
  const positiveOffset = inflatePaths(clipA, 10, JoinType.Miter, EndType.Polygon);
  const negativeOffset = inflatePaths(clipA, -10, JoinType.Miter, EndType.Polygon);
  assert.equal(Math.abs(totalArea(clipUnion)), 15000);
  assert.equal(Math.abs(totalArea(clipIntersection)), 5000);
  assert.equal(Math.abs(totalArea(clipSubtract)), 7500);
  assert.equal(Math.abs(totalArea(positiveOffset)), 14400);
  assert.equal(Math.abs(totalArea(negativeOffset)), 6400);

  const tangentA = new Bezier(0, 0, 33, 0.00001, 66, -0.00001, 100, 0);
  const tangentB = new Bezier(50, -10, 50, -3, 50, 3, 50, 10);
  const tangentIntersections = uniqueBezierIntersections(tangentA.intersects(tangentB, 0.0001), 0.0002);
  assert.equal(tangentIntersections.length, 1);

  const rose = rosePetals().map(polygon => polygon.map(([x, y]) => ({ x, y })));
  const roseUnion = union(rose, [], FillRule.NonZero);
  assert.equal(rose.length, 12);
  assert.ok(roseUnion.length >= 12);

  return stable({
    bezier: {
      cubicIntersectionCount: bezierIntersections.length,
      intersections: bezierIntersections.map(pair => pair.map(value => round(value))),
      project: { x: round(projection.x), y: round(projection.y), t: round(projection.t), distance: round(projection.d) },
      splitJoin: { x: round(split.left.points.at(-1).x), y: round(split.left.points.at(-1).y) },
      nearTangentIntersectionCount: tangentIntersections.length
    },
    paper: {
      unionArea: round(Math.abs(paperUnion.area)),
      intersectionArea: round(Math.abs(paperIntersection.area)),
      subtractArea: round(Math.abs(paperSubtract.area)),
      subtractChildren: paperSubtract.children?.length || 1,
      serializablePathData: typeof paperSubtract.pathData === 'string' && paperSubtract.pathData.length > 0
    },
    clipper2: {
      unionArea: round(Math.abs(totalArea(clipUnion))),
      intersectionArea: round(Math.abs(totalArea(clipIntersection))),
      subtractArea: round(Math.abs(totalArea(clipSubtract))),
      subtractContourCount: clipSubtract.length,
      positiveOffsetArea: round(Math.abs(totalArea(positiveOffset))),
      negativeOffsetArea: round(Math.abs(totalArea(negativeOffset))),
      roseInputContours: rose.length,
      roseOutputContours: roseUnion.length,
      roseSerialized: serializeClipper(roseUnion)
    }
  });
}

const start = performance.now();
const runs = Array.from({ length: 5 }, runOnce);
const elapsedMs = performance.now() - start;
for (const run of runs.slice(1)) assert.deepEqual(run, runs[0]);

const result = {
  status: 'PASS',
  versions: { paper: '0.12.18', clipper2Ts: '2.0.1-18', bezierJs: '6.1.4' },
  licenses: { paper: 'MIT', clipper2Ts: 'Boost Software License 1.0', bezierJs: 'MIT' },
  deterministicRuns: 5,
  repeatedRunEquality: true,
  elapsedMs: round(elapsedMs, 3),
  averageMsPerFixtureSet: round(elapsedMs / runs.length, 3),
  evidence: runs[0],
  notes: {
    paper: 'Correct for benchmark Boolean/compound fixtures; full scene/path authority and larger package make it an unsuitable INK product authority.',
    clipper2Ts: 'Correct for bounded integer polygon Boolean/offset fixtures; pure ESM/browser-local, 258 reference-oriented tests reported upstream, and still requires coordinate scaling plus adapter validation.',
    bezierJs: 'Correct for cubic split/project/intersection fixtures; intersections require deterministic epsilon de-duplication.'
  }
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
