"use client";

import { EditableText } from "../editable-text";
import type { ListItemField, ListItem } from "@/lib/page-schemas";

/**
 * Admin editor for a "list" page field: an unlimited, reorderable set of
 * cards (e.g. "Atouts"), each with the same shape (itemFields). Replaces the
 * old pattern of N fixed feature1/feature2/feature3_... keys.
 */
export function EditableCardList({
  items,
  itemFields,
  onChange,
  addLabel = "Ajouter une carte",
  cardClassName = "rounded-2xl bg-[var(--background-muted)] p-6",
  gridClassName = "grid gap-4 sm:grid-cols-3",
}: {
  items: ListItem[];
  itemFields: ListItemField[];
  onChange: (items: ListItem[]) => void;
  addLabel?: string;
  cardClassName?: string;
  gridClassName?: string;
}) {
  function updateItem(index: number, key: string, value: string) {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  }
  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function addItem() {
    onChange([...items, Object.fromEntries(itemFields.map((f) => [f.key, ""]))]);
  }

  return (
    <div className={gridClassName}>
      {items.map((item, i) => (
        <div key={i} className={`relative ${cardClassName}`}>
          <div className="absolute right-2 top-2 z-10 flex gap-1">
            <button
              type="button"
              onClick={() => moveItem(i, -1)}
              disabled={i === 0}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs text-[var(--foreground)]/70 hover:bg-black/20 disabled:opacity-20"
              title="Déplacer avant"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveItem(i, 1)}
              disabled={i === items.length - 1}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs text-[var(--foreground)]/70 hover:bg-black/20 disabled:opacity-20"
              title="Déplacer après"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs text-red-700 hover:bg-red-100"
              title="Supprimer cette carte"
            >
              ✕
            </button>
          </div>
          {itemFields.map((f, fi) => (
            <EditableText
              key={f.key}
              as={fi === 0 ? "h3" : "div"}
              value={item[f.key] ?? ""}
              onChange={(v) => updateItem(i, f.key, v)}
              placeholder={f.label}
              className={fi === 0 ? "pr-20 font-serif text-xl text-[var(--foreground)]" : "mt-3 text-sm text-[var(--foreground)]/70"}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex min-h-[140px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 text-sm text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
      >
        <span className="text-2xl leading-none">+</span>
        {addLabel}
      </button>
    </div>
  );
}
