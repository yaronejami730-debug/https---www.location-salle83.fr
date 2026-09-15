import { supabaseAdmin } from "@/lib/supabase-admin";
import { PageForm } from "./page-form";

const pages = [
  { slug: "home", label: "Accueil" },
  { slug: "mariage", label: "Mariage" },
  { slug: "seminaire", label: "Séminaire" },
  { slug: "evenements", label: "Événements & réceptions" },
  { slug: "domaine", label: "Le domaine" },
  { slug: "hebergement", label: "Hébergement" },
  { slug: "galerie", label: "Galerie" },
  { slug: "contact", label: "Contact" },
];

export default async function AdminPagesPage() {
  const supabase = supabaseAdmin();
  const { data: rows } = await supabase.from("pages").select("*");
  const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Pages & SEO</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Laissez un champ vide pour garder le texte par défaut du site.
      </p>

      <div className="mt-8 max-w-3xl space-y-6">
        {pages.map((p) => (
          <PageForm
            key={p.slug}
            label={p.label}
            content={
              bySlug.get(p.slug) ?? {
                slug: p.slug,
                hero_title: null,
                hero_description: null,
                seo_title: null,
                seo_description: null,
              }
            }
          />
        ))}
      </div>
    </div>
  );
}
