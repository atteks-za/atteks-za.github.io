# atteks-za.github.io

Source for my portfolio at **[portfolio.pepsnet.co.za](https://portfolio.pepsnet.co.za)**. It's a static site (HTML, CSS and plain JavaScript) with no build step, hosted on GitHub Pages.

## Adding a project or certification

Everything on the page comes from **`data.js`**:

- **Project:** copy an entry in `PROJECTS` and change `title`, `domain`, `summary`, `tags` and `url`. Add `featured: true` to also show it under *Featured work*.
- **Certification:** add an entry to `CERTS` with the badge image URL and the verification link.

Counts, filters, pagination and search all update from this file on their own.

## Features

- Light and dark mode: follows the device setting, remembers a manual choice, and doesn't flash on load
- Command palette (`Ctrl K` / `⌘ K`) to jump to sections, open projects, copy the email address or switch theme
- Project filters by domain, search with match highlighting (`/` to focus), and 9 projects per page
- Filter state is kept in the URL, so links like `?domain=networking` can be shared
- SEO and sharing: Open Graph tags, JSON-LD profile data, sitemap and robots.txt
- Accessibility: skip link, keyboard navigation, visible focus styles and reduced-motion support
- Custom 404 page and a print-friendly layout

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and static copy |
| `data.js` | Projects, certifications and links |
| `script.js` | Rendering and interactivity |
| `styles.css` | Design tokens, layout, light/dark themes |
| `404.html` | Not-found page |
| `CNAME` | Custom domain for GitHub Pages |
