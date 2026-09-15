"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function FadeCarousel({
  photos,
  intervalMs = 6000,
  startDelayMs = 0,
}: {
  photos: { src: string; alt: string }[];
  intervalMs?: number;
  startDelayMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length);
      intervalId = setInterval(() => setIndex((i) => (i + 1) % photos.length), intervalMs);
    }, startDelayMs);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [photos.length, intervalMs, startDelayMs]);

  if (photos.length === 0) return null;

  return (
    <div className="relative h-full w-full">
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          className={`object-cover transition-opacity ease-in-out duration-[2200ms] ${i === index ? "opacity-100" : "opacity-0"}`}
          sizes="500px"
        />
      ))}
    </div>
  );
}
