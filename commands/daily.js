import { SlashCommandBuilder } from 'discord.js';
import { getBalance, addBalance } from '../utils/economy.js';
import { getData, writeData } from '../utils/db.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily bucks');

export async function execute(interaction) {
  const userId = interaction.user.id;
  const data = await getData();
  if (!data.daily) data.daily = {};

  const lastClaim = data.daily[userId];
  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000; // 24 hours

  if (lastClaim && now - lastClaim < cooldown) {
    const remaining = Math.ceil((cooldown - (now - lastClaim)) / (60 * 60 * 1000));
    return await interaction.reply({ content: `You can claim again in ${remaining} hours.`, ephemeral: true });
  }

  const amount = Math.floor(Math.random() * 100) + 50; // 50-150 bucks
  await addBalance(userId, amount);
  data.daily[userId] = now;
  await writeData(data);

  const embed = createEmbed({
    title: 'Daily Claim',
    description: `You claimed ${amount} bucks!`,
    color: 0x00ff00
  });

  await interaction.reply({ embeds: [embed] });
}