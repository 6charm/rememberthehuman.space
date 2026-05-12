# Authoring

How to add or edit content on this site. No build step — edit a file, reload a browser tab. For local serving (so ES modules and `fetch()` work):

```sh
python3 -m http.server
```

from the repo root, then open the printed `localhost:<port>` URL.

---

## 1. Add a new project

Three things to touch: the data file, a folder, a landing page.

1. Append an entry to the `projects` array in `data/projects.js`. Required keys: `slug`, `shortName`, `fullTitle`, `authors`, `href`. Optional: `homepage`, `programUrl`, `log`. See [Reference](#reference--data-shapes).

2. Create the folder:
   ```sh
   mkdir projects/<slug>/
   ```
   The folder name **must** match the `slug` in the data entry.

3. Copy the existing landing page as a starting point:
   ```sh
   cp projects/rtems/index.html projects/<slug>/index.html
   ```
   Inside the new file, change `data-project="<slug>"` (line ~22) to match. Replace the placeholder paragraphs in `<div class="note-text">` with your writeup. The title, author, subtitle, and `[log]` toggle are all generated from the data entry — don't hand-write them in the HTML.

4. Reload the home page. The new project appears as a numbered card in the Projects section automatically — `scripts/main.js` derives the cards from the `projects` array.

---

## 2. Add a weekly log entry to a project

Two things to touch: the data file, a fragment file.

1. Append an entry to the project's `log: []` array in `data/projects.js`:
   ```js
   { week: 2, title: "TCP zero-copy", date: "2026-05-17" }
   ```
   `title` may be an empty string if not yet decided — the renderer omits the colon in that case.

2. Create the fragment:
   ```sh
   touch projects/<slug>/log/week-2.html
   ```
   The file holds **only body prose** (no `<html>`, no `<head>`). The right-side panel injects this fragment into a styled container at runtime. Example:
   ```html
   <p>First paragraph.</p>
   <p>Second paragraph.</p>

   <img src="log/assets/diagram.png" alt="lwIP stack layers">

   <figure>
     <img src="log/assets/screenshot.png" alt="qemu trace">
     <figcaption>QEMU boot trace, week 2.</figcaption>
   </figure>
   ```

3. Drop any images into `projects/<slug>/log/assets/`. Reference them from a week fragment as `log/assets/<file>` — relative paths in the fragment resolve from the landing page URL, not the fragment file. `<img>` is styled full-width with auto height; wrap in `<figure>` to add a small monospace `<figcaption>`.

4. Reload the project landing page. Click `[log]` → the new week appears in the ladder. Clicking it fetches the fragment and renders it in the right panel with a heading + date generated from the data entry.

---

## 3. Add a note

1. Duplicate the template:
   ```sh
   cp notes/template.html notes/<slug>.html
   ```

2. Edit the new file:
   - Update `<title>` in `<head>`.
   - Replace the text inside `<div class="note-title">`.
   - Write `<p>` paragraphs inside `<div class="note-text">`.

3. Append an entry to `notesData` in `scripts/main.js` (~line 287) so the note shows up in the home-page Notes grid. Existing entries are audio tiles rendered by `makeAudioTile(title, audio, thumb)`:
   ```js
   { title: "my-note", audio: "assets/audio/x.mp3", thumb: "octotat-red" }
   ```
   For a non-audio note type, extend the renderer.

4. Margin notes and inline citation images work automatically. Inside the prose:
   - `<span class="annotated" data-note="…">word</span>` — fades a margin note in on hover.
   - `<span class="cite-img" data-img="path/to/image.jpg">word</span>` — toggles an inline image on click.

   See `about/index.html` for working examples.

---

## 4. Edit project metadata

Everything is in `data/projects.js`. Hot-edit any field; no rebuild.

| Field | Effect |
|---|---|
| `shortName` | Title on the home card and the project landing's title column. |
| `fullTitle` | Body subtitle on the project landing. |
| `authors` | Array of `{ name, url? }`. Add `url` to turn a name into an external link. |
| `homepage` | External link rendered next to `shortName` as a small hostname (e.g. `rtems.org`). Omit to hide. |
| `programUrl` | External link rendered next to `fullTitle`. Omit to hide. |
| `slug` | URL slug + the value of `data-project="…"` in the project's `index.html`. Renaming requires also renaming the folder, the `data-project` attribute, and `href`. |
| `href` | Path the home-page card links to. Should match `projects/<slug>/index.html`. |
| `log` | Array of `{ week, title, date }`. See [section 2](#2-add-a-weekly-log-entry-to-a-project). |

---

## Reference — data shapes

### `data/projects.js`

```js
{
  slug: "rtems",                                 // required, matches folder + data-project
  shortName: "RTEMS",                            // required
  fullTitle: "GSoC'26: lwIP network stack",      // required
  authors: [                                     // required
    { name: "Armaan Chowfin" },
    { name: "Pavel Píša", url: "https://cmp.felk.cvut.cz/~pisa/" }
  ],
  homepage: "https://www.rtems.org/",            // optional
  programUrl: "https://summerofcode.withgoogle.com/programs/2026/projects/...",
  href: "projects/rtems/index.html",             // required
  log: [                                         // optional, may be empty
    { week: 1, title: "kickoff", date: "2026-05-10" }
  ]
}
```

### `scripts/main.js` — `notesData`

```js
{
  title: "…",
  audio: "assets/audio/x.mp3",
  thumb: "octotat-red"        // identifier matched by makeAudioTile
}
```

### Project page slot markers

In `projects/<slug>/index.html`, the renderer fills in any `[data-slot]` element. You only need three on a landing page:

```html
<div class="note-page-content" data-project="<slug>">
  <div class="note-title-col" data-slot="title-col"></div>

  <div class="note-text-wrapper">
    <div class="note-text">
      <div data-slot="log"></div>
      <div data-slot="subtitle"></div>
      <p>...your prose here...</p>
    </div>
  </div>

  <aside class="log-panel" data-slot="panel"></aside>
</div>
```
