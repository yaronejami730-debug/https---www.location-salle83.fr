import { supabaseAdmin } from "@/lib/supabase-admin";
import { mediaUrl } from "@/lib/supabase-public";
import { uploadPhoto } from "./actions";
import { PhotoTile } from "./photo-tile";

const pageOptions = [
  { value: "galerie", label: "Galerie — mariages & séminaires" },
  { value: "hebergement", label: "Hébergement" },
  { value: "home", label: "Accueil" },
  { value: "mariage", label: "Mariage" },
  { value: "seminaire", label: "Séminaire" },
  { value: "domaine", label: "Le domaine" },
];

export default async function AdminPhotosPage() {
  const supabase = supabaseAdmin();
  const { data: media } = await supabase.from("media").select("*").order("sort_order", { ascending: true });

  const grouped = new Map<string, typeof media>();
  for (const m of media ?? []) {
    const list = grouped.get(m.page) ?? [];
    list.push(m);
    grouped.set(m.page, list);
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Photos</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Gérez les photos affichées sur le site. Survolez une photo pour la déplacer ou la supprimer.
      </p>

      <form action={uploadPhoto} className="mt-8 flex max-w-xl flex-wrap items-end gap-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Catégorie</label>
          <select name="page" defaultValue="galerie" className="rounded-lg border border-black/10 px-3 py-2.5 text-sm">
            {pageOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Fichier</label>
          <input type="file" name="file" accept="image/*" required className="w-full text-sm" />
        </div>
        <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90">
          Envoyer
        </button>
      </form>

      <div className="mt-10 space-y-10">
        {pageOptions.map((opt) => {
          const items = grouped.get(opt.value) ?? [];
          if (items.length === 0) return null;
          return (
            <div key={opt.value}>
              <h2 className="mb-3 font-serif text-lg text-[var(--foreground)]">{opt.label}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {items.map((m, i) => (
                  <PhotoTile
                    key={m.id}
                    id={m.id}
                    url={mediaUrl(m.storage_path)}
                    alt={m.alt ?? ""}
                    storagePath={m.storage_path}
                    page={m.page}
                    isFirst={i === 0}
                    isLast={i === items.length - 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {(media ?? []).length === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucune photo pour le moment.</p>}
      </div>
    </div>
  );
}
