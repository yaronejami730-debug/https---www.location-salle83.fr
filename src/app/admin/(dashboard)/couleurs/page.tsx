import { supabaseAdmin } from "@/lib/supabase-admin";
import { THEME_DEFAULTS } from "@/lib/content";
import { ColorEditor } from "@/components/admin/color-editor";

export default async function AdminCouleursPage() {
  const supabase = supabaseAdmin();
  const { data: row } = await supabase.from("pages").select("content").eq("slug", "theme").maybeSingle();
  const content = (row?.content as Record<string, string>) ?? {};

  const initial = {
    background: content.background || THEME_DEFAULTS.background,
    backgroundMuted: content.backgroundMuted || THEME_DEFAULTS.backgroundMuted,
    foreground: content.foreground || THEME_DEFAULTS.foreground,
    accent: content.accent || THEME_DEFAULTS.accent,
    accentWarm: content.accentWarm || THEME_DEFAULTS.accentWarm,
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Couleurs du site</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Change les couleurs utilisées partout sur le site public. L'aperçu à droite se met à jour en direct ; le site change pour tous les visiteurs seulement après avoir cliqué sur Enregistrer.
      </p>

      <ColorEditor initial={initial} />
    </div>
  );
}
