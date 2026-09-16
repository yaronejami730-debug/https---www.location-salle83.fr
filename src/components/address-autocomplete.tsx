"use client";

import { useEffect, useRef, useState } from "react";

export function AddressAutocomplete({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`);
        const data = await res.json();
        setSuggestions((data.features ?? []).map((f: { properties: { label: string } }) => f.properties.label));
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
        placeholder="Numéro, rue, code postal, ville"
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-black/10 bg-[var(--background)] shadow-lg">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-black/5"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
