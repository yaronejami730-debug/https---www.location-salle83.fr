"use client";

import { useTransition } from "react";
import { uploadPhoto } from "./actions";

const pageOptions = [
  { value: "galerie", label: "Galerie — mariages, accueil & réceptions" },
  { value: "hebergement", label: "Hébergement" },
  { value: "seminaire", label: "Séminaire" },
  { value: "domaine", label: "Le domaine" },
];

export function UploadForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-8 flex max-w-xl flex-wrap items-end gap-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6"
    >
      <div>
        <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Catégorie</label>
        <select id="upload-page" defaultValue="galerie" className="rounded-lg border border-black/10 px-3 py-2.5 text-sm">
          {pageOptions.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Fichiers (plusieurs possibles)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={pending}
          className="w-full text-sm"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length === 0) return;
            const page = (document.getElementById("upload-page") as HTMLSelectElement).value;
            startTransition(async () => {
              for (const file of files) {
                const fd = new FormData();
                fd.set("file", file);
                fd.set("page", page);
                await uploadPhoto(fd);
              }
            });
            e.target.value = "";
          }}
        />
      </div>
      {pending && <span className="text-xs text-[var(--foreground)]/50">Envoi en cours...</span>}
    </form>
  );
}
