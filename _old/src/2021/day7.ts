
// Solution for day 7 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split(",").map(Number);

  return Promise.resolve([
    calcShortestDistance(input, false),
    calcShortestDistance(input, true),
  ]);
}

function findDistance(array: number[], target: number): number {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += Math.abs(array[i] - target);
  }
  return total;
}

function findGradualDistance(array: number[], target: number): number {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    const steps = Math.abs(array[i] - target);
    for (let s = 1; s <= steps; s++) {
      total += s;
    }
  }
  return total;
}

function calcShortestDistance(array: number[], gradual: boolean): number {
  const min = Math.min(...array);
  const max = Math.max(...array);
  let result = Infinity;

  for (let d = min; d <= max; d++) {
    const distance = gradual ? findGradualDistance(array, d) : findDistance(array, d);
    if (distance < result) {
      result = distance;
    }
  }

  return result;
}