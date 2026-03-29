import { SlashCommandBuilder } from 'discord.js';
import { coinflip } from '../utils/gamble.js';
import { getBalance, addBalance, subtractBalance } from '../utils/economy.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin and bet')
  .addStringOption(option =>
    option.setName('choice')
      .setDescription('heads or tails')
      .setRequired(true)
      .addChoices(
        { name: 'Heads', value: 'heads' },
        { name: 'Tails', value: 'tails' }
      )
  )
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Amount to bet')
      .setRequired(true)
  );

export async function execute(interaction) {
  const choice = interaction.options.getString('choice');
  const amount = interaction.options.getInteger('amount');
  const balance = await getBalance(interaction.user.id);
  if (balance < amount) {
    return await interaction.reply({ content: 'You don\'t have enough bucks!', ephemeral: true });
  }

  const result = coinflip(choice);
  if (result.win) {
    await addBalance(interaction.user.id, amount);
    const embed = createEmbed({
      title: 'Coinflip',
      description: `You chose ${choice}, result: ${result.result}. You win ${amount} bucks!`,
      color: 0x00ff00
    });
    await interaction.reply({ embeds: [embed] });
  } else {
    await subtractBalance(interaction.user.id, amount);
    const embed = createEmbed({
      title: 'Coinflip',
      description: `You chose ${choice}, result: ${result.result}. You lose ${amount} bucks.`,
      color: 0xff0000
    });
    await interaction.reply({ embeds: [embed] });
  }
}