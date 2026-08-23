# Maison Élan — Luxury Boutique Website

A premium fashion boutique site built with React + Vite + Tailwind CSS + Framer Motion.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
```

## Structure

```
src/
  components/     one file per section (Navbar, Hero, FeaturedCollections, ...)
  data/content.js mock products, collections, testimonials, gallery images
  App.jsx         composes all sections, holds cart/wishlist/dark-mode state
  index.css       Tailwind layers + shared classes (.btn-gold, .section-heading, etc.)
tailwind.config.js  color palette, fonts, shadows, animations
```

## Notes

- All product/collection images are placeholder Unsplash URLs — swap in your own product photography before launch.
- Cart, wishlist, and dark mode use plain `useState` in `App.jsx` and pass down as props — no external state library.
- Dark mode toggle lives in the navbar; it's the "quiet luxury" dark palette (`ink-950` family), not a full second theme.
- The gold "stitch rule" divider (`.stitch-rule` in index.css) is the signature motif reused across every section — a nod to tailoring.
