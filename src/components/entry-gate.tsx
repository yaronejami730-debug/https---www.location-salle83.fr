"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

// A transform on an ancestor makes it the containing block for `fixed`
// descendants, so the logo below travels with its half-door as it slides.
function DoorContent() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 text-white">
      <Image src="/images/logo.png" alt={siteConfig.name} width={72} height={74} className="h-16 w-auto" />
      <p className="font-serif text-2xl tracking-wide">{siteConfig.name}</p>
    </div>
  );
}

export function EntryGate() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    if (phase === "open") return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => setPhase("open"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "open") return null;

  const opening = phase === "opening";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-[var(--foreground)] transition-transform duration-[900ms] ease-in-out ${
          opening ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <DoorContent />
      </div>
      <div
        className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-[var(--foreground)] transition-transform duration-[900ms] ease-in-out ${
          opening ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <DoorContent />
      </div>

      {!opening && (
        <button
          type="button"
          onClick={() => setPhase("opening")}
          className="absolute bottom-[15%] left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/60 px-8 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-white hover:text-[var(--foreground)]"
        >
          Entrer
        </button>
      )}
    </div>
  );
}
