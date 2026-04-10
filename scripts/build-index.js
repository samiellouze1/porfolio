/**
 * Assembles index.html from partials in /partials.
 * Edit section files then run:
 *   npm run build:html
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'partials');
const withoutAws = process.argv.includes('--withoutaws') || process.env.npm_config_withoutaws === 'true';

const allFiles = [
  'shell-top.html',
  'hero.html',
  'who-am-i.html',
  'education.html',
  'work-experience.html',
  'my-internships.html',
  'freelancing-experiences.html',
  'learning-on-the-side.html',
  'associative-life-and-hobbies.html',
  'contact-me.html',
  'shell-bottom.html',
];
const files = withoutAws
  ? allFiles.filter((name) => name !== 'learning-on-the-side.html')
  : allFiles;

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
console.log(
  `Wrote index.html from partials/ (${withoutAws ? 'without' : 'with'} Learning on the side)`
);
