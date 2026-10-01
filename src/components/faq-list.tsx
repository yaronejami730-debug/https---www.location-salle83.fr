"use client";

import { useMemo, useState } from "react";
import type { FaqEntry } from "@/lib/faq";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FaqList({ entries, compact = false }: { entries: FaqEntry[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(entries.map((f) => f.category))), [entries]);

  const grouped = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = entries.filter((f) => {
      if (category && f.category !== category) return false;
      if (!q) return true;
      const keywordHit = f.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
        .some((k) => normalize(k).includes(q));
      return normalize(f.question).includes(q) || normalize(f.answer).includes(q) || keywordHit;
    });

    const byCategory = new Map<string, typeof entries>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }
    return byCategory;
  }, [entries, query, category]);

  return (
    <div>
      <div className={compact ? "space-y-2.5" : "space-y-4"}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une question..."
          className={`w-full rounded-lg border border-black/10 bg-[var(--background)] ${compact ? "px-3 py-2 text-sm" : "px-4 py-3"}`}
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setCategory(null);
              setQuery("");
            }}
            className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${
              category === null
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-black/15 text-[var(--foreground)] hover:bg-black/5"
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat === category ? null : cat);
                setQuery("");
              }}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${
                category === cat
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-black/15 text-[var(--foreground)] hover:bg-black/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={compact ? "mt-4" : "mt-8"}>
        {grouped.size === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucune question ne correspond à votre recherche.</p>}

        {[...grouped.entries()].map(([cat, entries]) => (
          <div key={cat} className={compact ? "mb-4" : "mb-8"}>
            <p
              className={`mb-2.5 inline-block rounded-full bg-[var(--accent)]/10 font-bold tracking-wide text-[var(--accent)] uppercase ${
                compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
              }`}
            >
              {cat}
            </p>
            <div className="space-y-2.5">
              {entries.map((f) => {
                const isOpen = openId === f.id;
                return (
                  <div
                    key={f.id}
                    className={`rounded-xl border bg-[var(--background)] ${isOpen ? "border-[var(--accent)]/40" : "border-black/15"}`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : f.id)}
                      className={`flex w-full items-center justify-between gap-3 text-left font-bold text-[var(--foreground)] ${
                        compact ? "px-3 py-3 text-sm" : "px-5 py-4 text-base"
                      }`}
                    >
                      <span>{f.question}</span>
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 font-bold text-[var(--accent)] ${
                          compact ? "h-5 w-5 text-sm" : "h-6 w-6 text-base"
                        }`}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p
                        className={`border-t border-black/10 leading-relaxed whitespace-pre-wrap font-medium text-[var(--foreground)] ${
                          compact ? "px-3 py-2.5 text-sm" : "px-5 py-4"
                        }`}
                      >
                        {f.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
