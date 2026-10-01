"use client";

import { useState, useTransition } from "react";
import { createPost } from "./actions";

export function NewPostForm() {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    startTransition(() => createPost(trimmed));
  }

  return (
    <form onSubmit={submit} className="flex gap-3 rounded-2xl border border-black/5 bg-[var(--background)] p-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du nouvel article"
        required
        className="flex-1 rounded-lg border border-black/10 px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "..." : "+ Nouvel article"}
      </button>
    </form>
  );
}
