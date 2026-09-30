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

const CUSTOM_VARS = [
  { key: "--accent", label: "Accent" },
  { key: "--accent-warm", label: "Accent chaud" },
  { key: "--background", label: "Fond" },
  { key: "--background-muted", label: "Fond secondaire" },
  { key: "--foreground", label: "Texte" },
] as const;

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>("v1");
  const [custom, setCustom] = useState<Record<string, string>>({});

  useEffect(() => {
    let stored = "v1";
    let storedCustom: Record<string, string> = {};
    try {
      stored = localStorage.getItem("theme-preview") || "v1";
      storedCustom = JSON.parse(localStorage.getItem("theme-custom") || "{}");
    } catch {}
    setTheme(stored);
    if (stored !== "v1") document.documentElement.setAttribute("data-theme", stored);
    for (const [key, value] of Object.entries(storedCustom)) {
      document.documentElement.style.setProperty(key, value);
    }

    const computed = getComputedStyle(document.documentElement);
    const withDefaults: Record<string, string> = {};
    for (const { key } of CUSTOM_VARS) {
      withDefaults[key] = storedCustom[key] || rgbToHex(computed.getPropertyValue(key).trim());
    }
    setCustom(withDefaults);
  }, []);

  function rgbToHex(color: string): string {
    if (color.startsWith("#")) return color;
    const m = color.match(/\d+/g);
    if (!m) return "#6b7d5f";
    const [r, g, b] = m.map(Number);
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }

  function choose(id: string) {
    if (id === "v1") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    setTheme(id);
    try {
      localStorage.setItem("theme-preview", id);
    } catch {}
  }

  function setVar(key: string, value: string) {
    document.documentElement.style.setProperty(key, value);
    const next = { ...custom, [key]: value };
    setCustom(next);
    try {
      localStorage.setItem("theme-custom", JSON.stringify(next));
    } catch {}
  }

  function resetCustom() {
    for (const { key } of CUSTOM_VARS) document.documentElement.style.removeProperty(key);
    setCustom({});
    try {
      localStorage.removeItem("theme-custom");
    } catch {}
  }

  return (
    <div
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999999 }}
      className="flex items-center gap-4 overflow-x-auto border-t border-black/10 bg-white px-3 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs font-semibold text-black/60">Thèmes :</span>
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

      <div className="h-6 w-px shrink-0 bg-black/10" />

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs font-semibold text-black/60">Ton exact :</span>
        {CUSTOM_VARS.map(({ key, label }) => (
          <label key={key} className="flex shrink-0 items-center gap-1.5" title={label}>
            <input
              type="color"
              value={custom[key] || "#6b7d5f"}
              onChange={(e) => setVar(key, e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-black/20 p-0"
            />
            <span className="text-xs text-black/60">{label}</span>
          </label>
        ))}
        <button type="button" onClick={resetCustom} className="shrink-0 text-xs text-black/50 underline hover:text-black/80">
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
