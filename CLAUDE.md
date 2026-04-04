# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for the CBC (China Business Culture) annual forum at forum-cbc.ru. No build tooling — plain HTML, CSS, and JavaScript served directly by Apache.

Dev preview: https://zobkov.github.io/cbc-website/

## Development Commands

**Cache busting** — run before deploying when CSS or JS files changed:
```bash
./scripts/bump-asset-version.sh 20260313-2
```
Format: `YYYYMMDD-N` (date + iteration number). This updates `.asset-version` and rewrites all `?v=...` query params in every `.html` file.

After running, commit the version bump together with the release changes.

## Git Workflow

- `main` — production
- `dev` — staging/pre-production
- Feature branches → PR → merge (never commit directly to main)
- Split PRs as granularly as possible: one page change, one script change, one text change = three separate PRs

## Architecture

**No build pipeline.** CSS is loaded via `@import` in `style/style.css`. JS files are already-minified (`main.min.js`, `vendor.min.js`) plus per-page source files. No bundler, no preprocessor, no framework.

### CSS structure
```
style/
  style.css               ← entry point, imports everything below
  base/normalize-and-base.css
  components/             ← header, footer, faq, cta_reg
  sections/               ← one file per page (home, about, registration, schedule, etc.)
```
Naming is BEM-like (`.hero__title`, `.registration__wrapper`). Responsive breakpoints: 767px (mobile), 1023px (tablet), 1439px (small desktop). Uses `clamp()` for fluid typography. CSS variables for color tokens at `:root`.

### JS structure
```
js/
  vendor.min.js           ← small third-party bundle (~6 KB)
  main.min.js             ← bundled site JS (~53 KB)
  burger.js, dropdown.js, faq-tabs.js, ecosystem-swipe.js, ...  ← individual source files
  registration-general.js ← largest file, handles the multi-role registration form
```
All JS is vanilla. Modules use IIFEs. Elements are selected with data attributes (`[data-faq-tabs]`, `[data-eco-carousel]`). State is managed with class toggles (`.is-active`, `.is-open`, `.menu-open`). Form submissions go to `https://test-zobkov.amvera.io/api/v1/registrations`.

### Page template
Every HTML page follows the same structure: Google Analytics + Yandex.Metrika in `<head>`, single `style/style.css?v=VERSION` link, a `<div class="page-wrapper">` wrapping header/main/footer, then `vendor.min.js`, `main.min.js`, and any page-specific JS at the bottom — all with `?v=VERSION` cache-busting params.

### Backend
Two PHP endpoints (`tg.php`, `tg_media.php`) handle Telegram bot integration. Credentials are in `.env` (gitignored).

### Apache
`.htaccess` strips `.html` extensions from URLs, sets 1-year cache on CSS/JS assets (works with `?v=` versioning), and 5-minute cache on HTML.
