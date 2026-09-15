"use client";

import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import "react-day-picker/style.css";

export function DatePicker({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = value ? new Date(value) : undefined;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-lg border border-black/10 px-4 py-3 text-left text-sm text-[var(--foreground)]"
      >
        {selected ? format(selected, "d MMMM yyyy", { locale: fr }) : "Choisir une date"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 rounded-2xl border border-black/10 bg-[var(--background)] p-3 shadow-xl [--rdp-accent-color:var(--accent)]">
            <DayPicker
              mode="single"
              locale={fr}
              selected={selected}
              disabled={{ before: new Date() }}
              onSelect={(date) => {
                if (date) {
                  onChange(format(date, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
