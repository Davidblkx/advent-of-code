export interface PuzzleParams {
  input: string;
  result?: string;
}

export type Solution = (input: string) => [string, string] | Promise<[string, string]>;

export interface SolutionModule {
  main: Solution;
}
