import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { isAdmin, getGuildConfig } from '../utils/config.js';

export const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a simple yes/no poll')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Poll question')
      .setRequired(true)
  );

export async function execute(interaction) {
  const config = await getGuildConfig(interaction.guild.id);
  const hasPollRole = config.pollRole && interaction.member.roles.cache.has(config.pollRole);

  if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) || hasPollRole || await isAdmin(interaction))) {
    return await interaction.reply({ content: 'You need Manage Server permission, configured poll role, or admin/mod rights to create polls.', ephemeral: true });
  }

  const question = interaction.options.getString('question');
  const poll = await interaction.reply({ content: `📊 **Poll:** ${question}\n\nReact with 👍 for yes or 👎 for no.`, fetchReply: true });
  await poll.react('👍');
  await poll.react('👎');
}
