import { EmbedBuilder } from "discord.js";

export function createEmbed({ title, description, color = 0x5865f2, fields = [], footer, timestamp = true }) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description || null);

  if (fields.length) embed.addFields(fields);
  if (footer) embed.setFooter({ text: footer });
  if (timestamp) embed.setTimestamp();

  return embed;
}