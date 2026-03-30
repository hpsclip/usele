import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getGuildConfig } from '../utils/config.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('setconfig')
  .setDescription('Open server configuration menu')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return await interaction.reply({ content: 'You do not have permission to set config.', ephemeral: true });
  }

  const config = await getGuildConfig(interaction.guild.id);

  const embed = createEmbed({
    title: 'Server Configuration',
    description: 'Click the buttons below to configure your server.',
    fields: [
      { name: 'Automod', value: config.automod ? '✅ Enabled' : '❌ Disabled', inline: true },
      { name: 'Log Channel', value: config.logChannel ? `<#${config.logChannel}>` : 'Not set', inline: true },
      { name: 'Welcome Channel', value: config.welcomeChannel ? `<#${config.welcomeChannel}>` : 'Not set', inline: true }
    ]
  });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('config:automod')
        .setLabel('Toggle Automod')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('config:logchannel')
        .setLabel('Set Log Channel')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('config:welcomechannel')
        .setLabel('Set Welcome Channel')
        .setStyle(ButtonStyle.Secondary)
    );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}