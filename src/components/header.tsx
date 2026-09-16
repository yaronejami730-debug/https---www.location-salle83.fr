"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./container";
import { navItems, siteConfig } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur">
      <Container className="flex h-28 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt={siteConfig.name} width={104} height={106} className="h-24 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.slice(1, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors hover:text-[var(--accent)] ${
                pathname === item.href ? "text-[var(--accent)]" : "text-[var(--foreground)]/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
        >
          Demander un devis
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
        <div className="lg:hidden border-t border-black/5 bg-[var(--background)]">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 text-sm ${
                  pathname === item.href ? "bg-black/5 text-[var(--accent)]" : "text-[var(--foreground)]/80"
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
