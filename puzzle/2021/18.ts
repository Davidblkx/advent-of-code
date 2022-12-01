export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}

type SNum = number | [number, number] | [SNum, SNum];

function isPair(n: SNum): n is [number, number] {
  if (!Array.isArray(n)) return false;
  return n.length === 2 && typeof n[0] === 'number' && typeof n[1] === 'number';
}

interface ToExplode {
  input: string;
  pair: string;
  pairIndex: number;
  left?: number;
  leftIndex: number;
  right?: number;
  rightIndex: number;
}

// Solution for day 18 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseInput(_input);

  return Promise.resolve([
    calcMagnitudeForAll(input),
    calcLargestMagnitude(input)
  ]);
}

function parseInput(input: string): SNum[] {
  return input.split('\n').map(line => eval(line));
}

function calcLargestMagnitude(n: SNum[]): number {
  let largest = 0;
  for (const s1 of n) {
    for (const s2 of n) {
      if (JSON.stringify(s1) === JSON.stringify(s2)) continue;
      const sum = calcMagnitudeForAll([s1, s2]);
      if (sum > largest) largest = sum;
    }
  }
  return largest;
}

function calcMagnitudeForAll(n: SNum[]): number {
  const sum = sumAll(n);
  return calcMagnitude(sum);
}

function calcMagnitude(n: SNum): number {
  if (typeof n === 'number') return n;
  if (isPair(n)) {
    return 3 * n[0] + 2 * n[1];
  }
  return calcMagnitude([calcMagnitude(n[0]), calcMagnitude(n[1])]);
}

function sumAll(n: SNum[]): SNum {
  return n.reduce((acc, curr) => {
    const res = acc ? sum(acc, curr) : curr;
    return res;
  });
}

function sum(n1: SNum, n2: SNum): SNum {
  let total: SNum = [n1, n2];

  

  while (true) {
    if (needToExplode(total)) {
      total = explode(total);
    } else if(needToSplit(total)) {
      total = split(total);
    } else {
      break;
    }
  }

  return total
}

function needToExplode(n: SNum): boolean {
  if (!Array.isArray(n)) return false;

  const target = n.flat(3);
  for (const t of target) {
    if (Array.isArray(t)) 
      return true;
  }

  return false;
}

function needToSplit(n: SNum): boolean {
  if (!Array.isArray(n)) return false;
  const toMatch = n.flat(10) as number[];
  return Math.max(...toMatch) > 9;
}

function explode(n: SNum): SNum {
  const toExplode = buildToExplode(n);
  return processToExplode(toExplode);
}

function split(n: SNum): SNum {
  let input = JSON.stringify(n);
  
  const m = input.match(/\d{2}/g);

  if (m) {
    const num = parseInt(m[0], 10);
    const p1 = Math.floor(num / 2);
    const p2 = Math.ceil(num / 2);
    input = input.replace(m[0], `[${p1},${p2}]`);
  }

  

  return eval(input);
}

function findToExplode(n: SNum): string {
  if (!Array.isArray(n))
    throw new Error("n is not an array");

  let input = n.flat(3);
  while (true) {
    for (const t of input) {
      if (isPair(t)) {
        return JSON.stringify(t);
      }
    }
    input = input.flat();
  }
}

function buildToExplode(n: SNum): ToExplode {
  const pair = findToExplode(n);
  
  const input = JSON.stringify(n);
  let left: number | undefined;
  let leftIndex = 0;
  let right: number | undefined;
  let rightIndex = 0;
  let pairIndex = 0;
  let deep = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '[') {
      deep++
    } else if (input[i] === ']') {
      deep--;
    }

    const index = input.substring(i+1).indexOf(pair);
    if (deep >= 4 && index === 0) {
      pairIndex = i+1;
      break;
    }
  }

  for (const m of input.substring(0, pairIndex).matchAll(/\d+/g)) {
    if (m && m[0]) {
      left = parseInt(m[0], 10);
      leftIndex = m.index ?? 0;
    }
  }

  const rightPad = pairIndex + pair.length;
  for (const m of input.substring(rightPad).matchAll(/\d+/g)) {
    if (m && m[0]) {
      right = parseInt(m[0], 10);
      rightIndex = (m.index ?? 0) + rightPad;
      break;
    }
  }

  return {
    input,
    pair,
    pairIndex,
    left,
    leftIndex: leftIndex,
    right,
    rightIndex: rightIndex
  }
}

function processToExplode(to: ToExplode): SNum {
  const p: [number, number] = JSON.parse(to.pair);
  

  if (typeof to.right === 'number') {
    const next = (p[1] + to.right).toString();
    to.input = to.input.substring(0, to.rightIndex) + next + to.input.substring(to.rightIndex + to.right.toString().length);
  }

  let leftLength = 0;
  if (typeof to.left === 'number') {
    const next = (p[0] + to.left).toString();
    to.input = to.input.substring(0, to.leftIndex) + next + to.input.substring(to.leftIndex + to.left.toString().length);
    leftLength = next.length - to.left.toString().length;
  }

  const pt1 = to.input.substring(0, to.pairIndex + leftLength)
  const pt2 = to.input.substring(to.pairIndex + leftLength + to.pair.length);
  to.input = pt1 + '0' + pt2;
  
  return eval(to.input);
}