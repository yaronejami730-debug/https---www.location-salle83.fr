"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deletePhoto } from "./actions";

export function PhotoTile({
  id,
  url,
  alt,
  storagePath,
}: {
  id: string;
  url: string;
  alt: string;
  storagePath: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-black/5">
      <Image src={url} alt={alt} fill className="object-cover" sizes="200px" />
      <button
        disabled={pending}
        onClick={() => startTransition(() => deletePhoto(id, storagePath))}
        className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
