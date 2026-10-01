"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing we can do, button just won't confirm
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-black/10 px-4 py-2 text-xs text-[var(--foreground)]/70 hover:bg-black/5"
    >
      {copied ? "✓ Lien copié" : "Copier le lien à partager"}
    </button>
  );
}
