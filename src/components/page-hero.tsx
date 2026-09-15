import { Container } from "./container";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="bg-[var(--background-muted)] py-20 text-center">
      <Container className="max-w-2xl">
        <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">{title}</h1>
        <p className="mt-5 text-[var(--foreground)]/70">{description}</p>
      </Container>
    </section>
  );
}
