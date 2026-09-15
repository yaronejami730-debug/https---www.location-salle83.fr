import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.name} — Mariages, séminaires & réceptions à ${siteConfig.locality}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: `${siteConfig.tagline}. Domaine privé à ${siteConfig.locality} pour mariages, séminaires, réceptions et événements privés.`,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
    <html lang="fr" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
