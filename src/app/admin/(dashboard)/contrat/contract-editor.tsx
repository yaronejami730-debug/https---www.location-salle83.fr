"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { resolveClauses, resolveClause1, pageBreakKey, type ClauseItem } from "@/lib/contract-template";
import { saveContractContent, previewContractPdf } from "./actions";

const AUTO_PREVIEW_DELAY_MS = 900;

function newClauseId() {
  return `clause-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ContractEditor({ initialContent }: { initialContent: Record<string, string> }) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [clauses, setClauses] = useState<ClauseItem[]>(() => resolveClauses(initialContent));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);
  const [savePending, startSave] = useTransition();
  const [previewPending, startPreview] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clause1 = resolveClause1(content);
  const breakOf = (blockKey: "clause1" | "signature") => content[pageBreakKey(blockKey)] === "1";
  const setBreak = (blockKey: "clause1" | "signature") => (on: boolean) =>
    setContent((prev) => ({ ...prev, [pageBreakKey(blockKey)]: on ? "1" : "" }));

  function updateClause(index: number, patch: Partial<ClauseItem>) {
    setClauses((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }
  function removeClause(index: number) {
    setClauses((prev) => prev.filter((_, i) => i !== index));
  }
  function moveClause(index: number, dir: -1 | 1) {
    setClauses((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function addClause() {
    setClauses((prev) => [...prev, { id: newClauseId(), title: "NOUVELLE CLAUSE :", body: "", pageBreak: false }]);
  }

  function save() {
    setSaveError(null);
    startSave(async () => {
      try {
        await saveContractContent({ ...content, clauses: JSON.stringify(clauses) });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "Échec de l'enregistrement.");
      }
    });
  }

  function refreshPreview(targetContent: Record<string, string>, targetClauses: ClauseItem[]) {
    startPreview(async () => {
      const base64 = await previewContractPdf({ ...targetContent, clauses: JSON.stringify(targetClauses) });
      const bytes = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
      blobRef.current = url;
      // FitH = page always fits the pane width: no sideways scrolling, nothing cut off. Toolbar/sidebar hidden.
      setPreviewUrl(`${url}#view=FitH&toolbar=0&navpanes=0&scrollbar=1`);
    });
  }

  // Real-time preview: regenerate automatically shortly after each edit,
  // instead of requiring a manual click every time — "quoi qu'il arrive".
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => refreshPreview(content, clauses), AUTO_PREVIEW_DELAY_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, clauses]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="space-y-5">
        <div className="sticky top-24 z-10 flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--background)]/95 p-3 backdrop-blur">
          <button
            type="button"
            onClick={save}
            disabled={savePending}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {savePending ? "..." : saved ? "✓ Enregistré" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => refreshPreview(content, clauses)}
            disabled={previewPending}
            className="rounded-full border border-black/10 px-5 py-2 text-sm text-[var(--foreground)]/70 hover:bg-black/5 disabled:opacity-50"
          >
            {previewPending ? "Mise à jour..." : "Forcer l'aperçu"}
          </button>
          <span className="text-xs text-[var(--foreground)]/40">L&apos;aperçu se met à jour automatiquement</span>
        </div>
        {saveError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{saveError}</p>}

        <div className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Clause 1 — Événement et tarifs</p>
          <PageBreakToggle checked={breakOf("clause1")} onChange={setBreak("clause1")} />

          <label className="mb-1 mt-3 block text-xs text-[var(--foreground)]/50">Titre</label>
          <input
            value={clause1.title}
            onChange={(e) => setContent((prev) => ({ ...prev, clause1_title: e.target.value }))}
            className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-medium"
          />
          <label className="mb-1 block text-xs text-[var(--foreground)]/50">
            Texte au-dessus du tableau — une ligne = un paragraphe. Vous pouvez écrire un montant fixe (ex. 2000) ou garder {"{{salle_min}}"} / {"{{salle_31dec}}"} qui suivent la grille tarifaire. Le tableau, les options choisies et le total restent calculés automatiquement.
          </label>
          <textarea
            value={clause1.intro}
            onChange={(e) => setContent((prev) => ({ ...prev, clause1_intro: e.target.value }))}
            rows={5}
            className="w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs leading-relaxed"
          />
        </div>

        {clauses.map((c, i) => (
          <ClauseFields
            key={c.id}
            number={String(i + 2)}
            index={i}
            count={clauses.length}
            clause={c}
            onChange={(patch) => updateClause(i, patch)}
            onMove={(dir) => moveClause(i, dir)}
            onRemove={() => removeClause(i)}
          />
        ))}

        <button
          type="button"
          onClick={addClause}
          className="flex w-full items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 py-5 text-sm text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
        >
          <span className="text-xl leading-none">+</span>
          Ajouter une clause
        </button>

        <div className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Signature (calculée)</p>
          <PageBreakToggle checked={breakOf("signature")} onChange={setBreak("signature")} />
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[var(--background-muted)]" style={{ height: "85vh" }}>
          {previewUrl ? (
            <iframe src={previewUrl} title="Aperçu du contrat" className="block h-full w-full overflow-x-hidden border-0" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-[var(--foreground)]/50">
              <p>Génération de l&apos;aperçu...</p>
            </div>
          )}
          {previewPending && previewUrl && (
            <div className="absolute right-3 top-3 rounded-full bg-[var(--foreground)]/80 px-3 py-1 text-xs text-white shadow">Mise à jour...</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageBreakToggle({ checked, onChange }: { checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]/70">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      Commencer sur une nouvelle page
    </label>
  );
}

function ClauseFields({
  number,
  index,
  count,
  clause,
  onChange,
  onMove,
  onRemove,
}: {
  number: string;
  index: number;
  count: number;
  clause: ClauseItem;
  onChange: (patch: Partial<ClauseItem>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-black/5 bg-[var(--background)] p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">
          Clause {number}
          {clause.special === "arrhes" && " — montant calculé automatiquement"}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
            title="Monter"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === count - 1}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
            title="Descendre"
          >
            ↓
          </button>
          {clause.special !== "arrhes" && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-red-700 hover:bg-red-100"
              title="Supprimer cette clause"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <PageBreakToggle checked={clause.pageBreak} onChange={(on) => onChange({ pageBreak: on })} />

      <label className="mb-1 mt-3 block text-xs text-[var(--foreground)]/50">Titre</label>
      <input
        value={clause.title}
        onChange={(e) => onChange({ title: e.target.value })}
        className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-medium"
      />

      {clause.special === "arrhes" ? (
        <>
          <label className="mb-1 block text-xs text-[var(--foreground)]/50">Libellé (le montant reste calculé automatiquement)</label>
          <textarea
            value={clause.body}
            onChange={(e) => onChange({ body: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </>
      ) : (
        <>
          <label className="mb-1 block text-xs text-[var(--foreground)]/50">
            Texte — une ligne = un paragraphe. Faites commencer une ligne par « - » pour une puce. Tarifs automatiques (suivent la grille) :{" {{chapiteau}}, {{cuisine_min}}, {{cuisine_max}}, {{vaisselle_min}}, {{vaisselle_max}}, {{lendemain_min}}, {{lendemain_max}}, {{piscine_min}}, {{piscine_max}}, {{salle_min}}, {{salle_31dec}}."}
          </label>
          <textarea
            value={clause.body}
            onChange={(e) => onChange({ body: e.target.value })}
            rows={Math.min(16, Math.max(3, clause.body.split("\n").length + 1))}
            className="w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs leading-relaxed"
          />
        </>
      )}
    </div>
  );
}
