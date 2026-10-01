import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ReviewForm } from "./review-form";

export const metadata: Metadata = {
  title: "Laisser un avis",
  description: "Partagez votre expérience au Domaine de la Bégude, à Fayence dans le Var.",
};

export default function AvisPage() {
  return (
    <>
      <PageHero eyebrow="Avis" title="Partagez votre expérience" description="Votre avis nous aide, et aide les futurs mariés et organisateurs à se projeter." />

      <section className="py-20">
        <Container className="max-w-xl">
          <ReviewForm />
        </Container>
      </section>
    </>
  );
}
