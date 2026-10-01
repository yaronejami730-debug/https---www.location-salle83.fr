"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost, togglePublished, reorderPosts } from "./actions";
import type { BlogPost } from "@/lib/blog";

export function PostList({ posts }: { posts: BlogPost[] }) {
  const [pending, startTransition] = useTransition();

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= posts.length) return;
    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(() => reorderPosts(next.map((p) => p.id)));
  }

  function remove(post: BlogPost) {
    if (!confirm(`Supprimer « ${post.title} » ? Ses photos seront également supprimées.`)) return;
    startTransition(() => deletePost(post.id));
  }

  if (posts.length === 0) {
    return <p className="text-sm text-[var(--foreground)]/50">Aucun article pour le moment.</p>;
  }

  return (
    <div className="space-y-3">
      {posts.map((post, i) => (
        <div key={post.id} className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-[var(--background)] p-5">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
                title="Monter"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === posts.length - 1 || pending}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-[var(--foreground)]/70 hover:bg-black/10 disabled:opacity-20"
                title="Descendre"
              >
                ↓
              </button>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">{post.title}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                  post.published ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-black/5 text-[var(--foreground)]/50"
                }`}
              >
                {post.published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs">
            <Link href={`/admin/blog/${post.id}`} className="text-[var(--accent)] hover:underline">
              Modifier
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => togglePublished(post.id, !post.published))}
              className="text-[var(--accent)] hover:underline disabled:opacity-50"
            >
              {post.published ? "Dépublier" : "Publier"}
            </button>
            <button type="button" disabled={pending} onClick={() => remove(post)} className="text-red-600 hover:underline disabled:opacity-50">
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
