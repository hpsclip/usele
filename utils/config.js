import { getData, writeData } from './db.js';
import { PermissionFlagsBits } from 'discord.js';

export async function getGuildConfig(guildId) {
  const data = await getData();
  if (!data.config) data.config = {};
  if (!data.config[guildId]) data.config[guildId] = {
    automod: false,
    logChannel: null,
    welcomeChannel: null,
    adminRoles: [],
    modRoles: [],
    mutedRole: null,
    pollRole: null
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
  if (!interaction.guild || !interaction.member) return false;

  const config = await getGuildConfig(interaction.guild.id);

  if (interaction.member.permissions?.has(PermissionFlagsBits.Administrator)) return true;
  if (interaction.member.permissions?.has(PermissionFlagsBits.ManageGuild)) return true;

  const memberRoles = interaction.member.roles?.cache?.map(r => r.id) || [];

  if (config.adminRoles && config.adminRoles.length > 0 && memberRoles.some(roleId => config.adminRoles.includes(roleId))) {
    return true;
  }

  if (config.modRoles && config.modRoles.length > 0 && memberRoles.some(roleId => config.modRoles.includes(roleId))) {
    return true;
  }

  return false;
}