import { Node } from "./node.ts";
import { Graph } from "./graph.ts";
import { BinaryHeap } from './heap.ts';

function heuristic(p0: Node, p1: Node): number {
  const d1 = Math.abs(p1.x - p0.x);
  const d2 = Math.abs(p1.y - p0.y);
  return d1 + d2;
}

function pathTo(node: Node): Node[] {
  let curr = node;
  const path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

export function search(grid: number[][]): number {
  const graph = new Graph(grid);
  const heap = new BinaryHeap(n => n.f);
  let path: Node[] = [];

  const start = graph.grid[0][0];
  const end = graph.grid[grid.length - 1][grid[0].length - 1];
  
  start.h = heuristic(start, end);
  graph.markDirty(start);

  heap.push(start);

  while (heap.size() > 0) {
    const current = heap.pop();

    if (current === end) {
      path = pathTo(current);
      break;
    }

    current.closed = true;

    const neighbors = graph.calcNeighbors(current);

    for (const neighbor of neighbors) {
      if (neighbor.closed || neighbor.isWall()) {
        continue;
      }

      const gScore = current.g + neighbor.getCost(current);
      const visited = neighbor.visited;

      if (!visited || gScore < neighbor.g) {
        neighbor.visited = true;
        neighbor.parent = current;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        graph.markDirty(neighbor);
        
        if (!visited) {
          heap.push(neighbor);
        } else {
          heap.update(neighbor);
        }
      }
    }
  }

  if (path.length === 0) {
    return -1;
  }

  return path.reduce((acc, node) => acc + node.weight, 0);
}