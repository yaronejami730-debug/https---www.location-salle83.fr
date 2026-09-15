import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent } from "@/lib/content";
import { getSchema, fieldValue } from "@/lib/page-schemas";
import { pricingBrackets } from "@/lib/pricing";

const schema = getSchema("evenements")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("evenements");
  return {
    title: content?.seo_title || "Événements & réceptions",
    description:
      content?.seo_description ||
      "Anniversaires, réceptions privées, tournages, shootings : privatisez le Domaine de la Bégude à Fayence pour votre événement.",
  };
}

export default async function EvenementsPage() {
  const pageContent = await getPageContent("evenements");
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const events = [f("event1"), f("event2"), f("event3"), f("event4")];

  return (
    <>
      <PageHero eyebrow="Événements & réceptions" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-16">
        <Container className="max-w-2xl">
          <p className="whitespace-pre-line text-[var(--foreground)]/70">{f("intro_text")}</p>
        </Container>
      </section>

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
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{f("pricing_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70">{f("pricing_note")}</p>

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
                {pricingBrackets.map((row) => (
                  <tr key={row.key} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-[var(--foreground)]">{row.label}</td>
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
