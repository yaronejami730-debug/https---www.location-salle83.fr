"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type EntryGateProps = {
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
};

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
    const t = setTimeout(() => setPhase("open"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "open") return null;

  const opening = phase === "opening";

  return (
    <div
      id="entry-gate"
      data-phase={phase}
      className={`fixed inset-0 z-[100] h-dvh bg-black transition-opacity duration-[1200ms] ease-out ${
        opening ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <Image src="/images/entry-gate.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
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
          className="animate-fade-in-up mt-10 rounded-full border border-white/60 px-9 py-3.5 font-script text-2xl tracking-wide text-white transition-opacity duration-300 hover:bg-white hover:text-[var(--foreground)]"
          style={{ animationDelay: "5300ms" }}
        >
          Accéder au site
        </button>
      </div>
    </div>
  );
}
