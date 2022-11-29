
// Solution for day 10 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split('\n');

  return Promise.resolve([
    calcErrorPoints(input),
    calcMissingCloseChar(input),
  ]);
}

const openChar = ['(', '{', '<', '['];
const closeChar = [')', '}', '>', ']'];
const charPoints = [3, 1197, 25137, 57]
const closePoints = [1, 3, 4, 2];

function validateLine(line: string): number | true {
  const open: string[] = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (openChar.includes(char)) {
      open.push(char);
    } else {
      const last = open.pop();
      if (last === undefined || closeChar.indexOf(char) !== openChar.indexOf(last)) {
        return i;
      }
    }
  }

  return true;
}

function autoComplete(input: string): string | boolean {
  const open: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (openChar.includes(char)) {
      open.push(char);
    } else if (closeChar.includes(char)) {
      const last = open.pop();
      if (last === undefined || closeChar.indexOf(char) !== openChar.indexOf(last)) {
        return false;
      }
    }
  }

  if (open.length === 0) return true;

  const missingCloseChar: string[] = [];
  for (let i = open.length - 1; i >= 0; i--) {
    missingCloseChar.push(closeChar[openChar.indexOf(open[i])]);
  }

  return missingCloseChar.join('');
}

function calcErrorPoints(input: string[]): number {
  let points = 0;

  for (const line of input) {
    const error = validateLine(line);
    if (error !== true) {
      const char = line[error];
      points += charPoints[closeChar.indexOf(char)];
    }
  }

  return points;
}

function findMiddleNumber(input: number[]): number {
  const sorted = input.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted[middle];
}

function calcScoreMissingCloseChar(input: string[]): number {
  const scores: number[] = [];

  for (const line of input) {
    let score = 0;
    for (const char of line) {
      const index = closeChar.indexOf(char);
      score *= 5;
      score += closePoints[index];
    }
    scores.push(score);
  }

  return findMiddleNumber(scores);
}

function calcMissingCloseChar(input: string[]): number {
  const missing = input.map(autoComplete).filter(e => typeof e === 'string');

  return calcScoreMissingCloseChar(missing as string[]);
}
