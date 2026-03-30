import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Timeout a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to timeout')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('duration')
      .setDescription('Duration in minutes')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(40320) // 28 days
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for timeout')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return await interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
  }

  try {
    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(duration * 60 * 1000, reason);
    await interaction.reply({ content: `${user.tag} has been timed out for ${duration} minutes. Reason: ${reason}`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to timeout the user.', ephemeral: true });
  }
}