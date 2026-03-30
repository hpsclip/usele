import { getData, writeData } from './db.js';

export async function getInventory(userId) {
  const data = await getData();
  if (!data.inventory) data.inventory = {};
  return data.inventory[userId] ?? [];
}

export async function addInventory(userId, item) {
  const data = await getData();
  if (!data.inventory) data.inventory = {};
  data.inventory[userId] = data.inventory[userId] ?? [];
  data.inventory[userId].push(item);
  await writeData(data);
}

export async function removeInventoryItem(userId, item) {
  const data = await getData();
  if (!data.inventory || !data.inventory[userId]) return;
  data.inventory[userId] = data.inventory[userId].filter(i => i !== item);
  await writeData(data);
}
