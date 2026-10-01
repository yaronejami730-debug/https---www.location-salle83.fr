"use client";

import { useState, useTransition } from "react";
import type { PricingBracket } from "@/lib/pricing";
import { savePricingBrackets } from "../actions";

const NUMBER_FIELDS: { key: keyof PricingBracket; label: string }[] = [
  { key: "maxGuests", label: "Jusqu'à (pers.)" },
  { key: "salle", label: "La salle" },
  { key: "lendemain", label: "Lendemain" },
  { key: "piscine", label: "Piscine" },
  { key: "vaisselle", label: "Vaisselle" },
  { key: "cuisine", label: "Cuisine" },
];

export function PricingGridEditor({ initialBrackets }: { initialBrackets: PricingBracket[] }) {
  const [rows, setRows] = useState<PricingBracket[]>(initialBrackets);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(index: number, patch: Partial<PricingBracket>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }
  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    setRows((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function add() {
    setRows((prev) => [
      ...prev,
      { key: `tranche-${Date.now()}`, label: "Nouvelle tranche", maxGuests: 0, salle: 0, lendemain: 0, piscine: 0, vaisselle: 0, cuisine: 0 },
    ]);
  }
  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await savePricingBrackets(rows);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de l'enregistrement de la grille tarifaire.");
      }
    });
  }

  return (
    <div className="mt-8 rounded-2xl border border-black/5 bg-[var(--background-muted)] p-4">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "..." : saved ? "✓ Enregistré" : "Enregistrer la grille"}
        </button>
        <span className="text-xs text-[var(--foreground)]/40">Ajoutez, retirez ou réordonnez les tranches de tarifs.</span>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-[var(--foreground)]/60">
              <th className="px-3 py-2 font-medium">Libellé</th>
              {NUMBER_FIELDS.map((f) => (
                <th key={f.key} className="px-3 py-2 font-medium">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key} className="border-b border-black/5 last:border-0">
                <td className="px-3 py-2">
                  <input
                    value={row.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    className="w-32 rounded border border-black/10 bg-[var(--background)] px-2 py-1 text-sm font-medium"
                  />
                </td>
                {NUMBER_FIELDS.map((f) => (
                  <td key={f.key} className="px-3 py-2">
                    <input
                      type="number"
                      value={row[f.key]}
                      onChange={(e) => update(i, { [f.key]: Number(e.target.value) || 0 } as Partial<PricingBracket>)}
                      className="w-20 rounded border border-black/10 bg-[var(--background)] px-2 py-1 text-sm"
                    />
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex gap-0.5">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs hover:bg-black/20 disabled:opacity-20">
                      ↑
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs hover:bg-black/20 disabled:opacity-20">
                      ↓
                    </button>
                    <button type="button" onClick={() => remove(i)} className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs text-red-700 hover:bg-red-100">
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 flex items-center gap-1 rounded-full border-2 border-dashed border-[var(--accent)]/30 px-4 py-2 text-xs text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
      >
        <span className="text-base leading-none">+</span>
        Ajouter une tranche
      </button>
    </div>
  );
}
