import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ZigzagSection } from "@/components/zigzag-section";
import { IntroSection } from "@/components/intro-section";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("mariage")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("mariage");
  return {
    title: content?.seo_title || "Mariage",
    description:
      content?.seo_description ||
      "Organisez votre mariage au Domaine de la Bégude, à Fayence dans le Var : cérémonie, réception et hébergement sur place.",
  };
}

export default async function MariagePage() {
  const [pageContent, zigzag1, zigzag2, zigzag3] = await Promise.all([
    getPageContent("mariage"),
    getMedia("mariage-zigzag-1"),
    getMedia("mariage-zigzag-2"),
    getMedia("mariage-zigzag-3"),
  ]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const toImages = (rows: typeof zigzag1, fallbackIndex: number) =>
    rows.length > 0
      ? rows.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" }))
      : [staticGalleryPhotos[fallbackIndex % staticGalleryPhotos.length]];

  const features = [
    { title: f("feature1_title"), text: f("feature1_text") },
    { title: f("feature2_title"), text: f("feature2_text") },
    { title: f("feature3_title"), text: f("feature3_text") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Mariage"
        title={f("hero_title")}
        description={f("hero_description")}
        image={{ src: "/images/mariage-hero.jpg", alt: "Bouquet de fleurs blanches pour décoration de mariage" }}
      />

      <IntroSection title={f("intro_title")} text={f("intro_text")} />

      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          {features.map((ft) => (
            <div key={ft.title} className="rounded-2xl bg-[var(--background-muted)] p-8">
              <h3 className="font-serif text-xl text-[var(--foreground)]">{ft.title}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{ft.text}</p>
            </div>
          ))}
        </Container>
      </section>

      <ZigzagSection title={f("zigzag1_title")} text={f("zigzag1_text")} images={toImages(zigzag1, 0)} intervalMs={Number(f("zigzag1_interval")) * 1000} startDelayMs={0} reverse />
      <ZigzagSection title={f("zigzag2_title")} text={f("zigzag2_text")} images={toImages(zigzag2, 1)} intervalMs={Number(f("zigzag2_interval")) * 1000} startDelayMs={2200} />
      <ZigzagSection
        title={f("zigzag3_title")}
        text={f("zigzag3_text")}
        images={toImages(zigzag3, 2)}
        intervalMs={Number(f("zigzag3_interval")) * 1000}
        startDelayMs={4400}
        reverse
        cta={{ label: "Réserver un hébergement ↗", href: "https://www.domainedelabegude.com/fr" }}
      />
    </>
  );
}
