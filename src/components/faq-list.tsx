"use client";

import { useMemo, useState } from "react";
import { chatbotFaq } from "@/lib/faq-data";

export const FAQ_CATEGORY_LABELS: Record<string, string> = {
  hebergement: "Hébergement",
  accessibilite: "Accessibilité",
  equipements: "Équipements",
  location: "Location",
  animation: "Animation",
  logistique: "Logistique",
  restauration: "Restauration",
  reservation: "Réservation",
  localisation: "Localisation",
  evenement: "Événements",
};

const CATEGORIES = Array.from(new Set(chatbotFaq.map((f) => f.category)));

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FaqList({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = chatbotFaq.filter((f) => {
      if (category && f.category !== category) return false;
      if (!q) return true;
      return normalize(f.question).includes(q) || normalize(f.answer).includes(q) || f.keywords.some((k) => normalize(k).includes(q));
    });

    const byCategory = new Map<string, typeof chatbotFaq>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }
    return byCategory;
  }, [query, category]);

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
          {CATEGORIES.map((cat) => (
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
              {FAQ_CATEGORY_LABELS[cat] ?? cat}
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
              {FAQ_CATEGORY_LABELS[cat] ?? cat}
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
