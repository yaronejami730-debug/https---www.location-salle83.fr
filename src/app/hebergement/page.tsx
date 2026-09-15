import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";

const DEFAULT_TITLE = "15 hébergements au cœur du domaine";
const DEFAULT_DESCRIPTION =
  "Mazets et chambres répartis sur le domaine pour accueillir vos proches et prolonger la fête sans quitter les lieux.";

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
  const [content, photos] = await Promise.all([getPageContent("hebergement"), getMedia("hebergement")]);

  return (
    <>
      <PageHero
        eyebrow="Hébergement"
        title={content?.hero_title || DEFAULT_TITLE}
        description={content?.hero_description || DEFAULT_DESCRIPTION}
      />

      <section className="py-20">
        <Container className="grid gap-4 sm:grid-cols-3">
          {photos.length > 0
            ? photos.map((p) => (
                <div key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={mediaUrl(p.storage_path)} alt={p.alt ?? ""} fill className="object-cover" sizes="400px" />
                </div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent-warm)]/20 to-[var(--accent)]/20" />
              ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
