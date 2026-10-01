import { supabaseAdmin } from "@/lib/supabase-admin";
import { siteConfig } from "@/lib/site";
import { addReview } from "./actions";
import { ReviewRow } from "./review-row";
import { CopyLinkButton } from "./copy-link-button";

export default async function AdminAvisPage() {
  const supabase = supabaseAdmin();
  const { data: reviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r) => !r.published);
  const published = (reviews ?? []).filter((r) => r.published);
  const publicUrl = `${siteConfig.domain}/avis`;

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)]">Avis</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        Un avis ajouté n&apos;est pas visible sur le site tant qu&apos;il n&apos;est pas publié ci-dessous.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-black/5 bg-[var(--background-muted)] p-4">
        <p className="flex-1 text-sm text-[var(--foreground)]/70">
          Partagez ce lien à vos clients pour qu&apos;ils laissent un avis directement : <span className="font-mono text-xs">{publicUrl}</span>
        </p>
        <CopyLinkButton url={publicUrl} />
      </div>

      <form action={addReview} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-black/5 bg-[var(--background)] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">Ajouter un avis manuellement</p>
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

      <div className="mt-10 max-w-xl">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--foreground)]/50">
          En attente de modération {pending.length > 0 && `(${pending.length})`}
        </h2>
        <div className="mt-3 space-y-3">
          {pending.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
          {pending.length === 0 && <p className="text-sm text-[var(--foreground)]/50">Rien en attente.</p>}
        </div>
      </div>

      <div className="mt-10 max-w-xl">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--foreground)]/50">Publiés sur le site</h2>
        <div className="mt-3 space-y-3">
          {published.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
          {published.length === 0 && <p className="text-sm text-[var(--foreground)]/50">Aucun avis publié.</p>}
        </div>
      </div>
    </div>
  );
}
