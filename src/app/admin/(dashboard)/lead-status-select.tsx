"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "./actions";

const statusOptions = ["nouveau", "contacte", "converti", "perdu"];

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateLeadStatus(id, e.target.value))}
      className="rounded-lg border border-black/10 px-2 py-1.5 text-xs disabled:opacity-50"
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
