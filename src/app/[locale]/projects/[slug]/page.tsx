import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { Demo, demoTitle } from "@/components/lab/Demo";
import { ProjectCard } from "@/components/projects/ProjectCards";
import { DepthToggle } from "@/components/projects/DepthToggle";
import { ButtonLink, Container, ProjectStatus, TechList } from "@/components/ui/primitives";
import { getProject, getRelated, publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n";
import { type Locale, localePath, locales, routes } from "@/i18n/config";
import { absoluteUrl, buildMetadata } from "@/lib/metadata";
import { asset } from "@/lib/paths";

type Params = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => publishedProjects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: routes.project(slug),
    title: project.title[locale],
    description: project.summary[locale],
    type: "article",
  });
}

/** Split "Lead sentence. Explanation..." into its first sentence and the rest. */
function splitLead(text: string): [string, string] {
  const i = text.indexOf(". ");
  return i === -1 ? [text, ""] : [text.slice(0, i + 1), text.slice(i + 2)];
}

function Block({ id, title, children, technical }: { id: string; title: string; children: React.ReactNode; technical?: boolean }) {
  return (
    <section
      aria-labelledby={id}
      data-depth={technical ? "technical" : undefined}
      className="reveal grid gap-6 border-t border-line py-14 lg:grid-cols-[220px_1fr] lg:gap-12"
    >
      <h2 id={id} className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle lg:pt-1.5">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const dict = getDictionary(locale);
  const cs = dict.caseStudy;
  const related = getRelated(project);
  const image = project.images?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title[locale],
    abstract: project.summary[locale],
    inLanguage: locale,
    url: absoluteUrl(localePath(locale, routes.project(slug))),
    author: { "@type": "Person", name: site.name },
    keywords: project.technologies.join(", "),
  };

  return (
    <article id="case" data-depth-mode="technical">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`[data-depth-mode="summary"] [data-depth="technical"]{display:none}`}</style>

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-0" />
        <Container className="relative pb-14 pt-10 sm:pt-14">
          <nav aria-label={dict.a11y.breadcrumb} className="font-mono text-xs text-fg-subtle">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={localePath(locale, routes.projects)} className="hover:text-fg">
                  {dict.nav.projects}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-fg-muted">
                {project.title[locale]}
              </li>
            </ol>
          </nav>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ProjectStatus status={project.status} label={dict.status[project.status]} size="md" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">{dict.categories[project.category]}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
              · {project.context === "professional" ? dict.common.professional : dict.common.independent}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {project.title[locale]}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-fg-muted">{project.summary[locale]}</p>
          <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-[auto_1fr] sm:gap-12">
            {project.role && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.common.role}</p>
                <p className="mt-1 text-sm">{project.role[locale]}</p>
              </div>
            )}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.common.technologies}</p>
              <div className="mt-2">
                <TechList items={project.technologies} label={dict.common.technologies} />
              </div>
            </div>
          </div>
          {(project.approach || project.implementation) && (
            <div className="mt-8">
              <DepthToggle
                target="case"
                labels={{ label: dict.common.depthToggle, summary: dict.common.summary, technical: dict.common.technical }}
              />
            </div>
          )}
        </Container>
      </header>

      <Container className="pb-24">
        {image && (
          <figure className="reveal mt-12 overflow-hidden rounded-2xl border border-line bg-bg-raised p-3 sm:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img src={asset(image.src)} alt={image.alt[locale]} width={image.width} height={image.height} className="mx-auto w-full max-w-4xl rounded-lg" />
            <figcaption className="mx-auto mt-3 max-w-4xl font-mono text-[11px] text-fg-subtle">
              {image.caption?.[locale]} {cs.imageNote}
            </figcaption>
          </figure>
        )}

        <div className="mt-12">
          {project.challenge && (
            <Block id="challenge" title={cs.challenge}>
              <p className="max-w-3xl text-pretty text-lg leading-relaxed">{project.challenge[locale]}</p>
            </Block>
          )}

          {project.approach && (
            <Block id="approach" title={cs.approach} technical>
              <ol className="grid gap-4 md:grid-cols-2">
                {project.approach.map((a, i) => {
                  const [head, rest] = splitLead(a[locale]);
                  return (
                    <li key={i} className="panel p-5">
                      <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-2 font-medium">{head}</p>
                      {rest && <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{rest}</p>}
                    </li>
                  );
                })}
              </ol>
            </Block>
          )}

          {project.architecture && (
            <Block id="architecture" title={cs.architecture}>
              <ArchitectureDiagram
                stages={project.architecture}
                locale={locale}
                plannedLabel={cs.planned}
                label={`${cs.architecture}: ${project.title[locale]}`}
              />
              <p className="mt-4 font-mono text-[11px] text-fg-subtle">{cs.conceptualNote}</p>
            </Block>
          )}

          {project.implementation && (
            <Block id="implementation" title={cs.implementation} technical>
              <div className="grid gap-4 md:grid-cols-2">
                {project.implementation.map((block, i) => (
                  <div key={i} className={`panel p-5 ${block.planned ? "border-dashed" : ""}`}>
                    <h3 className="flex items-center justify-between gap-2 font-medium">
                      {block.title[locale]}
                      {block.planned && <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{cs.planned}</span>}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-muted">
                      {block.items.map((item, k) => (
                        <li key={k} className="flex gap-3">
                          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                          {item[locale]}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {project.demo && (
            <Block id="demo" title={cs.demo}>
              <h3 className="text-xl font-semibold tracking-tight">{demoTitle(project.demo, dict)}</h3>
              <p className="mb-6 mt-2 max-w-2xl text-sm text-fg-muted">{dict.lab.disclaimer}</p>
              <Demo id={project.demo} locale={locale} dict={dict} />
            </Block>
          )}

          {project.challenges && (
            <Block id="lessons" title={cs.challenges} technical>
              <ul className="space-y-6">
                {project.challenges.map((c, i) => {
                  const [head, rest] = splitLead(c[locale]);
                  return (
                    <li key={i} className="max-w-3xl">
                      <p className="font-medium">{head}</p>
                      {rest && <p className="mt-1 leading-relaxed text-fg-muted">{rest}</p>}
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}

          {project.outcomes && (
            <Block id="outcomes" title={cs.outcomes}>
              <ul className="grid gap-3 md:grid-cols-2">
                {project.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-line p-4 text-sm leading-relaxed">
                    <span aria-hidden className="text-teal">✓</span>
                    {o[locale]}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block id="status" title={cs.currentStatus}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ProjectStatus status={project.status} label={dict.status[project.status]} size="md" />
              <p className="text-sm text-fg-muted">{cs.statusNote[project.status]}</p>
            </div>
          </Block>

          {related.length > 0 && (
            <Block id="related" title={cs.related}>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>

        <div className="mt-6 border-t border-line pt-10">
          <ButtonLink href={localePath(locale, routes.projects)} variant="secondary">
            {dict.common.backToProjects}
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
