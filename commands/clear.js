import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear messages from the channel')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Number of messages to clear (1-100)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  const amount = interaction.options.getInteger('amount');

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return await interaction.reply({ content: 'You do not have permission to clear messages.', ephemeral: true });
  }

  try {
    const messages = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `Cleared ${messages.size} messages.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to clear messages.', ephemeral: true });
  }
}