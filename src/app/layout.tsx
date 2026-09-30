import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display, Beau_Rivage } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { getThemeColors } from "@/lib/content";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic", "normal"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const beauRivage = Beau_Rivage({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
    images: [{ url: "/images/entry-gate.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/entry-gate.jpg"],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getThemeColors();
  const themeVars = {
    "--background": theme.background,
    "--background-muted": theme.backgroundMuted,
    "--foreground": theme.foreground,
    "--accent": theme.accent,
    "--accent-warm": theme.accentWarm,
  } as React.CSSProperties;

  return (
    <html
      lang="fr"
      style={themeVars}
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${beauRivage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
