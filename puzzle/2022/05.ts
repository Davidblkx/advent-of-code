import { Solution } from '../../src/mod.ts';

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  return input;
}

function solution1(input: ReturnType<typeof prepareInput>) {
  return 'Not implemented';
}

function solution2(input: ReturnType<typeof prepareInput>) {
  return 'Not implemented';
}