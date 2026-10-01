"use client";

import { useMemo, useState, useTransition } from "react";
import type { FaqEntry } from "@/lib/faq";
import { saveFaqEntries } from "./actions";

function newId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function FaqEditor({ initialEntries }: { initialEntries: FaqEntry[] }) {
  const [entries, setEntries] = useState<FaqEntry[]>(initialEntries);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingCategories = useMemo(() => Array.from(new Set(entries.map((e) => e.category).filter(Boolean))), [entries]);

  function update(index: number, patch: Partial<FaqEntry>) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }
  function remove(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    setEntries((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function add() {
    setEntries((prev) => [
      ...prev,
      { id: newId(), category: "Général", question: "", answer: "", keywords: "", sort_order: prev.length, published: true },
    ]);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await saveFaqEntries(entries);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de l'enregistrement.");
      }
    });
  }

  return (
    <div className="mt-6 max-w-3xl">
      <div className="sticky top-24 z-10 flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--background)]/95 p-3 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "..." : saved ? "✓ Enregistré" : "Enregistrer"}
        </button>
        <span className="text-xs text-[var(--foreground)]/40">{entries.length} question{entries.length > 1 ? "s" : ""}</span>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <datalist id="faq-categories">
        {existingCategories.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>

      <div className="mt-5 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--foreground)]/60">
                <input type="checkbox" checked={entry.published} onChange={(e) => update(i, { published: e.target.checked })} className="h-4 w-4" />
                Publiée sur le site
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === entries.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-red-700 hover:bg-red-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <label className="mb-1 block text-xs text-[var(--foreground)]/50">Catégorie</label>
            <input
              value={entry.category}
              onChange={(e) => update(i, { category: e.target.value })}
              list="faq-categories"
              placeholder="Ex. Hébergement, Réservation..."
              className="mb-3 w-full max-w-xs rounded-lg border border-black/10 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs text-[var(--foreground)]/50">Question</label>
            <input
              value={entry.question}
              onChange={(e) => update(i, { question: e.target.value })}
              className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-medium"
            />

            <label className="mb-1 block text-xs text-[var(--foreground)]/50">Réponse</label>
            <textarea
              value={entry.answer}
              onChange={(e) => update(i, { answer: e.target.value })}
              rows={Math.min(10, Math.max(2, Math.ceil(entry.answer.length / 80)))}
              className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs text-[var(--foreground)]/50">Mots-clés de recherche (séparés par des virgules)</label>
            <input
              value={entry.keywords}
              onChange={(e) => update(i, { keywords: e.target.value })}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs text-[var(--foreground)]/70"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 py-5 text-sm text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
      >
        <span className="text-xl leading-none">+</span>
        Ajouter une question
      </button>
    </div>
  );
}
