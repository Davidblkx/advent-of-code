export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 19 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([0, 0]);
}