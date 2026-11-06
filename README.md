# @lp-labs/graph-cycle-analysis

Directed and undirected cycle detection with edge-indexed closed witness paths. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes. No browser globals are accessed at import.

## Install

```sh
npm install @lp-labs/graph-cycle-analysis
```

## Quick start

```js
import { directedCycleWitness } from '@lp-labs/graph-cycle-analysis';
console.log(
  directedCycleWitness(2, [
    { from: 0, to: 1 },
    { from: 1, to: 0 },
  ]),
);
```

Use the named ESM imports shown above. CommonJS uses `const { directedCycleWitness } = require('@lp-labs/graph-cycle-analysis');`. Both formats ship declarations.

## Public API and customization

Runtime exports: `directedCycleWitness, undirectedCycleWitness`.

Public signatures: `directedCycleWitness(vertexCount: number, edges: readonly GraphEdge[]): CycleWitness | null; undirectedCycleWitness(vertexCount: number, edges: readonly GraphEdge[]): CycleWitness | null`.

Types: `GraphEdge = { from: number; to: number }`; `CycleWitness = { vertices: number[]; edgeIds: number[] }`.

A witness has a closed vertices array and edgeIds identifying each traversed input edge. Undirected loops and parallel edges form cycles of lengths one and two; directed arcs retain their direction. All graph vertices are integer indices from `0` to `vertexCount - 1`; edges are copied into algorithm-owned structures. Options are per call; no global configuration.

## Errors, ownership and limits

Iterative O(V+E) DFS; up to 100,000 vertices and 1,000,000 edges. First witness follows input adjacency order. Invalid vertex counts, endpoints, edge shapes, option values, work exhaustion, and impossible numeric results raise `RangeError`. Results are fresh arrays/objects; input arrays are not mutated.

Synchronous algorithms are bounded by stated input/work limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, or callbacks. Finite floating-point behavior applies where weights are used. No I/O, network, persistence, or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript NodeNext builds produce ESM, CommonJS, and declarations. Installed ESM/CommonJS consumer checks and seeded or exhaustive reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
