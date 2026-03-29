import { SlashCommandBuilder } from 'discord.js';
import { getBalance } from '../utils/economy.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your balance');

export async function execute(interaction) {
  const balance = await getBalance(interaction.user.id);
  const embed = createEmbed({
    title: 'Balance',
    description: `You have ${balance} bucks.`,
  });
  await interaction.reply({ embeds: [embed] });
}