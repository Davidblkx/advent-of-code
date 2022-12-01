export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 12 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split('\n').map(mapPairs);

  return Promise.resolve([
    findPathsNoRepeat(input, ['start']).length,
    findPathsAtMost2(input, ['start']).length,
  ]);
}

type Pair = [string, string];

function mapPairs(input: string): Pair {
  return input.split('-') as Pair;
}

function findConnections(value: string, list: Pair[]): string[] {
  const res: string[] = [];

  for (const [p1, p2] of list) {
    if (p1 === value) { res.push(p2); }
    if (p2 === value) { res.push(p1); }
  }

  return res;
}

function findPathsNoRepeat(pairs: Pair[], path: string[]): string[][] {
  const res: string[][] = [];
  
  const last = path[path.length - 1];
  const connections = findConnections(last, pairs);
  for (const c of connections) {
    if (path.includes(c) && c.toLowerCase() === c) { continue; }
    else if (c === 'end') { res.push([...path, c]); }
    else {
      const newPath = [...path, c];
      res.push(...findPathsNoRepeat(pairs, newPath));
    }
  }

  return res;
}

function hasSmallCaveTwice(path: string[]): boolean {
  for (const p of path) {
    if (p === 'start') { continue; }
    if (p.toLowerCase() !== p) { continue }
    if (path.filter(e => e === p).length > 1) {
      return true; 
    }
  }

  return false;
}

function findPathsAtMost2(pairs: Pair[], path: string[]): string[][] {
  const res: string[][] = [];
  
  const last = path[path.length - 1];
  const connections = findConnections(last, pairs);
  const sm2 = hasSmallCaveTwice(path);
  for (const c of connections) {
    if (c === 'start') { continue; }
    if (sm2 && path.includes(c) && c.toLowerCase() === c) { continue; }
    else if (c === 'end') { res.push([...path, c]); }
    else {
      const newPath = [...path, c];
      res.push(...findPathsAtMost2(pairs, newPath));
    }
  }

  return res;
}