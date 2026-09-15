"use client";

import { useState, useTransition } from "react";
import { savePage } from "./actions";
import type { PageSchema } from "@/lib/page-schemas";

type PageRow = {
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  content: Record<string, string> | null;
};

export function PageForm({ schema, row }: { schema: PageSchema; row: PageRow }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-black/5 bg-[var(--background)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h2 className="font-serif text-lg text-[var(--foreground)]">{schema.label}</h2>
        <span className="text-[var(--foreground)]/40">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form
          action={(formData) =>
            startTransition(async () => {
              await savePage(formData);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            })
          }
          className="space-y-4 border-t border-black/5 px-6 py-5"
        >
          <input type="hidden" name="slug" value={schema.slug} />

          {schema.fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.key}
                  defaultValue={row.content?.[field.key] ?? field.default}
                  rows={2}
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              ) : (
                <input
                  name={field.key}
                  defaultValue={row.content?.[field.key] ?? field.default}
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}

          <div className="grid gap-4 border-t border-black/5 pt-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Titre SEO</label>
              <input name="seo_title" defaultValue={row.seo_title ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Meta description SEO</label>
              <input name="seo_description" defaultValue={row.seo_description ?? ""} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}
