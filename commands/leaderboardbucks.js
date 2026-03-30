import { SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils/db.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboardbucks')
  .setDescription('View the bucks leaderboard');

export async function execute(interaction) {
  const data = await getData();
  const balances = data.balances || {};

  const sorted = Object.entries(balances)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const description = sorted.map(([id, balance], i) => `${i+1}. <@${id}> - ${balance} bucks`).join('\n');

  const embed = createEmbed({
    title: 'Bucks Leaderboard',
    description: description || 'No balances yet.'
  });

  await interaction.reply({ embeds: [embed] });
}