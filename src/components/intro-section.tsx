import { Container } from "./container";
import { RichText } from "./rich-text";

export function IntroSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="py-16 text-center">
      <Container className="max-w-2xl">
        <span className="mx-auto block h-px w-12 bg-[var(--accent)]/50" />
        <RichText as="h2" value={title} className="mt-5 font-serif text-3xl text-[var(--accent)] sm:text-4xl" />
        <RichText as="p" value={text} className="mt-5 whitespace-pre-line text-[var(--foreground)]/70" />
      </Container>
    </section>
  );
}
