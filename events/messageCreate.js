import { getData, writeData } from '../utils/db.js';
import { getLevelInfo } from '../utils/level.js';
import { getGuildConfig } from '../utils/config.js';
import { loadCommands } from '../utils/commandLoader.js';

const xpCooldown = new Map();

export const name = 'messageCreate';

export async function execute(message, client) {
  if (message.author.bot) return;

  const config = await getGuildConfig(message.guild.id);

  // Prefix command fallback so bot works while slash commands are still registering
  const prefix = '!';
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
      const commands = [...message.client.commands.values()].map(c => `• ${c.data.name} - ${c.data.description || 'No description'}`);
      const helpText = `Available commands:\n${commands.join('\n')}\n\nUse slash commands with / when available.`;
      return message.channel.send(helpText);
    }

    if (command === 'reload') {
      if (!message.member.permissions.has('ManageGuild')) {
        return message.channel.send('You do not have permission to use this command.');
      }

      try {
        await message.client.commands.clear();
        await loadCommands(message.client, true);
        return message.channel.send('Commands reloaded successfully.');
      } catch (error) {
        console.error('Prefix reload failed:', error);
        return message.channel.send('Failed to reload commands; check logs.');
      }
    }
  }

  // XP system
  if (!xpCooldown.has(message.author.id)) {
    xpCooldown.set(message.author.id, Date.now());
    const data = await getData();
    if (!data.xp) data.xp = {};
    data.xp[message.author.id] = (data.xp[message.author.id] || 0) + Math.floor(Math.random() * 10) + 5;
    await writeData(data);

    const { level } = getLevelInfo(data.xp[message.author.id]);
    // level up message if needed
  }

  // Automod
  if (config.automod) {
    // implement automod logic
  }

  setTimeout(() => xpCooldown.delete(message.author.id), 60000); // 1 min cooldown
}