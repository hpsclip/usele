import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

const responses = [
  "Yes", "No", "Maybe", "Ask again later", "Definitely", "Absolutely not",
  "I think so", "Not sure", "Outlook good", "Don't count on it"
];

export const data = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the magic 8-ball a question')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Your question')
      .setRequired(true)
  );

export async function execute(interaction) {
  const question = interaction.options.getString('question');
  const response = responses[Math.floor(Math.random() * responses.length)];

  const embed = createEmbed({
    title: 'Magic 8-Ball',
    description: `**Question:** ${question}\n**Answer:** ${response}`
  });

  await interaction.reply({ embeds: [embed] });
}