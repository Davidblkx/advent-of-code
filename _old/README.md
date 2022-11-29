# Advent of Code
Contain solutions for all advent of code editions

## Setup a new solution
 - delete the contents of the folder `input` and `src`
 - run `deno run -A .\setup.ts`
 
## Run solution
 - Set the input in the file `input/[YEAR]/[DAY]/day[DAY].txt`
 - [Optional] Set the demo input in the file `input/[YEAR]/[DAY]/tst[DAY].txt`
 - Implement the solution in the file `src/[YEAR]/day[DAY].ts`
 - Run `deno run .\run.ts -y [YEAR] -d [DAY]`
 
## Console options

RUN: `deno run .\run.ts [OPTIONS]`
OPTIONS:
  - t: If present, will use demo input
  - y: The year to run
  - d: The day to run
  - all: If pressent, run all days of an year
