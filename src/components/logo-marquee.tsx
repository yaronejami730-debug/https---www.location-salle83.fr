const logos = [
  { src: "/images/logos/airbnb-logo.svg", alt: "Airbnb" },
  { src: "/images/logos/tripadvisor-logo.svg", alt: "Tripadvisor" },
  { src: "/images/logos/google-logo.svg", alt: "Google" },
  { src: "/images/logos/expedia-logo.svg", alt: "Expedia" },
  { src: "/images/logos/booking-logo.svg", alt: "Booking.com" },
];

export function LogoMarquee() {
  const track = [...logos, ...logos];

  return (
    <section className="overflow-hidden border-y border-black/5 bg-[var(--background-muted)] py-8">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center">
        {track.map((logo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${logo.alt}-${i}`}
            src={logo.src}
            alt={logo.alt}
            className="mr-16 h-8 w-auto shrink-0 opacity-70 grayscale sm:h-10"
          />
        ))}
      </div>
    </section>
  );
}
