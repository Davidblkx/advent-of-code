// Solution for day 20 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseInput(_input);

  return Promise.resolve([
    enhanceAndCount(input, 2),
    enhanceAndCount(input, 50),
  ]);
}

interface Input {
  algorithm: number[];
  image: number[][];
}

function parseInput(input: string): Input {
  const lines = input.split("\n");
  const algorithm = lines[0].split('').map(e => e === '#' ? 1 : 0);
  const image = lines.slice(2).map(line => line.split("").map(e => e === '#' ? 1 : 0));
  return { algorithm, image };
}

function calcPixel(image: number[][], x: number, y: number, pad: 0 | 1): number {
  let binary = '';
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const val = image[y + i] && image[y + i][x + j];
      binary += val === undefined ? pad : val;
    }
  }
  return parseInt(binary, 2);
}

function enhanceImage(image: number[][], algorithm: number[], pad: 0 | 1): number[][] {
  const newImg: number[][] = [];

  for (let y = -1; y < image.length + 1; y++) {
    const row: number[] = [];
    for (let x = -1; x < image[0].length + 1; x++) {
      const refPixel = calcPixel(image, x, y, pad);
      row.push(algorithm[refPixel]);
    }
    newImg.push(row);
  }

  return newImg;
}

function countPixels(image: number[][]): number {
  let count = 0;
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[0].length; x++) {
      if (image[y][x] === 1) {
        count++;
      }
    }
  }
  return count;
}

function calcNextPad(algorithm: number[], pad: 0 | 1): 0 | 1 {
  const ref = pad === 0 ? 0 : 511;
  return algorithm[ref] as 0;
}

function enhanceAndCount(input: Input, iterations: number): number {
  let image = input.image;
  let pad: 0 | 1 = 0;

  for (let i = 0; i < iterations; i++) {
    image = enhanceImage(image, input.algorithm, pad);
    pad = calcNextPad(input.algorithm, pad);
  }

  return countPixels(image);
}