import type { Metadata } from "next";
import { ButtonLink, Container, PageHeader } from "@/components/ui/primitives";
import { education, languages } from "@/content/experience";
import { about } from "@/content/narrative";
import { getDictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.about;
  return buildMetadata({ locale, path: routes.about, title: m.title, description: m.description, type: "profile" });
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={dict.nav.about} title={about.intro[locale]} />
      <Container className="pb-28">
        <div className="grid gap-14 pt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="reveal space-y-6 text-pretty text-lg leading-relaxed text-fg-muted">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-fg" : ""}>
                {p[locale]}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              <ButtonLink href={localePath(locale, routes.projects)}>{dict.hero.ctaPrimary}</ButtonLink>
              <ButtonLink href={localePath(locale, routes.contact)} variant="secondary">
                {dict.nav.contact}
              </ButtonLink>
            </div>
          </div>

          <aside className="reveal space-y-4">
            <div className="panel p-6">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.about.education}</h2>
              <p className="mt-3 font-medium">{education.title[locale]}</p>
              <p className="text-sm text-fg-muted">{education.location[locale]}</p>
            </div>
            <div className="panel p-6">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.about.languages}</h2>
              <ul className="mt-3 divide-y divide-line">
                {languages.map((l) => (
                  <li key={l.name.en} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                    <span>{l.name[locale]}</span>
                    <span className="text-right text-fg-muted">{l.level[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.about.beyond}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{about.beyond[locale]}</p>
            </div>
          </aside>
        </div>

        <section aria-labelledby="principles" className="mt-24">
          <h2 id="principles" className="reveal text-3xl font-semibold tracking-tight">
            {dict.about.principles}
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.principles.map((p, i) => (
              <li key={p.title.en} className="reveal bg-surface p-6" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-semibold">{p.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.text[locale]}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
