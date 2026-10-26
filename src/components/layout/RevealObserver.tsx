"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** One observer for the whole page: elements with `.reveal` fade in once when they enter. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal:not([data-visible='true'])");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px 15% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
