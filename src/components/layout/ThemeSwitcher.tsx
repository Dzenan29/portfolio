"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";

type Theme = "dark" | "light";

/**
 * Switching the language re-renders <html> with its server default (dark), and the inline
 * ThemeScript does not run again on client-side navigation. Put the stored choice back.
 */
function restoreStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const root = document.documentElement;
    if ((stored === "light" || stored === "dark") && root.getAttribute("data-theme") !== stored) {
      root.setAttribute("data-theme", stored);
    }
  } catch {
    /* storage unavailable - nothing to restore */
  }
}

function subscribe(callback: () => void) {
  restoreStoredTheme();
  const observer = new MutationObserver(() => {
    restoreStoredTheme();
    callback();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

export function ThemeSwitcher({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    // Store first: the observer above restores the stored value whenever the attribute changes.
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable - theme still applies for this page view */
    }
    document.documentElement.setAttribute("data-theme", next);
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
