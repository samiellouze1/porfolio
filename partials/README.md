# HTML partials

The homepage is assembled from these files (names follow each section’s main heading):

| File | Section heading / role |
|------|-------------------------|
| `shell-top.html` | `<!DOCTYPE>` through nav / mobile menu (before first section) |
| `hero.html` | Hero (`#hero`) |
| `who-am-i.html` | Who am I? (`#about`) |
| `education.html` | Education (`#educ`) |
| `work-experience.html` | Work Experience — FIS (`#fis`) |
| `my-internships.html` | My internships (`#work`) |
| `freelancing-experiences.html` | I also had a few freelancing experiences (`#blog`) |
| `learning-on-the-side.html` | Learning on the side (`#learning`) |
| `associative-life-and-hobbies.html` | Associative Life And Hobbies (`#portfolio`) |
| `contact-me.html` | Contact Me (`#contactme`) |
| `shell-bottom.html` | Closing layout + script tags |

**Workflow:** Edit the partial you need. During **`npm run develop`**, `index.html` is built first, then rebuilt automatically when you save any `partials/*.html`.

For a one-off build (e.g. before deploy):

```bash
npm run build:html
```

`index.html` at the repo root is **generated** and **gitignored**—browsers and Browser-sync still need that file locally; it is created by the scripts above.

Scripts: `scripts/build-index.js`, `scripts/watch-partials.js` (used by develop).
