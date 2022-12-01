export async function main(input: string) {
  try {
    const res = await execute(input);
    return [res[0].toString(), res[1].toString()];
  } catch {
    console.error('Fix me!');
  }
}

type Point = { x: number, y: number };
type Target = [Point, Point];

interface Turn {
  step: number;
}

interface DragSim extends Turn {
  /** Current Position */
  x: number;
  /** Current drag */
  drag: number;
  /** Target reached */
  target: boolean; 
  /** Initial speed */
  speed: number;
}

interface GravitySim extends Turn {
  /** Current position */
  y: number;
  /** Current gravity */
  gravity: number;
  /** Target reached */
  target: boolean;
  /** Initial speed */
  speed: number;
  /** Highest point */
  highest: number;
}

// Solution for day 17 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const target = parseInput(_input);

  return Promise.resolve([
    findHighestPoint(target),
    findAllValidPoints(target)
  ]);
}

/** target area: x=20..30, y=-10..-5 */
function parseInput(input: string): Target {
  const match = input.matchAll(/target area: x=(\d+)\.\.(\d+), y=(.*)\.\.(.*)/g);
  const [, x1, x2, y1, y2] = match.next().value;
  return [{ x: +x1, y: +y1 }, { x: +x2, y: +y2 }];
}

/** Returns the position in Y axis after N steps */
function simulateGravity(speed: number, target: Target): GravitySim[] {
  const minTarget = target[0].y < target[1].y ? target[0].y : target[1].y;
  const maxTarget = target[0].y > target[1].y ? target[0].y : target[1].y;

  const res: GravitySim[] = [];
  const sim: GravitySim = {
    y: 0,
    gravity: 0,
    speed,
    target: false,
    highest: 0,
    step: 0
  }

  while (sim.y >= minTarget) {
    sim.step++;
    sim.y += (speed - sim.gravity);

    if (sim.y > sim.highest) {
      sim.highest = sim.y;
    }

    if (sim.y <= maxTarget && sim.y >= minTarget) {
      sim.target = true;
      res.push({ ...sim });
    }
    sim.gravity++;
  }

  return res;
}

/** Returns position in X axis after N steps */
function simulateDrag(speed: number, target: Target): DragSim[] {
  const minTarget = target[0].x < target[1].x ? target[0].x : target[1].x;
  const maxTarget = target[0].x > target[1].x ? target[0].x : target[1].x;

  const res: DragSim[] = [];
  const sim: DragSim = {
    x: 0,
    drag: 0,
    target: false,
    speed,
    step: 0
  }
  
  while (sim.drag <= speed) {
    sim.step++;
    sim.x += (speed - sim.drag);
    if (sim.x >= minTarget && sim.x <= maxTarget) {
      sim.target = true;
      res.push({ ...sim });
    }
    sim.drag++;
  }

  return res;
}

function runMultipleDragSim(target: Target, n: number): DragSim[] {
  const sims: DragSim[] = [];
  let speed = 1;
  
  while (n > 0) {
    n--;
    
    for (const sim of simulateDrag(speed, target)) {
      if (sims.find(s => s.x === sim.x && s.drag === sim.drag && s.target === sim.target)) {
        continue;
      }
      sims.push(sim);
    }

    speed++;
  }

  return sims;
}

function runMultipleGravSim(target: Target, n: number): GravitySim[] {
  const sims: GravitySim[] = [];
  let speed = -5000;
  
  while (n > 0) {
    n--;
    
    for (const sim of simulateGravity(speed, target)) {
      if (sims.find(s => s.y === sim.y && s.gravity === sim.gravity && s.target === sim.target)) {
        continue;
      }
      sims.push(sim);
    }

    speed++;
  }

  return sims;
}

function findHighestPoint(target: Target): number {
  const sims = runMultipleGravSim(target, 10000);
  return sims.reduce((acc, curr) => curr.highest > acc ? curr.highest : acc, 0);
}

function findAllValidPoints(target: Target): number {
  const dragSims = runMultipleDragSim(target, 10000);
  const gravSims = runMultipleGravSim(target, 10000);

  const hasCount: [number, number][] = [];
  let count = 0;

  for (const d of dragSims) {
    const isStopped = d.drag === d.speed;
    for (const g of gravSims) {
      const p = [d.speed, g.speed];
      if (hasCount.find(c => c[0] === p[0] && c[1] === p[1])) {
        continue;
      }

      if (isStopped && g.step >= d.step) {
        count++;
        hasCount.push([d.speed, g.speed]);
      } else if (g.step === d.step) {
        count++;
        hasCount.push([d.speed, g.speed]);
      }
    }
  }

  return count;
}