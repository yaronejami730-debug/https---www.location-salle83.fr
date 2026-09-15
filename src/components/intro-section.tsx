"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "./container";

export function IntroSection({ title, text }: { title: string; text: string }) {
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
    <section ref={ref} className="overflow-hidden py-16 text-center">
      <Container
        className={`max-w-2xl transition-all duration-1000 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <span className="mx-auto block h-px w-12 bg-[var(--accent-warm)]/50" />
        <h2 className="mt-5 font-display text-3xl italic text-[var(--accent-warm)]">{title}</h2>
        <p className="mt-5 whitespace-pre-line text-[var(--foreground)]/70">{text}</p>
      </Container>
    </section>
  );
}
