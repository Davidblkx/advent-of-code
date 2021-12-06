export interface Solution {
  execute(input: string): Promise<number[]>;
}