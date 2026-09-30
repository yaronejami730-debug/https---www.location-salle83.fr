"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";
import { sanitizeRichText, stripHtml, parseAligned } from "@/lib/sanitize-html";

type Choice = { href: string; label: string; photo: string };

export function ChoiceCards({ choices }: { choices: Choice[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [grown, setGrown] = useState(false);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navigateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (navigateTimeout.current) clearTimeout(navigateTimeout.current);
  }, []);

  function handleClick(e: React.MouseEvent, index: number, href: string) {
    e.preventDefault();
    if (selected !== null) return;

    const el = refs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetW = window.innerWidth;
      const targetH = window.innerHeight;
      const scale = Math.max(targetW / rect.width, targetH / rect.height) * 1.05;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = targetW / 2 - cx;
      const dy = targetH / 2 - cy;

      el.style.setProperty("--fly-x", `${dx}px`);
      el.style.setProperty("--fly-y", `${dy}px`);
      el.style.setProperty("--fly-s", `${scale}`);
    }

    setSelected(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setGrown(true);
        document.getElementById("route-transition-cover")?.classList.remove("opacity-0");
      });
    });
    navigateTimeout.current = setTimeout(() => router.push(href), 650);
  }

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {choices.map((choice, i) => {
          const isSelected = selected === i;
          const isOther = selected !== null && !isSelected;
          const label = parseAligned(choice.label);
          return (
            <Reveal key={choice.href} delayMs={i * 100}>
              <a
                ref={(node) => {
                  refs.current[i] = node;
                }}
                href={choice.href}
                onClick={(e) => handleClick(e, i, choice.href)}
                className={`group relative flex aspect-[3/4] items-end justify-center overflow-hidden rounded-2xl text-center transition-[opacity,transform,box-shadow,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOther ? "scale-90 opacity-0" : ""
                } ${isSelected ? "z-50 shadow-2xl" : ""}`}
                style={
                  isSelected
                    ? {
                        transform: grown
                          ? "translate(var(--fly-x), var(--fly-y)) scale(var(--fly-s))"
                          : "translate(0, 0) scale(1)",
                        transitionDuration: "650ms",
                        borderRadius: grown ? "0px" : undefined,
                      }
                    : undefined
                }
              >
                <Image
                  src={choice.photo}
                  alt={stripHtml(choice.label)}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
                <span className="relative z-10 mb-12 inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm tracking-wide text-white transition-colors group-hover:bg-white group-hover:text-[var(--foreground)]">
                  <span
                    style={label.align !== "left" ? { textAlign: label.align } : undefined}
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(label.html) }}
                  />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
