export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 6 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split('\n').map(n => parseInt(n, 10));

  return Promise.resolve([
    calcTotalGenerations(80, input),
    calcTotalGenerations(256, input),
  ]);
}

function calcTotalGenerations(days: number, input: number[]): number {
  const solution: number[] = []
  
  for (const n of input) {
    solution[n] = (solution[n] || 0) + 1;
  }

  for (let i = 0; i < days; i++) {
    const pos = (i + 7) % 9;
    const valIndex = i % 9;
    solution[pos] = (solution[pos] || 0) + (solution[valIndex] || 0);
  }

  let sum = 0
  for (const n of solution) {
    sum += n;
  }

  return sum;
}