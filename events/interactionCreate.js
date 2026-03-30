export const name = 'interactionCreate';

export async function execute(interaction, client) {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`Command not found for interaction: ${interaction.commandName}`);
      return interaction.reply({ content: 'Command is not available (not loaded or not registered).', ephemeral: true });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  } else if (interaction.isButton()) {
    if (interaction.customId.startsWith('config:')) {
      const key = interaction.customId.split(':')[1];
      const { setGuildConfig, getGuildConfig } = await import('../utils/config.js');

      if (key === 'automod') {
        const config = await getGuildConfig(interaction.guild.id);
        const newValue = !config.automod;
        await setGuildConfig(interaction.guild.id, 'automod', newValue);
        await interaction.reply({ content: `Automod ${newValue ? 'enabled' : 'disabled'}.`, ephemeral: true });
      } else if (key === 'logchannel' || key === 'welcomechannel') {
        const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = await import('discord.js');

        const modal = new ModalBuilder()
          .setCustomId(`config_modal:${key}`)
          .setTitle(`Set ${key === 'logchannel' ? 'Log' : 'Welcome'} Channel`);

        const channelInput = new TextInputBuilder()
          .setCustomId('channel')
          .setLabel('Channel ID or Mention')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('123456789012345678 or #channel')
          .setRequired(true);

        const row = new ActionRowBuilder().addComponents(channelInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('config_modal:')) {
      const key = interaction.customId.split(':')[1];
      const channelValue = interaction.fields.getTextInputValue('channel');
      const { setGuildConfig } = await import('../utils/config.js');

      // Extract channel ID from mention or ID
      let channelId = channelValue.replace(/[<#>]/g, '');
      if (!/^\d{17,19}$/.test(channelId)) {
        return await interaction.reply({ content: 'Invalid channel ID or mention.', ephemeral: true });
      }

      await setGuildConfig(interaction.guild.id, key === 'logchannel' ? 'logChannel' : 'welcomeChannel', channelId);
      await interaction.reply({ content: `${key === 'logchannel' ? 'Log' : 'Welcome'} channel set to <#${channelId}>.`, ephemeral: true });
    }
  }
}