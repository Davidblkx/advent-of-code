export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 13 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseInput(_input);
  
  return Promise.resolve([
    calculate({ map: input.map, folds: [input.folds[0]] }),
    printFold(input),
  ]);
}

type Point = { x: number; y: number };
type YFold = { y: number; };
type XFold = { x: number; };
type Fold = YFold | XFold;

type Map = number[][];

interface Input {
  map: Map;
  folds: Fold[];
}

function parseInput(input: string): Input {
  const lines = input.split('\n');
  const points: Point[] = [];
  const folds: Fold[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(',')) {
      const [x, y] = line.split(',').map(Number);
      points.push({ x, y });
    } else if (line.includes('=')) {
      const [txt, n] = line.split('=');
      if (txt.endsWith('y')) {
        folds.push({ y: Number(n) });
      } else {
        folds.push({ x: Number(n) });
      }
    }
  }

  return { map: mapPoints(points), folds };
}

function isYFold(fold: Fold): fold is YFold {
  return typeof (fold as YFold).y !== 'undefined';
}

function isXFold(fold: Fold): fold is XFold {
  return typeof (fold as XFold).x !== 'undefined';
}

function mapPoints(points: Point[]): Map {
  const max = Math.max(...points.map(p => p.x), ...points.map(p => p.y));
  const map: Map = new Array(max + 1).fill(0).map(() => new Array(max + 1).fill(0));

  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    if (!map[y]) { map[y] = []; }
    map[y][x] = 1;
  }

  return map;
}

function foldMap(map: Map, fold: Fold): Map {
  const xSize = isXFold(fold) ? fold.x + 1 : map[0].length;
  const ySize = isYFold(fold) ? fold.y + 1 : map.length;

  const newMap: Map = new Array(ySize).fill(0).map(() => new Array(xSize).fill(0));

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) { continue; }
      if (isYFold(fold)) {
        if (y < fold.y) { newMap[y][x] = 1; }
        else {
          const newY = fold.y - Math.abs(y - fold.y);
          newMap[newY][x] = 1;
        }
      } else {
        if (x < fold.x) { newMap[y][x] = 1; }
        else {
          const newX = fold.x - Math.abs(x - fold.x);
          newMap[y][newX] = 1;
        }
      }
    }
  }

  return newMap;
}

function countPoints(map: Map): number {
  return map.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell, 0), 0);
}

function calculate(input: Input): number {
  let map = input.map;
  for (let i = 0; i < input.folds.length; i++) {
    map = foldMap(map, input.folds[i]);
  }

  return countPoints(map);
}

function printFold(input: Input): number {
  let map = input.map;
  for (let i = 0; i < input.folds.length; i++) {
    map = foldMap(map, input.folds[i]);
  }

  for (let y = 0; y < map.length; y++) {
    console.log(map[y].map(c => c === 0 ? '.' : '#').join(''));
  }

  return countPoints(map);
}