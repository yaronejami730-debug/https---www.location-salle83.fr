"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function HeroFadeImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const height = el.offsetHeight || 1;
      setProgress(Math.min(Math.max(window.scrollY / height, 0), 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mask = `linear-gradient(to bottom, transparent 0%, transparent ${progress * 100}%, black ${progress * 100}%, black 100%)`;

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
    </div>
  );
}
