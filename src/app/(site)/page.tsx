import type { Metadata } from "next";
import Image from "next/image";
import { ChoiceCards } from "@/components/choice-cards";
import { Container } from "@/components/container";
import { CounterStat } from "@/components/counter-stat";
import { EntryGate } from "@/components/entry-gate";
import { LogoMarquee } from "@/components/logo-marquee";
import { Reveal } from "@/components/reveal";
import { getPageContent, getReviews, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { getSchema, fieldValue } from "@/lib/page-schemas";
import { RichText } from "@/components/rich-text";

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
                <RichText as="h2" value={f("histoire_title")} className="font-script text-5xl text-[var(--foreground)] sm:text-6xl" />
                <RichText as="p" value={f("histoire_text")} className="mt-5 whitespace-pre-line text-[var(--foreground)]/70" />
              </div>
            </div>

            <div className="mt-14">
              <RichText
                as="p"
                value={f("stats_title")}
                className="mb-4 text-center text-base font-bold normal-case tracking-[0.05em] text-[var(--foreground)]/80 sm:text-lg"
              />
              <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl sm:flex-row">
                <div className="grid grid-cols-2 gap-y-8 px-6 py-10 sm:flex sm:flex-1 sm:flex-nowrap sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:py-12">
                  {mainStats.map((s) => (
                    <div key={s.label} className="text-center sm:shrink-0">
                      <CounterStat value={s.value} className="font-serif text-3xl text-[var(--accent)] sm:text-4xl" />
                      <RichText as="p" value={s.label} className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--foreground)]/50 sm:text-xs" />
                    </div>
                  ))}
                </div>
                <div className="flex shrink-0 items-center justify-center border-t border-black/10 bg-[var(--accent)]/8 px-8 py-8 text-center sm:border-t-0 sm:border-l sm:w-72 sm:py-12">
                  <RichText as="p" value={sideStat} className="font-serif text-lg text-[var(--foreground)] sm:text-xl" />
                </div>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pt-24 pb-20">
        <Reveal>
          <Container>
            <RichText as="h2" value={f("choices_title")} className="text-center font-script text-5xl text-[var(--foreground)] sm:text-6xl" />
            <ChoiceCards choices={choices} />
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
