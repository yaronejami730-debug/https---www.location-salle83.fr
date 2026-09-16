import Image from "next/image";

const logos = [
  { src: "/images/logos/airbnb-logo.svg", alt: "Airbnb" },
  { src: "/images/logos/tripadvisor-logo.svg", alt: "Tripadvisor" },
  { src: "/images/logos/google-logo.svg", alt: "Google" },
  { src: "/images/logos/expedia-logo.svg", alt: "Expedia" },
];

export function LogoMarquee() {
  const track = [...logos, ...logos];

  return (
    <section className="overflow-hidden border-y border-black/5 bg-[var(--background-muted)] py-10">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-20">
        {track.map((logo, i) => (
          <div key={`${logo.alt}-${i}`} className="relative h-9 w-32 shrink-0 opacity-60 grayscale">
            <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="128px" />
          </div>
        ))}
      </div>
    </section>
  );
}
