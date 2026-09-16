"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function HeroFadeImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const height = el.offsetHeight || 1;
      const next = 1 - Math.min(Math.max(window.scrollY / height, 0), 1);
      setOpacity(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" style={{ opacity }}>
      <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
    </div>
  );
}
