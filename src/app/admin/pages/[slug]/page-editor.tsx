"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { EditableText } from "../editable-text";
import { savePageContent } from "../actions";
import type { PageSchema } from "@/lib/page-schemas";
import { staticGalleryPhotos, staticHebergementPhotos } from "@/lib/static-gallery";
import { pricingBrackets } from "@/lib/pricing";
import { mediaUrl } from "@/lib/supabase-public";

type MediaRow = { id: string; storage_path: string; alt: string | null };
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

export function PageEditor({
  schema,
  initialContent,
  initialSeoTitle,
  initialSeoDescription,
  faqs,
  reviews,
  media,
}: {
  schema: PageSchema;
  initialContent: Record<string, string>;
  initialSeoTitle: string;
  initialSeoDescription: string;
  faqs: FaqRow[];
  reviews: ReviewRow[];
  media: MediaRow[];
}) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription);
  const [seoOpen, setSeoOpen] = useState(false);
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

  const galleryPhotos = media.length > 0 ? media.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" })) : staticGalleryPhotos;

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 -mx-10 -mt-10 mb-8 flex items-center justify-between border-b border-black/5 bg-[var(--background)]/95 px-10 py-4 backdrop-blur">
        <div>
          <Link href="/admin/pages" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--accent)]">
            ← Toutes les pages
          </Link>
          <p className="font-serif text-lg text-[var(--foreground)]">{schema.label}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSeoOpen((v) => !v)}
            className="rounded-full border border-black/10 px-4 py-2 text-xs text-[var(--foreground)]/70 hover:bg-black/5"
          >
            SEO
          </button>
          <Link
            href={schema.slug === "home" ? "/" : `/${schema.slug}`}
            target="_blank"
            className="rounded-full border border-black/10 px-4 py-2 text-xs text-[var(--foreground)]/70 hover:bg-black/5"
          >
            Voir sur le site ↗
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      </div>

      {seoOpen && (
        <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-black/10 bg-[var(--background-muted)] p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/50">Référencement (SEO)</p>
          <label className="mb-1.5 block text-xs text-[var(--foreground)]/60">Titre SEO</label>
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

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)]">
        {schema.slug === "home" && (
          <>
            <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center">
              <Image src="/images/mariage-hero.jpg" alt="" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-black/50" />
              <Container className="relative z-10 flex flex-col items-center py-20">
                <EditableText
                  as="h1"
                  value={val("hero_title")}
                  onChange={set("hero_title")}
                  className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl"
                />
                <EditableText
                  value={val("hero_description")}
                  onChange={set("hero_description")}
                  className="mt-6 max-w-xl text-base text-white/85"
                />
              </Container>
            </section>

            <section className="py-16">
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
                <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <ManagedBadge label="Gérer les photos" href="/admin/photos" />
                  {galleryPhotos.slice(0, 6).map((p) => (
                    <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="300px" />
                    </div>
                  ))}
                </div>
              </Container>
            </section>

            <section className="py-16">
              <Container className="grid items-center gap-8 sm:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={staticHebergementPhotos[0].src} alt="" fill className="object-cover" sizes="500px" />
                </div>
                <div>
                  <EditableText as="h2" value={val("hebergement_title")} onChange={set("hebergement_title")} className="font-serif text-3xl text-[var(--foreground)]" />
                  <EditableText value={val("hebergement_text")} onChange={set("hebergement_text")} className="mt-4 text-[var(--foreground)]/70" />
                </div>
              </Container>
            </section>

            <section className="relative py-16 bg-[var(--background-muted)]">
              <ManagedBadge label="Gérer les avis" href="/admin/avis" />
              <Container>
                <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">Avis</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {(reviews.length > 0 ? reviews : [{ id: "x", author: "Exemple", rating: 5, text: "Aucun avis publié pour le moment." }])
                    .slice(0, 3)
                    .map((r) => (
                      <div key={r.id} className="rounded-2xl bg-[var(--background)] p-5">
                        <p className="text-[var(--accent)]">{"★".repeat(r.rating)}</p>
                        <p className="mt-2 text-sm text-[var(--foreground)]/70">{r.text}</p>
                        <p className="mt-3 text-sm font-medium text-[var(--foreground)]">{r.author}</p>
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

        {["mariage", "seminaire"].includes(schema.slug) && (
          <>
            <section className="relative flex h-[45vh] min-h-[360px] items-center justify-center overflow-hidden text-center">
              {schema.slug === "mariage" && <Image src="/images/mariage-hero.jpg" alt="" fill className="object-cover" sizes="100vw" />}
              {schema.slug === "seminaire" && <div className="absolute inset-0 bg-[var(--background-muted)]" />}
              {schema.slug === "mariage" && <div className="absolute inset-0 bg-black/45" />}
              <Container className="relative z-10 max-w-2xl">
                <EditableText
                  as="h1"
                  value={val("hero_title")}
                  onChange={set("hero_title")}
                  className={`font-serif text-4xl ${schema.slug === "mariage" ? "text-white" : "text-[var(--foreground)]"}`}
                />
                <EditableText
                  value={val("hero_description")}
                  onChange={set("hero_description")}
                  className={`mt-4 ${schema.slug === "mariage" ? "text-white/85" : "text-[var(--foreground)]/70"}`}
                />
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

            {schema.slug === "mariage" && (
              <section className="py-12 bg-[var(--background-muted)]">
                <Container className="grid gap-4 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
                  ))}
                </Container>
              </section>
            )}
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

        {["domaine", "hebergement", "galerie", "contact"].includes(schema.slug) && (
          <>
            <section className="bg-[var(--background-muted)] py-16 text-center">
              <Container className="max-w-2xl">
                <EditableText as="h1" value={val("hero_title")} onChange={set("hero_title")} className="font-serif text-4xl text-[var(--foreground)]" />
                <EditableText value={val("hero_description")} onChange={set("hero_description")} className="mt-4 text-[var(--foreground)]/70" />
              </Container>
            </section>

            {schema.slug !== "contact" && (
              <section className="relative py-16">
                <ManagedBadge label="Gérer les photos" href="/admin/photos" />
                <Container className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(schema.slug === "hebergement" ? staticHebergementPhotos : schema.slug === "galerie" ? staticGalleryPhotos : galleryPhotos)
                    .slice(0, 6)
                    .map((p) => (
                      <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="300px" />
                      </div>
                    ))}
                </Container>
              </section>
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
      </div>
    </div>
  );
}
