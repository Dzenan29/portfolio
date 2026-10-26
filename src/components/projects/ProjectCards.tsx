import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { ProjectStatus, TechList } from "@/components/ui/primitives";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { asset } from "@/lib/paths";

/** Large case-study card for the homepage. `layout` varies the composition so the grid never repeats itself. */
export function ProjectFeatureCard({
  project,
  locale,
  dict,
  layout,
  index,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  layout: "hero" | "wide" | "tall" | "standard";
  index: number;
}) {
  const href = localePath(locale, routes.project(project.slug));
  const image = project.images?.[0];
  const titleId = `feat-${project.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className={`reveal group panel relative flex flex-col overflow-hidden transition-colors hover:border-line-strong ${
        layout === "hero" ? "lg:col-span-12 lg:grid lg:grid-cols-[1.05fr_1fr]" : layout === "wide" ? "lg:col-span-7" : layout === "tall" ? "lg:col-span-5" : "lg:col-span-4"
      }`}
    >
      {/* Visual */}
      <div className={`relative border-line bg-bg-raised ${layout === "hero" ? "border-b lg:order-2 lg:border-b-0 lg:border-l" : "border-b"}`}>
        <div aria-hidden className="bg-grid-fine absolute inset-0 opacity-60" />
        {image ? (
          <figure className="relative p-4 sm:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, image already optimized */}
            <img
              src={asset(image.src)}
              alt={image.alt[locale]}
              width={image.width}
              height={image.height}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="w-full rounded-lg border border-line object-cover"
            />
            {image.caption && <figcaption className="mt-3 font-mono text-[10px] text-fg-subtle">{image.caption[locale]}</figcaption>}
          </figure>
        ) : project.architecture ? (
          <div className="relative p-4 sm:p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.common.conceptual}</p>
            <ArchitectureDiagram
              stages={project.architecture.slice(0, 6)}
              locale={locale}
              plannedLabel={dict.caseStudy.planned}
              compact
              label={`${dict.caseStudy.architecture}: ${project.title[locale]}`}
            />
          </div>
        ) : null}
      </div>

      {/* Text */}
      <div className={`flex flex-1 flex-col p-5 sm:p-7 ${layout === "hero" ? "lg:p-10" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">{dict.categories[project.category]}</span>
          <span className="ml-auto">
            <ProjectStatus status={project.status} label={dict.status[project.status]} />
          </span>
        </div>
        <h3 id={titleId} className={`mt-4 text-balance font-semibold tracking-tight ${layout === "hero" ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title[locale]}
          </Link>
        </h3>
        <dl className="mt-5 grid gap-4 text-sm">
          {project.problem && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.featured.problem}</dt>
              <dd className="mt-1 leading-relaxed text-fg-muted">{project.problem[locale]}</dd>
            </div>
          )}
          {project.solution && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.featured.solution}</dt>
              <dd className="mt-1 leading-relaxed text-fg">{project.solution[locale]}</dd>
            </div>
          )}
        </dl>
        <div className="mt-auto pt-6">
          <TechList items={project.technologies} max={layout === "hero" ? 7 : 4} label={dict.common.technologies} />
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors group-hover:text-accent">
            {dict.common.readCaseStudy}
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
      {/* focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px] ring-accent group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}

/** Compact card used on the projects index and in related lists. */
export type CardLabels = Pick<Dictionary, "categories" | "status" | "common">;

export function ProjectCard({ project, locale, dict }: { project: Project; locale: Locale; dict: CardLabels }) {
  const href = localePath(locale, routes.project(project.slug));
  return (
    <article
      data-testid="project-card"
      data-category={project.category}
      className="group panel relative flex h-full flex-col p-5 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.categories[project.category]}</span>
        <ProjectStatus status={project.status} label={dict.status[project.status]} />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
        <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
          {project.title[locale]}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{project.summary[locale]}</p>
      <div className="mt-auto pt-5">
        <TechList items={project.technologies} max={4} label={dict.common.technologies} />
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px] ring-accent group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
