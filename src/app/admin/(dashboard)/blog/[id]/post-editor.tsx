"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { EditableText } from "../../../pages/editable-text";
import { updatePost, deletePost, togglePublished } from "../actions";
import { uploadPhoto, deletePhoto, reorderPhotos, replacePhoto } from "../../photos/actions";
import { mediaUrl } from "@/lib/supabase-public";
import type { BlogPost } from "@/lib/blog";

type MediaRow = { id: string; storage_path: string; alt: string | null; page: string; sort_order: number };

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      {[2, 7, 12].flatMap((cy) => [3, 7, 11].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" />))}
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

// Local copy of the admin photo grid widget (src/app/admin/pages/[slug]/page-editor.tsx
// defines its own, unexported version of this same component) — same calling
// convention, same underlying uploadPhoto/deletePhoto/reorderPhotos/replacePhoto
// actions, just not importable from that file.
function EditablePhotoGrid({ photos, page, aspect = "aspect-square" }: { photos: MediaRow[]; page: string; aspect?: string }) {
  const [pending, startTransition] = useTransition();
  const [order, setOrder] = useState(photos);
  const [prevPhotos, setPrevPhotos] = useState(photos);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragging = dragId !== null;

  if (photos !== prevPhotos && !dragging) {
    setPrevPhotos(photos);
    setOrder(photos);
  }

  function moveOver(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setOrder((current) => {
      const fromIndex = current.findIndex((p) => p.id === dragId);
      const toIndex = current.findIndex((p) => p.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function commitOrder() {
    if (dragId) startTransition(() => reorderPhotos(page, order.map((p) => p.id)));
    setDragId(null);
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {order.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => setDragId(p.id)}
          onDragOver={(e) => {
            e.preventDefault();
            moveOver(p.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            commitOrder();
          }}
          onDragEnd={commitOrder}
          className={`group relative ${aspect} overflow-hidden rounded-xl bg-black/5 transition-transform ${
            dragId === p.id ? "scale-95 opacity-50" : ""
          }`}
        >
          <Image src={mediaUrl(p.storage_path)} alt={p.alt ?? ""} fill className="object-cover" sizes="300px" />

          <div className="absolute left-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-md bg-black/70 text-white active:cursor-grabbing">
            <GripIcon />
          </div>

          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <label className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-black/70 text-white hover:bg-black/90">
              <PencilIcon />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.set("file", file);
                  startTransition(() => replacePhoto(p.id, p.storage_path, page, fd));
                }}
              />
            </label>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => deletePhoto(p.id, p.storage_path))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white hover:bg-red-600 disabled:opacity-30"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}

      <label
        className={`flex ${aspect} cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--accent)]/30 text-xs text-[var(--foreground)]/50 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]`}
      >
        <span className="text-xl leading-none">+</span>
        Ajouter des photos
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length === 0) return;
            startTransition(async () => {
              for (const file of files) {
                const fd = new FormData();
                fd.set("file", file);
                fd.set("page", page);
                await uploadPhoto(fd);
              }
            });
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export function PostEditor({ post, media }: { post: BlogPost; media: MediaRow[] }) {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [color, setColor] = useState(post.color);
  const [slug, setSlug] = useState(post.slug);
  const [published, setPublished] = useState(post.published);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [savePending, startSave] = useTransition();
  const [publishPending, startPublish] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug || !SLUG_RE.test(cleanSlug)) {
      setSlugError("Le slug doit être non vide : lettres minuscules, chiffres et tirets uniquement.");
      return;
    }
    setSlugError(null);
    startSave(async () => {
      await updatePost(post.id, { title, body, color, slug: cleanSlug });
      setSlug(cleanSlug);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function togglePublish() {
    const next = !published;
    setPublished(next);
    startPublish(() => togglePublished(post.id, next));
  }

  function remove() {
    if (!confirm(`Supprimer « ${post.title} » ? Ses photos seront également supprimées.`)) return;
    startSave(() => deletePost(post.id));
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/blog" className="text-sm text-[var(--foreground)]/60 hover:text-[var(--accent)]">
          ← Tous les articles
        </Link>
        <div className="flex items-center gap-3">
          <button type="button" disabled={savePending} onClick={remove} className="text-xs text-red-600 hover:underline disabled:opacity-50">
            Supprimer l&apos;article
          </button>
          <button
            type="button"
            onClick={save}
            disabled={savePending}
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            {savePending ? "..." : saved ? "✓ Enregistré" : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugError(null);
            }}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-[var(--foreground)]/40">/blog/{slug || "..."}</p>
          {slugError && <p className="mt-1 text-xs text-red-600">{slugError}</p>}
        </div>

        <div className="flex items-center gap-6">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Couleur</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-black/10 p-1" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Statut</label>
            <button
              type="button"
              disabled={publishPending}
              onClick={togglePublish}
              className={`rounded-full px-4 py-2 text-xs font-medium disabled:opacity-50 ${
                published ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-black/5 text-[var(--foreground)]/50"
              }`}
            >
              {published ? "Publié" : "Brouillon"}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Contenu</label>
          <EditableText value={body} onChange={setBody} className="min-h-[200px] rounded-lg border border-black/10 px-3 py-2.5 text-sm leading-relaxed" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">Photos</label>
          <EditablePhotoGrid photos={media} page={`blog-${post.id}`} aspect="aspect-[4/3]" />
        </div>
      </div>
    </div>
  );
}
