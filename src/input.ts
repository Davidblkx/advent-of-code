import { buildPuzzleInput } from "./path.ts";

export interface PuzzleInput {
  solution?: string;
  input: string;
}

export async function readInput(
  year?: number,
  day?: number,
  type?: string
): Promise<PuzzleInput> {
  const inputPath = await buildPuzzleInput(year, day, type);
  // console.log(`Reading ${inputPath}`);

  const rawText = await Deno.readTextFile(inputPath);

  const [solution, input] = rawText.split("#-------#").map((s) => s.trim());

  return {
    input,
    solution: solution === "[RESULT]" ? undefined : solution,
  };
}
