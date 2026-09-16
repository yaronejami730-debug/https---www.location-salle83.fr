import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSchema } from "@/lib/page-schemas";
import { PageEditor } from "./page-editor";

export const dynamic = "force-dynamic";

const ZIGZAG_SLUGS = ["mariage", "seminaire"];

export default async function AdminPageEditorRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const schema = getSchema(slug);
  if (!schema) notFound();

  const supabase = supabaseAdmin();
  const zigzagCategories = ZIGZAG_SLUGS.includes(slug)
    ? [1, 2, 3].map((n) => `${slug}-zigzag-${n}`)
    : slug === "domaine"
      ? ["domaine-pool", "domaine-featured"]
      : slug === "home"
        ? ["home-histoire"]
        : [];

  const [{ data: row }, { data: faqs }, { data: reviews }, { data: media }, { data: hebergementMedia }, zigzagRows] = await Promise.all([
    supabase.from("pages").select("*").eq("slug", slug).maybeSingle(),
    slug === "home" ? supabase.from("faqs").select("*").eq("page", "home").eq("published", true).order("sort_order") : Promise.resolve({ data: [] }),
    slug === "home" ? supabase.from("reviews").select("*").eq("published", true).order("sort_order") : Promise.resolve({ data: [] }),
    ["galerie", "home", "domaine"].includes(slug)
      ? supabase
          .from("media")
          .select("*")
          .eq("page", slug === "home" ? "galerie" : slug)
          .order("sort_order")
      : Promise.resolve({ data: [] }),
    ["galerie", "home", "hebergement"].includes(slug)
      ? supabase.from("media").select("*").eq("page", "hebergement").order("sort_order")
      : Promise.resolve({ data: [] }),
    Promise.all(zigzagCategories.map((cat) => supabase.from("media").select("*").eq("page", cat).order("sort_order"))),
  ]);

  const zigzagMedia = Object.fromEntries(zigzagCategories.map((cat, i) => [cat, zigzagRows[i]?.data ?? []]));

  return (
    <PageEditor
      schema={schema}
      initialContent={(row?.content as Record<string, string>) ?? {}}
      initialSeoTitle={row?.seo_title ?? ""}
      initialSeoDescription={row?.seo_description ?? ""}
      faqs={faqs ?? []}
      reviews={reviews ?? []}
      media={media ?? []}
      hebergementMedia={hebergementMedia ?? []}
      zigzagMedia={zigzagMedia}
    />
  );
}
