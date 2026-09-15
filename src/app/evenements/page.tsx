import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Événements & réceptions",
  description: "Anniversaires, réceptions privées, tournages, shootings : privatisez le Domaine de la Bégude à Fayence pour votre événement.",
};

const events = ["Anniversaires", "Réceptions privées", "Tournages & shootings", "Dîners de gala"];

const pricingRows = [
  { people: "-40 pers.", salle: 1700, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { people: "-50 pers.", salle: 1800, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { people: "-65 pers.", salle: 1950, lendemain: 300, piscine: 200, vaisselle: 120, cuisine: 230 },
  { people: "-80 pers.", salle: 2100, lendemain: 350, piscine: 250, vaisselle: 130, cuisine: 250 },
  { people: "-95 pers.", salle: 2250, lendemain: 400, piscine: 300, vaisselle: 140, cuisine: 270 },
  { people: "-110 pers.", salle: 2400, lendemain: 450, piscine: 350, vaisselle: 150, cuisine: 290 },
];

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

      <section className="py-20 bg-[var(--background-muted)]">
        <Container>
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">Grille tarifaire</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70">
            Forfait salle minimum : 1700 € (1800 € le 31 décembre). Tarifs en fonction du nombre de
            personnes le jour de l&apos;événement, enfants comme adultes.
          </p>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-black/5 bg-[var(--background)]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-[var(--foreground)]/60">
                  <th className="px-5 py-4 font-medium">Personnes</th>
                  <th className="px-5 py-4 font-medium">La salle</th>
                  <th className="px-5 py-4 font-medium">Lendemain</th>
                  <th className="px-5 py-4 font-medium">Piscine</th>
                  <th className="px-5 py-4 font-medium">Vaisselle</th>
                  <th className="px-5 py-4 font-medium">Cuisine</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr key={row.people} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-[var(--foreground)]">{row.people}</td>
                    <td className="px-5 py-4 text-[var(--foreground)]/80">{row.salle} €</td>
                    <td className="px-5 py-4 text-[var(--foreground)]/80">{row.lendemain} €</td>
                    <td className="px-5 py-4 text-[var(--foreground)]/80">{row.piscine} €</td>
                    <td className="px-5 py-4 text-[var(--foreground)]/80">{row.vaisselle} €</td>
                    <td className="px-5 py-4 text-[var(--foreground)]/80">{row.cuisine} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--foreground)]/50">
            Chapiteau : 200 €/pièce. Exemples de calcul et détails complets envoyés avec votre devis personnalisé.
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
