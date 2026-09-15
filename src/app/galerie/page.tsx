import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos du Domaine de la Bégude à Fayence : mariages, séminaires, réceptions et hébergements.",
};

export default function GaleriePage() {
  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title="Le domaine en images"
        description="Un aperçu des lieux, des réceptions et des hébergements du domaine."
      />

      <section className="py-20">
        <Container className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
