import { Container } from "./container";
import { RichText } from "./rich-text";

export function IntroSection({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: { label: string; href: string };
}) {
  return (
    <section className="py-16 text-center">
      <Container className="max-w-2xl">
        <span className="mx-auto block h-px w-12 bg-[var(--accent)]/50" />
        <RichText as="h2" value={title} className="mt-5 font-serif text-3xl text-[var(--accent)] sm:text-4xl" />
        {action ? (
          <a
            href={action.href}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-9 py-4 text-sm font-medium tracking-wide text-white shadow-lg shadow-[var(--accent)]/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--accent)]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            {action.label}
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        ) : (
          text && <RichText as="p" value={text} className="mt-5 whitespace-pre-line text-[var(--foreground)]/70" />
        )}
      </Container>
    </section>
  );
}
