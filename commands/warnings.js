import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getData } from '../utils/db.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('warnings')
  .setDescription('View warnings for a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to check warnings for')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return await interaction.reply({ content: 'You do not have permission to view warnings.', ephemeral: true });
  }

  const data = await getData();
  const warnings = data.warnings?.[user.id] || [];

  const embed = createEmbed({
    title: `Warnings for ${user.tag}`,
    description: warnings.length ? warnings.map((w, i) => `${i+1}. ${w.reason} - <@${w.moderator}>`).join('\n') : 'No warnings.',
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}