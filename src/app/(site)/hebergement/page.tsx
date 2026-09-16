import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { FadeCarousel } from "@/components/fade-carousel";
import { AmenityIcon } from "@/components/amenity-icon";
import { getPageContent, getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { staticHebergementPhotos } from "@/lib/static-gallery";
import { getSchema, fieldValue } from "@/lib/page-schemas";

const schema = getSchema("hebergement")!;
const amenityIcons = ["wifi", "parking", "kitchen", "pool"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("hebergement");
  return {
    title: content?.seo_title || "Hébergement",
    description:
      content?.seo_description ||
      "15 mazets et chambres au Domaine de la Bégude, à Fayence dans le Var, pour prolonger votre événement sur place.",
  };
}

export default async function HebergementPage() {
  const [pageContent, photos] = await Promise.all([getPageContent("hebergement"), getMedia("hebergement")]);
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const images =
    photos.length > 0
      ? photos.map((p) => ({ src: mediaUrl(p.storage_path), alt: p.alt ?? "" }))
      : staticHebergementPhotos;

  return (
    <>
      <PageHero eyebrow="Hébergement" title={f("hero_title")} description={f("hero_description")} />

      <section className="py-20">
        <Container className="grid items-center gap-10 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <FadeCarousel photos={images} intervalMs={6000} />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-[var(--foreground)]">{f("intro_title")}</h2>
            <p className="mt-4 text-[var(--foreground)]/70">{f("intro_text")}</p>

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.15em] text-[var(--accent)]">{f("amenities_title")}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {amenityIcons.map((icon, i) => (
                <div key={icon} className="flex items-center gap-2.5">
                  <span className="text-[var(--accent)]">
                    <AmenityIcon name={icon} />
                  </span>
                  <p className="text-sm text-[var(--foreground)]/70">{f(`amenity${i + 1}`)}</p>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <a
            href="https://www.domainedelabegude.com/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[var(--accent)] px-12 py-5 text-base tracking-wide text-white hover:opacity-90"
          >
            {f("booking_cta")}
          </a>
        </Container>
      </section>
    </>
  );
}
