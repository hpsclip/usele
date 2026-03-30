import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('lock')
  .setDescription('Lock a channel')
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('The channel to lock (defaults to current)')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel') || interaction.channel;

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
    return await interaction.reply({ content: 'You do not have permission to lock channels.', ephemeral: true });
  }

  try {
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    await interaction.reply({ content: `Locked ${channel}.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Failed to lock the channel.', ephemeral: true });
  }
}