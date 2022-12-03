import { Solution } from "../../src/mod.ts";

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  return input.split("\n");
}

function solution1(input: ReturnType<typeof prepareInput>) {
  return input
    .flatMap((line) => getCommonLetterSplit(line))
    .reduce((acc, letter) => acc + getLetterPoint(letter), 0)
    .toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  let sum = 0;
  for (let i = 0; i < input.length; i += 3) {
    const g1 = getCommonLetters(input[i], input[i + 1]).join("");
    const g2 = getCommonLetters(g1, input[i + 2]);
    sum += getLetterPoint(g2[0]);
  }
  return sum.toString();
}

function getCommonLetterSplit(line: string) {
  const half1 = line.slice(0, line.length / 2);
  const half2 = line.slice(line.length / 2);

  return getCommonLetters(half1, half2);
}

function getCommonLetters(
  half1: string,
  half2: string
): (keyof typeof LETTER_VALUES)[] {
  const com = new Set();

  for (const char of half1) {
    if (half2.includes(char)) {
      com.add(char);
    }
  }

  return [...com] as (keyof typeof LETTER_VALUES)[];
}

function getLetterPoint(letter: keyof typeof LETTER_VALUES) {
  return LETTER_VALUES[letter];
}

const LETTER_VALUES = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  A: 27,
  B: 28,
  C: 29,
  D: 30,
  E: 31,
  F: 32,
  G: 33,
  H: 34,
  I: 35,
  J: 36,
  K: 37,
  L: 38,
  M: 39,
  N: 40,
  O: 41,
  P: 42,
  Q: 43,
  R: 44,
  S: 45,
  T: 46,
  U: 47,
  V: 48,
  W: 49,
  X: 50,
  Y: 51,
  Z: 52,
};
