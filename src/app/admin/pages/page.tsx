import { supabaseAdmin } from "@/lib/supabase-admin";
import { pageSchemas } from "@/lib/page-schemas";
import { PageForm } from "./page-form";

export default async function AdminPagesPage() {
  const supabase = supabaseAdmin();
  const { data: rows } = await supabase.from("pages").select("*");
  const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Pages & SEO</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Chaque champ correspond à un texte affiché sur le site. Laissez vide pour garder le texte par défaut.
      </p>

      <div className="mt-8 max-w-3xl space-y-4">
        {pageSchemas.map((schema) => (
          <PageForm
            key={schema.slug}
            schema={schema}
            row={
              bySlug.get(schema.slug) ?? {
                slug: schema.slug,
                seo_title: null,
                seo_description: null,
                content: {},
              }
            }
          />
        ))}
      </div>
    </div>
  );
}
