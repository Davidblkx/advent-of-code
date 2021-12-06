
// Solution for day 2 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split("\n").map(mapLineToNavEntry);
  
  return Promise.resolve([
    chalenge1(input),
    chalenge2(input)
  ]);
}

type NavAction = 'up' | 'down' | 'forward';
interface NavEntry {
  action: NavAction;
  steps: number;
}

function mapLineToNavEntry(line: string): NavEntry {
  const [action, steps] = line.split(" ") as [NavAction, string];
  return {
    action,
    steps: Number(steps)
  }
}

function chalenge1(input: NavEntry[]): number {
  let x = 0;
  let y = 0;

  for (const entry of input) {
    switch (entry.action) {
      case 'up':
        y -= entry.steps;
        break;
      case 'down':
        y += entry.steps;
        break;
      case 'forward':
        x += entry.steps;
        break;
    }
  }

  return x * y;
}

function chalenge2(input: NavEntry[]): number {
  let x = 0;
  let y = 0;
  let aim = 0;

  for (const entry of input) {
    switch (entry.action) {
      case 'up':
        aim -= entry.steps;
        break;
      case 'down':
        aim += entry.steps;
        break;
      case 'forward':
        x += entry.steps;
        y += aim * entry.steps;
        break;
    }
  }

  return x * y;
}