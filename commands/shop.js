import { SlashCommandBuilder } from 'discord.js';
import { getShop } from '../utils/shop.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('shop')
  .setDescription('View available shop items');

export async function execute(interaction) {
  const shop = await getShop();
  if (!shop || shop.length === 0) {
    return await interaction.reply({ content: 'The shop is empty. An admin can add items with /addshopitem.', ephemeral: true });
  }

  const fields = shop.map((item, index) => ({
    name: `${index + 1}. ${item.name} — ${item.price} bucks`,
    value: item.description || 'No description',
    inline: false
  }));

  const embed = createEmbed({
    title: 'Shop',
    description: 'Use /buy to purchase an item (by number).',
    fields
  });

  await interaction.reply({ embeds: [embed] });
}
