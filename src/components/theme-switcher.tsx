"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "v1", label: "Sauge", swatch: "#6b7d5f" },
  { id: "v2", label: "Pêche", swatch: "#d98b6c" },
  { id: "v3", label: "Ardoise", swatch: "#3c5064" },
  { id: "v4", label: "Bordeaux", swatch: "#7a3040" },
  { id: "v5", label: "Terracotta", swatch: "#c1633f" },
  { id: "v6", label: "Lavande", swatch: "#7d6b96" },
  { id: "v7", label: "Moutarde", swatch: "#b98a2e" },
  { id: "v8", label: "Rose poudré", swatch: "#c98a93" },
  { id: "v9", label: "Vert forêt", swatch: "#3f5d43" },
  { id: "v10", label: "Bleu canard", swatch: "#2f6f6a" },
  { id: "v11", label: "Caramel", swatch: "#a9702f" },
  { id: "v12", label: "Prune", swatch: "#5c3450" },
  { id: "v13", label: "Or rosé", swatch: "#b98570" },
  { id: "v14", label: "Bleu marine", swatch: "#2c3e55" },
  { id: "v15", label: "Corail", swatch: "#d9645a" },
] as const;

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>("v1");

  useEffect(() => {
    let stored = "v1";
    try {
      stored = localStorage.getItem("theme-preview") || "v1";
    } catch {}
    setTheme(stored);
    if (stored !== "v1") document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function choose(id: string) {
    if (id === "v1") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    setTheme(id);
    try {
      localStorage.setItem("theme-preview", id);
    } catch {}
  }

  return (
    <div
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999999 }}
      className="flex items-center gap-2 overflow-x-auto border-t border-black/10 bg-white px-3 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
    >
      <span className="shrink-0 text-xs font-semibold text-black/60">Couleurs :</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => choose(t.id)}
          title={t.label}
          style={{ backgroundColor: t.swatch }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
            theme === t.id ? "border-black scale-110" : "border-black/20"
          }`}
        >
          {theme === t.id && <span className="h-2 w-2 rounded-full bg-white" />}
        </button>
      ))}
    </div>
  );
}
