"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deletePhoto, reorderPhoto } from "./actions";

export function PhotoTile({
  id,
  url,
  alt,
  storagePath,
  page,
  isFirst,
  isLast,
}: {
  id: string;
  url: string;
  alt: string;
  storagePath: string;
  page: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-black/5">
      <Image src={url} alt={alt} fill className="object-cover" sizes="200px" />

      <div className="absolute inset-x-0 top-0 flex justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-1">
          <button
            disabled={pending || isFirst}
            onClick={() => startTransition(() => reorderPhoto(id, page, "up"))}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white disabled:opacity-30"
            title="Déplacer avant"
          >
            ←
          </button>
          <button
            disabled={pending || isLast}
            onClick={() => startTransition(() => reorderPhoto(id, page, "down"))}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white disabled:opacity-30"
            title="Déplacer après"
          >
            →
          </button>
        </div>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deletePhoto(id, storagePath))}
          className="rounded-full bg-black/60 px-2.5 py-1 text-xs text-white disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
