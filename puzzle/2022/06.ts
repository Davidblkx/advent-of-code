import { Solution } from '../../src/mod.ts';

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  return input.split('');
}

function solution1(input: ReturnType<typeof prepareInput>) {
  const message = readMessage(input, 4);
  return message.length.toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  const message = readMessage(input, 14);
  return message.length.toString();
}

function readMessage(input: string[], mark: number): string {
  let message = '';
  const buffer: string[] = [];

  for (let i = 0; i < input.length; i++) {
    buffer.unshift(input[i]);
    if (buffer.length === mark) {
      const set = new Set(buffer);
      if (set.size === mark) {
        message += buffer.join('');
        return message;
      } else {
        message += buffer.pop()!;
      }
    }
  }

  return message;
}