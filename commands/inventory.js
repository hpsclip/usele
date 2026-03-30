import { SlashCommandBuilder } from 'discord.js';
import { getInventory } from '../utils/inventory.js';
import { createEmbed } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory');

export async function execute(interaction) {
  const items = await getInventory(interaction.user.id);
  if (!items || items.length === 0) {
    return await interaction.reply({ content: 'Your inventory is empty.', ephemeral: true });
  }

  const description = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
  const embed = createEmbed({
    title: `${interaction.user.username}'s Inventory`,
    description,
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
