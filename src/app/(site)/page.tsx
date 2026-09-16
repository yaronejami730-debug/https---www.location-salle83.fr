import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { EntryGate } from "@/components/entry-gate";
import { LogoMarquee } from "@/components/logo-marquee";
import { Reveal } from "@/components/reveal";
import { getPageContent, getFaqs, getReviews, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticHebergementPhotos } from "@/lib/static-gallery";
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
  const [pageContent, faqs, reviews, histoirePhotos] = await Promise.all([
    getPageContent("home"),
    getFaqs("home"),
    getReviews(),
    getMedia("home-histoire"),
  ]);

  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);
  const histoirePhoto = histoirePhotos[0] ? mediaUrl(histoirePhotos[0].storage_path) : "/images/mariage-hero.jpg";

  const displayFaqs = faqs.length > 0 ? faqs.map((fq) => ({ id: fq.id, question: fq.question, answer: fq.answer })) : fallbackFaqs;

  const stats = [
    { value: f("stat1_value"), label: f("stat1_label") },
    { value: f("stat2_value"), label: f("stat2_label") },
    { value: f("stat3_value"), label: f("stat3_label") },
    { value: f("stat4_value"), label: f("stat4_label") },
  ];

  return (
    <>
      <EntryGate heroTitle={f("hero_title")} heroAccent={f("hero_accent")} heroDescription={f("hero_description")} />

      <section className="py-20 bg-[var(--background-muted)]">
        <Reveal>
          <Container className="grid items-center gap-10 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:order-2">
              <Image src={histoirePhoto} alt="Notre histoire" fill className="object-cover" sizes="(min-width: 640px) 500px, 100vw" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("histoire_title")}</h2>
              <p className="mt-5 whitespace-pre-line text-[var(--foreground)]/70">{f("histoire_text")}</p>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20">
        <Reveal>
          <Container>
            <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{f("stats_title")}</h2>
            <div className="mt-12 grid grid-cols-2 divide-x divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10 sm:grid-cols-4 sm:divide-y-0">
              {stats.map((s, i) => (
                <Reveal key={s.label} delayMs={i * 100}>
                  <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
                    <p className="font-serif text-4xl text-[var(--accent)]">{s.value}</p>
                    <p className="text-xs uppercase tracking-[0.15em] text-[var(--foreground)]/50">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
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
              <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-3">
                {reviews.slice(0, 6).map((r, i) => (
                  <Reveal key={r.id} delayMs={i * 100}>
                    <div className="h-full rounded-xl border border-black/5 bg-[var(--background-muted)]/60 p-5">
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
    </>
  );
}
