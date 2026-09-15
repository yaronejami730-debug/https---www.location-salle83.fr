import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
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
          <h2 className="font-serif text-2xl text-[var(--foreground)]">{f("events_title")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {events.map((p) => (
              <div key={p.key} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <h2 className="font-serif text-2xl text-[var(--foreground)]">{f("hebergement_title")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {hebergement.map((p) => (
              <div key={p.key} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
