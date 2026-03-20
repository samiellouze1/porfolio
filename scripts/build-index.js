/**
 * Assembles index.html from partials in /partials.
 * Edit section files (hero.html, about.html, …) then run:
 *   npm run build:html
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'partials');

const files = [
  'shell-top.html',
  'hero.html',
  'about.html',
  'work.html',
  'blog.html',
  'portfolio.html',
  'shell-bottom.html',
];

const out = files
  .map((name) => {
    const p = path.join(partialsDir, name);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing partial: ${p}`);
    }
    return fs.readFileSync(p, 'utf8').trimEnd();
  })
  .join('\n');

fs.writeFileSync(path.join(root, 'index.html'), out + '\n');
console.log('Wrote index.html from partials/');
