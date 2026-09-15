import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Le domaine",
  description: "Découvrez le Domaine de la Bégude à Fayence, dans le Var : 3 hectares de nature préservée, bâtisses en pierre et espaces réceptifs.",
};

export default function DomainePage() {
  return (
    <>
      <PageHero
        eyebrow="Le domaine"
        title="3 hectares de nature préservée en plein cœur du Var"
        description="Bâtisses en pierre, jardins méditerranéens et lumière de Provence : un lieu pensé pour accueillir vos plus beaux moments."
      />

      <section className="py-20">
        <Container className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
