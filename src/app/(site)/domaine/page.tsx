import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { getSchema, fieldValue } from "@/lib/page-schemas";
import { AmenityIcon } from "@/components/amenity-icon";
import { LocationMap } from "@/components/location-map";

const amenityIcons = ["wifi", "parking", "pool", "paw", "child", "restaurant", "kitchen", "fitness"] as const;

const schema = getSchema("domaine")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("domaine");
  return {
    title: content?.seo_title || "Le domaine",
    description:
      content?.seo_description ||
      "Découvrez le Domaine de la Bégude à Fayence, dans le Var : 3 hectares de nature préservée, bâtisses en pierre et espaces réceptifs.",
  };
}

export default async function DomainePage() {
  const [pageContent, photos] = await Promise.all([getPageContent("domaine"), getMedia("domaine")]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  return (
    <>
      <PageHero eyebrow="Le domaine" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-16">
        <Container className="max-w-xl">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
            <Image
              src="/images/domaine-featured.jpg"
              alt="Voiture de mariage fleurie devant le domaine, mariée et invités dans le jardin"
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          <p className="mt-5 text-center font-display text-2xl italic text-[var(--accent-warm)]">{f("featured_caption")}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl bg-[var(--background-muted)] p-8">
              <h3 className="font-serif text-xl text-[var(--foreground)]">{f(`feature${n}_title`)}</h3>
              <p className="mt-3 text-sm text-[var(--foreground)]/70">{f(`feature${n}_text`)}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="pb-20">
        <Container className="grid gap-4 sm:grid-cols-3">
          {photos.length > 0
            ? photos.map((p) => (
                <div key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={mediaUrl(p.storage_path)} alt={p.alt ?? ""} fill className="object-cover" sizes="400px" />
                </div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20" />
              ))}
        </Container>
      </section>

      <section className="py-16 bg-[var(--background-muted)]">
        <Container>
          <h2 className="text-center font-serif text-2xl text-[var(--foreground)]">{f("amenities_title")}</h2>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {amenityIcons.map((icon, i) => (
              <div key={icon} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)]">
                  <AmenityIcon name={icon} />
                </span>
                <p className="text-xs text-[var(--foreground)]/70">{f(`amenity${i + 1}`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <LocationMap />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
