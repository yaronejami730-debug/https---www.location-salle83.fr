"use client";

import { useEffect } from "react";

const VAR_MAP: Record<string, string> = {
  background: "--background",
  backgroundMuted: "--background-muted",
  foreground: "--foreground",
  accent: "--accent",
  accentWarm: "--accent-warm",
};

/**
 * Mounted inside /theme-preview (loaded in an iframe by the admin color
 * editor). Reads the initial colors from the URL so there's no flash of
 * default colors before the parent's first postMessage, then applies live
 * updates as the admin drags a color picker — same-origin only.
 */
export function ThemePreviewBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, cssVar] of Object.entries(VAR_MAP)) {
      const value = params.get(key);
      if (value) document.documentElement.style.setProperty(cssVar, value);
    }

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== "theme-preview-colors") return;
      const colors = e.data.colors as Record<string, string>;
      for (const [key, cssVar] of Object.entries(VAR_MAP)) {
        if (colors[key]) document.documentElement.style.setProperty(cssVar, colors[key]);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
