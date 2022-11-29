const startYear = 2015;
const endYear = 2021;
const totalDays = 25;

for (let year = startYear; year <= endYear; year++) {
  const path = `input/${year}`;
  await Deno.mkdir(path, { recursive: true });

  for (let day = 1; day <= totalDays; day++) {
    const dayPath = `${path}/${day}`;
    await Deno.mkdir(dayPath, { recursive: true });

    const dPath = `${dayPath}/day${day}.txt`;
    const fPath = `${dayPath}/tst${day}.txt`;

    try {
      await Deno.lstat(dPath)
    } catch { await Deno.writeTextFile(dPath, ""); }

    try {
      await Deno.lstat(fPath)
    } catch { await Deno.writeTextFile(fPath, ""); }
  }
}

for (let year = startYear; year <= endYear; year++) {
  const rootPath = `src/${year}`;
  await Deno.mkdir(rootPath, { recursive: true });

  for (let day = 1; day <= totalDays; day++) {
    const path = `src/${year}/day${day}.ts`;

    try {
      await Deno.lstat(path)
    } catch {
      await Deno.writeTextFile(path,
`
// Solution for day ${day} of Advent of Code ${year}
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([0, 0]);
}
`
      );
    }
  }
}