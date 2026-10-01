"use client";

import { useState } from "react";
import { submitReview } from "./actions";

export function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitReview({ author, rating, text });
      setStatus("success");
      setAuthor("");
      setText("");
      setRating(5);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/5 bg-[var(--background-muted)] p-8 text-center">
        <p className="font-serif text-xl text-[var(--foreground)]">Merci pour votre avis !</p>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          Il sera publié sur le site après relecture par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
      <div>
        <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Votre nom</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          minLength={2}
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Votre note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} étoiles`}
              className={`text-2xl transition-colors ${n <= rating ? "text-[var(--accent)]" : "text-black/15"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Votre avis</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          minLength={10}
          rows={5}
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Une erreur est survenue, merci de réessayer.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi..." : "Envoyer mon avis"}
      </button>
    </form>
  );
}
