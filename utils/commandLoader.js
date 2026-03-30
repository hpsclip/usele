import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(client, reload = false) {
  if (!client || !client.commands) {
    throw new Error('loadCommands requires a Discord client with client.commands initialized');
  }

  const commandsPath = path.join(__dirname, '../commands');

  try {
    const commandFiles = await readdir(commandsPath);

    if (reload) {
      client.commands.clear();
    }

    for (const file of commandFiles) {
      if (file.endsWith('.js')) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl);

        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`Loaded command: ${command.data.name}`);
        }
      }
    }

    console.log(`Total commands loaded: ${client.commands.size}`);
  } catch (error) {
    console.error('Error loading commands:', error);
    throw error;
  }
}
