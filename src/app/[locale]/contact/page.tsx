import { ArrowUpRight, Briefcase, FileText, GitBranch, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container, PageHeader } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n";
import { type Locale, routes } from "@/i18n/config";
import { buildMetadata } from "@/lib/metadata";
import { asset } from "@/lib/paths";

type Params = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const m = getDictionary(locale).meta.pages.contact;
  return buildMetadata({ locale, path: routes.contact, title: m.title, description: m.description });
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const c = dict.contact;

  // Only configured channels are listed - a missing value hides its row instead of producing a dead link.
  const channels = [
    site.contact.email && { icon: Mail, label: c.email, value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
    site.contact.linkedin && { icon: Briefcase, label: c.linkedin, value: "linkedin.com/in/dzenan-kusi", href: site.contact.linkedin, external: true },
    site.contact.github && { icon: GitBranch, label: c.github, value: site.contact.github.replace("https://", ""), href: site.contact.github, external: true },
    site.contact.resume && { icon: FileText, label: c.resume, value: "PDF", href: asset(site.contact.resume), external: true },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string; external: boolean }[];

  return (
    <>
      <PageHeader eyebrow={dict.nav.contact} title={dict.contactCta.title} lead={c.lead} />
      <Container className="pb-28 pt-14">
        <div className={`grid gap-8 ${site.contactFormEndpoint ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"}`}>
          <section aria-labelledby="direct" className="reveal">
            <h2 id="direct" className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
              {c.direct}
            </h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {channels.map((ch) => (
                <li key={ch.label}>
                  <a
                    href={ch.href}
                    {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors group-hover:border-accent group-hover:text-accent">
                      <ch.icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{ch.label}</span>
                      <span className="block truncate text-lg transition-colors group-hover:text-accent">{ch.value}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    {ch.external && <span className="sr-only">({dict.a11y.externalLink})</span>}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 py-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-fg-muted">
                  <MapPin aria-hidden className="size-4" />
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{c.location}</span>
                  <span className="block text-lg">{site.location[locale]}</span>
                </span>
              </li>
            </ul>
          </section>

          <div className="reveal">
            {site.contactFormEndpoint ? (
              <ContactForm endpoint={site.contactFormEndpoint} labels={c.form} />
            ) : (
              <div className="panel ticks relative h-full overflow-hidden p-6 sm:p-8">
                <div aria-hidden className="bg-grid-fine absolute inset-0 opacity-50" />
                <div className="relative">
                  <p className="font-mono text-[11px] text-accent">$ mail --to dzenan</p>
                  <p className="mt-4 text-pretty text-lg leading-relaxed">{c.noForm}</p>
                  {site.contact.email && (
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink hover:bg-accent-strong"
                    >
                      <Mail aria-hidden className="size-4" />
                      {c.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
