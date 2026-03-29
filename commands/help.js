import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show help menu');

export async function execute(interaction) {
  const embed = createEmbed({
    title: 'Help',
    description: 'List of commands:\n- /ping: Check bot latency\n- /balance: Check your bucks\n- /coinflip: Gamble with coinflip',
    fields: [
      { name: 'Moderation', value: 'ban, kick, warn, etc.', inline: true },
      { name: 'Economy', value: 'balance, daily, pay, etc.', inline: true },
      { name: 'Fun', value: 'coinflip, slots, joke, etc.', inline: true }
    ]
  });
  await interaction.reply({ embeds: [embed] });
}