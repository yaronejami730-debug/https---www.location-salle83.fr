import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { siteConfig } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: siteConfig.name,
    description: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fayence",
      addressRegion: "Var",
      addressCountry: "FR",
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.domain,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
