import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { ZigzagSection } from "@/components/zigzag-section";
import { IntroSection } from "@/components/intro-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticGalleryPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";
import { pricingBrackets } from "@/lib/pricing";

const seminaireSchema = getSchema("seminaire")!;
const evenementsSchema = getSchema("evenements")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("seminaire");
  return {
    title: content?.seo_title || "Séminaire, événements & réceptions",
    description:
      content?.seo_description ||
      "Séminaires d'entreprise, réceptions privées et événements au Domaine de la Bégude, à Fayence dans le Var : salles équipées, hébergement et privatisation.",
  };
}

export default async function SeminaireEvenementsPage() {
  const [seminaireContent, evenementsContent, zigzag1, zigzag2, zigzag3] = await Promise.all([
    getPageContent("seminaire"),
    getPageContent("evenements"),
    getMedia("seminaire-zigzag-1"),
    getMedia("seminaire-zigzag-2"),
    getMedia("seminaire-zigzag-3"),
  ]);
  const cs = seminaireContent?.content ?? {};
  const ce = evenementsContent?.content ?? {};
  const fs = (key: string) => fieldValue(cs, seminaireSchema.fields.find((x) => x.key === key)!);
  const fe = (key: string) => fieldValue(ce, evenementsSchema.fields.find((x) => x.key === key)!);

  const toImages = (rows: typeof zigzag1, fallbackIndex: number) =>
    rows.length > 0
      ? rows.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" }))
      : [staticGalleryPhotos[fallbackIndex % staticGalleryPhotos.length]];

  const features = [
    { n: 1, title: fs("feature1_title"), text: fs("feature1_text"), images: toImages(zigzag1, 3), interval: Number(fs("feature1_interval")) * 1000, delay: 0 },
    { n: 2, title: fs("feature2_title"), text: fs("feature2_text"), images: toImages(zigzag2, 4), interval: Number(fs("feature2_interval")) * 1000, delay: 2200 },
    { n: 3, title: fs("feature3_title"), text: fs("feature3_text"), images: toImages(zigzag3, 5), interval: Number(fs("feature3_interval")) * 1000, delay: 4400 },
  ];

  const events = [fe("event1"), fe("event2"), fe("event3"), fe("event4")];

  return (
    <>
      <PageHero eyebrow="Séminaire & Événements" title={fs("hero_title")} description={fs("hero_description")} />

      <IntroSection title={fs("intro_title")} text={fs("intro_text")} />

      {features.map((ft) => (
        <ZigzagSection key={ft.n} title={ft.title} text={ft.text} images={ft.images} intervalMs={ft.interval} startDelayMs={ft.delay} reverse={ft.n % 2 === 0} />
      ))}

      <section className="py-20 bg-[var(--background-muted)]">
        <Container>
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{fe("intro_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70">{fe("intro_text")}</p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {events.map((e) => (
              <div key={e} className="rounded-xl bg-[var(--background)] px-6 py-8 text-center">
                <p className="text-sm text-[var(--foreground)]">{e}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">{fe("pricing_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70">{fe("pricing_note")}</p>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-black/5 bg-[var(--background-muted)]">
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
