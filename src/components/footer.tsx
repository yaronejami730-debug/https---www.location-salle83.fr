import Link from "next/link";
import { Container } from "./container";
import { navItems, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-[var(--background-muted)] py-14">
      <Container className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-lg text-[var(--foreground)]">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">{siteConfig.tagline}</p>
          <p className="mt-4 text-sm text-[var(--foreground)]/70">{siteConfig.locality}</p>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-[var(--accent)]">
              {siteConfig.phone}
            </a>
          </p>
          <p className="text-sm text-[var(--foreground)]/70">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-[var(--accent)]">
              {siteConfig.email}
            </a>
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-[var(--foreground)]/70 hover:text-[var(--accent)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="mt-10 border-t border-black/5 pt-6">
        <p className="text-xs text-[var(--foreground)]/50">
          © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
