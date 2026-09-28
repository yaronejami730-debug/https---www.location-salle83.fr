"use client";

import { useTransition } from "react";
import { updateLeadEndDate, sendDepartureEmailNow } from "./actions";

export function LeadEndDate({
  id,
  endDate,
  departureEmailSentAt,
}: {
  id: string;
  endDate: string | null;
  departureEmailSentAt: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-1">
      <input
        type="date"
        defaultValue={endDate ?? ""}
        disabled={pending}
        onChange={(e) => startTransition(() => updateLeadEndDate(id, e.target.value))}
        className="rounded-lg border border-black/10 px-2 py-1.5 text-xs disabled:opacity-50"
      />
      {endDate &&
        (departureEmailSentAt ? (
          <span className="text-[10px] text-[var(--foreground)]/50">Mail poubelles envoyé</span>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => sendDepartureEmailNow(id))}
            className="text-left text-[10px] text-[var(--accent)] hover:underline disabled:opacity-50"
          >
            Envoyer le mail poubelles maintenant
          </button>
        ))}
    </div>
  );
}
