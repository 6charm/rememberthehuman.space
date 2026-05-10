# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website "Remember The Human" (deployed at rmhspace.in via the `CNAME` file). Static HTML/CSS/vanilla JS — **no build step, no package manager, no test suite**. Edit files and reload the browser. Per `README.md`, the site is intentionally handmade ("no ai") and aims for a "slower internet" feel; keep additions minimal and avoid pulling in frameworks or build tooling.

## Running locally

Serve the repo root over HTTP (relative paths and ES module `<script type="module">` won't work via `file://`). Any static server works, e.g. `python3 -m http.server` from the repo root, then open the printed localhost URL. To view from another device on the LAN, hit `<laptop-ip>:<port>`.

## Architecture

Single shared script `scripts/main.js` is loaded as an ES module from every page (`index.html`, `about/index.html`, `notes/*.html`). It feature-detects which page it's on by querying for elements — there's no router. Sections of it:

- **Mobile blocker** (`isMobile()` + DOMContentLoaded handler): on touch devices ≤768px, replaces the page with a "please use desktop" overlay.
- **Home page dynamic sections** (`loadSection`, `sectionContents`): the navbar items `Projects` and `Notes` are `.bracket-item[data-page=...]` divs. Clicking one renders HTML built by `buildColumnSection` / `buildNotesGrid` into `#dynamic-content`. Default section on load is `Notes`. Project and note entries live as JS objects in the `projectData` and `notesData` arrays inside the DOMContentLoaded handler (~lines 200 and 205).
- **Note pages** (`notes/*.html`): each is a standalone HTML file based on `notes/template.html`. The shared script's `setupMarginNotes` and `setupCiteImages` activate `<span class="annotated" data-note="...">` margin notes and `<span class="cite-img" data-img="...">` click-to-show images — see `about/index.html` for working examples of both patterns.
- **Video-on-hover** (`setupVideoFollow`): elements with `id="self-gif"` containing `<video id="gif">` get a cursor-follow video preview. Used in `about/index.html`.
- **Rotating logo**: `.rotating-logo` elements spin on hover via requestAnimationFrame.

## Adding a note

1. `cp notes/template.html notes/<slug>.html`
2. Update `<title>` and the `.note-title` text; write `<p>` content inside `.note-text`.
3. Append an entry to the `notesData` array in `scripts/main.js` (~line 205) so it shows up in the home page Notes grid. The current entries are audio tiles (`{title, audio, thumb}`) rendered by `makeAudioTile` — match that shape, or extend the renderer if adding a different note type.

For richer notes (margin annotations, inline citation images), copy the patterns from `about/index.html`.

## Conventions

- All paths in HTML are relative; subpages (`about/`, `notes/`) reach shared assets via `../assets/`, `../css/`, `../scripts/`.
- SVGs must be SVG 1.1 to render correctly (per README).
- No new dependencies or build tooling without being asked — the "handmade web, no ai" stance is a deliberate product choice.
