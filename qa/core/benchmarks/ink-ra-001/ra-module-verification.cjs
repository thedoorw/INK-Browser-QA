'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '../../../../reference/RA0_9_baseline/source/RA0_9_AI_Review_Mode_Current_Baseline_v1.0/runtime');
const measurement = require(path.join(root, 'geometry_measurement_engine.js'));
const topology = require(path.join(root, 'compound_topology_engine.js'));
const constraints = require(path.join(root, 'constraint_parameter_engine.js'));
const generators = require(path.join(root, 'generator_authoring_engine.js'));
const dependencies = require(path.join(root, 'dependency_recompute_engine.js'));

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}

function run() {
  const linePoints = [{ x: 0, y: 1 }, { x: 5, y: 11 }, { x: 10, y: 21 }];
  const circlePoints = [0, 90, 180, 270].map(degrees => ({
    x: 4 + 10 * Math.cos(degrees * Math.PI / 180),
    y: -3 + 10 * Math.sin(degrees * Math.PI / 180)
  }));
  const lineFit = measurement.fitLine(linePoints);
  const circleFit = measurement.fitCircle(circlePoints);
  assert.ok(lineFit.metrics.rmse < 1e-9);
  assert.ok(Math.abs(circleFit.parameters.radius - 10) < 1e-6);
  assert.equal(measurement.nearestPointIndex(linePoints, { x: 4.9, y: 11.1 }).index, 1);

  const lineA = { id: 'line-a', type: 'LINE', parameters: { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } } };
  const lineB = { id: 'line-b', type: 'LINE', parameters: { start: { x: 10, y: 0 }, end: { x: 20, y: 0 } } };
  const compound = { id: 'compound-a', segments: [lineA, lineB] };
  const analysis = topology.analyzeCompound(compound);
  assert.equal(analysis.joins.length, 1);
  assert.equal(analysis.joins[0].gap, 0);
  const offset = topology.offsetCompound(compound, [2]);
  assert.equal(offset.members.length, 1);
  assert.equal(offset.members[0].compound.segments.length, 2);

  const parallelA = { id: 'parallel-a', type: 'LINE', parameters: { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } } };
  const parallelB = { id: 'parallel-b', type: 'LINE', parameters: { start: { x: 0, y: 5 }, end: { x: 10, y: 5 } } };
  const constraint = constraints.proposeConstraint('PARALLEL', [parallelA, parallelB]);
  assert.equal(constraint.evaluation.passed, true);
  assert.throws(() => constraints.promoteSharedParameter(constraint, { state: 'UNRESOLVED' }), /AI_CONFIRMED/);
  const shared = constraints.promoteSharedParameter(constraint, { state: 'AI_CONFIRMED', reviewId: 'review-1' });
  assert.equal(shared.parameterKind, 'angle');

  const generator = generators.propose('ROTATION', {
    primitives: [lineA], center: { x: 0, y: 0 }, count: 4, angleStepDeg: 90
  });
  const expansion = generators.expand(generator);
  assert.equal(expansion.primitiveCount, 4);
  assert.equal(new Set(expansion.primitives.map(item => item.id)).size, 4);
  assert.deepEqual(expansion, generators.expand(generator));

  const graph = dependencies.createGraph('case-a', [
    { id: 'radius', kind: 'PARAMETER', value: 10 },
    { id: 'diameter', kind: 'GEOMETRY', value: 20, dependencies: ['radius'], expression: { op: 'multiply', args: [{ op: 'ref', id: 'radius' }, { op: 'literal', value: 2 }] } }
  ]);
  const transaction = dependencies.setParameter(dependencies.beginTransaction(graph), 'radius', 12);
  const committed = dependencies.commit(graph, transaction);
  assert.equal(committed.graph.nodes.diameter.value, 24);
  assert.deepEqual(committed.recomputedIds, ['diameter']);
  const undone = dependencies.undo(committed.graph);
  assert.equal(undone.nodes.radius.value, 10);
  const redone = dependencies.redo(undone);
  assert.equal(redone.nodes.radius.value, 12);
  assert.throws(() => dependencies.createGraph('cycle', [
    { id: 'a', dependencies: ['b'] }, { id: 'b', dependencies: ['a'] }
  ]), /Cyclic dependency/);

  const first = stable({ lineFit, circleFit, analysis, offset, constraint, shared, expansion, committed: committed.graph });
  const second = stable({
    lineFit: measurement.fitLine(linePoints),
    circleFit: measurement.fitCircle(circlePoints),
    analysis: topology.analyzeCompound(compound),
    offset: topology.offsetCompound(compound, [2]),
    constraint: constraints.proposeConstraint('PARALLEL', [parallelA, parallelB]),
    shared: constraints.promoteSharedParameter(constraint, { state: 'AI_CONFIRMED', reviewId: 'review-1' }),
    expansion: generators.expand(generator),
    committed: dependencies.commit(graph, transaction).graph
  });
  assert.deepEqual(first, second);

  return {
    status: 'PASS',
    deterministicRunsEqual: true,
    modules: {
      geometry_measurement_engine: { status: 'PASS', disposition: 'ADAPT' },
      compound_topology_engine: { status: 'PASS', disposition: 'REFERENCE_ONLY' },
      constraint_parameter_engine: { status: 'PASS', disposition: 'DEFER' },
      generator_authoring_engine: { status: 'PASS', disposition: 'REFERENCE_ONLY' },
      dependency_recompute_engine: { status: 'PASS', disposition: 'REFERENCE_ONLY' }
    }
  };
}

process.stdout.write(`${JSON.stringify(run(), null, 2)}\n`);
