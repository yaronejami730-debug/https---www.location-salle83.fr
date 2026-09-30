import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Toutes les réponses aux questions fréquentes sur le Domaine de la Bégude : hébergement, capacité, tarifs, réservation, équipements et plus.",
  openGraph: { images: [{ url: "/images/galerie/IMG_7450.jpg", width: 2000, height: 1500, alt: "Domaine de la Bégude" }] },
  twitter: { images: ["/images/galerie/IMG_7450.jpg"] },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Faq"
        title="Questions fréquentes"
        description="Cherchez par mot-clé ou filtrez par catégorie pour trouver votre réponse."
      />

      <section className="pt-4 pb-20">
        <Container className="max-w-3xl">
          <FaqList />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
