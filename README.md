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
- `assets/Zirui_Wang_Resume.pdf`: downloadable résumé.
- `assets/when-which-and-what-to-fork.pdf`: the SoCC 2026 paper (CC BY 4.0).
- `papers/when-which-and-what-to-fork/index.html`: the paper's own page with abstract, publication record, and BibTeX. Its `citation_*` meta tags are what Google Scholar reads; keep them in step with the visible text.
- `sitemap.xml` and `robots.txt`: list the homepage, the paper page, and the paper PDF for search engines. Add new pages to the sitemap.
- `404.html`: matching not-found page.

The complete English content works without JavaScript. The footer pairs “Ad Astra” with the theme switch, which appears when JavaScript is available. Theme follows the system until explicitly changed and persists locally. The page stays in English without a language selector. No motion is required to read content.

## Content updates

Edit English in `index.html` and corresponding translation keys in `assets/js/main.js`. Keep evaluation conditions alongside performance claims. The [ACM SoCC 2026 program](https://acmsocc.org/2026/socc26-program-papers.html#paper-1427) lists the accepted short paper and its authors.

Update the asset version strings when changing CSS, JavaScript, or the résumé to avoid stale deployment caches.

## Deploy

Push to `master`. `.github/workflows/pages.yml` uploads the repository and deploys it through GitHub Actions to GitHub Pages. Development branches do not automatically deploy. The configured public domain is https://zirui-w.com/.
