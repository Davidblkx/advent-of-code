
// Solution for day 8 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = renderInput(_input);
  return Promise.resolve([
    countDigitsInOutput(input), 
    calculateSumData(input)
  ]);
}

type Data = { input: string[], output: string[] }

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type SegmentMap = { [key in Segment]: Segment };

const digits = {
  0: 'abcefg',
  1: 'cf',
  2: 'acdeg',
  3: 'acdfg',
  4: 'bcdf',
  5: 'abdfg',
  6: 'abdefg',
  7: 'acf',
  8: 'abcdefg',
  9: 'abcdfg'
}

const digitMap = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9
}

const uniqueNumbers = [digits[1].length, digits[4].length, digits[7].length, digits[8].length];

function renderInput(input: string): Data[] {
  const lines = input.split("\n");
  const res: Data[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [input, output] = line.split(" | ");
    res.push({ input: input.split(" "), output: output.split(" ") });
  }

  return res;
}

function isUniqueNumber(value: string): boolean {
  return uniqueNumbers.includes(value.length);
}

function countDigitsInOutput(data: Data[]): number {
  let count = 0;

  for (const d of data) {
    for (const o of d.output) {
      if (isUniqueNumber(o)) {
        count++;
      }
    }
  }

  return count;
}

function mapValues(map: SegmentMap, value: string): string {
  const res: string[] = [];
  for (const v of value) {
    res.push(map[v as Segment] as string);
  }
  return res.sort().join("");
}

function containsAll(val: string, values: string): boolean {
  for (const v of values.split("")) {
    if (!val.includes(v)) {
      return false;
    }
  }
  return true; 
}

function calculateSegmentMap(data: Data): SegmentMap {
  const res: Partial<SegmentMap> = {};
  const values = data.input;

  const one = values.find(v => v.length === digits[1].length) as string;
  const four = values.find(v => v.length === digits[4].length) as string;
  const seven = values.find(v => v.length === digits[7].length) as string;
  const six = values.find(v => v.length === digits[6].length && !containsAll(v, one)) as string;
  const three = values.find(v => v.length === digits[3].length && containsAll(v, one)) as string;
  let A = '';
  let D = '';
  let G = '';

  // find A
  for (const v of seven) {
    if (!one.includes(v)) {
      res[v as Segment] = 'a';
      A = v;
      break;
    }
  }

  // find C and F
  for (const v of one) {
    if (!six.includes(v)) {
      res[v as Segment] = 'c';
    } else {
      res[v as Segment] = 'f';
    }
  }

  // find G and D
  for (const v of three) {
    if (!four.includes(v) && v !== A) {
      res[v as Segment] = 'g';
      G = v;
    } else if (four.includes(v) && !one.includes(v)) {
      res[v as Segment] = 'd';
      D = v;
    }
  }

  const zero = values.find(v => v.length === digits[0].length && !containsAll(v, D)) as string;

  // find B and E
  for (const v of zero) {
    if (four.includes(v) && !one.includes(v)) {
      res[v as Segment] = 'b';
    } else if (!four.includes(v) && !seven.includes(v) && v !== G) {
      res[v as Segment] = 'e';
    }
  }

  return res as SegmentMap;
}

function calculateOutput(data: Data): number {
  const map = calculateSegmentMap(data);
  const { output } = data;
  const res: string[] = [];
  for (const display of output) {
    const val = mapValues(map, display) as keyof typeof digitMap;
    res.push(digitMap[val].toString());
  }
  return parseInt(res.join(""));
}

function calculateSumData(data: Data[]): number {
  let sum = 0;
  for (const d of data) {
    sum += calculateOutput(d);
  }
  return sum;
}
