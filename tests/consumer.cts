import {
  directedCycleWitness,
  undirectedCycleWitness,
  type CycleWitness,
  type GraphEdge,
} from '@lp-labs/graph-cycle-analysis';
export type PublicTypes = [GraphEdge, CycleWitness];
void directedCycleWitness;
void undirectedCycleWitness;
// @ts-expect-error public API requires numeric vertex counts
undirectedCycleWitness('invalid', []);
