"use client";

import { EditableText } from "../editable-text";
import { AmenityIcon } from "@/components/amenity-icon";

export type AmenityItem = { icon: string; text: string };

const ICON_OPTIONS = ["wifi", "parking", "pool", "paw", "child", "restaurant", "kitchen", "fitness"] as const;

/** Admin editor for amenity/équipement lists: icon (dropdown, from the fixed icon set) + text, unlimited + reorderable. */
export function EditableAmenityList({ items, onChange }: { items: AmenityItem[]; onChange: (items: AmenityItem[]) => void }) {
  function update(index: number, patch: Partial<AmenityItem>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function add() {
    onChange([...items, { icon: ICON_OPTIONS[0], text: "" }]);
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="relative flex flex-col items-center gap-2 rounded-xl border border-black/10 bg-[var(--background)] p-3 text-center">
          <div className="absolute right-1 top-1 flex gap-0.5">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] hover:bg-black/20 disabled:opacity-20">
              ←
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] hover:bg-black/20 disabled:opacity-20">
              →
            </button>
            <button type="button" onClick={() => remove(i)} className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] text-red-700 hover:bg-red-100">
              ✕
            </button>
          </div>
          <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background-muted)] text-[var(--accent)]">
            <AmenityIcon name={item.icon as keyof typeof import("@/components/amenity-icon")} />
          </span>
          <select
            value={item.icon}
            onChange={(e) => update(i, { icon: e.target.value })}
            className="w-full rounded border border-black/10 bg-[var(--background)] px-1 py-0.5 text-[10px] text-[var(--foreground)]/60"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <EditableText value={item.text} onChange={(v) => update(i, { text: v })} className="text-xs text-[var(--foreground)]/70" placeholder="Équipement" />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex min-h-[110px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--accent)]/30 text-xs text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
      >
        <span className="text-xl leading-none">+</span>
        Ajouter
      </button>
    </div>
  );
}
