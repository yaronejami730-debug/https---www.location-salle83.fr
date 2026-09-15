import { supabaseAdmin } from "@/lib/supabase-admin";
import { addReview } from "./actions";
import { ReviewRow } from "./review-row";

export default async function AdminAvisPage() {
  const supabase = supabaseAdmin();
  const { data: reviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Avis</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">Affichés sur la page d&apos;accueil.</p>

      <form action={addReview} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Nom</label>
          <input name="author" required className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Note</label>
          <select name="rating" defaultValue="5" className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} étoiles
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--foreground)]/80">Avis</label>
          <textarea name="text" required rows={3} className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm" />
        </div>
        <button type="submit" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm text-white hover:opacity-90">
          Ajouter
        </button>
      </form>

      <div className="mt-8 max-w-xl space-y-3">
        {(reviews ?? []).map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
        {(reviews ?? []).length === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucun avis pour le moment.</p>}
      </div>
    </div>
  );
}
