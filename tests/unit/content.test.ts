import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { domains, skillGroups } from "@/content/expertise";
import { getProject, projects, publishedProjects } from "@/content/projects";
import { de } from "@/i18n/dictionaries/de";
import { en } from "@/i18n/dictionaries/en";
import { localePath, switchLocalePath } from "@/i18n/config";
import { filterProjects, groupProjects } from "@/lib/projects";

describe("i18n routing helpers", () => {
  it("prefixes paths with the locale", () => {
    expect(localePath("en", "/")).toBe("/en/");
    expect(localePath("de", "/projects/")).toBe("/de/projects/");
  });

  it("switches the locale segment and keeps the rest of the path", () => {
    expect(switchLocalePath("/en/projects/lab-gas-monitoring/", "de")).toBe("/de/projects/lab-gas-monitoring/");
    expect(switchLocalePath("/de/", "en")).toBe("/en/");
    expect(switchLocalePath("/unknown", "de")).toBe("/de/");
  });
});

describe("dictionaries", () => {
  function keys(o: object, prefix = ""): string[] {
    return Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    );
  }
  it("German covers every English key", () => {
    expect(keys(de).sort()).toEqual(keys(en).sort());
  });
});

describe("content integrity", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only links to published projects", () => {
    const linked = [
      ...publishedProjects.flatMap((p) => p.related ?? []),
      ...domains.flatMap((d) => d.projects),
      ...skillGroups.flatMap((g) => g.projects),
    ];
    for (const slug of linked) expect(getProject(slug), slug).toBeDefined();
  });

  it("never publishes verification-required entries", () => {
    expect(publishedProjects.some((p) => p.status === "verification-required")).toBe(false);
  });

  it("keeps planned and in-development work out of the flagship section", () => {
    const groups = groupProjects(publishedProjects);
    expect(groups.flagship.every((p) => p.status === "completed" || p.status === "operational")).toBe(true);
    expect(groups.planned.every((p) => p.status === "planned")).toBe(true);
  });

  it("filters by category and technology", () => {
    const embedded = filterProjects(projects, { category: "embedded", technology: null });
    expect(embedded.length).toBeGreaterThan(0);
    expect(embedded.every((p) => p.category === "embedded" && p.publish)).toBe(true);
    const grafana = filterProjects(projects, { category: "all", technology: "Grafana" });
    expect(grafana.every((p) => p.technologies.includes("Grafana"))).toBe(true);
  });

  it("has text in both languages everywhere", () => {
    for (const p of publishedProjects) {
      expect(p.title.en && p.title.de && p.summary.en && p.summary.de, p.slug).toBeTruthy();
    }
    for (const e of experience) expect(e.role.en && e.role.de).toBeTruthy();
  });

  it("contains no private hosts, IPs or excluded projects", () => {
    const blob = JSON.stringify({ projects: publishedProjects, experience });
    expect(blob).not.toMatch(/\b(?:10|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/);
    expect(blob.toLowerCase()).not.toContain("studeal");
    expect(blob).not.toMatch(/\.rub\.de|ruhr-uni-bochum\.de/);
  });
});
