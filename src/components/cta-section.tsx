import Link from "next/link";
import { Container } from "./container";

export function CtaSection() {
  return (
    <section className="py-24 text-center">
      <Container className="max-w-xl">
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Parlons de votre projet</h2>
        <p className="mt-4 text-[var(--foreground)]/70">Recevez une proposition personnalisée sous 48h.</p>
        <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm text-white hover:opacity-90">
          Demander un devis
        </Link>
      </Container>
    </section>
  );
}
