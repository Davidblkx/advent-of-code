export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}


// Solution for day 4 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([
    chalenge1(_input),
    chalenge2(_input)
  ]);
}

function chalenge1(_input: string): number {
  const [values, boards] = readBoards(_input);
  const solutions: Solution1 = [];

  let lastNumber = -1;
  let res = -1;
  for (let i = 0; i < values.length; i++) {
    lastNumber = values[i];
    
    for (let j = 0; j < boards.length; j++) {
      const pos = existInBoard(boards[j], lastNumber);
      if (!pos) continue;

      res = addToSolution1(j, solutions, pos, lastNumber, boards) ?? -1;
      if (res > 0) break;
    }

    if (res > 0) break;

  }

  if (res < 0) return -1;
  
  return res * lastNumber;
}

/** [rows, columns] */
type Solution1 = [Map<number, Set<number>>, Map<number, Set<number>>][];

function chalenge2(_input: string): number {
  const [values, boards] = readBoards(_input);
  const solutions: Solution1 = [];

  let lastNumber = -1;
  let res = -1;
  const winners = new Set<number>();
  for (let i = 0; i < values.length; i++) {
    lastNumber = values[i];
    
    for (let j = 0; j < boards.length; j++) {
      const pos = existInBoard(boards[j], lastNumber);
      if (!pos) continue;

      res = addToSolution2(j, solutions, pos, lastNumber, boards, winners) ?? -1;
      if (res > 0) break;
    }

    if (res > 0) break;

  }

  if (res < 0) return -1;
  
  return res * lastNumber;
}

function readBoards(input: string): [number[], number[][][]] {
  const lines = input.split("\n");
  const values = lines[0].split(",").map(Number);
  const boards: number[][][] = [];
  
  let board: number[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.length < 3) {
      if (board.length > 0)
        boards.push(board);
      board = [];
      continue;
    }

    const row = line.split(/\s+/).filter(e => e !== '').map(Number);
    board.push(row);
  }

  if (board.length > 0)
    boards.push(board);

  return [values, boards];
}

function existInBoard(board: number[][], value: number): [number, number] | undefined {
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === value) {
        return [i, j];
      }
    }
  }

  return undefined;
}

function addToSolution1(index: number, solution: Solution1, pos: [number, number], value: number, boards: number[][][]): number | undefined {
  const board = solution[index] ?? [new Map<number, Set<number>>(), new Map<number, Set<number>>()];

  const rowSet = board[0].get(pos[0]) ?? new Set<number>();
  rowSet.add(value);
  board[0].set(pos[0], rowSet);
  if (rowSet.size === 5) {
    return calculateSumNotInSets([...board[0].values(), ...board[1].values()], boards[index].flat());
  }

  const colSet = board[1].get(pos[1]) ?? new Set<number>();
  colSet.add(value);
  board[1].set(pos[1], colSet);
  if (colSet.size === 5) return calculateSumNotInSets([...board[0].values(), ...board[1].values()], boards[index].flat());

  solution[index] = board;
}

function calculateSumNotInSets(set: Set<number>[], values: number[]): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!set.some(s => s.has(value)))
      sum += value;
  }

  return sum;
}

function addToSolution2(index: number, solution: Solution1, pos: [number, number], value: number, boards: number[][][], winner: Set<number>): number | undefined {
  const board = solution[index] ?? [new Map<number, Set<number>>(), new Map<number, Set<number>>()];

  const rowSet = board[0].get(pos[0]) ?? new Set<number>();
  rowSet.add(value);
  board[0].set(pos[0], rowSet);
  if (rowSet.size === 5) winner.add(index);

  const colSet = board[1].get(pos[1]) ?? new Set<number>();
  colSet.add(value);
  board[1].set(pos[1], colSet);
  if (colSet.size === 5) winner.add(index);

  if (winner.size === boards.length) {
    const lastWinner = [...winner].pop() ?? 0;
    return calculateSumNotInSets([...board[0].values(), ...board[1].values()], boards[lastWinner].flat());
  }

  solution[index] = board;
}