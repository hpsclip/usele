import 'dotenv/config';
import { webcrypto } from 'node:crypto';
import { ReadableStream } from 'node:stream/web';

global.crypto = webcrypto;
global.ReadableStream = ReadableStream;

import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

import { loadCommands } from './utils/commandLoader.js';

async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  try {
    const eventFiles = await readdir(eventsPath);
    for (const file of eventFiles) {
      if (file.endsWith('.js')) {
        const filePath = path.join(eventsPath, file);
        const event = await import(filePath);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    }
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

await loadCommands(client);
await loadEvents();

async function registerCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');

  try {
    const commandFiles = await readdir(commandsPath);
    for (const file of commandFiles) {
      if (file.endsWith('.js')) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl);
        if (command.data) {
          commands.push(command.data.toJSON());
        }
      }
    }
  } catch (error) {
    console.error('Error reading commands for registration:', error);
    return;
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log(`Successfully reloaded guild commands for GUILD_ID=${process.env.GUILD_ID}.`);
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log('Successfully reloaded global application commands.');
    }
  } catch (error) {
    console.error('Failed to refresh commands:', error);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await registerCommands();
});

client.login(process.env.TOKEN);