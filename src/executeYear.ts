import { runSolution } from './execute.ts';

export async function executeYear(year?: number, type?: string) {
  const start = year ?? new Date().getFullYear();

  for (let d = 1; d <= 25; d++) {
    console.log(`Executing ${start} day ${d}:`);
    await runSolution(start, d, type);
    console.log('----------------------------------------');
  }
}