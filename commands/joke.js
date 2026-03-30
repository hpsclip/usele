import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

const jokes = [
  "Why did the developer go broke? Because he used up all his cache!",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "What do you call a fake noodle? An impasta!",
  "Why did the computer go to therapy? It had too many bytes of emotional baggage!",
  "How do you organize a space party? You planet!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What did the ocean say to the beach? Nothing, it just waved!",
  "Why was the math book sad? Because it had too many problems!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why did the scarecrow win an award? He was outstanding in his field!"
];

export const data = new SlashCommandBuilder()
  .setName('joke')
  .setDescription('Get a random joke');

export async function execute(interaction) {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];

  const embed = createEmbed({
    title: 'Joke',
    description: joke
  });

  await interaction.reply({ embeds: [embed] });
}