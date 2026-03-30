import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { isAdmin } from '../utils/config.js';
import { getShop, removeItem } from '../utils/shop.js';

export const data = new SlashCommandBuilder()
  .setName('removeshopitem')
  .setDescription('Remove an item from the shop (Admin/Mod only)')
  .addIntegerOption(option =>
    option.setName('index')
      .setDescription('The number from /shop list (1-based)')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) || await isAdmin(interaction))) {
    return await interaction.reply({ content: 'You do not have permission to remove shop items.', ephemeral: true });
  }

  const index = interaction.options.getInteger('index') - 1;
  const shop = await getShop();
  if (index < 0 || index >= shop.length) {
    return await interaction.reply({ content: 'Invalid item number.', ephemeral: true });
  }

  const removed = shop[index];
  await removeItem(index);
  return await interaction.reply({ content: `Removed item **${removed.name}** from the shop.`, ephemeral: true });
}
