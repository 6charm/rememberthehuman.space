// Renderer for project landing pages.
//
// A page opts in by placing a root element with data-project="<slug>" that
// contains <div data-slot="..."> markers. This module fills those slots from
// the data in /data/projects.js, then wires the [log] ladder so clicking an
// entry reveals that week's content in a right-side panel on the same page.
// Prose stays as static HTML inside the page — only the chrome is generated.

import { findProject, findWeek } from "../data/projects.js";

function hostLink(url) {
  if (!url) return "";
  const host = new URL(url).hostname.replace(/^www\./, "");
  return ` <span class="note-source"><a href="${url}" target="_blank" rel="noopener">${host}</a></span>`;
}

function renderTitleCol(project) {
  const list = Array.isArray(project.authors)
    ? project.authors
    : (project.author ? [{ name: project.author }] : []);
  const authors = list
    .map(a => a.url
      ? `<a href="${a.url}" target="_blank" rel="noopener">${a.name}</a>`
      : a.name)
    .join(", ");

  const hero = project.heroImage
    ? `<img class="note-hero" src="${project.heroImage}" alt="${project.shortName}">`
    : "";

  return `
    <a class="project-back" href="../#projects">← projects</a>
    <div class="note-title">${project.shortName}${hostLink(project.homepage)}</div>
    <div class="note-author">${authors}</div>
    ${hero}
  `;
}

function weekLabel(entry) {
  return entry.title ? `Week ${entry.week}: ${entry.title}` : `Week ${entry.week}`;
}

function renderLogToggle(project) {
  if (!project.log || project.log.length === 0) return "";

  const items = project.log
    .slice()
    .sort((a, b) => a.week - b.week)
    .map(entry => `
      <li>
        <a href="log/week-${entry.week}.html" data-week="${entry.week}">
          ${weekLabel(entry)}
          <span class="date">${entry.date}</span>
        </a>
      </li>
    `).join("");

  return `
    <details class="log-toggle">
      <summary>[log]</summary>
      <ol class="log-ladder">${items}</ol>
    </details>
  `;
}

function fillSlot(root, name, html) {
  const slot = root.querySelector(`[data-slot="${name}"]`);
  if (slot) slot.innerHTML = html;
}

function attachLogPanel(root, project) {
  const ladder = root.querySelector(".log-ladder");
  const panel = root.querySelector('[data-slot="panel"]');
  const toggle = root.querySelector("details.log-toggle");
  if (!ladder || !panel) return;

  function closePanel() {
    panel.innerHTML = "";
    panel.classList.remove("open");
    ladder.querySelectorAll("li.active").forEach(el => el.classList.remove("active"));
  }

  if (toggle) {
    toggle.addEventListener("toggle", () => {
      if (!toggle.open) closePanel();
    });
  }

  ladder.addEventListener("click", async (e) => {
    const link = e.target.closest("a[data-week]");
    if (!link) return;
    e.preventDefault();

    const li = link.closest("li");
    const weekNum = parseInt(link.dataset.week, 10);

    // Toggle off if clicking the active entry
    if (li.classList.contains("active")) {
      panel.innerHTML = "";
      panel.classList.remove("open");
      li.classList.remove("active");
      return;
    }

    // Clear any previously active entry
    ladder.querySelectorAll("li.active").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    const week = findWeek(project, weekNum);
    const chrome = week
      ? `<h3>${weekLabel(week)}</h3>
         <div class="log-panel-date">${week.date}</div>`
      : "";

    try {
      const res = await fetch(link.getAttribute("href"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      panel.innerHTML = chrome + body;
      panel.classList.add("open");
    } catch (err) {
      panel.innerHTML = `${chrome}<p>Failed to load week content (${err.message}).</p>`;
      panel.classList.add("open");
    }
  });
}

function mountLandingPage(root, project) {
  fillSlot(root, "title-col", renderTitleCol(project));
  fillSlot(root, "log", renderLogToggle(project));
  fillSlot(root, "subtitle", `<h2 class="note-subtitle">${project.fullTitle}${hostLink(project.programUrl)}</h2>`);
  attachLogPanel(root, project);
}

export function mountProjectPages() {
  document.querySelectorAll("[data-project]").forEach(root => {
    const project = findProject(root.dataset.project);
    if (!project) return;
    mountLandingPage(root, project);
  });
}
