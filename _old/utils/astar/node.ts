export class Node {
  public x: number;
  public y: number;
  public weight: number;

  public f = 0;
  public g = 0;
  public h = 0;
  public visited = false;
  public closed = false;
  public parent?: Node;

  constructor(x: number, y: number, weight: number) {
    this.x = x;
    this.y = y;
    this.weight = weight;
  }

  public getCost(n?: Node): number {
    if (n && n.x !== this.x && n.y !== this.y) {
      // Diagonal
      return this.weight * Math.sqrt(2);
    }

    return this.weight;
  }

  public isWall() {
    return this.weight === 0;
  }

  public toString() { return `[${this.x},${this.y}]`; }

  public reset(): void {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = undefined;
  }
}