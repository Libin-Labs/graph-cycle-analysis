import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
const validWitness = (edges, witness) => {
  assert.equal(witness.vertices[0], witness.vertices.at(-1));
  assert.equal(witness.vertices.length, witness.edgeIds.length + 1);
  witness.edgeIds.forEach((id, i) => {
    const edge = edges[id];
    assert.ok(
      (edge.from === witness.vertices[i] && edge.to === witness.vertices[i + 1]) ||
        (edge.to === witness.vertices[i] && edge.from === witness.vertices[i + 1]),
    );
  });
};
test('directed cycle returns a valid edge-index witness', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
  ];
  validWitness(edges, lib.directedCycleWitness(3, edges));
});
test('directed acyclic graph returns null, including disconnected vertices', () => {
  assert.equal(
    lib.directedCycleWitness(5, [
      { from: 0, to: 1 },
      { from: 2, to: 3 },
    ]),
    null,
  );
});
test('directed self-loop is a one-edge cycle', () => {
  const edges = [{ from: 1, to: 1 }];
  const result = lib.directedCycleWitness(2, edges);
  assert.deepEqual(result, { vertices: [1, 1], edgeIds: [0] });
});
test('undirected parallel edges form a length-two cycle', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 1 },
  ];
  const result = lib.undirectedCycleWitness(2, edges);
  validWitness(edges, result);
  assert.equal(result.edgeIds.length, 2);
});
test('undirected triangle witness follows actual tree and back edges', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 0 },
  ];
  validWitness(edges, lib.undirectedCycleWitness(3, edges));
});
test('undirected self-loop is reported explicitly', () => {
  const edges = [{ from: 2, to: 2 }];
  assert.deepEqual(lib.undirectedCycleWitness(3, edges), { vertices: [2, 2], edgeIds: [0] });
});
test('undirected tree and invalid endpoint behavior', () => {
  assert.equal(
    lib.undirectedCycleWitness(4, [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ]),
    null,
  );
  assert.throws(() => lib.directedCycleWitness(2, [{ from: -1, to: 0 }]), RangeError);
});
