
// Solution for day 9 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input  = parseInput(_input);

  return Promise.resolve([
    countLowest(input),
    calcBasins(input),
  ]);
}

type Pos = { x: number, y: number, val: number };
type PosList = Pos[];

export function parseInput(input: string): number[][] {
  return input.split('\n').map(line => line.split('').map(Number));
}

function countLowest(input: number[][]): number {
  let count = 0;
  
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const val = input[y][x];
      const top = y === 0 ? -1 : input[y - 1][x];
      const left = x === 0 ? -1 : input[y][x - 1];
      const right = x === input[y].length - 1 ? -1 : input[y][x + 1];
      const bottom = y === input.length - 1 ? -1 : input[y + 1][x];

      if ((val < top || top === -1 ) && (val < left || left === -1) && (val < right || right === -1) && (val < bottom || bottom === -1)) {
        count += (val + 1);
      }
    }
  }

  return count;
}

// Found if [x, y] is in list
function isInList(n: [number, number], list: PosList[]): boolean {
  for (const l of list) {
    if (l.some(p => p.x === n[0] && p.y === n[1])) {
      return true;
    }
  }

  return false;
}

function findBasin(input: number[][], x: number, y: number, p: Pos[]): Pos[] {
  if (input[y][x] === 9 || isInList([x, y], [p])) return p;
  p.push({ x, y, val: input[y][x] });
  
  const topY = y === 0 ? -1 : y - 1;
  const leftX = x === 0 ? -1 : x - 1;
  const rightX = x === input[y].length - 1 ? -1 : x + 1;
  const bottomY = y === input.length - 1 ? -1 : y + 1;

  if (topY !== -1) findBasin(input, x,  topY, p);
  if (leftX !== -1) findBasin(input, leftX, y, p);
  if (rightX !== -1) findBasin(input, rightX, y, p);
  if (bottomY !== -1) findBasin(input, x, bottomY, p);

  return p;
}

function listBasins(input: number[][]): PosList[] {
  const res: PosList[] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (isInList([x, y], res)) { continue; }
      if (input[y][x] === 9) continue;
      res.push(findBasin(input, x, y, []));
    }
  }

  return res;
}

function calcBasins(input: number[][]): number {
  const basins = listBasins(input);
  const sortBySize = basins.sort((a, b) => b.length - a.length);
  
  const p1 = sortBySize[0]?.length ?? 1;
  const p2 = sortBySize[1]?.length ?? 1;
  const p3 = sortBySize[2]?.length ?? 1;

  return p1 * p2 * p3;
}
