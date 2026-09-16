import { Container } from "./container";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-3xl text-[var(--foreground)]">{title}</h1>
        <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed text-[var(--foreground)]/75">{children}</div>
      </Container>
    </section>
  );
}
