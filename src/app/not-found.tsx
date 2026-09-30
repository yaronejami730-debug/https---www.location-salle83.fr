import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--background-muted)] py-20 text-center">
          <Container className="max-w-2xl">
            <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">Erreur 404</p>
            <h1 className="mt-4 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">Cette page n&apos;existe pas</h1>
            <p className="mt-5 text-[var(--foreground)]/70">Le lien est peut-être incorrect ou la page a été déplacée.</p>
          </Container>
        </section>

        <section className="py-16 text-center">
          <Container>
            <Link href="/" className="inline-flex rounded-full border border-[var(--accent)] px-8 py-3.5 text-sm text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white">
              Retour à l&apos;accueil
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
