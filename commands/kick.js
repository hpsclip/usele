import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a user from the server')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to kick')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for the kick')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
    return await interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
  }

  try {
    await interaction.guild.members.kick(user, reason);
    await interaction.reply({ content: `${user.tag} has been kicked. Reason: ${reason}`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to kick the user.', ephemeral: true });
  }
}