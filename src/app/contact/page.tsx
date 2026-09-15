import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { getPageContent } from "@/lib/content";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("contact")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return {
    title: content?.seo_title || "Contact & devis",
    description:
      content?.seo_description ||
      "Demandez votre devis personnalisé pour votre mariage, séminaire ou réception au Domaine de la Bégude, à Fayence dans le Var.",
  };
}

export default async function ContactPage() {
  const pageContent = await getPageContent("contact");
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  return (
    <>
      <PageHero eyebrow="Contact" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-20">
        <Container className="max-w-2xl">
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
