import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact & devis",
  description: "Demandez votre devis personnalisé pour votre mariage, séminaire ou réception au Domaine de la Bégude, à Fayence dans le Var.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        description="Remplissez le formulaire ci-dessous, nous revenons vers vous sous 48h avec une proposition personnalisée."
      />

      <section className="py-20">
        <Container className="max-w-2xl">
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
