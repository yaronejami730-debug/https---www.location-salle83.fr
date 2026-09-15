"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function FadeCarousel({ photos, intervalMs = 6000 }: { photos: { src: string; alt: string }[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(id);
  }, [photos.length, intervalMs]);

  if (photos.length === 0) return null;

  return (
    <div className="relative h-full w-full">
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          sizes="500px"
        />
      ))}
    </div>
  );
}
