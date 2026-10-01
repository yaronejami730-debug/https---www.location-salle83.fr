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
import { getPricingBrackets } from "@/lib/pricing";
import { RichText } from "@/components/rich-text";

const seminaireSchema = getSchema("seminaire")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("seminaire");
  return {
    title: content?.seo_title || "Séminaire, événements & réceptions",
    description:
      content?.seo_description ||
      "Séminaires d'entreprise, réceptions privées et événements au Domaine de la Bégude, à Fayence dans le Var : salles équipées, hébergement et privatisation.",
    openGraph: { images: [{ url: "/images/galerie/IMG_7447.jpg", width: 2000, height: 1500, alt: "Séminaires et événements au Domaine de la Bégude" }] },
    twitter: { images: ["/images/galerie/IMG_7447.jpg"] },
  };
}

export default async function SeminaireEvenementsPage() {
  const [seminaireContent, zigzag1, zigzag2, zigzag3, pricingBrackets] = await Promise.all([
    getPageContent("seminaire"),
    getMedia("seminaire-zigzag-1"),
    getMedia("seminaire-zigzag-2"),
    getMedia("seminaire-zigzag-3"),
    getPricingBrackets(),
  ]);
  const cs = seminaireContent?.content ?? {};
  const fs = (key: string) => fieldValue(cs, seminaireSchema.fields.find((x) => x.key === key)!);

  const toImages = (rows: typeof zigzag1, fallbackIndex: number) =>
    rows.length > 0
      ? rows.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? "" }))
      : [staticGalleryPhotos[fallbackIndex % staticGalleryPhotos.length]];

  const features = [
    { n: 1, title: fs("feature1_title"), text: fs("feature1_text"), images: toImages(zigzag1, 3), interval: Number(fs("feature1_interval")) * 1000, delay: 0 },
    { n: 2, title: fs("feature2_title"), text: fs("feature2_text"), images: toImages(zigzag2, 4), interval: Number(fs("feature2_interval")) * 1000, delay: 2200 },
    { n: 3, title: fs("feature3_title"), text: fs("feature3_text"), images: toImages(zigzag3, 5), interval: Number(fs("feature3_interval")) * 1000, delay: 4400 },
  ];

  const events = [fs("event1"), fs("event2"), fs("event3"), fs("event4")];

  return (
    <>
      <PageHero
        eyebrow={fs("eyebrow")}
        title={fs("hero_title")}
        description={fs("hero_description")}
        image={{ src: "/images/galerie/IMG_7461.jpg", alt: "Séminaires et événements au Domaine de la Bégude" }}
        scrollFade
      />

      <IntroSection title={fs("intro_title")} action={{ label: fs("intro_button"), href: "#tarifs" }} />

      {features.map((ft) => (
        <ZigzagSection key={ft.n} title={ft.title} text={ft.text} images={ft.images} intervalMs={ft.interval} startDelayMs={ft.delay} reverse={ft.n % 2 === 0} />
      ))}

      <section className="py-20 bg-[var(--background-muted)]">
        <Container>
          <RichText as="h2" value={fs("events_title")} className="text-center font-serif text-3xl text-[var(--foreground)]" />
          <RichText as="p" value={fs("events_text")} className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70" />

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {events.map((e, i) => (
              <div key={i} className="rounded-xl bg-[var(--background)] px-6 py-8 text-center">
                <RichText as="p" value={e} className="text-sm text-[var(--foreground)]" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="tarifs" className="scroll-mt-20 py-20">
        <Container>
          <RichText as="h2" value={fs("pricing_title")} className="text-center font-serif text-3xl text-[var(--foreground)]" />
          <RichText as="p" value={fs("pricing_note")} className="mx-auto mt-4 max-w-xl text-center text-sm text-[var(--foreground)]/70" />

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
