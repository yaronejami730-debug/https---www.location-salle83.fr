import { Container } from "./container";

export function IntroSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="py-16 text-center">
      <Container className="max-w-2xl">
        <span className="mx-auto block h-px w-12 bg-[var(--accent)]/50" />
        <h2 className="mt-5 font-script text-4xl text-[var(--accent)] sm:text-5xl">{title}</h2>
        <p className="mt-5 whitespace-pre-line text-[var(--foreground)]/70">{text}</p>
      </Container>
    </section>
  );
}
