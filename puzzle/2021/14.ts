export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 14 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseInput(_input);
  return Promise.resolve([
    calcPolymer(input, 10),
    calcPolymer(input, 40),
  ]);
}

interface Input {
  solution: { [key: string]: number; }
  pairs: { [key: string]: string; }
  freq: Map<string, number>
}

function parseInput(input: string): Input {
  const lines = input.split('\n');
  const res: Input = {
    solution: {},
    pairs: {},
    freq: new Map()
  };

  for (const l of lines) {
    if (l.includes('->')) {
      const [pair, value] = l.split(' -> ');
      res.pairs[pair] = value;
    } else if (l.length > 0) {
      let key = '';
      for (let i = 0; i < l.length; i++) {
        key += l[i];
        if (key.length === 2) {
          res.solution[key] = (res.solution[key] || 0) + 1;
          key = l[i];
        }
        res.freq.set(l[i], (res.freq.get(l[i]) || 0) + 1);
      }
    }
  }

  return res;
}

function calcCycle(input: Input): void {
  const keys = Object.keys(input.solution);
  const nextSolution: { [key: string]: number; } = {};

  for (const key of keys) {
    const v = input.pairs[key];
    const k1 = key[0] + v;
    const k2 = v + key[1];
    nextSolution[k1] = (nextSolution[k1] || 0) + input.solution[key];
    nextSolution[k2] = (nextSolution[k2] || 0) + input.solution[key];
    input.freq.set(v, (input.freq.get(v) || 0) + input.solution[key]);
  }
  input.solution = nextSolution;
}

function calcNCycles(input: Input, n: number): void {
  for (let i = 0; i < n; i++) {
    calcCycle(input);
  }
}

function calcPolymer(input: Input, n: number): number {
  const newInput: Input = {
    solution: {...input.solution},
    pairs: {...input.pairs},
    freq: new Map(input.freq)
  };
  calcNCycles(newInput, n);

  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (const [_, value] of newInput.freq.entries()) {
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return max - min;
}