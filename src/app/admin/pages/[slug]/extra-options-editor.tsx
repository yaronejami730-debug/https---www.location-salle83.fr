"use client";

import { useState, useTransition } from "react";
import type { ExtraOption } from "@/lib/pricing";
import { saveExtraOptions } from "../actions";

export function ExtraOptionsEditor({ initialOptions }: { initialOptions: ExtraOption[] }) {
  const [rows, setRows] = useState<ExtraOption[]>(initialOptions);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(index: number, patch: Partial<ExtraOption>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function add() {
    setRows((prev) => [...prev, { id: `opt-${Date.now()}`, label: "", price: 0 }]);
  }
  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await saveExtraOptions(rows);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de l'enregistrement des options.");
      }
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/5 bg-[var(--background-muted)] p-4">
      <p className="mb-1 text-sm font-medium text-[var(--foreground)]">Options supplémentaires</p>
      <p className="mb-4 text-xs text-[var(--foreground)]/50">
        Au même titre que le chapiteau : une option, un prix. Elle apparaît dans le formulaire de devis, dans le tableau des tarifs du contrat PDF et dans le total.
      </p>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            <input
              value={row.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Nom de l'option (ex. Sono)"
              className="min-w-0 flex-1 rounded border border-black/10 bg-[var(--background)] px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              min={0}
              value={row.price}
              onChange={(e) => update(i, { price: Number(e.target.value) || 0 })}
              className="w-24 rounded border border-black/10 bg-[var(--background)] px-2 py-1.5 text-sm"
            />
            <span className="text-xs text-[var(--foreground)]/50">€</span>
            <button type="button" onClick={() => remove(i)} className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs text-red-700 hover:bg-red-100">
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 flex items-center gap-1 rounded-full border-2 border-dashed border-[var(--accent)]/30 px-4 py-2 text-xs text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
      >
        <span className="text-base leading-none">+</span>
        Choisir une autre option
      </button>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "..." : saved ? "✓ Enregistré" : "Enregistrer les options"}
        </button>
        {error && <span className="text-xs text-red-700">{error}</span>}
      </div>
    </div>
  );
}
