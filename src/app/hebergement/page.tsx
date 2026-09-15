import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticHebergementPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("hebergement")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("hebergement");
  return {
    title: content?.seo_title || "Hébergement",
    description:
      content?.seo_description ||
      "15 mazets et chambres au Domaine de la Bégude, à Fayence dans le Var, pour prolonger votre événement sur place.",
  };
}

export default async function HebergementPage() {
  const [pageContent, photos] = await Promise.all([getPageContent("hebergement"), getMedia("hebergement")]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  return (
    <>
      <PageHero eyebrow="Hébergement" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-20">
        <Container className="grid gap-4 sm:grid-cols-3">
          {photos.length > 0
            ? photos.map((p) => (
                <div key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={mediaUrl(p.storage_path)} alt={p.alt ?? ""} fill className="object-cover" sizes="400px" />
                </div>
              ))
            : staticHebergementPhotos.map((p) => (
                <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="400px" />
                </div>
              ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
