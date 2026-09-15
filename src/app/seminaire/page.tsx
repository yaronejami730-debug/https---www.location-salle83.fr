import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Séminaire",
  description: "Organisez votre séminaire d'entreprise au Domaine de la Bégude, à Fayence dans le Var : salles équipées, cohésion d'équipe et hébergement.",
};

const features = [
  { title: "Salles de travail", text: "Espaces équipés, lumineux et modulables pour réunions, ateliers et conférences." },
  { title: "Team building", text: "Activités en extérieur sur un domaine de 3 hectares pour renforcer la cohésion d'équipe." },
  { title: "Hébergement sur place", text: "15 hébergements permettent de loger vos équipes sans quitter le domaine." },
];

export default function SeminairePage() {
  return (
    <>
      <PageHero
        eyebrow="Séminaire"
        title="Travail, détente et cohésion dans un cadre privilégié"
        description="Un domaine privé en Provence pour vos séminaires d'entreprise, entre espaces de travail et moments de convivialité."
      />

      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-[var(--background-muted)] p-8">
              <h3 className="font-serif text-xl text-[var(--foreground)]">{f.title}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{f.text}</p>
            </div>
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
