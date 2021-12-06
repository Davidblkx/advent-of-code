
// Solution for day 3 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = _input.split("\n");

  return Promise.resolve([
    chalenge1(input),
    chalenge2(input)
  ]);
}

function chalenge1(lines: string[]): number {
  const [commonBinary, uncommonBinary] = calculateBinary(lines);

  const common = parseInt(commonBinary, 2);
  const uncommon = parseInt(uncommonBinary, 2);
  return common * uncommon;
}

function chalenge2(lines: string[]): number {
  
  let oxygen: string[] = lines;
  let c02: string[] = lines;

  for (let i = 0; i < lines[0].length; i++) {
    if (oxygen.length > 1) {
      const [v,] = countEntries(oxygen, i);
      oxygen = oxygen.filter(line => line[i] === v);
    }

    if (c02.length > 1) {
      const [,v] = countEntries(c02, i);
      c02 = c02.filter(line => line[i] === v);
    }
  }

  const oxygenValue = parseInt(oxygen[0], 2);
  const c02Value = parseInt(c02[0], 2);

  return oxygenValue * c02Value;
}

function calculateBinary(lines: string[]): string[] {
  const count0: number[] = [];
  const count1: number[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "0") {
        count0[j] = count0[j] + 1 || 1;
      } else {
        count1[j] = count1[j] + 1 || 1;
      }
    }
  }

  let commonBinary = "";
  for (let i = 0; i < count0.length; i++) {
    if (count0[i] > count1[i]) {
      commonBinary += "0";
    } else {
      commonBinary += "1";
    }
  }

  let uncommonBinary = "";
  for (let i = 0; i < count0.length; i++) {
    if (count0[i] > count1[i]) {
      uncommonBinary += "1";
    } else {
      uncommonBinary += "0";
    }
  }

  return [commonBinary, uncommonBinary];
}

function countEntries(lines: string[], position: number): [string, string] {
  let count0 = 0;
  let count1 = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][position] === "0") {
      count0++;
    } else {
      count1++;
    }
  }

  if (count0 === count1) {
    return ["1", "0"];
  }

  if (count0 > count1) {
    return ["0", "1"];
  } else {
    return ["1", "0"];
  }
}
