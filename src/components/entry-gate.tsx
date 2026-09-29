"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type EntryGateProps = {
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
};

const DOOR_DURATION_MS = 1400;

/**
 * Full-viewport-sized photo, shifted horizontally within its half-width panel so the panel's
 * own overflow-hidden shows only its half. Both halves use the exact same crop as a single
 * full-bleed image would (object-cover, sized to the whole viewport) — splitting it this way
 * never re-crops or distorts either half, it just cuts one correct image down the middle.
 */
function HalfPhoto({ side }: { side: "left" | "right" }) {
  return (
    <div className="absolute inset-y-0 h-dvh w-screen" style={{ left: side === "left" ? 0 : "-50vw" }}>
      <Image src="/images/entry-gate.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-black/45" />
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
    const t = setTimeout(() => setPhase("open"), DOOR_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "open") return null;

  const opening = phase === "opening";

  return (
    <div id="entry-gate" data-phase={phase} className="fixed inset-0 z-[100] h-dvh overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 h-dvh w-1/2 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform", transitionDuration: `${DOOR_DURATION_MS}ms` }}
      >
        <HalfPhoto side="left" />
      </div>
      <div
        className={`absolute inset-y-0 right-0 h-dvh w-1/2 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform", transitionDuration: `${DOOR_DURATION_MS}ms` }}
      >
        <HalfPhoto side="right" />
      </div>

      {/* Text is a single overlay, not duplicated per door, so the write-in animation only ever
          plays once and stays perfectly centered regardless of where the doors split. */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white transition-opacity duration-500 ${
          opening ? "pointer-events-none opacity-0" : ""
        }`}
      >
        <h1 className="animate-write-in max-w-4xl font-script text-5xl leading-[1.3] sm:text-7xl" style={{ animationDelay: "300ms" }}>
          {heroTitle}
        </h1>
        <p className="animate-write-in mt-2 font-script text-5xl leading-[1.3] sm:text-7xl" style={{ animationDelay: "2200ms" }}>
          {heroAccent}
        </p>
        <p
          className="animate-fade-in-up mt-8 max-w-xl font-script text-2xl text-white/85 sm:text-3xl"
          style={{ animationDelay: "4500ms" }}
        >
          {heroDescription}
        </p>

        <button
          type="button"
          onClick={() => setPhase("opening")}
          className="animate-fade-in-up pointer-events-auto mt-10 rounded-full border border-white/60 px-9 py-3.5 font-script text-2xl tracking-wide text-white transition-opacity duration-300 hover:bg-white hover:text-[var(--foreground)]"
          style={{ animationDelay: "5300ms" }}
        >
          Accéder au site
        </button>
      </div>
    </div>
  );
}
