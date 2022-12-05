import { buildPuzzleInput } from "./path.ts";

export interface PuzzleInput {
  solution?: string[];
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

  if (rawText.indexOf("#-------#") < 0) {
    return { input: rawText };
  }

  const [solution, input] = rawText.split("#-------#");

  return {
    input,
    solution: solution.startsWith("[RESULT") ? undefined : solution.split("|").map((s) => s.trim()),
  };
}
