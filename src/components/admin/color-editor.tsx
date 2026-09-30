"use client";

import { useState, useTransition } from "react";
import { saveTheme, resetTheme } from "@/app/admin/(dashboard)/couleurs/actions";

type ThemeColors = {
  background: string;
  backgroundMuted: string;
  foreground: string;
  accent: string;
  accentWarm: string;
};

const FIELDS: { key: keyof ThemeColors; label: string; explanation: string }[] = [
  {
    key: "background",
    label: "Fond principal",
    explanation: "Le fond derrière la majorité du site : le corps des pages, le header.",
  },
  {
    key: "backgroundMuted",
    label: "Fond secondaire",
    explanation: "Le fond des sections qui se détachent du reste : le bandeau titre en haut de chaque page, les blocs chiffres-clés, une section sur deux.",
  },
  {
    key: "foreground",
    label: "Texte principal",
    explanation: "La couleur du texte et des titres partout sur le site.",
  },
  {
    key: "accent",
    label: "Couleur d'accent",
    explanation: "Les boutons, les liens de menu, les titres en écriture manuscrite (\"Notre histoire\", etc.). La couleur la plus visible du site.",
  },
  {
    key: "accentWarm",
    label: "Accent secondaire",
    explanation: "Quelques touches décoratives : les étoiles des avis clients.",
  },
];

export function ColorEditor({ initial }: { initial: ThemeColors }) {
  const [colors, setColors] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set(key: keyof ThemeColors, value: string) {
    setColors((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveTheme(formData);
      setSaved(true);
    });
  }

  function handleReset() {
    startTransition(async () => {
      await resetTheme();
      location.reload();
    });
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form action={handleSave} className="space-y-5">
        {FIELDS.map(({ key, label, explanation }) => (
          <div key={key} className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
            <div className="flex items-center gap-3">
              <input
                type="color"
                name={key}
                value={colors[key]}
                onChange={(e) => set(key, e.target.value)}
                className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-black/10 p-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="mt-0.5 w-28 rounded border border-black/10 px-2 py-0.5 font-mono text-xs uppercase text-[var(--foreground)]/70"
                />
              </div>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-[var(--foreground)]/55">{explanation}</p>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={pending}
            className="text-sm text-[var(--foreground)]/50 underline hover:text-[var(--foreground)]/80"
          >
            Réinitialiser les couleurs d'origine
          </button>
          {saved && <span className="text-sm text-[var(--accent)]">Enregistré — visible sur le site pour tout le monde.</span>}
        </div>
      </form>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Aperçu en direct</p>
        <div className="overflow-hidden rounded-2xl border border-black/10 shadow-sm" style={{ backgroundColor: colors.background }}>
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: colors.background, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <span style={{ color: colors.foreground, fontWeight: 700 }}>Domaine de la Bégude</span>
            <div className="flex items-center gap-4 text-sm">
              <span style={{ color: colors.accent }}>Mariage</span>
              <span style={{ color: colors.foreground }}>Le domaine</span>
              <span
                className="rounded-full px-4 py-1.5 text-xs text-white"
                style={{ backgroundColor: colors.accent }}
              >
                Parlons de votre projet
              </span>
            </div>
          </div>

          {/* page hero band (background-muted) */}
          <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.backgroundMuted }}>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
              Exemple
            </p>
            <p className="mt-2 text-2xl italic" style={{ color: colors.foreground, fontFamily: "cursive" }}>
              Notre histoire
            </p>
          </div>

          {/* body */}
          <div className="space-y-4 px-5 py-6" style={{ backgroundColor: colors.background }}>
            <p className="text-sm leading-relaxed" style={{ color: colors.foreground, opacity: 0.75 }}>
              Voici à quoi ressemble un paragraphe de texte normal sur le site, avec ces couleurs.
            </p>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex rounded-full px-5 py-2 text-sm text-white"
                style={{ backgroundColor: colors.accent }}
              >
                Bouton principal
              </span>
              <span style={{ color: colors.accentWarm }}>★★★★★</span>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: colors.backgroundMuted }}>
              <p className="text-sm" style={{ color: colors.foreground }}>
                Un bloc en fond secondaire (comme les chiffres-clés de la page d'accueil).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
