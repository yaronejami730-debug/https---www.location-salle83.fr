"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./container";
import { RichText } from "./rich-text";
import { navItems, siteConfig } from "@/lib/site";
import { CTA_DEFAULTS } from "@/lib/content";

export function Header({ ctaButton = CTA_DEFAULTS.ctaButton }: { ctaButton?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--background-muted)]/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between sm:h-28 lg:h-44">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-end gap-2 self-end">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={104}
              height={106}
              className="site-logo h-20 w-auto shrink-0 sm:h-28 lg:h-44 lg:translate-y-2"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.slice(1, -1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap font-script text-2xl font-bold tracking-wide transition-colors hover:text-[var(--accent)] ${
                  pathname === item.href ? "text-[var(--foreground)]" : "text-[var(--accent)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/contact"
          className="ml-10 hidden lg:inline-flex items-center whitespace-nowrap rounded-full bg-[var(--accent)] px-6 py-2.5 font-script text-2xl text-white transition-opacity hover:opacity-90"
        >
          <RichText value={ctaButton} />
        </Link>

        <button
          aria-label="Ouvrir le menu"
          className="lg:hidden text-[var(--foreground)]"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-black/5 bg-[var(--background-muted)]">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 font-script text-2xl font-bold ${
                  pathname === item.href ? "bg-black/5 text-[var(--foreground)]" : "text-[var(--accent)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
