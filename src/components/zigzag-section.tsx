"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "./container";
import { FadeCarousel } from "./fade-carousel";

export function ZigzagSection({
  title,
  text,
  images,
  intervalMs = 6000,
  startDelayMs = 0,
  reverse = false,
}: {
  title: string;
  text: string;
  images: { src: string; alt: string }[];
  intervalMs?: number;
  startDelayMs?: number;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="overflow-hidden py-14">
      <Container className={`grid items-center gap-10 sm:grid-cols-2 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}>
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl transition-all duration-1000 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <FadeCarousel photos={images} intervalMs={intervalMs} startDelayMs={startDelayMs} />
        </div>
        <div
          className={`transition-all duration-1000 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{ transitionDelay: visible ? "180ms" : "0ms" }}
        >
          <h2 className="font-display text-3xl italic text-[var(--accent-warm)]">{title}</h2>
          <p className="mt-4 whitespace-pre-line text-[var(--foreground)]/70">{text}</p>
        </div>
      </Container>
    </section>
  );
}
