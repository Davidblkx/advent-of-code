
// Solution for day 5 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split("\n");

  return Promise.resolve([
    calcIntersection(input),
    calcIntersection(input, true)
  ]);
}

type Point = { x: number, y: number };

/** 
 * line is "x1,y1 -> x2,y2"
 * split by ' -> '
 */
function parsePoints(line: string): [Point, Point] {
  const [p1, p2] = line.split(" -> ");
  const [x1, y1] = p1.split(",").map(e => parseInt(e, 10));
  const [x2, y2] = p2.split(",").map(e => parseInt(e, 10));
  return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
}

function maxNumber(numbers: number[]): number {
  return numbers.reduce((acc, curr) => Math.max(acc, curr));
}

function initArray(size: number): number[][] {
  const array: number[][] = [];
  for (let i = 0; i < size; i++) {
    array[i] = [];
    for (let j = 0; j < size; j++) {
      array[i][j] = 0;
    }
  }
  return array;
}

function countMoreEqual2(arr: number[][]): number {
  let count = 0;
  for (const row of arr) {
    for (const cell of row) {
      if (cell >= 2) {
        count++;
      }
    }
  }
  return count;
}

function isPair45(p1: Point, p2: Point): boolean {
  return Math.abs(p1.x - p2.x) === Math.abs(p1.y - p2.y);
}

function calcIntersection(input: string[], count45 = false): number {
  const lines = input.map(parsePoints);
  const size = maxNumber(lines.flatMap(e => [e[0].x, e[0].y, e[1].x, e[1].y]));
  const solution = initArray(size + 1);
  
  for (const line of lines) {
    const [start, end] = line;
    if (start.x === end.x) {
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);
      for (let y = minY; y <= maxY; y++) {
        solution[y][start.x]++;
      }
    } else if (start.y === end.y) {
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      for (let x = minX; x <= maxX; x++) {
        solution[start.y][x]++;
      }
    } else if (count45 && isPair45(start, end)) {
      const yIncrement = end.y > start.y ? 1 : -1;
      const xIncrement = end.x > start.x ? 1 : -1;
      
      let x = start.x;
      let y = start.y;
      solution[y][x]++;
      
      while (x !== end.x || y !== end.y) {
        x += xIncrement;
        y += yIncrement;
        solution[y][x]++;
      }
    }
  }
  
  return countMoreEqual2(solution);
}