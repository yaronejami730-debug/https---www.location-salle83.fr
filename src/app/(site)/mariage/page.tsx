import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent } from "@/lib/content";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("mariage")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("mariage");
  return {
    title: content?.seo_title || "Mariage",
    description:
      content?.seo_description ||
      "Organisez votre mariage au Domaine de la Bégude, à Fayence dans le Var : cérémonie, réception et hébergement sur place.",
  };
}

export default async function MariagePage() {
  const pageContent = await getPageContent("mariage");
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const features = [
    { title: f("feature1_title"), text: f("feature1_text") },
    { title: f("feature2_title"), text: f("feature2_text") },
    { title: f("feature3_title"), text: f("feature3_text") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Mariage"
        title={f("hero_title")}
        description={f("hero_description")}
        image={{ src: "/images/mariage-hero.jpg", alt: "Bouquet de fleurs blanches pour décoration de mariage" }}
      />

      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          {features.map((ft) => (
            <div key={ft.title} className="rounded-2xl bg-[var(--background-muted)] p-8">
              <h3 className="font-serif text-xl text-[var(--foreground)]">{ft.title}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{ft.text}</p>
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
