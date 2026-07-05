# rhdrhd.github.io

Personal site of Zirui Wang — **The Gallery & The Bonfire**.

A single static page, no build step, no dependencies:

- **Light mode — the Gallery.** Impressionist palette; a pointillism hero where a few thousand particles drift in Monet water-lily colors and resolve into the name — meaning assembled from discrete parts, tokens and dots of paint alike.
- **Dark mode — the Bonfire.** Gold-on-charcoal, rising embers, the same content re-skinned with soulslike flavor text. The toggle is a small flame that ignites.

The chosen mode persists in `localStorage` and defaults to the visitor's `prefers-color-scheme`. All animation respects `prefers-reduced-motion`.

## Structure

```
index.html          — the whole site
404.html            — themed not-found page
assets/css/style.css
assets/js/main.js   — particle hero, theme toggle, scroll reveal
```

## Deploy

Push to `master`. GitHub Actions (`.github/workflows/pages.yml`) uploads the repo as-is and deploys it to GitHub Pages — no build step. Pages source must be set to **GitHub Actions** in the repo settings.
