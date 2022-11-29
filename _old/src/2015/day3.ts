
// Solution for day 3 of Advent of Code 2015
export function execute(_input: string): Promise<number[]> {
  return Promise.resolve([
    calcUniqueVisits(_input),
    calcUniqueVisits(_input, 2),
  ]);
}

type Point = [number, number];
type Visited = { [key: string]: number };

function move(point: Point, direction: string): Point {
  switch (direction) {
    case '^':
      return [point[0], point[1] + 1];
    case 'v':
      return [point[0], point[1] - 1];
    case '<':
      return [point[0] - 1, point[1]];
    case '>':
      return [point[0] + 1, point[1]];
  }
  throw new Error('Invalid direction');
}

function pointToKey(point: Point): string {
  return `${point[0]},${point[1]}`;
}

function setVisit(visits: Visited, point: Point): void {
  visits[pointToKey(point)] = (visits[pointToKey(point)] || 0) + 1;
}

function calcVisits(input: string, players = 1): Visited {
  const directions = input.split('');
  const visits: Visited = {};
  const playerPositions: Point[] = [];
  setVisit(visits, [0, 0]);

  for (let i = 0; i < players; i++) {
    playerPositions.push([0, 0]);
  }


  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i];
    const playerPosition = playerPositions[i % players];
    const nextPosition = move(playerPosition, direction);
    setVisit(visits, nextPosition);
    playerPositions[i % players] = nextPosition;
  }
  
  return visits;
}

function calcUniqueVisits(input: string, players = 1): number {
  const visits = calcVisits(input, players);
  return Object.keys(visits).length;
}