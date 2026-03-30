import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getData, writeData } from '../utils/db.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warn a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to warn')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for the warning')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return await interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
  }

  const data = await getData();
  if (!data.warnings) data.warnings = {};
  if (!data.warnings[user.id]) data.warnings[user.id] = [];

  data.warnings[user.id].push({
    reason,
    moderator: interaction.user.id,
    timestamp: Date.now()
  });

  await writeData(data);

  await interaction.reply({ content: `${user.tag} has been warned. Reason: ${reason}`, ephemeral: true });
}