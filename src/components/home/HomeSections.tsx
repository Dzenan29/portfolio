import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Sparkline } from "@/components/diagrams/Sparkline";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SignalFlowVisualization } from "@/components/hero/SignalFlowVisualization";
import { ProjectFeatureCard } from "@/components/projects/ProjectCards";
import { DomainGlyph } from "@/components/ui/DomainGlyph";
import { ButtonLink, Container, Eyebrow, SectionHeading, SimulatedBadge } from "@/components/ui/primitives";
import { experience } from "@/content/experience";
import { domains } from "@/content/expertise";
import { about, infraCapabilities, pipeline, processSteps } from "@/content/narrative";
import { getProject, publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import type { Dictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { series } from "@/lib/random";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

/* ─────────────────────────────── A · Hero ─────────────────────────────── */
export function EngineeringHero({ locale, dict }: Props) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-0" />
      <Container className="relative grid items-center gap-12 pb-20 pt-12 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-28 lg:pt-24">
        <div className="anim-rise">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">{dict.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className={`mt-6 font-semibold uppercase leading-[0.98] tracking-[-0.04em] ${
              locale === "de" ? "text-[2.2rem] sm:text-5xl xl:text-6xl" : "text-[2.6rem] sm:text-6xl xl:text-7xl"
            }`}
          >
            <span className="block">{dict.hero.titleLine1}</span>
            <span className="block text-fg-muted">{dict.hero.titleLine2}</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">{dict.hero.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={localePath(locale, routes.projects)}>{dict.hero.ctaPrimary}</ButtonLink>
            <ButtonLink href={localePath(locale, routes.about)} variant="secondary">
              {dict.hero.ctaSecondary}
            </ButtonLink>
          </div>
          <Link
            href={localePath(locale, routes.contact)}
            className="mt-10 inline-flex items-center gap-3 text-sm text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            <span>{site.location[locale]}</span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            {dict.hero.contactHint}
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
        <div className="anim-rise [animation-delay:120ms]">
          <SignalFlowVisualization
            locale={locale}
            labels={{
              vizLabel: dict.hero.vizLabel,
              vizHint: dict.hero.vizHint,
              vizLayers: dict.hero.vizLayers,
              simulated: dict.common.simulated,
              illustrative: dict.hero.vizIllustrative,
            }}
          />
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── B · Domains ─────────────────────────── */
export function EngineeringDomains({ locale, dict }: Props) {
  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-12"];
  return (
    <section aria-labelledby="domains-title" className="border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading id="domains-title" index="01" eyebrow={dict.domains.eyebrow} title={dict.domains.title} lead={dict.domains.lead} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {domains.map((d, i) => {
            const reps = d.projects.map(getProject).filter((p) => !!p);
            const wide = i === 5;
            return (
              <li
                key={d.id}
                tabIndex={0}
                className={`reveal group panel relative overflow-hidden p-6 outline-none transition-colors hover:border-line-strong focus-visible:border-accent sm:p-7 ${spans[i]} ${wide ? "sm:col-span-2" : ""}`}
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              >
                <div className={wide ? "lg:grid lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-10" : ""}>
                  <div>
                    <div className="flex items-start justify-between">
                      <DomainGlyph glyph={d.glyph} className="h-10 w-16 text-fg-subtle transition-colors group-hover:text-fg-muted" />
                      <span className="font-mono text-[11px] text-fg-subtle">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{d.title[locale]}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{d.description[locale]}</p>
                  </div>
                  <div className="mt-6 transition-all duration-300 lg:translate-y-1 lg:opacity-60 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                    <ul className="flex flex-wrap gap-1.5">
                      {d.technologies.map((t) => (
                        <li key={t} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {reps.length > 0 && (
                      <div className="mt-4 border-t border-line pt-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{dict.domains.representative}</p>
                        <ul className="mt-1.5 space-y-1">
                          {reps.map((p) => (
                            <li key={p!.slug}>
                              <Link
                                href={localePath(locale, routes.project(p!.slug))}
                                className="inline-flex items-center gap-1.5 text-sm text-fg hover:text-accent"
                              >
                                <span aria-hidden className="text-accent">→</span>
                                {p!.title[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────────── C · Featured work ────────────────────────── */
export function FeaturedWork({ locale, dict }: Props) {
  const featured = publishedProjects.filter((p) => p.featured);
  const layouts = ["hero", "wide", "tall", "standard", "standard", "standard"] as const;
  return (
    <section aria-labelledby="work-title" className="relative border-t border-line bg-bg-raised/40 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="work-title" index="02" eyebrow={dict.featured.eyebrow} title={dict.featured.title} lead={dict.featured.lead} />
          <ButtonLink href={localePath(locale, routes.projects)} variant="secondary" className="shrink-0 self-start lg:self-end">
            {dict.featured.viewAll}
          </ButtonLink>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {featured.map((p, i) => (
            <ProjectFeatureCard key={p.slug} project={p} locale={locale} dict={dict} layout={layouts[i] ?? "standard"} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── D · End-to-end ───────────────────────── */
export function EndToEnd({ locale, dict }: Props) {
  return (
    <section aria-labelledby="e2e-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading id="e2e-title" index="03" eyebrow={dict.endToEnd.eyebrow} title={dict.endToEnd.title} lead={dict.endToEnd.lead} />
        <ol className="relative mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
          {pipeline.map((stage, i) => (
            <li
              key={stage.id}
              className="reveal group relative flex flex-col bg-surface p-6 transition-colors hover:bg-surface-2"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full border border-line-strong font-mono text-[11px] text-accent">
                  {i + 1}
                </span>
                {i < pipeline.length - 1 && (
                  <svg aria-hidden className="hidden h-2 flex-1 lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
                    <line x1="0" y1="1" x2="100" y2="1" stroke="var(--accent)" strokeDasharray="3 4" className="anim-flow" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </div>
              <h3 className="mt-6 text-lg font-semibold uppercase tracking-tight">{stage.verb[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{stage.text[locale]}</p>
              <ul className="mt-auto flex flex-wrap gap-x-2 gap-y-1 pt-5 font-mono text-[10px] text-fg-subtle">
                {stage.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ──────────────────── E · Infrastructure & automation ──────────────────── */
export function InfrastructureSection({ locale, dict }: Props) {
  const cpu = series(11, 48, 34, 18);
  const latency = series(23, 48, 120, 40);
  const nodes = ["pve-a", "pve-b", "pve-c"];
  return (
    <section aria-labelledby="infra-title" className="border-t border-line bg-bg-raised/40 py-24 sm:py-32">
      <Container>
        <SectionHeading id="infra-title" index="04" eyebrow={dict.infra.eyebrow} title={dict.infra.title} lead={dict.infra.lead} />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* topology */}
          <div className="reveal panel relative overflow-hidden p-5 sm:p-6 lg:col-span-7">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">topology · {dict.common.conceptual}</p>
              <SimulatedBadge label={dict.common.simulated} />
            </div>
            <svg viewBox="0 0 520 260" className="mt-4 h-auto w-full" role="img" aria-label={`${dict.common.conceptual}: reverse proxy → 3 hypervisor nodes → VMs and containers; monitoring; backup NAS`}>
              <defs>
                <pattern id="infra-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="var(--line-strong)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="520" height="260" fill="url(#infra-dots)" opacity="0.6" />
              {/* proxy */}
              <rect x="200" y="12" width="120" height="34" rx="6" fill="var(--surface-2)" stroke="var(--accent)" />
              <text x="260" y="33" textAnchor="middle" className="fill-fg font-mono" fontSize="11">reverse-proxy · tls</text>
              {nodes.map((n, i) => {
                const x = 40 + i * 160;
                return (
                  <g key={n}>
                    <path d={`M260 46 C260 70 ${x + 60} 70 ${x + 60} 92`} fill="none" stroke="var(--accent)" strokeDasharray="3 4" className="anim-flow" />
                    <rect x={x} y="92" width="120" height="100" rx="8" fill="var(--surface)" stroke="var(--line-strong)" />
                    <text x={x + 10} y="110" className="fill-fg-muted font-mono" fontSize="10">{n}</text>
                    <circle cx={x + 108} cy="106" r="3" fill="var(--teal)" />
                    {[0, 1, 2].map((k) => (
                      <rect key={k} x={x + 10} y={120 + k * 22} width="100" height="16" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
                    ))}
                    {[0, 1, 2].map((k) => (
                      <text key={k} x={x + 16} y={131 + k * 22} className="fill-fg-subtle font-mono" fontSize="8.5">
                        {["vm · docker", "vm · services", "lxc · tools"][(k + i) % 3]}
                      </text>
                    ))}
                    <path d={`M${x + 60} 192 V214`} stroke="var(--line-strong)" />
                  </g>
                );
              })}
              <path d="M100 214 H420" stroke="var(--line-strong)" />
              <rect x="60" y="222" width="150" height="28" rx="6" fill="var(--surface-2)" stroke="var(--line-strong)" />
              <text x="135" y="240" textAnchor="middle" className="fill-fg-muted font-mono" fontSize="10">monitoring · grafana</text>
              <rect x="310" y="222" width="150" height="28" rx="6" fill="var(--surface-2)" stroke="var(--teal)" />
              <text x="385" y="240" textAnchor="middle" className="fill-fg-muted font-mono" fontSize="10">backup · nas (rsync)</text>
            </svg>
          </div>

          {/* metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <MetricTile label="host cpu · 24 h" value={`${Math.round(cpu.at(-1) ?? 0)} %`} simulated={dict.common.simulated}>
              <Sparkline values={cpu} min={0} max={100} threshold={80} />
            </MetricTile>
            <MetricTile label="http check · latency" value={`${Math.round(latency.at(-1) ?? 0)} ms`} simulated={dict.common.simulated}>
              <Sparkline values={latency} color="var(--teal)" min={0} max={260} />
            </MetricTile>
            <div className="reveal panel p-5 sm:col-span-2 lg:col-span-1">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {infraCapabilities.map((c) => (
                  <li key={c.title.en}>
                    <p className="font-medium">{c.title[locale]}</p>
                    <p className="mt-0.5 text-xs leading-snug text-fg-muted">{c.text[locale]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`${localePath(locale, routes.lab)}#infra`}>{dict.infra.explore}</ButtonLink>
          <ButtonLink href={localePath(locale, routes.project("proxmox-self-hosted-infrastructure"))} variant="secondary">
            {dict.common.readCaseStudy}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function MetricTile({ label, value, simulated, children }: { label: string; value: string; simulated: string; children: React.ReactNode }) {
  return (
    <div className="reveal panel p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{label}</p>
        <SimulatedBadge label={simulated} />
      </div>
      <p className="mt-2 font-mono text-2xl tracking-tight">{value}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ─────────────────────── F · About + process ─────────────────────── */
export function AboutTeaser({ locale, dict }: Props) {
  return (
    <section aria-labelledby="about-title" className="border-t border-line py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="reveal">
          <Eyebrow index="05">{dict.aboutTeaser.eyebrow}</Eyebrow>
          <h2 id="about-title" className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {about.intro[locale]}
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-fg-muted">{about.paragraphs[2]?.[locale]}</p>
          <div className="mt-8">
            <ButtonLink href={localePath(locale, routes.about)} variant="secondary">
              {dict.aboutTeaser.cta}
            </ButtonLink>
          </div>
        </div>
        <div className="reveal">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{dict.process.eyebrow}</p>
          <ol className="mt-5 divide-y divide-line border-y border-line">
            {processSteps.map((s, i) => (
              <li key={s.verb.en} className="grid grid-cols-[2.5rem_8rem_1fr] items-baseline gap-3 py-3.5 text-sm max-sm:grid-cols-[2rem_1fr]">
                <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{s.verb[locale]}</span>
                <span className="text-fg-muted max-sm:col-start-2">{s.text[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────── G · Experience teaser ─────────────────────── */
export function ExperienceTeaser({ locale, dict }: Props) {
  return (
    <section aria-labelledby="exp-title" className="border-t border-line bg-bg-raised/40 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="exp-title" index="06" eyebrow={dict.experienceTeaser.eyebrow} title={dict.experienceTeaser.title} />
          <ButtonLink href={localePath(locale, routes.experience)} variant="secondary" className="shrink-0 self-start lg:self-end">
            {dict.experienceTeaser.cta}
          </ButtonLink>
        </div>
        <div className="mt-14">
          <ExperienceTimeline entries={experience.slice(0, 3)} locale={locale} dict={dict} compact />
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── H · Contact ─────────────────────────── */
export function ContactCta({ locale, dict }: Props) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{dict.contactCta.eyebrow}</p>
          <h2 id="cta-title" className="mt-5 text-balance text-4xl font-semibold uppercase tracking-[-0.03em] sm:text-5xl">
            {dict.contactCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-fg-muted">{dict.contactCta.lead}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={localePath(locale, routes.contact)}>{dict.contactCta.cta}</ButtonLink>
            {site.contact.email && (
              <a
                href={`mailto:${site.contact.email}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-5 font-mono text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {site.contact.email}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
