import { getData, writeData } from './db.js';

export async function getBalance(userId) {
  const data = await getData();
  if (!data.bucks) data.bucks = {};
  return data.bucks[userId] ?? 0;
}

export async function addBalance(userId, amount) {
  const data = await getData();
  if (!data.bucks) data.bucks = {};
  data.bucks[userId] = (data.bucks[userId] ?? 0) + amount;
  await writeData(data);
}

export async function subtractBalance(userId, amount) {
  const data = await getData();
  if (!data.bucks) data.bucks = {};
  data.bucks[userId] = Math.max(0, (data.bucks[userId] ?? 0) - amount);
  await writeData(data);
}