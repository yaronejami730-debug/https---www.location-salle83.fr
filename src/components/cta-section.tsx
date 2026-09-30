import Link from "next/link";
import { Container } from "./container";
import { RichText } from "./rich-text";
import { getSiteSettings } from "@/lib/content";
import { sanitizeInlineHtml, parseAligned } from "@/lib/sanitize-html";

export async function CtaSection() {
  const { ctaTitle, ctaText, ctaButton } = await getSiteSettings();
  const button = parseAligned(ctaButton);

  return (
    <section className="py-16 text-center">
      <Container className="max-w-xl">
        <RichText as="h2" value={ctaTitle} className="font-serif text-3xl text-[var(--foreground)]" />
        <RichText as="p" value={ctaText} className="mt-4 text-[var(--foreground)]/70" />
        <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm text-white hover:opacity-90">
          <span
            style={button.align !== "left" ? { textAlign: button.align } : undefined}
            dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(button.html) }}
          />
        </Link>
      </Container>
    </section>
  );
}
