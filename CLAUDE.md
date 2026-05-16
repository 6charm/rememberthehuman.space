# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website "Remember The Human" (deployed at rmhspace.in via the `CNAME` file). Static HTML/CSS/vanilla JS — **no build step, no package manager, no test suite**. Edit files and reload the browser. Per `README.md`, the site is intentionally handmade ("no ai") and aims for a "slower internet" feel; keep additions minimal and avoid pulling in frameworks or build tooling.

## Running locally

Serve the repo root over HTTP (relative paths and ES module `<script type="module">` won't work via `file://`). Any static server works, e.g. `python3 -m http.server` from the repo root, then open the printed localhost URL. To view from another device on the LAN, hit `<laptop-ip>:<port>`.

## URL structure

Every published page lives at a root-level folder with `index.html`, so URLs are `rmhspace.in/<slug>/` with no `notes/`, `projects/`, `.html`, or `index.html` in the path. Notes and projects are visually distinguished only by the home-page `[Projects]` / `[Notes]` navbar tabs, not by on-disk location.

Reserved slugs (must not be used for pages): `about`, `assets`, `css`, `data`, `scripts`, `thoughts`, `_templates`, `_drafts`.

## Architecture

Single shared script `scripts/main.js` is loaded as an ES module from every page (`index.html`, `about/index.html`, and each `<slug>/index.html`). It feature-detects which page it's on by querying for elements — there's no router. Sections of it:

- **Mobile blocker** (`isMobile()` + DOMContentLoaded handler): on touch devices ≤768px, replaces the page with a "please use desktop" overlay.
- **Home page dynamic sections** (`loadSection`, `sectionContents`): the navbar items `Projects` and `Notes` are `.bracket-item[data-page=...]` divs. Clicking one renders HTML built by `buildColumnSection` / `buildNotesGrid` into `#dynamic-content`. Default section on load is `Notes`. `projectData` is derived from `/data/projects.js` (the single source of truth for projects); `notesData` is a hardcoded array in the DOMContentLoaded handler.
- **Project landing pages** (`<slug>/index.html` with a `[data-project]` root): `scripts/project-page.js` mounts the page by reading the matching record in `data/projects.js` and filling `[data-slot]` markers. The `[log]` toggle fetches `<slug>/log/week-N.html` fragments into a side panel.
- **Note pages**: standalone HTML files based on `_templates/note.html`. The shared script's `setupMarginNotes` and `setupCiteImages` activate `<span class="annotated" data-note="...">` margin notes and `<span class="cite-img" data-img="...">` click-to-show images — see `about/index.html` for working examples of both patterns.
- **Video-on-hover** (`setupVideoFollow`): elements with `id="self-gif"` containing `<video id="gif">` get a cursor-follow video preview. Used in `about/index.html`.
- **Rotating logo**: `.rotating-logo` elements spin on hover via requestAnimationFrame.

## Adding a note

1. `cp _templates/note.html <slug>/index.html` (creates a new root-level folder named `<slug>` containing `index.html`).
2. Update `<title>` and the `.note-title` text; write `<p>` content inside `.note-text`.
3. Append an entry to the `notesData` array in `scripts/main.js` so it shows up on the Notes grid. Existing entries are audio tiles `{ title, audio, thumb }`. For a link-style note, use `{ title, href: "<slug>/" }` and extend `buildNotesGrid` to render link tiles (it currently calls `makeAudioTile` unconditionally).

For richer notes (margin annotations, inline citation images), copy the `data-note` and `cite-img` patterns from `about/index.html`.

## Adding a project

1. **Pick a slug**: URL-safe, lowercase, dash-separated. The slug is the folder name and the URL (`rmhspace.in/<slug>/`). Avoid reserved slugs listed under "URL structure".
2. **Create the page**: `cp _templates/project.html <slug>/index.html`. Edit:
   - `<title>` tag
   - `data-project="SLUG"` → `data-project="<slug>"` (must match the slug used in step 3)
   - Replace the placeholder body inside `.note-text` with the actual description.
3. **Register in `data/projects.js`** — append to the `projects` array:
   ```js
   {
     slug: "<slug>",
     shortName: "Name shown on home grid",
     fullTitle: "Long subtitle shown on the project page",
     authors: [
       { name: "Armaan Chowfin" },
       { name: "Collaborator", url: "https://their-site.example" }  // url optional
     ],
     homepage: "https://...",      // optional, shown next to title
     programUrl: "https://...",    // optional, shown next to subtitle
     href: "<slug>/",              // must equal folder name + trailing slash
     log: []                       // empty if no work log
   }
   ```
   The home page Projects grid maps over this array (`projectData` in `scripts/main.js`), so the new project appears automatically.
4. **Optional work log**: create `<slug>/log/week-1.html`, `week-2.html`, etc. Each file is a body-only HTML fragment (no `<html>` / `<head>`) — `project-page.js` fetches it and injects it into the side panel. Then populate the `log` array:
   ```js
   log: [
     { week: 1, title: "kickoff",     date: "DD-MM-YYYY" },
     { week: 2, title: "first build", date: "DD-MM-YYYY" }
   ]
   ```
   The `[log]` toggle renders automatically when `log` is non-empty. See `rtems/` for a worked example.

## Conventions

- All paths in HTML are relative; subpages one level deep reach shared assets via `../assets/`, `../css/`, `../scripts/`.
- SVGs must be SVG 1.1 to render correctly (per README).
- `_templates/` and `_drafts/` hold non-published files (templates and unpublished text drafts). The underscore prefix is a convention only — GitHub Pages still serves them, so don't link to anything inside.
- No new dependencies or build tooling without being asked — the "handmade web, no ai" stance is a deliberate product choice.
