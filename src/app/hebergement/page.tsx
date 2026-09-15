import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Hébergement",
  description: "15 mazets et chambres au Domaine de la Bégude, à Fayence dans le Var, pour prolonger votre événement sur place.",
};

export default function HebergementPage() {
  return (
    <>
      <PageHero
        eyebrow="Hébergement"
        title="15 hébergements au cœur du domaine"
        description="Mazets et chambres répartis sur le domaine pour accueillir vos proches et prolonger la fête sans quitter les lieux."
      />

      <section className="py-20">
        <Container className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent-warm)]/20 to-[var(--accent)]/20" />
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
