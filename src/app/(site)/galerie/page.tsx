import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { GalleryGrid } from "@/components/gallery-grid";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos, staticHebergementPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("galerie")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("galerie");
  return {
    title: content?.seo_title || "Galerie",
    description:
      content?.seo_description || "Photos du Domaine de la Bégude à Fayence : mariages, séminaires, réceptions et hébergements.",
  };
}

export default async function GaleriePage() {
  const [pageContent, eventPhotos, hebergementPhotos] = await Promise.all([
    getPageContent("galerie"),
    getMedia("galerie"),
    getMedia("hebergement"),
  ]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const events = eventPhotos.length > 0 ? eventPhotos.map((p) => ({ key: p.id, src: mediaUrl(p.storage_path), alt: p.alt ?? "" })) : staticGalleryPhotos.map((p) => ({ key: p.src, ...p }));
  const hebergement = hebergementPhotos.length > 0 ? hebergementPhotos.map((p) => ({ key: p.id, src: mediaUrl(p.storage_path), alt: p.alt ?? "" })) : staticHebergementPhotos.map((p) => ({ key: p.src, ...p }));

  return (
    <>
      <PageHero eyebrow="Galerie" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-20">
        <Container>
          <GalleryGrid title={f("events_title")} photos={events} />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <GalleryGrid title={f("hebergement_title")} photos={hebergement} />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
