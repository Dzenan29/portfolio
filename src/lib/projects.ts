import type { Project, ProjectCategory } from "@/content/types";

export interface ProjectFilter {
  category: ProjectCategory | "all";
  technology: string | null;
}

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return projects.filter(
    (p) =>
      p.publish &&
      (filter.category === "all" || p.category === filter.category) &&
      (!filter.technology || p.technologies.includes(filter.technology)),
  );
}

/**
 * Sections of the projects page. Planned and in-development work never appears among
 * flagship case studies, whatever its tier.
 */
export function groupProjects(projects: Project[]) {
  const published = projects.filter((p) => p.publish);
  const settled = (p: Project) => p.status === "completed" || p.status === "operational";
  return {
    flagship: published.filter((p) => p.tier === "flagship" && settled(p)),
    supporting: published.filter((p) => p.tier !== "flagship" && settled(p)),
    inDevelopment: published.filter((p) => p.status === "in-development"),
    planned: published.filter((p) => p.status === "planned"),
  };
}
