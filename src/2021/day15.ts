import { AStar } from '../../utils/index.ts'

// Solution for day 15 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseInput(_input);
  const total = calcNextGrid(input);
  return Promise.resolve([
    AStar.search(input),
    AStar.search(total),
  ]);
}

function parseInput(input: string): number[][] {
  return input.split("\n")
    .map((line) => line.split('').map(Number));
}

function calcNextGrid(input: number[][]): number[][] {
  const res: number[][] = [];
  const ySize = input.length * 5;
  const xSize = input[0].length * 5;

  for (let y = 0; y < ySize; y++) {
    const yWeight = Math.floor(y / input.length);
    let pY = y;
    while (pY >= input.length) { pY -= input.length; }

    for (let x = 0; x < xSize; x++) {
      const xWeight = Math.floor(x / input[0].length);
      let pX = x;
      while (pX >= input[0].length) { pX -= input[0].length; }

      res[y] = res[y] || [];
      res[y][x] = input[pY][pX] + yWeight + xWeight;
      while (res[y][x] >= 10) { res[y][x] -= 9; }
    }
  }

  return res;
}