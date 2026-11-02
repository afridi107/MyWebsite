# J&F Originals – Website

One-page B2B website for J&F Originals (vending & lounge concepts), plus the pages `impressum.html` and `datenschutz.html`. Plain static files: HTML, CSS and a little vanilla JavaScript. There's no build step, database or cookies, and the page makes no external requests.

## Open locally
Double-click `index.html`, or drag it into Chrome, Edge or Firefox. You don't need a server.

## Structure
| Path | Content |
|---|---|
| `index.html` | One-page site (Hero, Vision, Konzept, Produktwelt, Details, Technik, Financial Model, Ablauf, Kontakt) |
| `impressum.html`, `datenschutz.html` | Legal pages |
| `assets/css/style.css` | Design (colours, fonts, layout) |
| `assets/js/main.js` | Mobile menu, scroll effects, contact form (mailto) |
| `assets/fonts/` | Self-hosted fonts (SIL Open Font License, licences included) |
| `assets/img/` | Images as AVIF/WebP in several sizes, with a JPG fallback |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Favicon and SEO files |
| `MyWebsite/` | Source material (brief, original images, slide previews). It isn't part of the website, so don't upload it. |

## Contact form
For now, the form opens the visitor's email program with a pre-filled message to info@jandforiginals.de (mailto). Nothing is sent to a server.

## Open items
- Choose hosting (see the brief), then fill in the hoster in `datenschutz.html` (marked `TODO`).
- Have the privacy text checked or finalised with a generator (marked `TODO` in `datenschutz.html`).
- Check the image licences for the Canva/stock images (hero, Konzept, product images, coffee images) before going live.
