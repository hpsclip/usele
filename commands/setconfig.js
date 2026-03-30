import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { setGuildConfig } from '../utils/config.js';

export const data = new SlashCommandBuilder()
  .setName('setconfig')
  .setDescription('Set server configuration')
  .addStringOption(option =>
    option.setName('key')
      .setDescription('Configuration key')
      .setRequired(true)
      .addChoices(
        { name: 'Automod', value: 'automod' },
        { name: 'Log Channel', value: 'logChannel' },
        { name: 'Welcome Channel', value: 'welcomeChannel' }
      )
  )
  .addStringOption(option =>
    option.setName('value')
      .setDescription('Value for the key (true/false for automod, channel ID for channels)')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const key = interaction.options.getString('key');
  let value = interaction.options.getString('value');

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return await interaction.reply({ content: 'You do not have permission to set config.', ephemeral: true });
  }

  if (key === 'automod') {
    value = value.toLowerCase() === 'true';
  }

  await setGuildConfig(interaction.guild.id, key, value);

  await interaction.reply({ content: `Set ${key} to ${value}.`, ephemeral: true });
}