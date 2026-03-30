import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig } from '../utils/config.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('viewconfig')
  .setDescription('View server configuration')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return await interaction.reply({ content: 'You do not have permission to view config.', ephemeral: true });
  }

  const config = await getGuildConfig(interaction.guild.id);

  const embed = createEmbed({
    title: 'Server Configuration',
    fields: [
      { name: 'Automod', value: config.automod ? 'Enabled' : 'Disabled', inline: true },
      { name: 'Log Channel', value: config.logChannel ? `<#${config.logChannel}>` : 'Not set', inline: true },
      { name: 'Welcome Channel', value: config.welcomeChannel ? `<#${config.welcomeChannel}>` : 'Not set', inline: true }
    ]
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}