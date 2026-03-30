import { getData, writeData } from './db.js';

export async function getGuildConfig(guildId) {
  const data = await getData();
  if (!data.config) data.config = {};
  if (!data.config[guildId]) data.config[guildId] = {
    automod: false,
    logChannel: null,
    welcomeChannel: null,
    adminRoles: []
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

export async function isAdmin(interaction) {
  const config = await getGuildConfig(interaction.guild.id);
  if (interaction.member.permissions.has('Administrator')) return true;
  if (config.adminRoles && config.adminRoles.length > 0) {
    return interaction.member.roles.cache.some(role => config.adminRoles.includes(role.id));
  }
  return false;
}