const logos = [
  { src: "/images/logos/airbnb-logo.svg", alt: "Airbnb" },
  { src: "/images/logos/tripadvisor-logo.svg", alt: "Tripadvisor" },
  { src: "/images/logos/google-logo.svg", alt: "Google" },
  { src: "/images/logos/expedia-logo.svg", alt: "Expedia" },
  { src: "/images/logos/booking-logo.svg", alt: "Booking.com" },
];

// Rendered 6x (not 2x): on wide viewports, 2 copies run out of content before
// the loop point and show a blank gap. 6 copies keeps the track always wider
// than the viewport, so the -1/6-width shift below never exposes an edge.
export function LogoMarquee() {
  const track = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="overflow-hidden border-y border-black/5 bg-[var(--background-muted)] py-8">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center">
        {track.map((logo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${logo.alt}-${i}`}
            src={logo.src}
            alt={logo.alt}
            className="mr-16 h-10 w-auto shrink-0 opacity-70 grayscale sm:h-12"
          />
        ))}
      </div>
    </section>
  );
}
