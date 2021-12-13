
// Solution for day 11 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input1 = _input.split('\n').map(e => e.split('').map(Number))
  const input2 = _input.split('\n').map(e => e.split('').map(Number))

  return Promise.resolve([
    runSimulation(input1, 100).flash, 
    calcSync(input2)
  ]);
}

interface SimResult {
  map: number[][];
  it: number;
  flash: number;
}
type Point = { x: number; y: number }

function runSimulation(input: number[][], iterations: number): SimResult {
  const res: SimResult = {
    flash: 0,
    it: iterations,
    map: input
  }

  for (let i = 0; i < iterations; i++) {
    runStep(res)
  }

  return res;
}

function getNeighbours(map: number[][], point: Point): Point[] {
  const res: Point[] = [];
  const { x, y } = point;

  if (x > 0) {
    if (map[y][x - 1] !== 0) {
      res.push({ x: x - 1, y });
    }
  }
  if (x < map[y].length - 1) {
    if (map[y][x + 1] !== 0) {
      res.push({ x: x + 1, y });
    }
  }
  if (y > 0) {
    if (map[y - 1][x] !== 0) {
      res.push({ x, y: y - 1 });
    }
  }
  if (y < map.length - 1) {
    if (map[y + 1][x] !== 0) {
    res.push({ x, y: y + 1 });
    }
  }
  if (x > 0 && y > 0) {
    if (map[y - 1][x - 1] !== 0) {
    res.push({ x: x - 1, y: y - 1 });
    }
  }
  if (x < map[y].length - 1 && y > 0) {
    if (map[y - 1][x + 1] !== 0) {
    res.push({ x: x + 1, y: y - 1 });
    }
  }
  if (x > 0 && y < map.length - 1) {
    if (map[y + 1][x - 1] !== 0) {
    res.push({ x: x - 1, y: y + 1 });
    }
  }
  if (x < map[y].length - 1 && y < map.length - 1) {
    if (map[y + 1][x + 1] !== 0) {
    res.push({ x: x + 1, y: y + 1 });
    }
  }

  return res;
}

function runStep(sim: SimResult): SimResult {
  const map = sim.map;
  const flash: Point[] = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x] = (map[y][x] || 0) + 1;
      if (map[y][x] > 9) {
        map[y][x] = 0;
        flash.push({ x, y });
      }
    }
  }

  while (flash.length > 0) {
    sim.flash++;
    const { x, y } = flash.shift()!;
    const neighbours = getNeighbours(map, { x, y });
    for (const n of neighbours) {
      map[n.y][n.x] = (map[n.y][n.x] || 0) + 1;
      if (map[n.y][n.x] > 9) {
        map[n.y][n.x] = 0;
        flash.push(n);
      }
    }
  }

  return sim;
}

function calcSync(map: number[][]): number {
  let calcMap = map.map(e => e.slice());
  let it = 0;

  while (true) {
    it++;
    calcMap = runSimulation(calcMap, 1).map;

    if (calcMap.every(e => e.every(e => e === 0))) {
      break;
    }
  }

  return it;
}