import { Node } from "./node.ts";

export class BinaryHeap {
  public content: Node[] = [];
  public scoreFn: (node: Node) => number;

  public constructor(public scoreFunction: (node: Node) => number) {
    this.scoreFn = scoreFunction;
  }

  public down(i: number): void {
    const elem = this.content[i];

    while (i > 0) {
      const parentI = ((i + 1) >> 1) - 1;
      const parent = this.content[parentI];

      if (this.scoreFn(elem) >= this.scoreFn(parent)) { break; }

      this.content[parentI] = elem;
      this.content[i] = parent;

      i = parentI;
    }
  }

  public up(i: number): void {
    const length = this.content.length;
    const elem = this.content[i];
    const elemScore = this.scoreFunction(elem);

    while (true) {
      const c2I = (i + 1) << 1;
      const c1I = c2I - 1;

      let swapI: undefined | number = undefined;
      let c1Score = Number.NEGATIVE_INFINITY;

      if (c1I < length) {
        const c1 = this.content[c1I];
        c1Score = this.scoreFunction(c1);

        if (c1Score < elemScore) {
          swapI = c1I;
        }
      }

      if (c2I < length) {
        const c2 = this.content[c2I];
        const c2Score = this.scoreFunction(c2);

        if (c2Score < (swapI === undefined ? elemScore : c1Score)) {
          swapI = c2I;
        }
      }

      if (typeof swapI === 'undefined') { break; }

      this.content[i] = this.content[swapI];
      this.content[swapI] = elem;
      i = swapI;
    }
  }

  public push(node: Node): void {
    this.content.push(node);
    this.down(this.content.length - 1);
  }

  public pop(): Node {
    const result = this.content[0];
    const end = this.content.pop();

    if (end && this.content.length > 0) {
      this.content[0] = end;
      this.up(0);
    }

    return result;
  }

  public remove(node: Node): void {
    const i = this.content.indexOf(node);

    if (i !== -1) {
      const end = this.content.pop();

      if (end && i !== this.content.length) {
        this.content[i] = end;

        if (this.scoreFunction(end) < this.scoreFunction(node)) {
          this.down(i);
        } else {
          this.up(i);
        }
      }
    }
  }

  public update(node: Node): void {
    const i = this.content.indexOf(node);

    if (i !== -1) {
      this.down(i);
    }
  }

  public size(): number {
    return this.content.length;
  }
}