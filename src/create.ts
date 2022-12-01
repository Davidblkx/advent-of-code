import { buildPuzzleInput, buildPuzzleSolution } from "./path.ts";

export async function createPuzzle(year?: number, day?: number): Promise<void> {
  const testInputPath = await buildPuzzleInput(year, day, "test");
  const targetInputPath = await buildPuzzleInput(year, day, "main");
  const solutionPath = await buildPuzzleSolution(year, day);

  await Deno.writeTextFile(testInputPath, INPUT_TEMPLATE);
  await Deno.writeTextFile(targetInputPath, INPUT_TEMPLATE);
  await Deno.writeTextFile(solutionPath, SOLUTION_TEMPLATE);

  console.log(`Created ${solutionPath}`);
}

const SOLUTION_TEMPLATE = `
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
`.trim();

const INPUT_TEMPLATE = `
[RESULT1]|[RESULT2]
#-------#
[INPUT]
`.trim();
