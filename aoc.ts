import { Command } from "cliffy/command/mod.ts";

import { createPuzzle } from "./src/create.ts";
import { executePuzzle } from "./src/execute.ts";
import { runImport } from "./src/import.ts";
import { executeYear } from "./src/executeYear.ts";

await new Command()
  .name("aoc")
  .version("0.1.0")
  .description("Advent of Code Runner")
  .command("create", "Create structure for a new date")
  .alias("c")
  .option("-y, --year <year:number>", "Year to create", {
    default: new Date().getFullYear(),
  })
  .option("-d, --day <day:number>", "Day to create", {
    default: new Date().getDate(),
  })
  .action(async (opt) => {
    await createPuzzle(opt.year, opt.day);
  })
  .command("execute", "Execute a puzzle")
  .alias("x")
  .option("-y, --year <year:number>", "Year to execute", {
    default: new Date().getFullYear(),
  })
  .option("-d, --day <day:number>", "Day to execute", {
    default: new Date().getDate(),
  })
  .option("-t, --type <type:string>", "Type of puzzle to execute")
  .option("-w, --watch", "Watch for changes and execute")
  .action(async (opt) => {
    await executePuzzle(opt.year, opt.day, opt.type, opt.watch);
  })
  .command("import", "Import puzzles from previous years")
  .alias("i")
  .option("-s, --start <start:number>", "Year to start importing")
  .option("-e, --end <end:number>", "Year to end importing")
  .action(async (opt) => {
    await runImport(opt.start, opt.end);
  })
  .command("year", "Execute all puzzles for a year")
  .alias("y")
  .arguments("[year:number]")
  .action(async (_, year) => {
    await executeYear(year);
  })
  .parse(Deno.args);
