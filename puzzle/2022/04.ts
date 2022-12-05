import { Solution } from "../../src/mod.ts";

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  return input.split("\n").map((line) => {
    const area = line.split(",");
    const p1 = area[0].split("-").map((n) => parseInt(n, 10));
    const p2 = area[1].split("-").map((n) => parseInt(n, 10));

    return {
      p1: [p1[0], p1[1]],
      p2: [p2[0], p2[1]],
    };
  });
}

function solution1(input: ReturnType<typeof prepareInput>) {
  let count = 0;
  for (const p of input) {
    if (p.p1[0] <= p.p2[0] && p.p1[1] >= p.p2[1]) {
      count++;
    } else if (p.p2[0] <= p.p1[0] && p.p2[1] >= p.p1[1]) {
      count++;
    }
  }

  return count.toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  let count = 0;

  for (const { p1, p2 } of input) {
    const [xS, xE] = p1;
    const [yS, yE] = p2;
    if (
      inPair(xS, xE, yS) ||
      inPair(xS, xE, yE) ||
      inPair(yS, yE, xS) ||
      inPair(yS, yE, xE)
    ) {
      count++;
    }
  }

  return count.toString();
}

function inPair(x: number, y: number, p: number) {
  return x <= p && y >= p;
}
