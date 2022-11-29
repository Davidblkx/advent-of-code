import { buildPuzzleInput, buildPuzzleSolution } from "./path.ts";

export async function createPuzzle(year?: number, day?: number): Promise<void> {
  const testInputPath = await buildPuzzleInput(year, day, "test");
  const targetInputPath = await buildPuzzleInput(year, day, "target");
  const solutionPath = await buildPuzzleSolution(year, day);

  await Deno.writeTextFile(testInputPath, INPUT_TEMPLATE);
  await Deno.writeTextFile(targetInputPath, INPUT_TEMPLATE);
  await Deno.writeTextFile(solutionPath, SOLUTION_TEMPLATE);

  console.log(`Created ${solutionPath}`);
}

const SOLUTION_TEMPLATE = `
import { Solution } from '../../src/mod.ts';

export const main: Solution = (input: string) => {
  return 'Not implemented';
};
`.trim();

const INPUT_TEMPLATE = `
[RESULT]
#-------#
[INPUT]
`.trim();
