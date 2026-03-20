# HTML partials

The homepage is assembled from these files:

| File | Contents |
|------|----------|
| `shell-top.html` | `<!DOCTYPE>` through nav / mobile menu (before first section) |
| `hero.html` | Hero section (`#hero`) |
| `about.html` | About section |
| `work.html` | Work section |
| `blog.html` | Blog section |
| `portfolio.html` | Portfolio section |
| `shell-bottom.html` | Closing layout + script tags |

**Workflow:** Edit the partial you need. During **`npm run develop`**, `index.html` is built first, then rebuilt automatically when you save any `partials/*.html`.

For a one-off build (e.g. before deploy):

```bash
npm run build:html
```

`index.html` at the repo root is **generated** and **gitignored**—browsers and Browser-sync still need that file locally; it is created by the scripts above.

Scripts: `scripts/build-index.js`, `scripts/watch-partials.js` (used by develop).
