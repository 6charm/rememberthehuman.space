// Single source of truth for project metadata + log entries.
// Add a project = append an object here. Add a week = append to its log array.

export const projects = [
  {
    slug: "rt",
    shortName: "RTEMS",
      fullTitle: "GSoC'26: lwIP network stack improvements",
    authors: [
      { name: "Armaan Chowfin" },
        { name: "Pavel Píša", url: "https://cmp.felk.cvut.cz/~pisa/"}
    ],
    homepage: "https://www.rtems.org/",
    programUrl: "https://summerofcode.withgoogle.com/programs/2026/projects/mixRtTp4",
    href: "rt/",
    heroImage: "assets/no-bg-tms570.png",
    wiki: { label: "TMS570 Wiki", url: "https://gitlab.rtems.org/ar-in0/rtems-lwip/-/wikis/lwIP-Development-Notes-[Wiki]" },
    log: [
      { week: 1, title: "Flash the TMS570", date: "24-05-2026" },
      { week: 2, title: "Just checking", date: "31-05-2026" },
      { week: 3, title: "", date: "07-06-2026" },
      { week: 4, title: "", date: "14-06-2026" },
      { week: 5, title: "", date: "21-06-2026" },
      { week: 6, title: "", date: "28-06-2026" },
      { week: 7, title: "", date: "05-07-2026" }
    ]
  },
  {
    slug: "rk",
    shortName: "REDKILL",
      fullTitle: "Redkill: Formally Verified OS for Embedded Systems",
    authors: [
        { name: "Prathu Baronia, Neeraj Upadhyay" }
    ],
      homepage: "",
    href: "rk/",
    log: []
  }
];

export function findProject(slug) {
  return projects.find(p => p.slug === slug);
}

export function findWeek(project, weekNum) {
  return project.log.find(w => w.week === weekNum);
}
