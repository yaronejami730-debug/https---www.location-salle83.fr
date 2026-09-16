import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { LogoMarquee } from "@/components/logo-marquee";
import { Reveal } from "@/components/reveal";
import { HeroFadeImage } from "@/components/hero-fade-image";
import { getPageContent, getFaqs, getReviews, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos, staticHebergementPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("home")!;

const fallbackFaqs = [
  {
    id: "fallback-1",
    question: "Combien de personnes le domaine peut-il accueillir ?",
    answer: "Le domaine accueille jusqu'à 150 personnes pour une réception assise, avec plusieurs espaces modulables en intérieur et extérieur.",
  },
  {
    id: "fallback-2",
    question: "Peut-on dormir sur place ?",
    answer: "Oui, le domaine dispose de 15 hébergements permettant de loger une partie de vos invités directement sur place.",
  },
  {
    id: "fallback-3",
    question: "Le domaine est-il privatisable en exclusivité ?",
    answer: "Oui, le domaine se privatise en exclusivité pour votre événement, sans autre réception le même jour.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("home");
  if (!content?.seo_title && !content?.seo_description) return {};
  return {
    title: content.seo_title || undefined,
    description: content.seo_description || undefined,
  };
}

export default async function HomePage() {
  const [pageContent, faqs, reviews, galleryPhotos, lieuPhotos] = await Promise.all([
    getPageContent("home"),
    getFaqs("home"),
    getReviews(),
    getMedia("galerie"),
    getMedia("home-lieu"),
  ]);

  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);
  const lieuPhoto = lieuPhotos[0] ? mediaUrl(lieuPhotos[0].storage_path) : "/images/domaine-pool.jpg";

  const displayFaqs = faqs.length > 0 ? faqs.map((fq) => ({ id: fq.id, question: fq.question, answer: fq.answer })) : fallbackFaqs;

  const stats = [
    { value: f("stat1_value"), label: f("stat1_label") },
    { value: f("stat2_value"), label: f("stat2_label") },
    { value: f("stat3_value"), label: f("stat3_label") },
    { value: f("stat4_value"), label: f("stat4_label") },
  ];

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center text-center">
        <HeroFadeImage src="/images/home-hero.jpg" alt="Étang et jardins du Domaine de la Bégude" />
        <div className="absolute inset-0 bg-black/45" />
        <Container className="relative z-10 flex flex-col items-center px-4">
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.1] text-white sm:text-7xl">{f("hero_title")}</h1>
          <p className="mt-3 font-script text-6xl leading-[1.3] text-white sm:text-7xl">{f("hero_accent")}</p>
          <p className="mt-8 max-w-xl text-base text-white/85">{f("hero_description")}</p>
        </Container>
        <Link
          href="/contact"
          className="absolute bottom-0 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-1/2 items-center rounded-full bg-[var(--accent)] px-10 py-4 text-sm tracking-wide text-white shadow-lg hover:opacity-90"
        >
          {f("hero_cta")}
        </Link>
      </section>

      <section className="pt-24 pb-14 sm:pt-28">
        <Reveal>
          <Container className="grid items-center gap-10 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={lieuPhoto} alt="Le domaine" fill className="object-cover" sizes="(min-width: 640px) 500px, 100vw" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("lieu_title")}</h2>
              <p className="mt-5 text-[var(--foreground)]/70">{f("lieu_text")}</p>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
        <Reveal>
          <Container className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--background)] p-10">
              <h3 className="font-serif text-2xl">{f("mariage_card_title")}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{f("mariage_card_text")}</p>
              <Link href="/mariage" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
                Découvrir les mariages →
              </Link>
            </div>
            <div className="rounded-2xl bg-[var(--background)] p-10">
              <h3 className="font-serif text-2xl">{f("seminaire_card_title")}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{f("seminaire_card_text")}</p>
              <Link href="/seminaire" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
                Découvrir les séminaires →
              </Link>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20">
        <Reveal>
          <Container>
            <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{f("stats_title")}</h2>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delayMs={i * 100}>
                  <div className="text-center">
                    <p className="font-serif text-3xl text-[var(--accent)]">{s.value}</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]/60">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
        <Reveal>
          <Container>
            <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("galerie_title")}</h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(galleryPhotos.length > 0
                ? galleryPhotos.slice(0, 6).map((p) => ({ key: p.id, src: mediaUrl(p.storage_path), alt: p.alt ?? "" }))
                : staticGalleryPhotos.slice(0, 6).map((p) => ({ key: p.src, src: p.src, alt: p.alt }))
              ).map((p, i) => (
                <Reveal key={p.key} delayMs={i * 80}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="400px" />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/galerie" className="text-sm text-[var(--accent)] hover:underline">
                Voir la galerie complète →
              </Link>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20">
        <Reveal>
          <Container className="grid items-center gap-10 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={staticHebergementPhotos[0].src} alt={staticHebergementPhotos[0].alt} fill className="object-cover" sizes="500px" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("hebergement_title")}</h2>
              <p className="mt-4 text-[var(--foreground)]/70">{f("hebergement_text")}</p>
              <Link href="/hebergement" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
                Découvrir l&apos;hébergement →
              </Link>
            </div>
          </Container>
        </Reveal>
      </section>

      {reviews.length > 0 && (
        <section className="py-16">
          <Reveal>
            <Container>
              <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--foreground)]/40">Ils nous ont fait confiance</p>
              <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-5">
                {reviews.slice(0, 6).map((r, i) => (
                  <Reveal key={r.id} delayMs={i * 100}>
                    <div className="w-full rounded-xl border border-black/5 bg-[var(--background-muted)]/60 p-5 sm:w-[calc(33.333%-14px)]">
                      <p className="text-xs text-[var(--accent-warm)]">{"★".repeat(r.rating)}</p>
                      <p className="mt-2 line-clamp-4 text-sm text-[var(--foreground)]/60">{r.text}</p>
                      <p className="mt-3 text-xs font-medium text-[var(--foreground)]/70">{r.author}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </Reveal>
        </section>
      )}

      <LogoMarquee />

      <section className="py-20 bg-[var(--background-muted)]">
        <Reveal>
          <Container>
            <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{f("faq_title")}</h2>
            <div className="mx-auto mt-10 max-w-2xl divide-y divide-black/5">
              {displayFaqs.map((fq) => (
                <details key={fq.id} className="group py-5">
                  <summary className="cursor-pointer list-none font-medium text-[var(--foreground)]">{fq.question}</summary>
                  <p className="mt-3 text-sm text-[var(--foreground)]/70">{fq.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-24 text-center">
        <Reveal>
          <Container className="max-w-xl">
            <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("cta_title")}</h2>
            <p className="mt-4 text-[var(--foreground)]/70">{f("cta_text")}</p>
            <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm text-white hover:opacity-90">
              {f("cta_button")}
            </Link>
          </Container>
        </Reveal>
      </section>
    </>
  );
}
