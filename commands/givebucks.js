import { SlashCommandBuilder } from 'discord.js';
import { addBalance } from '../utils/economy.js';
import { isAdmin } from '../utils/config.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('givebucks')
  .setDescription('Give bucks to a user (Admin only)')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to give bucks to')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Amount of bucks to give')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  if (!(await isAdmin(interaction))) {
    return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const user = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');

  await addBalance(user.id, amount);

  const embed = createEmbed({
    title: 'Bucks Given',
    description: `Gave ${amount} bucks to ${user.tag}.`,
    color: 0x00ff00
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}