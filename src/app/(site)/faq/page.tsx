import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Toutes les réponses aux questions fréquentes sur le Domaine de la Bégude : hébergement, capacité, tarifs, réservation, équipements et plus.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        description="Cherchez par mot-clé ou filtrez par catégorie pour trouver votre réponse."
      />

      <section className="py-20">
        <Container className="max-w-3xl">
          <FaqList />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
