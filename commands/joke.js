import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "What do you call fake spaghetti? An impasta!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a belt made out of watches? A waist of time!"
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