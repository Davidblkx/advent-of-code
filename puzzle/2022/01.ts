import { Solution } from '../../src/mod.ts';

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);
  
  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  const lines = input.split('\n');

  const groups: number[][] = [];

  let group: number[] = [];
  for (const line of lines) {
    if (line === '' && group.length > 0) {
      groups.push(group);
      group = [];
    }

    if (line !== '') {
      group.push(parseInt(line, 10));
    }
  }

  const sumGroup = groups.reduce((acc, group) => {
    const sum = group.reduce((acc, num) => acc + num, 0);
    acc.push(sum);
    return acc;
  }, []);

  return sumGroup;
}

function solution1(sumGroup: ReturnType<typeof prepareInput>) {
  return Math.max(...sumGroup).toString();
}

function solution2(sumGroup: ReturnType<typeof prepareInput>) {
  const cp = [...sumGroup];
  let total = 0;

  for (let i = 0; i < 3; i++) {
    const max = Math.max(...cp);
    total += max;
    cp.splice(cp.indexOf(max), 1);
  }

  return total.toString();
}