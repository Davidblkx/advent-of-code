import { Solution } from '../../src/mod.ts';

type Disk = Record<string, Entry>;

interface State {
  disk: Disk;
  dir: Entry;
  path: string;
}

interface Entry {
  type: 'file' | 'dir';
  name: string;
  size: number;
  parent?: Entry;
  children: Record<string, Entry>;
}

interface CdCommand {
  type: 'cd';
  path: string;
}

interface LsCommand {
  type: 'ls';
}

type Command = CdCommand | LsCommand;

export const main: Solution = async (input: string) => {
  const value = prepareInput(input);

  const res1 = await solution1(value);
  const res2 = await solution2(value);

  return [res1, res2];
};

function prepareInput(input: string) {
  const actions = input.split('\n').slice(1);
  const root: Entry = {
    type: 'dir',
    name: '/',
    size: 0,
    children: {},
  }
  const state: State = {
    dir: root,
    disk: { '/': root },
    path: '/',
  };

  let index = 0;

  while (index < actions.length) {
    const nxI = processCommand(index, actions, state);
    if (nxI === index) {
      throw new Error('No progress');
    }
    index = nxI;
  }

  calcSize(state.disk);

  return state.disk;
}

function solution1(input: ReturnType<typeof prepareInput>) {
  let sum = 0;
  for (const [_, entry] of (Object.entries(input) as [string, Entry][])) {
    if (entry.type === 'dir' && entry.size < 100000) {
      sum += entry.size;
    }
  }
  return sum.toString();
}

function solution2(input: ReturnType<typeof prepareInput>) {
  const total = 70000000;
  const available = total - input['/'].size;
  const needed = 30000000 - available;
  let toDelete = input['/'].size;

  for (const [_, entry] of (Object.entries(input) as [string, Entry][])) {
    if (entry.type === 'dir' && entry.size >= needed && entry.size < toDelete) {
      toDelete = entry.size;
    }
  }

  return toDelete.toString();
}

function processCommand(index: number, actions: string[], state: State): number {
  const cmd = readCommand(actions[index]);
  switch (cmd.type) {
    case 'cd':
      changeDir(state, cmd.path);
      return index + 1;
    case 'ls':
      return list(state, index + 1, actions);
    default:
      throw new Error('Invalid command: ' + cmd);
  }
}

function readCommand(line: string): Command {
  if (!line.startsWith('$')) {
    throw new Error('Invalid command');
  }

  const [_, cmd, path] = line.split(' ');

  if (cmd === 'cd') {
    return { type: 'cd', path };
  } if (cmd === 'ls') {
    return { type: 'ls' };
  }

  throw new Error('Invalid command: ' + cmd);
}

function changeDir(state: State, path: string) {
  if (path === '/') {
    state.dir = state.disk['/'];
    state.path = '/';
    return;
  }

  if (path === '..') {
    if (state.dir.parent) {
      state.dir = state.dir.parent;
      state.path = state.path.split('/').slice(0, -1).join('/');
      return;
    }

    throw new Error('Cannot go up from root');
  }

  const nextPath = join(state.path, path);
  const entry = state.disk[nextPath] ?? {
    type: 'dir',
    children: {},
    name: path,
    size: 0,
    parent: state.dir,
  }

  state.dir.children[path] = entry;
  state.disk[nextPath] = entry;
  state.dir = entry;
  state.path = nextPath;
}

function list(state: State, start: number, lines: string[]): number {
  let curr = start;

  while (true) {
    const line = lines[curr];
    if (!line || line.startsWith('$')) {
      break;
    }

    const [type, name] = line.split(' ');
    const fullPath = join(state.path, name);
    if (type === 'dir') {
      const entry = state.disk[fullPath] ?? {
        type: 'dir',
        children: {},
        name,
        size: 0,
        parent: state.dir,
      };
      state.dir.children[name] = entry;
      state.disk[fullPath] = entry;
    } else if (!isNaN(parseInt(type, 10))) {
      const size = parseInt(type, 10);
      const entry = state.disk[fullPath] ?? {
        type: 'file',
        children: {},
        name,
        size,
        parent: state.dir,
      };
      state.dir.children[name] = entry;
      state.disk[fullPath] = entry;
    } else {
      throw new Error('Invalid line: ' + line);
    }

    curr++;
  }

  return curr;
}

function join(a: string, b: string): string {
  return a === '/' ? `/${b}` : `${a}/${b}`;
}

function calcSize(disk: Disk) {
  const sortedKeys = Object.keys(disk)
    .map(e => e.split('/').filter(e => e)) // split by / and remove empty
    .sort((a, b) => b.length - a.length) // sort desc by parts length
    .map(e => '/' + e.join('/')); // join back

  for (const key of sortedKeys) {
    const entry = disk[key];
    if (entry.type === 'file') {
      continue;
    }

    entry.size = Object.values(entry.children).reduce((acc, e) => acc + e.size, 0);
  }
}
