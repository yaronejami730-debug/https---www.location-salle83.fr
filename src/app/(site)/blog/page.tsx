import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Container } from "@/components/container";
import { getBlogPosts } from "@/lib/blog";
import { getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { stripHtml } from "@/lib/sanitize-html";

export const metadata: Metadata = {
  title: "Blog",
  description: "Actualités et articles du Domaine de la Bégude, à Fayence dans le Var.",
  openGraph: { images: [{ url: "/images/entry-gate.jpg", width: 1200, height: 630, alt: "Domaine de la Bégude" }] },
  twitter: { images: ["/images/entry-gate.jpg"] },
};

function excerpt(html: string, length = 140) {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const cards = await Promise.all(
    posts.map(async (post) => {
      const media = await getMedia(`blog-${post.id}`);
      const cover = media[0] ? { src: mediaUrl(media[0].storage_path), alt: media[0].alt ?? post.title } : null;
      return { post, cover };
    }),
  );

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Nos derniers articles"
        description={cards.length === 0 ? "De nouveaux articles arrivent très prochainement." : "Actualités, conseils et coulisses du Domaine de la Bégude."}
      />

      {cards.length === 0 ? (
        <section className="py-20">
          <Container className="max-w-xl text-center text-sm text-[var(--foreground)]/60">
            Aucun article publié pour le moment — revenez bientôt.
          </Container>
        </section>
      ) : (
        <section className="pt-4 pb-20">
          <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ post, cover }) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-black/5 bg-[var(--background)] shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden" style={!cover ? { backgroundColor: post.color } : undefined}>
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="400px"
                    />
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[var(--foreground)]/50">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: post.color }} />
                    Article
                  </span>
                  <h2 className="mt-3 font-serif text-xl text-[var(--foreground)]">{post.title}</h2>
                  <p className="mt-2 text-sm text-[var(--foreground)]/70">{excerpt(post.body)}</p>
                </div>
              </Link>
            ))}
          </Container>
        </section>
      )}

      <CtaSection />
    </>
  );
}
