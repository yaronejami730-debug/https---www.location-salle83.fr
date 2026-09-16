"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { EditableText } from "../editable-text";
import { savePageContent } from "../actions";
import { uploadPhoto, deletePhoto, reorderPhotos, replacePhoto } from "../../(dashboard)/photos/actions";
import type { PageSchema } from "@/lib/page-schemas";
import { pricingBrackets } from "@/lib/pricing";
import { mediaUrl } from "@/lib/supabase-public";
import { AmenityIcon } from "@/components/amenity-icon";
import { LocationMap } from "@/components/location-map";

const amenityIcons = ["wifi", "parking", "pool", "paw", "child", "restaurant", "kitchen", "fitness"] as const;

type MediaRow = { id: string; storage_path: string; alt: string | null; page: string; sort_order: number };
type FaqRow = { id: string; question: string; answer: string };
type ReviewRow = { id: string; author: string; rating: number; text: string };

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}

function ManagedBadge({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white hover:bg-black/80"
    >
      {label} →
    </Link>
  );
}

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

function EditablePhotoGrid({ photos, page, aspect = "aspect-square" }: { photos: MediaRow[]; page: string; aspect?: string }) {
  const [pending, startTransition] = useTransition();
  const [order, setOrder] = useState(photos);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragging = dragId !== null;

  useEffect(() => {
    if (!dragging) setOrder(photos);
  }, [photos, dragging]);

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

export function PageEditor({
  schema,
  initialContent,
  initialSeoTitle,
  initialSeoDescription,
  faqs,
  reviews,
  media,
  hebergementMedia,
  zigzagMedia,
}: {
  schema: PageSchema;
  initialContent: Record<string, string>;
  initialSeoTitle: string;
  initialSeoDescription: string;
  faqs: FaqRow[];
  reviews: ReviewRow[];
  media: MediaRow[];
  hebergementMedia: MediaRow[];
  zigzagMedia: Record<string, MediaRow[]>;
}) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription);
  const [seoOpen, setSeoOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const def = (key: string) => schema.fields.find((f) => f.key === key)?.default ?? "";
  const val = (key: string) => content[key] ?? def(key);
  const set = (key: string) => (v: string) => setContent((prev) => ({ ...prev, [key]: v }));

  function save() {
    startTransition(async () => {
      await savePageContent(schema.slug, content, { title: seoTitle, description: seoDescription });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 z-40 h-1.5 bg-[var(--accent)]" />

      <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2">
        {toolbarOpen ? (
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[var(--background)]/95 px-2 py-1.5 shadow-lg backdrop-blur">
            <Link href="/admin/pages" className="rounded-full px-2.5 py-1.5 text-xs text-[var(--foreground)]/60 hover:bg-black/5" title="Toutes les pages">
              ←
            </Link>
            <span className="flex items-center gap-1.5 pr-1 text-xs font-medium text-[var(--foreground)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              Mode édition — {schema.label}
            </span>
            <button
              type="button"
              onClick={() => setSeoOpen((v) => !v)}
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)]/70 hover:bg-black/5"
            >
              SEO
            </button>
            <Link
              href={schema.slug === "home" ? "/" : `/${schema.slug}`}
              target="_blank"
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)]/70 hover:bg-black/5"
            >
              Site ↗
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs text-white hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "..." : saved ? "✓" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setToolbarOpen(false)}
              className="rounded-full px-2 py-1.5 text-xs text-[var(--foreground)]/40 hover:bg-black/5"
              title="Masquer la barre"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setToolbarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
            title="Afficher la barre d'édition"
          >
            ✎
          </button>
        )}

        {seoOpen && (
          <div className="w-80 rounded-2xl border border-black/10 bg-[var(--background)] p-4 shadow-lg">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/50">SEO</p>
            <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Titre</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mb-3 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
            <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Meta description</label>
            <input
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {schema.slug === "home" && (
        <>
          <section className="relative flex min-h-[90vh] items-center justify-center text-center">
            <div className="absolute inset-0 overflow-hidden">
              <Image src="/images/home-hero.jpg" alt="" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-black/45" />
            </div>
            <Container className="relative z-10 flex flex-col items-center px-4">
              <EditableText
                as="h1"
                value={val("hero_title")}
                onChange={set("hero_title")}
                className="max-w-4xl font-serif text-5xl leading-[1.1] text-white sm:text-7xl"
              />
              <EditableText
                value={val("hero_accent")}
                onChange={set("hero_accent")}
                className="mt-2 font-script text-5xl leading-none text-white sm:text-6xl"
              />
              <EditableText
                value={val("hero_description")}
                onChange={set("hero_description")}
                className="mt-8 max-w-xl text-base text-white/85"
              />
            </Container>
            <div className="absolute bottom-0 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-1/2 items-center rounded-full bg-[var(--accent)] px-10 py-4 text-sm tracking-wide text-white shadow-lg">
              <EditableText value={val("hero_cta")} onChange={set("hero_cta")} className="text-white" />
            </div>
          </section>

          <section className="pt-24 pb-16 sm:pt-28">
            <Container className="max-w-2xl text-center">
              <EditableText as="h2" value={val("lieu_title")} onChange={set("lieu_title")} className="font-serif text-3xl text-[var(--foreground)]" />
              <EditableText value={val("lieu_text")} onChange={set("lieu_text")} className="mt-5 text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16 bg-[var(--background-muted)]">
            <Container className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--background)] p-8">
                <EditableText as="h3" value={val("mariage_card_title")} onChange={set("mariage_card_title")} className="font-serif text-2xl" />
                <EditableText value={val("mariage_card_text")} onChange={set("mariage_card_text")} className="mt-3 text-sm text-[var(--foreground)]/70" />
              </div>
              <div className="rounded-2xl bg-[var(--background)] p-8">
                <EditableText as="h3" value={val("seminaire_card_title")} onChange={set("seminaire_card_title")} className="font-serif text-2xl" />
                <EditableText value={val("seminaire_card_text")} onChange={set("seminaire_card_text")} className="mt-3 text-sm text-[var(--foreground)]/70" />
              </div>
            </Container>
          </section>

          <section className="py-16">
            <Container>
              <EditableText as="h2" value={val("stats_title")} onChange={set("stats_title")} className="text-center font-serif text-3xl text-[var(--foreground)]" />
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="text-center">
                    <EditableText value={val(`stat${n}_value`)} onChange={set(`stat${n}_value`)} className="font-serif text-3xl text-[var(--accent)]" />
                    <EditableText value={val(`stat${n}_label`)} onChange={set(`stat${n}_label`)} className="mt-1 text-sm text-[var(--foreground)]/60" />
                  </div>
                ))}
              </div>
            </Container>
          </section>

          <section className="relative py-16 bg-[var(--background-muted)]">
            <Container>
              <EditableText as="h2" value={val("galerie_title")} onChange={set("galerie_title")} className="font-serif text-3xl text-[var(--foreground)]" />
              <div className="mt-8">
                <EditablePhotoGrid photos={media} page="galerie" aspect="aspect-[4/3]" />
              </div>
            </Container>
          </section>

          <section className="py-16">
            <Container className="grid items-center gap-8 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                {hebergementMedia[0] && <Image src={mediaUrl(hebergementMedia[0].storage_path)} alt="" fill className="object-cover" sizes="500px" />}
              </div>
              <div>
                <EditableText as="h2" value={val("hebergement_title")} onChange={set("hebergement_title")} className="font-serif text-3xl text-[var(--foreground)]" />
                <EditableText value={val("hebergement_text")} onChange={set("hebergement_text")} className="mt-4 text-[var(--foreground)]/70" />
              </div>
            </Container>
          </section>

          <section className="relative py-16">
            <ManagedBadge label="Gérer les avis" href="/admin/avis" />
            <Container>
              <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--foreground)]/40">Ils nous ont fait confiance</p>
              <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-5">
                {(reviews.length > 0 ? reviews : [{ id: "x", author: "Exemple", rating: 5, text: "Aucun avis publié pour le moment." }])
                  .slice(0, 6)
                  .map((r) => (
                    <div key={r.id} className="w-full rounded-xl border border-black/5 bg-[var(--background-muted)]/60 p-5 sm:w-[calc(33.333%-14px)]">
                      <p className="text-xs text-[var(--accent-warm)]">{"★".repeat(r.rating)}</p>
                      <p className="mt-2 line-clamp-4 text-sm text-[var(--foreground)]/60">{r.text}</p>
                      <p className="mt-3 text-xs font-medium text-[var(--foreground)]/70">{r.author}</p>
                    </div>
                  ))}
              </div>
            </Container>
          </section>

          <section className="relative py-16 bg-[var(--background-muted)]">
            <ManagedBadge label="Gérer la FAQ" href="/admin/faq" />
            <Container>
              <EditableText as="h2" value={val("faq_title")} onChange={set("faq_title")} className="text-center font-serif text-3xl text-[var(--foreground)]" />
              <div className="mx-auto mt-8 max-w-2xl divide-y divide-black/5">
                {(faqs.length > 0 ? faqs : [{ id: "x", question: "Aucune question publiée pour le moment", answer: "Ajoutez-en dans l'onglet FAQ." }]).map((fq) => (
                  <div key={fq.id} className="py-4">
                    <p className="font-medium text-[var(--foreground)]">{fq.question}</p>
                    <p className="mt-2 text-sm text-[var(--foreground)]/70">{fq.answer}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          <section className="py-20 text-center">
            <Container className="max-w-xl">
              <EditableText as="h2" value={val("cta_title")} onChange={set("cta_title")} className="font-serif text-3xl text-[var(--foreground)]" />
              <EditableText value={val("cta_text")} onChange={set("cta_text")} className="mt-4 text-[var(--foreground)]/70" />
              <span className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm text-white">
                <EditableText value={val("cta_button")} onChange={set("cta_button")} className="text-white" />
              </span>
            </Container>
          </section>
        </>
      )}

      {schema.slug === "mariage" && (
        <>
          <section className="relative flex h-[45vh] min-h-[360px] items-center justify-center overflow-hidden text-center">
            <Image src="/images/mariage-hero.jpg" alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/45" />
            <Container className="relative z-10 max-w-2xl">
              <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-white" />
              <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-white/85" />
            </Container>
          </section>

          <section className="py-16 text-center">
            <Container className="max-w-2xl">
              <span className="mx-auto block h-px w-12 bg-[var(--accent-warm)]/50" />
              <EditableText as="h2" value={val("intro_title")} onChange={set("intro_title")} className="mt-5 font-display text-3xl italic text-[var(--accent-warm)]" />
              <EditableText value={val("intro_text")} onChange={set("intro_text")} className="mt-5 whitespace-pre-line text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16">
            <Container className="grid gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl bg-[var(--background-muted)] p-6">
                  <EditableText as="h3" value={val(`feature${n}_title`)} onChange={set(`feature${n}_title`)} className="font-serif text-xl text-[var(--foreground)]" />
                  <EditableText value={val(`feature${n}_text`)} onChange={set(`feature${n}_text`)} className="mt-3 text-sm text-[var(--foreground)]/70" />
                </div>
              ))}
            </Container>
          </section>

          {[1, 2, 3].map((n) => {
            const category = `mariage-zigzag-${n}`;
            return (
              <section key={n} className="py-14 bg-[var(--background-muted)]/40">
                <Container>
                  <div className={`grid items-start gap-10 sm:grid-cols-2 ${n % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"}`}>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-[var(--accent)]">Photo(s) de ce bloc (fondu si plusieurs)</p>
                        <select
                          value={val(`zigzag${n}_interval`)}
                          onChange={(e) => set(`zigzag${n}_interval`)(e.target.value)}
                          className="rounded-md border border-black/10 bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)]/70"
                        >
                          <option value="4">Fondu 4s</option>
                          <option value="6">Fondu 6s</option>
                          <option value="8">Fondu 8s</option>
                        </select>
                      </div>
                      <EditablePhotoGrid photos={zigzagMedia[category] ?? []} page={category} aspect="aspect-[4/3]" />
                    </div>
                    <div>
                      <EditableText as="h2" value={val(`zigzag${n}_title`)} onChange={set(`zigzag${n}_title`)} className="font-display text-3xl italic text-[var(--accent-warm)]" />
                      <EditableText value={val(`zigzag${n}_text`)} onChange={set(`zigzag${n}_text`)} className="mt-4 whitespace-pre-line text-[var(--foreground)]/70" />
                      {n === 3 && (
                        <span className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white opacity-90">
                          Réserver un hébergement ↗
                        </span>
                      )}
                    </div>
                  </div>
                </Container>
              </section>
            );
          })}
        </>
      )}

      {schema.slug === "seminaire" && (
        <>
          <section className="flex h-[45vh] min-h-[360px] items-center justify-center bg-[var(--background-muted)] text-center">
            <Container className="max-w-2xl">
              <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-[var(--foreground)]" />
              <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16 text-center">
            <Container className="max-w-2xl">
              <span className="mx-auto block h-px w-12 bg-[var(--accent-warm)]/50" />
              <EditableText as="h2" value={val("intro_title")} onChange={set("intro_title")} className="mt-5 font-display text-3xl italic text-[var(--accent-warm)]" />
              <EditableText value={val("intro_text")} onChange={set("intro_text")} className="mt-5 whitespace-pre-line text-[var(--foreground)]/70" />
            </Container>
          </section>

          {[1, 2, 3].map((n) => {
            const category = `seminaire-zigzag-${n}`;
            return (
              <section key={n} className="py-14 bg-[var(--background-muted)]/40">
                <Container>
                  <div className={`grid items-start gap-10 sm:grid-cols-2 ${n % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"}`}>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-[var(--accent)]">Photo(s) de ce bloc (fondu si plusieurs)</p>
                        <select
                          value={val(`feature${n}_interval`)}
                          onChange={(e) => set(`feature${n}_interval`)(e.target.value)}
                          className="rounded-md border border-black/10 bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)]/70"
                        >
                          <option value="4">Fondu 4s</option>
                          <option value="6">Fondu 6s</option>
                          <option value="8">Fondu 8s</option>
                        </select>
                      </div>
                      <EditablePhotoGrid photos={zigzagMedia[category] ?? []} page={category} aspect="aspect-[4/3]" />
                    </div>
                    <div>
                      <EditableText as="h2" value={val(`feature${n}_title`)} onChange={set(`feature${n}_title`)} className="font-display text-3xl italic text-[var(--accent-warm)]" />
                      <EditableText value={val(`feature${n}_text`)} onChange={set(`feature${n}_text`)} className="mt-4 whitespace-pre-line text-[var(--foreground)]/70" />
                    </div>
                  </div>
                </Container>
              </section>
            );
          })}
        </>
      )}

      {schema.slug === "evenements" && (
        <>
          <section className="bg-[var(--background-muted)] py-16 text-center">
            <Container className="max-w-2xl">
              <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-[var(--foreground)]" />
              <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16">
            <Container className="max-w-2xl">
              <EditableText value={val("intro_text")} onChange={set("intro_text")} className="whitespace-pre-line text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16">
            <Container className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-xl bg-[var(--background-muted)] px-4 py-6 text-center">
                  <EditableText value={val(`event${n}`)} onChange={set(`event${n}`)} className="text-sm text-[var(--foreground)]" />
                </div>
              ))}
            </Container>
          </section>

          <section className="py-16 bg-[var(--background-muted)]">
            <Container>
              <EditableText as="h2" value={val("pricing_title")} onChange={set("pricing_title")} className="text-center font-serif text-3xl text-[var(--foreground)]" />
              <EditableText value={val("pricing_note")} onChange={set("pricing_note")} className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70" />
              <div className="mt-8 overflow-x-auto rounded-2xl border border-black/5 bg-[var(--background)]">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-left text-[var(--foreground)]/60">
                      <th className="px-4 py-3 font-medium">Personnes</th>
                      <th className="px-4 py-3 font-medium">La salle</th>
                      <th className="px-4 py-3 font-medium">Lendemain</th>
                      <th className="px-4 py-3 font-medium">Piscine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingBrackets.map((row) => (
                      <tr key={row.key} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">{row.label}</td>
                        <td className="px-4 py-3 text-[var(--foreground)]/80">{row.salle} €</td>
                        <td className="px-4 py-3 text-[var(--foreground)]/80">{row.lendemain} €</td>
                        <td className="px-4 py-3 text-[var(--foreground)]/80">{row.piscine} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--foreground)]/40">
                Tarifs non éditables ici — partagés avec le calculateur devis du formulaire de contact.
              </p>
            </Container>
          </section>
        </>
      )}

      {["domaine", "hebergement", "contact"].includes(schema.slug) && (
        <>
          <section className="bg-[var(--background-muted)] py-16 text-center">
            <Container className="max-w-2xl">
              <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-[var(--foreground)]" />
              <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-[var(--foreground)]/70" />
            </Container>
          </section>

          {schema.slug === "domaine" && (
            <section className="py-16">
              <Container>
                <p className="mb-2 text-xs font-medium text-[var(--accent)]">Photo piscine (bannière)</p>
                <EditablePhotoGrid photos={zigzagMedia["domaine-pool"] ?? []} page="domaine-pool" aspect="aspect-[16/9]" />
              </Container>
            </section>
          )}

          {schema.slug === "domaine" && (
            <section className="py-16">
              <Container className="max-w-xl">
                <p className="mb-2 text-xs font-medium text-[var(--accent)]">Photo mise en avant</p>
                <EditablePhotoGrid photos={zigzagMedia["domaine-featured"] ?? []} page="domaine-featured" aspect="aspect-[3/4]" />
                <EditableText
                  value={val("featured_caption")}
                  onChange={set("featured_caption")}
                  className="mt-5 text-center font-display text-2xl italic text-[var(--accent-warm)]"
                />
              </Container>
            </section>
          )}

          {schema.slug === "domaine" && (
            <section className="py-16">
              <Container className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl bg-[var(--background-muted)] p-6">
                    <EditableText as="h3" value={val(`feature${n}_title`)} onChange={set(`feature${n}_title`)} className="font-serif text-xl text-[var(--foreground)]" />
                    <EditableText value={val(`feature${n}_text`)} onChange={set(`feature${n}_text`)} className="mt-3 text-sm text-[var(--foreground)]/70" />
                  </div>
                ))}
              </Container>
            </section>
          )}

          {schema.slug !== "contact" && (
            <section className="py-16">
              <Container>
                <EditablePhotoGrid
                  photos={schema.slug === "hebergement" ? hebergementMedia : media}
                  page={schema.slug}
                  aspect="aspect-[4/3]"
                />
              </Container>
            </section>
          )}

          {schema.slug === "domaine" && (
            <>
              <section className="py-16 bg-[var(--background-muted)]">
                <Container>
                  <EditableText as="h2" value={val("amenities_title")} onChange={set("amenities_title")} className="text-center font-serif text-2xl text-[var(--foreground)]" />
                  <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                    {amenityIcons.map((icon, i) => (
                      <div key={icon} className="flex flex-col items-center gap-2 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)]">
                          <AmenityIcon name={icon} />
                        </span>
                        <EditableText value={val(`amenity${i + 1}`)} onChange={set(`amenity${i + 1}`)} className="text-xs text-[var(--foreground)]/70" />
                      </div>
                    ))}
                  </div>
                </Container>
              </section>

              <section className="py-16">
                <Container>
                  <p className="mb-3 text-xs text-[var(--foreground)]/40">Carte non éditable — coordonnées fixées dans le code.</p>
                  <LocationMap />
                </Container>
              </section>
            </>
          )}

          {schema.slug === "contact" && (
            <section className="py-16">
              <Container className="max-w-md text-center text-sm text-[var(--foreground)]/50">
                Le formulaire de devis (options, calcul, envoi) s&apos;affiche ici sur le site — non éditable visuellement, structure fixe.
              </Container>
            </section>
          )}
        </>
      )}

      {schema.slug === "galerie" && (
        <>
          <section className="bg-[var(--background-muted)] py-16 text-center">
            <Container className="max-w-2xl">
              <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-[var(--foreground)]" />
              <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-[var(--foreground)]/70" />
            </Container>
          </section>

          <section className="py-16">
            <Container>
              <EditableText as="h2" value={val("events_title")} onChange={set("events_title")} className="font-serif text-2xl text-[var(--foreground)]" />
              <div className="mt-6">
                <EditablePhotoGrid photos={media} page="galerie" />
              </div>
            </Container>
          </section>

          <section className="pb-16">
            <Container>
              <EditableText as="h2" value={val("hebergement_title")} onChange={set("hebergement_title")} className="font-serif text-2xl text-[var(--foreground)]" />
              <div className="mt-6">
                <EditablePhotoGrid photos={hebergementMedia} page="hebergement" />
              </div>
            </Container>
          </section>
        </>
      )}
    </div>
  );
}
