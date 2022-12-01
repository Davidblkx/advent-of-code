import { join } from "deno/path/mod.ts";
import { buildPuzzleInput, buildPuzzleSolution } from './path.ts';

export async function runImport(start?: number, end?: number) {
  const startYear = start ?? new Date().getFullYear();
  const endYear = end ?? 2015;

  for (let year = startYear; year >= endYear; year--) {
    await importYear(year);
  }
}

async function importYear(year: number) {
  const rootSrcPath = join(Deno.cwd(), "_old/src", year.toString());
  const rootInputPath = join(Deno.cwd(), "_old/input", year.toString());

  if (!Exists(rootSrcPath) || !Exists(rootInputPath)) {
    return;
  }

  console.log(`Importing ${year}...`);

  for (let day = 1; day <= 25; day++) {
    await importDay(year, day, rootSrcPath, rootInputPath);
  }
}

function Exists(path: string, log = true): boolean {
  try {
    Deno.statSync(path);
    return true;
  } catch {
    if (log) {
      console.warn(`Path ${path} does not exist`);
    }
    return false;
  }
}

async function importDay(year: number, day: number, srcPath: string, inputPath: string) {
  const sourceFilePath = join(srcPath, `day${day}.ts`);
  const inputMainFilePath = join(inputPath, day.toString(), `day${day}.txt`);
  const inputTestFilePath = join(inputPath, day.toString(), `tst${day}.txt`);

  if (!Exists(sourceFilePath) || !Exists(inputMainFilePath) || !Exists(inputTestFilePath)) {
    return;
  }

  await importInput(year, day, inputMainFilePath, 'main');
  await importInput(year, day, inputTestFilePath, 'test');
  await importSolution(year, day, sourceFilePath);
}

async function importInput(year: number, day: number, path: string, type: 'main' | 'test') {
  const dest = await buildPuzzleInput(year, day, type);
  if (Exists(dest, false)) {
    return;
  }

  await Deno.copyFile(path, dest);
}

async function importSolution(year: number, day: number, path: string) {
  const dest = await buildPuzzleSolution(year, day);
  if (Exists(dest, false)) {
    return;
  }

  const rawText = await Deno.readTextFile(path);

  await Deno.writeTextFile(dest, `
export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}

${rawText}
  `.trim());
}