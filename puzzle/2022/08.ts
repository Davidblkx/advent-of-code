import { Solution } from '../../src/mod.ts';

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  const lines = input.split('\n');
  const rowCount = lines.length;
  const map: number[][] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = lines[i].split('');
    for (let j = 0; j < row.length; j++) {
      const n = Number(row[j]);
      if (!isNaN(n)) {
        map[i] = map[i] || [];
        map[i][j] = n;
      }
    }
  }

  return {
    rowCount,
    map,
    colCount: map[0].length,
  }
}

function solution1(input: ReturnType<typeof prepareInput>) {
  let visible = input.colCount * input.rowCount;

  for (let r = 1; r < input.rowCount - 1; r++) {
    for (let c = 1; c < input.colCount - 1; c++) {
      if (isHidden(input.map, r, c)) {
        visible--;
      }
    }
  }

  return visible.toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  let score = 0;

  for (let r = 1; r < input.rowCount - 1; r++) {
    for (let c = 1; c < input.colCount - 1; c++) {
      const s = calcScore(input.map, r, c);
      if (s > score) {
        score = s;
      }
    }
  }

  return score.toString();
}

function isHidden(map: number[][], r: number, c: number) {
  const n = map[r][c];
  const res = [true, true, true, true];
  
  let list = [];
  for (let ri = r - 1; ri >= 0; ri--) {
    list.push(map[ri][c]);
  }
  res[0] = !list.every(x => x < n);

  list = [];
  for (let ri = r + 1; ri < map.length; ri++) {
    list.push(map[ri][c]);
  }
  res[1] = !list.every(x => x < n);

  list = [];
  for (let ci = c - 1; ci >= 0; ci--) {
    list.push(map[r][ci]);
  }
  res[2] = !list.every(x => x < n);

  list = [];
  for (let ci = c + 1; ci < map[0].length; ci++) {
    list.push(map[r][ci]);
  }
  res[3] = !list.every(x => x < n);

  return res.every(x => x);
}

function calcScore(map: number[][], r: number, c: number) {
  const t = map[r][c];
  const res = [1, 1, 1, 1];

  let count = 0;
  for (let ri = r - 1; ri >= 0; ri--) {
    count++;
    const n = map[ri][c];
    if (n >= t) break;
  }
  res[0] = count;

  count = 0;
  for (let ri = r + 1; ri < map.length; ri++) {
    count++;
    const n = map[ri][c];
    if (n >= t) break;
  }
  res[1] = count;

  count = 0;
  for (let ci = c - 1; ci >= 0; ci--) {
    count++;
    const n = map[r][ci];
    if (n >= t) break;
  }
  res[2] = count;

  count = 0;
  for (let ci = c + 1; ci < map[0].length; ci++) {
    count++;
    const n = map[r][ci];
    if (n >= t) break;
  }
  res[3] = count;

  return res.reduce((a, b) => a * b, 1);
}