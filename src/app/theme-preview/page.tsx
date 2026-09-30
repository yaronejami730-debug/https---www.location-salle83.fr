import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { IntroSection } from "@/components/intro-section";
import { CtaSection } from "@/components/cta-section";
import { ThemePreviewBridge } from "@/components/admin/theme-preview-bridge";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Not a real page — loaded in an iframe by /admin/couleurs so the color
 * editor's preview is the actual Header/PageHero/Footer components, not a
 * hand-drawn mockup. Colors come from the parent window via
 * ThemePreviewBridge, live, as the admin edits them.
 */
export default function ThemePreviewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ThemePreviewBridge />
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Exemple"
          title="Un titre de page"
          description="Voici à quoi ressemble une page du site avec ces couleurs."
        />
        <IntroSection
          title="Notre histoire"
          text="Un exemple de paragraphe pour voir le rendu du texte sur une vraie page du site, avec ces couleurs exactes."
        />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
