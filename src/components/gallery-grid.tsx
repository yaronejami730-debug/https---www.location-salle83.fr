"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox, type GalleryPhoto } from "./gallery-lightbox";
import { RichText } from "./rich-text";

export function GalleryGrid({ title, photos, audioSrc }: { title: string; photos: GalleryPhoto[]; audioSrc?: string }) {
  const [lightbox, setLightbox] = useState<{ index: number; autoplay: boolean } | null>(null);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <RichText as="h2" value={title} className="font-serif text-2xl text-[var(--foreground)]" />
        {photos.length > 1 && (
          <button
            onClick={() => setLightbox({ index: 0, autoplay: true })}
            className="rounded-full border border-[var(--accent)] px-4 py-2 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
          >
            Lancer le diaporama
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setLightbox({ index: i, autoplay: false })}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="400px"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <GalleryLightbox
          photos={photos}
          startIndex={lightbox.index}
          autoplay={lightbox.autoplay}
          audioSrc={audioSrc}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
