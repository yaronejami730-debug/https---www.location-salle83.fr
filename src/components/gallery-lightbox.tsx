"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type GalleryPhoto = { key: string; src: string; alt: string };

const AUTOPLAY_MS = 4000;

function useIsLandscapeTouch() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape) and (pointer: coarse)");
    const update = () => setActive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return active;
}

export function GalleryLightbox({
  photos,
  startIndex,
  autoplay = false,
  onClose,
}: {
  photos: GalleryPhoto[];
  startIndex: number;
  autoplay?: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(autoplay);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStartX = useRef<number | null>(null);
  const coverflow = useIsLandscapeTouch();

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [playing, next]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose, next, prev]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex h-dvh flex-col bg-black">
      <audio ref={audioRef} src="/audio/slideshow.mp3" loop />

      <div className="flex items-center justify-between px-4 py-3 text-white/90">
        <p className="text-sm">
          {index + 1} / {photos.length}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={() => setPlaying((v) => !v)} className="hover:text-white">
            {playing ? "Pause" : "Lancer le diaporama"}
          </button>
          <button onClick={() => setMusicOn((v) => !v)} className="hover:text-white">
            {musicOn ? "Musique : on" : "Musique : off"}
          </button>
          <button aria-label="Fermer" onClick={onClose} className="text-xl hover:text-white">
            ✕
          </button>
        </div>
      </div>

      {coverflow ? (
        <CoverFlow photos={photos} index={index} setIndex={setIndex} />
      ) : (
        <div className="relative flex-1 overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {photos.map((p, i) => (
            <div
              key={p.key}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="relative h-full w-full">
                <Image src={p.src} alt={p.alt} fill className="object-contain" sizes="100vw" priority={i === index} />
              </div>
            </div>
          ))}

          <button
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 sm:left-6"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Suivant"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function CoverFlow({
  photos,
  index,
  setIndex,
}: {
  photos: GalleryPhoto[];
  index: number;
  setIndex: (i: number) => void;
}) {
  const dragStartX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    dragStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (dragStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (delta > 40) setIndex((index - 1 + photos.length) % photos.length);
    else if (delta < -40) setIndex((index + 1) % photos.length);
    dragStartX.current = null;
  }

  return (
    <div
      className="flex flex-1 items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[70%] w-full">
        {photos.map((p, i) => {
          const offset = i - index;
          if (Math.abs(offset) > 3) return null;
          const isCenter = offset === 0;
          return (
            <button
              key={p.key}
              onClick={() => setIndex(i)}
              className="absolute top-1/2 left-1/2 h-full aspect-[3/4] -translate-y-1/2 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-50% + ${offset * 62}%)) translateZ(${isCenter ? 0 : -160}px) rotateY(${
                  offset === 0 ? 0 : offset > 0 ? -55 : 55
                }deg) scale(${isCenter ? 1 : 0.75})`,
                zIndex: 10 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl">
                <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="60vh" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
