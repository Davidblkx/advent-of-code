import { Solution } from '../../src/mod.ts';

export const main: Solution = async (input: string) => {

  let value = prepareInput(input);
  const res1 = await solution1(value);

  value = prepareInput(input);
  const res2 = await solution2(value);

  return [res1, res2];
};

interface Action {
  amount: number;
  from: number;
  to: number;
}

function prepareInput(input: string) {
  const crates = readCrates(input);
  const moves = readMoves(input);

  return { crates, moves };
}

function solution1(input: ReturnType<typeof prepareInput>) {
  const { crates, moves } = input;

  runSingleMoves(crates, moves);

  let res = '';
  for (const crate of crates) {
    const l = crate?.pop();
    if (l) {
      res += l;
    }
  }

  return res;
}

function solution2(input: ReturnType<typeof prepareInput>) {
  const { crates, moves } = input;

  runBulkMove(crates, moves);

  let res = '';
  for (const crate of crates) {
    const l = crate?.pop();
    if (l) {
      res += l;
    }
  }

  return res;
}

function readCrates(input: string) {
  const res: string[][] = [];

  const groupsRegex = /^(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\]\n| {3}\n)/gm
  let groups = [...input.matchAll(groupsRegex)];

  if (groups.length === 0) {
    groups = [...input.matchAll(/^(?:\[(\w)\] | {4})(?:\[(\w)\] | {4})(?:\[(\w)\]\n| {3}\n)/gm)]
  }

  for (const groupMatch of groups) {
    for (let i = 1; i < groupMatch.length; i++) {
      if (!res[i]) res[i] = [];
      const letter = groupMatch[i];
      if (letter) {
        res[i].unshift(letter);
      }
    }
  }

  return res;
}

function readMoves(input: string): Action[] {
  const res: Action[] = [];
  const groups = input.matchAll(/move (\d+) from (\d+) to (\d+)/gm)

  for (const groupMatch of groups) {
    res.push({
      amount: parseInt(groupMatch[1]),
      from: parseInt(groupMatch[2]),
      to: parseInt(groupMatch[3]),
    })
  }

  return res;
}

function runSingleMoves(crates: string[][], moves: Action[]) {
  for (const move of moves) {
    if (!crates[move.from]) crates[move.from] = [];
    if (!crates[move.to]) crates[move.to] = [];

    for (let _ = 0; _ < move.amount; _++) {
      const l = crates[move.from].pop();
      if (l) {
        crates[move.to].push(l);
      } else {
        console.log(`move ${move.amount} from ${move.from} to ${move.to} failed!`)
      }
    }
  }
}

function runBulkMove(crates: string[][], moves: Action[]) {
  for (const move of moves) {
    if (!crates[move.from]) crates[move.from] = [];
    if (!crates[move.to]) crates[move.to] = [];

    const buffer = [];
    for (let _ = 0; _ < move.amount; _++) {
      const l = crates[move.from].pop();
      if (l) {
        buffer.unshift(l);
      } else {
        console.log(`move ${move.amount} from ${move.from} to ${move.to} failed!`)
      }
    }
    
    crates[move.to].push(...buffer);
  }
}