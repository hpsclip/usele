import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { loadCommands } from '../utils/commandLoader.js';

export const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reload command modules')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction, client) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    await loadCommands(client, true);
    await interaction.editReply({ content: 'Commands reloaded successfully.' });
  } catch (error) {
    console.error('Reload failed:', error);
    await interaction.editReply({ content: 'Failed to reload commands; check logs.' });
  }
}
