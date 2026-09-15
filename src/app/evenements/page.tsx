import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Événements & réceptions",
  description: "Anniversaires, réceptions privées, tournages, shootings : privatisez le Domaine de la Bégude à Fayence pour votre événement.",
};

const events = ["Anniversaires", "Réceptions privées", "Tournages & shootings", "Dîners de gala"];

export default function EvenementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Événements & réceptions"
        title="Un cadre unique pour tous vos événements privés"
        description="Anniversaire, réception, tournage ou dîner privé : le domaine se privatise pour donner vie à votre projet."
      />

      <section className="py-20">
        <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {events.map((e) => (
            <div key={e} className="rounded-xl bg-[var(--background-muted)] px-6 py-8 text-center">
              <p className="text-sm text-[var(--foreground)]">{e}</p>
            </div>
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
