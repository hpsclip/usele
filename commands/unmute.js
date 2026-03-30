import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('unmute')
  .setDescription('Unmute a user (remove timeout)')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to unmute')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');

  if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return await interaction.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
  }

  try {
    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(null);
    await interaction.reply({ content: `${user.tag} has been unmuted.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to unmute the user.', ephemeral: true });
  }
}