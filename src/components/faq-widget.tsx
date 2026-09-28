"use client";

import { useMemo, useState } from "react";
import { chatbotFaq } from "@/lib/faq-data";

const CATEGORY_LABELS: Record<string, string> = {
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

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q
      ? chatbotFaq.filter(
          (f) =>
            normalize(f.question).includes(q) ||
            normalize(f.answer).includes(q) ||
            f.keywords.some((k) => normalize(k).includes(q)),
        )
      : chatbotFaq;

    const byCategory = new Map<string, typeof chatbotFaq>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }
    return byCategory;
  }, [query]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[75vh] max-h-[40rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl sm:w-96">
          <div className="flex items-center justify-between bg-[var(--accent)] px-4 py-3">
            <p className="text-sm font-medium text-white">Questions fréquentes</p>
            <button aria-label="Fermer" onClick={() => setOpen(false)} className="text-white/90 hover:text-white">
              ✕
            </button>
          </div>

          <div className="border-b border-black/5 p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {grouped.size === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucune question ne correspond à votre recherche.</p>}

            {[...grouped.entries()].map(([category, entries]) => (
              <div key={category} className="mb-4">
                <p className="mb-2 text-xs font-medium tracking-wide text-[var(--accent)] uppercase">
                  {CATEGORY_LABELS[category] ?? category}
                </p>
                <div className="space-y-2">
                  {entries.map((f) => {
                    const isOpen = openId === f.id;
                    return (
                      <div key={f.id} className="rounded-xl border border-black/5">
                        <button
                          onClick={() => setOpenId(isOpen ? null : f.id)}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-[var(--foreground)]"
                        >
                          <span>{f.question}</span>
                          <span className="shrink-0 text-[var(--foreground)]/40">{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <p className="border-t border-black/5 px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)]/80">
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

          <div className="flex items-center justify-center border-t border-black/5 px-3 py-2.5 text-xs">
            <a href="/contact" className="font-medium text-[var(--accent)] hover:underline">
              📋 Faire une demande de devis
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir la FAQ"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:opacity-90"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M9.5 9.2a2.5 2.5 0 1 1 3.6 2.3c-.9.5-1.3 1-1.3 1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
}
