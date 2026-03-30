import { SlashCommandBuilder } from 'discord.js';
import { getShop } from '../utils/shop.js';
import { getBalance, subtractBalance } from '../utils/economy.js';
import { addInventory } from '../utils/inventory.js';

export const data = new SlashCommandBuilder()
  .setName('buy')
  .setDescription('Buy a shop item')
  .addIntegerOption(option =>
    option.setName('item')
      .setDescription('Item number from /shop')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  const selected = interaction.options.getInteger('item') - 1;
  const shop = await getShop();

  if (selected < 0 || selected >= shop.length) {
    return await interaction.reply({ content: 'Invalid item number.', ephemeral: true });
  }

  const item = shop[selected];
  const balance = await getBalance(interaction.user.id);

  if (balance < item.price) {
    return await interaction.reply({ content: 'You do not have enough bucks to buy this item.', ephemeral: true });
  }

  await subtractBalance(interaction.user.id, item.price);
  await addInventory(interaction.user.id, item.name);

  return await interaction.reply({ content: `You bought **${item.name}** for **${item.price}** bucks.`, ephemeral: true });
}
