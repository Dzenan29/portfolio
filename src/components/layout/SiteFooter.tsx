import Link from "next/link";
import { site } from "@/content/site";
import type { Dictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { Logo } from "./Logo";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: localePath(locale, routes.projects), label: dict.nav.projects },
    { href: localePath(locale, routes.expertise), label: dict.nav.expertise },
    { href: localePath(locale, routes.about), label: dict.nav.about },
    { href: localePath(locale, routes.experience), label: dict.nav.experience },
    { href: localePath(locale, routes.lab), label: dict.nav.lab },
    { href: localePath(locale, routes.contact), label: dict.nav.contact },
  ];
  const external = [
    site.contact.github && { href: site.contact.github, label: "GitHub" },
    site.contact.linkedin && { href: site.contact.linkedin, label: "LinkedIn" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">{dict.footer.note}</p>
          <p className="mt-3 font-mono text-xs text-fg-subtle">{dict.footer.sim}</p>
        </div>
        <nav aria-label={dict.a11y.footerNav}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm md:grid-cols-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-fg-muted transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <ul className="space-y-2.5">
            {site.contact.email && (
              <li>
                <a href={`mailto:${site.contact.email}`} className="text-fg-muted transition-colors hover:text-fg">
                  {site.contact.email}
                </a>
              </li>
            )}
            {external.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-fg-muted transition-colors hover:text-fg">
                  {link.label} <span className="sr-only">({dict.a11y.externalLink})</span>
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
            <li className="text-fg-subtle">{site.location[locale]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 font-mono text-[11px] text-fg-subtle sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{dict.footer.built}</span>
        </div>
      </div>
    </footer>
  );
}
