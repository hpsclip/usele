import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show help menu');

export async function execute(interaction, client) {
  const commandDescriptions = client.commands.map(cmd => `• /${cmd.data.name}: ${cmd.data.description}`).join('\n');

  const embed = createEmbed({
    title: 'Help',
    description: `Available commands:\n${commandDescriptions}`,
    fields: [
      { name: 'Moderation', value: 'ban, kick, warn, etc.', inline: true },
      { name: 'Economy', value: 'balance, daily, pay, etc.', inline: true },
      { name: 'Fun', value: 'coinflip, slots, joke, etc.', inline: true }
    ]
  });

  await interaction.reply({ embeds: [embed] });
}