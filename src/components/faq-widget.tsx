"use client";

import { useState } from "react";
import Link from "next/link";
import { FaqList } from "./faq-list";

export function FaqWidget() {
  const [open, setOpen] = useState(false);

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

          <div className="flex-1 overflow-y-auto p-3">
            <FaqList compact />
          </div>

          <div className="flex items-center justify-between border-t border-black/5 px-3 py-2.5 text-xs">
            <Link href="/faq" className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:underline">
              Voir la FAQ complète
            </Link>
            <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">
              Faire une demande de devis
            </Link>
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
