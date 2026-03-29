import { getData, writeData } from './db.js';

export async function getShop() {
  const data = await getData();
  if (!data.shop) data.shop = [];
  return data.shop;
}

export async function addItem(name, price, description) {
  const data = await getData();
  if (!data.shop) data.shop = [];
  data.shop.push({ name, price, description });
  await writeData(data);
}

export async function removeItem(index) {
  const data = await getData();
  if (!data.shop) data.shop = [];
  if (index >= 0 && index < data.shop.length) {
    data.shop.splice(index, 1);
    await writeData(data);
  }
}