import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent } from "@/lib/content";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("seminaire")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("seminaire");
  return {
    title: content?.seo_title || "Séminaire",
    description:
      content?.seo_description ||
      "Organisez votre séminaire d'entreprise au Domaine de la Bégude, à Fayence dans le Var : salles équipées, cohésion d'équipe et hébergement.",
  };
}

export default async function SeminairePage() {
  const pageContent = await getPageContent("seminaire");
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const features = [
    { title: f("feature1_title"), text: f("feature1_text") },
    { title: f("feature2_title"), text: f("feature2_text") },
    { title: f("feature3_title"), text: f("feature3_text") },
  ];

  return (
    <>
      <PageHero eyebrow="Séminaire" title={f("hero_title")} description={f("hero_description")} />

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

      <CtaSection />
    </>
  );
}
