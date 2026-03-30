import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(client, reload = false) {
  const commandsPath = path.join(__dirname, '../commands');

  try {
    const commandFiles = await readdir(commandsPath);

    if (reload) {
      client.commands.clear();
    }

    for (const file of commandFiles) {
      if (file.endsWith('.js')) {
        const filePath = path.join(commandsPath, file);
        const command = await import(`${filePath}?update=${Date.now()}`);

        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
        }
      }
    }
  } catch (error) {
    console.error('Error loading commands:', error);
    throw error;
  }
}
