
// Solution for day 1 of Advent of Code 2015
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([
    calculateFloor(_input),
    calculateFloorPart2(_input)
  ]);
}

/**
 * '('  go up
 * ')'  go down
 * 
 * calculate the floor
 */
export function calculateFloor(input: string): number {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
      floor++;
    } else {
      floor--;
    }
  }
  return floor;
}

export function calculateFloorPart2(input: string): number {
  let floor = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
      floor++;
    } else {
      floor--;
    }
    if (floor === -1) {
      return i + 1;
    }
  }
  return -1;
}