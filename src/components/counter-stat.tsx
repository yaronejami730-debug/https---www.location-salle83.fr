"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;

export function CounterStat({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1].replace(",", ".")) : null;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(",") || match?.[1].includes(".") ? 1 : 0;

  const [display, setDisplay] = useState(target !== null ? "0" : value);
  const ref = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function tick(now: number) {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target! * eased;
            setDisplay(decimals ? current.toFixed(1) : Math.round(current).toString());
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return (
    <p ref={ref} className={className}>
      {target !== null ? `${display}${suffix}` : value}
    </p>
  );
}
