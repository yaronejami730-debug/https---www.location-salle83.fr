import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { ZigzagSection } from "@/components/zigzag-section";
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
  const [pageContent, media] = await Promise.all([getPageContent("mariage"), getMedia("galerie")]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const photos =
    media.length > 0 ? media.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" })) : staticGalleryPhotos;
  const photo = (i: number) => photos[i % photos.length];

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

      <section className="py-16">
        <Container className="max-w-2xl">
          <p className="whitespace-pre-line text-[var(--foreground)]/70">{f("intro_text")}</p>
        </Container>
      </section>

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

      <ZigzagSection title={f("zigzag1_title")} text={f("zigzag1_text")} image={photo(0)} reverse />
      <ZigzagSection title={f("zigzag2_title")} text={f("zigzag2_text")} image={photo(1)} />
      <ZigzagSection title={f("zigzag3_title")} text={f("zigzag3_text")} image={photo(2)} reverse />

      <CtaSection />
    </>
  );
}
