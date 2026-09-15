"use client";

import { useTransition } from "react";
import { savePage } from "./actions";

type PageContent = {
  slug: string;
  hero_title: string | null;
  hero_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export function PageForm({ label, content }: { label: string; content: PageContent }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => savePage(formData))}
      className="rounded-2xl border border-black/5 bg-[var(--background)] p-6"
    >
      <input type="hidden" name="slug" value={content.slug} />
      <h2 className="font-serif text-lg text-[var(--foreground)]">{label}</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Titre (hero)</label>
          <input name="hero_title" defaultValue={content.hero_title ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Description (hero)</label>
          <input name="hero_description" defaultValue={content.hero_description ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Titre SEO</label>
          <input name="seo_title" defaultValue={content.seo_title ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Meta description SEO</label>
          <input name="seo_description" defaultValue={content.seo_description ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
