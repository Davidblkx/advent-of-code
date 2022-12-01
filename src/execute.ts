import { toFileUrl } from "deno/path/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";
import { buildPuzzleSolution } from "./path.ts";
import { readInput } from "./input.ts";
import { SolutionModule } from "./models.ts";
import { Subject, filter, debounceTime } from "npm:rxjs";

export async function executePuzzle(
  year?: number,
  day?: number,
  type?: string,
  watch = false
): Promise<void> {
  if (!watch) {
    await runSolution(year, day, type);
    return;
  }

  const solutionPath = await buildPuzzleSolution(year, day);
  const watcher = Deno.watchFs(solutionPath, { recursive: false });

  await runSolution(year, day, type);

  console.log(colors.cyan("\nWatching for changes..."));

  const subject = new Subject<string>();
  let count = 0;

  subject
    .pipe(
      filter((e) => e === "modify" || e === "create"),
      debounceTime(25)
    )
    .subscribe(async () => {
      count++;
      console.clear();
      await runSolution(year, day, type);
      console.log(colors.cyan(`\n[${count}] Watching for changes...`));
    });

  for await (const event of watcher) {
    subject.next(event.kind);
  }
}

export async function runSolution(year?: number, day?: number, type?: string) {
  const inputData = await readInput(year, day, type);
  const solutionPath = await buildPuzzleSolution(year, day);

  const importURL = toFileUrl(solutionPath).toString();
  // console.log(`Executing ${importURL}`);

  try {
    const randomNoise = Math.random().toString(36).substring(7);
    const module = (await import(
      importURL + "?" + randomNoise
    )) as SolutionModule;

    const res = await module.main(inputData.input);
    console.log(colors.green('Solution1:'))
    console.log(colors.yellow(res[0]));
    console.log(colors.green('Solution2:'))
    console.log(colors.yellow(res[1]));

    if (inputData.solution) {
      const success = inputData.solution[0] === res[0] && inputData.solution[1] === res[1];
      const message = success ? colors.green("Success") : colors.red("Failure");
      console.log(message);
    }
  } catch (e) {
    console.error(e);
  }
}
