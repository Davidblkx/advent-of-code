import { Solution } from '../../src/mod.ts';

type Direction = 'U' | 'D' | 'L' | 'R' | 'LU' | 'LD' | 'RU' | 'RD';

interface Point {
  x: number;
  y: number;
}

interface Pos {
  head: Point;
  tail: Point;
}

interface RopeNode {
  pos: Point;
  next: RopeNode | undefined;
}

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string): [Direction, number][] {
  return input
    .split('\n')
    .map((line) => {
      const p = line.split(' ')
      return [p[0] as Direction, Number(p[1])]
    });
}

function solution1(input: ReturnType<typeof prepareInput>) {
  const node = createRope(2);
  const passedBy = new Set<string>();
  passedBy.add('0,0');

  for (const [dir, value] of input) {
    for (let i = 0; i < value; i++) {
      moveRope(node, dir, passedBy);
    }
  }

  return passedBy.size.toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  const node = createRope(10);
  const passedBy = new Set<string>();
  passedBy.add('0,0');

  for (const [dir, value] of input) {
    for (let i = 0; i < value; i++) {
      moveRope(node, dir, passedBy);
    }
  }

  return passedBy.size.toString();
}

function moveRope(rope: RopeNode, dir: Direction, set: Set<string>) {
  switch (dir) {
    case 'U':
      rope.pos.y += 1;
      break;
    case 'D':
      rope.pos.y -= 1;
      break;
    case 'L':
      rope.pos.x -= 1;
      break;
    case 'R':
      rope.pos.x += 1;
      break;
    case 'LU':
      rope.pos.x -= 1;
      rope.pos.y += 1;
      break;
    case 'LD':
      rope.pos.x -= 1;
      rope.pos.y -= 1;
      break;
    case 'RU':
      rope.pos.x += 1;
      rope.pos.y += 1;
      break;
    case 'RD':
      rope.pos.x += 1;
      rope.pos.y -= 1;
      break;
  }

  if (!rope.next) {
    set.add(`${rope.pos.x},${rope.pos.y}`);
  } else {
    calcNextMove(rope, set);
  }
}

function calcNextMove(rope: RopeNode, set: Set<string>) {
  if (!rope.next) { throw new Error('No next node'); }

  const head = rope.pos;
  const tail = rope.next.pos;
  const diffX = head.x - tail.x;
  const diffY = head.y - tail.y;
  const absDiffX = Math.abs(head.x - tail.x);
  const absDiffY = Math.abs(head.y - tail.y);

  if (absDiffX <= 1 && absDiffY <= 1) {
    return;
  }

  let nextDir: Direction = 'U';

  if (diffX === 0 && diffY > 0) {
    nextDir = 'U';
  } else if (diffX === 0 && diffY < 0) {
    nextDir = 'D';
  } else if (diffX > 0 && diffY === 0) {
    nextDir = 'R';
  } else if (diffX < 0 && diffY === 0) {
    nextDir = 'L';
  } else if (diffX > 0 && diffY > 0) {
    nextDir = 'RU';
  } else if (diffX > 0 && diffY < 0) {
    nextDir = 'RD';
  } else if (diffX < 0 && diffY > 0) {
    nextDir = 'LU';
  } else if (diffX < 0 && diffY < 0) {
    nextDir = 'LD';
  }

  moveRope(rope.next, nextDir, set);
}

function createRope(size: number): RopeNode {
  const node: RopeNode = {
    pos: { x: 0, y: 0 },
    next: undefined,
  };

  if (size === 1) {
    return node;
  }

  node.next = createRope(size - 1);

  return node;
}
