"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CONTRACT_CLAUSES, CLAUSE7_DEFAULTS, pageBreakKey } from "@/lib/contract-template";
import { saveContractContent, previewContractPdf } from "./actions";

const AUTO_PREVIEW_DELAY_MS = 900;

export function ContractEditor({ initialContent }: { initialContent: Record<string, string> }) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);
  const [savePending, startSave] = useTransition();
  const [previewPending, startPreview] = useTransition();
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const val = (key: string, fallback: string) => content[key] ?? fallback;
  const breakOf = (blockKey: string) => content[pageBreakKey(blockKey)] === "1";
  const setBreak = (blockKey: string) => (on: boolean) => setContent((prev) => ({ ...prev, [pageBreakKey(blockKey)]: on ? "1" : "" }));
  const set = (key: string) => (v: string) => setContent((prev) => ({ ...prev, [key]: v }));

  function save() {
    startSave(async () => {
      await saveContractContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function refreshPreview(target: Record<string, string>) {
    startPreview(async () => {
      const base64 = await previewContractPdf(target);
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
    debounceRef.current = setTimeout(() => refreshPreview(content), AUTO_PREVIEW_DELAY_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content]);

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
            onClick={() => refreshPreview(content)}
            disabled={previewPending}
            className="rounded-full border border-black/10 px-5 py-2 text-sm text-[var(--foreground)]/70 hover:bg-black/5 disabled:opacity-50"
          >
            {previewPending ? "Mise à jour..." : "Forcer l'aperçu"}
          </button>
          <span className="text-xs text-[var(--foreground)]/40">L&apos;aperçu se met à jour automatiquement</span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Clause 1 — Événement et tarifs (calculée)</p>
          <PageBreakToggle checked={breakOf("clause1")} onChange={setBreak("clause1")} />
        </div>

        {CONTRACT_CLAUSES.slice(0, 5).map((c) => (
          <ClauseFields key={c.key} number={c.number} pageBreak={breakOf(c.key)} onPageBreak={setBreak(c.key)} title={val(c.titleKey, c.titleDefault)} onTitle={set(c.titleKey)} body={val(c.bodyKey, c.bodyDefault)} onBody={set(c.bodyKey)} />
        ))}

        <div className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Clause 7</p>
          <PageBreakToggle checked={breakOf("clause7")} onChange={setBreak("clause7")} />
          <label className="mb-1 mt-3 block text-xs text-[var(--foreground)]/50">Titre</label>
          <input
            value={val(CLAUSE7_DEFAULTS.titleKey, CLAUSE7_DEFAULTS.titleDefault)}
            onChange={(e) => set(CLAUSE7_DEFAULTS.titleKey)(e.target.value)}
            className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-medium"
          />
          <label className="mb-1 block text-xs text-[var(--foreground)]/50">Libellé (le montant reste calculé automatiquement)</label>
          <textarea
            value={val(CLAUSE7_DEFAULTS.labelKey, CLAUSE7_DEFAULTS.labelDefault)}
            onChange={(e) => set(CLAUSE7_DEFAULTS.labelKey)(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        {CONTRACT_CLAUSES.slice(5).map((c) => (
          <ClauseFields key={c.key} number={c.number} pageBreak={breakOf(c.key)} onPageBreak={setBreak(c.key)} title={val(c.titleKey, c.titleDefault)} onTitle={set(c.titleKey)} body={val(c.bodyKey, c.bodyDefault)} onBody={set(c.bodyKey)} />
        ))}

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
  title,
  onTitle,
  body,
  onBody,
  pageBreak,
  onPageBreak,
}: {
  number: string;
  pageBreak: boolean;
  onPageBreak: (on: boolean) => void;
  title: string;
  onTitle: (v: string) => void;
  body: string;
  onBody: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-[var(--background)] p-5">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Clause {number}</p>
      <PageBreakToggle checked={pageBreak} onChange={onPageBreak} />
      <label className="mb-1 mt-3 block text-xs text-[var(--foreground)]/50">Titre</label>
      <input value={title} onChange={(e) => onTitle(e.target.value)} className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-medium" />
      <label className="mb-1 block text-xs text-[var(--foreground)]/50">
        Texte — une ligne = un paragraphe. Faites commencer une ligne par « - » pour une puce.
      </label>
      <textarea value={body} onChange={(e) => onBody(e.target.value)} rows={Math.min(16, Math.max(3, body.split("\n").length + 1))} className="w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs leading-relaxed" />
    </div>
  );
}
