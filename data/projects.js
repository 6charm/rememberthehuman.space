// Single source of truth for project metadata + log entries.
// Add a project = append an object here. Add a week = append to its log array.

export const projects = [
  {
    slug: "rtems",
    shortName: "RTEMS",
      fullTitle: "GSoC'26: lwIP network stack improvements",
    authors: [
      { name: "Armaan Chowfin" },
        { name: "Pavel Píša", url: "https://cmp.felk.cvut.cz/~pisa/"}
    ],
    homepage: "https://www.rtems.org/",
    programUrl: "https://summerofcode.withgoogle.com/programs/2026/projects/mixRtTp4",
    href: "projects/rtems/index.html",
    log: [
      { week: 1, title: "", date: "24-05-2026" }
    ]
  }
];

export function findProject(slug) {
  return projects.find(p => p.slug === slug);
}

export function findWeek(project, weekNum) {
  return project.log.find(w => w.week === weekNum);
}
