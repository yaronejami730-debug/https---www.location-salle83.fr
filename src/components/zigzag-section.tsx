import { Container } from "./container";
import { FadeCarousel } from "./fade-carousel";

export function ZigzagSection({
  title,
  text,
  images,
  intervalMs = 6000,
  startDelayMs = 0,
  reverse = false,
}: {
  title: string;
  text: string;
  images: { src: string; alt: string }[];
  intervalMs?: number;
  startDelayMs?: number;
  reverse?: boolean;
}) {
  return (
    <section className="py-14">
      <Container className={`grid items-center gap-10 sm:grid-cols-2 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <FadeCarousel photos={images} intervalMs={intervalMs} startDelayMs={startDelayMs} />
        </div>
        <div>
          <h2 className="font-display text-3xl italic text-[var(--accent-warm)]">{title}</h2>
          <p className="mt-4 whitespace-pre-line text-[var(--foreground)]/70">{text}</p>
        </div>
      </Container>
    </section>
  );
}
