import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Get information about the server');

export async function execute(interaction) {
  const guild = interaction.guild;

  const embed = createEmbed({
    title: `${guild.name}'s Info`,
    fields: [
      { name: 'ID', value: guild.id, inline: true },
      { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
      { name: 'Members', value: guild.memberCount.toString(), inline: true },
      { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
      { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
      { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
    ],
    thumbnail: guild.iconURL()
  });

  await interaction.reply({ embeds: [embed] });
}