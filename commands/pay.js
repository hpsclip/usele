import { SlashCommandBuilder } from 'discord.js';
import { getBalance, addBalance, subtractBalance } from '../utils/economy.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('pay')
  .setDescription('Pay bucks to another user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to pay')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Amount to pay')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  const target = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');

  if (target.id === interaction.user.id) {
    return await interaction.reply({ content: 'You cannot pay yourself.', ephemeral: true });
  }

  const balance = await getBalance(interaction.user.id);
  if (balance < amount) {
    return await interaction.reply({ content: 'You do not have enough bucks.', ephemeral: true });
  }

  await subtractBalance(interaction.user.id, amount);
  await addBalance(target.id, amount);

  const embed = createEmbed({
    title: 'Payment',
    description: `You paid ${amount} bucks to ${target.tag}.`,
    color: 0x00ff00
  });

  await interaction.reply({ embeds: [embed] });
}