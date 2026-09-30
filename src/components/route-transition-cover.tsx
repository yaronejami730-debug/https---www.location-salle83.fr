"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Lives in the layout (survives navigation), unlike the old cover ChoiceCards
 * rendered on the homepage itself: that div was destroyed the instant the
 * route actually swapped, exposing the destination page mid-paint instead of
 * hiding the swap. ChoiceCards toggles #route-transition-cover's opacity
 * directly (plain DOM, matching this codebase's existing imperative-DOM
 * pattern for the entry-gate scroll lock) right before navigating; this
 * component just clears it back to 0 once the new route has mounted.
 */
export function RouteTransitionCover() {
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    document.getElementById("route-transition-cover")?.classList.add("opacity-0");
  }, [pathname]);

  return <div id="route-transition-cover" className="pointer-events-none fixed inset-0 z-[200] bg-[var(--background)] opacity-0 transition-opacity duration-500" />;
}
