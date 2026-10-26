"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";

type Theme = "dark" | "light";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

export function ThemeSwitcher({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable - theme still applies for this page view */
    }
  }

  const label = theme === "dark" ? labels.toLight : labels.toDark;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      data-theme-current={theme}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
