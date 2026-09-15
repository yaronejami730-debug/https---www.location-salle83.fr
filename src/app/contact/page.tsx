import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { getPageContent } from "@/lib/content";

const DEFAULT_TITLE = "Parlons de votre projet";
const DEFAULT_DESCRIPTION =
  "Remplissez le formulaire ci-dessous, nous revenons vers vous sous 48h avec une proposition personnalisée.";

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
  const content = await getPageContent("contact");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={content?.hero_title || DEFAULT_TITLE}
        description={content?.hero_description || DEFAULT_DESCRIPTION}
      />

      <section className="py-20">
        <Container className="max-w-2xl">
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
