import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { RouteTransitionCover } from "@/components/route-transition-cover";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: siteConfig.name,
    description: settings.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "4876 RD 562, La Bégude",
      postalCode: "83440",
      addressLocality: "Fayence",
      addressRegion: "Var",
      addressCountry: "FR",
    },
    telephone: settings.phone,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Téléphone fixe",
      value: siteConfig.phoneLandline,
    },
    email: settings.email,
    url: siteConfig.domain,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <RouteTransitionCover />
      <ThemeSwitcher />
    </>
  );
}
