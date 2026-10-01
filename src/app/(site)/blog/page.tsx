import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Actualités et articles du Domaine de la Bégude, à Fayence dans le Var.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Nos derniers articles" description="De nouveaux articles arrivent très prochainement." />

      <section className="py-20">
        <Container className="max-w-xl text-center text-sm text-[var(--foreground)]/60">
          Aucun article publié pour le moment — revenez bientôt.
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
