import { supabaseAdmin } from "@/lib/supabase-admin";
import { mediaUrl } from "@/lib/supabase-public";
import { uploadPhoto } from "./actions";
import { PhotoTile } from "./photo-tile";

const pageOptions = ["galerie", "home", "mariage", "seminaire", "domaine", "hebergement"];

export default async function AdminPhotosPage() {
  const supabase = supabaseAdmin();
  const { data: media } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Photos</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">Gérez les photos affichées sur le site.</p>

      <form action={uploadPhoto} className="mt-8 flex max-w-xl flex-wrap items-end gap-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Page</label>
          <select name="page" defaultValue="galerie" className="rounded-lg border border-black/10 px-3 py-2.5 text-sm">
            {pageOptions.map((p) => (
              <option key={p} value={p}>
                {p}
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

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(media ?? []).map((m) => (
          <PhotoTile key={m.id} id={m.id} url={mediaUrl(m.storage_path)} alt={m.alt ?? ""} storagePath={m.storage_path} />
        ))}
        {(media ?? []).length === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucune photo pour le moment.</p>}
      </div>
    </div>
  );
}
