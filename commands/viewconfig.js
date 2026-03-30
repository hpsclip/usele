import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, isAdmin } from '../utils/config.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('viewconfig')
  .setDescription('View server configuration')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) || await isAdmin(interaction))) {
    return await interaction.reply({ content: 'You do not have permission to view config.', ephemeral: true });
  }

  const config = await getGuildConfig(interaction.guild.id);

  const embed = createEmbed({
    title: 'Server Configuration',
    fields: [
      { name: 'Automod', value: config.automod ? 'Enabled' : 'Disabled', inline: true },
      { name: 'Log Channel', value: config.logChannel ? `<#${config.logChannel}>` : 'Not set', inline: true },
      { name: 'Welcome Channel', value: config.welcomeChannel ? `<#${config.welcomeChannel}>` : 'Not set', inline: true },
      { name: 'Admin Roles', value: config.adminRoles && config.adminRoles.length > 0 ? config.adminRoles.map(id => `<@&${id}>`).join(', ') : 'None', inline: false }
    ]
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}