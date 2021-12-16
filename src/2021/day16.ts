interface Packet {
  version: number;
  typeId: number;
}

interface LiteralPacket extends Packet {
  typeId: 4;
  value: number;
}

interface OperatorPacket extends Packet {
  sub: Packet[];
}

// Solution for day 16 of Advent of Code 2021
export function execute(_input: string): Promise<number[]> {
  const input = parseHexInput(_input);
  const packets = readRawPackets(input);

  return Promise.resolve([
    calcSumVersions(packets),
    calcPacketValue(packets[0])
  ]);
}

function parseHexInput(input: string): string {
  return input.split('\n')[0].split('')
    .map(x => parseInt(x, 16).toString(2).padStart(4, '0'))
    .join('')
}

function calcSumVersions(packets: Packet[]): number {
  let count = 0;

  for (const packet of packets) {
    count += packet.version;
    if (isOperatorPacket(packet)) {
      count += calcSumVersions(packet.sub);
    }
  }

  return count;
}

function calcPacketValue(packet: Packet): number {
  if (isLiteralPacket(packet)) {
    return packet.value;
  }

  const p = packet as OperatorPacket;
  const subValues = p.sub.map(calcPacketValue);
  
  switch (p.typeId) {
    case 0:
      return subValues.reduce((a, b) => a + b, 0);
    case 1:
      return subValues.reduce((a, b) => a * b, 1);
    case 2:
      return subValues.reduce((a, b) => a < b ? a : b, Number.MAX_SAFE_INTEGER);
    case 3:
      return subValues.reduce((a, b) => a > b ? a : b, Number.MIN_SAFE_INTEGER);
    case 5:
      return subValues[0] > subValues[1] ? 1 : 0;
    case 6:
      return subValues[0] < subValues[1] ? 1 : 0;
    case 7:
      return subValues[0] === subValues[1] ? 1 : 0;
  }

  throw new Error(`Unknown operator type ${p.typeId}`);
}

function readRawPackets(input: string): Packet[] {
  const res: Packet[] = [];
  let pos = 0;

  while ((pos + 7) < input.length) {
    const [newPosition, packet] = readPacket(input, pos);
    pos = newPosition;
    res.push(packet);
  }

  return res;
}

function parseHeader(input: string, pos: number): [number, number] {
  const version = parseInt(input.substr(pos, 3), 2);
  pos += 3;
  const typeId = parseInt(input.substr(pos, 3), 2);
  pos += 3;

  return [version, typeId];
}

function readPacket(input: string, pos: number): [number, Packet] {
  const [version, typeId] = parseHeader(input, pos);
  pos += 6;

  const packet: Packet = {
    version,
    typeId
  };

  switch (typeId) {
    case 4:
      pos = readLiteralPacket(input, pos, packet);
      break;
    default:
      pos = readOperatorPacket(input, pos, packet);
      break;
  }

  return [pos, packet];
}

function readLiteralPacket(input: string, pos: number, packet: Packet): number {
  const p = packet as LiteralPacket;
  let bytes = '';

  while (true) {
    const group = input.substr(pos, 5);
    pos += 5;
    const isLast = group.substr(0, 1) === '0';
    bytes += group.substr(1);
    if (isLast) { break; }
  }

  p.value = parseInt(bytes, 2);

  return pos;
}

function readOperatorPacket(input: string, pos: number, packet: Packet): number {
  const p = packet as OperatorPacket;
  p.sub = [];
  
  const length = input.substr(pos, 1) === '1' ? 11 : 15;
  pos += 1;
  
  pos = length === 15 ?
    readFixedLengthPackets(input, pos, p) :
    readFixedSizePackets(input, pos, p);

  return pos;
}

function readFixedLengthPackets(input: string, pos: number, packet: OperatorPacket): number {
  const length = parseInt(input.substr(pos, 15), 2);
  pos += 15;
  const subPacketsInput = input.substr(pos, length);
  pos += length;

  const subPackets = readRawPackets(subPacketsInput);
  packet.sub.push(...subPackets);

  return pos;
}

function readFixedSizePackets(input: string, pos: number, packet: OperatorPacket): number {
  const size = parseInt(input.substr(pos, 11), 2);
  pos += 11;

  for (let i = 0; i < size; i++) {
    const [newPosition, subPacket] = readPacket(input, pos);
    pos = newPosition;
    packet.sub.push(subPacket);
  }

  return pos;
}

function isLiteralPacket(packet: Packet): packet is LiteralPacket {
  return packet.typeId === 4;
}

function isOperatorPacket(packet: Packet): packet is OperatorPacket {
  return packet.typeId !== 4;
}