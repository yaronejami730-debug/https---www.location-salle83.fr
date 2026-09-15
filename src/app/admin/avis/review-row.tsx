"use client";

import { useTransition } from "react";
import { deleteReview, toggleReviewPublished } from "./actions";

type Review = { id: string; author: string; rating: number; text: string; published: boolean };

export function ReviewRow({ review }: { review: Review }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-black/5 bg-[var(--background)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[var(--foreground)]">
            {review.author} <span className="text-[var(--accent)]">{"★".repeat(review.rating)}</span>
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">{review.text}</p>
        </div>
        <div className="flex shrink-0 gap-3 text-xs">
          <button
            disabled={pending}
            onClick={() => startTransition(() => toggleReviewPublished(review.id, !review.published))}
            className="text-[var(--accent)] hover:underline disabled:opacity-50"
          >
            {review.published ? "Masquer" : "Publier"}
          </button>
          <button
            disabled={pending}
            onClick={() => startTransition(() => deleteReview(review.id))}
            className="text-red-600 hover:underline disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
