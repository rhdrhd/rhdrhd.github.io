# Zirui Wang — personal website

A static editorial portfolio for AI infrastructure and agentic systems. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Structure

- `index.html`: complete English content and concise research summaries.
- `assets/css/style.css`: responsive reading grid, light/dark palettes, and print styles.
- `assets/js/main.js`: theme controls and retained Chinese/Japanese translation data. Professional copy stays the same across light/dark appearances.
- `assets/Zirui_Wang_Resume.pdf`: September 2026 résumé.
- `404.html`: matching not-found page.

The complete English content works without JavaScript. The footer pairs “Ad Astra” with the theme switch, which appears when JavaScript is available. Theme follows the system until explicitly changed and persists locally. The page stays in English without a language selector. No motion is required to read content.

## Content updates

Edit English in `index.html` and corresponding translation keys in `assets/js/main.js`. Keep evaluation conditions alongside performance claims. The SoCC 2026 item is a submission, not an accepted publication. Content was updated from the résumé supplied on September 9, 2026; detailed experience dates use that résumé rather than the limited public LinkedIn view.

Update the asset version strings when changing CSS, JavaScript, or the résumé to avoid stale deployment caches.

## Deploy

Push to `master`. `.github/workflows/pages.yml` uploads the repository and deploys it through GitHub Actions to GitHub Pages. Development branches do not automatically deploy. The configured public domain is https://zirui-w.com/.
