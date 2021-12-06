
// Solution for day 2 of Advent of Code 2015
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([
    challenge1(_input),
    challenge2(_input)
  ]);
}

type Size = [number, number, number];

function calculateSides(size: Size): number[] {
  const sides = [
    size[0] * size[1],
    size[1] * size[2],
    size[2] * size[0]
  ];
  return sides;
}

function parseSize(input: string): Size {
  const [l, w, h] = input.split('x').map(Number);
  return [l, w, h];
}

function calcArea(sides: number[]): number {
  return sides.map(x => x * 2).reduce((a, b) => a + b, 0);
}

function calcToOrder(input: string): number {
  const size = parseSize(input);
  const sides = calculateSides(size);
  return calcArea(sides) + Math.min(...sides);
}

function challenge1(input: string): number {
  return input.split('\n')
    .map(calcToOrder)
    .reduce((a, b) => a + b, 0);
}

function calcRibbon(sides: number[]): number {
  const sorted = sides.sort((a, b) => a - b);
  return (2 * sorted[0]) + (2 * sorted[1]) + (sorted[0] * sorted[1] * sorted[2]);
}

function challenge2(input: string): number {
  return input.split('\n')
    .map(parseSize)
    .map(calcRibbon)
    .reduce((a, b) => a + b, 0);
}