import { supabaseAdmin } from "@/lib/supabase-admin";
import { siteConfig } from "@/lib/site";
import { CTA_DEFAULTS } from "@/lib/content";
import { saveSettings } from "./actions";

export default async function AdminParametresPage() {
  const supabase = supabaseAdmin();
  const { data: row } = await supabase.from("pages").select("*").eq("slug", "global").maybeSingle();
  const content = (row?.content as Record<string, string>) ?? {};

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Paramètres</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Coordonnées et accroche affichées dans le pied de page et les données structurées SEO du site.
      </p>

      <form action={saveSettings} className="mt-8 max-w-lg space-y-5 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Accroche (tagline)</label>
          <input
            name="tagline"
            defaultValue={content.tagline ?? siteConfig.tagline}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Téléphone</label>
          <input
            name="phone"
            defaultValue={content.phone ?? siteConfig.phone}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={content.email ?? siteConfig.email}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="border-t border-black/10 pt-5">
          <p className="mb-1 text-sm font-medium text-[var(--foreground)]">Bloc « Parlons de votre projet »</p>
          <p className="mb-4 text-xs text-[var(--foreground)]/50">
            Bouton du menu, et bandeau en bas des pages Domaine, Hébergement, Galerie, Séminaire.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Titre</label>
          <input
            name="cta_title"
            defaultValue={content.cta_title ?? CTA_DEFAULTS.ctaTitle}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Texte</label>
          <input
            name="cta_text"
            defaultValue={content.cta_text ?? CTA_DEFAULTS.ctaText}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Bouton</label>
          <input
            name="cta_button"
            defaultValue={content.cta_button ?? CTA_DEFAULTS.ctaButton}
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm"
          />
        </div>
        <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
