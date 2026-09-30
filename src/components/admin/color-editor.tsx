"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
  const desktopFrame = useRef<HTMLIFrameElement>(null);
  const phoneFrame = useRef<HTMLIFrameElement>(null);

  // Initial colors travel via the iframe's URL (so there's no flash of
  // default colors before the first postMessage); live edits after that
  // are pushed straight into the already-loaded preview pages.
  const [previewSrc] = useState(() => `/theme-preview?${new URLSearchParams(initial)}`);

  useEffect(() => {
    for (const frame of [desktopFrame.current, phoneFrame.current]) {
      frame?.contentWindow?.postMessage({ type: "theme-preview-colors", colors }, window.location.origin);
    }
  }, [colors]);

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

      <div className="lg:sticky lg:top-6 lg:self-start space-y-8">
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--foreground)]/60">🖥️ Sur ordinateur — le vrai site, en direct</p>
          <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm">
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
            </div>
            <div className="h-[480px] w-full overflow-hidden">
              <iframe
                ref={desktopFrame}
                src={previewSrc}
                title="Aperçu ordinateur"
                style={{ width: 1280, height: 1140, border: "none", transform: "scale(0.4)", transformOrigin: "top left", pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-[var(--foreground)]/60">📱 Sur téléphone — le vrai site, en direct</p>
          <div className="mx-auto w-[300px] rounded-[2rem] border-[6px] border-black/85 bg-black/85 p-1.5 shadow-lg">
            <div className="h-4" />
            <div className="h-[520px] w-full overflow-hidden rounded-[1.1rem]">
              <iframe
                ref={phoneFrame}
                src={previewSrc}
                title="Aperçu téléphone"
                style={{ width: 390, height: 693, border: "none", transform: "scale(0.738)", transformOrigin: "top left", pointerEvents: "none" }}
              />
            </div>
            <div className="flex justify-center py-2">
              <div className="h-1 w-20 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
