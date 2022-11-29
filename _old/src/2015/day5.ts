
// Solution for day 5 of Advent of Code 2015
export function execute(_input: string): Promise<number[]> {
  const input = _input.split('\n');

  return Promise.resolve([
    countNiceStrings(input),   
    0
  ]);
}

function countContains(target: string, toMatch: string[]): number {
  let count = 0;
  for (const match of toMatch) {
    if (target.indexOf(match) >= 0) {
      count++;
    }
  }
  return count;
}

function containsSquencialDuplicates(target: string): boolean {
  for (let i = 0; i < target.length - 1; i++) {
    if (target[i] === target[i + 1]) {
      return true;
    }
  }
  return false;
}

function isNiceString(val: string): boolean {
  return countContains(val, ['a', 'e', 'i', 'o', 'u']) >= 3 &&
    countContains(val, ['ab', 'cd', 'pq', 'xy']) === 0 &&
    containsSquencialDuplicates(val);
}

function countNiceStrings(input: string[]): number {
  return input.filter(isNiceString).length;
}
