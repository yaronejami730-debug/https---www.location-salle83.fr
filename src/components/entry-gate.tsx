"use client";

import { useEffect, useState } from "react";

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
    const t = setTimeout(() => setPhase("open"), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "open") return null;

  const opening = phase === "opening";

  return (
    <div className="fixed inset-0 z-[100] h-dvh bg-black">
      {/* Each half-width panel shows one side of the same photo via background-position,
          avoiding a `fixed` element nested in a `transform`ed ancestor (that combo introduced
          a real compositing race where the header could paint a frame before this layer). */}
      <div
        className={`absolute inset-y-0 left-0 h-dvh w-1/2 overflow-hidden bg-black bg-[url('/images/entry-gate.jpg')] bg-[length:200%_100%] bg-left transition-transform duration-[1800ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div
        className={`absolute inset-y-0 right-0 h-dvh w-1/2 overflow-hidden bg-black bg-[url('/images/entry-gate.jpg')] bg-[length:200%_100%] bg-right transition-transform duration-[1800ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          opening ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white transition-opacity duration-500 ${
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
          className="animate-fade-in-up mt-10 rounded-full border border-white/60 px-9 py-3.5 font-script text-2xl tracking-wide text-white transition-opacity duration-300 hover:bg-white hover:text-[var(--foreground)]"
          style={{ animationDelay: "5300ms" }}
        >
          Accéder au site
        </button>
      </div>
    </div>
  );
}
