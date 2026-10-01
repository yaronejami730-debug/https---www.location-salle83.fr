import { supabaseAdmin } from "@/lib/supabase-admin";
import { mediaUrl } from "@/lib/supabase-public";
import { PhotoTile } from "./photo-tile";
import { UploadForm } from "./upload-form";
import { uploadSlideshowAudio, removeSlideshowAudio } from "./actions";

const pageOptions = [
  { value: "galerie", label: "Galerie — mariages, accueil & réceptions" },
  { value: "hebergement", label: "Hébergement" },
  { value: "seminaire", label: "Séminaire" },
  { value: "domaine", label: "Le domaine" },
];

export default async function AdminPhotosPage() {
  const supabase = supabaseAdmin();
  const [{ data: media }, { data: globalRow }] = await Promise.all([
    supabase.from("media").select("*").order("sort_order", { ascending: true }),
    supabase.from("pages").select("content").eq("slug", "global").maybeSingle(),
  ]);
  const slideshowAudioPath = (globalRow?.content as Record<string, string> | undefined)?.slideshow_audio_path ?? null;

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

      <UploadForm />

      <div className="mt-8 rounded-2xl border border-black/5 bg-[var(--background)] p-5">
        <h2 className="font-serif text-lg text-[var(--foreground)]">Musique du diaporama</h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">
          Jouée quand un visiteur lance le diaporama (bouton « Musique » plein écran) dans la Galerie.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-[var(--foreground)]/70">
            {slideshowAudioPath ? "Piste personnalisée active." : "Piste par défaut du site (aucune piste importée)."}
          </p>
          {slideshowAudioPath && (
            <form action={removeSlideshowAudio}>
              <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
                Revenir à la piste par défaut
              </button>
            </form>
          )}
        </div>
        <form action={uploadSlideshowAudio} className="mt-4 flex items-center gap-3">
          <input
            type="file"
            name="file"
            accept="audio/mpeg,audio/mp3,.mp3"
            required
            className="text-sm text-[var(--foreground)]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-xs file:text-white hover:file:opacity-90"
          />
          <button type="submit" className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs text-white hover:opacity-90">
            Importer un MP3
          </button>
        </form>
      </div>

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
