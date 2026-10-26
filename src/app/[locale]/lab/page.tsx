import type { Metadata } from "next";
import { Demo } from "@/components/lab/Demo";
import { Container, PageHeader } from "@/components/ui/primitives";
import type { DemoId } from "@/content/types";
import { getDictionary } from "@/i18n";
import { type Locale, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.lab;
  return buildMetadata({ locale, path: routes.lab, title: m.title, description: m.description });
}

export default async function LabPage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const demos: { id: DemoId; title: string; lead: string }[] = [
    { id: "gauge", title: dict.lab.gauge.title, lead: dict.lab.gauge.lead },
    { id: "iot", title: dict.lab.iot.title, lead: dict.lab.iot.lead },
    { id: "infra", title: dict.lab.infra.title, lead: dict.lab.infra.lead },
    { id: "flow", title: dict.lab.flow.title, lead: dict.lab.flow.lead },
  ];

  return (
    <>
      <PageHeader eyebrow={dict.nav.lab} title={dict.lab.title} lead={dict.lab.lead}>
        <p className="mt-8 flex max-w-2xl items-start gap-3 rounded-xl border border-line-strong px-4 py-3 text-sm text-fg-muted">
          <span aria-hidden className="mt-0.5 font-mono text-fg-subtle">i</span>
          {dict.lab.disclaimer}
        </p>
        <nav aria-label={dict.lab.title} className="mt-8">
          <ol className="flex flex-wrap gap-2">
            {demos.map((d, i) => (
              <li key={d.id}>
                <a href={`#${d.id}`} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-fg-muted hover:border-line-strong hover:text-fg">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {d.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>
      <Container className="pb-28">
        {demos.map((d, i) => (
          <section key={d.id} id={d.id} aria-labelledby={`${d.id}-title`} className="scroll-mt-24 border-b border-line py-16 last:border-b-0 sm:py-20">
            <div className="reveal mb-8 max-w-3xl">
              <p className="font-mono text-[11px] text-accent">{`DEMO ${String(i + 1).padStart(2, "0")}`}</p>
              <h2 id={`${d.id}-title`} className="mt-3 text-3xl font-semibold tracking-tight">
                {d.title}
              </h2>
              <p className="mt-3 leading-relaxed text-fg-muted">{d.lead}</p>
            </div>
            <Demo id={d.id} locale={locale} dict={dict} />
          </section>
        ))}
      </Container>
    </>
  );
}
