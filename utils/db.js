import { readFile, writeFile } from 'fs/promises';

const PATH = './data.json';

export async function getData() {
  try {
    return JSON.parse(await readFile(PATH, 'utf8'));
  } catch {
    return {};
  }
}

export async function writeData(data) {
  await writeFile(PATH, JSON.stringify(data, null, 2));
}