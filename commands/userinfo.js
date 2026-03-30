import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Get information about a user')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to get info for')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const embed = createEmbed({
    title: `${user.tag}'s Info`,
    fields: [
      { name: 'ID', value: user.id, inline: true },
      { name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true },
      { name: 'Joined Server', value: member ? member.joinedAt.toDateString() : 'Not in server', inline: true },
      { name: 'Roles', value: member ? member.roles.cache.map(r => r.name).join(', ') : 'None', inline: false }
    ],
    thumbnail: user.displayAvatarURL()
  });

  await interaction.reply({ embeds: [embed] });
}