import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { FadeCarousel } from "@/components/fade-carousel";
import { RichText } from "@/components/rich-text";
import { getBlogPost } from "@/lib/blog";
import { getMedia } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase-public";
import { stripHtml } from "@/lib/sanitize-html";

function excerpt(html: string, length = 160) {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const description = excerpt(post.body);
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description },
    twitter: { title: post.title, description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const media = await getMedia(`blog-${post.id}`);
  const photos = media.map((m) => ({ src: mediaUrl(m.storage_path), alt: m.alt ?? post.title }));

  return (
    <>
      <section className="py-20 text-center" style={{ backgroundColor: `${post.color}14` }}>
        <Container className="max-w-2xl">
          <span className="text-sm tracking-[0.2em] uppercase" style={{ color: post.color }}>
            Blog
          </span>
          <h1 className="mt-4 font-serif font-bold text-3xl text-[var(--foreground)] sm:text-4xl">{post.title}</h1>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full" style={{ backgroundColor: post.color }} />
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          {photos.length > 1 && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <FadeCarousel photos={photos} />
            </div>
          )}
          {photos.length === 1 && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={photos[0].src} alt={photos[0].alt} fill className="object-cover" sizes="800px" />
            </div>
          )}

          <RichText as="div" value={post.body} className="text-[var(--foreground)]/80 leading-relaxed" />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
