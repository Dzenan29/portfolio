import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { Container, PageHeader } from "@/components/ui/primitives";
import { education, experience } from "@/content/experience";
import { getDictionary } from "@/i18n";
import { type Locale, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.experience;
  return buildMetadata({ locale, path: routes.experience, title: m.title, description: m.description });
}

export default async function ExperiencePage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return (
    <>
      <PageHeader eyebrow={dict.nav.experience} title={dict.experience.title} lead={dict.experience.lead} />
      <Container className="pb-28 pt-16">
        <ExperienceTimeline entries={experience} locale={locale} dict={dict} />

        <section aria-labelledby="edu" className="reveal mt-20 border-t border-line pt-12 md:grid md:grid-cols-[180px_1fr] md:gap-10">
          <h2 id="edu" className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle md:text-right">
            {dict.experience.education}
          </h2>
          <div className="mt-4 md:mt-0 md:pl-10">
            <p className="text-lg font-semibold tracking-tight">{education.title[locale]}</p>
            <p className="text-sm text-fg-muted">{education.location[locale]}</p>
          </div>
        </section>
      </Container>
    </>
  );
}
