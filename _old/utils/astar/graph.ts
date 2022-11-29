import { Node } from "./node.ts";

export class Graph {
  public grid: Node[][] = [];
  public nodes: Node[] = [];
  public dirty: Node[] = [];

  constructor(grid: number[][]) {
    this.init(grid);
  }

  private init(gridIn: number[][]): void {
    for (let x = 0; x < gridIn.length; x++) {
      this.grid[x] = [];

      for (let y = 0; y < gridIn[x].length; y++) {
        const node  = new Node(x, y, gridIn[x][y]);
        this.grid[x][y] = node;
        this.nodes.push(node);
      }
    }
    
    this.cleanNodes();
  }

  public cleanNodes(): void {
    for (const n of this.dirty) {
      n.reset();
    }

    this.dirty = [];
  }

  public markDirty(node: Node): void {
    this.dirty.push(node);
  }

  public calcNeighbors(node: Node): Node[] {
    const res: Node[] = [];
    const x = node.x;
    const y = node.y;

    // Left
    if (this.grid[x - 1] && this.grid[x - 1][y]) {
      res.push(this.grid[x - 1][y]);
    }

    // Right
    if (this.grid[x + 1] && this.grid[x + 1][y]) {
      res.push(this.grid[x + 1][y]);
    }

    // Down
    if (this.grid[x] && this.grid[x][y - 1]) {
      res.push(this.grid[x][y - 1]);
    }

    // Up
    if (this.grid[x] && this.grid[x][y + 1]) {
      res.push(this.grid[x][y + 1]);
    }

    return res;
  }
}