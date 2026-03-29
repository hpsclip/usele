import { getData, writeData } from './db.js';

export async function getGuildConfig(guildId) {
  const data = await getData();
  if (!data.config) data.config = {};
  if (!data.config[guildId]) data.config[guildId] = {
    automod: false,
    logChannel: null,
    welcomeChannel: null,
  };
  return data.config[guildId];
}

export async function setGuildConfig(guildId, key, value) {
  const data = await getData();
  if (!data.config) data.config = {};
  if (!data.config[guildId]) data.config[guildId] = {};
  data.config[guildId][key] = value;
  await writeData(data);
}