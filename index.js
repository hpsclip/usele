import 'dotenv/config';
import { webcrypto } from 'node:crypto';
import { ReadableStream } from 'node:stream/web';

global.crypto = webcrypto;
global.ReadableStream = ReadableStream;

import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);