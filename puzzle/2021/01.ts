export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 1 of Advent of Code 2021
export function execute(input: string): Promise<number[]> {
  const nInput = input.split('\n').map(Number);
  
  return Promise.resolve([
    chalenge1(nInput),
    chalenge2(nInput)
  ]);
}

/** Count number of increments */
function chalenge1(input: number[]): number {
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    const n1 = input[i];
    const n2 = input[(i + 1)];

    if (Number.isNaN(n1) || Number.isNaN(n2)) {
      continue;
    }

    if (n2 > n1) { count++ }
  }

  return count;
}

/** Count number of increments for each block of 3 entries */
function chalenge2(input: number[]): number {
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    const b1 = getBlockSum(input, i, 3);
    const b2 = getBlockSum(input, i + 1, 3);

    if (Number.isNaN(b1) || Number.isNaN(b2)) {
      continue;
    }
    
    if (b2 > b1) { count++ }
  }

  return count;
}

function getBlockSum(n: number[], start: number, length: number): number {
  let sum = 0;

  for (let i = start; i < start + length; i++) {
    if (Number.isNaN(n[i])) { return Number.NaN; }
    sum += n[i];
  }

  return sum;
}