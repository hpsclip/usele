import { getData, writeData } from '../utils/db.js';
import { getLevelInfo } from '../utils/level.js';
import { getGuildConfig } from '../utils/config.js';

const xpCooldown = new Map();

export const name = 'messageCreate';

export async function execute(message, client) {
  if (message.author.bot) return;

  const config = await getGuildConfig(message.guild.id);

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