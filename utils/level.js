export function calculateRequiredXp(level) {
  return 100 + 100 * (level ** 2);
}

export function getLevelInfo(xp) {
  let level = 0, req = 0;
  while (xp >= (req = calculateRequiredXp(level))) level++;
  return { level: level - 1, currentXp: xp - calculateRequiredXp(level - 1), requiredXp: req };
}