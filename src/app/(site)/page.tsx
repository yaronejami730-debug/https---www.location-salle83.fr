import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { EntryGate } from "@/components/entry-gate";
import { LogoMarquee } from "@/components/logo-marquee";
import { Reveal } from "@/components/reveal";
import { getPageContent, getReviews, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("home")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("home");
  if (!content?.seo_title && !content?.seo_description) return {};
  return {
    title: content.seo_title || undefined,
    description: content.seo_description || undefined,
  };
}

export default async function HomePage() {
  const [pageContent, reviews, histoirePhotos, choiceMariagePhotos, choiceEvenementsPhotos, choiceDomainePhotos] = await Promise.all([
    getPageContent("home"),
    getReviews(),
    getMedia("home-histoire"),
    getMedia("home-choice-mariage"),
    getMedia("home-choice-evenements"),
    getMedia("home-choice-domaine"),
  ]);

  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);
  const histoirePhoto = histoirePhotos[0] ? mediaUrl(histoirePhotos[0].storage_path) : "/images/mariage-hero.jpg";

  const choices = [
    {
      label: f("choice_mariage_label"),
      href: "/mariage",
      photo: choiceMariagePhotos[0] ? mediaUrl(choiceMariagePhotos[0].storage_path) : "/images/mariage-hero.jpg",
    },
    {
      label: f("choice_evenements_label"),
      href: "/seminaire",
      photo: choiceEvenementsPhotos[0] ? mediaUrl(choiceEvenementsPhotos[0].storage_path) : "/images/domaine-featured.jpg",
    },
    {
      label: f("choice_domaine_label"),
      href: "/domaine",
      photo: choiceDomainePhotos[0] ? mediaUrl(choiceDomainePhotos[0].storage_path) : "/images/domaine-pool.jpg",
    },
  ];

  const mainStats = [
    { value: f("stat1_value"), label: f("stat1_label") },
    { value: f("stat2_value"), label: f("stat2_label") },
    { value: f("stat3_value"), label: f("stat3_label") },
    { value: f("stat4_value"), label: f("stat4_label") },
  ];
  const sideStat = f("stat5_label");

  return (
    <>
      <EntryGate heroTitle={f("hero_title")} heroAccent={f("hero_accent")} heroDescription={f("hero_description")} />

      <section className="py-20 bg-[var(--background-muted)]">
        <Reveal>
          <Container>
            <div className="grid items-center gap-10 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:order-2">
                <Image src={histoirePhoto} alt="Notre histoire" fill className="object-cover" sizes="(min-width: 640px) 500px, 100vw" />
              </div>
              <div>
                <h2 className="font-script text-5xl text-[var(--foreground)] sm:text-6xl">{f("histoire_title")}</h2>
                <p className="mt-5 whitespace-pre-line text-[var(--foreground)]/70">{f("histoire_text")}</p>
              </div>
            </div>

            <div className="mt-14">
              <p className="mb-4 text-center text-sm font-bold normal-case tracking-[0.05em] text-[var(--foreground)]/70">
                {f("stats_title")}
              </p>
              <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl sm:flex-row">
                <div className="grid grid-cols-2 gap-y-6 px-6 py-8 sm:flex sm:flex-1 sm:flex-nowrap sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:py-9">
                  {mainStats.map((s) => (
                    <div key={s.label} className="text-center sm:shrink-0">
                      <p className="font-serif text-3xl text-[var(--accent)] sm:text-4xl">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground)]/50 sm:text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex shrink-0 items-center justify-center border-t border-black/10 bg-[var(--accent)]/8 px-8 py-6 text-center sm:border-t-0 sm:border-l sm:w-72 sm:py-9">
                  <p className="font-serif text-lg text-[var(--foreground)] sm:text-xl">{sideStat}</p>
                </div>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pt-24 pb-20">
        <Reveal>
          <Container>
            <h2 className="text-center font-script text-5xl text-[var(--foreground)] sm:text-6xl">{f("choices_title")}</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {choices.map((choice, i) => (
                <Reveal key={choice.href} delayMs={i * 100}>
                  <Link
                    href={choice.href}
                    className="group relative flex aspect-[3/4] items-end justify-center overflow-hidden rounded-2xl text-center"
                  >
                    <Image
                      src={choice.photo}
                      alt={choice.label}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
                    <span className="relative z-10 mb-12 inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm tracking-wide text-white transition-colors group-hover:bg-white group-hover:text-[var(--foreground)]">
                      {choice.label}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      {reviews.length > 0 && (
        <section className="py-16 bg-[var(--background-muted)]">
          <Reveal>
            <Container>
              <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--foreground)]/40">Ils nous ont fait confiance</p>
              <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-3">
                {reviews.slice(0, 6).map((r, i) => (
                  <Reveal key={r.id} delayMs={i * 100}>
                    <div className="h-full rounded-xl border border-black/5 bg-[var(--background)]/60 p-5">
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
    </>
  );
}
