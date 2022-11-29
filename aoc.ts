import { Command } from "cliffy/command/mod.ts";

import { createPuzzle } from "./src/create.ts";
import { executePuzzle } from "./src/execute.ts";

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
  .parse(Deno.args);
