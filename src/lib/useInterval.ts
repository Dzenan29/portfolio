"use client";

import { useEffect, useRef } from "react";

/** Calls `fn` every `ms` while `active` is true. Pauses automatically when the tab is hidden. */
export function useInterval(fn: () => void, ms: number, active: boolean) {
  const saved = useRef(fn);
  useEffect(() => {
    saved.current = fn;
  });
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") saved.current();
    }, ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}
