import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { isAdmin } from '../utils/config.js';
import { addItem } from '../utils/shop.js';

export const data = new SlashCommandBuilder()
  .setName('addshopitem')
  .setDescription('Add an item to the shop (Admin/Mod only)')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Item name')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('price')
      .setDescription('Price in bucks')
      .setRequired(true)
      .setMinValue(1)
  )
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Item description')
      .setRequired(false)
  );

export async function execute(interaction) {
  if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) || await isAdmin(interaction))) {
    return await interaction.reply({ content: 'You do not have permission to add shop items.', ephemeral: true });
  }

  const name = interaction.options.getString('name');
  const price = interaction.options.getInteger('price');
  const description = interaction.options.getString('description');

  await addItem(name, price, description || 'No description');
  await interaction.reply({ content: `Added item **${name}** for **${price}** bucks to the shop.`, ephemeral: true });
}
