import Image from "next/image";
import { Container } from "./container";
import { HeroFadeImage } from "./hero-fade-image";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  scrollFade = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  scrollFade?: boolean;
}) {
  if (image) {
    return (
      <section className="relative flex h-[55vh] min-h-[420px] items-center justify-center overflow-hidden text-center">
        {scrollFade ? (
          <HeroFadeImage src={image.src} alt={image.alt} />
        ) : (
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <Container className="relative z-10 max-w-2xl">
          <p className="text-sm tracking-[0.2em] text-white/80 uppercase">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 text-white/85">{description}</p>
        </Container>
      </section>
    );
  }

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
