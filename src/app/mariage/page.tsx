import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent } from "@/lib/content";

const DEFAULT_TITLE = "Votre réception, votre ambiance, vos invités";
const DEFAULT_DESCRIPTION =
  "Un domaine privé en Provence pour célébrer votre union entourés des vôtres, du vin d'honneur à la soirée dansante.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("mariage");
  return {
    title: content?.seo_title || "Mariage",
    description:
      content?.seo_description ||
      "Organisez votre mariage au Domaine de la Bégude, à Fayence dans le Var : cérémonie, réception et hébergement sur place.",
  };
}

const features = [
  { title: "Cérémonie", text: "Un cadre naturel pour une cérémonie laïque ou religieuse, en extérieur ou sous une charpente en pierre." },
  { title: "Réception", text: "Salles et terrasses modulables pour votre vin d'honneur, dîner et soirée dansante." },
  { title: "Exclusivité", text: "Le domaine est privatisé pour votre événement, sans autre mariage le même jour." },
];

export default async function MariagePage() {
  const content = await getPageContent("mariage");

  return (
    <>
      <PageHero
        eyebrow="Mariage"
        title={content?.hero_title || DEFAULT_TITLE}
        description={content?.hero_description || DEFAULT_DESCRIPTION}
        image={{ src: "/images/mariage-hero.jpg", alt: "Bouquet de fleurs blanches pour décoration de mariage" }}
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

      <section className="py-16 bg-[var(--background-muted)]">
        <Container className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
          ))}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
