"use client";

import { useTransition } from "react";
import { deleteFaq, toggleFaqPublished } from "./actions";

type Faq = { id: string; question: string; answer: string; published: boolean };

export function FaqRow({ faq }: { faq: Faq }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-black/5 bg-[var(--background)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[var(--foreground)]">{faq.question}</p>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">{faq.answer}</p>
        </div>
        <div className="flex shrink-0 gap-3 text-xs">
          <button
            disabled={pending}
            onClick={() => startTransition(() => toggleFaqPublished(faq.id, !faq.published))}
            className="text-[var(--accent)] hover:underline disabled:opacity-50"
          >
            {faq.published ? "Masquer" : "Publier"}
          </button>
          <button
            disabled={pending}
            onClick={() => startTransition(() => deleteFaq(faq.id))}
            className="text-red-600 hover:underline disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>
      {!faq.published && <p className="mt-2 text-xs text-[var(--foreground)]/40">Masqué du site</p>}
    </div>
  );
}
