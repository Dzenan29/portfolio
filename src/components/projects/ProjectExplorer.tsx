"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { filterProjects, groupProjects } from "@/lib/projects";
import { type CardLabels, ProjectCard } from "./ProjectCards";

export interface ExplorerLabels extends CardLabels {
  sections: { flagship: string; supporting: string; inDevelopment: string; inDevelopmentLead: string; planned: string };
  filterLabel: string;
  techFilterLabel: string;
  anyTech: string;
  noResults: string;
  countOne: string;
  countMany: string;
}

const categories: (ProjectCategory | "all")[] = ["all", "embedded", "infrastructure", "monitoring", "software", "hpc-ai"];

export function ProjectExplorer({ projects, locale, labels }: { projects: Project[]; locale: Locale; labels: ExplorerLabels }) {
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [tech, setTech] = useState<string>("");

  const allTech = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.technologies))).sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const filtered = filterProjects(projects, { category, technology: tech || null });
  const groups = groupProjects(filtered);
  const count = filtered.length;

  const sections = [
    { key: "flagship", title: labels.sections.flagship, items: groups.flagship, lead: null },
    { key: "supporting", title: labels.sections.supporting, items: groups.supporting, lead: null },
    { key: "in-development", title: labels.sections.inDevelopment, items: groups.inDevelopment, lead: labels.sections.inDevelopmentLead },
    { key: "planned", title: labels.sections.planned, items: groups.planned, lead: null },
  ];

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={labels.filterLabel} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                data-testid={`filter-${c}`}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  category === c ? "border-accent/50 bg-accent-soft text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {labels.categories[c]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="tech-filter">
              {labels.techFilterLabel}
            </label>
            <select
              id="tech-filter"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="min-h-9 rounded-lg border border-line bg-surface px-3 text-sm text-fg"
            >
              <option value="">{labels.anyTech}</option>
              {allTech.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p aria-live="polite" className="whitespace-nowrap font-mono text-xs text-fg-subtle" data-testid="project-count">
              {count} {count === 1 ? labels.countOne : labels.countMany}
            </p>
          </div>
        </div>
      </div>

      {count === 0 && <p className="py-16 text-center text-fg-muted">{labels.noResults}</p>}

      {sections.map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.key} aria-labelledby={`sec-${s.key}`} className="pt-14">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                <h2 id={`sec-${s.key}`} className="text-xl font-semibold tracking-tight">
                  {s.title}
                </h2>
                <span className="font-mono text-xs text-fg-subtle">{String(s.items.length).padStart(2, "0")}</span>
              </div>
              {s.lead && <p className="mt-3 max-w-2xl text-sm text-fg-muted">{s.lead}</p>}
              <ul className={`mt-6 grid gap-4 sm:grid-cols-2 ${s.key === "flagship" ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
                {s.items.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} locale={locale} dict={labels} />
                  </li>
                ))}
              </ul>
            </section>
          ),
      )}
    </div>
  );
}
