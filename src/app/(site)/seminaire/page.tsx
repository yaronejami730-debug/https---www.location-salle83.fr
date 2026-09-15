import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { ZigzagSection } from "@/components/zigzag-section";
import { IntroSection } from "@/components/intro-section";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("seminaire")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("seminaire");
  return {
    title: content?.seo_title || "Séminaire",
    description:
      content?.seo_description ||
      "Organisez votre séminaire d'entreprise au Domaine de la Bégude, à Fayence dans le Var : salles équipées, cohésion d'équipe et hébergement.",
  };
}

export default async function SeminairePage() {
  const [pageContent, zigzag1, zigzag2, zigzag3] = await Promise.all([
    getPageContent("seminaire"),
    getMedia("seminaire-zigzag-1"),
    getMedia("seminaire-zigzag-2"),
    getMedia("seminaire-zigzag-3"),
  ]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const toImages = (rows: typeof zigzag1, fallbackIndex: number) =>
    rows.length > 0
      ? rows.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" }))
      : [staticGalleryPhotos[fallbackIndex % staticGalleryPhotos.length]];

  const features = [
    { n: 1, title: f("feature1_title"), text: f("feature1_text"), images: toImages(zigzag1, 3), interval: Number(f("feature1_interval")) * 1000 },
    { n: 2, title: f("feature2_title"), text: f("feature2_text"), images: toImages(zigzag2, 4), interval: Number(f("feature2_interval")) * 1000 },
    { n: 3, title: f("feature3_title"), text: f("feature3_text"), images: toImages(zigzag3, 5), interval: Number(f("feature3_interval")) * 1000 },
  ];

  return (
    <>
      <PageHero eyebrow="Séminaire" title={f("hero_title")} description={f("hero_description")} />

      <IntroSection title={f("intro_title")} text={f("intro_text")} />

      {features.map((ft) => (
        <ZigzagSection key={ft.n} title={ft.title} text={ft.text} images={ft.images} intervalMs={ft.interval} reverse={ft.n % 2 === 0} />
      ))}

      <CtaSection />
    </>
  );
}
