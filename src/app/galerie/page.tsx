import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos } from "@/lib/static-gallery";

const DEFAULT_TITLE = "Le domaine en images";
const DEFAULT_DESCRIPTION = "Un aperçu des lieux, des réceptions et des hébergements du domaine.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("galerie");
  return {
    title: content?.seo_title || "Galerie",
    description:
      content?.seo_description || "Photos du Domaine de la Bégude à Fayence : mariages, séminaires, réceptions et hébergements.",
  };
}

export default async function GaleriePage() {
  const [content, photos] = await Promise.all([getPageContent("galerie"), getMedia("galerie")]);

  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title={content?.hero_title || DEFAULT_TITLE}
        description={content?.hero_description || DEFAULT_DESCRIPTION}
      />

      <section className="py-20">
        <Container className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.length > 0
            ? photos.map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={mediaUrl(p.storage_path)} alt={p.alt ?? ""} fill className="object-cover" sizes="400px" />
                </div>
              ))
            : staticGalleryPhotos.map((p) => (
                <div key={p.src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="400px" />
                </div>
              ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
