export interface PuzzleParams {
  input: string;
  result?: string;
}

export type Solution = (input: string) => string | Promise<string>;

export interface SolutionModule {
  main: Solution;
}
