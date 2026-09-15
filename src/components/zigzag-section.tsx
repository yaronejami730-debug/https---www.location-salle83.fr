import Image from "next/image";
import { Container } from "./container";

export function ZigzagSection({
  title,
  text,
  image,
  reverse = false,
}: {
  title: string;
  text: string;
  image: { src: string; alt: string };
  reverse?: boolean;
}) {
  return (
    <section className="py-14">
      <Container className={`grid items-center gap-10 sm:grid-cols-2 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="500px" />
        </div>
        <div>
          <h2 className="font-serif text-3xl italic text-[var(--accent-warm)]">{title}</h2>
          <p className="mt-4 whitespace-pre-line text-[var(--foreground)]/70">{text}</p>
        </div>
      </Container>
    </section>
  );
}
