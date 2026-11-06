export interface GraphEdge {
  from: number;
  to: number;
}
export interface CycleWitness {
  vertices: number[];
  edgeIds: number[];
}
const adjacency = (n: number, edges: readonly GraphEdge[], undirected: boolean) => {
  if (!Number.isSafeInteger(n) || n < 1 || n > 100_000) throw new RangeError('Invalid vertexCount');
  if (!Array.isArray(edges) || edges.length > 1_000_000) throw new RangeError('Invalid edges');
  const lists: { to: number; id: number }[][] = Array.from({ length: n }, () => []);
  edges.forEach((edge, id) => {
    if (!edge || typeof edge !== 'object') throw new RangeError('Invalid edge');
    const { from, to } = edge;
    if (
      !Number.isSafeInteger(from) ||
      !Number.isSafeInteger(to) ||
      from < 0 ||
      to < 0 ||
      from >= n ||
      to >= n
    )
      throw new RangeError('Edge endpoint out of range');
    lists[from]!.push({ to, id });
    if (undirected) lists[to]!.push({ to: from, id });
  });
  return lists;
};

export function directedCycleWitness(
  vertexCount: number,
  edges: readonly GraphEdge[],
): CycleWitness | null {
  const lists = adjacency(vertexCount, edges, false);
  const color = new Uint8Array(vertexCount);
  const parent = new Int32Array(vertexCount).fill(-1);
  const parentEdge = new Int32Array(vertexCount).fill(-1);
  for (let root = 0; root < vertexCount; root++) {
    if (color[root]) continue;
    color[root] = 1;
    const nodes = [root];
    const cursor = [0];
    while (nodes.length) {
      const top = nodes.length - 1;
      const node = nodes[top]!;
      if (cursor[top]! === lists[node]!.length) {
        color[node] = 2;
        nodes.pop();
        cursor.pop();
        continue;
      }
      const edge = lists[node]![cursor[top]!]!;
      cursor[top] = cursor[top]! + 1;
      if (!color[edge.to]) {
        color[edge.to] = 1;
        parent[edge.to] = node;
        parentEdge[edge.to] = edge.id;
        nodes.push(edge.to);
        cursor.push(0);
      } else if (color[edge.to] === 1) {
        const path = [node];
        while (path[path.length - 1] !== edge.to) path.push(parent[path[path.length - 1]!]!);
        path.reverse();
        const edgeIds = path.slice(1).map((v) => parentEdge[v]!);
        edgeIds.push(edge.id);
        path.push(edge.to);
        return { vertices: path, edgeIds };
      }
    }
  }
  return null;
}

export function undirectedCycleWitness(
  vertexCount: number,
  edges: readonly GraphEdge[],
): CycleWitness | null {
  const lists = adjacency(vertexCount, edges, true);
  const seen = new Uint8Array(vertexCount);
  const parent = new Int32Array(vertexCount).fill(-1);
  const parentEdge = new Int32Array(vertexCount).fill(-1);
  for (let root = 0; root < vertexCount; root++) {
    if (seen[root]) continue;
    seen[root] = 1;
    const nodes = [root];
    const cursor = [0];
    while (nodes.length) {
      const top = nodes.length - 1;
      const node = nodes[top]!;
      if (cursor[top]! === lists[node]!.length) {
        nodes.pop();
        cursor.pop();
        continue;
      }
      const edge = lists[node]![cursor[top]!]!;
      cursor[top] = cursor[top]! + 1;
      if (edge.id === parentEdge[node]) continue;
      if (!seen[edge.to]) {
        seen[edge.to] = 1;
        parent[edge.to] = node;
        parentEdge[edge.to] = edge.id;
        nodes.push(edge.to);
        cursor.push(0);
      } else {
        const ancestors = new Map<number, number>();
        let current = node;
        const left: number[] = [];
        while (current >= 0) {
          ancestors.set(current, left.length);
          left.push(current);
          current = parent[current]!;
        }
        const right: number[] = [];
        current = edge.to;
        while (!ancestors.has(current)) {
          right.push(current);
          current = parent[current]!;
        }
        const lca = current;
        const vertices = [...left.slice(0, ancestors.get(lca)! + 1), ...right.reverse(), node];
        const edgeIds: number[] = [];
        for (let i = 0; i < vertices.length - 2; i++) {
          const currentVertex = vertices[i]!;
          const nextVertex = vertices[i + 1]!;
          if (nextVertex === parent[currentVertex]) edgeIds.push(parentEdge[currentVertex]!);
          else edgeIds.push(parentEdge[nextVertex]!);
        }
        edgeIds.push(edge.id);
        return { vertices, edgeIds };
      }
    }
  }
  return null;
}
