/**
 * Rebuilds index.html when any partial under /partials changes.
 * Used by `npm run develop` so the dev server always serves fresh HTML.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'partials');
const buildScript = path.join(__dirname, 'build-index.js');

function rebuild() {
  try {
    execFileSync(process.execPath, [buildScript], { cwd: root, stdio: 'inherit' });
  } catch {
    // build-index already printed the error
  }
}

let debounce;
function schedule() {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log('\n[partials] Rebuilding index.html…');
    rebuild();
  }, 120);
}

if (!fs.existsSync(partialsDir)) {
  console.error('partials/ not found');
  process.exit(1);
}

fs.watch(partialsDir, { persistent: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.html')) {
    schedule();
  }
});

console.log('Watching partials/*.html for changes (rebuilds index.html)…');
