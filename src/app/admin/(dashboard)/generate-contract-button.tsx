"use client";

import { useState, useTransition } from "react";
import { generateContractPdf } from "./actions";
import { leadReference } from "@/lib/lead-reference";

export function GenerateContractButton({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false);
  const [eventDateOverride, setEventDateOverride] = useState("");
  const [pending, startTransition] = useTransition();

  function download() {
    startTransition(async () => {
      const { base64, filename } = await generateContractPdf(leadId, { eventDateOverride });
      const bytes = atob(base64);
      const array = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
      const blob = new Blob([array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <div className="flex gap-2">
        <a
          href={`/api/contrat/${leadReference(leadId)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-black/5"
        >
          Voir le PDF
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-black/5"
        >
          Générer PDF
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 space-y-2 rounded-lg border border-black/10 bg-[var(--background-muted)] p-3">
      <input
        type="date"
        placeholder="Date (optionnel)"
        value={eventDateOverride}
        onChange={(e) => setEventDateOverride(e.target.value)}
        className="w-full rounded-md border border-black/10 px-2 py-1.5 text-xs"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={download}
          className="flex-1 rounded-md bg-[var(--accent)] px-2 py-1.5 text-xs text-white disabled:opacity-60"
        >
          {pending ? "Génération…" : "Télécharger"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-black/10 px-2 py-1.5 text-xs text-[var(--foreground)]"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
