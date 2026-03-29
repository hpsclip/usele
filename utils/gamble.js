export function coinflip(choice) {
  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  return { win: choice === result, result };
}

export function dice(guess) {
  const roll = 1 + Math.floor(Math.random() * 6);
  return { win: guess === roll, result: roll };
}

export function slots() {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎'];
  const result = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
  const win = result[0] === result[1] && result[1] === result[2];
  return { win, result };
}