import Link from "next/link";
import { Container } from "./container";
import { navItems, siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/content";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-auto border-t border-black/5 bg-[var(--background-muted)] py-14">
      <Container className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-[var(--foreground)]/70 hover:text-[var(--accent)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="max-w-sm sm:text-right">
          <p className="font-serif text-lg text-[var(--foreground)]">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">{settings.tagline}</p>
          <p className="mt-4 text-sm text-[var(--foreground)]/70">{siteConfig.address}</p>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-[var(--accent)]">
              {settings.phone}
            </a>
          </p>
          <p className="text-sm text-[var(--foreground)]/70">
            <a href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`} className="hover:text-[var(--accent)]">
              {siteConfig.phoneLandline}
            </a>
          </p>
          <p className="text-sm text-[var(--foreground)]/70">
            <a href={`mailto:${settings.email}`} className="hover:text-[var(--accent)]">
              {settings.email}
            </a>
          </p>
        </div>
      </Container>

      <Container className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--foreground)]/50">
          © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
        </p>
        <div className="flex gap-4">
          <Link href="/mentions-legales" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--accent)]">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--accent)]">
            Charte de confidentialité
          </Link>
          <Link href="/conditions-generales" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--accent)]">
            Conditions générales
          </Link>
        </div>
      </Container>
    </footer>
  );
}
