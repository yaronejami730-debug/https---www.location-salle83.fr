import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

const stats = [
  { value: "3 ha", label: "de domaine" },
  { value: "15", label: "hébergements" },
  { value: "180", label: "invités max" },
  { value: "Fayence", label: "Var" },
];

const faqs = [
  {
    q: "Combien de personnes le domaine peut-il accueillir ?",
    a: "Le domaine accueille jusqu'à 180 invités pour une réception assise, avec plusieurs espaces modulables en intérieur et extérieur.",
  },
  {
    q: "Peut-on dormir sur place ?",
    a: "Oui, le domaine dispose de 15 hébergements permettant de loger une partie de vos invités directement sur place.",
  },
  {
    q: "Le domaine est-il privatisable en exclusivité ?",
    a: "Oui, le domaine se privatise en exclusivité pour votre événement, sans autre réception le même jour.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden text-center">
        <Image
          src="/images/mariage-hero.jpg"
          alt="Décoration florale du Domaine de la Bégude"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <Container className="relative z-10 flex flex-col items-center py-24">
          <p className="text-sm tracking-[0.2em] text-white/85 uppercase">
            {siteConfig.name} — {siteConfig.locality}
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/85">
            Mariages · Séminaires · Réceptions · Événements privés
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/domaine" className="rounded-full border border-white/40 px-7 py-3.5 text-sm text-white hover:bg-white/10">
              Découvrir le domaine
            </Link>
            <Link href="/contact" className="rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm text-white hover:opacity-90">
              Préparer mon événement
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-[var(--foreground)]">Le lieu</h2>
          <p className="mt-5 text-[var(--foreground)]/70">
            Un domaine pensé pour accueillir vos plus beaux moments : nature préservée, bâtisses en pierre,
            lumière de Provence et attention portée à chaque détail. Ici, chaque événement devient une expérience.
          </p>
        </Container>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
        <Container className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-[var(--background)] p-10">
            <h3 className="font-serif text-2xl">Mariage</h3>
            <p className="mt-3 text-sm text-[var(--foreground)]/70">
              Votre réception, votre ambiance, vos invités.
            </p>
            <Link href="/mariage" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
              Découvrir les mariages →
            </Link>
          </div>
          <div className="rounded-2xl bg-[var(--background)] p-10">
            <h3 className="font-serif text-2xl">Séminaire</h3>
            <p className="mt-3 text-sm text-[var(--foreground)]/70">
              Travail, détente et cohésion dans un cadre privilégié.
            </p>
            <Link href="/seminaire" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
              Découvrir les séminaires →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">Le domaine en quelques chiffres</h2>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl text-[var(--accent)]">{s.value}</p>
                <p className="mt-1 text-sm text-[var(--foreground)]/60">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
        <Container>
          <h2 className="font-serif text-3xl text-[var(--foreground)]">Galerie</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/galerie" className="text-sm text-[var(--accent)] hover:underline">
              Voir la galerie complète →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid items-center gap-10 sm:grid-cols-2">
          <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent-warm)]/20 to-[var(--accent)]/20" />
          <div>
            <h2 className="font-serif text-3xl text-[var(--foreground)]">Hébergement</h2>
            <p className="mt-4 text-[var(--foreground)]/70">
              15 mazets et chambres répartis sur le domaine pour prolonger la fête et accueillir vos proches
              directement sur place.
            </p>
            <Link href="/hebergement" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
              Découvrir l'hébergement →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-[var(--background-muted)]">
        <Container>
          <h2 className="text-center font-serif text-3xl text-[var(--foreground)]">Questions fréquentes</h2>
          <div className="mx-auto mt-10 max-w-2xl divide-y divide-black/5">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none font-medium text-[var(--foreground)]">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-[var(--foreground)]/70">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 text-center">
        <Container className="max-w-xl">
          <h2 className="font-serif text-3xl text-[var(--foreground)]">Parlons de votre projet</h2>
          <p className="mt-4 text-[var(--foreground)]/70">
            Recevez une proposition personnalisée sous 48h.
          </p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm text-white hover:opacity-90">
            Demander un devis
          </Link>
        </Container>
      </section>
    </>
  );
}
