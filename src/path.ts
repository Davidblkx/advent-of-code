import { ensureDir } from "deno/fs/mod.ts";
import { join } from "deno/path/mod.ts";

async function getRootPath(year?: number): Promise<string> {
  const root = Deno.cwd();
  const yearTxt = (year ?? new Date().getFullYear()).toString();
  const folderPath = `${root}/puzzle/${yearTxt}`;

  await ensureDir(folderPath);

  return folderPath;
}

export async function buildPuzzleInput(
  year?: number,
  day?: number,
  type = "main"
): Promise<string> {
  const folderPath = await getRootPath(year);

  const dayTxt = (day ?? new Date().getDate()).toString().padStart(2, "0");

  return join(folderPath, `${dayTxt}_${type}.txt`);
}

export async function buildPuzzleSolution(
  year?: number,
  day?: number
): Promise<string> {
  const folderPath = await getRootPath(year);

  const dayTxt = (day ?? new Date().getDate()).toString().padStart(2, "0");

  return join(folderPath, `${dayTxt}.ts`);
}
