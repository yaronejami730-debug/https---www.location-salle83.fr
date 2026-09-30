import Image from "next/image";
import { Container } from "./container";
import { HeroFadeImage } from "./hero-fade-image";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  scrollFade = false,
  scriptTitle = false,
  scriptEyebrow = true,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: { src: string; alt: string };
  scrollFade?: boolean;
  scriptTitle?: boolean;
  scriptEyebrow?: boolean;
}) {
  const titleFont = scriptTitle ? "font-script text-5xl sm:text-6xl" : "font-serif font-bold text-3xl sm:text-4xl";
  const eyebrowFont = scriptEyebrow ? "font-script text-3xl sm:text-4xl normal-case tracking-normal" : "text-sm tracking-[0.2em] uppercase";

  if (image) {
    return (
      <section className="relative flex h-[55vh] min-h-[420px] items-center justify-center overflow-hidden text-center">
        {scrollFade ? (
          <HeroFadeImage src={image.src} alt={image.alt} />
        ) : (
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <Container className="relative z-10 max-w-2xl">
          <p className={`text-white/90 ${eyebrowFont}`}>{eyebrow}</p>
          <h1 className={`mt-4 text-white ${titleFont}`}>{title}</h1>
          {description && <p className="mt-5 text-white/85">{description}</p>}
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[var(--background)] py-20 text-center">
      <Container className="max-w-2xl">
        <p className={`text-[var(--accent)] ${eyebrowFont}`}>{eyebrow}</p>
        <h1 className={`mt-4 text-[var(--foreground)] ${titleFont}`}>{title}</h1>
        {description && <p className="mt-5 text-[var(--foreground)]/70">{description}</p>}
      </Container>
    </section>
  );
}
