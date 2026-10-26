"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { type Locale, localePath, routes } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

type NavKey = "home" | "projects" | "expertise" | "about" | "experience" | "lab" | "contact";
const items: { key: NavKey; path: string }[] = [
  { key: "home", path: routes.home },
  { key: "projects", path: routes.projects },
  { key: "expertise", path: routes.expertise },
  { key: "about", path: routes.about },
  { key: "experience", path: routes.experience },
  { key: "lab", path: routes.lab },
  { key: "contact", path: routes.contact },
];

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Pick<Dictionary, "nav" | "a11y"> }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path: string) => {
    const href = localePath(locale, path);
    return path === "/" ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1));
  };

  const desktopItems = items.filter((i) => i.key !== "contact");

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={localePath(locale, "/")} aria-label={dict.a11y.home} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label={dict.a11y.mainNav} className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {desktopItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.key}>
                  <Link
                    href={localePath(locale, item.path)}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 transition-colors ${
                      active ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {dict.nav[item.key]}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-px bg-accent" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={dict.a11y.switchLanguage} />
          <ThemeSwitcher labels={{ toLight: dict.a11y.themeToLight, toDark: dict.a11y.themeToDark }} />
          <Link
            href={localePath(locale, routes.contact)}
            className="hidden items-center gap-2 rounded-lg bg-fg px-3.5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-teal anim-pulse" />
            {dict.nav.talk}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-line text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
            data-testid="menu-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg px-4 pb-10 pt-4 lg:hidden"
      >
        <nav aria-label={dict.a11y.mainNav}>
          <ul className="flex flex-col">
            {items.map((item, i) => {
              const active = isActive(item.path);
              return (
                <li key={item.key} className="border-b border-line">
                  <Link
                    href={localePath(locale, item.path)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center justify-between py-4 text-2xl font-medium tracking-tight"
                  >
                    <span className={active ? "text-fg" : "text-fg-muted"}>{dict.nav[item.key]}</span>
                    <span aria-hidden className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
