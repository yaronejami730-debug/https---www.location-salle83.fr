"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type EntryGateProps = {
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
};

// The panel below always has a `transform` (even translate-x-0 at rest), which per spec
// makes it the containing block for `fixed` descendants. So this content is positioned
// relative to the PANEL, not the viewport — `offset` corrects for that per side, so both
// panels render the exact same full-viewport photo+headline, split down the middle by the
// panels' own overflow-hidden clipping, and it travels with its door as it slides open.
function GateContent({ offset, heroTitle, heroAccent, heroDescription }: { offset: string } & EntryGateProps) {
  return (
    <div className="fixed inset-y-0 top-0 h-full w-screen" style={{ left: offset }}>
      <Image src="/images/entry-gate.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="max-w-4xl font-script text-5xl leading-[1.3] sm:text-7xl">{heroTitle}</h1>
        <p className="mt-2 font-script text-5xl leading-[1.3] sm:text-7xl">{heroAccent}</p>
        <p className="mt-8 max-w-xl text-base text-white/85">{heroDescription}</p>
      </div>
    </div>
  );
}

export function EntryGate({ heroTitle, heroAccent, heroDescription }: EntryGateProps) {
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
    const t = setTimeout(() => setPhase("open"), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "open") return null;

  const opening = phase === "opening";
  const contentProps = { heroTitle, heroAccent, heroDescription };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <GateContent offset="0" {...contentProps} />
      </div>
      <div
        className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <GateContent offset="-50vw" {...contentProps} />
      </div>

      <button
        type="button"
        onClick={() => setPhase("opening")}
        className={`absolute bottom-[15%] left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/60 px-8 py-3.5 text-sm tracking-wide text-white transition-opacity duration-300 hover:bg-white hover:text-[var(--foreground)] ${
          opening ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        Accéder au site
      </button>
    </div>
  );
}
