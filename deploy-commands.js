import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const commandsPath = path.join(__dirname, 'commands');

try {
  const commandFiles = await readdir(commandsPath);
  for (const file of commandFiles) {
    if (file.endsWith('.js')) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }
  }
} catch (error) {
  console.error('Error reading commands directory:', error);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands },
  );
  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}