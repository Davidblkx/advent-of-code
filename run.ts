import { parse } from "https://deno.land/std/flags/mod.ts"
import { Solution } from "./models.ts";

const args = parse(Deno.args, {
  default: {
    t: false,
    y: 2021,
    d: 1,
    all: false,
  }
});

function paddingZero(num: number) {
  return num < 10 ? '0' + num : num;
}

// ensure text has 15 length
function ensureLength(text: string, length: number) {
  const pad = length - text.length - 2;
  return '  ' + text + ' '.repeat(pad);
}

function processResult(result: number[]) {
  return result
    .map(r => ensureLength(`${r}`, 15))
    .join('|');
}

async function runDay(year: number, day: number) {
  const inputName = args.t ? `tst${day}.txt` : `day${day}.txt`;
  const input = await Deno.readTextFile(`input/${year}/${day}/${inputName}`);
  const action = (await import(`./src/${year}/day${day}.ts`)) as Solution;
  const result = await action.execute(input);

  console.log(`Day ${paddingZero(day)}: ${processResult(result)}`);
}

if (args.all) {
  for (let i = 1; i <= 25; i++) {
    await runDay(args.y, i);
  }
} else {
  await runDay(args.y, args.d);
}