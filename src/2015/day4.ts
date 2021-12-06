import { crypto } from "https://deno.land/std/crypto/mod.ts";

// Solution for day 4 of Advent of Code 2015
export async function execute(_input: string): Promise<number[]> {
  return [
    await findMD5(_input, "00000"),
    await findMD5(_input, "000000"),
  ];
}

async function findMD5(input: string, start: string): Promise<number> {
  let index = 0;
  do {
    if (await isMD5Start(input + index, start)) {
      break;
    }
    index++;
  } while(true);

  return index;
}

async function isMD5Start(input: string, startVal: string): Promise<boolean> {
  const md5 = await crypto.subtle.digest("MD5", new TextEncoder().encode(input));
  const hex = arrayBufferToHexString(md5);
  
  return hex.startsWith(startVal);
}

function arrayBufferToHexString(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}