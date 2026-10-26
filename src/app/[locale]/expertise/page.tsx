import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/ui/primitives";
import { skillGroups } from "@/content/expertise";
import { getProject } from "@/content/projects";
import type { EvidenceLevel } from "@/content/types";
import { getDictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.expertise;
  return buildMetadata({ locale, path: routes.expertise, title: m.title, description: m.description });
}

/** Evidence is shown with a filled / half / outlined marker plus text - never color alone. */
function Marker({ level }: { level: EvidenceLevel }) {
  if (level === "professional") return <span aria-hidden className="size-2.5 rounded-full bg-accent" />;
  if (level === "project") return <span aria-hidden className="size-2.5 rounded-full border border-accent bg-[linear-gradient(90deg,var(--accent)_50%,transparent_50%)]" />;
  return <span aria-hidden className="size-2.5 rounded-full border border-fg-subtle" />;
}

export default async function ExpertisePage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const levels: EvidenceLevel[] = ["professional", "project", "exploring"];

  return (
    <>
      <PageHeader eyebrow={dict.nav.expertise} title={dict.expertise.title} lead={dict.expertise.lead}>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          {levels.map((l) => (
            <li key={l} className="flex items-center gap-2">
              <Marker level={l} />
              {dict.expertise.levels[l]}
            </li>
          ))}
        </ul>
      </PageHeader>
      <Container className="pb-28">
        <div className="grid gap-4 pt-14 md:grid-cols-2">
          {skillGroups.map((g, i) => {
            const projects = g.projects.map(getProject).filter((p) => !!p);
            return (
              <section key={g.id} aria-labelledby={`g-${g.id}`} className={`reveal panel p-6 sm:p-8 ${i === 0 ? "md:col-span-2" : ""}`}>
                <div className={i === 0 ? "md:grid md:grid-cols-[1fr_1.4fr] md:gap-12" : ""}>
                  <div>
                    <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</p>
                    <h2 id={`g-${g.id}`} className="mt-3 text-2xl font-semibold tracking-tight">
                      {g.title[locale]}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{g.description[locale]}</p>
                  </div>
                  <div className="mt-6 md:mt-0">
                    <ul className="divide-y divide-line border-y border-line">
                      {g.items.map((item) => (
                        <li key={item.name} className="flex items-center justify-between gap-4 py-2.5">
                          <span className="text-sm">{item.name}</span>
                          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                            {dict.expertise.levelsShort[item.level]}
                            <Marker level={item.level} />
                          </span>
                        </li>
                      ))}
                    </ul>
                    {projects.length > 0 && (
                      <div className="mt-5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.expertise.relatedProjects}</p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {projects.map((p) => (
                            <li key={p!.slug}>
                              <Link
                                href={localePath(locale, routes.project(p!.slug))}
                                className="inline-flex rounded-md border border-line px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg"
                              >
                                {p!.title[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
