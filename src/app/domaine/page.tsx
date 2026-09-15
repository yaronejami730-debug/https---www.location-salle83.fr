import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";

const DEFAULT_TITLE = "3 hectares de nature préservée en plein cœur du Var";
const DEFAULT_DESCRIPTION =
  "Bâtisses en pierre, jardins méditerranéens et lumière de Provence : un lieu pensé pour accueillir vos plus beaux moments.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("domaine");
  return {
    title: content?.seo_title || "Le domaine",
    description:
      content?.seo_description ||
      "Découvrez le Domaine de la Bégude à Fayence, dans le Var : 3 hectares de nature préservée, bâtisses en pierre et espaces réceptifs.",
  };
}

export default async function DomainePage() {
  const [content, photos] = await Promise.all([getPageContent("domaine"), getMedia("domaine")]);

  return (
    <>
      <PageHero
        eyebrow="Le domaine"
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
                <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
              ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
