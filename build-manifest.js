// Regenerates manifest.json from the battles/ and daily/ folders.
// Run with: node build-manifest.js
const fs = require('fs');

const list = (dir) =>
  fs.readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));

const battles = list('battles')
  .filter((id) => /^\d+$/.test(id))
  .sort((a, b) => a - b); // ascending

const toTime = (id) => {
  const [d, m, y] = id.split('.').map(Number);
  return new Date(y, m - 1, d).getTime();
};
const daily = list('daily')
  .filter((id) => /^\d+\.\d+\.\d{4}$/.test(id))
  .sort((a, b) => toTime(b) - toTime(a)); // newest first

fs.writeFileSync('manifest.json', JSON.stringify({ battles, daily }));
console.log(`${battles.length} battles, ${daily.length} daily`);
