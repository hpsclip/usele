import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('unlock')
  .setDescription('Unlock a channel')
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('The channel to unlock (defaults to current)')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel') || interaction.channel;

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
    return await interaction.reply({ content: 'You do not have permission to unlock channels.', ephemeral: true });
  }

  try {
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    await interaction.reply({ content: `Unlocked ${channel}.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to unlock the channel.', ephemeral: true });
  }
}